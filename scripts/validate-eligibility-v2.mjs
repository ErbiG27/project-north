#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REQUIRED_WINDOW_KINDS = ["FIXED_DATE", "FIXED_DATE_OPEN_ENDED", "ROLLING_PERIOD", "NONE", "UNKNOWN"];
const REQUIRED_CAPABILITIES = ["CAN_ANSWER", "NEEDS_USER_INPUT", "EVIDENCE_GAP", "CONFLICTING", "STALE", "UNKNOWN"];

function locatorReference(locator) {
    if (!locator || typeof locator.type !== "string" || typeof locator.value !== "string" || !locator.value.trim()) return null;
    const labels = {
        clause: "Klauzula",
        section_page_heading: "Sekcja / nagłówek / strona",
        title_page_and_section: "Tożsamość dokumentu / sekcja"
    };
    return `${labels[locator.type] || locator.type}: ${locator.value}`;
}

function validateCondition(condition, fields, add, pathValue) {
    if (!condition) return;
    if (condition.field && !fields.has(condition.field)) add(pathValue + ".field", "Unknown match field " + condition.field + ".");
    (condition.all || []).forEach((item, index) => validateCondition(item, fields, add, pathValue + ".all[" + index + "]"));
    (condition.any || []).forEach((item, index) => validateCondition(item, fields, add, pathValue + ".any[" + index + "]"));
    if (condition.not) validateCondition(condition.not, fields, add, pathValue + ".not");
}

function validateFormulaFields(formula, fields, add, pathValue) {
    Object.entries(formula || {}).forEach(([key, value]) => {
        if (key.endsWith("Field") && (typeof value !== "string" || !fields.has(value))) add(pathValue + "." + key, "Unknown formula field " + (value || "missing") + ".");
    });
    (formula?.tiers || []).forEach((tier, index) => validateCondition(tier.when, fields, add, pathValue + ".tiers[" + index + "].when"));
    validateCondition(formula?.lowerAmountWhen, fields, add, pathValue + ".lowerAmountWhen");
}

function isoTime(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const time = Date.UTC(year, month - 1, day);
    const parsed = new Date(time);
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day ? time : null;
}

function sameIdentity(left, right) {
    const keys = ["buildId", "decisionSchema", "eligibilitySchema", "loaderApi", "matchApi"];
    return left && right && keys.every((key) => left[key] === right[key]);
}

