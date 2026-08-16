# Dziennik zmian

Format oparty na Keep a Changelog. Wersje przed publicznym wydaniem mogą zmieniać zakres bez zachowania kompatybilności.

## [Unreleased]

Brak zmian po wydaniu v0.6.1.

## [0.6.1] — 2026-08-16

### Added

- Landing 2.1 z demonstracją North Value dla Pekao, trzema scenariuszami Nest, czterema aktywnymi stanami Verdict i evidence UI.
- Kompletne analizy Decision Model v1 dla Banku Millennium, Nest Banku i Banku Pekao.
- Wspólny renderer stron ofert oraz widoki Value, kwalifikacji, wykonania, kosztów, Verdict, Confidence i oficjalnych źródeł.

### Changed

- Listing i dema landingu korzystają z `frontend/data/decision-offers.json` jako jednego źródła faktów ofertowych; `offers.js` jest cienkim adapterem danych.
- Główna komunikacja produktu została przeniesiona z katalogu premii i North Score na wartość jawnego scenariusza, ryzyko oraz wyjaśnialną decyzję.

### Verified

- Landing, Millennium, Nest i Pekao przeszły smoke test w widokach 1440×900 i 390×844; Revolut przeszedł test regresji.
- Sprawdzono brak poziomego overflow, błędów konsoli, brakujących zasobów i kotwic oraz poprawne atrybuty linków zewnętrznych i afiliacyjnych.

### Known limitations

- Verdict użytkownika wymaga jawnych danych scenariusza; rekord ogólny nie wymusza pozytywnej decyzji.
- Dane mają ręczny recheck do 2026-08-23; nie ma automatycznego monitoringu regulaminów.

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
