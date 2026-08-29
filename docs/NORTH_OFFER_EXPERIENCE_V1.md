# North Offer Experience v1.1 + Category Shell & Header v1 + Offer Identity & Visual Assets Pass v1 — bounded frontend prototype

> Status: lokalny bounded prototype po Founder Review · Future Categories Micro-Fix zwalidowany · nie jest funkcją publiczną

## Cel

Prototyp sprawdza, czy jeden krótki Core Profile może dodawać użyteczny kontekst do całego katalogu i podstron ofert bez blokowania dostępu użytkownikowi, który profilu nie wypełnił. Zakres jest eksperymentem UX/product w aktywnym kierunku v0.8.0, nie implementacją afiliacyjną ani decyzją o integracji publicznej.

## Granice

- Osobne trasy `noindex`: `frontend/prototypes/north-offer-experience.html` i `frontend/prototypes/north-offer-detail.html`.
- Brak linku z homepage, zmian w sitemap i zmian w publicznych trasach 12 ofert.
- Brak backendu, konta, logowania, API, analityki, afiliacyjnego CTA i trackingu.
- Fakty trzech ofert są pobierane z `frontend/data/decision-offers.json`; prototyp nie kopiuje faktów finansowych do HTML i nie zmienia wspólnego źródła danych.
- Profil nie wpływa na kolejność ofert, Confidence produktu, Evidence ani fakty oferty. Dodaje wyłącznie jakościowy kontekst.
- Brak Match %, Score 0–100, arbitralnego EV i uniwersalnego zwycięzcy.

## Core Profile v1

Profil zawiera sześć informacji:

1. przedział wieku;
2. konto indywidualne lub wspólne;
3. miesięczne wpływy możliwe do naturalnego skierowania na konto;
4. zwykłe miesięczne wydatki kartą;
5. główny cel;
6. akceptowany poziom powtarzalnego wysiłku.

Kapitał możliwy do przeniesienia jest świadomie pominięty. W bounded case Millennium, Nest i Pekao nie jest wspólnym istotnym hard gate'em, więc pytanie zbierałoby dane bez realnego wpływu na kilka ofert. Kontrakt jest wersjonowany i może dodać pole w późniejszej kategorii, gdy rzeczywiście zmieni ono kilka decyzji.

Historia relacji z każdym bankiem także nie trafia do Core Profile. Jest provider-specific hard gate'em, dlatego UI pokazuje ją jako informację do potwierdzenia na poziomie konkretnej oferty. Profil ma pozostać krótki i użyteczny w całym katalogu, a nie zamienić się w trzy osobne formularze kwalifikacyjne.

## Persistence i prywatność

- Klucz: `north.offerExperience.profile.v1`.
- Storage: wyłącznie `localStorage` bieżącej przeglądarki.
- Użytkownik może zmienić odpowiedzi albo wyczyścić profil z katalogu i detail page.
- Bez profilu katalog, karty i strona szczegółów pozostają w pełni dostępne.
- Prototyp nie wysyła profilu do sieci i nie ma analityki.
- Microcopy w Core Profile: „Twoje odpowiedzi zostają tylko w tej przeglądarce. Możesz je zmienić lub wyczyścić w każdej chwili.”

## Warstwa kontekstu

Generyczny interpreter używa pól modelu kategorii, nie nazw banków w logice decyzji. Ocenia:

- twardy zakres wieku;
- próg wpływów, także zależny od wieku;
- największy jawny próg wydatków kartą;
- długość powtarzalnych warunków wobec tolerancji wysiłku;
- zgodność celu z formą lub charakterem korzyści;
- nierozstrzygnięty ownership mode oraz status nowego klienta.

Stany pierwszej warstwy po Polish Pass:

- `Wstępnie pasuje`;
- `Wstępnie pasuje, ale…`;
- `Raczej nie dla Ciebie`;
- `Potrzebujemy jeszcze jednej informacji`.

