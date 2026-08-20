#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SECTION_ORDER = [
    "Structure",
    "IDs",
    "References",
    "Values",
    "Confidence & Verdict",
    "Landing",
    "Freshness"
];

const REQUIRED_OFFER_SECTIONS = [
    "identity",
    "value",
    "eligibility",
    "execution",
    "cost",
    "decision",
    "evidence",
    "listing",
    "affiliate"
];

const IDENTITY_STATUSES = new Set(["draft", "under_verification", "active", "closing", "expired", "withdrawn"]);
const EDITION_CERTAINTIES = new Set(["confirmed", "ambiguous", "unknown", "personalized"]);
const CONFIDENCE_BANDS = new Set(["LOW", "MEDIUM", "HIGH"]);
const VERDICT_STATES = new Set(["TAKE NOW", "TAKE IF", "SKIP", "NOT ENOUGH DATA"]);
const LANDING_DEMO_STATUSES = new Set(["verified", "structure_only", "blocked"]);
const OPPORTUNITY_STATUSES = new Set(["ready_for_implementation"]);
const REVIEW_DATE_FIELDS = new Set(["reviewedAt", "verifiedAt", "assessedAt", "checkedAt", "accessedAt", "calculatedAt"]);
const DATE_FIELDS = new Set([...REVIEW_DATE_FIELDS, "publishedAt", "validFrom", "validTo", "recheckBy"]);
const DAY_MS = 24 * 60 * 60 * 1000;

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function parseIsoDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const time = Date.UTC(year, month - 1, day);
    const parsed = new Date(time);
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
    return time;
}

function localIsoDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function plural(value, singular, pluralForm) {
    return `${value} ${value === 1 ? singular : pluralForm}`;
}

function offerName(offer, index) {
    const provider = offer?.identity?.provider;
    const id = offer?.identity?.id;
    if (provider && id) return `${provider} (${id})`;
    return id || provider || `offers[${index}]`;
}

function makeReporter(today) {
    const entries = [];
    const add = (section, level, message, context = {}) => entries.push({ section, level, message, ...context });
    return {
        today,
        entries,
        ok: (section, message, context) => add(section, "OK", message, context),
        warn: (section, message, context) => add(section, "WARN", message, context),
        fail: (section, message, context) => add(section, "FAIL", message, context)
    };
}

function countFailures(reporter) {
    return reporter.entries.filter((entry) => entry.level === "FAIL").length;
}

function checkpoint(reporter, section, failuresBefore, message) {
    if (countFailures(reporter) === failuresBefore) reporter.ok(section, message);
}

function requireObject(reporter, value, pathValue, offer) {
    if (!isObject(value)) {
        reporter.fail("Structure", "Required object is missing or has the wrong type.", { path: pathValue, offer });
        return false;
    }
    return true;
}

function requireArray(reporter, value, pathValue, offer) {
    if (!Array.isArray(value)) {
        reporter.fail("Structure", "Required array is missing or has the wrong type.", { path: pathValue, offer });
        return false;
    }
    return true;
}

function requireString(reporter, value, pathValue, offer) {
    if (!isNonEmptyString(value)) {
        reporter.fail("Structure", "Required non-empty string is missing or has the wrong type.", { path: pathValue, offer });
        return false;
    }
    return true;
}

function checkUnique(reporter, items, getId, label, getPath, getOffer) {
    const seen = new Map();
    items.forEach((item, index) => {
        const id = getId(item, index);
        if (!isNonEmptyString(id)) {
            reporter.fail("IDs", `Required ${label} must be a non-empty string.`, {
                path: getPath(item, index),
                offer: getOffer?.(item, index)
            });
            return;
        }
        if (seen.has(id)) {
            reporter.fail("IDs", `Duplicate ${label}: ${id}.`, {
                path: getPath(item, index),
                offer: getOffer?.(item, index),
                relatedPath: seen.get(id)
            });
        } else {
            seen.set(id, getPath(item, index));
        }
    });
}

function checkReferences(reporter, values, allowed, label, pathPrefix, offer) {
    if (!Array.isArray(values)) return;
    values.forEach((value, index) => {
        if (!allowed.has(value)) {
            reporter.fail("References", `Broken ${label} reference: ${String(value)}.`, {
                path: `${pathPrefix}[${index}]`,
                offer
            });
        }
    });
}

function walk(value, visitor, pathValue = "$") {
    visitor(value, pathValue);
    if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, visitor, `${pathValue}[${index}]`));
    } else if (isObject(value)) {
        Object.entries(value).forEach(([key, item]) => walk(item, visitor, `${pathValue}.${key}`));
    }
}

