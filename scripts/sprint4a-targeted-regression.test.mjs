import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateEligibilityV2 } from "./validate-eligibility-v2.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [decision, eligibility] = await Promise.all([
    readFile(path.join(root, "frontend/data/decision-offers.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "frontend/data/eligibility-v2.json"), "utf8").then(JSON.parse)
]);
const offer = (id) => decision.offers.find((item) => item.identity.id === id);

test("canonical V2 contract passes referential integrity validation", () => {
    assert.deepEqual(validateEligibilityV2(eligibility, decision), { status: "PASS", errors: [], exitCode: 0 });
});

test("validator rejects missing componentId, unknown promotionId, stale source and target mismatch", () => {
    const mutations = [
        (data) => { data.offers["bank-pekao-konto-przekorzystne"].rules[0].scope.componentIds[0] = "missing-component"; },
        (data) => { data.offers["bank-pekao-konto-przekorzystne"].rules[0].scope.promotionId = "unknown-promotion"; },
        (data) => { data.offers["bank-pekao-konto-przekorzystne"].rules[0].evidence.sourceIds[0] = "stale-source"; },
        (data) => { data.offers["bank-pekao-konto-przekorzystne"].offerId = "other-offer"; },
        (data) => { data.offers["bank-pekao-konto-przekorzystne"].rules[0].scope.offerId = "other-offer"; },
        (data) => { data.offers["bank-pekao-konto-przekorzystne"].rules[0].scope.componentIds[0] = "pekao-travel-rewards"; }
    ];
    for (const mutate of mutations) {
        const copy = structuredClone(eligibility);
        mutate(copy);
        assert.equal(validateEligibilityV2(copy, decision).status, "FAIL");
    }
});

test("validator rejects mixed build identity", () => {
    const copy = structuredClone(eligibility);
    copy.runtimeIdentity.buildId = "stale-build";
    assert.equal(validateEligibilityV2(copy, decision).status, "FAIL");
});

test("eligibility compatibility copy is mapped to the correct offers", () => {
    assert.match(offer("mbank-ekonto-do-uslug").eligibility.newCustomer.definition, /mBanku/);
    assert.match(offer("pko-konto-za-zero").eligibility.newCustomer.definition, /Letni Bonus/);
    assert.match(offer("alior-konto-plus").eligibility.newCustomer.definition, /3 lata/);
    assert.doesNotMatch(offer("revolut-standard").eligibility.newCustomer.definition, /mBanku/);
    assert.doesNotMatch(offer("velobank-elastyczne-konto-oszczednosciowe").eligibility.newCustomer.definition, /Alior/);
});

test("every answer component is explicitly critical or non-critical", () => {
    for (const [id, contract] of Object.entries(eligibility.offers)) {
        const item = offer(id);
        const critical = new Set(contract.evidenceRequirements.decisionCriticalComponentIds);
        const nonCritical = new Set(contract.evidenceRequirements.nonCriticalComponentIds);
        for (const rule of item.match.componentRules) {
            assert.notEqual(critical.has(rule.componentId), nonCritical.has(rule.componentId), id + ":" + rule.componentId);
        }
    }
});

test("critical positive components have exact fieldSources instead of blanket fallback", () => {
    const positiveIds = {
        "mbank-ekonto-do-uslug": ["mbank-initial", "mbank-activity", "mbank-opening", "mbank-salary", "mbank-child", "mbank-mobile", "mbank-media-cash", "mbank-media-voucher"],
        "pko-konto-za-zero": ["pko-letni-cashback", "pko-letni-completion", "pko-samsung"],
        "unicredit-konto-osobiste": ["unicredit-voucher-1", "unicredit-voucher-2", "unicredit-voucher-3", "unicredit-functional"],
        "alior-konto-plus": ["alior-plus-opening", "alior-plus-stage", "alior-plus-monthly", "alior-plus-ring"]
    };
    for (const [id, componentIds] of Object.entries(positiveIds)) {
        const paths = new Set(offer(id).evidence.fieldSources.map((item) => item.fieldPath));
        for (const componentId of componentIds) assert(paths.has("value.rewardComponents[" + componentId + "]"), id + ":" + componentId);
    }
});

test("critical source locators use anchors that exist in the official documents", () => {
    const rules = eligibility.offers;
    assert.equal(rules["pko-konto-za-zero"].rules[0].evidence.locator.value, "3. Uczestnicy promocji, pkt 2 ppkt 1, str. 3 PDF");
    assert.equal(rules["pko-konto-za-zero"].rules[1].evidence.locator.value, "3. Uczestnicy promocji, pkt 2 ppkt 1, str. 4 PDF");
    assert.equal(rules["unicredit-konto-osobiste"].rules[0].evidence.locator.value, "§3 ust. 17");
    assert.match(rules["alior-konto-plus"].rules[0].evidence.locator.value, /Część 4/);
    assert(rules["mbank-ekonto-do-uslug"].rules.every((rule) => rule.evidence.locator.type === "section_page_heading"));
});

test("Pekao current URLs are edition drift, never SUPPORTED for the historical claim", () => {
    const item = offer("bank-pekao-konto-przekorzystne");
    for (const id of ["pekao-reg-start-ii", "pekao-reg-travel"]) {
        const source = item.evidence.sources.find((entry) => entry.id === id);
        assert.equal(source.status, "edition_drift");
        assert.equal(source.documentIdentity.currentUrlMatchesExpected, false);
        assert.equal(source.lastUrlCheckAt, "2026-09-02");
        assert(source.effectiveDates.expectedPromotion);
        assert(source.effectiveDates.observedAtCurrentUrl);
    }
    assert(eligibility.offers["bank-pekao-konto-przekorzystne"].rules.every((rule) => rule.evidence.state === "GAP"));
});
