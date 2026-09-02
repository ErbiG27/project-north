import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

export async function loadProductionNorth(root, overrides = {}) {
    const [decisionData, eligibilityData, baseOffersSource, matchSource] = await Promise.all([
        readFile(path.join(root, "frontend/data/decision-offers.json"), "utf8").then(JSON.parse),
        readFile(path.join(root, "frontend/data/eligibility-v2.json"), "utf8").then(JSON.parse),
        readFile(path.join(root, "frontend/data/offers.js"), "utf8"),
        readFile(path.join(root, "frontend/offers/match.js"), "utf8")
    ]);
    const offersSource = overrides.offersSourceTransform ? overrides.offersSourceTransform(baseOffersSource) : baseOffersSource;
    const payloads = {
        decision: structuredClone(overrides.decisionData || decisionData),
        eligibility: structuredClone(overrides.eligibilityData || eligibilityData)
    };
    const requested = [];
    const fetch = async (url, options) => {
        requested.push({ url: String(url), options });
        const clean = String(url).split("?")[0];
        const data = clean.endsWith("eligibility-v2.json") ? payloads.eligibility : payloads.decision;
        return { ok: true, status: 200, json: async () => structuredClone(data) };
    };
    const RuntimeDate = overrides.now
        ? class extends Date {
            constructor(...args) { super(...(args.length ? args : [`${overrides.now}T12:00:00Z`])); }
            static now() { return new Date(`${overrides.now}T12:00:00Z`).getTime(); }
        }
        : Date;
    const sandbox = { window: {}, fetch, console, Intl, Date: RuntimeDate, setTimeout, clearTimeout, structuredClone };
    sandbox.window.window = sandbox.window;
    vm.createContext(sandbox);
    vm.runInContext(offersSource, sandbox, { filename: "frontend/data/offers.js" });
    const data = await sandbox.window.NorthOffers.load("frontend/data/decision-offers.json");
    vm.runInContext(matchSource, sandbox, { filename: "frontend/offers/match.js" });
    return {
        data,
        offers: new Map(data.offers.map((offer) => [offer.identity.id, offer])),
        NorthOffers: sandbox.window.NorthOffers,
        NorthMatch: sandbox.window.NorthMatch,
        requested,
        sourceData: { decisionData, eligibilityData }
    };
}

export function decisionCapableFixture(source, today = "2026-09-02") {
    const offer = structuredClone(source);
    offer.identity.status = "active";
    offer.identity.verifiedAt = today;
    offer.identity.edition.validFrom = "2026-01-01";
    offer.identity.edition.validTo = "2026-12-31";
    offer.identity.edition.certainty = "verified";
    offer.evidence.recheckBy = "2026-12-31";
    offer.evidence.conflicts = [];
    for (const sourceEntry of offer.evidence.sources || []) {
        sourceEntry.status = "current_as_reviewed";
        if (sourceEntry.documentIdentity) sourceEntry.documentIdentity.currentUrlMatchesExpected = true;
    }
    for (const rule of offer.eligibility.contractV2?.rules || []) {
        if (rule.window?.kind !== "UNKNOWN") rule.evidence.state = "SUPPORTED";
        rule.evidence.checkedAt = today;
    }
    return offer;
}
