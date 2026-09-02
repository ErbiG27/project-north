import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { decisionCapableFixture, loadProductionNorth } from "./lib/production-north-harness.mjs";
import { validateEligibilityV2 } from "./validate-eligibility-v2.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = "2026-09-02";
const production = await loadProductionNorth(root, { now: TODAY });
const { NorthMatch, NorthOffers, offers, sourceData } = production;

const mbankValues = {
    relationshipClear: true,
    variant: "main",
    initialActions: true,
    months: 6,
    monthlySpend: 350,
    openingMethod: true,
    salary: true,
    child: true,
    valuesVoucher: true,
    mbankNoOtherProductsAtEntry: true
};

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

const mutationCases = [
    {
        name: "unknown componentId",
        offerId: "mbank-ekonto-do-uslug",
        mutate: (offer) => { offer.match.componentRules[0].componentId = "missing-component"; }
    },
    {
        name: "duplicate component mapping",
        offerId: "mbank-ekonto-do-uslug",
        mutate: (offer) => { offer.match.componentRules[0].componentId = offer.match.componentRules[1].componentId; }
    },
    {
        name: "unknown component condition field",
        offerId: "mbank-ekonto-do-uslug",
        mutate: (offer) => { offer.match.componentRules[0].when.field = "missing-field"; }
    },
    {
        name: "unknown includeWhen field",
        offerId: "mbank-ekonto-do-uslug",
        mutate: (offer) => { offer.match.componentRules[0].includeWhen.field = "missing-field"; }
    },
    {
        name: "unknown formula input field",
        offerId: "bank-pekao-konto-przekorzystne",
        mutate: (offer) => { offer.match.componentRules[3].formula.travelSpendField = "missing-field"; }
    },
    {
        name: "unknown usability field",
        offerId: "mbank-ekonto-do-uslug",
        mutate: (offer) => { offer.match.componentRules[7].usabilityFactorField = "missing-field"; }
    },
    {
        name: "unknown cost condition field",
        offerId: "bank-pekao-konto-przekorzystne",
        mutate: (offer) => { offer.match.costRules[0].when.all[0].field = "missing-field"; }
    },
    {
        name: "unknown eligibility condition field",
        offerId: "mbank-ekonto-do-uslug",
        mutate: (offer) => { offer.match.eligibilityRules[0].when.field = "missing-field"; }
    }
];

test("all eight decision-path mutations fail validator and runtime closed", () => {
    for (const mutation of mutationCases) {
        const decision = structuredClone(sourceData.decisionData);
        const eligibility = structuredClone(sourceData.eligibilityData);
        const rawOffer = decision.offers.find((offer) => offer.identity.id === mutation.offerId);
        mutation.mutate(rawOffer);
        assert.equal(validateEligibilityV2(eligibility, decision).status, "FAIL", mutation.name + " validator");

        const runtimeOffer = decisionCapableFixture(offers.get(mutation.offerId), TODAY);
        mutation.mutate(runtimeOffer);
        assert.equal(NorthOffers.contractIntegrity(runtimeOffer, runtimeOffer.eligibility.contractV2).ok, false, mutation.name + " integrity");
        const values = mutation.offerId === "mbank-ekonto-do-uslug" ? mbankValues : pekaoValues;
        const result = NorthMatch.evaluate(runtimeOffer, values, { today: TODAY });
        assert.equal(result.match, "CANNOT ASSESS", mutation.name);
        assert.equal(result.verdict, "NOT ENOUGH DATA", mutation.name);
        assert.equal(result.capability.eligibility, "EVIDENCE_GAP", mutation.name);
        assert.equal(result.gross, null, mutation.name);
    }
});

test("canonical locator object generates the runtime evidence reference", () => {
    for (const offer of offers.values()) {
        for (const rule of offer.eligibility?.contractV2?.rules || []) {
            const canonical = NorthOffers.locatorReference(rule.evidence.locator);
            if (rule.evidence.state === "SUPPORTED") assert(canonical, rule.id + " locator");
            assert.equal(rule.evidence.reference, canonical || "Brak potwierdzonego locatora", rule.id);
        }
    }

    const eligibility = structuredClone(sourceData.eligibilityData);
    const rule = eligibility.offers["pko-konto-za-zero"].rules[0];
    rule.evidence.reference = "niezależny, rozjechany tekst";
    assert.equal(validateEligibilityV2(eligibility, sourceData.decisionData).status, "FAIL");
});

