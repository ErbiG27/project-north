# ProjectNorth — canonical state and AI recovery

> Master recovery document · stan kanoniczny: 2026-08-24 · publiczny release aplikacji: `24c2d7c5450b44ae07e12267f592b5898849bb54` · Decision Model v1

Ten dokument jest pierwszym źródłem bieżącego kontekstu po utracie rozmowy, zmianie AI, zmianie osoby pracującej nad projektem albo dłuższej przerwie. Szczegóły wydań należą do `CHANGELOG.md`, trwałe uzasadnienia do `DECISIONS.md`, a fakty wdrożonych ofert do `frontend/data/decision-offers.json`.

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

## 3. Decision Model v1 — aktywny rdzeń

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

Sześć warningów nie blokowało release'u i nie oznacza stale evidence. To operacyjne przypomnienia opisane poniżej.

## 6. Upcoming freshness recheck

Najbliższy maintenance deadline: **2026-08-31**.

Ręczny freshness recheck obejmuje:

- Nest;
- Pekao;
- mBank;
- Kraken;
- landing gate Pekao;
- landing gate Nest.

To `Freshness Operations`, nie Evidence Review #5 i nie błąd wydania.

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

## 10. Affiliate research — aktualny stan

23.08.2026 zakończono `Affiliate Source Research #1` oraz `Full Affiliate Offer Discovery #1`.

- Money2Money: 109 przejrzanych kampanii.
- ComperiaLead: 75.
- LeadStar: 452.
- Łącznie: 636 kampanii.
- Do zakresu North: 285 rekordów finansowych/ubezpieczeniowych.
- Po roboczej deduplikacji: 165 ofert lub istotnych wariantów.

Ten wynik nie tworzy planu katalogu 165 ofert. Potwierdził zasadność kontrolowanego katalogu.

Wiadomości zostały wysłane do supportów Money2Money, ComperiaLead i LeadStar. Odpowiedzi są **pending**. Pytania obejmują m.in. social → North → bank, organic/paid social, własne copy i analizy, Discord/Telegram/community, domain approval, cookie window, cross-device, acceptance, reversal, validation time, caps, EPI/subID, API/postback oraz revenue share/cashback permissions.

Dopóki odpowiedzi nie nadejdą, Preferred Source i Backup Source pozostają hipotezami tam, gdzie nie ma wystarczającej pewności operacyjnej. Realized economics pozostaje nieudowodnione bez własnych danych acceptance/reversal i czasu rozliczenia.

## 11. Aktualny etap projektu

Continuity Lock #1 domyka obecnie **Continuity & Sync Hardening**: cross-AI entrypointy, Context Map, Sync Protocol, Offer Taxonomy, kanoniczny recovery state oraz synchronizację GitHub ↔ Notion. Nie otwiera nowego sprintu produktowego.

Po zamknięciu continuity pack aktywne są następujące strumienie operacyjne:

1. **Affiliate support responses** — czekać na Money2Money, ComperiaLead i LeadStar.
2. **Affiliate source selection** — po odpowiedziach przypisać wybranym ofertom `Preferred Source`, `Backup Source` albo `No verified source`.
3. **Tracking taxonomy / pilot design** — `offer`, `network`, `source`, `placement`, `content`, `creative`, `cohort`, `version`.
4. **Controlled first affiliate activation** — uruchomić kilka kontrolowanych CTA/źródeł, nie cały katalog jednocześnie.
5. **Community / distribution** — wczesny fanpage Facebook, Discord, pierwsi użytkownicy i realny feedback; to nie są jeszcze duże kanały.
6. **Real North data** — zbierać clicks, applications, accepted, rejected, reversal, validation time, payout time, source, placement i content.

Najpierw wartość i realne użycie produktu; dopiero własne dane pozwolą ocenić realized economics.

## 12. Co pozostaje hipotezą lub otwartym problemem