Stan opisuje sytuację, nie potwierdza pełnej kwalifikacji do promocji. Każdy wynik pokazuje przynajmniej jeden powód, blokadę lub nierozstrzygnięty hard gate. Jeżeli pozostaje nierozstrzygnięty status nowego klienta, karencja, ownership mode albo inny twardy warunek, interpreter nie może zwrócić bezwarunkowego `Wstępnie pasuje`.

## Offer Card v1.1

Karta pokazuje provider i Product Identity, główną wartość, maksymalnie trzy kluczowe warunki, jeden największy failure point, opcjonalny personal context w maksymalnie dwóch liniach i wewnętrzne CTA `Zobacz szczegóły`. Polish Pass usunął opisowy akapit wartości z karty, skrócił rytm warunków do generycznej informacji o maksymalnej liczbie miesięcy, nadał priorytet statusowi nowego klienta oraz usunął sztuczne minimalne wysokości sekcji. Pełne brzmienie warunków pozostaje na detail page.

## Detail Page v1.1

Above the fold pokazuje wartość, najważniejsze działania, największy haczyk, opcjonalny personal context i wewnętrzne CTA do kroków. Niżej są kroki, oś czasu, kwalifikacja, failure points, koszty, warianty, alternatywy, `Do Nothing`, źródła, daty weryfikacji oraz zwinięta metodologia. Polish Pass zachował wszystkie te sekcje, zmniejszył nagłówki i odstępy wewnątrz secondary content oraz przetłumaczył widoczne techniczne etykiety bez chowania ryzyk, kosztów, haczyka lub podstawowych warunków.

Renderer działa dla trzech rekordów bounded case przez parametr `id`; Millennium jest domyślnym wzorcem wejścia. Struktura bazuje na generycznych polach `identity`, `value`, `eligibility`, `execution`, `cost`, `evidence`, `linkedPromotions` i `promotionVariants`, więc nie jest związana wyłącznie z kategorią bankową. Nowa kategoria będzie wymagała adaptera prezentacyjnego, ale nie nowego systemu profilu na każdej ofercie.

## Offer Identity & Visual Assets Pass v1

Pass wzmacnia tożsamość konkretnego produktu bez zmiany Decision Model, faktów ofertowych ani publicznego frontendu. Karty i detail page używają istniejących w repo assetów `Bank_Millenium.svg`, `nest1.svg` i `Bank_Pekao_SA_Logo_(2017).svg`. Zawartość tych chronionych plików nie została zmieniona; renderer odwołuje się do nich wyłącznie jako do assetów.

Mały adapter prezentacyjny przypisuje do Product Identity:

- logo providera;
- `visual.type`, `visual.src` i `visual.alt`;
- `visual.focalPosition`;
- subtelny `visual.providerAccent`;
- wariant North treatment.

Renderer obsługuje przyszły obraz przez `src` i `alt`, ale w bieżącym bounded case nie znaleziono ani nie dodano bezpiecznego, potrzebnego zdjęcia. Wszystkie trzy oferty używają North-owned fallbacku zbudowanego w CSS: spokojnego panelu, geometrycznej kompozycji, logo i małego provider accent. Zieleń North pozostaje kolorem CTA i systemu; akcent providera nie wpływa na Match, risk semantics, Confidence ani Verdict.

Detail hero pokazuje duży provider lockup, wyraźny Product Identity, krótkie podsumowanie, CTA do kroków, kompaktowy visual slot oraz niezmieniony kontrakt `Co dostajesz? / Co musisz zrobić? / Największy haczyk`. Na desktop wszystkie trzy bloki nadal mieszczą się w pierwszym ekranie 1440×900. Na mobile dekoracyjny slot jest ukryty, a warstwa identity pozostaje w dużym logo, nazwie providera i akcencie; dzięki temu blok wartości nie jest wypychany przez ozdobę.

