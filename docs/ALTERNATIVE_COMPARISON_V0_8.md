# ProjectNorth v0.8.0 — Alternative Comparison & Product Identity Mapping

Status: **approved bounded prototype**

Scope: mBank product family only. This document does not change the public 12-offer catalog and does not authorize a public UI release.

## Product rule

North chooses the right **Product Identity** for the user need before evaluating the active **Promotion Edition / Promotion Variant**.

```text
USER NEED / SCENARIO
  -> PRODUCT IDENTITY
  -> ELIGIBLE PROMOTION / VARIANT
  -> NORTH VALUE + MATCH + VERDICT
```

Affiliate economics remain downstream and cannot influence Product Identity, North Value, Match, Confidence, Verdict, or ordering.

## ProductIdentity contract

Required prototype fields:

- `id`
- `providerId`
- `name`
- `category`
- `segmentRules`
- `ownershipModes`
- `baseCosts`
- `feeWaivers`
- `functionalCapabilities`
- `lifecycleTransitions`
- `evidence`

A Product Identity is the legal/functional product the user actually holds. A promotion, channel, affiliate campaign, user segment, or acquisition path is not automatically a new Product Identity.

## PromotionEdition contract

Required prototype fields:

- `id`
- `name`
- `entryFrom`
- `entryTo`
- `promotionRunsTo`
- `eligibleProductIds`
- `eligibleOwnershipModes`
- `commonRewardComponents`
- `productOverrides`
- `evidence`
- `recheckBy`

One Promotion Edition may apply to multiple Product Identities. Shared terms should be stored once; product-specific reward or requirement differences belong in `productOverrides`.

Promotion variants are not summed unless stackability is explicitly confirmed by official evidence.

## UserNeed / Scenario contract

Prototype inputs:

- `age`
- `ownershipNeed`
- `monthlyInflowsPln`
- `monthlyCardSpendPln`
- `qualifyingAssetsPln`
- `premiumServiceNeed`
- `travelNeed`
- `childNeed`

The prototype deliberately avoids asking for inputs that do not materially change the comparison.

## AlternativeComparison contract

Each candidate exposes:

- `eligibility`
- `northMatch`
- `baseProductCost`
- `promotionEligibility`
- `promotionValue`
- `functionalValue`
- `effort`
- `failureRisk`
- `lifecycleFit`
- `confidence`
- `verdict`

Comparison result:

- `preferredProductId` — nullable
- `decisiveFactors[]`
- `tradeoffs[]`
- `unresolvedFactors[]`

### Hard rules

1. No numeric comparison score or 0–100 match score.
2. `preferredProductId` may be `null`.
3. A higher advertised bonus cannot override poor product fit.
4. Voucher/non-cash value is not silently converted to cash.
5. Confidence describes evidence quality, not attractiveness.
6. Affiliate commission/network is excluded from the product decision.
7. `Do nothing` / no clear winner remain valid outcomes.

## Controlled mBank mapping

Product Identities:

- `mbank-ekonto-mozliwosci-18-24`
- `mbank-ekonto-do-uslug`
- `mbank-mkonto-intensive`

`shared_finances` is an ownership need. It is not a promotion variant and does not create a duplicate product identity by itself.

Current controlled Promotion Edition:

- `mbank-cala-naprzod-2026-i`

It can reference multiple eligible products and apply product-specific overrides rather than duplicating the same promotion object across products.

## Acceptance scenarios

### 1. Young solo / standard use

A 22-year-old standard user can prefer eKonto możliwości even when another product advertises a higher cash maximum, because base product fit and fee structure can dominate the bonus difference.

### 2. Adult standard user / no premium need

A 30-year-old with ordinary usage and no premium need can prefer eKonto do usług when the card waiver is naturally met and the mKonto Intensive fee waiver is not.

### 3. Premium-qualified traveler

A user who naturally qualifies for the Intensive fee waiver and values premium/travel capabilities can prefer mKonto Intensive. The reason must be functional value, not merely the cash promotion.

### 4. Shared finances

A user requiring joint ownership can prefer a joint-capable product even when the current acquisition promotion is individual-only. Product fit and promotion eligibility are separate dimensions.

## Evidence policy

Prototype evidence is restricted to current official mBank product pages, legal notes, fee information, and promotion terms checked on 2026-08-24. Promotion freshness is rechecked by 2026-08-31.

## Out of scope

- visual/public frontend implementation;
- changing the existing 12-offer production catalog;
- Media Expert/mobile stackability resolution;
- affiliate source selection;
- private beta;
- Evidence Review #5;
- production deployment.

## Prototype files

- `frontend/data/product-identities.json`
- `frontend/data/alternative-comparison-prototype.json`

A later bounded UI task may consume these contracts only after prototype validation. 
