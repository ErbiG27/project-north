# North Verdict

## Rola

North Verdict to końcowa, warunkowa rekomendacja. Ma powiedzieć użytkownikowi, czy oferta ma sens **dla jego sytuacji**, a nie wygenerować kliknięcie w CTA.

## Kontrakt treści

1. Krótki werdykt.
2. Opis grupy, dla której oferta jest odpowiednia.
3. Co najmniej jedno istotne ograniczenie lub warunek.
4. Do trzech punktów podsumowujących.
5. CTA z jasnym oznaczeniem partnerskim, gdy dotyczy.

## Implementacja v0.5.9

Komponent jest `article.north-verdict` z częścią `.north-verdict__content` oraz `.north-verdict__action`. Treść Revolut pokazuje wzorzec: odbiorca, korzyść, warunek bonusu i odsyłacz partnerski.

## Reguły

- Nie używamy absolutów („najlepsza”, „pewny zysk”).
- Werdykt nie może pomijać kosztów, limitów ani obowiązków użytkownika, jeśli wpływają na ocenę.
- CTA jest drugorzędne wobec werdyktu; sekcja pozostaje użyteczna bez kliknięcia.
- Link zewnętrzny ma `rel="sponsored noopener"` i informację o partnerstwie.

## Testy akceptacyjne

- Czy użytkownik wie, dla kogo oferta nie jest dobrym wyborem?
- Czy warunek otrzymania korzyści jest czytelny przed CTA?
- Czy zawartość nadal ma sens po usunięciu marki partnera?
