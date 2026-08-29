# ProjectNorth — historia decyzji produktu

> Krótka historia wyjaśniająca, dlaczego North ma obecną formę. Bieżący stan operacyjny znajduje się w `NORTH_STATE.md`; szczegółowe zmiany w `CHANGELOG.md`.

## Od katalogu promocji do problemu decyzyjnego

Pierwsze iteracje North porządkowały promocje i eksperymentowały z North Score. Ten kierunek pokazał interfejs analityczny, ale nie rozwiązywał głównego problemu: najwyższa reklamowana premia nie jest automatycznie najlepszą decyzją dla konkretnej osoby.

Research Sprint #1 i Product Direction Review #1 zamknęły pozycjonowanie North jako „lepszego rankingu”. Przyjęto model **explainable decision system** oraz pytanie „Czy ta oferta ma sens dla mnie?”. Score został zdegradowany do historycznego, wtórnego skrótu; rdzeń zaczęły tworzyć wartość scenariuszowa, koszty, wysiłek, ryzyko, alternatywy, Confidence i Evidence.

## Decision Model v1 i core cases

Decision Model v1 powstał na trzech celowo różnych przypadkach:

- Millennium — premia z krótkim sprintem i długim, all-or-nothing obowiązkiem;
- Nest — maksimum zależne od 24 miesięcy wydatków i osobnego komponentu walutowego;
- Pekao — cash oraz warunkowa wartość podróżna, której nie wolno przedstawiać jako jednej puli gotówki.

Model rozdzielił North Value, North Confidence, North Match i North Verdict. `Do Nothing` stało się obowiązkową alternatywą; `WAIT`, Match %, arbitralny EV i Score 0–100 zostały wyłączone jako główne wyniki bez danych uzasadniających taką precyzję.

## Evidence Review #1 i warstwa trust

Evidence Review #1 zbudował fundament Evidence & Trust dla core Decision Model. Oficjalne regulaminy, strony produktów i tabele opłat zostały powiązane z konkretnymi polami i datami. North nauczył się zachowywać konflikty źródeł i zwracać `NOT ENOUGH DATA` zamiast wymuszać pozytywny wynik.

Następnie powstały publiczna metodologia, ręczny freshness model oraz widoczny evidence ledger. Afiliacja została oddzielona od oceny produktu.

## Kraken jako kontrolowany hard case

Kraken został dodany jako pojedynczy, nieafiliacyjny stress test Decision Model. Dynamiczne koszty, ryzyko rynkowe, nieznany próg oraz konflikt oficjalnych terminów potwierdziły, że model potrafi uczciwie zatrzymać decyzję na `LOW` Confidence i `NOT ENOUGH DATA`.

Kraken nie otworzył kategorii krypto. Pozostał technicznym rekordem `crypto_validation`, poza katalogiem i bez publicznego CTA.

## Explainable Match, jakość UX i prosty język

Explainable North Match dodał jakościowe statusy `FIT`, `CONDITIONAL FIT`, `POOR FIT` i `CANNOT ASSESS` oraz wykonywalne scenariusze. Glossary, dostępność klawiatury, mobile QA, search/filter/empty/reset i późniejszy plain-language pass uczyniły model zrozumiałym bez znajomości jego wewnętrznych terminów.

North UX Test #1 został zakończony jako runda walidacji. Nie jest już bieżącym „next step”.

## Data Integrity & Freshness Guard

Techniczny guard wprowadził kontrolę struktur, ID, referencji, kontraktów wartości, Confidence/Verdict, landing gates i freshness. Jest warstwą jakości implementacji i release gate'em, ale **nie jest Evidence Review #2** ani innym Evidence Review.

## Evidence Reviews #2–#4 i decyzja o kontrolowanym katalogu