Karty zachowują zaakceptowaną konstrukcję i wysokość. Zmiana ogranicza się do kontenera logo, nazwy providera/Product Identity i małego akcentu. Pekao korzysta ze strukturalnego splitu istniejących pól `cashValueTotal` i `nonCashValueTotal`: `300 zł gotówki + do 2 400 zł warunkowej wartości podróżnej`. Karta nie pokazuje sumy 2 700 zł; detail dopuszcza ją tylko z tekstem, że nie jest jedną premią gotówkową, oraz z istniejącym w danych ostrzeżeniem o podwójnej warunkowości części podróżnej.

## Header v1 i architektura kategorii

Sprint 2 dodaje wspólny nagłówek platformowy do katalogu i detail page bez włączania go do publicznej strony. Desktop zachowuje trzy stałe obszary: logo North, nawigację kategorii i akcję profilu. Mobile pokazuje logo, skróconą akcję profilu oraz przycisk menu.

Kontrakt kategorii jest mały i jawny:

- `Konta` jest jedyną aktywną kategorią i prowadzi do Category Shell;
- `Oszczędzanie`, `Inwestowanie`, `Fintech` i `Krypto` są przygaszonymi, nieinteraktywnymi etykietami przyszłej architektury; na desktopie wspólny, drugorzędny komunikat `Kolejne kategorie w przygotowaniu` wyjaśnia ich stan bez powtarzania statusu pod każdą nazwą;
- przyszłe kategorie są tekstowymi stanami, nie martwymi linkami ani pustymi katalogami;
- aktywna kategoria ma `aria-current="page"` i widoczny stan bez polegania wyłącznie na kolorze.

Mobilne menu jest natywnym dialogiem. Po otwarciu fokus przechodzi na aktywne `Konta`; `Escape`, kliknięcie tła i przycisk zamknięcia zamykają menu oraz zwracają fokus do triggera. Header korzysta z istniejącego klucza `north.offerExperience.profile.v1`: bez profilu pokazuje `Dopasuj oferty`, a po zapisie `Twoje dopasowanie` z widocznym znacznikiem stanu. `Profil` nie jest używany w globalnej nawigacji i pozostaje nazwą wewnętrzną Core Profile.

## Category Shell v1

Shell `Konta` porządkuje doświadczenie między globalną nawigacją i katalogiem. Pokazuje nazwę i opis kategorii, jawny status `Aktywna kategoria`, widok `Wszystkie konta` oraz akcję profilu `Dopasowane do mnie` / `Edytuj dopasowanie`. Nie zmienia danych, kolejności ofert ani logiki dopasowania; ponownie wykorzystuje Core Profile i istniejący katalog trzech ofert.

## Synchronizacja

- Changelog: not required — prototyp nie jest release'em ani funkcją publiczną.
- ADR: not required — bounded persistence i micro-fix nie zmieniają trwałego kontraktu produktu ani architektury publicznej.
- `NORTH_STATE.md` / `ROADMAP.md`: not required — aktywny etap v0.8.0 i produkcja pozostają bez zmian.
- Notion mirror: not required — bounded micro-fix nie zmienia roadmapy, decyzji ani stanu publicznego.
- Commit: dozwolony wyłącznie jako lokalny UX checkpoint z jawnej allowlisty; push i deploy pozostają wyłączone.

## Walidacja v1.1 i Sprint 2

Stan testu: 2026-08-28.