test("mixed-generation and V2 legacy bypass paths fail closed before scalar evaluation", async () => {
    const oldEligibility = structuredClone(sourceData.eligibilityData);
    oldEligibility.runtimeIdentity.buildId = "north-static-2026-09-02-r1";
    await assert.rejects(() => loadProductionNorth(root, { eligibilityData: oldEligibility }), /Niezgodna generacja danych North/);

    const oldDecision = structuredClone(sourceData.decisionData);
    oldDecision.runtimeIdentity.buildId = "north-static-2026-09-02-r1";
    await assert.rejects(() => loadProductionNorth(root, { decisionData: oldDecision }), /Niezgodna generacja danych North/);

    const newDataWithoutContract = decisionCapableFixture(offers.get("bank-pekao-konto-przekorzystne"), TODAY);
    delete newDataWithoutContract.eligibility.contractV2;
    const legacyBypass = NorthMatch.evaluate(newDataWithoutContract, pekaoValues, { today: TODAY });
    assert.equal(legacyBypass.match, "CANNOT ASSESS");
    assert.equal(legacyBypass.gross, null);

    const oldDataInNewRuntime = decisionCapableFixture(offers.get("bank-pekao-konto-przekorzystne"), TODAY);
    delete oldDataInNewRuntime.runtimeIdentity;
    const oldDataResult = NorthMatch.evaluate(oldDataInNewRuntime, pekaoValues, { today: TODAY });
    assert.equal(oldDataResult.match, "CANNOT ASSESS");
    assert.equal(oldDataResult.gross, null);
});

function assertProductionFreshnessContract(runtime) {
    for (const offer of runtime.data.offers) {
        assert.deepEqual(runtime.NorthOffers.freshnessFor(offer), runtime.NorthOffers.freshnessFor(offer, TODAY), offer.identity.id);
        const freshness = runtime.NorthOffers.freshnessFor(offer);
        if (!["CURRENT", "RECHECK_SOON"].includes(freshness.state)) {
            assert.equal(runtime.NorthOffers.effectiveConfidenceBand(offer), "UNKNOWN", offer.identity.id);
        }
    }
}

test("production no-arg freshness and injected-date freshness share one core path", async () => {
    assertProductionFreshnessContract(production);
    const mutant = await loadProductionNorth(root, {
        now: TODAY,
        offersSourceTransform: (source) => source.replace(
            "return freshnessAt(offer, today || warsawIsoDate());",
            "return freshnessAt(offer, today || '2026-08-20');"
        )
    });
    assert.throws(() => assertProductionFreshnessContract(mutant), assert.AssertionError);
});

test("Pekao conflict and edition drift have complete truthful runtime presentation", () => {
    const offer = offers.get("bank-pekao-konto-przekorzystne");
    const conflict = offer.evidence.conflicts.find((item) => item.id === "pekao-source-edition-drift-2026-09-02");
    assert(conflict.description);
    assert.match(conflict.resolutionStatus, /CONFLICTING/);
    assert.equal(conflict.message, undefined);

    const edition = NorthOffers.editionSurface(offer);
    assert.equal(edition.conflicting, true);
    assert.match(edition.reviewLabel, /ponownej weryfikacji/);
    assert.match(edition.explanation, /URL-em zostało zmienione/);
    assert.match(edition.explanation, /nie zna jeszcze wyniku/);

    const source = offer.evidence.sources.find((item) => item.id === "pekao-reg-start-ii");
    const item = offer.evidence.fieldSources.find((entry) => entry.sourceId === source.id && entry.fieldPath === "eligibility");
    const presentation = NorthOffers.evidencePresentation(item, source);
    assert.equal(presentation.supportLevel, "conflicting");
    assert.match(presentation.reference, /edycja II/);
    assert.match(presentation.reference, /edycja III/);
    assert.match(presentation.reference, /ponownej weryfikacji/);
});
