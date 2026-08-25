import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { evaluateComparison } from "../frontend/prototypes/mbank-alternative-comparison.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const contractPath = resolve(repoRoot, "frontend/data/mbank-alternative-comparison-v0.8.0.json");
const catalogPath = resolve(repoRoot, "frontend/data/decision-offers.json");
const indexPath = resolve(repoRoot, "frontend/index.html");

const contract = JSON.parse(await readFile(contractPath, "utf8"));
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const indexHtml = await readFile(indexPath, "utf8");

function collectKeys(value, keys = []) {
    if (Array.isArray(value)) {
        value.forEach((item) => collectKeys(item, keys));
        return keys;
    }
    if (!value || typeof value !== "object") return keys;
    Object.entries(value).forEach(([key, nested]) => {
        keys.push(key);
        collectKeys(nested, keys);
    });
    return keys;
}

assert.equal(contract.contractVersion, "north-alternative-comparison-v0.8.0");
assert.equal(contract.status, "bounded_prototype");
assert.equal(contract.inputFields.length, 8, "Flow ma dokładnie osiem materialnych pól.");
assert.equal(contract.productIdentities.length, 3, "Porównanie ma dokładnie trzy Product Identities.");
assert.equal(contract.promotionEditions.length, 1, "Jedna Promotion Edition ma obejmować rodzinę produktów.");
assert.deepEqual(
    new Set(contract.promotionEditions[0].eligibleProductIds),
    new Set(contract.productIdentities.map((product) => product.id)),
    "Jedna edycja musi obejmować wszystkie trzy Product Identities."
);
assert.equal(contract.promotionEditions[0].linkedSavingsRelationship, "linked_not_summed");
assert.equal(contract.decisionPolicy.numericScoreAllowed, false);
assert.equal(contract.decisionPolicy.advertisedMaxCanOverrideProductFit, false);
assert.equal(contract.decisionPolicy.affiliateEconomicsAffectDecision, false);
assert.equal(contract.decisionPolicy.allowNoPreferredProduct, true);
assert.equal(contract.decisionPolicy.doNothingRequired, true);
assert.equal(collectKeys(contract).some((key) => /^score$/i.test(key)), false, "Kontrakt nie może zawierać pola Score.");

for (const product of contract.productIdentities) {
    assert.ok(product.cost.model, `${product.id}: różnica kosztowa musi być deklaratywnym modelem.`);
    assert.ok(contract.promotionEditions[0].productOverrides[product.id], `${product.id}: brak promotion override.`);
    assert.ok(product.functionalValue.length > 0, `${product.id}: brak functional value.`);
}

for (const scenario of contract.acceptanceScenarios) {
    const result = evaluateComparison(contract, scenario.inputs);
    assert.equal(
        result.preferredProductId,
        scenario.expectedPreferredProductId,
        `${scenario.label}: nieprawidłowy Product Identity.`
    );
    if (scenario.expectedPromotionEligibility) {
        const preferred = result.candidates.find((candidate) => candidate.id === result.preferredProductId);
        assert.equal(
            preferred.promotion.status,
            scenario.expectedPromotionEligibility,
            `${scenario.label}: nieprawidłowa Promotion eligibility.`
        );
    }
    console.log(`PASS acceptance: ${scenario.label} -> ${result.preferredProductId}`);
}

const underage = evaluateComparison(contract, {
    ...contract.acceptanceScenarios[0].inputs,
    age: 17
});
assert.equal(underage.preferredProductId, null, "Kontrakt musi obsługiwać brak rekomendowanego produktu.");
console.log("PASS contract: preferredProductId może być null");

const highBonusDoesNotWin = evaluateComparison(contract, contract.acceptanceScenarios[0].inputs);
assert.equal(highBonusDoesNotWin.preferredProductId, "mbank-ekonto-mozliwosci-18-24");
assert.ok(
    contract.promotionEditions[0].productOverrides["mbank-ekonto-do-uslug"].maximumCash
        > contract.promotionEditions[0].productOverrides["mbank-ekonto-mozliwosci-18-24"].maximumCash,
    "Fixture musi dowodzić, że niższa premia może wygrać dzięki Product Fit."
);
console.log("PASS policy: wyższa premia nie zastępuje Product Fit");

const affiliateNeutralInputs = {
    ...contract.acceptanceScenarios[1].inputs,
    affiliateCommission: 999999,
    preferredNetwork: "highest-cpa"
};
assert.equal(
    evaluateComparison(contract, affiliateNeutralInputs).preferredProductId,
    contract.acceptanceScenarios[1].expectedPreferredProductId,
    "Nieznane dane afiliacyjne nie mogą zmienić wyniku."
);
console.log("PASS policy: affiliate economics nie wpływa na wybór");

const activeCatalog = catalog.offers.filter((offer) => offer.identity.status === "active" && offer.identity.category !== "crypto_validation");
assert.equal(activeCatalog.length, 12, "Publiczny katalog musi nadal zawierać 12 ofert.");
assert.equal(indexHtml.includes("mbank-alternative-comparison"), false, "Homepage nie może linkować bounded prototypu.");
console.log("PASS regression: katalog nadal ma 12 ofert i nie linkuje prototypu");

console.log("PASS: mBank Alternative Comparison contract and scenarios validated");
