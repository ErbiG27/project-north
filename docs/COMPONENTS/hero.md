# Hero

## Rola

Hero ma w pierwszych sekundach wyjaśnić, czym jest North lub dana oferta, dla kogo jest i co użytkownik może zrobić dalej. Nie jest miejscem na pełną specyfikację ani agresywną reklamę.

## Warianty

| Wariant | Lokalizacja | Zadanie |
| --- | --- | --- |
| Landing Hero | `index.html` → `.hero` | Sprzedać metodę North i przeprowadzić do analiz. |
| North Hero | `offers/revolut.html` → `.north-hero` | Streścić ofertę i pokazać analizę obok. |

## Kontrakt treści

Landing: marka, jedno zdanie pozycjonowania, nagłówek wartości, opis, główne CTA, link pomocniczy i maksymalnie trzy dowody zaufania.

Oferta: kategoria, marka partnera, status weryfikacji, opis dla kogo, do trzech badge’y, realna korzyść, CTA, kontekst warunków oraz dashboard analityczny.

## Reguły

- Jedno H1 na stronę.
- Główne CTA ma prowadzić do realnego celu; bez atrap `#`.
- Nie obiecujemy korzyści bez zastrzeżenia warunków, jeśli są istotne.
- Na mobile kolejność pozostaje: obietnica → działanie → analiza.
- Dekoracyjne elementy są ukryte przed czytnikiem; podgląd analizy ma zwięzłe `aria-label`.

## Implementacja v0.5.9

Landing wykorzystuje `.hero-content`, `.hero-text`, `.hero-preview`, `.btn--primary`. Strona oferty wykorzystuje `.north-hero`, `.north-hero__summary`, `.north-hero__dashboard` oraz `north-kicker`. Przy 900 px oba układy przechodzą do jednej kolumny.

## Testy akceptacyjne

- W pięć sekund wiadomo, że North pomaga oceniać oferty.
- CTA i warunki nie są wzajemnie sprzeczne.
- Brak przepełnienia przy długiej nazwie partnera lub tagline.
- Widok jest czytelny przy 320 px i powiększeniu tekstu.
