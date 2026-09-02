/*
 * Thin data adapter for the Decision Model UI.
 * All offer facts live in decision-offers.json; this file only loads and formats them.
 */
(function exposeNorthOffers(global) {
    "use strict";

    const RUNTIME_IDENTITY = Object.freeze({
        buildId: "north-static-2026-09-02-r2",
        decisionSchema: "decision-model-v1",
        eligibilitySchema: "north-eligibility-v2",
        loaderApi: "north-loader-v2",
        matchApi: "north-match-v2"
    });
    let dataPromise;

    function cacheBustedUrl(url) {
        const separator = url.includes("?") ? "&" : "?";
        return url + separator + "v=" + encodeURIComponent(RUNTIME_IDENTITY.buildId);
    }

    function sameRuntimeIdentity(identity) {
        return identity && Object.entries(RUNTIME_IDENTITY).every(([key, value]) => identity[key] === value);
    }

    function locatorReference(locator) {
        if (!locator || typeof locator.type !== "string" || typeof locator.value !== "string" || !locator.value.trim()) return null;
        const labels = {
            clause: "Klauzula",
            section_page_heading: "Sekcja / nagłówek / strona",
            title_page_and_section: "Tożsamość dokumentu / sekcja"
        };
        return `${labels[locator.type] || locator.type}: ${locator.value}`;
    }

    function validateCondition(condition, fields, errors, path) {
        if (!condition) return;
        if (condition.field && !fields.has(condition.field)) errors.push("unknown_match_field:" + path + ":" + condition.field);
        (condition.all || []).forEach((item, index) => validateCondition(item, fields, errors, path + ".all[" + index + "]"));
        (condition.any || []).forEach((item, index) => validateCondition(item, fields, errors, path + ".any[" + index + "]"));
        if (condition.not) validateCondition(condition.not, fields, errors, path + ".not");
    }

    function validateFormulaFields(formula, fields, errors, path) {
        Object.entries(formula || {}).forEach(([key, value]) => {
            if (key.endsWith("Field") && (typeof value !== "string" || !fields.has(value))) {
                errors.push("unknown_formula_field:" + path + "." + key + ":" + (value || "missing"));
            }
        });
        (formula?.tiers || []).forEach((tier, index) => validateCondition(tier.when, fields, errors, path + ".tiers[" + index + "].when"));
        validateCondition(formula?.lowerAmountWhen, fields, errors, path + ".lowerAmountWhen");
    }

    function contractIntegrity(offer, contract) {
        const errors = [];
        if (!offer || !contract) return { ok: false, errors: ["missing_offer_or_contract"] };
        const offerId = offer.identity?.id;
        const provider = offer.identity?.provider;
        const components = new Set((offer.value?.rewardComponents || []).map((component) => component.id));
        const sources = new Set((offer.evidence?.sources || []).map((source) => source.id));
        const promotions = new Map((offer.promotionVariants || []).map((promotion) => [promotion.id, promotion]));
        const matchFields = [...(offer.match?.fields || []), ...(contract.fields || [])];
        const fields = new Set([...matchFields.map((field) => field.id), ...(contract.legacyControlledFields || [])]);
        const ruleIds = new Set();
        const critical = new Set(contract.evidenceRequirements?.decisionCriticalComponentIds || []);
        const nonCritical = new Set(contract.evidenceRequirements?.nonCriticalComponentIds || []);
        const classified = new Set([...critical, ...nonCritical]);

        if (contract.offerId !== offerId) errors.push("contract_target_mismatch:" + (contract.offerId || "missing"));
        if (contract.provider !== provider) errors.push("provider_mismatch:" + (contract.provider || "missing"));

        (contract.rules || []).forEach((rule) => {
            if (!rule.id || ruleIds.has(rule.id)) errors.push("duplicate_or_missing_rule_id:" + (rule.id || "missing"));
            ruleIds.add(rule.id);
            if (rule.scope?.offerId !== offerId) errors.push("rule_offer_mismatch:" + rule.id);
            if (rule.scope?.provider !== provider) errors.push("rule_provider_mismatch:" + rule.id);
            const promotion = promotions.get(rule.scope?.promotionId);
            if (!promotion) errors.push("unknown_promotion_id:" + rule.id + ":" + (rule.scope?.promotionId || "missing"));
            const promotionComponents = new Set(promotion?.rewardComponents || []);
            const promotionSources = new Set(promotion?.sourceRefs || []);
            (rule.scope?.componentIds || []).forEach((componentId) => {
                if (!components.has(componentId)) errors.push("missing_component_id:" + rule.id + ":" + componentId);
                else if (promotion && !promotionComponents.has(componentId)) errors.push("component_promotion_mismatch:" + rule.id + ":" + componentId);
            });
            (rule.evidence?.sourceIds || []).forEach((sourceId) => {
                if (!sources.has(sourceId)) errors.push("unknown_source_id:" + rule.id + ":" + sourceId);
                else if (promotion && !promotionSources.has(sourceId)) errors.push("source_promotion_mismatch:" + rule.id + ":" + sourceId);
            });
            if (rule.userInputField !== null && !fields.has(rule.userInputField)) errors.push("unknown_contract_field:" + rule.id + ":" + rule.userInputField);
            validateCondition(rule.appliesWhen, fields, errors, "contract.rules." + rule.id + ".appliesWhen");
            const locator = locatorReference(rule.evidence?.locator);
            const reference = locator || "Brak potwierdzonego locatora";
            if (rule.evidence?.state === "SUPPORTED" && !locator) errors.push("missing_supported_locator:" + rule.id);
            if (rule.evidence?.reference && rule.evidence.reference !== reference) errors.push("locator_reference_mismatch:" + rule.id);
        });

        const componentRuleIds = new Set();
        (offer.match?.componentRules || []).forEach((rule, index) => {
            const path = "match.componentRules[" + index + "]";
            if (!components.has(rule.componentId)) errors.push("match_unknown_component:" + path + ":" + (rule.componentId || "missing"));
            if (componentRuleIds.has(rule.componentId)) errors.push("match_duplicate_component:" + rule.componentId);
            componentRuleIds.add(rule.componentId);
            if (!classified.has(rule.componentId) || critical.has(rule.componentId) === nonCritical.has(rule.componentId)) errors.push("match_unclassified_component:" + (rule.componentId || "missing"));
            validateCondition(rule.when, fields, errors, path + ".when");
            validateCondition(rule.includeWhen, fields, errors, path + ".includeWhen");
            if (rule.usabilityFactorField && !fields.has(rule.usabilityFactorField)) errors.push("unknown_match_field:" + path + ".usabilityFactorField:" + rule.usabilityFactorField);
            validateFormulaFields(rule.formula, fields, errors, path + ".formula");
        });
        critical.forEach((componentId) => {
            if (!components.has(componentId)) errors.push("unknown_critical_component:" + componentId);
            if (!componentRuleIds.has(componentId)) errors.push("missing_critical_component_rule:" + componentId);
        });
        nonCritical.forEach((componentId) => {
            if (!components.has(componentId)) errors.push("unknown_noncritical_component:" + componentId);
        });
        matchFields.forEach((field, index) => validateCondition(field.showWhen, fields, errors, "match.fields[" + index + "].showWhen"));
        (offer.match?.eligibilityRules || []).forEach((rule, index) => validateCondition(rule.when, fields, errors, "match.eligibilityRules[" + index + "].when"));
        (offer.match?.costRules || []).forEach((rule, index) => {
            const path = "match.costRules[" + index + "]";
            validateCondition(rule.when, fields, errors, path + ".when");
            validateFormulaFields(rule.formula, fields, errors, path + ".formula");
        });

        const legacyFields = new Set(contract.legacyControlledFields || []);
        Object.entries(contract.componentBypassFields || {}).forEach(([componentId, bypassFields]) => {
            if (!components.has(componentId) || !componentRuleIds.has(componentId)) errors.push("bypass_unknown_component:" + componentId);
            (bypassFields || []).forEach((fieldId) => {
                if (!legacyFields.has(fieldId)) errors.push("bypass_non_legacy_field:" + componentId + ":" + fieldId);
            });
        });

        (offer.evidence?.conflicts || []).forEach((conflict) => {
            if (!conflict.description || !conflict.resolutionStatus) errors.push("invalid_conflict_schema:" + (conflict.id || "missing"));
            if (conflict.message) errors.push("legacy_conflict_schema:" + (conflict.id || "missing"));
        });

        return { ok: errors.length === 0, errors };
    }

    function contractEvidenceState(offer) {
        const contract = offer?.eligibility?.contractV2;
        if (!contract) return "UNKNOWN";
        if (!contractIntegrity(offer, contract).ok) return "EVIDENCE_GAP";
        const sources = new Map((offer.evidence?.sources || []).map((source) => [source.id, source]));
        const gap = (contract.rules || []).some((rule) =>
            rule.evidence?.state !== "SUPPORTED" ||
            (rule.evidence?.sourceIds || []).some((sourceId) => {
                const source = sources.get(sourceId);
                return !source || source.status === "edition_drift" || source.documentIdentity?.currentUrlMatchesExpected === false;
            })
        );
        return gap ? "EVIDENCE_GAP" : "SUPPORTED";
    }

    function eligibilitySummary(offer) {
        const contract = offer?.eligibility?.contractV2;
        if (!contract) return offer?.eligibility?.newCustomer?.definition || "Brak zweryfikowanej reguły kwalifikacji.";
        if (contract.summary) return contract.summary;
        const summaries = [...new Set((contract.rules || []).map((rule) => rule.summary).filter(Boolean))];
        return summaries.length ? summaries.join(" ") : "Kwalifikacja zależy od wariantu promocji; sprawdź pytania scenariusza.";
    }

    function editionDriftSources(offer) {
        return (offer?.evidence?.sources || []).filter((source) => source.status === "edition_drift" || source.documentIdentity?.currentUrlMatchesExpected === false);
    }

    function evidencePresentation(item, source) {
        const drift = source && (source.status === "edition_drift" || source.documentIdentity?.currentUrlMatchesExpected === false);
        if (drift) {
            const expected = source.documentIdentity?.expected || "historyczny dokument";
            const observed = source.documentIdentity?.observedAtCurrentUrl || "inny dokument";
            return {
                supportLevel: "conflicting",
                reference: `Źródło pod zapisanym URL-em zostało zmienione: rekord opisuje „${expected}”, a obecnie URL serwuje „${observed}”. Ta referencja wymaga ponownej weryfikacji.`,
                checkedAt: source.lastUrlCheckAt || item.checkedAt,
                uncertaintyNote: "North nie uznaje historycznego claimu za potwierdzony przez dokument obecnie dostępny pod tym URL-em."
            };
        }
        return {
            supportLevel: item.supportLevel || (item.state === "SUPPORTED" ? "direct" : "missing"),
            reference: locatorReference(item.locator) || item.reference || "Brak potwierdzonego locatora",
            checkedAt: item.checkedAt,
            uncertaintyNote: item.uncertaintyNote || null
        };
    }

    function editionSurface(offer) {
        const drift = editionDriftSources(offer);
        if (!drift.length) return {
            conflicting: false,
            reviewLabel: `review ${formatDate(offer.identity?.verifiedAt)}`,
            editionLabel: `Edycja: ${offer.identity?.edition?.name || "Brak danych"}`,
            explanation: null
        };
        const changes = drift.map((source) => `${source.documentIdentity?.expected || "historyczny dokument"} → ${source.documentIdentity?.observedAtCurrentUrl || "inna edycja"}`).join("; ");
        return {
            conflicting: true,
            reviewLabel: "evidence wymaga ponownej weryfikacji",
            editionLabel: `Historyczna edycja w rekordzie: ${offer.identity?.edition?.name || "Brak danych"}`,
            explanation: `Źródło pod zapisanym URL-em zostało zmienione (${changes}). North nie zna jeszcze wyniku dla nowej edycji.`
        };
    }

    function load(url) {
        if (!dataPromise) {
            const eligibilityUrl = url.replace(/decision-offers\.json(?:\?.*)?$/, "eligibility-v2.json");
            dataPromise = Promise.all([
                fetch(cacheBustedUrl(url), { cache: "no-store" }),
                fetch(cacheBustedUrl(eligibilityUrl), { cache: "no-store" })
            ]).then(async ([offersResponse, eligibilityResponse]) => {
                if (!offersResponse.ok) throw new Error(`Nie udało się wczytać danych ofert (${offersResponse.status}).`);
                if (!eligibilityResponse.ok) throw new Error(`Nie udało się wczytać kontraktu kwalifikacji (${eligibilityResponse.status}).`);
                const [data, eligibilityV2] = await Promise.all([offersResponse.json(), eligibilityResponse.json()]);
                if (!sameRuntimeIdentity(data.runtimeIdentity) || !sameRuntimeIdentity(eligibilityV2.runtimeIdentity)) {
                    throw new Error("Niezgodna generacja danych North. Odśwież stronę; decyzja została bezpiecznie zablokowana.");
                }
                if (data.schemaVersion !== RUNTIME_IDENTITY.decisionSchema || eligibilityV2.schemaVersion !== RUNTIME_IDENTITY.eligibilitySchema) {
                    throw new Error("Niezgodny kontrakt danych North. Decyzja została bezpiecznie zablokowana.");
                }
                data.offers.forEach((offer) => {
                    const contract = eligibilityV2.offers[offer.identity.id];
                    offer.runtimeIdentity = data.runtimeIdentity;
                    offer.runtimeCompatibility = { eligibilityMode: contract ? "v2" : "legacy" };
                    if (!contract) return;
                    const integrity = contractIntegrity(offer, contract);
                    if (!integrity.ok) throw new Error("Niespójny kontrakt " + offer.identity.id + ": " + integrity.errors.join(", "));
                    contract.rules.forEach((rule) => {
                        rule.evidence.reference = locatorReference(rule.evidence.locator) || "Brak potwierdzonego locatora";
                    });
                    offer.eligibility.contractV2 = contract;
                    const replacements = new Set(contract.fieldReplacements || []);
                    offer.match.fields = offer.match.fields
                        .filter((field) => !replacements.has(field.id))
                        .map((field) => ({ ...field, ...(contract.fieldOverrides?.[field.id] || {}) }))
                        .concat(contract.fields || []);
                });
                data.eligibilityV2 = {
                    schemaVersion: eligibilityV2.schemaVersion,
                    windowKinds: eligibilityV2.windowKinds,
                    capabilityStates: eligibilityV2.capabilityStates,
                    runtimeIdentity: eligibilityV2.runtimeIdentity
                };
                data.runtimeCompatibility = { ok: true, identity: RUNTIME_IDENTITY };
                return data;
            });
        }
        return dataPromise;
    }

    function formatMoney(money) {
        if (!money || typeof money.amount !== "number") return "Brak danych";
        const currency = money.currency || "PLN";
        const decimals = Number.isInteger(money.amount) ? 0 : 2;
        const sign = money.amount < 0 ? "−" : "";
        const [integer, fraction] = Math.abs(money.amount).toFixed(decimals).split(".");
        const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
        const amount = `${sign}${grouped}${fraction ? `,${fraction}` : ""}`;
        const currencyLabel = currency === "PLN" ? "zł" : currency;
        return `${amount}\u00a0${currencyLabel}`;
    }

    function formatValue(value) {
        if (!value) return "Wymaga danych scenariusza";
        if (typeof value.amount === "number") return formatMoney(value);
        if (value.min && value.max) return `${formatMoney(value.min)}–${formatMoney(value.max)}`;
        return "Wymaga danych scenariusza";
    }

    function formatDate(value) {
        if (!value) return "Brak daty";
        const [year, month, day] = value.split("-").map(Number);
        return new Intl.DateTimeFormat("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(new Date(Date.UTC(year, month - 1, day)));
    }

    function warsawIsoDate(date = new Date()) {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Europe/Warsaw",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(date);
        const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
        return `${value.year}-${value.month}-${value.day}`;
    }

    function parseIsoDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
        const [year, month, day] = value.split("-").map(Number);
        const time = Date.UTC(year, month - 1, day);
        const parsed = new Date(time);
        return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
            ? time
            : null;
    }

    function freshnessAt(offer, today) {
        const status = offer?.identity?.status;
        const verifiedAt = offer?.identity?.verifiedAt;
        const validFrom = offer?.identity?.edition?.validFrom;
        const validTo = offer?.identity?.edition?.validTo;
        const recheckBy = offer?.evidence?.recheckBy;
        const hasEvidence = Array.isArray(offer?.evidence?.sources) && offer.evidence.sources.length > 0;
        const conflicts = Array.isArray(offer?.evidence?.conflicts) ? offer.evidence.conflicts : [];
        const todayTime = parseIsoDate(today);
        const verifiedTime = parseIsoDate(verifiedAt);
        const validFromTime = validFrom === null || validFrom === undefined ? null : parseIsoDate(validFrom);
        const validToTime = validTo === null || validTo === undefined ? null : parseIsoDate(validTo);
        const recheckTime = parseIsoDate(recheckBy);

        if (todayTime === null || verifiedTime === null || !hasEvidence || recheckTime === null) {
            return {
                state: "UNKNOWN",
                label: "UNKNOWN",
                explanation: "Nie da się potwierdzić aktualności: brakuje poprawnej daty review, terminu rechecku albo oficjalnego evidence."
            };
        }

        if (verifiedTime > todayTime || (validFromTime !== null && todayTime < validFromTime)) {
            return {
                state: "UNKNOWN",
                label: "UNKNOWN",
                explanation: "Edycja jeszcze się nie rozpoczęła albo data review wyprzedza zegar runtime. North nie uznaje jej za bieżącą."
            };
        }

        if ((validFrom && validFromTime === null) || (validTo && validToTime === null) || (validFromTime !== null && validToTime !== null && validFromTime > validToTime)) {
            return {
                state: "UNKNOWN",
                label: "UNKNOWN",
                explanation: "Okno edycji ma brakującą lub niespójną datę. North nie uznaje takiego rekordu za aktualny."
            };
        }

        if (conflicts.length > 0 || offer?.identity?.edition?.certainty === "conflicting") {
            return {
                state: "CONFLICTING",
                label: "CONFLICTING",
                explanation: "Oficjalne źródła albo zapis edycji są sprzeczne. Wymagane jest rozstrzygnięcie evidence."
            };
        }

        if (["expired", "withdrawn"].includes(status) || (validToTime !== null && todayTime > validToTime)) {
            return {
                state: "STALE_OR_EXPIRED",
                label: "STALE OR EXPIRED",
                explanation: validTo
                    ? `Okno wejścia zakończyło się ${formatDate(validTo)}. Sprawdź, czy istnieje nowa edycja.`
                    : "Oferta została oznaczona jako zakończona."
            };
        }

        if (["draft", "under_verification", "unverified"].includes(status)) {
            return {
                state: "UNKNOWN",
                label: "UNKNOWN",
                explanation: "Brakuje pełnej ręcznej weryfikacji bieżącej edycji lub jej oficjalnych źródeł."
            };
        }

        const daysToRecheck = Math.round((recheckTime - todayTime) / 86400000);
        if (daysToRecheck < 0) {
            return {
                state: "RECHECK_DUE",
                label: "RECHECK DUE",
                explanation: `Termin ręcznego sprawdzenia minął ${formatDate(recheckBy)}. Dane nie są automatycznie uznawane za aktualne.`
            };
        }

        if (daysToRecheck <= 7) {
            return {
                state: "RECHECK_SOON",
                label: "RECHECK SOON",
                explanation: `Ręcznie sprawdzono ${formatDate(verifiedAt)}; kolejny recheck przypada ${formatDate(recheckBy)}.`
            };
        }

        return {
            state: "CURRENT",
            label: "CURRENT",
            explanation: `Ręcznie sprawdzono ${formatDate(verifiedAt)}; kolejny recheck zaplanowano do ${formatDate(recheckBy)}.`
        };
    }

    function freshnessFor(offer, today) {
        return freshnessAt(offer, today || warsawIsoDate());
    }

    function effectiveConfidenceBand(offer, today = warsawIsoDate()) {
        const freshness = freshnessFor(offer, today);
        if (!["CURRENT", "RECHECK_SOON"].includes(freshness.state)) return "UNKNOWN";
        if (offer?.eligibility?.contractV2 && contractEvidenceState(offer) !== "SUPPORTED") return "UNKNOWN";
        return offer?.decision?.northConfidence?.band || "UNKNOWN";
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    global.NorthOffers = {
        load,
        formatMoney,
        formatValue,
        formatDate,
        warsawIsoDate,
        freshnessFor,
        effectiveConfidenceBand,
        eligibilitySummary,
        contractIntegrity,
        contractEvidenceState,
        sameRuntimeIdentity,
        locatorReference,
        evidencePresentation,
        editionSurface,
        runtimeIdentity: RUNTIME_IDENTITY,
        escapeHtml
    };
}(window));