function checkStructure(data, reporter) {
    const before = countFailures(reporter);
    if (!requireObject(reporter, data, "$")) return false;

    requireString(reporter, data.schemaVersion, "$.schemaVersion");
    requireString(reporter, data.methodologyVersion, "$.methodologyVersion");
    requireString(reporter, data.confidenceFormat, "$.confidenceFormat");
    requireString(reporter, data.reviewedAt, "$.reviewedAt");
    requireObject(reporter, data.landingGates, "$.landingGates");
    if (data.schemaVersion !== "decision-model-v1") {
        reporter.fail("Structure", `Unsupported schemaVersion: ${String(data.schemaVersion)}.`, { path: "$.schemaVersion" });
    }
    if (data.confidenceFormat !== "band-only") {
        reporter.fail("Structure", `Unsupported confidenceFormat: ${String(data.confidenceFormat)}.`, { path: "$.confidenceFormat" });
    }
    if (isObject(data.landingGates) && Object.keys(data.landingGates).length === 0) {
        reporter.fail("Structure", "landingGates must not be empty.", { path: "$.landingGates" });
    }
    if (!requireArray(reporter, data.offers, "$.offers")) return false;
    if (data.offers.length === 0) reporter.fail("Structure", "The offers array must not be empty.", { path: "$.offers" });

    data.offers.forEach((offer, index) => {
        const base = `$.offers[${index}]`;
        const name = offerName(offer, index);
        if (!requireObject(reporter, offer, base, name)) return;
        REQUIRED_OFFER_SECTIONS.forEach((section) => requireObject(reporter, offer[section], `${base}.${section}`, name));
        if (!isObject(offer.identity)) return;

        ["id", "slug", "provider", "category", "title", "status"].forEach((field) =>
            requireString(reporter, offer.identity[field], `${base}.identity.${field}`, name));
        requireObject(reporter, offer.identity.edition, `${base}.identity.edition`, name);
        requireString(reporter, offer.identity.edition?.id, `${base}.identity.edition.id`, name);

        requireObject(reporter, offer.value?.advertisedMax, `${base}.value.advertisedMax`, name);
        requireArray(reporter, offer.value?.rewardComponents, `${base}.value.rewardComponents`, name);
        requireArray(reporter, offer.value?.scenarioExamples, `${base}.value.scenarioExamples`, name);
        requireArray(reporter, offer.execution?.actions, `${base}.execution.actions`, name);
        requireArray(reporter, offer.execution?.failurePoints, `${base}.execution.failurePoints`, name);
        requireArray(reporter, offer.decision?.scenarios, `${base}.decision.scenarios`, name);
        requireArray(reporter, offer.decision?.northValue, `${base}.decision.northValue`, name);
        requireObject(reporter, offer.decision?.northConfidence, `${base}.decision.northConfidence`, name);
        requireObject(reporter, offer.decision?.verdict, `${base}.decision.verdict`, name);
        requireArray(reporter, offer.evidence?.sources, `${base}.evidence.sources`, name);
        requireArray(reporter, offer.evidence?.fieldSources, `${base}.evidence.fieldSources`, name);
        requireArray(reporter, offer.evidence?.conflicts, `${base}.evidence.conflicts`, name);

        const isPublishedCoreOffer = offer.identity.category !== "crypto_validation"
            && ["active", "closing"].includes(offer.identity.status);
        if (isPublishedCoreOffer) requireObject(reporter, offer.match, `${base}.match`, name);
    });

    checkpoint(reporter, "Structure", before, `Required Decision Model v1 structures are present (${data.offers.length} offers).`);
    return countFailures(reporter) === before;
}

function checkIds(data, reporter) {
    const before = countFailures(reporter);
    const offers = data.offers;
    checkUnique(reporter, offers, (offer) => offer?.identity?.id, "offer ID", (_, index) => `$.offers[${index}].identity.id`);
    checkUnique(reporter, offers, (offer) => offer?.identity?.slug, "slug", (_, index) => `$.offers[${index}].identity.slug`);
    checkUnique(reporter, offers, (offer) => offer?.identity?.edition?.id, "edition ID", (_, index) => `$.offers[${index}].identity.edition.id`);

    offers.forEach((offer, offerIndex) => {
        const base = `$.offers[${offerIndex}]`;
        const name = offerName(offer, offerIndex);
        const scoped = [
            [offer.value?.rewardComponents, (item) => item?.id, "reward component ID", "value.rewardComponents"],
            [offer.execution?.actions, (item) => item?.id, "action ID", "execution.actions"],
            [offer.execution?.failurePoints, (item) => item?.id, "failure point ID", "execution.failurePoints"],
            [offer.value?.scenarioExamples, (item) => item?.id, "scenario example ID", "value.scenarioExamples"],
            [offer.decision?.scenarios, (item) => item?.id, "decision scenario ID", "decision.scenarios"],
            [offer.evidence?.sources, (item) => item?.id, "evidence source ID", "evidence.sources"],
            [offer.match?.fields, (item) => item?.id, "Match field ID", "match.fields"]
        ];
        scoped.forEach(([items, getter, label, suffix]) => {
            if (Array.isArray(items)) checkUnique(reporter, items, getter, label, (_, index) => `${base}.${suffix}[${index}].id`, () => name);
        });
    });

    checkpoint(reporter, "IDs", before, "Offer, slug, edition, component, action, scenario and evidence IDs are unique in their scopes.");
}

