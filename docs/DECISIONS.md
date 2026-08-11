# Rejestr decyzji

Każdy wpis opisuje decyzję o długotrwałym wpływie. Statusy: **accepted**, **superseded**, **proposed**.

## ADR-001 — North jest przewodnikiem po decyzji

**Status:** accepted · **Data:** 2026-08-10

North ma interpretować ofertę, a nie tylko prezentować jej bonus. Dlatego strona oferty prowadzi od podsumowania przez Score i Snapshot do Verdict.

**Konsekwencja:** CTA nie może dominować nad warunkami, ograniczeniami i rekomendacją.

## ADR-002 — Dane kart są renderowane ze wspólnego źródła

**Status:** accepted · **Data:** 2026-08-10

Katalog wykorzystuje `data/offers.js` i `script.js`, zamiast kopiować dane do HTML.

**Konsekwencja:** dane muszą mieć spójny kontrakt. Przy rozbudowie dopuszczamy migrację do szerszego modelu oferty, ale nie mnożenie równoległych list.

## ADR-003 — Strona Revolut jest wzorcem, nie wyjątkiem

**Status:** accepted · **Data:** 2026-08-10

Układ North Hero, North Score, North Snapshot, North Verdict i badges jest punktem wyjścia dla następnych stron ofert.

**Konsekwencja:** nowe strony mogą zmieniać dane i treść, lecz nie powinny tworzyć kolejnego języka UI bez udokumentowanej potrzeby.

## ADR-004 — Ciemny interfejs z zielenią kierunkową

**Status:** accepted · **Data:** 2026-08-10

Podstawą identyfikacji są czarne/grafitowe powierzchnie, jasna typografia i zielony akcent `#00B894` / `#00D084`.

**Konsekwencja:** kolory stanu i partnerów są wtórne. Zieleń nie oznacza automatycznie „kup” ani „bez ryzyka”.

## ADR-005 — Git ma być źródłem prawdy dla dokumentacji

**Status:** proposed · **Data:** 2026-08-11

Markdown w `/docs` ma być wersjonowany razem z kodem. Narzędzia typu Notion mogą prezentować lub agregować wiedzę, ale nie powinny tworzyć drugiej, rozjeżdżającej się wersji.

**Konsekwencja:** bieżący eksport v0.5.9 nie zawiera metadanych Git; po przeniesieniu do repo należy dodać docs do pierwszego commitu.
