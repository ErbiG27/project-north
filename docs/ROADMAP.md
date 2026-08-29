# Roadmapa ProjectNorth

> Wersja robocza · Priorytet wyznacza wartość dla użytkownika, nie atrakcyjność techniczna.

## Zasady planowania

Element trafia do sprintu tylko z celem, właścicielem, zakresem i Definition of Done. Roadmapa jest kolejnością hipotez, nie obietnicą terminu. Funkcje finansowe, afiliacyjne i analityczne wymagają najpierw zasad transparentności oraz zgodności prawnej.

## Stan obecny — publiczny katalog 12 ofert

Commit `24c2d7c5450b44ae07e12267f592b5898849bb54` opublikował pierwszy kontrolowany katalog 12 ofert pod `https://project-north-mu.vercel.app/`. Kraken pozostaje trzynastym rekordem technicznym `crypto_validation`, poza katalogiem i bez publicznego CTA. Data Guard zakończył release wynikiem `0 FAIL / 6 WARN / 17 OK`; sześć warningów to recheck reminders na 31.08.2026, nie stale blockers.

North UX Test #1, Evidence Reviews #1–#4, Data Integrity & Freshness Guard oraz implementacja i release katalogu są zakończone. v0.7.2 jest historycznym wcześniejszym wydaniem, nie bieżącym stanem produkcji.

### Continuity & Sync Hardening

**Status:** zakończone przez Continuity Lock #1 z 24.08.2026.

- Wspólny cross-AI entrypoint, Context Map, Sync Protocol, Offer Taxonomy i master recovery state.
- GitHub `/docs` pozostaje canonical; Notion jest operational mirror.
- Materialne zadanie nie jest `Done` bez oceny wymaganej synchronizacji.

### Aktywny etap — Product UX i content hierarchy

**Status:** aktywny od 2026-08-28. Priorytetem jest prosty, spójny flow produktu; nie affiliate infrastructure, community/dystrybucja, mBank public integration ani dalszy catalog expansion.

North prowadzi użytkownika przez cztery pytania w stałej kolejności:

1. Co dostanę?
2. Co muszę zrobić?
3. Gdzie jest haczyk?
4. Dla kogo to ma sens?

Pełna metodologia, evidence, wyjątki i regulaminowe szczegóły pozostają niżej lub na podstronie. Core Profile jest opcjonalny, lokalny i wypełniany raz; katalog działa również bez niego.

#### Sekwencja UX

1. **North Offer Experience v1/v1.1:** `APPROVED UX PATTERN`.
2. **Category Shell & Header v1:** `VISUAL PASS` po micro-fixie.
3. **Offer Identity & Visual Assets Pass v1:** `VISUAL PASS`; provider logos i North visual fallback są wystarczające.
4. **Homepage Simplification v1:** `FUNCTIONAL / PRODUCT / VISUAL PASS` po Founder Review i micro-fixie; lokalny checkpoint `b3593e2` jest kompletny, bez pushu, deployu i publicznej integracji.
5. **Później, po osobnej decyzji Founder/Product:** następny bounded krok; nie otwieramy automatycznie Sprintu 4 ani integracji pełnego flow z publicznym frontendem.

Zaakceptowana IA Homepage v1: Header → Hero → Category Discovery → 3 real offers → Jak działa North → Trust/Sources → Final CTA. Konta są jedyną aktywną kategorią; Oszczędzanie, Inwestowanie, Fintech i Krypto są przyszłymi kierunkami bez martwych linków lub pustych katalogów. Business może dojść później, ale nie jest aktywnym verticalem.

Affiliate support, pilot i tracking są `PARKED`. v0.8.0 Alternative Comparison pozostaje zaakceptowanym lokalnym checkpointem architektury i prototypu mBank, lecz jego publiczna integracja jest późniejsza i podporządkowana UX-first direction. Jedyną równoległą operacją wymagającą terminu jest freshness recheck 31.08.2026; nie jest to nowy feature sprint.

Lokalny flow Sprintów 1–3 jest zaakceptowany. Następny bounded krok wymaga osobnej decyzji Founder/Product; roadmapa nie zakłada jeszcze jego zakresu.

## Zakończone etapy i zachowane kontrakty