function walkCondition(condition, fieldIds, reporter, pathValue, offer) {
    if (!isObject(condition)) return;
    if (isNonEmptyString(condition.field) && !fieldIds.has(condition.field)) {
        reporter.fail("References", `Broken Match field reference: ${condition.field}.`, { path: `${pathValue}.field`, offer });
    }
    if (Array.isArray(condition.all)) condition.all.forEach((item, index) => walkCondition(item, fieldIds, reporter, `${pathValue}.all[${index}]`, offer));
    if (Array.isArray(condition.any)) condition.any.forEach((item, index) => walkCondition(item, fieldIds, reporter, `${pathValue}.any[${index}]`, offer));
    if (condition.not) walkCondition(condition.not, fieldIds, reporter, `${pathValue}.not`, offer);
}

function checkReferenceIntegrity(data, reporter) {
    const before = countFailures(reporter);
    const offersById = new Map(data.offers.map((offer) => [offer?.identity?.id, offer]));

    data.offers.forEach((offer, offerIndex) => {
        const base = `$.offers[${offerIndex}]`;
        const name = offerName(offer, offerIndex);
        const componentIds = new Set((offer.value?.rewardComponents || []).map((item) => item?.id));
        const actionIds = new Set((offer.execution?.actions || []).map((item) => item?.id));
        const failurePointIds = new Set((offer.execution?.failurePoints || []).map((item) => item?.id));
        const scenarioIds = new Set((offer.decision?.scenarios || []).map((item) => item?.id));
        const exampleIds = new Set((offer.value?.scenarioExamples || []).map((item) => item?.id));
        const sourceIds = new Set((offer.evidence?.sources || []).map((item) => item?.id));

        checkReferences(reporter, offer.value?.advertisedMax?.componentIds, componentIds, "advertised component", `${base}.value.advertisedMax.componentIds`, name);
        (offer.value?.rewardComponents || []).forEach((component, index) =>
            checkReferences(reporter, component.conditionActionIds, actionIds, "condition action", `${base}.value.rewardComponents[${index}].conditionActionIds`, name));

        ["easyFloor", "conditionalMax"].forEach((key) => {
            const scenario = offer.value?.[key];
            if (!scenario) return;
            checkReferences(reporter, scenario.includedComponentIds, componentIds, `${key} included component`, `${base}.value.${key}.includedComponentIds`, name);
            checkReferences(reporter, (scenario.excludedComponentIds || []).map((item) => item?.id), componentIds, `${key} excluded component`, `${base}.value.${key}.excludedComponentIds`, name);
        });

        const componentReferenceHolders = [
            [offer.eligibility?.requiredIncome, `${base}.eligibility.requiredIncome`],
            ...((offer.eligibility?.requiredSpend || []).map((item, index) => [item, `${base}.eligibility.requiredSpend[${index}]`])),
            [offer.eligibility?.requiredCapital, `${base}.eligibility.requiredCapital`],
            ...((offer.execution?.actions || []).map((item, index) => [item, `${base}.execution.actions[${index}]`]))
        ];
        componentReferenceHolders.forEach(([holder, holderPath]) =>
            checkReferences(reporter, holder?.appliesToComponentIds, componentIds, "component", `${holderPath}.appliesToComponentIds`, name));

        checkReferences(reporter, offer.execution?.cadence?.repeatedActionIds, actionIds, "repeated action", `${base}.execution.cadence.repeatedActionIds`, name);
        (offer.cost?.avoidableFees || []).forEach((fee, index) => {
            if (fee?.failurePointId && !failurePointIds.has(fee.failurePointId)) {
                reporter.fail("References", `Broken failure point reference: ${fee.failurePointId}.`, { path: `${base}.cost.avoidableFees[${index}].failurePointId`, offer: name });
            }
        });
        checkReferences(reporter, (offer.cost?.totalsByScenario || []).map((item) => item?.scenarioId), scenarioIds, "cost scenario", `${base}.cost.totalsByScenario`, name);
        checkReferences(reporter, (offer.decision?.northValue || []).map((item) => item?.scenarioId), scenarioIds, "North Value scenario", `${base}.decision.northValue`, name);
        checkReferences(reporter, [...exampleIds], scenarioIds, "scenario example", `${base}.value.scenarioExamples`, name);

        const verdictScenarioId = offer.decision?.verdict?.scenarioId;
        if (verdictScenarioId && verdictScenarioId !== "user-scenario-required" && !scenarioIds.has(verdictScenarioId)) {
            reporter.fail("References", `Broken Verdict scenario reference: ${verdictScenarioId}.`, { path: `${base}.decision.verdict.scenarioId`, offer: name });
        }

        (offer.evidence?.fieldSources || []).forEach((fieldSource, index) => {
            if (!sourceIds.has(fieldSource?.sourceId)) {
                reporter.fail("References", `Broken evidence source reference: ${String(fieldSource?.sourceId)}.`, { path: `${base}.evidence.fieldSources[${index}].sourceId`, offer: name });
            }
        });
        (offer.evidence?.conflicts || []).forEach((conflict, index) =>
            checkReferences(reporter, conflict?.sourceIds, sourceIds, "conflict source", `${base}.evidence.conflicts[${index}].sourceIds`, name));

        if (isObject(offer.match)) {
            const fieldIds = new Set((offer.match.fields || []).map((field) => field?.id));
            (offer.match.fields || []).forEach((field, index) => walkCondition(field?.showWhen, fieldIds, reporter, `${base}.match.fields[${index}].showWhen`, name));
            ["eligibilityRules", "componentRules", "costRules"].forEach((collection) => {
                (offer.match[collection] || []).forEach((rule, index) => {
                    const rulePath = `${base}.match.${collection}[${index}]`;
                    walkCondition(rule?.when, fieldIds, reporter, `${rulePath}.when`, name);
                    walkCondition(rule?.includeWhen, fieldIds, reporter, `${rulePath}.includeWhen`, name);
                    walkCondition(rule?.formula?.lowerAmountWhen, fieldIds, reporter, `${rulePath}.formula.lowerAmountWhen`, name);
                    Object.entries(rule?.formula || {}).forEach(([key, value]) => {
                        if (key.endsWith("Field") && isNonEmptyString(value) && !fieldIds.has(value)) {
                            reporter.fail("References", `Broken Match formula field reference: ${value}.`, { path: `${rulePath}.formula.${key}`, offer: name });
                        }
                    });
                });
            });
            (offer.match.componentRules || []).forEach((rule, index) => {
                if (!componentIds.has(rule?.componentId)) {
                    reporter.fail("References", `Broken Match component reference: ${String(rule?.componentId)}.`, { path: `${base}.match.componentRules[${index}].componentId`, offer: name });
                }
            });
        }
    });

    checkpoint(reporter, "References", before, "Offer-local component, action, scenario, Match and evidence references resolve.");
    return offersById;
}

