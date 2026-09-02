import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateNorthData, validateNorthDataText } from "./validate-north-data.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(scriptDir, "..", "frontend", "data", "decision-offers.json");
const sourceData = JSON.parse(await readFile(dataPath, "utf8"));
const REVIEW_DATE = "2026-09-02";
const shiftIsoDate = (isoDate, days) => {
    const date = new Date(`${isoDate}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
};
const copyData = () => {
    const data = structuredClone(sourceData);
    for (const offer of data.offers) {
        if (["active", "closing"].includes(offer.identity.status) && offer.identity.edition.validTo && offer.identity.edition.validTo < REVIEW_DATE) {
            offer.identity.edition.validTo = "2026-12-31";
        }
        offer.evidence.recheckBy = "2026-12-31";
    }
    Object.values(data.landingGates).forEach((gate) => {
        if (gate && typeof gate === "object" && "recheckBy" in gate) gate.recheckBy = "2026-12-31";
    });
    return data;
};

test("malformed JSON returns FAIL", () => {
    const report = validateNorthDataText('{"offers": [', { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert.equal(report.exitCode, 1);
    assert(report.entries.some((entry) => entry.section === "Structure" && entry.level === "FAIL"));
});

test("broken landing offer reference returns FAIL", () => {
    const data = copyData();
    data.landingGates.pekaoDemo.offerId = "missing-offer";
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.path === "$.landingGates.pekaoDemo.offerId"));
});

test("structurally invalid offer returns FAIL instead of crashing", () => {
    const data = copyData();
    data.offers[0] = null;
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.path === "$.offers[0]"));
});

test("recheck within seven days produces WARN without FAIL", () => {
    const data = copyData();
    const millenniumIndex = data.offers.findIndex((offer) => offer.identity.id === "bank-millennium-millennium-360");
    data.offers[millenniumIndex].evidence.recheckBy = shiftIsoDate(REVIEW_DATE, 3);
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "PASS WITH WARNINGS");
    assert.equal(report.exitCode, 0);
    assert.equal(report.counts.FAIL, 0);
    assert(report.entries.some((entry) =>
        entry.level === "WARN"
        && entry.path === `$.offers[${millenniumIndex}].evidence.recheckBy`));
});

test("zero does not masquerade as a missing requirement amount", () => {
    const data = copyData();
    data.offers[0].eligibility.requiredCapital.amount = { amount: 0, currency: "PLN" };
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.path === "$.offers[0].eligibility.requiredCapital.amount"));
});

test("missing required collection ID returns FAIL with its exact path", () => {
    const data = copyData();
    delete data.offers[0].value.rewardComponents[0].id;
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) =>
        entry.section === "IDs"
        && entry.level === "FAIL"
        && entry.path === "$.offers[0].value.rewardComponents[0].id"));
});

test("positive Verdict is forbidden with LOW Confidence", () => {
    const data = copyData();
    data.offers[0].decision.northConfidence.band = "LOW";
    data.offers[0].decision.verdict.state = "TAKE IF";
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) =>
        entry.section === "Confidence & Verdict"
        && entry.path === "$.offers[0].decision.verdict.state"
        && entry.message.includes("not allowed with LOW Confidence")));
});

test("TAKE NOW requires HIGH Confidence", () => {
    const data = copyData();
    data.offers[0].decision.northConfidence.band = "MEDIUM";
    data.offers[0].decision.verdict.state = "TAKE NOW";
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) =>
        entry.section === "Confidence & Verdict"
        && entry.path === "$.offers[0].decision.northConfidence.band"
        && entry.message === "TAKE NOW requires HIGH Confidence."));
});

test("expired recheck requires LOW freshness and fails as stale evidence", () => {
    const data = copyData();
    data.offers[0].evidence.recheckBy = shiftIsoDate(REVIEW_DATE, -1);
    data.offers[0].decision.northConfidence.factors.freshness = "HIGH";
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) =>
        entry.section === "Freshness"
        && entry.path === "$.offers[0].evidence.recheckBy"
        && entry.message.includes("recheck overdue")));
    assert(report.entries.some((entry) =>
        entry.section === "Confidence & Verdict"
        && entry.path === "$.offers[0].decision.northConfidence.factors.freshness"
        && entry.message === "Expired recheckBy requires the freshness confidence factor to be LOW."));
});

test("normalized current fixture has no false FAIL before a targeted mutation", () => {
    const report = validateNorthData(copyData(), { today: REVIEW_DATE });
    assert.equal(report.exitCode, 0);
    assert.equal(report.counts.FAIL, 0);
});

test("voucher cannot masquerade as cash-equivalent valuation", () => {
    const data = copyData();
    const offer = data.offers.find((item) => item.identity.id === "unicredit-konto-osobiste");
    const voucher = offer.value.rewardComponents.find((item) => item.form === "voucher");
    voucher.valuation.cashEquivalent = true;
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.message.includes("valuation must remain non-cash")));
});

test("cash and non-cash breakdown must equal face value", () => {
    const data = copyData();
    const offer = data.offers.find((item) => item.identity.id === "alior-konto-plus");
    offer.value.advertisedMax.cashValueTotal.amount = 1300;
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.message.includes("cashValueTotal + nonCashValueTotal")));
});

test("yield offer cannot encode annual rate as advertised face value", () => {
    const data = copyData();
    const offer = data.offers.find((item) => item.identity.id === "velobank-elastyczne-konto-oszczednosciowe");
    offer.value.advertisedMax.faceValueTotal = { amount: 6, currency: "PLN" };
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.message.includes("yield-led savings offer")));
});

test("unconfirmed mutually exclusive variants cannot inflate advertised max", () => {
    const data = copyData();
    const offer = data.offers.find((item) => item.identity.id === "erste-konto-smart");
    offer.value.advertisedMax.componentIds = ["erste-completion", "erste-insurance"];
    offer.value.advertisedMax.faceValueTotal = { amount: 600, currency: "PLN" };
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.message.includes("must not automatically combine variants")));
});

test("affiliate economics never enter Match logic", () => {
    const data = copyData();
    const offer = data.offers.find((item) => item.identity.id === "mbank-ekonto-do-uslug");
    offer.match.fields[0].help = "affiliate CPA changes this answer";
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.message.includes("Affiliate economics")));
});

test("positive static catalog Verdict is forbidden", () => {
    const data = copyData();
    const offer = data.offers.find((item) => item.identity.id === "pko-konto-za-zero");
    offer.decision.verdict.state = "TAKE IF";
    const report = validateNorthData(data, { today: REVIEW_DATE });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.message.includes("positive static Verdict")));
});
