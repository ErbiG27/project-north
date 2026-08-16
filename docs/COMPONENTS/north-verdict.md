# North Verdict

## Rola

North Verdict to końcowa, warunkowa rekomendacja. Ma powiedzieć użytkownikowi, czy oferta ma sens **dla jego sytuacji**, a nie wygenerować kliknięcie w CTA.

## Docelowe stany

- `TAKE NOW` — założenia użytkownika są spełnione, a dostępna alternatywa lub brak działania nie daje lepszego wyniku.
- `TAKE IF` — decyzja jest pozytywna wyłącznie przy jawnie wymienionych warunkach osobistych.
- `WAIT` — stan późniejszy; wolno go użyć dopiero z historią porównywalnych edycji, kosztem czekania, confidence i backtestem.
- `SKIP` — koszty, ryzyko lub alternatywa przeważają nad wartością oferty.
- `NOT ENOUGH DATA` — źródła lub założenia nie wystarczają do wiarygodnego wniosku.

## Kontrakt treści

1. Krótki werdykt.
2. Opis grupy, dla której oferta jest odpowiednia.
3. Co najmniej jedno istotne ograniczenie lub warunek.
4. Do trzech punktów podsumowujących.
5. CTA z jasnym oznaczeniem partnerskim, gdy dotyczy.
6. Źródła krytycznych przesłanek, data weryfikacji i status pewności.
7. Lepsza alternatywa albo brak działania, jeśli zmieniają decyzję.

## Implementacja v0.5.9

Komponent jest `article.north-verdict` z częścią `.north-verdict__content` oraz `.north-verdict__action`. Treść Revolut pokazuje obecny wzorzec: odbiorca, korzyść, warunek bonusu i odsyłacz partnerski. Nie implementuje jeszcze pełnego zestawu stanów ani evidence ledger.

## Reguły

- Nie używamy absolutów („najlepsza”, „pewny zysk”).
- Werdykt nie może pomijać kosztów, limitów ani obowiązków użytkownika, jeśli wpływają na ocenę.
- CTA jest drugorzędne wobec werdyktu; sekcja pozostaje użyteczna bez kliknięcia.
- `WAIT` bez danych historycznych i backtestu jest niedozwolony; należy użyć `NOT ENOUGH DATA`, jeśli nie ma podstaw do prognozy.
- Werdykt ujawnia założenia i powody, a nie opiera się wyłącznie na Score lub procencie Match.
- Link zewnętrzny ma `rel="sponsored noopener"` i informację o partnerstwie.

## Testy akceptacyjne

- Czy użytkownik wie, dla kogo oferta nie jest dobrym wyborem?
- Czy warunek otrzymania korzyści jest czytelny przed CTA?
- Czy zawartość nadal ma sens po usunięciu marki partnera?