function checkValueIntegrity(data, reporter) {
    const before = countFailures(reporter);

    walk(data, (value, pathValue) => {
        if (typeof value === "number" && !Number.isFinite(value)) {
            reporter.fail("Values", "Numeric value must be finite.", { path: pathValue });
        }
        if (!isObject(value)) return;

        if (Object.hasOwn(value, "amount") && typeof value.amount === "string") {
            reporter.fail("Values", "amount must not be encoded as a string.", { path: `${pathValue}.amount` });
        }

        const keys = Object.keys(value);
        const looksLikeMoney = Object.hasOwn(value, "currency")
            || (Object.hasOwn(value, "amount") && keys.every((key) => ["amount", "currency"].includes(key)));
        if (looksLikeMoney) {
            if (typeof value.amount !== "number" || !Number.isFinite(value.amount)) {
                reporter.fail("Values", "Money.amount must be a finite number; use null for an unknown Money value.", { path: `${pathValue}.amount` });
            }
            if (!isNonEmptyString(value.currency)) {
                reporter.fail("Values", "Money.currency is required when a Money object exists.", { path: `${pathValue}.currency` });
            }
        }

        if (isObject(value.min) && isObject(value.max)
            && Object.hasOwn(value.min, "amount") && Object.hasOwn(value.max, "amount")) {
            if (value.min.currency !== value.max.currency) {
                reporter.fail("Values", "Money range endpoints must use the same currency.", { path: pathValue });
            }
            if (Number.isFinite(value.min.amount) && Number.isFinite(value.max.amount) && value.min.amount > value.max.amount) {
                reporter.fail("Values", "Money range minimum exceeds maximum.", { path: pathValue });
            }
        }
    });

    data.offers.forEach((offer, offerIndex) => {
        const base = `$.offers[${offerIndex}]`;
        const name = offerName(offer, offerIndex);
        const requirementAmounts = [
            [offer.eligibility?.requiredIncome?.amount, `${base}.eligibility.requiredIncome.amount`],
            ...((offer.eligibility?.requiredSpend || []).map((item, index) => [item?.amount, `${base}.eligibility.requiredSpend[${index}].amount`])),
            [offer.eligibility?.requiredCapital?.amount, `${base}.eligibility.requiredCapital.amount`]
        ];
        requirementAmounts.forEach(([amount, amountPath]) => {
            if (isObject(amount) && amount.amount === 0) {
                reporter.fail("Values", "A missing requirement threshold must use null, not a zero Money value.", { path: amountPath, offer: name });
            }
        });
        ["easyFloor", "conditionalMax"].forEach((key) => {
            const scenarioValue = offer.value?.[key];
            if (isObject(scenarioValue?.grossValue) && scenarioValue.grossValue.amount === 0) {
                reporter.fail("Values", `A zero ${key} must be represented as null.`, { path: `${base}.value.${key}`, offer: name });
            }
        });

        const components = new Map((offer.value?.rewardComponents || []).map((component) => [component.id, component]));
        const aggregate = offer.value?.advertisedMax;
        const selected = (aggregate?.componentIds || []).map((id) => components.get(id)).filter(Boolean);
        const values = selected.map((component) => component?.advertisedValue);
        const canSum = values.length === selected.length && values.length > 0
            && values.every((money) => isObject(money) && Number.isFinite(money.amount) && isNonEmptyString(money.currency))
            && values.every((money) => money.currency === values[0].currency);
        const total = aggregate?.faceValueTotal;
        if (canSum && isObject(total) && Number.isFinite(total.amount) && total.currency === values[0].currency) {
            const componentTotal = values.reduce((sum, money) => sum + money.amount, 0);
            if (componentTotal !== total.amount) {
                reporter.fail("Values", `Advertised aggregate ${total.amount} ${total.currency} does not equal referenced components (${componentTotal} ${total.currency}).`, {
                    path: `${base}.value.advertisedMax.faceValueTotal`,
                    offer: name
                });
            }
        }
    });

    checkpoint(reporter, "Values", before, "Money values, ranges and advertised component aggregates are internally consistent.");
}