Poniższe sekcje dokumentują kolejność historycznych etapów oraz ich Definition of Done. Nie nadpisują aktywnego priorytetu opisanego wyżej.

Research Sprint #1 — Competition & Offers
Cel:
analiza 15–20 najbliższych konkurentów,
analiza 20–30 aktualnych ofert,
porównanie scoringu, UX, personalizacji, transparentności i modelu afiliacyjnego,
przygotowanie ProjectNorth Competitive Map,
wybór pierwszych prawdziwych ofert do produktu,
ustalenie jasnej odpowiedzi, czym North różni się od istniejących serwisów.
Po researchu:
dopracowanie strony głównej / Landing 2.1 na podstawie wyników researchu,
pierwotnie planowano następnie v0.6.1 — Pełne strony ofert; Product Direction Review #1 zastąpił ten zakres przez Decision Model v1 opisany niżej.
Research Sprint nie jest nową wersją produktu i nie wymaga numeru wersji.

**Status researchu:** zakończony 2026-08-16. Product Direction Review #1 zatwierdził zmianę pozycjonowania z rankingu na wyjaśnialny system decyzji. Raport jest materiałem decyzyjnym, nie wydaniem produktu ani dowodem wdrożenia funkcji.

### Etap przygotowawczy — specyfikacja Landing 2.1

- Oprzeć komunikację na propozycji: „Nie pytaj, która premia jest najwyższa. Sprawdź, która ma sens dla Ciebie.”
- Zademonstrować różnicę między reklamowanym maksimum, łatwym rdzeniem i wartością dla scenariusza użytkownika.
- Pokazać sposób dojścia do decyzji, źródła i niepewność; nie sprzedawać North Score jako głównej funkcji.
- Nie przedstawiać North Plan, wiarygodnego `WAIT` ani automatycznego monitorowania regulaminów jako funkcji istniejących.

**Definition of Done:** istnieje zaakceptowana specyfikacja treści i stanów Landing 2.1 oparta na Research Sprint #1. Ten etap nie obejmuje implementacji landingu.

### v0.6.1 — Decision Model v1

**Status:** zaimplementowano 2026-08-16.

**Cel:** udowodnić jakość wyjaśnialnej decyzji na małym, celowo zróżnicowanym zestawie ofert. Nie skalować katalogu do dziesiątek ofert.

- **Bank Millennium:** klasyczna premia, wysiłek miesięczny i czas do nagrody.
- **Nest Bank:** reklamowane maksimum kontra rzeczywisty scenariusz wydatków użytkownika.
- **Bank Pekao:** różne formy nagrody i ograniczona użyteczność marketingowego maksimum.
- BOŚ i Allegro Klik pozostają historycznymi kandydatami z tego etapu, nie aktywnym planem.
- Dla każdej oferty opisać trzy poziomy: `Advertised Max`, `Easy Floor` oraz `Your Likely Value` / `Conditional Max` tam, gdzie ma zastosowanie; wartość scenariuszową oprzeć na jawnych założeniach lub formule.
- Ująć formę i użyteczność nagrody, wymagany kapitał, koszty, opportunity cost, czas, powtarzalne obowiązki, warunki kwalifikacji, karencje i punkty utraty nagrody.
- Rozdzielić kierunkowo `North Value` od `North Confidence`; nie publikować fałszywie precyzyjnych procentów bez danych.
- Użyć adekwatnego werdyktu spośród `TAKE NOW`, `TAKE IF`, `SKIP` i `NOT ENOUGH DATA`. `WAIT` pozostaje poza wiarygodnym zakresem tej wersji.
- Prowadzić ręczny evidence ledger dla krytycznych pól: źródło, regulamin, data weryfikacji i status lub pewność danych.

**Definition of Done — spełnione:** trzy kompletne analizy testują różne przypadki modelu, ujawniają założenia i dowody na poziomie pól oraz prowadzą do wyjaśnialnych, niekoniecznie pozytywnych decyzji. Zakres dowodzi jakości decyzji, nie skali katalogu.

### Po core v0.6.1 — optional stretch: controlled crypto pilot

