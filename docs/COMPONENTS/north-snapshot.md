# North Snapshot

## Rola

North Snapshot przekazuje najważniejsze fakty w około dziesięć sekund. Odpowiada na: ile można zyskać, ile czasu potrzeba, jakie jest ryzyko i jak trudny jest start.

## Kontrakt

Każda pozycja zawiera etykietę, wartość oraz krótki kontekst. W v0.5.9 komponent pokazuje cztery pola: Bonus, Start, Ryzyko, Trudność.

```js
snapshot: {
  bonus: { value, note },
  start: { value, note },
  risk: { value, note },
  difficulty: { value, note }
}
```

## Reguły treści

- „Bonus” musi wskazywać warunek, gdy nie jest bezwarunkowy.
- „Start” opisuje realistyczny czas rozpoczęcia, nie czas oczekiwania na nagrodę.
- „Ryzyko” jest werbalne i wyjaśnione; nie komunikujemy go samym kolorem.
- „Trudność” mierzy złożoność kroków dla użytkownika, nie atrakcyjność oferty.

## Implementacja v0.5.9

Kontener `.north-snapshot`, nagłówek `.north-snapshot__heading`, siatka `.north-snapshot-grid` i element `.snapshot-card`. Desktop używa czterech kolumn, mobile dwóch.

## Testy akceptacyjne

- Wszystkie cztery wartości mają zrozumiały kontekst.
- Karty zachowują wysokość i kolejność na mobile.
- Brak emoji lub symbolu nie odbiera znaczenia etykiecie.
