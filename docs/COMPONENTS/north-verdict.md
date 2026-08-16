# North Verdict

## Rola

North Verdict to końcowa, warunkowa rekomendacja. Ma powiedzieć użytkownikowi, czy oferta ma sens **dla jego sytuacji**, a nie wygenerować kliknięcie w CTA.

## Aktywne stany Decision Model v1

- `TAKE NOW` — założenia użytkownika są spełnione, a dostępna alternatywa lub brak działania nie daje lepszego wyniku.
- `TAKE IF` — decyzja jest pozytywna wyłącznie przy jawnie wymienionych warunkach osobistych.
- `SKIP` — koszty, ryzyko lub alternatywa przeważają nad wartością oferty.
- `NOT ENOUGH DATA` — źródła lub założenia nie wystarczają do wiarygodnego wniosku.

Stan prognozujący opłacalność czekania nie jest częścią aktywnego UI v0.6.1. Wymaga historii porównywalnych edycji, kosztu czekania i backtestu.

## Kontrakt treści

1. Stan i krótkie podsumowanie.
2. Powody.
3. Warunki.
4. Blockery pozytywnej decyzji lub lista brakujących danych.
5. North Confidence z uzasadnieniem.
6. Porównanie z brakiem działania i, gdy dane pozwalają, alternatywą.
7. Źródła krytycznych przesłanek, data weryfikacji i status.
8. CTA z jasnym oznaczeniem partnerskim, gdy dotyczy.

## Implementacja

Landing pokazuje cztery stany w `.verdict-grid`. Strony Decision Model v1 renderują scenariuszowe Verdict oraz ogólny `.full-verdict` ze wspólnego rekordu. Revolut zachowuje legacy `article.north-verdict` i nie jest wzorcem danych v1.

## Reguły

- Nie używamy absolutów („najlepsza”, „pewny zysk”).
- Werdykt nie może pomijać kosztów, limitów ani obowiązków użytkownika, jeśli wpływają na ocenę.
- CTA jest drugorzędne wobec werdyktu; sekcja pozostaje użyteczna bez kliknięcia.
- Gdy brakuje podstaw do działania, używamy `NOT ENOUGH DATA`; model nie prognozuje przyszłej edycji.
- Werdykt ujawnia założenia i powody, a nie opiera się wyłącznie na Score lub procencie Match.
- Link zewnętrzny ma `rel="sponsored noopener"` i informację o partnerstwie.

## Testy akceptacyjne

- Czy użytkownik wie, dla kogo oferta nie jest dobrym wyborem?
- Czy warunek otrzymania korzyści jest czytelny przed CTA?
- Czy zawartość nadal ma sens po usunięciu marki partnera?