**Status:** zakończono 2026-08-16 jako v0.6.3. Kraken zaakceptowano tylko jako non-affiliate analysis; wynik `LOW` / `NOT ENOUGH DATA`. Schema bez zmian, kategoria krypto nadal poza MVP.

Ten etap mógł rozpocząć się wyłącznie po walidacji podstawowej trójki v0.6.1: Bank Millennium, Nest Bank i Bank Pekao. Pierwszy publiczny MVP nadal koncentruje się na ofertach niskiego ryzyka; krypto nie staje się główną kategorią produktu.

- Przeanalizować dokładnie jeden crypto hard case: Kraken referral z Research Sprint #1.
- Traktować go jako validation case dla odporności Decision Model v1, nie jako rozszerzenie katalogu, nowy filar North ani zapowiedź szerokiego otwarcia krypto.
- Jawnie pokazać dynamiczny lub niegwarantowany charakter nagrody, większą niepewność danych, ryzyko rynkowe, `North Confidence`, kapitał użytkownika narażony na ryzyko oraz wszystkie wymagane warunki wykonania.
- Dopuścić Verdict `TAKE IF`, `SKIP` lub `NOT ENOUGH DATA`; nie publikować pozytywnego Verdict wyłącznie dlatego, że istnieje afiliacja lub referral.
- Przed publikacją ponownie zweryfikować aktualne warunki promocji, publiczną dostępność ścieżki wejścia, ograniczenia programu referral, dozwolony sposób publikacji i linkowania, ryzyko rynkowe oraz niegwarantowany charakter nagrody.

**Definition of Done — spełnione:** analiza Kraken pokazała, że Decision Model v1 zachowuje użyteczność przy podwyższonym ryzyku i niepewności, bez zmiany core scope v0.6.1 i bez otwierania kategorii krypto.

### v0.6.2 — Evidence & freshness foundation

- **Status:** zaimplementowano 2026-08-16.
- Opublikowano audytowalną metodologię modelu decyzji i granice North Confidence.
- Evidence UI pokazuje typ oficjalnego źródła, dokładną referencję, datę sprawdzenia, poziom wsparcia, niepewność, konflikty i bezpośredni link bez renderowania technicznego JSON 1:1.
- Freshness wylicza `VERIFIED`, `RECHECK DUE`, `EXPIRED` i `UNVERIFIED` z `verifiedAt`, `recheckBy`, statusu, okresu edycji i obecności evidence. Proces pozostaje ręczny.
- Opublikowano politykę afiliacyjną, która nie wpływa na Value, Confidence ani Verdict i dopuszcza przewagę oferty bez linku oraz `SKIP` dla oferty partnerskiej.
- Poprawiono hierarchię mobilną landingu i stron ofert oraz zakończono smoke testy jakości i dostępności.

**Definition of Done — spełnione:** każda prezentowana krytyczna liczba i reguła prowadzi do określonego pochodzenia oraz daty ręcznego review, a użytkownik widzi status aktualności i granice wniosku.

### v0.7.0 — Explainable North Match

- **Status:** zaimplementowano 2026-08-16.
- Dopasowanie opiera się na minimalnym zestawie jawnych założeń użytkownika, bez danych osobowych i bez konta.
- Wynik używa bandów jakościowych oraz pokazuje, dlaczego oferta pasuje lub nie pasuje, co ją blokuje i jak dane zmieniają wartość oraz Verdict.
- Millennium, Nest i Pekao korzystają ze wspólnego interpretera reguł w istniejącym rekordzie Decision Model; Pekao ujawnia dodatkowe pytania podróżne dopiero po ich wybraniu.
- Centralny glossary zapewnia proste polskie definicje i dostępne popovery na desktopie, mobile i klawiaturze.

**Definition of Done — spełnione:** użytkownik może wskazać czynniki wyniku, zmienić założenia, zobaczyć konsekwencję dla `Your Likely Value`, `Expected Usable Value`, `Net Scenario Value`, Match i Verdict oraz odróżnić brak danych od potwierdzonego negatywnego scenariusza.

### v0.7.1 — Treść, SEO i dostępność

