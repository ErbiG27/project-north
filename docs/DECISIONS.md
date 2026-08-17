# Rejestr decyzji

Każdy wpis opisuje decyzję o długotrwałym wpływie. Statusy: **accepted**, **superseded**, **proposed**.

## ADR-001 — North jest przewodnikiem po decyzji

**Status:** accepted · **Data:** 2026-08-10

North ma interpretować ofertę, a nie tylko prezentować jej bonus. Dlatego strona oferty prowadzi od podsumowania przez Score i Snapshot do Verdict.

**Konsekwencja:** CTA nie może dominować nad warunkami, ograniczeniami i rekomendacją.

**Doprecyzowanie:** ADR-006 zastępuje interpretację North jako produktu prowadzonego przez Score. Score może pozostać skrótem wtórnym, ale decyzję mają wyjaśniać wartość scenariuszowa, confidence, koszty, ryzyka i alternatywy.

## ADR-002 — Dane kart są renderowane ze wspólnego źródła

**Status:** accepted · **Data:** 2026-08-10

Katalog wykorzystuje `data/offers.js` i `script.js`, zamiast kopiować dane do HTML.

**Konsekwencja:** dane muszą mieć spójny kontrakt. Przy rozbudowie dopuszczamy migrację do szerszego modelu oferty, ale nie mnożenie równoległych list.

## ADR-003 — Strona Revolut jest wzorcem, nie wyjątkiem

**Status:** accepted · **Data:** 2026-08-10

Układ North Hero, North Score, North Snapshot, North Verdict i badges jest punktem wyjścia dla następnych stron ofert.

**Konsekwencja:** nowe strony mogą zmieniać dane i treść, lecz nie powinny tworzyć kolejnego języka UI bez udokumentowanej potrzeby.

**Doprecyzowanie:** wzorzec opisuje obecną strukturę interfejsu, nie zatwierdza North Score jako głównego USP ani obecnego kontraktu danych jako modelu docelowego. Zmiany kontraktu wynikające z ADR-006 są dozwolonym rozwinięciem wzorca.

## ADR-004 — Ciemny interfejs z zielenią kierunkową

**Status:** accepted · **Data:** 2026-08-10

Podstawą identyfikacji są czarne/grafitowe powierzchnie, jasna typografia i zielony akcent `#00B894` / `#00D084`.

**Konsekwencja:** kolory stanu i partnerów są wtórne. Zieleń nie oznacza automatycznie „kup” ani „bez ryzyka”.

## ADR-005 — Git ma być źródłem prawdy dla dokumentacji

**Status:** proposed · **Data:** 2026-08-11

Markdown w `/docs` ma być wersjonowany razem z kodem. Narzędzia typu Notion mogą prezentować lub agregować wiedzę, ale nie powinny tworzyć drugiej, rozjeżdżającej się wersji.

**Konsekwencja:** bieżący eksport v0.5.9 nie zawiera metadanych Git; po przeniesieniu do repo należy dodać docs do pierwszego commitu.

## ADR-006 — North jest wyjaśnialnym systemem decyzji

**Status:** accepted · **Data:** 2026-08-16 · **Źródło:** ProjectNorth Research Sprint #1

North nie będzie pozycjonowany jako „lepszy ranking promocji”. Kierunkiem produktu jest **explainable decision system**: system podejmowania i realizowania decyzji dotyczących okazji finansowych. Ma odpowiadać przede wszystkim, ile oferta jest warta dla konkretnej osoby, jakiego wymaga wysiłku i czasu, jakie tworzy koszty i opportunity cost, co grozi utratą nagrody, czy lepsza jest alternatywa lub brak działania oraz na jakich źródłach i poziomie pewności opiera się wniosek.

**Zatwierdzony model decyzji:**

- wartość jest przedstawiana na trzech poziomach: `Advertised Max`, `Easy Floor` oraz `Your Likely Value` / `Conditional Max` tam, gdzie ma zastosowanie;
- nie istnieje jedna uniwersalna „realna nagroda” dla wszystkich użytkowników;
- North Score pozostaje możliwym skrótem wtórnym, ale nie jest głównym USP; kierunek docelowy rozdziela `North Value` od `North Confidence`;
- `North Confidence` opisuje jakość, kompletność i aktualność danych oraz wniosku; bez danych nie publikujemy fałszywie precyzyjnych procentów;
- North Verdict przyjmuje docelowo: `TAKE NOW`, `TAKE IF`, `WAIT`, `SKIP`, `NOT ENOUGH DATA`;
- `WAIT` nie może być przedstawiany jako wiarygodna dostępna funkcja przed zebraniem historii porównywalnych edycji i wykonaniem backtestu;
- North Match ma wyjaśniać przyczyny dopasowania i wpływ zmiany założeń, zamiast opierać przewagę na samym procencie;
- trust opiera się na field-level sourcing / evidence ledger: źródle pola, regulaminie, dacie weryfikacji i statusie lub pewności danych; historię zmian edycji dodajemy później.

