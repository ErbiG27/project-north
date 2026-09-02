import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { decisionCapableFixture, loadProductionNorth } from "./lib/production-north-harness.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const production = await loadProductionNorth(root);
const { NorthMatch, NorthOffers, offers, requested, sourceData } = production;
const TODAY = "2026-09-02";

const pekaoValues = {
    residencePoland: true,
    age: 25,
    pekaoCashRelationshipClear: true,
    pekaoTravelRelationshipClear: true,
    pekaoCashDocumentEligible: true,
    pekaoCashOpeningPathEligible: true,
    pekaoTravelOpeningPathEligible: true,
    commitmentMonths: 12,
    acceptsRecurring: true,
    maintainsConsents: true,
    monthOneCardPayments: 5,
    monthTwoCardPayments: 5,
    avoidsCardFee: true,
    includeTravel: true,
    firstTransactionsSpend: 3334,
    laterTransactionsSpend: 1667,
    travelMonths: 12,
    travelSpend: 12000,
    travelExpenseCount: 2,
    acceptsRestrictedReward: true
};

const makePekao = () => decisionCapableFixture(offers.get("bank-pekao-konto-przekorzystne"), TODAY);
const byComponent = (result, id) => result.componentResults.find((item) => item.rule.componentId === id);

test("production loader uses both versioned JSON assets with no-store", () => {
    assert.equal(requested.length, 2);
    for (const request of requested) {
        assert.match(request.url, /v=north-static-2026-09-02-r2/);
        assert.equal(request.options.cache, "no-store");
    }
});

test("eligibility copy comes only from each offer contract", () => {
    const expected = {
        "bank-pekao-konto-przekorzystne": "Promocja 300 zł i część podróżna mają osobne warunki kwalifikacji i osobne ścieżki otwarcia.",
        "mbank-ekonto-do-uslug": "Karencja rachunkowa obowiązuje każdy wariant; Mobile i Media mają dodatkowy warunek braku innych produktów przy wejściu.",
        "pko-konto-za-zero": "Karencja jest wariantowa: Letni Bonus i Rabat w górę mają potwierdzone okno; Allegro pozostaje EVIDENCE_GAP.",
        "unicredit-konto-osobiste": "Vouchery wymagają braku wcześniejszej relacji z UniCredit lub Aion; funkcje konta nie są bramkowane tą promocją.",
        "alior-konto-plus": "Karencja obejmuje rachunek osobisty w ciągu 3 lat przed wnioskiem, nie wszystkie relacje z bankiem."
    };
    for (const [id, copy] of Object.entries(expected)) {
        const item = offers.get(id);
        assert.equal(NorthOffers.eligibilitySummary(item), copy);
        const promotions = new Map(item.promotionVariants.map((promotion) => [promotion.id, promotion]));
        for (const rule of item.eligibility.contractV2.rules) {
            const promotion = promotions.get(rule.scope.promotionId);
            assert(promotion);
            assert(rule.scope.componentIds.every((componentId) => promotion.rewardComponents.includes(componentId)));
            assert(rule.evidence.sourceIds.every((sourceId) => promotion.sourceRefs.includes(sourceId)));
        }
    }
    assert.equal(NorthOffers.eligibilitySummary(offers.get("revolut-standard")).includes("mBank"), false);
    assert.equal(NorthOffers.eligibilitySummary(offers.get("velobank-elastyczne-konto-oszczednosciowe")).includes("Alior"), false);
});

test("Pekao cash opening path respects TRUE, FALSE and UNKNOWN without gating travel", () => {
    const item = makePekao();
    const yes = NorthMatch.evaluate(item, { ...pekaoValues, pekaoCashOpeningPathEligible: true }, { today: TODAY });
    assert.equal(byComponent(yes, "pekao-opening-reward").earned, true);
    const no = NorthMatch.evaluate(item, { ...pekaoValues, pekaoCashOpeningPathEligible: false }, { today: TODAY });
    assert.equal(byComponent(no, "pekao-opening-reward").eligibilityState, "INELIGIBLE");
    assert.equal(byComponent(no, "pekao-travel-rewards").earned, true);
    const unknown = NorthMatch.evaluate(item, { ...pekaoValues, pekaoCashOpeningPathEligible: "unknown" }, { today: TODAY });
    assert.equal(byComponent(unknown, "pekao-opening-reward").eligibilityState, "NEEDS_USER_INPUT");
    assert.equal(byComponent(unknown, "pekao-travel-rewards").earned, true);
    assert.equal(unknown.match, "CANNOT ASSESS");
});

test("Pekao travel opening path respects TRUE, FALSE and UNKNOWN without gating cash", () => {
    const item = makePekao();
    const yes = NorthMatch.evaluate(item, { ...pekaoValues, pekaoTravelOpeningPathEligible: true }, { today: TODAY });
    assert.equal(byComponent(yes, "pekao-travel-rewards").earned, true);
    const no = NorthMatch.evaluate(item, { ...pekaoValues, pekaoTravelOpeningPathEligible: false }, { today: TODAY });
    assert.equal(byComponent(no, "pekao-travel-rewards").eligibilityState, "INELIGIBLE");
    assert.equal(byComponent(no, "pekao-opening-reward").earned, true);
    assert.equal(no.valueBuckets.find((bucket) => bucket.form === "cash").gross, 300);
    const unknown = NorthMatch.evaluate(item, { ...pekaoValues, pekaoTravelOpeningPathEligible: "unknown" }, { today: TODAY });
    assert.equal(byComponent(unknown, "pekao-travel-rewards").eligibilityState, "NEEDS_USER_INPUT");
    assert.equal(byComponent(unknown, "pekao-opening-reward").earned, true);
    assert.equal(unknown.match, "CANNOT ASSESS");
});