- **Status:** zaimplementowano 2026-08-16.
- Uzupełniono unikalne meta title, description i nagłówki; dane strukturalne świadomie pominięto, ponieważ obecny model North i dostępne treści nie uzasadniają prawidłowego typu bez mylącego oznaczenia produktu, oferty lub recenzji.
- Przeprowadzono audyt klawiatury, kontrastu, alternatyw tekstowych, landmarków, relacji ARIA, długich treści i responsywności w trzech viewportach.
- Dodano wyszukiwanie, filtry, licznik wyników, reset i pusty stan bez przebudowy Decision Model.
- Uporządkowano logotypy trzech banków, dostępność glossary i North Match, odporność renderera oraz status archiwalnego prototypu Revolut.

**Definition of Done — spełnione:** kluczowe strony mają komplet metadanych możliwych bez produkcyjnego origin, brak wykrytych krytycznych problemów dostępności oraz czytelne stany wyszukiwania i braku wyników. Canonical, social metadata i sitemap pozostają blokowane do czasu ustalenia prawdziwej domeny oraz publicznej grafiki.

### Deployment & Infrastructure #1

- **Status:** zakończono 2026-08-16.
- Statyczny katalog `frontend/` jest publikowany przez Vercel z GitHub `main`, bez frameworka, procesu budowania, backendu ani zmiennych środowiskowych.
- Produkcyjny origin to `https://project-north-mu.vercel.app/`; HTTPS jest wymuszane przez hosting.
- Indeksowalne strony mają canonical, `og:url`, podstawowe Open Graph i Twitter Summary Card. Historyczny sitemap tego etapu obejmował landing, metodologię, trzy core cases i Kraken validation case.
- Revolut zachowywał `noindex, follow` i nie występował w historycznym sitemap tego etapu. Brak dedykowanej grafiki social blokował wyłącznie metadata obrazkowe.
- Structured data i analytics pozostają świadomie niewdrożone.
- **Operacyjny follow-up — zamknięty 2026-08-17:** push v0.7.2 do `main` automatycznie utworzył produkcyjny deployment `READY`. Sprawdzony manualny snapshot `frontend/` pozostaje wyłącznie fallbackiem.

**Definition of Done — spełnione:** publiczny origin jest rzeczywisty, hosting serwuje wyłącznie frontend, metadata nie używają fikcyjnych adresów, a krytyczne ścieżki produkcji przechodzą test desktop/mobile.

### v0.7.2 — Plain Language & Comprehension

- **Status:** zaimplementowano 2026-08-17; historyczny release poprzedzający katalog 12 ofert.
- Landing, strony bankowe i metodologia pokazują proste polskie etykiety przed nazwami Decision Model.
- Pytania Match opisują sytuację użytkownika i wyjaśniają, że bank zalicza tylko określone wpływy lub płatności.
- Wynik Match zaczyna się od krótkiego podsumowania: sens oferty, realna kwota, główny warunek i największe ryzyko; przy brakach wskazuje dane do uzupełnienia.
- Evidence i Confidence są prezentowane jako „Skąd mamy te dane” i „Jak pewne są dane”.
- Wspólna reguła nagłówków nie rozcina już słów takich jak „Przekorzystne” na mobile.
- `NORTH_WRITING_GUIDE.md` i `AI_WORKFLOW.md` utrwalają standard copy i przebieg kolejnych tasków.

**Definition of Done — spełnione:** główny flow jest zrozumiały bez Glossary, wartości i statusy Decision Model nie zmieniły semantyki, a landing, metodologia, trzy oferty bankowe, Kraken i Revolut przeszły testy desktop/tablet/mobile, dostępności i produkcyjny smoke.

### Evidence Reviews #2–#4 i katalog 12 ofert

- **Status:** zakończone i wydane 2026-08-24.
- Review #2: Catalog Expansion Batch 1.
- Review #3: Catalog Expansion Batch 2 + Affiliate Bonus Research.
- Review #4: Small Batch 3 i decyzja o zakończeniu szerokiego discovery.
- Release `24c2d7c` opublikował 12 ofert; Kraken pozostał validation-only.
- Data Integrity & Freshness Guard jest osobną warstwą techniczną, nie Evidence Review.

### v0.8.0 — Alternative Comparison & Product Identity Mapping

