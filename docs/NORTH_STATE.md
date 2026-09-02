# ProjectNorth — canonical state and AI recovery

> Master recovery document · stan roboczy: 2026-09-02 · publiczny release aplikacji: `24c2d7c5450b44ae07e12267f592b5898849bb54` · najnowszy lokalny UX checkpoint: `b3593e2118af48103d0518cdcc0c3fad47af4513` · Sprint 4A Truth & Eligibility Core oczekuje Founder Review

Ten dokument jest pierwszym źródłem bieżącego kontekstu po utracie rozmowy, zmianie AI, zmianie osoby pracującej nad projektem albo dłuższej przerwie. Szczegóły wydań należą do `CHANGELOG.md`, trwałe uzasadnienia do `DECISIONS.md`, a fakty wdrożonych ofert do `frontend/data/decision-offers.json`.

Najważniejsze rozdzielenie stanu na 2026-09-02:

- **PUBLIC PRODUCTION:** nadal pokazuje wcześniejszy UX i katalog 12 ofert z release'u `24c2d7c`;
- **LOCAL MAIN / APPROVED UX:** zawiera lokalne checkpointy `f2747b7 feat: establish North offer experience UX` oraz `b3593e2 feat: add simplified North homepage prototype`; lokalny `main` jest przed `origin/main`;
- **PRODUCTION ≠ LOCAL APPROVED UX:** oba checkpointy UX są lokalne; nie wykonano pushu ani deployu i nie są publicznie zintegrowane;
- **LOCAL UNCOMMITTED / SPRINT 4A:** wdrożono kontrakt eligibility V2, component-level gating, realny zegar freshness, evidence capability, oddzielne user/evidence gaps i bezpieczne buckety wartości; zmiany nie są jeszcze zatwierdzonym checkpointem i oczekują Founder Review;
- **LOCAL UNCOMMITTED / SPRINT 4A REPAIR PASS #1:** naprawiono zweryfikowane findingi P0/P1; runtime i validator fail-closed przy mixed generation, driftujących targetach/ID oraz source edition drift. Pekao pozostaje `CONFLICTING`/`UNKNOWN` do pełnego rechecku nowych edycji; bez stage/commit/push/deploy.
- `.gitattributes`, `.codex-remote-attachments/` i `artifacts/` są chronionymi leftovers poza zakresem UX i dokumentacji.

## 1. Czym jest ProjectNorth i dlaczego istnieje

ProjectNorth to polskojęzyczny **wyjaśnialny system decyzji dotyczących okazji finansowych**. Odpowiada przede wszystkim na pytanie:

> Czy ta oferta ma sens dla mnie?

Pozycjonowanie produktu:

> Nie pytaj, która premia jest najwyższa. Sprawdź, która ma sens dla Ciebie.

North istnieje dlatego, że reklamowane maksimum nie mówi, ile konkretna osoba rzeczywiście wykorzysta, ile pracy i czasu wymaga oferta, jakie tworzy koszty oraz gdzie można utracić nagrodę. System łączy wartość, warunki, dowody, ryzyko i alternatywy w wyjaśnialną rekomendację działania.

ProjectNorth nie jest:

- rankingiem najwyższych premii;
- katalogiem afiliacyjnym ani stroną „kliknij i zarób”;
- systemem optymalizującym prowizję wydawcy;
- obietnicą zysku ani substytutem regulaminu.

## 2. Nienaruszalne zasady

