import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateNorthData, validateNorthDataText } from "./validate-north-data.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(scriptDir, "..", "frontend", "data", "decision-offers.json");
const sourceData = JSON.parse(await readFile(dataPath, "utf8"));
const copyData = () => structuredClone(sourceData);

test("malformed JSON returns FAIL", () => {
    const report = validateNorthDataText('{"offers": [', { today: "2026-08-20" });
    assert.equal(report.status, "FAIL");
    assert.equal(report.exitCode, 1);
    assert(report.entries.some((entry) => entry.section === "Structure" && entry.level === "FAIL"));
});

test("broken landing offer reference returns FAIL", () => {
    const data = copyData();
    data.landingGates.pekaoDemo.offerId = "missing-offer";
    const report = validateNorthData(data, { today: "2026-08-16" });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.path === "$.landingGates.pekaoDemo.offerId"));
});

test("structurally invalid offer returns FAIL instead of crashing", () => {
    const data = copyData();
    data.offers[0] = null;
    const report = validateNorthData(data, { today: "2026-08-20" });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.path === "$.offers[0]"));
});

test("recheck within seven days produces WARN without FAIL", () => {
    const data = copyData();
    data.offers.forEach((offer) => { offer.evidence.recheckBy = "2026-08-23"; });
    const report = validateNorthData(data, { today: "2026-08-20" });
    assert.equal(report.status, "PASS WITH WARNINGS");
    assert.equal(report.exitCode, 0);
    assert(report.counts.WARN > 0);
    assert.equal(report.counts.FAIL, 0);
});

test("zero does not masquerade as a missing requirement amount", () => {
    const data = copyData();
    data.offers[0].eligibility.requiredCapital.amount = { amount: 0, currency: "PLN" };
    const report = validateNorthData(data, { today: "2026-08-16" });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) => entry.path === "$.offers[0].eligibility.requiredCapital.amount"));
});

test("missing required collection ID returns FAIL with its exact path", () => {
    const data = copyData();
    delete data.offers[0].value.rewardComponents[0].id;
    const report = validateNorthData(data, { today: "2026-08-16" });
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
    const report = validateNorthData(data, { today: "2026-08-16" });
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
    const report = validateNorthData(data, { today: "2026-08-16" });
    assert.equal(report.status, "FAIL");
    assert(report.entries.some((entry) =>
        entry.section === "Confidence & Verdict"
        && entry.path === "$.offers[0].decision.northConfidence.band"
        && entry.message === "TAKE NOW requires HIGH Confidence."));
});

test("expired recheck requires LOW freshness and fails as stale evidence", () => {
    const data = copyData();
    data.offers[0].evidence.recheckBy = "2026-08-19";
    data.offers[0].decision.northConfidence.factors.freshness = "HIGH";
    const report = validateNorthData(data, { today: "2026-08-20" });
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

test("unchanged reviewed data has no false FAIL on its review date", () => {
    const report = validateNorthData(copyData(), { today: "2026-08-16" });
    assert.equal(report.exitCode, 0);
    assert.equal(report.counts.FAIL, 0);
});