- Profile logic: unresolved status nowego klienta wymusza `Wstępnie pasuje, ale…`, konto wspólne wymusza `Potrzebujemy jeszcze jednej informacji`, a round-trip write/read/clear storage przechodzi PASS.
- Profile UX: zapis, odświeżenie, przejście katalog → detail, prefilled `Zmień odpowiedzi`, ponowny zapis, `Wyczyść profil` i neutralny stan po odświeżeniu PASS.
- Bez profilu: 3/3 karty i pełny detail pozostają dostępne; brak personal context PASS.
- Desktop 1440×900: katalog i detail PASS; karty z profilem mają 685–735 px wysokości, maksymalnie 3 warunki i dwuliniowy personal context; 0 px horizontal overflow i 1 `h1`.
- Mobile 390×844: katalog, dialog i detail PASS; karty bez profilu mają 529–557 px, układ jest jednokolumnowy, a poziomy overflow wynosi 0 px.
- Dialog profilu: wszystkie trzy kroki mieszczą się w szerokości 390 px z 0 px horizontal overflow; na każdym kroku widoczne są tylko właściwe akcje; `Escape` zamyka dialog i zwraca fokus do triggera PASS.
- Detail page: 3 bloki above the fold, 8 kroków Millennium, 8 sekcji szczegółowych, 4 źródła, wewnętrzne CTA do `#steps` i domyślnie zwinięta metodologia PASS.
- JavaScript syntax: 8/8 plików frontendu PASS.
- HTML routes: 18/18 lokalnych tras HTTP 200, w tym wszystkie istniejące strony ofert, metodologia, homepage, prototyp mBank i dwie nowe trasy.
- Prototype assets: JSON, moduł, CSS, logo North i trzy logo ofert — 7/7 HTTP 200.
- Public catalog regression: 12 kart, działające wyszukiwanie, 0 linków do nowego prototypu, 0 px overflow i czysta konsola PASS.
- Existing Match matrix: 50/50 PASS.
- Existing mBank Alternative Comparison: 4/4 acceptance plus policy/regression guards PASS.
- Data Guard na `2026-08-28`: `0 FAIL / 9 WARN / 14 OK` — `PASS WITH WARNINGS`. Warningi są istniejącymi recheck reminders (w tym Nest i Pekao do 31.08.2026), nie skutkiem prototypu.
- Data Guard tests: 16/16 PASS.
- Header desktop 1440×900: pięć kategorii mieści się bez przepełnienia; `Konta` ma stan aktywny, cztery przyszłe kategorie nie są linkami, a akcja profilu przechodzi `Dopasuj oferty` → `Twoje dopasowanie` PASS.
- Category Shell: aktywna kategoria, dwa widoki, neutralny stan bez profilu i zapisany Core Profile renderują się bez zmiany kolejności 3/3 ofert PASS.
- Header mobile 390×844: desktopowa nawigacja jest ukryta, logo, akcja profilu i menu mieszczą się z 0 px horizontal overflow PASS.
- Menu mobile: 1 aktywny link i 4 nieinteraktywne przyszłe etykiety bez powtarzanego statusu; fokus po otwarciu trafia na `Konta`, `Escape` zamyka dialog, `aria-expanded` wraca do `false`, a fokus wraca do triggera PASS.
- Detail integration: wspólny header, ścieżka `Konta / Product Identity` i zapisany Core Profile działają na detail page przy desktop i mobile PASS.
- Screenshot set: desktop profile off/on, Category Shell, mobile menu closed/open zapisany w `C:\dev\projectnorth-ux-test-materials\founder-review\category-shell-header-v1`.

### Walidacja Offer Identity & Visual Assets Pass v1

Stan testu: 2026-08-29.

