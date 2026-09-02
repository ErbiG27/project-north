import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { decisionCapableFixture, loadProductionNorth } from "./lib/production-north-harness.mjs";
import { validateEligibilityV2 } from "./validate-eligibility-v2.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const production = await loadProductionNorth(root);
const TODAY = "2026-09-02";

test("compatibility: canonical eligibility contract validates with zero failures", () => {
    assert.equal(validateEligibilityV2(production.sourceData.eligibilityData, production.sourceData.decisionData).status, "PASS");
});

test("compatibility: current Pekao edition drift is exactly CANNOT ASSESS", () => {
    const item = production.offers.get("bank-pekao-konto-przekorzystne");
    const result = production.NorthMatch.evaluate(item, {
        residencePoland: true, age: 25, pekaoCashRelationshipClear: true, pekaoTravelRelationshipClear: true,
        pekaoCashDocumentEligible: true, pekaoCashOpeningPathEligible: true, pekaoTravelOpeningPathEligible: true,
        commitmentMonths: 12, acceptsRecurring: true, maintainsConsents: true, monthOneCardPayments: 5,
        monthTwoCardPayments: 5, includeTravel: false
    }, { today: TODAY });
    assert.equal(result.match, "CANNOT ASSESS");
    assert.equal(result.verdict, "NOT ENOUGH DATA");
    assert(["CONFLICTING", "EVIDENCE_GAP", "STALE"].includes(result.capability.eligibility));
});

test("compatibility: explicitly evidence-complete historical Pekao semantics use separate buckets", () => {
    const item = decisionCapableFixture(production.offers.get("bank-pekao-konto-przekorzystne"), TODAY);
    const result = production.NorthMatch.evaluate(item, {
        residencePoland: true, age: 25, pekaoCashRelationshipClear: true, pekaoTravelRelationshipClear: true,
        pekaoCashDocumentEligible: true, pekaoCashOpeningPathEligible: true, pekaoTravelOpeningPathEligible: true,
        commitmentMonths: 12, acceptsRecurring: true, maintainsConsents: true, monthOneCardPayments: 5,
        monthTwoCardPayments: 5, includeTravel: true, firstTransactionsSpend: 3334, laterTransactionsSpend: 1667,
        travelMonths: 12, travelSpend: 12000, travelExpenseCount: 2, acceptsRestrictedReward: true
    }, { today: TODAY });
    assert.equal(result.match, "FIT");
    assert.equal(result.verdict, "TAKE IF");
    assert.equal(result.gross, null);
    assert.equal(JSON.stringify(result.valueBuckets.map((bucket) => [bucket.form, bucket.gross])), JSON.stringify([["cash", 300], ["cashback", 2400]]));
});

test("compatibility: UniCredit prior relationship gates vouchers but returns exact functional FIT", () => {
    const item = decisionCapableFixture(production.offers.get("unicredit-konto-osobiste"), TODAY);
    const result = production.NorthMatch.evaluate(item, {
        relationshipClear: false, months: 0, monthlyInflow: 0, monthlySpend: 0,
        valuesVouchers: false, valuesFeatures: true
    }, { today: TODAY });
    assert.equal(result.match, "CONDITIONAL FIT");
    assert.equal(result.verdict, "TAKE IF");
    assert.equal(result.functionalFit, true);
});