- Analizuj decyzję, nie sam `Advertised Max`.
- North Value zawsze wynika z jawnego scenariusza. Nie istnieje jedna uniwersalna „realna nagroda”.
- Rozdzielaj gotówkę, cashback, voucher, nagrodę rzeczową, odsetki, zwolnienie z opłat i wartość funkcjonalną. Nie przedstawiaj nominału niegotówkowego jako gotówki.
- Pokazuj razem: wartość, effort, duration, direct cost, opportunity cost, failure risk, flexibility, safe exit oraz alternatywę `do nothing`.
- `Do Nothing` jest obowiązkową i pełnoprawną alternatywą, nie stanem błędu.
- Nie używaj fałszywej precyzji: żadnego `Match %`, „93% match”, arbitralnego EV ani Score 0–100 jako głównego wyniku decyzji.
- Nie używaj fake social proof ani nieudowodnionych twierdzeń o użytkownikach, wynikach lub popularności.
- Krytyczna liczba lub reguła musi prowadzić do evidence, daty sprawdzenia i poziomu wsparcia.
- Brak danych albo nierozwiązany konflikt może wymagać `CANNOT ASSESS` i `NOT ENOUGH DATA`. Nie uzupełniaj luk intuicją.
- Prosty język jest pierwszą warstwą. Glossary pomaga, ale nie może być wymagane do zrozumienia głównego flow.
- Nie przedstawiaj hipotezy, backlogu ani planu jako istniejącej funkcji.
- Główny flow ma odpowiadać kolejno: **co dostanę, co muszę zrobić, gdzie jest haczyk, dla kogo to ma sens**. Metodologia, pełne źródła i wyjątki należą do warstwy niżej lub podstrony.
- Core Profile jest opcjonalnym kontekstem, nie bramką dostępu. Bez profilu katalog i szczegóły ofert pozostają dostępne.

## 3. Decision Model v1 + Truth & Eligibility Core — aktywny lokalny rdzeń

Sprint 4A dodaje minimalny `north-eligibility-v2`. Autorytatywna kwalifikacja może być scoped per provider, promotion/component, relationship type i date window. Krytyczna odpowiedź engine wynika mechanicznie z coverage oraz aktualności evidence, a nie ze statycznego `HIGH/MEDIUM/LOW`. Stare `northConfidence` pozostaje polem zgodności wstecznej. Brak odpowiedzi użytkownika i brak wystarczającego evidence są osobnymi stanami. Różne formy i waluty wartości pozostają w osobnych bucketach.

### North Value

Wartość scenariuszowa, budowana jawnie z:

- `Advertised Max` — maksimum komunikowane przez oferenta;
- `Easy Floor` — prostszy, opisany wariant, jeśli uczciwie istnieje;
- `Your Likely Value` — wartość wynikająca z odpowiedzi użytkownika;
- `Expected Usable Value` — wartość po uwzględnieniu formy i użyteczności nagrody;
- `Net Scenario Value` — wartość użyteczna po potwierdzonych kosztach bezpośrednich i jawnym opportunity cost.

Effort, duration, failure risk i flexibility pozostają widoczne osobno. Nie są ukrytą karą punktową.

### North Confidence

Opisuje jakość, kompletność, świeżość i spójność evidence oraz wniosku. Bandy: `HIGH`, `MEDIUM`, `LOW`, zawsze z konkretnym powodem. Confidence nie opisuje atrakcyjności oferty.

### North Match

Opisuje dopasowanie oferty do sytuacji użytkownika. Statusy:

- `FIT`;
- `CONDITIONAL FIT`;
- `POOR FIT`;
- `CANNOT ASSESS`.

Match nie jest rankingiem, procentem ani zamiennikiem Verdict.

### North Verdict

Rekomendacja działania w danym scenariuszu:

- `TAKE NOW`;
- `TAKE IF`;
- `SKIP`;
- `NOT ENOUGH DATA`.

`WAIT` jest **wyłączone**. Nie wolno go dodać bez historii porównywalnych edycji, mechanizmu zmian i backtestingu.

## 4. Affiliate neutrality — warstwa nienegocjowalna

```text
Affiliate Source Layer != Product Decision Layer
```

Prowizja, bonus wydawcy, dostępność sieci ani preferowane źródło nie mogą zmieniać:

- North Value;
- North Match;
- Confidence produktu;
- Verdict;
- kolejności ofert ani tonu analizy.

Oferta najlepsza dla użytkownika może nie mieć dobrego źródła afiliacyjnego. Wysokopłatna kampania może otrzymać `SKIP`. To jest poprawne zachowanie systemu.

## 5. Aktualny publiczny release

- Commit aplikacji: `24c2d7c5450b44ae07e12267f592b5898849bb54` — `feat: release 12-offer catalog`.
- Produkcja: `https://project-north-mu.vercel.app/`.
- Hosting: Vercel, Root Directory `frontend/`, automatyczny deploy z GitHub `main`.
- Technologia: statyczny HTML/CSS/vanilla JavaScript; bez backendu, kont, bazy, persistence i analytics.
- Publiczny stan zawiera **12 kart katalogowych**. v0.7.2 jest historycznym wcześniejszym release'em, nie bieżącą produkcją.

