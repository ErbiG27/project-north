# ProjectNorth — current state and AI recovery

> Canonical recovery snapshot · stan zapisany w repo: 2026-08-23 · produkt: v0.7.2 · Decision Model v1

Ten dokument jest pierwszym punktem wejścia dla nowego AI lub po utracie kontekstu rozmowy. Opisuje bieżący stan, nie zastępuje szczegółowych specyfikacji ani danych ofertowych. Jeśli treść jest sprzeczna z aktualnym kodem, danymi lub nowszą zaakceptowaną decyzją w `/docs`, należy zgłosić konflikt i sprawdzić historię Git — nie zgadywać.

## Czym jest North

ProjectNorth to polskojęzyczny, wyjaśnialny system decyzji dotyczących okazji finansowych. Nie jest rankingiem premii ani katalogiem linków. Dla jawnego scenariusza użytkownika pokazuje wartość, warunki, czas, wysiłek, koszty, ryzyko niedowiezienia, jakość dowodów i wynik decyzji. Brak działania jest pełnoprawną alternatywą.

Aktualne pozycjonowanie:

> Nie pytaj, która premia jest najwyższa. Sprawdź, która ma sens dla Ciebie.

## Niezmienne zasady

- Analizuj decyzję, nie reklamowane maksimum.
- Wartość zawsze zależy od jawnego scenariusza; nie istnieje jedna „realna nagroda” dla wszystkich.
- Korzyści, obowiązki, koszty, czas, ryzyko i alternatywa `do nothing` mają być widoczne razem.
- Nie używaj fałszywej precyzji: Match i Confidence są jakościowymi bandami, nie procentami.
- Każda krytyczna liczba lub reguła musi prowadzić do evidence, daty review i poziomu wsparcia.
- Brak danych lub nierozwiązany konflikt może wymagać `NOT ENOUGH DATA`; nie wypełniaj luk intuicją.
- Prosty polski język jest pierwszą warstwą. Glossary pomaga, ale nie może być wymagane do zrozumienia głównego flow.
- Nie obiecuj zysku, nie ukrywaj ryzyka i nie przedstawiaj planu jako istniejącej funkcji.

## Decision Model v1

| Element | Rola |
| --- | --- |
| **North Value** | Wartość oferty w jawnym scenariuszu, z rozróżnieniem reklamowanego maksimum, łatwego rdzenia i wartości scenariuszowej; koszty i ograniczenia pozostają jawne. |
| **North Confidence** | Jakość, kompletność i aktualność danych oraz wniosku: `HIGH`, `MEDIUM` albo `LOW`, zawsze z powodem. |
| **North Match** | Dopasowanie założeń użytkownika: `FIT`, `CONDITIONAL FIT`, `POOR FIT` albo `CANNOT ASSESS`, wraz z powodami, warunkami i blokerami. Nie zastępuje Verdict. |
| **North Verdict** | Wynik decyzji: `TAKE NOW`, `TAKE IF`, `SKIP` albo `NOT ENOUGH DATA`. `WAIT` nie jest aktywnym stanem bez historii i backtestu. |
| **Evidence** | Ręczny ledger łączący krytyczne pola z oficjalnym źródłem, dokładną referencją, datą sprawdzenia, poziomem wsparcia, niepewnością i konfliktem. |
| **Glossary** | Centralne, proste definicje terminów modelu dostępne jako pomoc kontekstowa. |

North Score jest wyłącznie elementem starszego widoku demonstracyjnego i nie jest rdzeniem ani głównym USP produktu.

## Stan produktu i produkcji

- Bieżący zakres zapisany w repo to **Decision Model v1 + Explainable North Match + Plain Language, v0.7.2**.
- Publiczny frontend jest wskazany pod `https://project-north-mu.vercel.app/` i publikowany z katalogu `frontend/` z GitHub `main` przez Vercel.
- Jest to statyczny HTML/CSS/JavaScript bez procesu build, backendu, kont, bazy danych, sekretów i analytics.
- Dane scenariusza są przetwarzane lokalnie w bieżącej karcie i znikają po przeładowaniu.
- Prywatna beta v0.8.0 nie została otwarta.
- `frontend/data/decision-offers.json` jest źródłem faktów ofertowych; HTML nie może zawierać ich równoległych kopii.

To jest stan udokumentowany w repo, a nie gwarancja bieżącej dostępności hostingu lub aktualności regulaminów. Przed decyzją wydawniczą trzeba osobno sprawdzić produkcję, daty evidence i stan deploymentu.

