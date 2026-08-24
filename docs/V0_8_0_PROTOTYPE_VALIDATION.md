# ProjectNorth v0.8.0 — Prototype Validation

Date: 2026-08-24

Status: **PASS**

Scope: bounded validation of mBank Product Identity Mapping + Alternative Comparison contract/prototype only. No public frontend implementation, no change to the production 12-offer catalog, no deploy.

## Result

- Contract/data integrity: **43/43 checks PASS**
- Acceptance scenarios: **4/4 PASS**
- Blocking findings: **0**
- Production catalog changes: **0**

## What was validated

### Product Identity integrity

The bounded prototype contains exactly three mBank Product Identities:

- `mbank-ekonto-mozliwosci-18-24`
- `mbank-ekonto-do-uslug`
- `mbank-mkonto-intensive`

`shared_finances` remains a user ownership need, not a duplicate Product Identity and not a Promotion Variant.

Lifecycle and need references resolve to existing Product Identities.

### Promotion Edition integrity

`mbank-cala-naprzod-2026-i` is stored once and references all three Product Identities.

Official promotion terms confirm:

- entry window: 28.05.2026–31.08.2026;
- promotion payout horizon through 30.04.2027;
- eligible products: eKonto możliwości 18–24, eKonto do usług, mKonto Intensive;
- the promotion requires an individual agreement and the account cannot be opened together with another person;
- maximum cash value is 900 PLN for eKonto możliwości and 1000 PLN for eKonto do usług / mKonto Intensive;
- qualifying inflow is 1000 PLN for eKonto możliwości and 2000 PLN for the other two products;
- linked savings differs by Product Identity: 5.3% up to 50,000 PLN for eKonto możliwości / eKonto do usług and 5.5% up to 100,000 PLN for mKonto Intensive.

The linked savings value is explicitly `linked_not_summed` and is not added to the cash promotion maximum.

Official source:
https://www.mbank.pl/pdf/promocje/konta/regulamin-promocji-cala-naprzod-zyskuj-z-kontem-w-mbanku-edycja-i.pdf

Recheck by: **2026-08-31**.

### Base product facts

#### eKonto możliwości 18–24

Validated from the official product page:

- 0 PLN account fee;
- 0 PLN card fee without a spend condition;
- free domestic ATM withdrawal from 100 PLN;
- automatic lifecycle transition to eKonto do usług after the youth product lifecycle ends.

Official source:
https://www.mbank.pl/indywidualny/dla-mlodych/i-mozesz-wiecej/

#### eKonto do usług

Validated from official product/joint-account pages:

- 0 PLN account fee;
- card: 0 PLN after 350 PLN monthly card transactions, otherwise 9 PLN;
- free domestic ATM withdrawal from 300 PLN;
- product can be individual or joint.

Official sources:
https://www.mbank.pl/indywidualny/konta/konta-osobiste/ekonto-do-uslug/
https://www.mbank.pl/indywidualny/konta/konta-osobiste/wspolne/

#### mKonto Intensive

Validated from official product/joint-account pages:

- 49.50 PLN monthly account fee if waiver conditions are not met;
- fee waiver at minimum 10,000 PLN monthly inflows or 100,000 PLN qualifying deposits/investments;
- joint ownership is supported;
- premium/travel capabilities are material Product Identity properties, including foreign ATM benefit, FX card benefit, Fast Track at Warsaw Chopin Airport, premium support and express-transfer benefits.

Official sources:
https://www.mbank.pl/indywidualny/konta/konta-osobiste/mkonto-intensive/
https://www.mbank.pl/indywidualny/konta/konta-osobiste/wspolne-mkonto-intensive/

## Validation findings closed during this pass

1. **Promotion eligibility semantics**
   - Structural applicability of a Promotion Edition to a Product Identity is not the same as user-specific promotion eligibility.
   - Required evaluation order is:

```text
Product Identity eligibility
  -> Promotion Edition applicability
  -> user-specific Promotion eligibility
```

A product-ineligible candidate cannot become user-eligible merely because its Product Identity appears in `eligibleProductIds`.

2. **Yield override was material and missing from the first data pass**
   - Added 5.3% / 50k and 5.5% / 100k Product Identity overrides.
   - Kept as linked value, not cash bonus.

3. **Premium traveler evidence was too generic in the first data pass**
   - Added explicit Intensive functional capabilities so `travelNeed` is evidence-backed rather than inferred from a generic `premium_service` label.

## Acceptance scenarios

### 1. Young solo / standard use — PASS

Expected Product Identity: `mbank-ekonto-mozliwosci-18-24`.

Why the result is supportable:

- age eligible;
- 0 PLN account/card cost;
- no card-spend condition for the base card fee;
- lower domestic ATM free-withdrawal threshold than eKonto do usług;
- it may remain the better product fit even though its current promotion cash maximum is 900 PLN rather than 1000 PLN.

### 2. Adult standard use / no premium need — PASS

Expected Product Identity: `mbank-ekonto-do-uslug`.

Why:

- youth product is age-ineligible;
- 500 PLN monthly card spend satisfies the eKonto do usług card-fee waiver;
- 3000 PLN inflow and 0 PLN qualifying assets do not satisfy the Intensive account-fee waiver;
- there is no declared premium-service need.

### 3. Premium-qualified traveler — PASS

Expected Product Identity: `mbank-mkonto-intensive`.

Why:

- 12,000 PLN monthly inflow satisfies the Intensive fee waiver;
- the scenario declares premium and travel need;
- the Product Identity now explicitly represents relevant functional capabilities;
- cash promotion value is not the deciding factor.

Remaining user-specific uncertainty: actual personal valuation of premium/travel capabilities.

### 4. Shared finances — PASS

Expected Product Identity: `mbank-ekonto-do-uslug`.

Why:

- joint ownership is a product need, not a promotion variant;
- eKonto do usług and Intensive both support joint ownership;
- the current `Cała naprzód` promotion is individual-only, so it is not user-eligible in this ownership mode;
- with 6000 PLN monthly inflows, Intensive does not meet the fee waiver while eKonto do usług remains 0 PLN when the card condition is met.

Remaining non-blocking uncertainty: availability of other current promotions specifically for joint accounts outside the controlled `Cała naprzód` case.

## Validator

Executable bounded validator:

`scripts/validate-v0.8.0-alternative-comparison.py`

It checks reference integrity, Promotion Edition cash reconciliation, linked-savings separation, key functional capabilities, user-specific eligibility gating and all four acceptance scenarios.

Validation result for the current prototype snapshot:

```text
v0.8.0 prototype validation: PASS (43/43 checks)
Acceptance scenarios: 4/4 PASS
```

## Gate decision

**Prototype validation gate: PASSED.**

The next bounded product task may be an interactive Alternative Comparison UI prototype consuming these contracts.

That next task is not authorized to:

- replace or expand the public 12-offer catalog;
- merge Promotion Variant economics into Product Identity;
- introduce numeric match/comparison scoring;
- use affiliate economics in Product Verdict/Match/Confidence/order;
- deploy to production automatically;
- start private beta;
- create Evidence Review #5.
