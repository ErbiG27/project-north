# Dziennik zmian

Format oparty na Keep a Changelog. Wersje przed publicznym wydaniem mogą zmieniać zakres bez zachowania kompatybilności.

## [Unreleased]

Brak zmian po wydaniu v0.6.3.

## [0.6.3] — 2026-08-16

### Added

- Pojedyncza strona `Kraken Referral Program — crypto hard case`, dostępna wyłącznie z metodologii i wyłączona z głównego katalogu.
- Rekord validation case w Decision Model v1 oraz raport `CRYPTO_HARD_CASE_V1.md` z bieżącymi oficjalnymi dowodami.
- Jawny widok nominal reward, usable reward, required capital, capital at risk, opłat, spreadu, market exposure i terminu.

### Changed

- Controlled crypto pilot otrzymał wynik `LOW` North Confidence i `NOT ENOUGH DATA`, bez referral lub afiliacyjnego CTA.
- UI i dokumentacja rozróżniają aktywny program od niepełnych, indywidualnych Promotion Details oraz konfliktu oficjalnego deadline'u 15/30 dni.

### Verified

- Decision Model v1 obsłużył hard case bez zmiany schema i bez osobnej architektury krypto.
- Krypto pozostaje poza zakresem katalogu i dalszej roadmapy MVP.
- Kraken oraz regresja Landing, Millennium, Nest, Pekao, Methodology i Revolut przeszły smoke test w 1440×900 i 390×844; sprawdzono konsolę, 404, overflow, kotwice, evidence links, focus i `noopener`.

### Known limitations

- Próg depozytu, minimalny obrót, wiążący deadline, pełna forma nagrody i część zasad wyjścia wymagają Promotion Details z konkretnego konta.
- Nie potwierdzono publicznego użycia indywidualnego linku referral przez portal North.

## [0.6.2] — 2026-08-16

### Added

- Publiczna strona metodologii Decision Model v1 z definicjami North Value, Confidence, Verdict, zasadą `do nothing`, granicami `WAIT` i polityką afiliacyjną.
- Cztery uczciwe stany aktualności danych: `VERIFIED`, `RECHECK DUE`, `EXPIRED` i `UNVERIFIED`, wyliczane z istniejących pól rekordu bez automatycznego monitoringu.
- Czytelny evidence ledger na stronach ofert: nazwy pól dla użytkownika, typ oficjalnego źródła, bezpośredni link, dokładna referencja, data sprawdzenia, poziom wsparcia, niepewność i konflikty.

### Changed

- Wszystkie istniejące linki „Metodologia” na Landing 2.1 i stronach Decision Model prowadzą do publicznej metodologii.
- Footer i przyszłe aktywne CTA afiliacyjne otrzymały spójne disclosure; brak afiliacji nie renderuje pustego placeholdera.
- Landing na 390 px szybciej pokazuje strukturę wartości, a tytuły ofert na mobile zachowują charakter editorial bez dominowania nad informacją decyzyjną.
- Copy aktualności odróżnia datę pełnego review od terminu ręcznego rechecku i nie obiecuje stałej aktualności.

### Verified

- Landing przeszedł smoke test w 1440×900 i 390×844.
- Millennium, Nest i Pekao przeszły testy desktop i 390×844; metodologia przeszła test desktop i mobile, a Revolut test regresji.
- Sprawdzono konsolę, brakujące zasoby, 404 dla plików lokalnych, duplikaty ID, strukturę nagłówków, overflow, skip linki, focus styles, linki zewnętrzne oraz `noopener` / `sponsored noopener`.
- Stany freshness przeszły test deterministyczny dla dat: `VERIFIED`, `RECHECK DUE`, `EXPIRED` i `UNVERIFIED`.

### Known limitations

- Aktualność opiera się na ręcznym review; nie ma automatycznego monitoringu regulaminów.
- Ogólny Verdict nadal wymaga danych scenariusza użytkownika i nie aktywuje `WAIT`.
- Legacy strona Revolut pozostaje poza Decision Model v1 i zachowuje swój wcześniejszy, nieprodukcyjny placeholder CTA.

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