## Aktywny następny etap

Najbliższym etapem jest **North UX Test #1** na produkcyjnie wiernym v0.7.2, a następnie decyzja o zakresie prywatnej bety v0.8.0 na podstawie obserwacji użytkowników.

Test ma sprawdzić przede wszystkim, czy użytkownik bez pomocy:

- rozumie, że North pomaga podjąć decyzję, a nie szereguje bonusy;
- potrafi przejść od listy do analizy i scenariusza Match;
- odróżnia reklamowane maksimum od wartości możliwej w swoim scenariuszu;
- rozumie główny warunek, koszt, czas, ryzyko i Verdict bez otwierania Glossary;
- ufa wyjaśnieniu Confidence i Evidence bez odbierania ich jako gwarancji;
- rozpoznaje różnicę między brakiem danych, niedopasowaniem i decyzją warunkową.

Pre-UX polish jest wdrożony, ale te zmiany pozostają hipotezami do walidacji: wyższe położenie aktywnych analiz, krótki blok „Jak działa North?”, prostsze copy Confidence/Evidence oraz dostępne popovery Glossary. Nie traktować ich skuteczności jako potwierdzonej przed badaniem.

Znane, nieblokujące kwestie polish: brak dedykowanej grafiki social; ograniczony obszar kliknięcia kart ze względu na zagnieżdżone kontrolki Glossary; niższy kontrast sygnetu w North Verdict; nieuporządkowana polityka zakończeń linii. P0 nadal wymaga każdorazowego potwierdzenia linków, aktualności ofert i partnerów przed publikacją.

## Czego nie budujemy teraz

- pełnego North Plan / portfolio plannera i conflict engine;
- historycznego `WAIT` vs `TAKE` bez porównywalnych edycji i backtestu;
- automatycznego monitorowania regulaminów ani automatycznego evidence review;
- szerokiej kategorii krypto;
- porównywarki przed ujednoliceniem większej liczby ofert;
- kont, backendu, profilu, premium ani ML personalization;
- analytics jako substytutu badań jakościowych;
- motion, zaawansowanych animacji, skeletonów bez asynchronicznego ładowania ani funkcji dodawanych wyłącznie dla wrażenia skali.

## Afiliacja pozostaje neutralna

Afiliacja ani referral nie mogą zmieniać North Value, Confidence, Match, Verdict, kolejności argumentów ani tonu copy. North może wskazać ofertę bez linku partnerskiego, a ofertę partnerską ocenić jako `SKIP` lub `NOT ENOUGH DATA`. Każdy aktywny link partnerski wymaga jawnego disclosure. Obecne rekordy walidacyjne nie mają aktywnych CTA afiliacyjnych.

## Znane przypadki walidacyjne ofert

- **Bank Millennium:** klasyczna premia do 700 zł, rozbita na sprint 14-dniowy i część all-or-nothing po pięciu miesiącach. Testuje wysiłek, czas i ryzyko utraty części nagrody. Istnieje jawny konflikt źródeł dotyczący osoby mającej dokładnie 26 lat; model pokazuje notę zamiast ukrywać konflikt.
- **Nest Bank:** do 1 250 zł, głównie 2% cashbacku z miesięcznym limitem przez 24 miesiące oraz warunkowym składnikiem EUR. Testuje reklamowane maksimum wobec rzeczywistego poziomu wydatków i długiego horyzontu. Ogólna Confidence jest `MEDIUM`.
- **Bank Pekao:** rekord kompozytowy: 300 zł części startowej oraz do 2 400 zł warunkowych nagród podróżnych. Testuje różne formy nagrody i ograniczoną użyteczność marketingowego maksimum; 2 700 zł nie jest jednym prostym bonusem.
- **Kraken:** publiczny, nieafiliacyjny crypto hard case poza katalogiem i Match flow. Sprzeczne publiczne warianty kwoty oraz terminu, a wiążące progi zależą od indywidualnych Promotion Details; Confidence `LOW`, Verdict `NOT ENOUGH DATA`. Publiczne 75 EUR dotyczy wyłącznie wariantu EEA i nie jest uniwersalną obietnicą.
- **Revolut:** archiwalny przykład wcześniejszego UI z North Score, `noindex`, bez aktywnej analizy i bez roli wzorca dla Decision Model v1.

