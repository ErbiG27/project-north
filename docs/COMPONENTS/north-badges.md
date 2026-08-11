# North Badges

## Rola

Badges wskazują szybkie, stabilne wyróżniki oferty. Nie są dekoracją ani substytutem Score, Snapshot czy Verdict.

## Kontrakt

`north-badges` to lista `ul`; każda pozycja używa `li.north-badge`. Aktualny wariant specjalny to `north-badge--award` dla wyróżnienia redakcyjnego.

## Reguły stosowania

- Maksymalnie trzy badges na hero oferty.
- Każdy badge musi być prawdziwy, możliwy do obrony i zrozumiały bez ikony.
- „Wybór redakcji” wymaga udokumentowanej definicji oraz daty weryfikacji.
- Nie używamy statusów typu HOT/NEW bez kryterium i daty wygaśnięcia.
- Badge nie może sugerować bezpieczeństwa ani gwarantowanego zysku.

## Semantyka i dostępność

Lista jest właściwą semantyką dla zestawu wyróżników. Ikona ma `aria-hidden="true"`; tekst badge’a niesie pełne znaczenie. Hover może uzupełniać interakcję, ale nie jest wymagany do odczytania zawartości.

## Implementacja v0.5.9

Style `.north-badge` wykorzystują ciemną powierzchnię, obramowanie i zielony akcent. `north-badge--award` korzysta z osobnego złotego akcentu, aby nie mieszać redakcyjnego wyróżnienia z pozytywną oceną Score.

## Otwarte decyzje

Przed dodaniem kolejnych typów należy określić taksonomię, zasady nadawania i właściciela aktualizacji. Bez tego badges szybko zamienią się w niespójne etykiety marketingowe.
