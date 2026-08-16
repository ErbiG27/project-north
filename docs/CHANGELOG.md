# Dziennik zmian

Format oparty na Keep a Changelog. Wersje przed publicznym wydaniem mogą zmieniać zakres bez zachowania kompatybilności.

## [Unreleased]

### Planned

- Rozszerzenie modelu ofert o dane analityczne i datę weryfikacji.

## [0.6.0] — 2026-08-16

### Added

- Własne zasoby marki North: logo, sygnet oraz favicony.
- Modułowe arkusze CSS dla stron, w tym `styles/pages/home.css`.

### Changed

- `style.css` jest jednym punktem wejścia dla arkuszy podzielonych na base, layout, components, pages i utilities.

### Removed

- Stare, puste pliki zastępcze CSS oraz archiwum `frontend.zip`.

### Verified

- Testy smoke dla frontendu zakończone powodzeniem.

### Known limitations

- Polityka zakończeń linii i porządkowanie `.gitattributes` pozostają nieblokującym zadaniem technicznym.
- Sygnet North wewnątrz North Verdict ma niższy kontrast i wymaga późniejszego dopracowania.

## [0.5.9] — 2026-08-10

### Added

- Landing Hero 2.0 z komunikatem metody North, CTA oraz podglądem analizy.
- Wyszukiwanie, filtrowanie kategorii i sortowanie kart ofert po stronie klienta.
- Dokumentowa strona oferty Revolut z komponentami North Score, North Snapshot, North Verdict i North Badges.

### Changed

- Kierunek produktu przesunięty z listy promocji na pomoc w podejmowaniu decyzji.
- Hero strony oferty wykorzystuje układ dwóch kolumn: podsumowanie oferty i dashboard analizy.

### Known limitations

- Dane ofert i metodologii są statyczne; nie ma automatycznej weryfikacji aktualności.
- Część odnośników i źródeł wymaga uzupełnienia przed publikacją.
- Arkusze CSS są w okresie przejściowym (`style.css` i katalog `styles/`).

## [0.5.8] — 2026-08-10

### Added

- Premium Hero Framework dla strony oferty.
- Pierwszy wzorzec komponentów analitycznych dla ProjectNorth.