Ogólny Verdict aktywnych ofert pozostaje `NOT ENOUGH DATA`, dopóki użytkownik nie poda materialnych danych scenariusza. Pełne, kwalifikowane scenariusze mogą prowadzić do `TAKE IF`; potwierdzone wykluczenie do `SKIP`.

## Mapa źródeł prawdy

| Źródło | Autorytet i zastosowanie |
| --- | --- |
| `/docs` w Git | Kanoniczne zasady, decyzje, roadmapa, standard pracy i historia wydań. Zacznij od tego dokumentu, potem `HANDBOOK.md`, `ROADMAP.md`, `DECISIONS.md`, `CHANGELOG.md`, `PRODUCT_POLISH.md` i `AI_WORKFLOW.md`. |
| Kod i `frontend/data/decision-offers.json` | Kanoniczny stan implementacji i faktów ofertowych używanych przez produkt. Plan w dokumencie nie dowodzi wdrożenia. |
| Historia Git | Ewolucja produktu, autorstwo zmian i możliwość ustalenia, kiedy stan dokumentacji lub implementacji się zmienił. |
| Notion: Founder Notes | Kontekst założycielski, motywacje i robocze decyzje. Nie nadpisuje zaakceptowanego stanu Git. |
| Notion: Product Polish | Robocze obserwacje UX i backlog; trwałe lub wdrożone zmiany synchronizuj z odpowiednim plikiem w `/docs`. |
| Notion: Parking | Pomysły poza aktywnym zakresem. Nie przedstawiaj ich jako roadmapy ani funkcji. |
| Notion: Validation Archive | Materiały badań, dowody, wyniki i ograniczenia walidacji. Wniosek wymaga odniesienia do rzeczywistego artefaktu, nie samego streszczenia. |
| Daily Reports | Dziennik zmian, decyzji, ryzyk i otwartych pytań danego dnia; służy odzyskaniu sekwencji zdarzeń. |
| Weekly Reports / North State Snapshot | Syntetyczny obraz etapu, aktywnych hipotez, ryzyk i następnych kroków. Nie może po cichu zastąpić nowszego stanu repo. |

Gdy źródła się różnią, nie scalaj ich pozornie. Ustal daty i zakres, wskaż konflikt oraz zastosuj nowszą zaakceptowaną decyzję lub poproś właściciela produktu o rozstrzygnięcie.

## Procedura odzyskania kontekstu przez nowe AI

1. Potwierdź `pwd`, `git rev-parse --show-toplevel` i `git status`. Pracuj tylko w oczekiwanym repo; zachowaj wszystkie lokalne zmiany i nieśledzone pliki.
2. Przeczytaj ten plik oraz `README.md`, `docs/HANDBOOK.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/CHANGELOG.md`, `docs/PRODUCT_POLISH.md` i `docs/AI_WORKFLOW.md`.
3. Sprawdź ostatnie commity i diff working tree. Nie zakładaj, że snapshot, raport lub rozmowa są nowsze od Git.
4. Dla zadania ofertowego odczytaj właściwy rekord z `frontend/data/decision-offers.json`, evidence ledger i oficjalne źródła. Sprawdź `verifiedAt`, `recheckBy`, edycję i konflikty. Nie kopiuj faktów z pamięci lub Notion do produktu.
5. Dla zadania badawczego odczytaj rzeczywiste artefakty w Validation Archive oraz najnowsze daily/weekly reports. Oddziel obserwacje od interpretacji i hipotez.
6. Porównaj trzy warstwy: stan produkcyjny, stan `main` i lokalny working tree. Każdą rozbieżność nazwij wprost.
7. Zanim zmienisz zakres, przypomnij aktywny cel: North UX Test #1, następnie decyzja o prywatnej becie. Pomysły z Parking nie są automatycznie aktywne.
8. Wprowadź najmniejszą zmianę realizującą cel, uruchom adekwatne walidacje i pokaż pełny diff. Nie commituj, nie pushuj ani nie deployuj bez osobnego upoważnienia.

## Utrzymanie dokumentu

Aktualizuj ten snapshot, gdy zmienia się wersja produkcyjna, pozycjonowanie, aktywny etap, kontrakt Decision Model, mapa źródeł prawdy lub jawny zakres „nie teraz”. Szczegóły wydania nadal należą do `CHANGELOG.md`, trwałe uzasadnienia do `DECISIONS.md`, a zadania do `ROADMAP.md` lub `PRODUCT_POLISH.md`.