function checkConfidenceAndVerdict(data, reporter) {
    const before = countFailures(reporter);
    data.offers.forEach((offer, offerIndex) => {
        const base = `$.offers[${offerIndex}]`;
        const name = offerName(offer, offerIndex);
        const status = offer.identity?.status;
        const certainty = offer.identity?.edition?.certainty;
        const confidence = offer.decision?.northConfidence;
        const verdict = offer.decision?.verdict;

        if (!IDENTITY_STATUSES.has(status)) reporter.fail("Confidence & Verdict", `Unsupported identity status: ${String(status)}.`, { path: `${base}.identity.status`, offer: name });
        if (!EDITION_CERTAINTIES.has(certainty)) reporter.fail("Confidence & Verdict", `Unsupported edition certainty: ${String(certainty)}.`, { path: `${base}.identity.edition.certainty`, offer: name });
        if (!CONFIDENCE_BANDS.has(confidence?.band)) reporter.fail("Confidence & Verdict", `Unsupported Confidence band: ${String(confidence?.band)}.`, { path: `${base}.decision.northConfidence.band`, offer: name });
        Object.entries(confidence?.factors || {}).forEach(([factor, band]) => {
            if (!CONFIDENCE_BANDS.has(band)) reporter.fail("Confidence & Verdict", `Unsupported Confidence factor band: ${String(band)}.`, { path: `${base}.decision.northConfidence.factors.${factor}`, offer: name });
        });

        if (!VERDICT_STATES.has(verdict?.state)) reporter.fail("Confidence & Verdict", `Unsupported Verdict state: ${String(verdict?.state)}.`, { path: `${base}.decision.verdict.state`, offer: name });
        if (verdict?.state === "NOT ENOUGH DATA" && (!Array.isArray(verdict.missingData) || verdict.missingData.length === 0)) {
            reporter.fail("Confidence & Verdict", "NOT ENOUGH DATA requires a non-empty missingData list.", { path: `${base}.decision.verdict.missingData`, offer: name });
        }
        if (["TAKE NOW", "TAKE IF"].includes(verdict?.state) && confidence?.band === "LOW") {
            reporter.fail("Confidence & Verdict", `${verdict.state} is not allowed with LOW Confidence.`, { path: `${base}.decision.verdict.state`, offer: name });
        }
        if (verdict?.state === "TAKE NOW" && confidence?.band !== "HIGH") {
            reporter.fail("Confidence & Verdict", "TAKE NOW requires HIGH Confidence.", { path: `${base}.decision.northConfidence.band`, offer: name });
        }

        (offer.value?.scenarioExamples || []).forEach((scenario, scenarioIndex) => {
            const scenarioPath = `${base}.value.scenarioExamples[${scenarioIndex}]`;
            if (!VERDICT_STATES.has(scenario?.verdict)) {
                reporter.fail("Confidence & Verdict", `Unsupported scenario Verdict: ${String(scenario?.verdict)}.`, { path: `${scenarioPath}.verdict`, offer: name });
            }
            const scenarioConfidence = scenario?.confidenceBand || confidence?.band;
            if (!CONFIDENCE_BANDS.has(scenarioConfidence)) {
                reporter.fail("Confidence & Verdict", `Unsupported scenario Confidence band: ${String(scenarioConfidence)}.`, { path: `${scenarioPath}.confidenceBand`, offer: name });
            }
            if (["TAKE NOW", "TAKE IF"].includes(scenario?.verdict) && scenarioConfidence === "LOW") {
                reporter.fail("Confidence & Verdict", `${scenario.verdict} scenario is not allowed with LOW Confidence.`, { path: `${scenarioPath}.verdict`, offer: name });
            }
            if (scenario?.verdict === "TAKE NOW" && scenarioConfidence !== "HIGH") {
                reporter.fail("Confidence & Verdict", "TAKE NOW scenario requires HIGH Confidence.", { path: `${scenarioPath}.confidenceBand`, offer: name });
            }
        });
    });
    checkpoint(reporter, "Confidence & Verdict", before, "Supported states and positive-Verdict confidence gates are respected.");
}