### Publiczne 12 ofert

1. Millennium 360°.
2. Nest Konto.
3. Pekao Konto Przekorzystne.
4. Alior Konto 18–25.
5. Erste Konto Smart.
6. Revolut Standard.
7. mBank eKonto do usług.
8. PKO Konto za Zero.
9. BNP Konto Otwarte na Ciebie.
10. UniCredit Konto Osobiste.
11. VeloBank Elastyczne Konto Oszczędnościowe.
12. Alior Konto Plus.

### Kraken

Kraken jest trzynastym rekordem technicznym `crypto_validation`: validation-only, poza katalogiem, bez publicznego CTA, z `LOW` Confidence i `NOT ENOUGH DATA`. Nie otwiera kategorii krypto i nie może zostać policzony jako trzynasta oferta katalogowa.

### Release gates zapisane dla `24c2d7c`

- Data Guard: `0 FAIL / 6 WARN / 17 OK`.
- Guard tests: `16/16 PASS`.
- Match matrix: `50/50 PASS`.
- JavaScript syntax: `9/9 PASS`.
- Lokalne trasy ofert: `12/12 PASS`.
- Sprawdzone URL-e produkcyjne: `28/28 HTTP 200`.
- Browser smoke: `PASS`.
- Keyboard smoke: `PASS`.
- GitHub → Vercel deploy: `READY`.

Sześć warningów nie blokowało release'u i nie oznaczało stale evidence w dniu wydania. To historyczny wynik bramy release'owej, nie bieżący wynik lokalnego guardu.

## 6. Upcoming freshness recheck

Najbliższy maintenance deadline: **2026-08-31**.

Ręczny freshness recheck obejmuje:

- Nest;
- Pekao;
- mBank;
- Kraken;
- landing gate Pekao;
- landing gate Nest.

To `Freshness Operations`, nie Evidence Review #5 i nie błąd wydania. Ostatni lokalny Data Guard uruchomiony na `2026-08-29` miał `0 FAIL / 10 WARN / 13 OK`; warningi są przypomnieniami o istniejących terminach rechecku, nie skutkiem prototypów UX. Recheck musi nastąpić przed publiczną integracją odpowiednich ofert; ten sync nie zmienia facts ani evidence.

## 7. Historia Evidence Reviews — numeracja zamknięta

### Evidence Review #1 — core Evidence & Trust foundation

Pierwszy pełny review oficjalnych źródeł dla core Decision Model: Millennium, Nest i Pekao. Utrwalił field-level evidence, Confidence, jawne konflikty oraz zakaz pozytywnego Verdict bez scenariusza użytkownika.

### Evidence Review #2 — Catalog Expansion Batch 1

Data: **2026-08-23**. Zakres: Millennium 360°, Nest Konto, Pekao Konto Przekorzystne, Alior Konto 18–25, Erste Konto Smart i VeloKonto.

### Evidence Review #3 — Catalog Expansion Batch 2 + Affiliate Bonus Research

Zakres: Revolut Standard, zmiana tożsamości Santander → Erste, mBank eKonto do usług, PKO Konto za Zero, BNP Konto Otwarte na Ciebie oraz oddzielna analiza wybranych mechanik bonusów/źródeł afiliacyjnych.

### Evidence Review #4 — Small Batch 3

Zakres: UniCredit Konto Osobiste, VeloBank Elastyczne Konto Oszczędnościowe i Alior Konto Plus. Najważniejsza decyzja: zakończyć szeroki catalog discovery i przejść do implementacji pierwszego kontrolowanego katalogu.

**Data Integrity & Freshness Guard nie jest Evidence Review #2 ani żadnym innym Evidence Review.** To osobna techniczna warstwa walidacyjna danych, referencji, kontraktów i freshness.

## 8. Inne ważne rundy walidacji

- Research Sprint #1 — Competition & Offers.
- Product Direction Review #1 — odejście od rankingu na rzecz explainable decision system.
- Kraken Crypto Hard Case — kontrolowany stress test modelu, nie rozszerzenie katalogu.
- Explainable Match & Glossary Validation.
- v0.7.1 Quality Review — treść, SEO, accessibility, search/filter i responsywność.
- Deployment & Infrastructure #1.
- v0.7.2 Plain Language & Comprehension.
- North UX Test #1 — zakończony; nie jest aktywnym „next step”.
- Data Integrity & Freshness Guard — techniczny guard, nie Evidence Review.
- 12-Offer Catalog Implementation & Validation.
- Affiliate Source Research #1 i Full Affiliate Offer Discovery #1.

