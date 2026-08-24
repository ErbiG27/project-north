#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "frontend" / "data" / "product-identities.json"
SCENARIOS_PATH = ROOT / "frontend" / "data" / "alternative-comparison-prototype.json"

errors = []
checks = 0

def check(condition, message):
    global checks
    checks += 1
    if not condition:
        errors.append(message)

with PRODUCTS_PATH.open(encoding="utf-8") as fh:
    model = json.load(fh)
with SCENARIOS_PATH.open(encoding="utf-8") as fh:
    prototype = json.load(fh)

products = {p["id"]: p for p in model["products"]}
check(len(products) == len(model["products"]), "Product IDs must be unique")
check(set(products) == {
    "mbank-ekonto-mozliwosci-18-24",
    "mbank-ekonto-do-uslug",
    "mbank-mkonto-intensive",
}, "Bounded prototype must contain exactly the three approved mBank Product Identities")

for product in products.values():
    for transition in product.get("lifecycleTransitions", []):
        check(transition["targetProductId"] in products, f"Unknown lifecycle target: {transition['targetProductId']}")

for need in model.get("needs", []):
    for pid in need.get("candidateProductIds", []):
        check(pid in products, f"Unknown need candidate: {pid}")

check(len(model.get("promotionEditions", [])) == 1, "Prototype must have one controlled Promotion Edition")
promotion = model["promotionEditions"][0]
check(set(promotion["eligibleProductIds"]) == set(products), "Promotion edition must reference all three approved Product Identities")
check(promotion["eligibleOwnershipModes"] == ["individual"], "Cała naprzód must remain individual-only")

common_cash = sum(c.get("cashPln", 0) for c in promotion["commonRewardComponents"])
for pid, override in promotion["productOverrides"].items():
    check(pid in products, f"Unknown promotion override Product Identity: {pid}")
    extra_cash = sum(c.get("cashPln", 0) for c in override.get("additionalRewardComponents", []))
    check(common_cash + extra_cash == override["advertisedCashMaxPln"], f"Advertised cash max does not reconcile for {pid}")
    linked = override.get("linkedSavings")
    check(linked is not None, f"Missing linked savings override for {pid}")
    if linked:
        check(linked.get("relationship") == "linked_not_summed", f"Linked savings must not be summed into cash max for {pid}")

intensive_caps = set(products["mbank-mkonto-intensive"].get("functionalCapabilities", []))
for cap in ("premium_service", "foreign_atm_no_fee", "fx_card_no_conversion_fee", "fast_track_chopin"):
    check(cap in intensive_caps, f"Missing Intensive functional capability: {cap}")


def product_eligible(product, inputs):
    age = inputs["age"]
    rules = product["segmentRules"]
    if age < rules["ageMin"]:
        return False
    if rules["ageMax"] is not None and age > rules["ageMax"]:
        return False
    return inputs["ownershipNeed"] in product["ownershipModes"]


def monthly_cost(product, inputs):
    costs = product.get("baseCosts", {})
    total = float(costs.get("accountMonthlyPln", 0)) + float(costs.get("cardMonthlyPln", 0))
    for waiver in product.get("feeWaivers", []):
        fee = waiver["fee"]
        met = False
        if fee == "cardMonthlyPln":
            met = inputs["monthlyCardSpendPln"] >= 350
        elif fee == "accountMonthlyPln":
            met = inputs["monthlyInflowsPln"] >= 10000 or inputs["qualifyingAssetsPln"] >= 100000
        if met:
            total -= float(costs.get(fee, 0))
    return max(total, 0.0)


def promotion_user_eligible(pid, inputs):
    # Contract rule: structural edition applicability is not enough.
    # Product eligibility gates user-specific promotion eligibility.
    return (
        product_eligible(products[pid], inputs)
        and pid in promotion["eligibleProductIds"]
        and inputs["ownershipNeed"] in promotion["eligibleOwnershipModes"]
    )

scenarios = {s["id"]: s for s in prototype["scenarios"]}
check(len(scenarios) == 4, "Prototype must contain exactly four acceptance scenarios")

# 1: young solo standard use
s = scenarios["young-solo-standard-use"]
i = s["inputs"]
check(product_eligible(products["mbank-ekonto-mozliwosci-18-24"], i), "Young product must be eligible for scenario 1")
check(monthly_cost(products["mbank-ekonto-mozliwosci-18-24"], i) == 0, "Young product must cost 0 in scenario 1")
check(products["mbank-ekonto-mozliwosci-18-24"]["cashWithdrawalRules"]["polandFreeFromPln"] < products["mbank-ekonto-do-uslug"]["cashWithdrawalRules"]["polandFreeFromPln"], "Young product must have the lower domestic ATM free threshold")
check(s["expected"]["preferredProductId"] == "mbank-ekonto-mozliwosci-18-24", "Scenario 1 expected winner mismatch")

# 2: adult standard use, no premium
s = scenarios["adult-standard-use-no-premium"]
i = s["inputs"]
check(not product_eligible(products["mbank-ekonto-mozliwosci-18-24"], i), "Youth product must be ineligible for scenario 2")
check(monthly_cost(products["mbank-ekonto-do-uslug"], i) == 0, "eKonto do usług card waiver must be met in scenario 2")
check(monthly_cost(products["mbank-mkonto-intensive"], i) == 49.5, "Intensive fee waiver must not be met in scenario 2")
check(s["expected"]["preferredProductId"] == "mbank-ekonto-do-uslug", "Scenario 2 expected winner mismatch")

# 3: premium-qualified traveler
s = scenarios["premium-qualified-traveler"]
i = s["inputs"]
check(monthly_cost(products["mbank-mkonto-intensive"], i) == 0, "Intensive fee waiver must be met in scenario 3")
check(i["premiumServiceNeed"] and i["travelNeed"], "Scenario 3 must express premium and travel need")
check({"premium_service", "foreign_atm_no_fee", "fx_card_no_conversion_fee", "fast_track_chopin"}.issubset(intensive_caps), "Scenario 3 functional value must be represented in Product Identity data")
check(s["expected"]["preferredProductId"] == "mbank-mkonto-intensive", "Scenario 3 expected winner mismatch")

# 4: shared finances
s = scenarios["shared-finances"]
i = s["inputs"]
check(product_eligible(products["mbank-ekonto-do-uslug"], i), "Joint eKonto do usług must be product-eligible in scenario 4")
check(product_eligible(products["mbank-mkonto-intensive"], i), "Joint Intensive must be product-eligible in scenario 4")
check(not promotion_user_eligible("mbank-ekonto-do-uslug", i), "Cała naprzód must be promotion-ineligible for joint eKonto do usług")
check(not promotion_user_eligible("mbank-mkonto-intensive", i), "Cała naprzód must be promotion-ineligible for joint Intensive")
check(monthly_cost(products["mbank-ekonto-do-uslug"], i) == 0, "Joint eKonto do usług card waiver must be met in scenario 4")
check(monthly_cost(products["mbank-mkonto-intensive"], i) == 49.5, "Joint Intensive fee waiver must not be met in scenario 4")
check(s["expected"]["preferredProductId"] == "mbank-ekonto-do-uslug", "Scenario 4 expected winner mismatch")

if errors:
    print(f"v0.8.0 prototype validation: FAIL ({len(errors)} errors / {checks} checks)")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(f"v0.8.0 prototype validation: PASS ({checks}/{checks} checks)")
print("Acceptance scenarios: 4/4 PASS")
print("Public 12-offer catalog: untouched by this validator")