**Status:** zakończony lokalny checkpoint architektury i bounded prototype; acceptance oraz UX density pass zakończone. Publiczna integracja nie jest aktywnym etapem i wymaga późniejszej, osobnej decyzji zgodnej z UX-first direction.

**Cel:** przejść od analizy jednej wskazanej oferty do wyjaśnialnego wyboru produktu dla sytuacji użytkownika, bez budowania rankingu reklamowanych premii.

- Zmapować dla przypadku mBank co najmniej trzy odrębne `Product Identities`, ich segmenty, opłaty, funkcjonalne przewagi, Promotion Editions i Promotion Variants na aktualnym oficjalnym evidence.
- Zdefiniować minimalne pytania rozdzielające sytuacje, m.in. wiek, typ codziennego użycia, wpływy lub aktywa, potrzeby premium/podróżne oraz tolerancję warunków i opłat.
- Zaprojektować widok, który najpierw wyjaśnia „dlaczego ten produkt pasuje”, a następnie pokazuje dwie uczciwe alternatywy i ryzyka zmiany scenariusza.
- Rozdzielić porównanie produktu od wyboru promocji, kanału i źródła afiliacyjnego zgodnie z `OFFER_TAXONOMY.md`.
- Utrzymać jakościowe Match/Verdict, jawne Confidence i Evidence oraz obowiązkową alternatywę `Do Nothing`; bez Match %, Score 0–100 i automatycznego sumowania wariantów.
- Zachować prototyp jako referencję. Ewentualny task integracyjny otworzyć dopiero po decyzji dotyczącej pełnego flow i bez cofania prostoty zaakceptowanego kierunku UX.

**Definition of Done:** istnieje zatwierdzony, generyczny kontrakt porównania i sprawdzony prototyp mBank, a następnie jego implementacja potrafi wybrać właściwy produkt i wariant dla scenariusza bez bankowych wyjątków w logice, bez wpływu afiliacji i bez sugerowania uniwersalnego zwycięzcy.

### Kamień milowy 1.0 — prywatna beta

**Status:** przełożona z v0.8.0; nie jest aktywnym etapem. W fazie testowej oznaczamy build jako `v1.0-beta`, aby nie przedstawiać go jako stabilnego publicznego 1.0 przed ukończeniem bram.

- Otworzyć grupę testową dopiero po wdrożeniu i jakościowej walidacji Alternative Comparison.
- Zdefiniować zadania obejmujące wybór produktu, zrozumienie powodów, zmianę scenariusza, odrzucenie niedopasowanej oferty i przejście do CTA.
- Mierzyć podstawowe przejścia: katalog → porównanie → oferta → CTA oraz miejsca rezygnacji.
- Zbierać jakościowy feedback i obserwacje decyzji, nie tylko liczbę kliknięć.
- Przed otwarciem potwierdzić freshness, zasady źródeł, tracking, transparentność afiliacyjną i bezpieczne wyjście z ofert objętych testem.

**Definition of Done:** decyzje o publicznym 1.0 wynikają z obserwacji użytkowników oraz danych o zrozumieniu i wykonaniu decyzji, a nie tylko z intuicji zespołu lub CTR.

## Później, nie teraz

- Offer Execution i Freshness Operations tooling — po potwierdzeniu potrzeby.
- Controlled Catalog Expansion — dopiero po opanowaniu freshness/source operations.
- Pełny North Plan / portfolio planner i conflict engine — po walidacji modelu decyzji i dopasowania.
- Historyczne `WAIT` vs `TAKE` — dopiero po zebraniu porównywalnych edycji, określeniu jakości danych i wykonaniu backtestu.
- Automatyczne monitorowanie regulaminów — dopiero po sprawdzeniu ręcznego evidence ledger.
- Krypto jako kategoria — poza katalogiem; Kraken jest jedynym validation-only hard case'em.
- Motion i zaawansowane animacje — dopiero po stabilizacji treści i ścieżek.
- Szeroka porównywarka cross-bank i masowe porównania — dopiero po walidacji generycznego kontraktu na mBank i kilku kontrolowanych rodzinach produktów.
- Konta użytkowników, backend, premium i ML/AI personalization — po potwierdzeniu potrzeby.
- Integracje analityczne — minimalnie i z poszanowaniem prywatności; nie są substytutem badań użytkowników.