**Konsekwencja dla v0.6.1:** sprint otrzymuje nazwę **Decision Model v1** i ma udowodnić jakość decyzji na trzech ofertach, a nie skalę katalogu. Bank Millennium testuje premię z wysiłkiem i czasem, Nest Bank maksimum wobec scenariusza użytkownika, a Bank Pekao różne formy nagrody i ograniczoną użyteczność marketingowego maksimum. BOŚ i Allegro Klik są następnymi kandydatami. Evidence ledger jest na tym etapie prowadzony ręcznie.

**Kontrolowany pilot krypto:** pierwszy publiczny MVP pozostaje skoncentrowany na ofertach niskiego ryzyka, a krypto nie jest główną kategorią produktu. Dopiero po walidacji podstawowej trójki v0.6.1 — Bank Millennium, Nest Bank i Bank Pekao — można przeanalizować jedną ofertę krypto jako optional stretch case i hard case dla Decision Model v1. Pierwszym kandydatem jest Kraken referral z Research Sprint #1. Pilot ma sprawdzić odporność modelu na dynamiczną lub niegwarantowaną nagrodę, większą niepewność danych, ryzyko rynkowe i dodatkowe warunki wykonania; nie rozszerza katalogu, nie tworzy nowego filaru i nie oznacza szerokiego otwarcia kategorii krypto.

Analiza pilota musi jawnie pokazać niepewność nagrody, ryzyko rynkowe, `North Confidence`, kapitał użytkownika narażony na ryzyko oraz wymagane warunki. Dopuszczalne wyniki obejmują `TAKE IF`, `SKIP` i `NOT ENOUGH DATA`. Istnienie afiliacji lub programu referral nie może samo w sobie prowadzić do pozytywnego Verdict.

**Brama przed publikacją Kraken:** należy ponownie zweryfikować aktualne warunki promocji, publiczną dostępność ścieżki wejścia, ograniczenia programu referral, dozwolony sposób publikacji i linkowania, ryzyko rynkowe oraz niegwarantowany charakter nagrody. Bez wystarczających i aktualnych danych oferta nie może otrzymać pozytywnego Verdict ani zostać opublikowana jako zweryfikowana.

**Kolejność:** przed v0.6.1 lub jako bezpośredni etap przygotowawczy powstaje specyfikacja Landing 2.1 oparta na komunikacie: „Nie pytaj, która premia jest najwyższa. Sprawdź, która ma sens dla Ciebie.” Landing ma demonstrować problem i sposób decyzji, nie sprzedawać Score jako głównej funkcji.

**Świadomie później:** pełny North Plan / portfolio planner, conflict engine, historyczne `WAIT` vs `TAKE`, automatyczne monitorowanie regulaminów oraz kontrolowany pilot krypto opisany wyżej są wyłączone z pierwszego publicznego MVP i podstawowego zakresu v0.6.1. Pomysły pozostają w kierunku produktu, ale nie są obecnie funkcjami.

## ADR-007 — Pierwszy production hosting wykorzystuje Vercel

**Status:** accepted · **Data:** 2026-08-16

Statyczny frontend ProjectNorth jest publikowany z GitHub `main` przez Vercel. Root Directory projektu wskazuje `frontend/`, bez frameworka, procesu budowania, backendu i zmiennych środowiskowych. Produkcyjny origin to `https://project-north-mu.vercel.app/`.

**Uzasadnienie:** repo jest czystym HTML/CSS/JavaScript, więc Vercel zapewnia najkrótszą stabilną ścieżkę od istniejącego repo do HTTPS i automatycznego deploymentu bez przebudowy architektury. Publikowanie `frontend/` zapobiega przypadkowemu wystawieniu `docs/` oraz plików roboczych z root repo.

**Konsekwencje:** docelowo push do `main` ma uruchamiać deployment produkcyjny, ale automatyczny trigger nie zadziałał dla pierwszego finalnego redeployu i wymaga naprawy przed kolejnym wydaniem. Produkcję tego etapu opublikowano jako zweryfikowany snapshot `frontend/` przez uwierzytelnione API Vercela. Canonical, Open Graph, sitemap i robots używają rzeczywistego origin Vercel do czasu świadomej migracji na własną domenę. Zmiana providera lub domeny wymaga aktualizacji absolutnych URL-i i ponownego smoke testu, ale nie wymaga migracji frameworka.
