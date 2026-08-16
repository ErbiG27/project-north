# North Snapshot

## Rola

North Snapshot przekazuje najważniejsze fakty w około dziesięć sekund. Ma odróżnić marketingowe maksimum od wartości dla scenariusza użytkownika oraz pokazać obowiązki, czas i główne punkty utraty nagrody.

## Obecny kontrakt

Każda pozycja zawiera etykietę, wartość oraz krótki kontekst. W v0.5.9 komponent pokazuje cztery pola: Bonus, Start, Ryzyko, Trudność.

```js
snapshot: {
  bonus: { value, note },
  start: { value, note },
  risk: { value, note },
  difficulty: { value, note }
}
```

To opis istniejącej implementacji, nie docelowy model Decision Model v1.

## Kierunek Decision Model v1

Snapshot dla nowych analiz powinien pokazywać w tej kolejności:

1. `Advertised Max`.
2. `Easy Floor`.
3. `Your Likely Value` albo formułę scenariusza.
4. Miesięczne obowiązki i wysiłek.
5. Czas do nagrody.
6. Failure points — co może spowodować utratę wartości.

`Conditional Max`, forma nagrody, koszty i opportunity cost należy pokazać, gdy wpływają na decyzję. Założenia scenariusza, źródło pola, data weryfikacji i status pewności muszą być dostępne z poziomu komponentu lub bezpośrednio obok niego.

## Reguły treści

- „Bonus” w obecnym UI musi wskazywać warunek, gdy nie jest bezwarunkowy; docelowo nie zastępuje trzech poziomów wartości.
- „Start” opisuje realistyczny czas rozpoczęcia, nie czas oczekiwania na nagrodę.
- „Ryzyko” jest werbalne i wyjaśnione; nie komunikujemy go samym kolorem.
- „Trudność” mierzy złożoność kroków dla użytkownika, nie atrakcyjność oferty.

## Implementacja v0.5.9

Kontener `.north-snapshot`, nagłówek `.north-snapshot__heading`, siatka `.north-snapshot-grid` i element `.snapshot-card`. Desktop używa czterech kolumn, mobile dwóch.

## Testy akceptacyjne

- Wszystkie cztery wartości mają zrozumiały kontekst.
- Karty zachowują wysokość i kolejność na mobile.
- Brak emoji lub symbolu nie odbiera znaczenia etykiecie.