- Desktop 1440×900: Millennium, Nest i Pekao detail pokazują właściwe logo, provider, Product Identity, fallback North, value/actions/catch i 0 px overflow; catch kończy się odpowiednio przy 846 px, 846 px i 870 px wysokości viewportu PASS.
- Karty: 3/3 właściwe assety, 0 px overflow; wysokości bez profilu 554/575/549 px, a na mobile 555/556/559 px; Pekao po splitcie nie zwiększył wysokości względem wcześniejszej karty PASS.
- Mobile 390×844: logo Millennium jest czytelne, dekoracyjny visual slot nie wypycha faktów, blok wartości mieści się do 813 px, hero/header/detail mają 0 px overflow PASS.
- Core Profile: zapis, reload, katalog → detail, prefilled edit i clear/reload PASS; header przechodzi `Dopasuj oferty` → `Twoje dopasowanie` → `Dopasuj oferty` PASS.
- Dialog profilu mobile: 0 px overflow na wszystkich trzech krokach; po zapisie 3/3 karty pokazują personal context PASS.
- Menu mobile: aktywny link `Konta`, 4 nieinteraktywne przyszłe etykiety, fokus, `Escape`, `aria-expanded` i focus return PASS.
- CTA detail → `#steps`: PASS; Millennium ma 8 kroków.
- JavaScript syntax: 8/8 PASS. HTML routes: 18/18 HTTP 200. Prototype assets: 7/7 HTTP 200.
- Existing Match matrix: 50/50 PASS. Data Guard tests: 16/16 PASS. mBank acceptance: 4/4 PASS plus policy/regression guards.
- Data Guard na `2026-08-29`: `0 FAIL / 10 WARN / 13 OK` — `PASS WITH WARNINGS`; warningi są terminami rechecku istniejącego evidence, nie skutkiem visual pass.
- Public regression: homepage, 12 kart, wyszukiwanie, sitemap i brak linków do prototypu pozostają bez zmian; czysta konsola i 0 px overflow PASS.
- Screenshot set: `C:\dev\projectnorth-ux-test-materials\founder-review\offer-identity-visual-assets-pass-v1`.

### Future Categories Micro-Fix i local UX checkpoint

Stan testu: 2026-08-29.

- Desktop 1440×900: `Konta` pozostaje aktywnym linkiem z `aria-current="page"`; `Oszczędzanie`, `Inwestowanie`, `Fintech` i `Krypto` pozostają nieinteraktywnymi elementami `span` bez `href`; jeden wspólny komunikat `Kolejne kategorie w przygotowaniu` jest czytelny, drugorzędny i nie tworzy dużego bloku coming soon; 0 px horizontal overflow PASS.
- Mobile 390×844: desktopowy status jest ukryty razem z desktopową nawigacją; istniejący dialog zachowuje jawne wyjaśnienie przyszłej architektury, cztery elementy pozostają nieinteraktywne, fokus po otwarciu znajduje się w dialogu, `Escape` zamyka menu, resetuje `aria-expanded` i zwraca fokus do triggera; 0 px horizontal overflow PASS.
- Core Profile: zapis profilu, przejście `Dopasuj oferty` → `Twoje dopasowanie`, reload persistence i 3/3 personal context na kartach PASS.
- Catalog → detail, Millennium/Nest/Pekao i CTA Millennium → `#steps`: PASS; wszystkie trzy detail pages używają właściwych lokalnych logo i zachowują zapisany Core Profile.
- JavaScript syntax: 8/8 PASS. HTML routes: 18/18 HTTP 200. Prototype assets: 7/7 HTTP 200.
- Existing Match matrix: 50/50 PASS. Data Guard tests: 16/16 PASS. mBank acceptance: 4/4 PASS plus policy/regression guards.
- Data Guard na `2026-08-29`: `0 FAIL / 10 WARN / 13 OK` — `PASS WITH WARNINGS`; warningi są terminami rechecku istniejącego evidence, nie skutkiem micro-fixu.
- Public regression: homepage i sitemap niezmienione, katalog nadal ma 12 ofert, wyszukiwanie Millennium pokazuje jedną kartę, `decision-offers.json` jest niezmieniony, brak linków do prototypu, czysta konsola i 0 px overflow PASS.
- Reproducibility: prototype używa `Bank_Millenium.svg`, `nest1.svg` i `Bank_Pekao_SA_Logo_(2017).svg`; ich SHA-256 są zgodne z wcześniej zatwierdzonymi wartościami checkpointu.

Prototyp v1.1 wraz z Header v1, Category Shell v1, Offer Identity & Visual Assets Pass v1 i Future Categories Micro-Fix przeszedł Founder Review oraz lokalną walidację checkpointu, ale nie jest zatwierdzony do publikacji. Recheck Nest i Pekao pozostaje osobną operacją freshness przed jakąkolwiek późniejszą decyzją o publicznej integracji.
