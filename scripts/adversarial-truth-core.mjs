import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { decisionCapableFixture, loadProductionNorth } from "./lib/production-north-harness.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const production = await loadProductionNorth(root);
const { NorthMatch, NorthOffers, offers, sourceData } = production;
const today = "2026-09-02";
const base = {
    residencePoland: true, age: 25, pekaoCashRelationshipClear: true, pekaoTravelRelationshipClear: true,
    pekaoCashDocumentEligible: true, pekaoCashOpeningPathEligible: true, pekaoTravelOpeningPathEligible: true,
    commitmentMonths: 12, acceptsRecurring: true, maintainsConsents: true, monthOneCardPayments: 5,
    monthTwoCardPayments: 5, avoidsCardFee: true, includeTravel: true, firstTransactionsSpend: 3334,
    laterTransactionsSpend: 1667, travelMonths: 12, travelSpend: 12000, travelExpenseCount: 2,
    acceptsRestrictedReward: true
};
const capable = () => decisionCapableFixture(offers.get("bank-pekao-konto-przekorzystne"), today);
const checks = [];
const check = async (name, assertion) => { await assertion(); checks.push(name); };

await check("false-positive eligibility", () => {
    const item = capable();
    item.eligibility.contractV2.rules[0].window.from = "invalid";
    assert.equal(NorthMatch.evidenceCapability(item, "eligibility", { today, values: base, rules: [item.eligibility.contractV2.rules[0]] }).state, "EVIDENCE_GAP");
});
await check("false-negative eligibility", () => {
    const result = NorthMatch.evaluate(capable(), { ...base, pekaoTravelOpeningPathEligible: false }, { today });
    assert.equal(result.valueBuckets.find((bucket) => bucket.form === "cash").gross, 300);
    assert.equal(result.componentResults.find((item) => item.rule.componentId === "pekao-travel-rewards").eligibilityState, "INELIGIBLE");
});
await check("false cash representation", () => {
    const result = NorthMatch.evaluate(capable(), base, { today });
    assert.equal(result.gross, null);
    assert.equal(result.valueBuckets.some((bucket) => bucket.form === "cash" && bucket.gross === 2700), false);
});
await check("stale-data false confidence", () => {
    const item = offers.get("bank-pekao-konto-przekorzystne");
    const result = NorthMatch.evaluate(item, base, { today });
    assert.equal(result.capability.eligibility, "CONFLICTING");
    assert.equal(result.match, "CANNOT ASSESS");
    assert.equal(NorthOffers.effectiveConfidenceBand(item, today), "UNKNOWN");
});
await check("evidence overclaim", () => {
    const item = capable();
    const rule = item.eligibility.contractV2.rules[0];
    item.evidence.sources = [];
    assert.equal(NorthMatch.evidenceCapability(item, "eligibility", { today, values: base, rules: [rule] }).state, "UNKNOWN");
});
await check("one-promotion condition gating another", () => {
    const result = NorthMatch.evaluate(capable(), { ...base, pekaoCashRelationshipClear: false, pekaoCashDocumentEligible: false, pekaoCashOpeningPathEligible: false }, { today });
    assert.equal(result.componentResults.find((item) => item.rule.componentId === "pekao-travel-rewards").earned, true);
    assert.equal(result.componentResults.find((item) => item.rule.componentId === "pekao-opening-reward").eligibilityState, "INELIGIBLE");
});
await check("explicit FALSE is never replaced by TRUE", () => {
    const result = NorthMatch.evaluate(capable(), { ...base, pekaoTravelOpeningPathEligible: false }, { today });
    assert.equal(result.componentResults.find((item) => item.rule.componentId === "pekao-travel-rewards").earned, false);
    assert.notEqual(result.match, "FIT");
});
await check("impossible dates causing PASS", () => {
    const item = capable();
    item.eligibility.contractV2.rules[0].window = { kind: "FIXED_DATE", from: "2026-09-01", to: "2026-08-01", anchor: "promotion_entry" };
    const result = NorthMatch.evaluate(item, base, { today });
    assert.equal(result.match, "CANNOT ASSESS");
    assert.notEqual(result.capability.eligibility, "CAN_ANSWER");
});
await check("mixed generation", async () => {
    const mixed = structuredClone(sourceData.decisionData);
    mixed.runtimeIdentity.buildId = "old-build";
    await assert.rejects(() => loadProductionNorth(root, { decisionData: mixed }), /Niezgodna generacja danych North/);
});
await check("copy vs engine contradiction", async () => {
    const [catalog, detail, methodology] = await Promise.all([
        readFile(path.join(root, "frontend/script.js"), "utf8"),
        readFile(path.join(root, "frontend/offers/offer.js"), "utf8"),
        readFile(path.join(root, "frontend/methodology.html"), "utf8")
    ]);
    assert(catalog.includes("NorthOffers.effectiveConfidenceBand"));
    assert(detail.includes("NorthOffers.eligibilitySummary"));
    assert(methodology.includes("CURRENT") && methodology.includes("CONFLICTING") && methodology.includes("UNKNOWN"));
});

console.log("SPRINT 4A ADVERSARIAL SELF-CHECK");
console.log("================================");
checks.forEach((name) => console.log("PASS " + name));
console.log("\nPASS: " + checks.length + "/" + checks.length);
