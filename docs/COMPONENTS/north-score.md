# North Score

## Rola

North Score może syntetyzować ocenę oferty jako skrót wtórny. Nie jest głównym USP, samodzielną „prawdą” o ofercie ani substytutem scenariusza użytkownika. Kierunek Decision Model v1 rozdziela **North Value** — wartość dla jawnych założeń — od **North Confidence** — jakości, kompletności i aktualności danych oraz wniosku.

## Obecny kontrakt

| Pole | Wymagane | Opis |
| --- | :---: | --- |
| `score` | tak | Liczba 0–100, obliczona według opublikowanej metodologii. |
| `grade` | tak | Litera pomocnicza; mapowanie musi być ustalone centralnie. |
| `summary` | tak | Jedno zdanie wyjaśniające wynik i grupę docelową. |
| `breakdown` | tak | Kryteria, maksima i wynik cząstkowy. |
| `verifiedAt` | docelowo | Data sprawdzenia danych. |

Kontrakt 0–100 opisuje obecny komponent, nie zatwierdzoną metodologię docelową. Nie należy kopiować go do nowych ofert bez walidacji Decision Model v1.

## Obecny UI

`offers/revolut.html` używa `.north-score-card`, `.north-score-ring`, `.north-score-breakdown` i `.north-grade`. Wartość 94/100 oraz rozbicie są obecnie statycznym przykładem wizualnym. Nie dowodzą działania North Value, North Confidence ani spersonalizowanego wyniku.

## Kierunek kontraktu

| Pole | Znaczenie |
| --- | --- |
| `advertisedMax` | Maksimum komunikowane przez oferenta. |
| `easyFloor` | Łatwy rdzeń przy jawnie zdefiniowanych warunkach. |
| `scenarioFormula` / `yourLikelyValue` | Wartość wynikająca z założeń konkretnego scenariusza. |
| `conditionalMax` | Maksimum warunkowe, gdy jego oddzielenie wyjaśnia użyteczność nagrody. |
| `northValue` | Rozkład wartości uwzględniający formę nagrody, koszty, opportunity cost, czas, wysiłek i ryzyko niedowiezienia. |
| `northConfidence` | Jakość, kompletność i aktualność źródeł oraz wniosku, bez fałszywie precyzyjnego procentu. |
| `sources` / `verifiedAt` | Dowody na poziomie pól i data weryfikacji. |

Warstwa wartości ma trzy poziomy: `advertisedMax`, `easyFloor` oraz `yourLikelyValue` / `conditionalMax` tam, gdzie ma zastosowanie. Pola techniczne mogą być rozdzielone, ale interfejs nie powinien sugerować czterech obowiązkowych, równorzędnych wartości.

## Reguły metodologiczne

- Każdy składnik ma nazwę, maksymalną liczbę punktów i uzasadnienie.
- Waga nie może być zmieniana dla partnera bez odnotowania decyzji.
- Score pokazujemy tylko wtedy, gdy warunki i metodologia są zweryfikowane; w przeciwnym razie używamy `NOT ENOUGH DATA` lub statusu „w trakcie weryfikacji”.
- Wynik nie może zastąpić sekcji ryzyka ani warunków promocji.
- Nie publikujemy precyzyjnego Confidence ani Match w procentach, jeśli dane nie uzasadniają takiej skali.

## Dostępność

Pierścień ma `role="img"` i tekstowy opis wyniku. Liczba, ocena literowa oraz breakdown muszą pozostać dostępne jako tekst, nie wyłącznie grafika.

## Następny krok

Najpierw zweryfikować North Value i North Confidence na ofertach Millennium, Nest i Pekao. Dopracowanie wizualne pierścienia pozostaje późniejsze; nie rozwiązuje problemu metodologii ani dowodów.