function checkLanding(data, offersById, reporter, todayTime) {
    const before = countFailures(reporter);
    const gates = data.landingGates;
    if (!isObject(gates)) return;

    Object.entries(gates).forEach(([gateId, gate]) => {
        const gatePath = `$.landingGates.${gateId}`;
        if (gateId === "firstRealOpportunities") {
            if (!isObject(gate)) return;
            Object.entries(gate).forEach(([offerId, status]) => {
                if (!offersById.has(offerId)) reporter.fail("Landing", `Published opportunity points to unknown offer: ${offerId}.`, { path: `${gatePath}.${offerId}` });
                if (!OPPORTUNITY_STATUSES.has(status)) reporter.fail("Landing", `Unsupported opportunity status: ${String(status)}.`, { path: `${gatePath}.${offerId}` });
            });
            return;
        }

        if (!isObject(gate)) {
            reporter.fail("Landing", "Landing gate must be an object.", { path: gatePath });
            return;
        }
        if (!LANDING_DEMO_STATUSES.has(gate.status)) reporter.fail("Landing", `Unsupported demo status: ${String(gate.status)}.`, { path: `${gatePath}.status` });
        if (!isNonEmptyString(gate.offerId)) {
            reporter.fail("Landing", "Demo gate requires offerId.", { path: `${gatePath}.offerId` });
            return;
        }
        const offer = offersById.get(gate.offerId);
        if (!offer) {
            reporter.fail("Landing", `Demo gate points to unknown offer: ${gate.offerId}.`, { path: `${gatePath}.offerId` });
            return;
        }
        const name = offerName(offer, data.offers.indexOf(offer));
        if (gate.editionId !== offer.identity?.edition?.id) {
            reporter.fail("Landing", `Demo edition ${String(gate.editionId)} does not match the offer edition ${String(offer.identity?.edition?.id)}.`, { path: `${gatePath}.editionId`, offer: name });
        }
        const scenarioIds = new Set((offer.value?.scenarioExamples || []).map((scenario) => scenario?.id));
        checkReferences(reporter, gate.scenarioIds, scenarioIds, "landing scenario", `${gatePath}.scenarioIds`, name);

        if (gate.status === "verified") {
            if (!["active", "closing"].includes(offer.identity?.status) || !offer.identity?.verifiedAt) {
                reporter.fail("Landing", "Verified demo points to an offer that is not active/closing and fully reviewed.", { path: gatePath, offer: name });
            }
            const gateRecheck = parseIsoDate(gate.recheckBy);
            if (gateRecheck === null) {
                reporter.fail("Landing", "Verified demo requires a valid recheckBy date.", { path: `${gatePath}.recheckBy`, offer: name });
            } else if (gateRecheck < todayTime) {
                reporter.fail("Landing", `Verified demo recheck is overdue by ${plural(Math.abs(Math.round((gateRecheck - todayTime) / DAY_MS)), "day", "days")}.`, { path: `${gatePath}.recheckBy`, offer: name });
            }
            const offerRecheck = parseIsoDate(offer.evidence?.recheckBy);
            if (gateRecheck !== null && offerRecheck !== null && gateRecheck > offerRecheck) {
                reporter.fail("Landing", "Demo recheckBy extends beyond the referenced offer evidence.", { path: `${gatePath}.recheckBy`, offer: name });
            }
        }
    });

    checkpoint(reporter, "Landing", before, "Landing gates use supported states and resolve to matching offer editions and scenarios.");
}