export function validateEligibilityV2(contractData, decisionData) {
    const errors = [];
    const add = (pathValue, message) => errors.push({ path: pathValue, message });
    if (contractData?.schemaVersion !== "north-eligibility-v2") add("$.schemaVersion", "Expected north-eligibility-v2.");
    if (decisionData?.schemaVersion !== contractData?.runtimeIdentity?.decisionSchema) add("$.runtimeIdentity.decisionSchema", "Decision schema identity does not match decision data.");
    if (contractData?.schemaVersion !== contractData?.runtimeIdentity?.eligibilitySchema) add("$.runtimeIdentity.eligibilitySchema", "Eligibility schema identity does not match contract data.");
    if (!sameIdentity(contractData?.runtimeIdentity, decisionData?.runtimeIdentity)) add("$.runtimeIdentity", "Decision and eligibility generations are incompatible.");
    REQUIRED_WINDOW_KINDS.forEach((kind) => {
        if (!contractData?.windowKinds?.includes(kind)) add("$.windowKinds", "Missing supported kind " + kind + ".");
    });
    REQUIRED_CAPABILITIES.forEach((state) => {
        if (!contractData?.capabilityStates?.includes(state)) add("$.capabilityStates", "Missing capability state " + state + ".");
    });

    const offers = new Map((decisionData?.offers || []).map((offer) => [offer.identity?.id, offer]));
    const ruleIds = new Set();
    Object.entries(contractData?.offers || {}).forEach(([offerId, contract]) => {
        const base = "$.offers." + offerId;
        const offer = offers.get(offerId);
        if (!offer) {
            add(base, "Contract references a missing canonical offer.");
            return;
        }
        if (contract.offerId !== offerId) add(base + ".offerId", "Contract target does not match its canonical offer key.");
        if (contract.provider !== offer.identity?.provider) add(base + ".provider", "Contract provider does not match the canonical offer.");

        const componentIds = new Set((offer.value?.rewardComponents || []).map((component) => component.id));
        const sourceIds = new Set((offer.evidence?.sources || []).map((source) => source.id));
        const promotions = new Map((offer.promotionVariants || []).map((promotion) => [promotion.id, promotion]));
        const matchFields = [...(offer.match?.fields || []), ...(contract.fields || [])];
        const fieldIds = new Set(matchFields.map((field) => field.id));
        const critical = new Set(contract.evidenceRequirements?.decisionCriticalComponentIds || []);
        const nonCritical = new Set(contract.evidenceRequirements?.nonCriticalComponentIds || []);
        const classified = new Set([...critical, ...nonCritical]);
        for (const id of critical) {
            if (nonCritical.has(id)) add(base + ".evidenceRequirements", "Component is both critical and non-critical: " + id + ".");
            if (!componentIds.has(id)) add(base + ".evidenceRequirements", "Unknown critical component " + id + ".");
        }
        for (const id of nonCritical) {
            if (!componentIds.has(id)) add(base + ".evidenceRequirements", "Unknown non-critical component " + id + ".");
        }
        const componentRuleIds = new Set();
        (offer.match?.componentRules || []).forEach((component, index) => {
            const componentPath = base + ".decision.match.componentRules[" + index + "]";
            if (!componentIds.has(component.componentId)) add(componentPath + ".componentId", "Unknown reward component " + (component.componentId || "missing") + ".");
            if (componentRuleIds.has(component.componentId)) add(componentPath + ".componentId", "Duplicate component mapping " + component.componentId + ".");
            componentRuleIds.add(component.componentId);
            if (!classified.has(component.componentId) || critical.has(component.componentId) === nonCritical.has(component.componentId)) add(base + ".evidenceRequirements", "Unclassified answer component " + component.componentId + ".");
            validateCondition(component.when, fieldIds, add, componentPath + ".when");
            validateCondition(component.includeWhen, fieldIds, add, componentPath + ".includeWhen");
            if (component.usabilityFactorField && !fieldIds.has(component.usabilityFactorField)) add(componentPath + ".usabilityFactorField", "Unknown match field " + component.usabilityFactorField + ".");
            validateFormulaFields(component.formula, fieldIds, add, componentPath + ".formula");
        });
        for (const id of critical) {
            if (!componentRuleIds.has(id)) add(base + ".evidenceRequirements", "Missing decision-critical component rule " + id + ".");
        }
        matchFields.forEach((field, index) => validateCondition(field.showWhen, fieldIds, add, base + ".decision.match.fields[" + index + "].showWhen"));
        (offer.match?.eligibilityRules || []).forEach((rule, index) => validateCondition(rule.when, fieldIds, add, base + ".decision.match.eligibilityRules[" + index + "].when"));
        (offer.match?.costRules || []).forEach((rule, index) => {
            const rulePath = base + ".decision.match.costRules[" + index + "]";
            validateCondition(rule.when, fieldIds, add, rulePath + ".when");
            validateFormulaFields(rule.formula, fieldIds, add, rulePath + ".formula");
        });

        const legacyFields = new Set(contract.legacyControlledFields || []);
        Object.entries(contract.componentBypassFields || {}).forEach(([componentId, fields]) => {
            if (!componentIds.has(componentId) || !componentRuleIds.has(componentId)) add(base + ".componentBypassFields", "Unknown bypass component " + componentId + ".");
            for (const fieldId of fields || []) {
                if (!legacyFields.has(fieldId)) add(base + ".componentBypassFields." + componentId, "Bypass may target only deprecated legacy fields: " + fieldId + ".");
            }
        });

        (contract.rules || []).forEach((rule, index) => {
            const rulePath = base + ".rules[" + index + "]";
            if (!rule.id || ruleIds.has(rule.id)) add(rulePath + ".id", "Rule ID is missing or duplicated.");
            ruleIds.add(rule.id);
            if (rule.scope?.offerId !== offerId) add(rulePath + ".scope.offerId", "Rule target does not match the canonical offer.");
            if (rule.scope?.provider !== offer.identity?.provider) add(rulePath + ".scope.provider", "Rule provider does not match the canonical offer.");
            const promotion = promotions.get(rule.scope?.promotionId);
            if (!promotion) add(rulePath + ".scope.promotionId", "Unknown promotion " + (rule.scope?.promotionId || "missing") + ".");
            if (!Array.isArray(rule.scope?.componentIds) || rule.scope.componentIds.length === 0) add(rulePath + ".scope.componentIds", "At least one component is required.");
            const promotionComponents = new Set(promotion?.rewardComponents || []);
            for (const id of rule.scope?.componentIds || []) {
                if (!componentIds.has(id)) add(rulePath + ".scope.componentIds", "Unknown component " + id + ".");
                else if (promotion && !promotionComponents.has(id)) add(rulePath + ".scope.componentIds", "Component " + id + " does not belong to promotion " + promotion.id + ".");
            }
            if (!Array.isArray(rule.scope?.relationshipTypes)) add(rulePath + ".scope.relationshipTypes", "relationshipTypes must be explicit.");

            const window = rule.window;
            if (!window || !REQUIRED_WINDOW_KINDS.includes(window.kind)) {
                add(rulePath + ".window.kind", "Unsupported or missing window kind.");
            } else if (window.kind === "FIXED_DATE") {
                const from = isoTime(window.from);
                const to = isoTime(window.to);
                if (from === null || to === null) add(rulePath + ".window", "FIXED_DATE requires valid from and to dates.");
                else if (from > to) add(rulePath + ".window", "Fixed interval is reversed.");
            } else if (window.kind === "FIXED_DATE_OPEN_ENDED") {
                const from = window.from === null ? null : isoTime(window.from);
                const to = window.to === null ? null : isoTime(window.to);
                if ((window.from !== null && from === null) || (window.to !== null && to === null) || (from === null && to === null)) add(rulePath + ".window", "Open-ended window requires one valid fixed boundary.");
                else if (from !== null && to !== null && from > to) add(rulePath + ".window", "Open-ended interval is reversed.");
            } else if (window.kind === "ROLLING_PERIOD") {
                if (!(Number(window.period?.value) > 0) || window.period?.unit !== "YEARS" || !window.anchor) add(rulePath + ".window", "ROLLING_PERIOD requires a positive YEARS period and anchor.");
            }
            if (rule.userInputField !== null && !fieldIds.has(rule.userInputField)) add(rulePath + ".userInputField", "Unknown input field " + rule.userInputField + ".");
            validateCondition(rule.appliesWhen, fieldIds, add, rulePath + ".appliesWhen");
            if (isoTime(rule.evidence?.checkedAt) === null) add(rulePath + ".evidence.checkedAt", "Evidence checkedAt must be a valid ISO date.");
            const locator = locatorReference(rule.evidence?.locator);
            const canonicalReference = locator || "Brak potwierdzonego locatora";
            if (rule.evidence?.state === "SUPPORTED" && !locator) add(rulePath + ".evidence.locator", "SUPPORTED evidence requires a canonical locator.");
            if (rule.evidence?.reference && rule.evidence.reference !== canonicalReference) add(rulePath + ".evidence.reference", "Evidence reference must be generated from the canonical locator.");
            if (rule.window?.kind !== "UNKNOWN" && rule.evidence?.state !== "GAP" && !(rule.evidence?.sourceIds || []).length) add(rulePath + ".evidence.sourceIds", "A decision-capable rule requires source coverage.");
            const promotionSources = new Set(promotion?.sourceRefs || []);
            for (const id of rule.evidence?.sourceIds || []) {
                if (!sourceIds.has(id)) add(rulePath + ".evidence.sourceIds", "Unknown source " + id + ".");
                else if (promotion && !promotionSources.has(id)) add(rulePath + ".evidence.sourceIds", "Source " + id + " does not belong to promotion " + promotion.id + ".");
            }
        });
        (offer.evidence?.conflicts || []).forEach((conflict, index) => {
            const conflictPath = base + ".decision.evidence.conflicts[" + index + "]";
            if (!conflict.description || !conflict.resolutionStatus) add(conflictPath, "Conflict requires description and resolutionStatus.");
            if (conflict.message) add(conflictPath + ".message", "Legacy conflict message is not canonical.");
        });
    });
    return { status: errors.length ? "FAIL" : "PASS", errors, exitCode: errors.length ? 1 : 0 };
}

async function main() {
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const root = path.resolve(scriptDir, "..");
    const [contractData, decisionData] = await Promise.all([
        readFile(path.join(root, "frontend/data/eligibility-v2.json"), "utf8").then(JSON.parse),
        readFile(path.join(root, "frontend/data/decision-offers.json"), "utf8").then(JSON.parse)
    ]);
    const report = validateEligibilityV2(contractData, decisionData);
    console.log("NORTH ELIGIBILITY V2 VALIDATION");
    console.log("===============================");
    report.errors.forEach((error) => console.log("✗ " + error.path + ": " + error.message));
    console.log("\n" + report.status + ": " + report.errors.length + " error(s)");
    process.exitCode = report.exitCode;
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) await main();
