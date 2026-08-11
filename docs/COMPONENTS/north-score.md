# North Score

## Rola

North Score syntetyzuje ocenę oferty i pokazuje, z czego ona wynika. To narzędzie wyjaśniające, nie ranking marketingowy ani rekomendacja inwestycyjna.

## Dane wejściowe

| Pole | Wymagane | Opis |
| --- | :---: | --- |
| `score` | tak | Liczba 0–100, obliczona według opublikowanej metodologii. |
| `grade` | tak | Litera pomocnicza; mapowanie musi być ustalone centralnie. |
| `summary` | tak | Jedno zdanie wyjaśniające wynik i grupę docelową. |
| `breakdown` | tak | Kryteria, maksima i wynik cząstkowy. |
| `verifiedAt` | docelowo | Data sprawdzenia danych. |

## Obecny UI

`offers/revolut.html` używa `.north-score-card`, `.north-score-ring`, `.north-score-breakdown` i `.north-grade`. Wartość 94/100 oraz rozbicie są obecnie statycznym przykładem wizualnym.

## Reguły metodologiczne

- Każdy składnik ma nazwę, maksymalną liczbę punktów i uzasadnienie.
- Waga nie może być zmieniana dla partnera bez odnotowania decyzji.
- Score pokazujemy tylko wtedy, gdy warunki są zweryfikowane; w przeciwnym razie używamy statusu „w trakcie weryfikacji”.
- Wynik nie może zastąpić sekcji ryzyka ani warunków promocji.

## Dostępność

Pierścień ma `role="img"` i tekstowy opis wyniku. Liczba, ocena literowa oraz breakdown muszą pozostać dostępne jako tekst, nie wyłącznie grafika.

## Następny krok

Zastąpić dekoracyjny pierścień CSS pierścieniem SVG dopiero po ustaleniu metodologii i modelu danych. SVG musi mieć tekstowy odpowiednik i nie może być jedynym nośnikiem wyniku.