function checkDatesAndFreshness(data, reporter, todayTime) {
    const before = countFailures(reporter);
    walk(data, (value, pathValue) => {
        const field = pathValue.split(".").at(-1);
        if (!DATE_FIELDS.has(field) || value === null || value === undefined) return;
        const parsed = parseIsoDate(value);
        if (parsed === null) {
            reporter.fail("Freshness", `Invalid ${field}; expected a real YYYY-MM-DD date.`, { path: pathValue });
        } else if (REVIEW_DATE_FIELDS.has(field) && parsed > todayTime) {
            reporter.fail("Freshness", `${field} cannot be in the future relative to --today.`, { path: pathValue });
        }
    });

    data.offers.forEach((offer, offerIndex) => {
        const base = `$.offers[${offerIndex}]`;
        const name = offerName(offer, offerIndex);
        const status = offer.identity?.status;
        const active = ["active", "closing"].includes(status);
        const verifiedTime = parseIsoDate(offer.identity?.verifiedAt);
        const recheckTime = parseIsoDate(offer.evidence?.recheckBy);
        const validFromTime = parseIsoDate(offer.identity?.edition?.validFrom);
        const validToTime = parseIsoDate(offer.identity?.edition?.validTo);
        const hasEvidence = Array.isArray(offer.evidence?.sources) && offer.evidence.sources.length > 0;

        if (validFromTime !== null && validToTime !== null && validFromTime > validToTime) {
            reporter.fail("Freshness", "Edition validFrom is later than validTo.", { path: `${base}.identity.edition`, offer: name });
        }
        if (active && validToTime !== null && validToTime < todayTime) {
            reporter.fail("Freshness", "Offer is still active/closing after its edition validTo date.", { path: `${base}.identity.status`, offer: name });
        }
        if (active && (verifiedTime === null || !hasEvidence)) {
            reporter.fail("Freshness", "Active/closing offer must have verifiedAt and at least one evidence source.", { path: `${base}.identity.verifiedAt`, offer: name });
            return;
        }
        if (!active) return;
        if (recheckTime === null) {
            reporter.fail("Freshness", "Active/closing verified offer requires a valid recheckBy.", { path: `${base}.evidence.recheckBy`, offer: name });
            return;
        }
        if (verifiedTime !== null && recheckTime < verifiedTime) {
            reporter.fail("Freshness", "recheckBy cannot be earlier than verifiedAt.", { path: `${base}.evidence.recheckBy`, offer: name });
        }

        const days = Math.round((recheckTime - todayTime) / DAY_MS);
        if (days < 0) {
            reporter.fail("Freshness", `${name} — recheck overdue by ${plural(Math.abs(days), "day", "days")} (${offer.evidence.recheckBy}).`, { path: `${base}.evidence.recheckBy`, offer: name });
            if (offer.decision?.northConfidence?.factors?.freshness !== "LOW") {
                reporter.fail("Confidence & Verdict", "Expired recheckBy requires the freshness confidence factor to be LOW.", { path: `${base}.decision.northConfidence.factors.freshness`, offer: name });
            }
        } else if (days <= 7) {
            reporter.warn("Freshness", `${name} — recheck due in ${plural(days, "day", "days")} (${offer.evidence.recheckBy}).`, { path: `${base}.evidence.recheckBy`, offer: name });
        } else {
            reporter.ok("Freshness", `${name} — recheck is current (${offer.evidence.recheckBy}).`);
        }
    });

    Object.entries(data.landingGates || {}).forEach(([gateId, gate]) => {
        if (!isObject(gate) || gate.status !== "verified") return;
        const recheckTime = parseIsoDate(gate.recheckBy);
        if (recheckTime === null) return;
        const days = Math.round((recheckTime - todayTime) / DAY_MS);
        if (days >= 0 && days <= 7) {
            reporter.warn("Freshness", `Landing gate ${gateId} — recheck due in ${plural(days, "day", "days")} (${gate.recheckBy}).`, { path: `$.landingGates.${gateId}.recheckBy` });
        } else if (days > 7) {
            reporter.ok("Freshness", `Landing gate ${gateId} — recheck is current (${gate.recheckBy}).`);
        }
    });

    checkpoint(reporter, "Freshness", before, "All freshness dates and active-record deadlines are valid.");
}