Historia wyjaśniająca, dlaczego North ma dzisiejszą formę, znajduje się w `PROJECT_HISTORY.md`.

## 9. Krytyczne reguły faktów ofertowych

- **Millennium:** bieżąca promocja to 700 PLN. Nie przywracaj 900/1000 PLN jako obecnej prostej premii indywidualnej.
- **Nest:** maksimum 1 250 PLN = do 1 200 PLN cashbacku + 50 PLN dodatkowej nagrody. Minimum 100 EUR jest progiem wymiany, nie wysokością nagrody. Confidence mechaniki: `HIGH`; dynamiczny FX może wpływać na wartość netto.
- **Pekao:** 300 PLN cash + do 2 400 PLN warunkowej wartości podróżnej. Nie opisuj 2 700 PLN jako gotówki.
- **Alior Plus:** 800 PLN cash + pierścień wyceniany przez bank na 500 PLN. Nie opisuj 1 300 PLN jako gotówki.
- **UniCredit:** 3 × 50 PLN e-voucher Żabka. 150 PLN nie jest gotówką.
- **Velo EKO:** 6% to oprocentowanie roczne zależne od salda, czasu, tierów, aktywności i podatku; nie stała nagroda kapitałowa.
- **Revolut:** bazowym produktem jest Revolut Standard bez ogólnej gwarantowanej premii jako głównej wartości.

Bieżące fakty implementacyjne zawsze sprawdzaj w `decision-offers.json`; powyższa lista jest guardem semantycznym, nie równoległym ledgerem ofert.

## 10. Affiliate research — zakończony checkpoint, praca PARKED

23.08.2026 zakończono `Affiliate Source Research #1` oraz `Full Affiliate Offer Discovery #1`.

- Money2Money: 109 przejrzanych kampanii.
- ComperiaLead: 75.
- LeadStar: 452.
- Łącznie: 636 kampanii.
- Do zakresu North: 285 rekordów finansowych/ubezpieczeniowych.
- Po roboczej deduplikacji: 165 ofert lub istotnych wariantów.

Ten wynik nie tworzy planu katalogu 165 ofert. Potwierdził zasadność kontrolowanego katalogu. Późniejszy support/source-selection/tracking work jest zachowany jako ukończony research i operacyjny materiał wejściowy, ale **nie jest aktywnym następnym krokiem**.

Od 2026-08-28 cały affiliate support, pilot i tracking są `PARKED` z powodu nadrzędnego priorytetu Product UX. Nie implementujemy teraz CTA/tracking, nie uruchamiamy pilota i nie używamy ekonomii afiliacyjnej do wyboru backlogu produktu. Realized economics pozostaje nieudowodnione bez własnych, porównywalnych danych acceptance, reversal, payout i czasu rozliczenia.

## 11. Aktualny etap projektu

Continuity Lock #1 i v0.8.0 Alternative Comparison są zakończonymi checkpointami. Architektura i prototyp mBank istnieją, przeszły acceptance oraz density pass, ale ich publiczna integracja jest późniejsza i podporządkowana obecnemu kierunkowi UX.

Od **2026-08-28 aktywnym priorytetem jest Product UX i content hierarchy**. Nie są nim: infrastruktura afiliacyjna, community/dystrybucja, mBank public integration ani dalsze rozszerzanie katalogu.

### Core Profile i wspólny flow

- Jeden krótki Core Profile jest wypełniany raz i ponownie używany na homepage, w katalogu i na detail page.
- Klucz lokalnego prototypu: `north.offerExperience.profile.v1`.
- Brak backendu, loginu i konta użytkownika; odpowiedzi pozostają w `localStorage` i można je zmienić lub wyczyścić.
- Bez profilu pełny katalog i każda oferta pozostają dostępne. Z profilem karty i detail dodają interpretację „co to znaczy dla Ciebie”, nie zmieniając faktów oferty.
- Przyszły Progressive Profile może dodawać wyłącznie pytania specyficzne dla kategorii, gdy realnie zmieniają kilka decyzji lub ważny hard gate.
- Header używa `Dopasuj oferty` bez profilu i `Twoje dopasowanie` po zapisie. Terminy `Profil` i `Konto` są zarezerwowane dla przyszłego user account/login.