test("mixed generation is rejected by loader and fails closed in match runtime", async () => {
    const mixed = structuredClone(sourceData.eligibilityData);
    mixed.runtimeIdentity.buildId = "stale-build";
    await assert.rejects(() => loadProductionNorth(root, { eligibilityData: mixed }), /Niezgodna generacja danych North/);
    const item = makePekao();
    item.runtimeIdentity = { ...item.runtimeIdentity, buildId: "stale-build" };
    const result = NorthMatch.evaluate(item, pekaoValues, { today: TODAY });
    assert.equal(result.match, "CANNOT ASSESS");
    assert.equal(result.verdict, "NOT ENOUGH DATA");
    assert.equal(result.capability.eligibility, "EVIDENCE_GAP");
    assert.equal(result.gross, null);
});

test("component and contract ID drift never yields a positive decision", () => {
    const mutations = [
        (item) => { item.eligibility.contractV2.rules[0].scope.componentIds[0] = "missing-component"; },
        (item) => { item.eligibility.contractV2.rules[0].scope.promotionId = "unknown-promotion"; },
        (item) => { item.eligibility.contractV2.offerId = "stale-offer-id"; },
        (item) => { item.eligibility.contractV2.rules[0].scope.offerId = "other-offer"; },
        (item) => { item.eligibility.contractV2.rules[0].scope.componentIds[0] = "pekao-travel-rewards"; },
        (item) => { item.eligibility.contractV2.rules[0].evidence.sourceIds[0] = "stale-source"; }
    ];
    for (const mutate of mutations) {
        const item = makePekao();
        mutate(item);
        const integrity = NorthOffers.contractIntegrity(item, item.eligibility.contractV2);
        assert.equal(integrity.ok, false);
        const result = NorthMatch.evaluate(item, pekaoValues, { today: TODAY });
        assert.equal(result.match, "CANNOT ASSESS");
        assert.equal(result.verdict, "NOT ENOUGH DATA");
        assert.notEqual(result.capability.eligibility, "CAN_ANSWER");
    }
});

test("Pekao source edition drift degrades evidence and legacy HIGH", () => {
    const item = offers.get("bank-pekao-konto-przekorzystne");
    assert.equal(item.evidence.sources.find((entry) => entry.id === "pekao-reg-start-ii").documentIdentity.currentUrlMatchesExpected, false);
    assert.equal(item.evidence.sources.find((entry) => entry.id === "pekao-reg-travel").documentIdentity.currentUrlMatchesExpected, false);
    assert.equal(NorthOffers.contractEvidenceState(item), "EVIDENCE_GAP");
    assert.equal(NorthOffers.effectiveConfidenceBand(item, TODAY), "UNKNOWN");
    const result = NorthMatch.evaluate(item, pekaoValues, { today: TODAY });
    assert.equal(result.match, "CANNOT ASSESS");
    assert.notEqual(result.capability.eligibility, "CAN_ANSWER");
});

test("all five V2 offers can reach an exact answer with complete critical facts and evidence", () => {
    const scenarios = [
        ["bank-pekao-konto-przekorzystne", pekaoValues],
        ["mbank-ekonto-do-uslug", { relationshipClear: true, variant: "main", initialActions: true, months: 6, monthlySpend: 350, openingMethod: true, salary: true, child: true, valuesVoucher: true, mbankNoOtherProductsAtEntry: true }],
        ["pko-konto-za-zero", { relationshipClear: true, variant: "letni", monthlySpend: 1000, months: 5, plannedSamsung: false, samsungPurchase: 0, monthlyInflow: 0, extraProduct: false, valuesVoucher: true }],
        ["unicredit-konto-osobiste", { relationshipClear: true, months: 2, monthlyInflow: 3000, monthlySpend: 1000, valuesVouchers: true, valuesFeatures: true }],
        ["alior-konto-plus", { age: 30, relationshipClear: true, monthlyInflow: 1000, monthlyPayments: 3, months: 4, valuesRing: true, feeWaiverInflow: true, feeWaiverPayments: true }]
    ];
    for (const [id, values] of scenarios) {
        const item = decisionCapableFixture(offers.get(id), TODAY);
        const result = NorthMatch.evaluate(item, values, { today: TODAY });
        assert(["FIT", "CONDITIONAL FIT"].includes(result.match), id + " returned " + result.match + ": " + JSON.stringify(result.gaps));
        assert.equal(result.verdict, "TAKE IF", id);
        assert.equal(result.capability.eligibility, "CAN_ANSWER", id);
        assert.equal(result.capability.value, "CAN_ANSWER", id);
        assert.equal(result.capability.freshness, "CAN_ANSWER", id);
    }
});

test("Pekao V2 never exposes gross=2700 as one scalar", () => {
    const result = NorthMatch.evaluate(makePekao(), pekaoValues, { today: TODAY });
    assert.equal(result.gross, null);
    assert.equal(JSON.stringify(result.valueBuckets.map((bucket) => [bucket.form, bucket.currency, bucket.gross])), JSON.stringify([["cash", "PLN", 300], ["cashback", "PLN", 2400]]));
    assert.equal(result.valueBuckets.some((bucket) => bucket.form === "cash" && bucket.gross === 2700), false);
});
