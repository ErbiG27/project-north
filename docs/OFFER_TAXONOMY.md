# ProjectNorth — Offer Taxonomy

> Cel: nie mylić produktu użytkownika z promocją, wariantem, segmentem ani rekordem kampanii afiliacyjnej.

## Warstwy

| Warstwa | Definicja | Przykład |
| --- | --- | --- |
| **Bank / Provider** | Podmiot dostarczający produkt. | mBank. |
| **Product Identity** | Produkt, który użytkownik prawnie i funkcjonalnie otwiera. | eKonto do usług. |
| **Promotion Edition** | Konkretny regulamin promocji z własnym okresem, kwalifikacją i składnikami. | Bieżąca edycja promocji do 1 000 zł. |
| **Promotion Variant** | Odmienna ścieżka nagrody, kanału lub segmentu dotycząca tego samego produktu; nie musi łączyć się z innym wariantem. | Media Expert albo bonus mobilny. |
| **User Segment** | Grupa użytkowników materialnie wpływająca na kwalifikację lub sens. | 18–24, affluent, traveler, new-to-bank. |
| **Affiliate Campaign** | Sposób rozliczenia wydawcy dla określonego produktu/wariantu w danej sieci. | Osobna kampania desktop/mobile. |
| **Affiliate Source / Network** | Sieć lub direct program dostarczający kampanię. | Money2Money, ComperiaLead, LeadStar, direct. |
| **Placement / Traffic Source** | Miejsce i kontekst ruchu. | Facebook, grupa Facebook, SEO, article, Discord. |

## Product decision flow

```text
USER
  ↓
NEED / SCENARIO
  ↓
PRODUCT
  ↓
ELIGIBLE PROMOTION / VARIANT
  ↓
NORTH VALUE + MATCH + VERDICT
```

Dopiero po niezależnej decyzji produktowej:

```text
SELECTED PRODUCT / VARIANT
  ↓
ALLOWED AFFILIATE SOURCE
  ↓
BEST OPERATIONAL SOURCE
```

Nie wolno odwracać tej kolejności. Kampania z najwyższym CPA nie staje się przez to najlepszym produktem ani nową ofertą użytkownika.

## Przykład mBank

Provider `mBank` może mieć kilka Product Identities, np. eKonto do usług, wariant młodzieżowy lub mKonto Intensive. Każdy produkt może mieć własne Promotion Editions. Ten sam produkt może równolegle mieć podstawową promocję, Media Expert, bonus mobilny albo inny Promotion Variant.

Sieci mogą osobno wystawiać kampanie Money2Money desktop/mobile, ComperiaLead, LeadStar lub direct, a bonus wolumenowy może dotyczyć ekonomii wydawcy, nie użytkownika. Rekord kampanii nie dowodzi nowej Product Identity i nie uzasadnia osobnej karty North.

## Reguły identity i deduplikacji

- Najpierw ustal, jaki produkt użytkownik faktycznie zawiera.
- Następnie ustal obowiązującą Promotion Edition i kwalifikowany wariant.
- Nie sumuj wariantów bez `stackability: confirmed` w official evidence.
- Linked promotion nie zwiększa głównego `advertisedMax` produktu.
- Segment użytkownika może zmieniać kwalifikację lub właściwy wariant, ale nie tworzy automatycznie nowego produktu.
- Dwie kampanie różnych sieci dla tego samego produktu/wariantu są dwiema ścieżkami operacyjnymi, nie dwiema ofertami użytkownika.

## Preferred Affiliate Source

Preferred Source może zależeć od:

- produktu;
- Promotion Variant;
- User Segment;
- placementu;
- urządzenia;
- kanału ruchu;
- dozwolonych zasad, trackingu, acceptance, reversal i czasu rozliczenia.

Nigdy nie może zmieniać wcześniejszego Product Verdict, North Value, Match, Confidence produktu ani kolejności ofert.

## Aktywny follow-up v0.8.0

**mBank Product & Promotion Variant Mapping** — etap został otwarty 24.08.2026 jako pierwszy przypadek Alternative Comparison. Mapowanie, official evidence i kontrakt rozdzielają trzy Product Identities, a lokalny bounded UI prototype konsumuje je na osobnej trasie noindex. Founder Review i wymagany UX density pass zakończyły się PASS. Prototyp nie zmienia `decision-offers.json`, homepage, sitemap ani publicznego katalogu; integracja z publicznym flow wymaga osobnej decyzji po kolejnym Founder Review.