### Status lokalnych sprintów UX

1. **Sprint 1 — North Offer Experience v1/v1.1:** `APPROVED UX PATTERN`; lokalny checkpoint `f2747b7`.
2. **Sprint 2 — Category Shell & Header v1:** `VISUAL PASS` po micro-fixie. `Konta` są aktywne; Oszczędzanie, Inwestowanie, Fintech i Krypto pozostają nieinteraktywne bez martwych linków i pustych katalogów.
3. **Offer Identity & Visual Assets Pass v1:** `VISUAL PASS` po micro-fixie. Logo providerów i North visual fallback są wystarczające; nie dodajemy stocków ani marketingowych product visuals.
4. **Sprint 3 — Homepage Simplification v1:** `FUNCTIONAL / PRODUCT / VISUAL PASS` po Founder Review i micro-fixie; lokalny checkpoint `b3593e2` jest kompletny, bez pushu, deployu i publicznej integracji.

Lokalny flow Sprintów 1–3 został zaakceptowany. Nie otwiera to automatycznie Sprintu 4; następny bounded krok wymaga osobnej decyzji Founder/Product.

### Zaakceptowany kierunek Homepage Simplification v1

- H1: `Znajdź ofertę, która faktycznie ma sens dla Ciebie.`
- Supporting copy: `Sprawdzamy premie, warunki i haczyki. Ty odpowiadasz na kilka pytań, a North pokazuje, które oferty pasują do Twojej sytuacji.`
- CTA bez profilu: `Dopasuj oferty do mnie`; secondary: `Przeglądaj wszystkie oferty`.
- CTA z profilem: `Zobacz dopasowane oferty`.
- IA: Header → Hero → Category Discovery → 3 real offers → Jak działa North → Trust/Sources → Final CTA.
- Hero zachowuje abstrakcyjny visual na desktopie; na mobile visual jest ukryty.
- Informacja `Kolejne kategorie w przygotowaniu` występuje raz w headerze; Category Discovery nie dubluje tego komunikatu.
- Trzy realne oferty to Millennium 360°, Nest Konto i Pekao Konto Przekorzystne. Nie ma podium, rankingu ani języka zwycięzcy.
- Pekao jest prezentowane jako `300 zł gotówki + do 2 400 zł warunkowej wartości podróżnej`, nigdy jako 2 700 zł gotówki.

Public integration całej ścieżki wymaga osobnej decyzji po aktualnym UX kierunku i po wymaganych recheckach evidence. Ukończone lokalne checkpointy nie są zgodą na push, deploy ani zmianę produkcji.

## 12. Co pozostaje hipotezą lub otwartym problemem

- Czy i kiedy zatwierdzony lokalny flow homepage → category → card → detail → Core Profile powinien zastąpić wcześniejszy publiczny UX.
- Jak włączyć v0.8.0 Alternative Comparison do późniejszego publicznego flow bez cofnięcia prostoty obecnego kierunku UX.
- Czy konto wspólne wymaga później osobnego pytania o wydatki kartą każdej osoby, czy jawny unresolved factor wystarcza.
- Które przyszłe kategorie zostaną aktywowane i w jakiej kolejności; Business jest możliwym późniejszym kierunkiem, nie aktywnym verticalem.
- Affiliate source selection, tracking i realized economics pozostają materiałem późniejszym, obecnie `PARKED`.
- Bieżąca dostępność promocji po ich terminach `recheckBy`; wymaga ręcznej kontroli, nie założenia.

## 13. Czego teraz świadomie nie robimy

Nie otwieramy teraz:

- Evidence Review #5 tylko z powodu rechecku 31.08;
- szerokiego lub hurtowego Catalog Expansion;
- publicznej integracji Homepage v1, Offer Experience albo Alternative Comparison bez osobnej decyzji i release gates;
- szerokiej porównywarki cross-bank przed walidacją generycznego flow na kontrolowanych rodzinach produktów;
- prywatnej bety przed kamieniem milowym 1.0; build testowy ma używać oznaczenia `v1.0-beta`, nie udawać stabilnego publicznego 1.0;
- Offer Execution bez osobnej decyzji i zweryfikowanych warunków bezpiecznego wykonania;
- backendowego profilu użytkownika, konta/loginu, conflict engine, historii ofert ani `WAIT`;
- backendu, kont, premium, ML/AI recommendation layer;
- szerokiej kategorii krypto;
- affiliate support/pilota/trackingu, agresywnej dystrybucji afiliacyjnej ani aktywacji wszystkich CTA;
- community i dystrybucji jako aktywnego priorytetu;
- Founding Members/revenue share bez potwierdzonych zasad;
- automatycznego wpływu afiliacji na wybór produktu, Match, Confidence lub Verdict.

Potencjalne późniejsze kierunki: Offer Execution, Freshness Operations tooling, Controlled Catalog Expansion, szerokie porównania cross-bank oraz Community & Growth Validation. To opcje zależne od danych, nie aktywny plan.

## 14. Mapa źródeł prawdy

| Źródło | Autorytet |
| --- | --- |
| Lokalny working tree i stage jawnie otwartego tasku | Najnowszy stan lokalnego UX; nie jest produkcją ani release'em przed osobnym commit/push/deploy. |
| GitHub `/docs` | Kanoniczne decyzje, model, zasady, roadmapa i historia. |
| `frontend/data/decision-offers.json` | Fakty ofert faktycznie używane przez wdrożony produkt. |
| Oficjalne źródła finansowe | Bieżąca prawda produktowa; dokumentacja i dane wymagają synchronizacji po zmianie źródła. |
| Kod frontendu | Faktyczny stan implementacji i zachowania UI. |
| Git history | Sekwencja zmian, release SHA i możliwość audytu. |
| Notion | Operational mirror, hipotezy, Sprint Board i Validation Archive; nie nadpisuje GitHub `/docs`. |

Gdy dokumenty są sprzeczne:

1. jawnie zatwierdzony lokalny working tree wygrywa dla bieżącego lokalnego UX, ale nie zmienia stanu publicznego;
2. aktualny GitHub `/docs` wygrywa dla zatwierdzonych decyzji i historii;
3. aktualny `decision-offers.json` wygrywa dla faktów wdrożonych;
4. oficjalne źródła finansowe wygrywają dla bieżącej prawdy produktowej;
5. konflikt należy nazwać i zsynchronizować, nie rekonstruować z intuicji.

## 15. Recovery instructions dla przyszłego AI

Jeżeli tracisz kontekst ProjectNorth:

1. Przeczytaj `README.md`.
2. Przeczytaj ten dokument w całości.
3. Przeczytaj `docs/DECISIONS.md`.
4. Przeczytaj `docs/ROADMAP.md`.
5. Przeczytaj `docs/NORTH_OFFER_EXPERIENCE_V1.md` dla aktualnego lokalnego kontraktu UX.
6. Przeczytaj `docs/AI_WORKFLOW.md`.
7. Sprawdź `pwd`, root Git, branch, `git status`, `git log`, stage oraz relację `HEAD` do `origin/main`.
8. Traktuj `frontend/data/decision-offers.json` jako źródło faktów ofertowych.
9. Traktuj Notion wyłącznie jako operational mirror; starszy Sprint Board lub Roadmap nie nadpisuje aktualnego handoffu Foundera i kanonicznych docs.
10. Nie rekonstruuj brakujących decyzji z intuicji ani z pamięci rozmowy.
11. Porównaj produkcję, `main`, lokalny `HEAD`, working tree i stage. Nazwij każdą rozbieżność.
12. Zachowaj lokalne zmiany i chronione leftovers; stage'uj tylko jawnie dozwolone ścieżki.
13. Przed zmianą zakresu przypomnij aktywny priorytet Product UX i sekcję „Czego teraz świadomie nie robimy”.

## 16. Kiedy aktualizować ten dokument

Aktualizuj `NORTH_STATE.md`, gdy zmienia się publiczny release, lokalny zatwierdzony checkpoint mający znaczenie dla recovery, pozycjonowanie, Decision Model, liczba ofert, numeracja Evidence Reviews, aktywny etap, maintenance deadline albo nienaruszalna zasada. Nie kopiuj do niego pełnych warunków każdej oferty ani kroniki commit po commicie.
