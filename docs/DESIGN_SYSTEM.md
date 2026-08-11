# System projektowy North

## Intencja

Interfejs ma sprawiać wrażenie spokojnego narzędzia analitycznego: kontrastowy, oszczędny i czytelny. Dekoracja ma wspierać hierarchię, nigdy konkurować z warunkami oferty.

## Tokeny obecnej implementacji

| Rola | Token / wartość |
| --- | --- |
| Tło | `--color-bg: #000000` |
| Powierzchnia | `--color-surface: #252525` |
| Jasna powierzchnia | `--color-surface-light: #2D2D2D` |
| Obramowanie | `--color-border: #333333` |
| Akcent | `--color-primary: #00B894` |
| Akcent jasny | `--color-primary-hover: #00D084` |
| Tekst | `--color-text: #FFFFFF` |
| Tekst wtórny | `--color-text-secondary: #BDBDBD` |
| Tekst wyciszony | `--color-text-muted: #9C9C9C` |
| Krój interfejsu | `Arial, Helvetica, sans-serif` |
| Promień kart | `--radius-card: 1.25rem` |
| Promień pigułki | `--radius-pill: 999px` |

Pełny zestaw tokenów jest aktualnie zdefiniowany w `style.css`. Nie wprowadzaj wartości „na oko”; najpierw rozszerz token lub użyj istniejącego.

## Typografia i copy

Nagłówki mają być krótkie, konkretne i wyraźnie hierarchiczne. Tekst pomocniczy wyjaśnia, nie sprzedaje. Na landing hero dopuszczony jest serifowy akcent w `em`; pozostały tekst powinien być prosty i łatwy do skanowania.

## Układ i responsywność

- Desktop: Hero oferty ma dwie kolumny; analiza jest widoczna bez konieczności szukania jej niżej.
- Do 900 px: kolumny przechodzą w jeden strumień.
- Do 600 px: CTA ma wygodną strefę dotyku, Snapshot ma układ 2×2, a treść nie traci kontekstu.
- Układ musi działać przy powiększeniu tekstu i bez hovera.

## Komponenty bazowe

`btn` jest elementem działania. Wariant zielony stosuj do głównej akcji w obrębie jednego kontekstu; nie więcej niż jedno główne CTA w bezpośrednim widoku. Karty używają ciemnej powierzchni, subtelnego obramowania oraz delikatnego podniesienia przy hoverze — bez agresywnych animacji.

## Dostępność

- Każdy obraz ma sensowny `alt`; element czysto dekoracyjny jest ukryty przed czytnikiem.
- Nagłówki zachowują logiczną kolejność.
- Sam kolor nie przekazuje stanu ani oceny.
- Linki i przyciski są osiągalne klawiaturą oraz mają widoczny fokus.
- Kontrast tekstu i akcji sprawdzamy na faktycznym tle, również w stanie hover/focus.

## Antywzorce

- Zieleń jako synonim bezpiecznej inwestycji lub gwarantowanego zysku.
- Różne promienie, cienie i odstępy w każdym komponencie.
- Ikony emoji jako jedyne nośniki znaczenia w interfejsie produkcyjnym.
- Budowanie nowych stron przez kopiowanie długich bloków CSS bez wydzielenia komponentu.