- Preferred/Backup Source bez potwierdzonych zasad operacyjnych supportu.
- Cookie window, cross-device, caps, acceptance/reversal, własne materiały, community traffic, tracking i revenue-share permissions.
- Skuteczność pierwszych kanałów Facebook/Discord i faktyczne zainteresowanie użytkowników.
- Który kolejny kierunek produktowy daje największą wartość po zebraniu sygnałów.
- Bieżąca dostępność promocji po ich terminach `recheckBy`; wymaga ręcznej kontroli, nie założenia.

## 13. Czego teraz świadomie nie robimy

Nie otwieramy teraz:

- Evidence Review #5 tylko z powodu rechecku 31.08;
- szerokiego lub hurtowego Catalog Expansion;
- Alternative Comparison, mocniejszego Do Nothing & Alternatives ani Offer Execution bez realnego sygnału;
- profili użytkownika, conflict engine, historii ofert ani `WAIT`;
- backendu, kont, premium, ML/AI recommendation layer;
- szerokiej kategorii krypto;
- agresywnej dystrybucji afiliacyjnej ani aktywacji wszystkich CTA;
- Founding Members/revenue share bez potwierdzonych zasad;
- kolejnego sprintu produktowego podczas Continuity Lock.

Potencjalne późniejsze kierunki: Alternative Comparison, Do Nothing & Alternatives, Offer Execution, Freshness Operations tooling, Controlled Catalog Expansion oraz Community & Growth Validation. To opcje zależne od danych, nie aktywny plan.

## 14. Mapa źródeł prawdy

| Źródło | Autorytet |
| --- | --- |
| GitHub `/docs` | Kanoniczne decyzje, model, zasady, roadmapa i historia. |
| `frontend/data/decision-offers.json` | Fakty ofert faktycznie używane przez wdrożony produkt. |
| Oficjalne źródła finansowe | Bieżąca prawda produktowa; dokumentacja i dane wymagają synchronizacji po zmianie źródła. |
| Kod frontendu | Faktyczny stan implementacji i zachowania UI. |
| Git history | Sekwencja zmian, release SHA i możliwość audytu. |
| Notion | Operational mirror, hipotezy, Sprint Board i Validation Archive; nie nadpisuje GitHub `/docs`. |

Gdy dokumenty są sprzeczne:

1. aktualny GitHub `/docs` wygrywa dla decyzji;
2. aktualny `decision-offers.json` wygrywa dla faktów wdrożonych;
3. oficjalne źródła finansowe wygrywają dla bieżącej prawdy produktowej;
4. konflikt należy nazwać i zsynchronizować, nie rekonstruować z intuicji.

## 15. Recovery instructions dla przyszłego AI

Jeżeli tracisz kontekst ProjectNorth:

1. Przeczytaj `README.md`.
2. Przeczytaj ten dokument w całości.
3. Przeczytaj `docs/DECISIONS.md`.
4. Przeczytaj `docs/ROADMAP.md`.
5. Przeczytaj `docs/AI_WORKFLOW.md`.
6. Sprawdź `pwd`, root Git, branch, `git status`, `git log` oraz relację `HEAD` do `origin/main`.
7. Traktuj `frontend/data/decision-offers.json` jako źródło faktów ofertowych.
8. Traktuj Notion wyłącznie jako operational mirror.
9. Nie rekonstruuj brakujących decyzji z intuicji ani z pamięci rozmowy.
10. Porównaj produkcję, `main` i working tree. Nazwij każdą rozbieżność.
11. Zachowaj lokalne zmiany i chronione leftovers; stage'uj tylko jawnie dozwolone ścieżki.
12. Przed zmianą zakresu przypomnij aktualny etap i sekcję „Czego teraz świadomie nie robimy”.

## 16. Kiedy aktualizować ten dokument

Aktualizuj `NORTH_STATE.md`, gdy zmienia się publiczny release, pozycjonowanie, Decision Model, liczba ofert, numeracja Evidence Reviews, aktywny etap, maintenance deadline albo nienaruszalna zasada. Nie kopiuj do niego pełnych warunków każdej oferty ani kroniki commit po commicie.