function finishReport(reporter) {
    const failedSections = new Set(reporter.entries.filter((entry) => entry.level === "FAIL").map((entry) => entry.section));
    const entries = reporter.entries.filter((entry) => entry.level !== "OK" || !failedSections.has(entry.section));
    const counts = entries.reduce((result, entry) => {
        result[entry.level] += 1;
        return result;
    }, { OK: 0, WARN: 0, FAIL: 0 });
    const status = counts.FAIL > 0 ? "FAIL" : counts.WARN > 0 ? "PASS WITH WARNINGS" : "PASS";
    return { today: reporter.today, status, counts, entries, exitCode: counts.FAIL > 0 ? 1 : 0 };
}

export function validateNorthData(data, options = {}) {
    const today = options.today || localIsoDate();
    const todayTime = parseIsoDate(today);
    if (todayTime === null) throw new TypeError(`Invalid --today value: ${today}. Expected YYYY-MM-DD.`);
    const reporter = makeReporter(today);
    if (!checkStructure(data, reporter)) return finishReport(reporter);
    checkIds(data, reporter);
    const offersById = checkReferenceIntegrity(data, reporter);
    checkValueIntegrity(data, reporter);
    checkConfidenceAndVerdict(data, reporter);
    checkLanding(data, offersById, reporter, todayTime);
    checkDatesAndFreshness(data, reporter, todayTime);
    return finishReport(reporter);
}

export function validateNorthDataText(text, options = {}) {
    try {
        return validateNorthData(JSON.parse(text), options);
    } catch (error) {
        if (error instanceof SyntaxError) {
            const today = options.today || localIsoDate();
            const reporter = makeReporter(today);
            reporter.fail("Structure", `decision-offers.json is not valid JSON: ${error.message}`, { path: "$" });
            return finishReport(reporter);
        }
        throw error;
    }
}

export function renderReport(report) {
    const symbols = { OK: "✓", WARN: "⚠", FAIL: "✗" };
    const lines = ["NORTH DATA VALIDATION", "=====================", `Today: ${report.today}`, ""];
    SECTION_ORDER.forEach((section) => {
        const entries = report.entries.filter((entry) => entry.section === section);
        if (entries.length === 0) return;
        lines.push(section);
        entries.forEach((entry) => {
            lines.push(`${symbols[entry.level]} ${entry.message}`);
            if (entry.offer && !entry.message.includes(entry.offer)) lines.push(`  offer: ${entry.offer}`);
            if (entry.path) lines.push(`  path: ${entry.path}`);
            if (entry.relatedPath) lines.push(`  first seen: ${entry.relatedPath}`);
        });
        lines.push("");
    });
    lines.push("Summary", report.status, `${report.counts.FAIL} fail · ${report.counts.WARN} warn · ${report.counts.OK} ok`);
    return lines.join("\n");
}

function parseArgs(args) {
    const parsed = { today: undefined, file: undefined, help: false };
    args.forEach((arg) => {
        if (arg === "--help" || arg === "-h") parsed.help = true;
        else if (arg.startsWith("--today=")) parsed.today = arg.slice("--today=".length);
        else if (arg.startsWith("--file=")) parsed.file = arg.slice("--file=".length);
        else throw new TypeError(`Unknown argument: ${arg}`);
    });
    return parsed;
}

async function main() {
    try {
        const args = parseArgs(process.argv.slice(2));
        if (args.help) {
            console.log("Usage: node scripts/validate-north-data.mjs [--today=YYYY-MM-DD] [--file=PATH]");
            return;
        }
        const scriptDir = path.dirname(fileURLToPath(import.meta.url));
        const defaultFile = path.resolve(scriptDir, "..", "frontend", "data", "decision-offers.json");
        const file = args.file ? path.resolve(process.cwd(), args.file) : defaultFile;
        const text = await readFile(file, "utf8");
        const report = validateNorthDataText(text, { today: args.today });
        console.log(renderReport(report));
        process.exitCode = report.exitCode;
    } catch (error) {
        console.error(`NORTH DATA VALIDATION\n=====================\n\nFAIL\n${error.message}`);
        process.exitCode = 1;
    }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) await main();