- **Evidence Review #2 — Catalog Expansion Batch 1, 23.08.2026:** Millennium 360°, Nest Konto, Pekao Konto Przekorzystne, Alior Konto 18–25, Erste Konto Smart i VeloKonto.
- **Evidence Review #3 — Catalog Expansion Batch 2 + Affiliate Bonus Research:** Revolut Standard, zmiana tożsamości Santander → Erste, mBank eKonto do usług, PKO Konto za Zero, BNP Konto Otwarte na Ciebie oraz wybrane mechaniki afiliacyjne.
- **Evidence Review #4 — Small Batch 3:** UniCredit Konto Osobiste, VeloBank Elastyczne Konto Oszczędnościowe i Alior Konto Plus.

Review #4 zakończył szeroki catalog discovery. Decyzją nie było importowanie wszystkich znalezionych ofert, lecz wdrożenie pierwszego małego, kontrolowanego katalogu z rozdzieleniem gotówki, cashbacku, voucherów, nagród rzeczowych, odsetek i wartości funkcjonalnej.

## Affiliate discovery i separacja ekonomii

Affiliate Source Research #1 i Full Affiliate Offer Discovery #1 objęły 636 kampanii w Money2Money, ComperiaLead i LeadStar, 285 rekordów w zakresie North i 165 roboczych ofert/wariantów po deduplikacji.

Wynik nie stworzył roadmapy 165 ofert. Przeciwnie: potwierdził, że pokrycie sieci, stawka i bonus wydawcy muszą pozostać osobną warstwą operacyjną. `Affiliate Source Layer != Product Decision Layer`.

## Pierwszy publiczny katalog 12 ofert

Commit `24c2d7c5450b44ae07e12267f592b5898849bb54` (`feat: release 12-offer catalog`) opublikował pierwszy katalog 12 analiz. Kraken pozostał trzynastym rekordem technicznym, nie kartą katalogową.

Release przeszedł Data Guard `0 FAIL / 6 WARN / 17 OK`, guard tests 16/16, Match matrix 50/50, JS syntax 9/9, lokalne trasy 12/12, produkcyjne URL-e 28/28, browser smoke i keyboard smoke. Sześć warningów stało się operacyjnym recheckiem na 31.08.2026, nie błędem wydania.

## Od modelu decyzji do wspólnego doświadczenia użytkownika

v0.8.0 Alternative Comparison potwierdziło na rodzinie mBank, że Product Identity i sytuacja użytkownika muszą wyprzedzać reklamowane maksimum oraz wybór źródła afiliacyjnego. Architektura i bounded prototype zostały zaakceptowane jako lokalny checkpoint, bez publicznej integracji.

Od 28.08.2026 priorytet przeszedł na Product UX i content hierarchy. North Offer Experience v1/v1.1 ustanowił opcjonalny Core Profile wypełniany raz, lokalnie przechowywany i ponownie używany w katalogu oraz na detail page. Category Shell & Header v1 dodały aktywne `Konta` i nieinteraktywne kierunki przyszłych kategorii. Offer Identity & Visual Assets Pass potwierdził, że provider logos i North visual fallback wystarczają bez stockowych wizualizacji produktu.

Homepage Simplification v1 domknął lokalny flow: Header → Hero → Category Discovery → trzy realne oferty → Jak działa North → Trust/Sources → Final CTA. Po Founder Review i micro-fixie otrzymał functional/product/visual PASS i został zapisany jako lokalny checkpoint `b3593e2`, bez pushu, deployu i publicznej integracji. Wcześniejszy lokalny checkpoint `f2747b7` zachowuje Offer Experience. Produkcja nadal pokazuje wcześniejszy UX i katalog 12 ofert.

## Dlaczego North jest dziś taki, jaki jest

North jest kontrolowanym systemem decyzji, ponieważ kolejne rundy pokazały trzy stałe ryzyka: marketingowe maksimum może fałszować użyteczność, brak evidence może fałszować pewność, a ekonomia afiliacyjna może fałszować rekomendację. Obecna architektura jawnie rozdziela te warstwy.

Następny etap nie jest automatycznie Sprintem 4, afiliacją, community ani kolejnym rozszerzeniem katalogu. Lokalny flow Sprintów 1–3 jest zaakceptowany; następny bounded krok wymaga osobnej decyzji Founder/Product. Public integration wymaga osobnej decyzji, aktualnego evidence i pełnych release gates.
