# ProjectNorth

![North](frontend/assets/brand/north-logo.svg#gh-dark-mode-only)

> Nie pytaj, która premia jest najwyższa. Sprawdź, która ma sens dla Ciebie.

ProjectNorth to rozwijany po polsku **wyjaśnialny system decyzji dotyczących okazji finansowych**. Zamiast układać promocje w ranking według reklamowanej premii, North rozkłada ofertę na wartość dla konkretnego scenariusza, warunki, czas, wysiłek, koszty, ryzyka i źródła. Wynikiem ma być zrozumiała decyzja — także wtedy, gdy najlepszą opcją jest brak działania.

## Stan produktu

Aktualny zakres to **Decision Model v1 + Explainable North Match + pierwszy katalog 12 produktów**. To publiczny frontend przed prywatną betą, z jednym modelem danych dla katalogu, stron ofert i scenariuszy Match.

- katalog roboczy: **12 produktów** — Millennium, Nest, Pekao, Alior 18–25, Erste Smart, Revolut Standard, mBank, PKO, BNP, UniCredit, Velo EKO i Alior Plus;
- formularz scenariusza działa lokalnie w przeglądarce, bez konta i backendu;
- krytyczne pola mają ręcznie prowadzony evidence ledger i widoczny status aktualności;
- **Kraken** pozostaje wyłącznie nieafiliacyjnym hard case'em do walidacji modelu — poza głównym katalogiem i Match flow;
- **Revolut Standard** jest bieżącą analizą wartości funkcjonalnej bez stałej premii bazowej; dawna makieta Score nie jest już źródłem danych;
- v0.7.2 upraszcza główny flow tak, aby Glossary było pomocą, a nie warunkiem zrozumienia; frontend działa publicznie pod [project-north-mu.vercel.app](https://project-north-mu.vercel.app/).

North nie monitoruje jeszcze automatycznie regulaminów, nie zapisuje profilu użytkownika i nie obiecuje zysku. Dane scenariusza znikają po przeładowaniu strony.

## Decision Model v1

| Element | Odpowiada na pytanie |
| --- | --- |
| **North Value** | Ile oferta jest warta w jawnym scenariuszu, po uwzględnieniu kosztów, czasu, wysiłku i ryzyka niedowiezienia? |
| **North Confidence** | Jak kompletne, aktualne i dobrze poparte źródłami są dane oraz wniosek? |
| **North Match** | Czy oferta pasuje do podanych założeń, co ją blokuje i które odpowiedzi zmieniają wynik? |
| **North Verdict** | Czy w tym scenariuszu decyzja to `TAKE NOW`, `TAKE IF`, `SKIP` czy `NOT ENOUGH DATA`? |
| **Evidence** | Z jakiego oficjalnego źródła pochodzi krytyczna liczba lub reguła, kiedy ją sprawdzono i z jaką pewnością? |
| **Glossary** | Co znaczą terminy modelu, wyjaśnione prostym polskim językiem? |

North Match używa jakościowych bandów (`FIT`, `CONDITIONAL FIT`, `POOR FIT`, `CANNOT ASSESS`), nie procentu, i nie zastępuje Verdict. Wartość jest scenariuszem, nie jedną uniwersalną liczbą. North Score występuje jedynie w starszym widoku demonstracyjnym i nie jest rdzeniem obecnego produktu.

## Uruchomienie lokalne

Projekt nie wymaga instalowania zależności ani procesu budowania. Ponieważ frontend pobiera dane z pliku JSON, uruchom go przez lokalny serwer HTTP zamiast otwierać `index.html` bezpośrednio:

```powershell
cd frontend
python -m http.server 8000
```

Następnie otwórz [http://localhost:8000](http://localhost:8000). Możesz użyć dowolnego innego serwera plików statycznych, jeśli nie masz Pythona.

### Walidacja danych North

Przed review zmian w `frontend/data/decision-offers.json` uruchom lokalny guard:

```powershell
node scripts/validate-north-data.mjs
```

Opcjonalne `--today=YYYY-MM-DD` ustawia datę odniesienia dla deterministycznego testu, np. `node scripts/validate-north-data.mjs --today=2026-08-20`. `PASS` i `PASS WITH WARNINGS` kończą się kodem `0`; `FAIL` kodem różnym od zera. Ostrzeżenie oznacza przede wszystkim recheck przypadający w ciągu 7 dni, a błąd m.in. uszkodzoną strukturę lub referencję, niemożliwy stan Confidence/Verdict albo przeterminowany aktywny rekord.

Guard v0.1 sprawdza strukturę bieżącego Decision Modelu, obecność niepustych i unikalnych ID, referencje ofert, edycji, scenariuszy, komponentów, działań, Match i evidence, podstawowe kontrakty kwot, bramy landingu oraz istniejące daty review i `recheckBy`. Nie jest pełnym JSON Schema, nie ocenia prawdziwości treści regulaminów, nie przelicza metodologii North Value i nie aktualizuje danych automatycznie.

Kontrolowane przypadki błędnego JSON-u, brakującego ID, zerwanej referencji oraz reguł Confidence/Verdict i freshness można uruchomić bez zmiany danych produkcyjnych: `node --test scripts/validate-north-data.test.mjs`.

## Technologie i struktura

Projekt wykorzystuje **HTML5, modułowy CSS i vanilla JavaScript**. Nie ma frameworka, backendu ani bazy danych.

```text
frontend/
├── index.html                  # landing i lista aktywnych analiz
├── methodology.html            # publiczna metodologia Decision Model v1
├── data/decision-offers.json   # wspólne źródło faktów ofertowych
├── offers/
│   ├── millennium.html
│   ├── nest.html
│   ├── pekao.html
│   ├── [9 dalszych cienkich tras katalogu]
│   ├── offer.js                # wspólny renderer analiz
│   └── match.js                # interpreter reguł scenariusza
├── glossary.js                 # centralne definicje i dostępne popovery
└── styles/                     # modułowe style interfejsu

docs/                           # zasady produktu, decyzje i plan rozwoju
```

## Dokumentacja i roadmapa

Katalog [`/docs`](docs/) jest źródłem prawdy dla intencji produktu, standardów, roadmapy i historii decyzji; kod pozostaje źródłem prawdy dla implementacji. Najważniejsze dokumenty:

- [North State](docs/NORTH_STATE.md) — pierwszy punkt wejścia dla AI i procedura odzyskania aktualnego kontekstu projektu;
- [Handbook](docs/HANDBOOK.md) — wizja, zasady i aktywny kontrakt produktu;
- [Roadmapa](docs/ROADMAP.md) — ukończone etapy i kolejność dalszej walidacji;
- [Changelog](docs/CHANGELOG.md) — faktycznie wydane zmiany i ograniczenia;
- [Decyzje](docs/DECISIONS.md) — uzasadnienie trwałych decyzji produktowych.

v0.7.2 oraz pierwszy fundament produkcyjnego deploymentu są zamknięte. **Prywatna beta v0.8.0 nie została jeszcze otwarta**; jej zakres ma wynikać z przygotowanej strategii testów, a nie z dokładania funkcji. Konta, backend, analytics, automatyczne monitorowanie regulaminów, pełny North Plan i krypto jako kategoria pozostają świadomie poza obecnym zakresem.
