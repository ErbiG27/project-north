# North Snapshot

## Rola

North Snapshot przekazuje najważniejsze fakty w około dziesięć sekund. Ma odróżnić marketingowe maksimum od wartości dla scenariusza użytkownika oraz pokazać obowiązki, czas i główne punkty utraty nagrody.

## Obecny kontrakt — Decision Model v1

Każda pozycja zawiera etykietę, wartość oraz krótki kontekst. Dla nowych analiz komponent pokazuje:

```js
snapshot: {
  advertisedMax,
  easyFloor,
  likelyValue,
  expectedUsableValue,
  netScenarioValue,
  conditionalMax,
  effort,
  duration,
  failureRisk,
  flexibility,
  confidence
}
```

Snapshot pokazuje w tej kolejności:

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

## Implementacja

Landing używa `.snapshot-panel`, `.snapshot-values` i `.scenario-qualities`. Strony analiz renderują odpowiadające pola przez wspólny `offers/offer.js`. Legacy Revolut zachowuje wcześniejszy komponent `.north-snapshot` z v0.5.9.

## Testy akceptacyjne

- Wszystkie pola wartości mają zrozumiały kontekst i wskazany scenariusz.
- Wysiłek, czas, ryzyko i elastyczność nie są przeliczane na arbitralne PLN.
- Karty zachowują kolejność na mobile i nie tworzą poziomego overflow.
- Brak emoji lub symbolu nie odbiera znaczenia etykiecie.
