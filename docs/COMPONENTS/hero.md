# Hero

## Rola

Hero ma w pierwszych sekundach wyjaśnić, czym jest North lub dana oferta, dla kogo jest i co użytkownik może zrobić dalej. Nie jest miejscem na pełną specyfikację ani agresywną reklamę.

## Warianty

| Wariant | Lokalizacja | Zadanie |
| --- | --- | --- |
| Landing Hero | `index.html` → `.hero` | Wyjaśnić problem decyzyjny i przeprowadzić do analiz. |
| North Hero | `offers/revolut.html` → `.north-hero` | Streścić ofertę i pokazać analizę obok. |

## Kontrakt treści

Landing 2.1 — kierunek specyfikacji: marka, komunikat „Nie pytaj, która premia jest najwyższa. Sprawdź, która ma sens dla Ciebie.”, krótki opis sposobu decyzji, główne CTA, link do metodologii i konkretne dowody zaufania. Landing demonstruje problem i rozbicie wartości; nie prowadzi komunikacji przez North Score.

Oferta — kierunek Decision Model v1: kategoria, marka partnera, status i data weryfikacji, opis dla kogo, do trzech badge’y, `Advertised Max`, `Easy Floor` oraz `Your Likely Value` / `Conditional Max` tam, gdzie ma zastosowanie, koszty i failure points, CTA oraz dashboard analityczny. Nie używamy jednej „realnej korzyści” jako uniwersalnej wartości.

## Reguły

- Jedno H1 na stronę.
- Główne CTA ma prowadzić do realnego celu; bez atrap `#`.
- Nie obiecujemy korzyści bez zastrzeżenia warunków, jeśli są istotne.
- Nie przedstawiamy planowanego modelu decyzji, North Plan ani wiarygodnego `WAIT` jako funkcji istniejącej.
- Na mobile kolejność pozostaje: obietnica → działanie → analiza.
- Dekoracyjne elementy są ukryte przed czytnikiem; podgląd analizy ma zwięzłe `aria-label`.

## Implementacja v0.5.9

Landing wykorzystuje `.hero-content`, `.hero-text`, `.hero-preview`, `.btn--primary`. Strona oferty wykorzystuje `.north-hero`, `.north-hero__summary`, `.north-hero__dashboard` oraz `north-kicker`. Przy 900 px oba układy przechodzą do jednej kolumny. To opis obecnej implementacji; specyfikacja Landing 2.1 nie została jeszcze wdrożona.

## Testy akceptacyjne

- W pięć sekund wiadomo, że North pomaga oceniać oferty.
- CTA i warunki nie są wzajemnie sprzeczne.
- Brak przepełnienia przy długiej nazwie partnera lub tagline.
- Widok jest czytelny przy 320 px i powiększeniu tekstu.
