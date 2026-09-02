(function exposeNorthMatch(global) {
    "use strict";

    const { formatMoney, escapeHtml } = global.NorthOffers;

    function money(amount, currency = "PLN") {
        return { amount: Math.round((amount + Number.EPSILON) * 100) / 100, currency };
    }

    function readValue(formData, field) {
        const raw = formData.get(field.id);
        if (raw === null || raw === "") return null;
        if (field.type === "number") {
            const value = Number(raw);
            return Number.isFinite(value) ? value : null;
        }
        if (raw === "true") return true;
        if (raw === "false") return false;
        return raw;
    }

    function isKnown(value) {
        return value !== null && value !== undefined && value !== "unknown";
    }

    function compare(value, test) {
        if (!isKnown(value)) return false;
        const expected = test.value;
        const operations = {
            eq: () => value === expected,
            neq: () => value !== expected,
            gt: () => Number(value) > Number(expected),
            gte: () => Number(value) >= Number(expected),
            lt: () => Number(value) < Number(expected),
            lte: () => Number(value) <= Number(expected),
            in: () => Array.isArray(expected) && expected.includes(value)
        };
        return (operations[test.op || "eq"] || (() => false))();
    }

    function conditionState(condition, values) {
        if (!condition) return true;
        if (condition.all) {
            const states = condition.all.map((item) => conditionState(item, values));
            if (states.includes(false)) return false;
            return states.includes(null) ? null : true;
        }
        if (condition.any) {
            const states = condition.any.map((item) => conditionState(item, values));
            if (states.includes(true)) return true;
            return states.includes(null) ? null : false;
        }
        if (condition.not) {
            const state = conditionState(condition.not, values);
            return state === null ? null : !state;
        }
        if (!isKnown(values[condition.field])) return null;
        return compare(values[condition.field], condition);
    }

    function conditionMet(condition, values) {
        return conditionState(condition, values) === true;
    }

    function componentAmount(rule, values, offer) {
        const component = offer.value.rewardComponents.find((item) => item.id === rule.componentId);
        const maximum = component?.advertisedValue?.amount || 0;
        if (rule.formula.type === "fixed") return maximum;
        if (rule.formula.type === "monthlyCappedRate") {
            const spend = Number(values[rule.formula.spendField] || 0);
            const months = Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths);
            return Math.min(spend * rule.formula.rate, rule.formula.monthlyCap) * months;
        }
        if (rule.formula.type === "monthlyFixed") {
            const months = Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths);
            return Math.min(months * rule.formula.amount, maximum || Number.POSITIVE_INFINITY);
        }
        if (rule.formula.type === "insuranceTier") {
            const premium = Number(values[rule.formula.premiumField] || 0);
            const tier = [...rule.formula.tiers].sort((a, b) => b.min - a.min).find((item) => premium >= item.min);
            return Math.min(tier?.amount || 0, maximum);
        }
        if (rule.formula.type === "tieredMonthlyCappedRate") {
            const spend = Number(values[rule.formula.spendField] || 0);
            const months = Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths);
            const tier = rule.formula.tiers.find((item) => conditionMet(item.when, values));
            const rate = tier?.rate ?? rule.formula.defaultRate;
            return Math.min(spend * rate, rule.formula.monthlyCap) * months;
        }
        if (rule.formula.type === "yieldInterest") {
            const principal = Math.max(0, Number(values[rule.formula.balanceField] || 0));
            const customerType = values[rule.formula.customerTypeField];
            const activityMet = values[rule.formula.activityField] === true;
            const profile = offer.yieldOffer?.capitalScenarios?.[customerType];
            if (!profile) return 0;
            const tiers = activityMet ? profile.promotionalTiers : profile.fallbackTiers;
            let remaining = Math.min(principal, offer.yieldOffer.maxEligibleBalance.amount);
            let lowerBound = 0;
            let annualInterest = 0;
            for (const tier of tiers) {
                const upperBound = Math.min(tier.upTo.amount, offer.yieldOffer.maxEligibleBalance.amount);
                const tierPrincipal = Math.max(0, Math.min(remaining, upperBound - lowerBound));
                annualInterest += tierPrincipal * tier.annualRate;
                remaining -= tierPrincipal;
                lowerBound = upperBound;
                if (remaining <= 0) break;
            }
            return annualInterest * offer.yieldOffer.durationDays / 365;
        }
        if (rule.formula.type === "travelWallet") {
            const firstSpend = Number(values[rule.formula.firstTransactionsSpendField] || 0);
            const laterSpend = Number(values[rule.formula.laterTransactionsSpendField] || 0);
            const months = Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths);
            const travelSpend = Number(values[rule.formula.travelSpendField] || 0);
            const expenseCount = Number(values[rule.formula.expenseCountField] || 0);
            const monthlyWallet = Math.min(
                Math.min(firstSpend * rule.formula.firstRate, rule.formula.firstCap) + laterSpend * rule.formula.laterRate,
                rule.formula.monthlyCap
            );
            const wallet = Math.min(monthlyWallet * months, maximum);
            return Math.min(travelSpend * rule.formula.payoutRate, wallet, rule.formula.singlePayoutCap * expenseCount, maximum);
        }
        return 0;
    }

    function costAmount(rule, values) {
        if (!conditionMet(rule.when, values)) return 0;
        if (rule.formula.type === "fixed") return rule.formula.amount;
        if (rule.formula.type === "monthly") {
            const months = Math.max(0, Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths) - (rule.formula.freeMonths || 0));
            const amount = conditionMet(rule.formula.lowerAmountWhen, values) ? rule.formula.lowerAmount : rule.formula.amount;
            return amount * months;
        }
        return 0;
    }

    function formatInput(field, value) {
        if (field.type === "number") return `${new Intl.NumberFormat("pl-PL").format(value)}${field.suffix ? ` ${field.suffix}` : ""}`;
        return field.options?.find((option) => String(option.value) === String(value))?.label || String(value);
    }

    const matchLabels = Object.freeze({
        "FIT": "Dobrze pasuje",
        "CONDITIONAL FIT": "Pasuje, jeśli spełnisz warunki",
        "POOR FIT": "Raczej nie pasuje",
        "CANNOT ASSESS": "Brakuje danych"
    });
    const verdictLabels = Object.freeze({
        "TAKE NOW": "Ma sens teraz",
        "TAKE IF": "Ma sens pod warunkiem",
        "SKIP": "Lepiej odpuścić",
        "NOT ENOUGH DATA": "Najpierw uzupełnij dane"
    });

    function plainResultSummary(result, offer) {
        if (result.match === "CANNOT ASSESS") {
            if (result.gaps?.evidence?.length) return `North nie może potwierdzić wyniku: ${result.gaps.evidence.join("; ")}.`;
            const missing = result.unknowns.length ? result.unknowns.map((item) => item.replace(/\?$/, "")).join("; ") : "odpowiedzi potrzebne do obliczenia wyniku";
            return `Brakuje odpowiedzi użytkownika: ${missing}. Uzupełnij je, aby sprawdzić kwotę i ocenić, czy oferta ma dla Ciebie sens.`;
        }
        if (result.match === "POOR FIT") {
            const reason = result.blockers[0] || "W tym scenariuszu nie ma potwierdzonej użytecznej wartości.";
            return `Ta oferta raczej nie ma dla Ciebie sensu. ${reason}`;
        }
        const buckets = result.valueBuckets || [{ currency: "PLN", usableMin: result.usableMin, usableMax: result.usableMax }];
        const bucketAmount = buckets.map((bucket) => bucket.usableMin === bucket.usableMax
            ? formatMoney(money(bucket.usableMax, bucket.currency))
            : `${formatMoney(money(bucket.usableMin, bucket.currency))}–${formatMoney(money(bucket.usableMax, bucket.currency))}`).join(" + ");
        const amount = result.functionalFit && buckets.every((bucket) => bucket.usableMax === 0)
            ? "wartość funkcjonalną bez arbitralnej wyceny pieniężnej"
            : bucketAmount || "0 zł";
        const mainComponent = result.componentResults
            .filter((item) => item.earned && item.amount > 0)
            .sort((a, b) => b.amount - a.amount)[0];
        const condition = mainComponent?.rule.condition || result.conditions[0] || "Spełnij wszystkie pokazane warunki.";
        const risk = result.blockers[0]
            || mainComponent?.rule.failureReason
            || offer.execution?.failurePoints?.[0]?.consequence
            || "niespełnienie warunku może obniżyć albo wyzerować premię";
        return `Ta oferta może mieć dla Ciebie sens. Możesz faktycznie wykorzystać około ${amount}. Główny warunek: ${condition} Największe ryzyko: ${risk.charAt(0).toLowerCase()}${risk.slice(1)}`;
    }

    function conditionFields(condition, result = new Set()) {
        if (!condition) return result;
        if (condition.field) result.add(condition.field);
        (condition.all || []).forEach((item) => conditionFields(item, result));
        (condition.any || []).forEach((item) => conditionFields(item, result));
        if (condition.not) conditionFields(condition.not, result);
        return result;
    }

    function strictIsoDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
        const [year, month, day] = value.split("-").map(Number);
        const time = Date.UTC(year, month - 1, day);
        const parsed = new Date(time);
        return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day ? time : null;
    }

    function validWindow(window) {
        if (!window || !["FIXED_DATE", "FIXED_DATE_OPEN_ENDED", "ROLLING_PERIOD", "NONE", "UNKNOWN"].includes(window.kind)) return false;
        if (window.kind === "UNKNOWN" || window.kind === "NONE") return true;
        if (window.kind === "ROLLING_PERIOD") return Number(window.period?.value) > 0 && window.period?.unit === "YEARS" && Boolean(window.anchor);
        const from = window.from === null ? null : strictIsoDate(window.from);
        const to = window.to === null ? null : strictIsoDate(window.to);
        if (window.kind === "FIXED_DATE" && (from === null || to === null)) return false;
        if (window.kind === "FIXED_DATE_OPEN_ENDED" && from === null && to === null) return false;
        return !(from !== null && to !== null && from > to);
    }

    function freshnessState(offer, today) {
        if (typeof global.NorthOffers.freshnessFor === "function") return global.NorthOffers.freshnessFor(offer, today);
        if ((offer.evidence?.conflicts || []).length || offer.identity?.edition?.certainty === "conflicting") return { state: "CONFLICTING" };
        if (["draft", "under_verification", "unverified"].includes(offer.identity?.status)) return { state: "UNKNOWN" };
        const verifiedAt = strictIsoDate(offer.identity?.verifiedAt);
        const validFrom = offer.identity?.edition?.validFrom === null ? null : strictIsoDate(offer.identity?.edition?.validFrom);
        const validTo = strictIsoDate(offer.identity?.edition?.validTo);
        const recheckBy = strictIsoDate(offer.evidence?.recheckBy);
        const now = strictIsoDate(today || offer.identity?.verifiedAt);
        if (now === null || verifiedAt === null || recheckBy === null || verifiedAt > now || (validFrom !== null && now < validFrom)) return { state: "UNKNOWN" };
        if (validTo !== null && now > validTo) return { state: "STALE_OR_EXPIRED" };
        if (now > recheckBy) return { state: "RECHECK_DUE" };
        return { state: "CURRENT" };
    }

    function evidenceCapability(offer, kind, context = {}) {
        const freshness = freshnessState(offer, context.today);
        if (freshness.state === "CONFLICTING") return { state: "CONFLICTING", reasons: ["Źródła lub edycje są sprzeczne."] };
        if (["RECHECK_DUE", "STALE_OR_EXPIRED"].includes(freshness.state)) return { state: "STALE", reasons: ["Termin ponownego sprawdzenia minął albo edycja wygasła."] };
        if (freshness.state === "UNKNOWN") return { state: "UNKNOWN", reasons: ["Nie można ustalić aktualności evidence."] };
        if (kind === "freshness") return { state: "CAN_ANSWER", reasons: [] };
        if (kind === "value") {
            const componentIds = context.componentIds || [];
            const requirements = offer.eligibility?.contractV2?.evidenceRequirements;
            if (!requirements) return { state: "EVIDENCE_GAP", reasons: ["Brak klasyfikacji decision-critical dla komponentów wartości."] };
            const critical = new Set(requirements.decisionCriticalComponentIds || []);
            const nonCritical = new Set(requirements.nonCriticalComponentIds || []);
            const unclassified = componentIds.filter((id) => !critical.has(id) && !nonCritical.has(id));
            if (unclassified.length) return { state: "EVIDENCE_GAP", reasons: unclassified.map((id) => `Brak klasyfikacji evidence dla ${id}`) };
            const coverage = offer.evidence?.fieldSources || [];
            const supported = new Set(["direct", "interpreted"]);
            const missing = componentIds.filter((id) => critical.has(id) && !coverage.some((item) => item.fieldPath === `value.rewardComponents[${id}]` && supported.has(item.supportLevel)));
            return missing.length ? { state: "EVIDENCE_GAP", reasons: missing.map((id) => `Brak pokrycia evidence dla ${id}`) } : { state: "CAN_ANSWER", reasons: [] };
        }
        const rules = context.rules || offer.eligibility?.contractV2?.rules || [];
        if (!rules.length) return { state: "UNKNOWN", reasons: ["Oferta nie ma kontraktu eligibility V2."] };
        const sourceIds = new Set((offer.evidence?.sources || []).map((source) => source.id));
        const badWindow = rules.find((rule) => !validWindow(rule.window));
        if (badWindow) return { state: "EVIDENCE_GAP", reasons: [`Niepoprawne okno ${badWindow.id}`] };
        const todayTime = strictIsoDate(context.today);
        const invalidEvidenceDate = rules.find((rule) => {
            const checkedAt = strictIsoDate(rule.evidence?.checkedAt);
            return checkedAt === null || todayTime === null || checkedAt > todayTime;
        });
        if (invalidEvidenceDate) return { state: "EVIDENCE_GAP", reasons: [`Niepoprawna lub przyszła data evidence dla ${invalidEvidenceDate.id}`] };
        const evidenceGap = rules.find((rule) => rule.window.kind === "UNKNOWN" || rule.evidence?.state === "GAP" || !(rule.evidence?.sourceIds || []).every((id) => sourceIds.has(id)));
        if (evidenceGap) return { state: "EVIDENCE_GAP", reasons: [evidenceGap.failureMessage || `Brak evidence dla ${evidenceGap.id}`] };
        const missingInput = rules.find((rule) => rule.userInputField && !isKnown(context.values?.[rule.userInputField]));
        if (missingInput) return { state: "NEEDS_USER_INPUT", reasons: [missingInput.userInputField] };
        return { state: "CAN_ANSWER", reasons: [] };
    }

    function applicableContractRules(offer, values) {
        return (offer.eligibility?.contractV2?.rules || []).filter((rule) => {
            if (rule.appliesWhen && !conditionMet(rule.appliesWhen, values)) return false;
            return rule.scope.componentIds.some((componentId) => {
                const componentRule = offer.match?.componentRules?.find((item) => item.componentId === componentId);
                return componentRule && (!componentRule.includeWhen || conditionMet(componentRule.includeWhen, values));
            });
        });
    }

    function componentEligibility(rule, contractRules, values, capabilityByRule) {
        const scoped = contractRules.filter((item) => item.scope.componentIds.includes(rule.componentId));
        const blocked = scoped.find((item) => capabilityByRule.get(item.id).state !== "CAN_ANSWER");
        if (blocked) return { state: capabilityByRule.get(blocked.id).state, rule: blocked };
        const failed = scoped.find((item) => item.userInputField && values[item.userInputField] === false);
        return failed ? { state: "INELIGIBLE", rule: failed } : { state: "ELIGIBLE", rule: null };
    }

    function decisionRelevantFieldIds(offer, values, componentEligibilityById) {
        const result = new Set();
        const contract = offer.eligibility?.contractV2;
        const blockedStates = ["INELIGIBLE", "EVIDENCE_GAP", "CONFLICTING", "STALE", "UNKNOWN"];
        applicableContractRules(offer, values).forEach((rule) => {
            conditionFields(rule.appliesWhen, result);
            if (rule.userInputField) result.add(rule.userInputField);
        });
        const hasPotentiallyEligibleComponent = (offer.match?.componentRules || []).some((rule) => {
            const relevant = !rule.includeWhen || conditionMet(rule.includeWhen, values);
            return relevant && !blockedStates.includes(componentEligibilityById.get(rule.componentId)?.state);
        });
        (offer.match?.eligibilityRules || []).forEach((rule) => {
            const controlled = [...conditionFields(rule.when)].some((field) => contract?.legacyControlledFields?.includes(field));
            if (!controlled && hasPotentiallyEligibleComponent && conditionState(rule.when, values) !== false) conditionFields(rule.when, result);
        });
        (offer.match?.componentRules || []).forEach((rule) => {
            conditionFields(rule.includeWhen, result);
            if (rule.includeWhen && !conditionMet(rule.includeWhen, values)) return;
            if (blockedStates.includes(componentEligibilityById.get(rule.componentId)?.state)) return;
            conditionFields(rule.when, result);
            if (rule.usabilityFactorField) result.add(rule.usabilityFactorField);
            Object.entries(rule.formula || {}).filter(([key]) => key.endsWith("Field")).forEach(([, field]) => result.add(field));
        });
        (hasPotentiallyEligibleComponent ? offer.match?.costRules || [] : []).forEach((rule) => {
            conditionFields(rule.when, result);
            conditionFields(rule.formula?.lowerAmountWhen, result);
            if (rule.formula?.monthsField) result.add(rule.formula.monthsField);
        });
        return result;
    }

    function evaluateLegacy(offer, values) {
        const config = offer.match;
        const visibleFields = config.fields.filter((field) => !field.showWhen || conditionMet(field.showWhen, values));
        const missing = visibleFields.filter((field) => field.required && !isKnown(values[field.id]));
        const explicitUnknown = visibleFields.filter((field) => values[field.id] === "unknown");
        const reasons = [];
        const blockers = [];
        const conditions = [];
        const unknowns = [...missing, ...explicitUnknown.filter((field) => !missing.includes(field))];

        let disqualified = false;
        let forcedCannotAssess = false;
        for (const rule of config.eligibilityRules) {
            if (!conditionMet(rule.when, values)) continue;
            if (rule.outcome === "disqualified") {
                disqualified = true;
                blockers.push(rule.message);
            } else if (rule.outcome === "cannot_assess") {
                forcedCannotAssess = true;
                unknowns.push({ label: rule.message });
            } else if (rule.outcome === "reason") {
                reasons.push(rule.message);
            } else if (rule.outcome === "condition") {
                conditions.push(rule.message);
            }
        }

        const componentResults = config.componentRules.map((rule) => {
            const component = offer.value.rewardComponents.find((item) => item.id === rule.componentId);
            const relevant = !rule.includeWhen || conditionMet(rule.includeWhen, values);
            if (!relevant) return { rule, relevant, earned: false, amount: 0 };
            const state = conditionState(rule.when, values);
            const hasUnknownDependency = state === null;
            const earned = state === true;
            const amount = earned ? componentAmount(rule, values, offer) : 0;
            let usableMin = amount;
            let usableMax = amount;
            if (earned && rule.usabilityUncertain) usableMin = 0;
            if (earned && Number.isFinite(rule.usableFactor)) {
                usableMin = amount * rule.usableFactor;
                usableMax = usableMin;
            }
            if (earned && rule.usabilityFactorField) {
                const factor = values[rule.usabilityFactorField] === true ? 1 : 0;
                usableMin = amount * factor;
                usableMax = usableMin;
            }
            const usabilityRejected = earned && Boolean(rule.usabilityFactorField) && values[rule.usabilityFactorField] === false;
            if (usabilityRejected) blockers.push(`${component?.label || "Ta nagroda"}: deklarujesz 0 zł użytecznej wartości tej formy nagrody.`);
            if (earned && amount > 0) reasons.push(rule.successReason);
            else if (!hasUnknownDependency && rule.failureReason) blockers.push(rule.failureReason);
            if (earned && rule.condition) conditions.push(rule.condition);
            return { rule, relevant, earned, amount, usableMin, usableMax, hasUnknownDependency, usabilityRejected };
        });

        const calculatedGross = componentResults.reduce((sum, item) => sum + item.amount, 0);
        const costs = config.costRules.map((rule) => ({ rule, amount: costAmount(rule, values) }));
        const calculatedDirectCost = costs.reduce((sum, item) => sum + item.amount, 0);
        costs.filter((item) => item.amount > 0).forEach((item) => blockers.push(item.rule.message));
        const uncertainUsability = componentResults.some((item) => item.earned && item.rule.usabilityUncertain);
        const calculatedUsableMin = componentResults.reduce((sum, item) => sum + (item.usableMin || 0), 0);
        const calculatedUsableMax = componentResults.reduce((sum, item) => sum + (item.usableMax || 0), 0);
        const gross = disqualified ? 0 : calculatedGross;
        const directCost = disqualified ? 0 : calculatedDirectCost;
        const usableMin = disqualified ? 0 : calculatedUsableMin;
        const usableMax = disqualified ? 0 : calculatedUsableMax;
        const netMin = Math.max(0, usableMin - directCost);
        const netMax = Math.max(0, usableMax - directCost);
        const hasMissing = forcedCannotAssess || unknowns.length > 0 || componentResults.some((item) => item.relevant && item.hasUnknownDependency);
        const hasRelevantFailure = componentResults.some((item) => item.relevant && ((!item.earned && !item.hasUnknownDependency) || item.usabilityRejected));
        const earnedRelevant = componentResults.filter((item) => item.relevant && item.earned);

        let match = "CANNOT ASSESS";
        let verdict = "NOT ENOUGH DATA";
        let summary = "Brakuje danych, które mogą zmienić kwalifikację, wartość albo decyzję.";
        if (disqualified) {
            match = "POOR FIT";
            verdict = "SKIP";
            summary = "Potwierdzony warunek wyklucza ten scenariusz z oferty.";
        } else if (!hasMissing) {
            const hasFunctionalValue = earnedRelevant.some((item) => item.rule.functionalOutcome);
            if ((usableMax <= 0 && !hasFunctionalValue) || earnedRelevant.length === 0) {
                match = "POOR FIT";
                verdict = "SKIP";
                summary = "W podanym scenariuszu oferta nie daje użytecznej wartości, która uzasadniałaby nowe obowiązki.";
            } else {
                match = hasRelevantFailure || directCost > 0 || uncertainUsability ? "CONDITIONAL FIT" : "FIT";
                verdict = "TAKE IF";
                summary = match === "FIT"
                    ? "Warunki oferty pasują do zadeklarowanego scenariusza."
                    : "Oferta może mieć sens, ale część wartości lub koszt zależy od wskazanych warunków.";
            }
        }

        const influenced = visibleFields
            .filter((field) => isKnown(values[field.id]))
            .map((field) => `${field.shortLabel || field.label}: ${formatInput(field, values[field.id])}`);

        const result = {
            match,
            verdict,
            summary,
            reasons: disqualified ? [] : [...new Set(reasons)],
            blockers: [...new Set(blockers)],
            conditions: [...new Set(conditions)],
            unknowns: [...new Set(unknowns.map((field) => field.label))],
            influenced,
            gross,
            usableMin,
            usableMax,
            directCost,
            netMin,
            netMax,
            componentResults
        };
        result.functionalFit = componentResults.some((item) => item.earned && item.rule.functionalOutcome);
        result.summary = plainResultSummary(result, offer);
        return result;
    }

    function hardContractFailure(errors) {
        const reasons = errors.length ? errors : ["Nieznany błąd kontraktu."];
        return {
            match: "CANNOT ASSESS",
            verdict: "NOT ENOUGH DATA",
            summary: "Niespójny kontrakt lub generacja danych. North bezpiecznie wstrzymał decyzję.",
            reasons: [], blockers: [], conditions: [], unknowns: [], influenced: [],
            gaps: { userInput: [], evidence: reasons },
            capability: { eligibility: "EVIDENCE_GAP", value: "EVIDENCE_GAP", freshness: "UNKNOWN" },
            decisionRelevantFields: [], gross: null, usableMin: null, usableMax: null, directCost: 0, netMin: null, netMax: null,
            valueBuckets: [], componentResults: [], functionalFit: false
        };
    }

    function evaluate(offer, values, options = {}) {
        if (!global.NorthOffers.sameRuntimeIdentity?.(offer.runtimeIdentity)) {
            return hardContractFailure(["runtime_identity_mismatch"]);
        }
        const contract = offer.eligibility?.contractV2;
        if (!contract) {
            if (offer.runtimeCompatibility?.eligibilityMode !== "legacy") {
                return hardContractFailure(["missing_v2_contract"]);
            }
            const legacy = evaluateLegacy(offer, values);
            legacy.gaps = { userInput: legacy.unknowns, evidence: [] };
            legacy.capability = { eligibility: "UNKNOWN", value: "UNKNOWN", freshness: "UNKNOWN" };
            legacy.decisionRelevantFields = offer.match.fields.filter((field) => field.required).map((field) => field.id);
            legacy.valueBuckets = [{ form: "legacy", currency: "PLN", gross: legacy.gross, usableMin: legacy.usableMin, usableMax: legacy.usableMax, directCost: legacy.directCost, netMin: legacy.netMin, netMax: legacy.netMax }];
            return legacy;
        }

        if (offer.runtimeCompatibility?.eligibilityMode !== "v2") return hardContractFailure(["eligibility_mode_mismatch"]);
        const integrity = global.NorthOffers.contractIntegrity?.(offer, contract);
        if (!integrity?.ok) return hardContractFailure(integrity?.errors || ["contract_integrity_unavailable"]);

        const config = offer.match;
        const today = options.today || global.NorthOffers.warsawIsoDate?.() || new Date().toISOString().slice(0, 10);
        const contractRules = applicableContractRules(offer, values);
        const capabilityByRule = new Map(contractRules.map((rule) => [rule.id, evidenceCapability(offer, "eligibility", { today, values, rules: [rule] })]));
        const componentEligibilityById = new Map(config.componentRules.map((rule) => [rule.componentId, componentEligibility(rule, contractRules, values, capabilityByRule)]));
        const relevantIds = decisionRelevantFieldIds(offer, values, componentEligibilityById);
        const visibleFields = config.fields.filter((field) => (!field.showWhen || conditionMet(field.showWhen, values)) && relevantIds.has(field.id));
        const missing = visibleFields.filter((field) => field.required && !isKnown(values[field.id]));
        const explicitUnknown = visibleFields.filter((field) => values[field.id] === "unknown");
        const reasons = [];
        const blockers = [];
        const conditions = [];
        const unknowns = [...missing, ...explicitUnknown.filter((field) => !missing.includes(field))];
        const evidenceGaps = [];

        contractRules.forEach((rule) => {
            const capability = capabilityByRule.get(rule.id);
            if (["EVIDENCE_GAP", "CONFLICTING", "STALE", "UNKNOWN"].includes(capability.state)) evidenceGaps.push(...capability.reasons);
            else if (capability.state === "NEEDS_USER_INPUT") {
                const field = config.fields.find((item) => item.id === rule.userInputField);
                if (field && !unknowns.includes(field)) unknowns.push(field);
            } else if (values[rule.userInputField] === false) blockers.push(rule.failureMessage);
        });

        let disqualified = false;
        let forcedCannotAssess = evidenceGaps.length > 0;
        for (const rule of config.eligibilityRules) {
            const controlled = [...conditionFields(rule.when)].some((field) => contract.legacyControlledFields?.includes(field));
            if (controlled || !conditionMet(rule.when, values)) continue;
            if (rule.outcome === "disqualified") {
                disqualified = true;
                blockers.push(rule.message);
            } else if (rule.outcome === "cannot_assess") {
                forcedCannotAssess = true;
                evidenceGaps.push(rule.message);
            } else if (rule.outcome === "reason") reasons.push(rule.message);
            else if (rule.outcome === "condition") conditions.push(rule.message);
        }

        const componentResults = config.componentRules.map((rule) => {
            const component = offer.value.rewardComponents.find((item) => item.id === rule.componentId);
            const relevant = !rule.includeWhen || conditionMet(rule.includeWhen, values);
            const eligibility = componentEligibilityById.get(rule.componentId) || { state: "ELIGIBLE" };
            if (!relevant) return { rule, component, relevant, earned: false, amount: 0, eligibilityState: "NOT_RELEVANT" };
            if (eligibility.state !== "ELIGIBLE") {
                if (eligibility.state === "INELIGIBLE" && eligibility.rule?.failureMessage) blockers.push(eligibility.rule.failureMessage);
                return { rule, component, relevant, earned: false, amount: 0, usableMin: 0, usableMax: 0, hasUnknownDependency: ["NEEDS_USER_INPUT"].includes(eligibility.state), eligibilityState: eligibility.state };
            }
            const effectiveValues = { ...values };
            const legacyControlled = new Set(contract.legacyControlledFields || []);
            const bypass = contract.componentBypassFields?.[rule.componentId] || contract.legacyControlledFields || [];
            bypass.filter((field) => legacyControlled.has(field)).forEach((field) => { effectiveValues[field] = true; });
            const state = conditionState(rule.when, effectiveValues);
            const hasUnknownDependency = state === null;
            const earned = state === true;
            const amount = earned ? componentAmount(rule, effectiveValues, offer) : 0;
            let usableMin = amount;
            let usableMax = amount;
            if (earned && rule.usabilityUncertain) usableMin = 0;
            if (earned && Number.isFinite(rule.usableFactor)) usableMin = usableMax = amount * rule.usableFactor;
            if (earned && rule.usabilityFactorField) usableMin = usableMax = amount * (values[rule.usabilityFactorField] === true ? 1 : 0);
            const usabilityRejected = earned && Boolean(rule.usabilityFactorField) && values[rule.usabilityFactorField] === false;
            if (usabilityRejected) blockers.push(`${component?.label || "Ta nagroda"}: deklarujesz zerową użyteczność tej formy nagrody.`);
            if (earned && amount > 0) reasons.push(rule.successReason);
            else if (!hasUnknownDependency && rule.failureReason) blockers.push(rule.failureReason);
            if (earned && rule.condition) conditions.push(rule.condition);
            return { rule, component, relevant, earned, amount, usableMin, usableMax, hasUnknownDependency, usabilityRejected, eligibilityState: "ELIGIBLE" };
        });

        const earnedComponents = componentResults.filter((item) => item.earned && item.amount > 0);
        const valueCapability = evidenceCapability(offer, "value", { today, componentIds: earnedComponents.map((item) => item.rule.componentId) });
        if (["EVIDENCE_GAP", "CONFLICTING", "STALE", "UNKNOWN"].includes(valueCapability.state)) {
            evidenceGaps.push(...valueCapability.reasons);
            forcedCannotAssess = true;
        }
        const costs = config.costRules.map((rule) => ({ rule, amount: costAmount(rule, values) }));
        const directCost = costs.reduce((sum, item) => sum + item.amount, 0);
        costs.filter((item) => item.amount > 0).forEach((item) => blockers.push(item.rule.message));

        const bucketMap = new Map();
        earnedComponents.forEach((item) => {
            const form = item.component?.form || "unknown";
            const currency = item.component?.advertisedValue?.currency || "UNKNOWN";
            const key = `${form}:${currency}`;
            const bucket = bucketMap.get(key) || { form, currency, gross: 0, usableMin: 0, usableMax: 0, directCost: 0, netMin: 0, netMax: 0 };
            bucket.gross += item.amount;
            bucket.usableMin += item.usableMin || 0;
            bucket.usableMax += item.usableMax || 0;
            bucketMap.set(key, bucket);
        });
        let valueBuckets = [...bucketMap.values()];
        if (directCost > 0) {
            let pln = valueBuckets.find((bucket) => bucket.currency === "PLN" && bucket.form === "cash");
            if (!pln) {
                pln = { form: "cash", currency: "PLN", gross: 0, usableMin: 0, usableMax: 0, directCost: 0, netMin: 0, netMax: 0 };
                valueBuckets.push(pln);
            }
            pln.directCost = directCost;
        }
        valueBuckets = valueBuckets.map((bucket) => ({ ...bucket, netMin: Math.max(0, bucket.usableMin - bucket.directCost), netMax: Math.max(0, bucket.usableMax - bucket.directCost) }));
        if (disqualified) valueBuckets = valueBuckets.map((bucket) => ({ ...bucket, gross: 0, usableMin: 0, usableMax: 0, netMin: 0, netMax: 0 }));

        const singleBucket = valueBuckets.length === 1 ? valueBuckets[0] : null;
        const hasMissing = forcedCannotAssess || unknowns.length > 0 || componentResults.some((item) => item.relevant && item.hasUnknownDependency);
        const hasRelevantFailure = componentResults.some((item) => item.relevant && ((!item.earned && !item.hasUnknownDependency && item.eligibilityState === "ELIGIBLE") || item.usabilityRejected));
        const earnedRelevant = componentResults.filter((item) => item.relevant && item.earned);
        const uncertainUsability = componentResults.some((item) => item.earned && item.rule.usabilityUncertain);
        const hasFunctionalValue = earnedRelevant.some((item) => item.rule.functionalOutcome);
        const hasMonetaryValue = valueBuckets.some((bucket) => bucket.usableMax > 0);
        const allRelevantIneligible = componentResults.filter((item) => item.relevant).every((item) => item.eligibilityState === "INELIGIBLE");

        let match = "CANNOT ASSESS";
        let verdict = "NOT ENOUGH DATA";
        let summary = "Brakuje danych, które mogą zmienić kwalifikację, wartość albo decyzję.";
        if (disqualified || (allRelevantIneligible && !hasMissing)) {
            match = "POOR FIT";
            verdict = "SKIP";
            summary = "Potwierdzony warunek wyklucza ten scenariusz z oferty.";
        } else if (!hasMissing) {
            if ((!hasMonetaryValue && !hasFunctionalValue) || earnedRelevant.length === 0) {
                match = "POOR FIT";
                verdict = "SKIP";
                summary = "W podanym scenariuszu oferta nie daje użytecznej wartości, która uzasadniałaby nowe obowiązki.";
            } else {
                match = hasRelevantFailure || directCost > 0 || uncertainUsability || componentResults.some((item) => item.eligibilityState === "INELIGIBLE") ? "CONDITIONAL FIT" : "FIT";
                verdict = "TAKE IF";
                summary = match === "FIT" ? "Warunki oferty pasują do zadeklarowanego scenariusza." : "Oferta może mieć sens, ale część wartości lub koszt zależy od wskazanych warunków.";
            }
        }

        const influenced = visibleFields.filter((field) => isKnown(values[field.id])).map((field) => `${field.shortLabel || field.label}: ${formatInput(field, values[field.id])}`);
        const eligibilityStates = [...capabilityByRule.values()].map((item) => item.state);
        const eligibilityCapability = eligibilityStates.includes("CONFLICTING") ? "CONFLICTING"
            : eligibilityStates.includes("STALE") ? "STALE"
            : eligibilityStates.includes("EVIDENCE_GAP") ? "EVIDENCE_GAP"
            : eligibilityStates.includes("UNKNOWN") ? "UNKNOWN"
            : eligibilityStates.includes("NEEDS_USER_INPUT") ? "NEEDS_USER_INPUT"
            : "CAN_ANSWER";
        const freshnessCapability = evidenceCapability(offer, "freshness", { today });
        const result = {
            match, verdict, summary,
            reasons: disqualified ? [] : [...new Set(reasons)],
            blockers: [...new Set(blockers)],
            conditions: [...new Set(conditions)],
            unknowns: [...new Set(unknowns.map((field) => field.label))],
            gaps: { userInput: [...new Set(unknowns.map((field) => field.id || field.label))], evidence: [...new Set(evidenceGaps)] },
            capability: { eligibility: eligibilityCapability, value: valueCapability.state, freshness: freshnessCapability.state },
            decisionRelevantFields: [...relevantIds],
            influenced,
            gross: singleBucket?.gross ?? null,
            usableMin: singleBucket?.usableMin ?? null,
            usableMax: singleBucket?.usableMax ?? null,
            directCost,
            netMin: singleBucket?.netMin ?? null,
            netMax: singleBucket?.netMax ?? null,
            valueBuckets,
            componentResults
        };
        result.functionalFit = componentResults.some((item) => item.earned && item.rule.functionalOutcome);
        result.summary = plainResultSummary(result, offer);
        return result;
    }

    function fieldHtml(field) {
        const describedBy = field.help ? `match-${field.id}-help` : "";
        if (field.type === "number") {
            return `<div class="match-field" data-match-field="${escapeHtml(field.id)}"><label for="match-${escapeHtml(field.id)}">${escapeHtml(field.label)}</label>${field.help ? `<p id="${describedBy}">${escapeHtml(field.help)}</p>` : ""}<div class="match-number"><input id="match-${escapeHtml(field.id)}" name="${escapeHtml(field.id)}" type="number" min="${field.min ?? 0}" ${field.max !== undefined ? `max="${field.max}"` : ""} ${field.step ? `step="${field.step}"` : "step=\"1\""} ${describedBy ? `aria-describedby="${describedBy}"` : ""}><span>${escapeHtml(field.suffix || "")}</span></div></div>`;
        }
        return `<fieldset class="match-field" data-match-field="${escapeHtml(field.id)}"><legend>${escapeHtml(field.label)}</legend>${field.help ? `<p id="${describedBy}">${escapeHtml(field.help)}</p>` : ""}<div class="match-options">${field.options.map((option) => `<label><input type="radio" name="${escapeHtml(field.id)}" value="${escapeHtml(option.value)}" ${describedBy ? `aria-describedby="${describedBy}"` : ""}><span>${escapeHtml(option.label)}</span></label>`).join("")}</div></fieldset>`;
    }

    function resultList(title, items, symbol, className) {
        const content = items.length ? items : [className === "match-reasons" ? "Brak potwierdzonych powodów na plus." : className === "match-unknowns" ? "Wszystkie wymagane dane zostały podane." : "Brak dodatkowych punktów w tej grupie."];
        return `<div class="${className}"><h4>${title}</h4><ul>${content.map((item) => `<li><span aria-hidden="true">${symbol}</span>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
    }

    function renderResult(container, result, offer) {
        const range = (min, max) => min === max ? formatMoney(money(min)) : `${formatMoney(money(min))}–${formatMoney(money(max))}`;
        const unavailable = result.match === "CANNOT ASSESS" ? "Brak danych" : null;
        const displayBuckets = result.valueBuckets.length ? result.valueBuckets : [{ form: "cash", currency: "PLN", gross: 0, usableMin: 0, usableMax: 0, netMin: 0, netMax: 0 }];
        const bucketDisplay = (field, rangeFieldMin, rangeFieldMax) => displayBuckets.map((bucket) => {
            if (field) return `${escapeHtml(bucket.form)}: ${formatMoney(money(bucket[field], bucket.currency))}`;
            const min = bucket[rangeFieldMin];
            const max = bucket[rangeFieldMax];
            const value = min === max ? formatMoney(money(min, bucket.currency)) : `${formatMoney(money(min, bucket.currency))}–${formatMoney(money(max, bucket.currency))}`;
            return `${escapeHtml(bucket.form)}: ${value}`;
        }).join(" + ");
        const grossDisplay = result.functionalFit && displayBuckets.every((bucket) => bucket.gross === 0) ? "Wartość funkcjonalna" : bucketDisplay("gross");
        const usableDisplay = result.functionalFit && displayBuckets.every((bucket) => bucket.usableMax === 0) ? "Zależy od użycia" : bucketDisplay(null, "usableMin", "usableMax");
        const netDisplay = result.functionalFit && displayBuckets.every((bucket) => bucket.netMax === 0) ? "Bez arbitralnej wyceny" : bucketDisplay(null, "netMin", "netMax");
        const unresolved = [...result.unknowns, ...(result.gaps?.evidence || []).map((item) => `Luka evidence: ${item}`)];
        container.innerHTML = `<div class="match-result-head"><div><span>${global.NorthGlossary.label("northMatch")}</span><strong class="match-band match-band--${result.match.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(matchLabels[result.match])}</strong><small>${escapeHtml(result.match)}</small></div><div><span>${global.NorthGlossary.label("verdict")}</span><strong class="match-verdict">${escapeHtml(verdictLabels[result.verdict])}</strong><small>${escapeHtml(result.verdict)}</small></div></div><p class="match-summary">${escapeHtml(result.summary)}</p><dl class="match-values"><div><dt>${global.NorthGlossary.label("yourLikelyValue")}</dt><dd>${unavailable || grossDisplay}</dd></div><div><dt>${global.NorthGlossary.label("expectedUsableValue")}</dt><dd>${unavailable || usableDisplay}</dd></div><div><dt>${global.NorthGlossary.label("netScenarioValue")}</dt><dd>${unavailable || netDisplay}</dd></div><div><dt>Potwierdzony koszt</dt><dd>${unavailable || formatMoney(money(result.directCost))}</dd></div></dl><div class="match-explanation"><h3>Dlaczego ten wynik?</h3>${resultList("Co pasuje", result.reasons, "✓", "match-reasons")}${resultList("Co nie pasuje lub blokuje", result.blockers, "×", "match-blockers")}${resultList("Warunki", result.conditions, "→", "match-conditions")}${resultList("Brakujące dane", unresolved, "?", "match-unknowns")}</div><details class="match-input-summary"><summary>Dane, które wpłynęły na wynik</summary><ul>${result.influenced.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details><p class="match-local-note">Odpowiedzi są przetwarzane tylko na tym urządzeniu. North ich nie wysyła ani nie zapisuje profilu.</p><p class="match-method-note">Dopasowanie mówi, jak dobrze warunki pasują do Twojej sytuacji. Ocena sensu oferty mówi, co zrobić w tym scenariuszu. Maksimum z reklamy to ${escapeHtml(offer.value.advertisedMax.displayLabel)}.</p>`;
        global.NorthGlossary.init(container);
    }

    function mount(root, offer) {
        if (!offer.match) return;
        const core = offer.match.fields.filter((field) => field.stage === 1);
        const additional = offer.match.fields.filter((field) => field.stage === 2);
        root.innerHTML = `<section class="offer-section north-match-section" id="match" aria-labelledby="match-title"><div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> ${global.NorthGlossary.label("northMatch")}</p><h2 id="match-title">Sprawdź tę ofertę dla siebie</h2></div><p>Odpowiedz tylko na pytania, które zmieniają wynik. Nie podawaj imienia, PESEL-u ani danych bankowych.</p></div><div class="match-layout"><form class="match-form" novalidate><fieldset class="match-step"><legend><span>Etap 1</span> Najważniejsze dane</legend>${core.map(fieldHtml).join("")}<button class="north-button match-next" type="button">Przejdź do pytań dodatkowych <span aria-hidden="true">→</span></button><p class="match-form-error" role="status" hidden>Brakuje części odpowiedzi. Możesz przejść dalej — wynik wskaże, co trzeba uzupełnić.</p></fieldset><fieldset class="match-step match-step--additional" hidden><legend><span>Etap 2</span> Tylko warunki tej oferty</legend>${additional.map(fieldHtml).join("")}<button class="north-button" type="submit">Sprawdź kwotę i sens oferty</button><button class="match-reset" type="reset">Wyczyść odpowiedzi</button><p class="match-form-error" role="status" hidden>Brakuje części odpowiedzi. Wynik wskaże braki zamiast je zgadywać.</p></fieldset></form><aside class="match-result" aria-label="Wynik dopasowania oferty" aria-live="polite" aria-atomic="false"><div class="match-empty"><span>${global.NorthGlossary.label("northMatch")}</span><h3>Konkretny wynik bez procentów</h3><p>Po odpowiedzi zobaczysz, czy oferta pasuje, ile możesz dostać, jakie są koszty i co może pójść nie tak.</p></div></aside></div></section>`;
        global.NorthGlossary.init(root);

        const form = root.querySelector(".match-form");
        const additionalStep = root.querySelector(".match-step--additional");
        const resultContainer = root.querySelector(".match-result");
        const next = root.querySelector(".match-next");

        function valuesFromForm() {
            const data = new FormData(form);
            return Object.fromEntries(offer.match.fields.map((field) => [field.id, readValue(data, field)]));
        }

        function relevantIdsFor(values) {
            if (!offer.eligibility?.contractV2) return new Set(offer.match.fields.filter((field) => field.required).map((field) => field.id));
            const rules = applicableContractRules(offer, values);
            const capabilities = new Map(rules.map((rule) => [rule.id, evidenceCapability(offer, "eligibility", { today: global.NorthOffers.warsawIsoDate?.(), values, rules: [rule] })]));
            const byComponent = new Map(offer.match.componentRules.map((rule) => [rule.componentId, componentEligibility(rule, rules, values, capabilities)]));
            return decisionRelevantFieldIds(offer, values, byComponent);
        }

        function updateVisibility() {
            const values = valuesFromForm();
            const relevantIds = relevantIdsFor(values);
            offer.match.fields.forEach((field) => {
                const wrapper = form.querySelector(`[data-match-field="${CSS.escape(field.id)}"]`);
                const visible = relevantIds.has(field.id) && (!field.showWhen || conditionMet(field.showWhen, values));
                wrapper.hidden = !visible;
                wrapper.querySelectorAll("input").forEach((input) => { input.disabled = !visible; });
            });
        }

        function markMissing(step) {
            updateVisibility();
            const values = valuesFromForm();
            const relevantIds = relevantIdsFor(values);
            const missingField = offer.match.fields.find((field) => field.required && relevantIds.has(field.id) && step.querySelector(`[data-match-field="${CSS.escape(field.id)}"]:not([hidden])`) && !isKnown(values[field.id]));
            const error = step.querySelector(".match-form-error");
            error.hidden = !missingField;
            return missingField;
        }

        function clearResolvedErrors() {
            const values = valuesFromForm();
            const relevantIds = relevantIdsFor(values);
            form.querySelectorAll(".match-step").forEach((step) => {
                const error = step.querySelector(".match-form-error");
                if (!error || error.hidden) return;
                const stillMissing = offer.match.fields.some((field) => field.required && relevantIds.has(field.id) && step.querySelector(`[data-match-field="${CSS.escape(field.id)}"]:not([hidden])`) && !isKnown(values[field.id]));
                if (!stillMissing) error.hidden = true;
            });
        }

        next.addEventListener("click", () => {
            const step = next.closest("fieldset");
            markMissing(step);
            additionalStep.hidden = false;
            updateVisibility();
            additionalStep.querySelector("input:enabled")?.focus();
        });
        form.addEventListener("change", () => { updateVisibility(); clearResolvedErrors(); });
        form.addEventListener("input", () => { updateVisibility(); clearResolvedErrors(); });
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            markMissing(additionalStep);
            const values = valuesFromForm();
            renderResult(resultContainer, evaluate(offer, values), offer);
            resultContainer.focus();
        });
        form.addEventListener("reset", () => {
            global.setTimeout(() => {
                additionalStep.hidden = true;
                updateVisibility();
                resultContainer.innerHTML = `<div class="match-empty"><span>${global.NorthGlossary.label("northMatch")}</span><h3>Konkretny wynik bez procentów</h3><p>Po odpowiedzi zobaczysz, czy oferta pasuje, ile możesz dostać, jakie są koszty i co może pójść nie tak.</p></div>`;
                global.NorthGlossary.init(resultContainer);
                next.focus();
            });
        });
        resultContainer.tabIndex = -1;
        updateVisibility();
    }

    global.NorthMatch = { mount, evaluate, evaluateLegacy, conditionMet, evidenceCapability, decisionRelevantFieldIds, validWindow };
}(window));
