# Dziennik zmian

Format oparty na Keep a Changelog. Wersje przed publicznym wydaniem mogą zmieniać zakres bez zachowania kompatybilności.

## [Unreleased]

### Changed

- Landing prowadzi teraz od hero bezpośrednio do aktywnych analiz, następnie krótko wyjaśnia działanie North i dopiero później pokazuje rozbudowane przykłady oraz metodologię.
- Hero komunikuje „Warunki sprawdzone w oficjalnych źródłach” zamiast niejasnego „Dane ręcznie zweryfikowane”.
- Confidence zaczyna się od prostego opisu dla użytkownika; techniczny band pozostaje drugą warstwą, a `MEDIUM` i `LOW` pokazują konkretny powód zapisany w evidence.

### Fixed

- Popovery Glossary są renderowane w globalnej warstwie i ograniczane do viewportu, więc karty oraz moduły z ukrytym overflow nie ucinają ich przy krawędziach.

### Verified

- Landing, metodologia, Millennium, Nest, Pekao, Kraken i Revolut przeszły lokalny smoke w 1440×900, 820×900 i 390×844 bez poziomego overflow, duplikatów ID, zerwanych relacji ARIA, brakujących obrazów i błędów konsoli.
- Wyszukiwanie, filtr Cashback, pusty stan oraz reset działają; Glossary obsługuje click/tap, Enter, Space i Escape z powrotem fokusu, a panel mieści się w viewportach przy skrajnych krawędziach.
- Regresja Match zachowała: Millennium `FIT` / `TAKE IF` / 700 zł / koszt 0; Nest `CONDITIONAL FIT` / `TAKE IF` / 1 250 zł brutto / 1 200–1 250 zł użyteczne; Pekao start-only `FIT` / `TAKE IF` / 300 zł / koszt 0; Pekao full travel `FIT` / `TAKE IF` / 1 740 zł / koszt 0.
- Brak danych nadal daje `CANNOT ASSESS` / `NOT ENOUGH DATA`, a potwierdzone wykluczenie `POOR FIT` / `SKIP`. Wszystkie śledzone pliki frontendu zwracają lokalnie HTTP 200.

## [0.7.2] — 2026-08-17

### Added

- `NORTH_WRITING_GUIDE.md` z trwałym standardem prostego, precyzyjnego copy oraz `AI_WORKFLOW.md` ze stałymi regułami kolejnych tasków Work.
- Krótkie podsumowanie wyniku Match: sens oferty, realna kwota, główny warunek i największe ryzyko; stan brakujących danych mówi, co uzupełnić.

### Changed

- Landing, metodologia i wspólny renderer ofert pokazują proste polskie etykiety przed technicznymi nazwami Decision Model.
- Pytania Millennium, Nest i Pekao opisują sytuację użytkownika; pomoc wyjaśnia, że bank zalicza tylko określone wpływy i płatności.
- Match, Verdict, Confidence i Evidence mają prostą pierwszą warstwę oraz zachowują techniczne stany jako informację wtórną.
- Globalne reguły nagłówków używają normalnego łamania słów, dzięki czemu długie nazwy ofert przechodzą do nowej linii bez przypadkowego rozcinania.
- Kraken otrzymał ograniczony plain-language pass bez zmiany statusu walidacji; Revolut pozostał stroną legacy.

### Verified

- Decision Model zachował wartości i stany pełnych scenariuszy: Millennium `FIT` / `TAKE IF` / 700 zł, Nest `CONDITIONAL FIT` / `TAKE IF` / 1 250 zł oraz Pekao `FIT` / `TAKE IF` / 300 zł bez części podróżnej.
- Brak danych nadal daje `CANNOT ASSESS` / `NOT ENOUGH DATA`, a potwierdzone wykluczenie `POOR FIT` / `SKIP` dla każdej z trzech ofert.
- Landing, metodologia, Millennium, Nest, Pekao, Kraken i Revolut przeszły testy 1440×900, 820×900 i 390×844 bez poziomego overflow, duplikatów ID, brakujących obrazów i zerwanych relacji ARIA.
- Wyszukiwanie, filtry, pusty stan, reset, fokus wyniku oraz Glossary przez click/tap, Enter, Space i Escape z powrotem fokusu działają.
- Pekao i pozostałe długie tytuły zachowują pełne słowa na mobile; błędy i ostrzeżenia konsoli oraz żądania zasobów są czyste.
- Push commita `e7a2efe` do `main` automatycznie uruchomił produkcyjny deployment Vercel w stanie `READY`; fallback nie był potrzebny. Publiczny smoke potwierdził canonical, sitemap, robots, Match 700 zł dla Millennium i brak błędów runtime.

### Known limitations

- Prosty język nie zastępuje regulaminu. Szczególne definicje wpływów, płatności i wydatków pozostają w warunkach i źródłach.
- Manualny fallback dokładnego snapshotu `frontend/` pozostaje udokumentowaną ścieżką awaryjną, ale v0.7.2 wdrożyło się automatycznie z GitHub `main`.

## [Deployment & Infrastructure #1] — 2026-08-16

### Added

- Pierwszy publiczny deployment statycznego frontendu na Vercel pod `https://project-north-mu.vercel.app/`, publikujący wyłącznie katalog `frontend/` z gałęzi `main`.
- Samoodwołujące canonical URL-e, podstawowe Open Graph i Twitter Summary Card dla indeksowalnych stron oraz produkcyjne `sitemap.xml` i `robots.txt`.
- Minimalna konfiguracja Vercel z nagłówkami bezpieczeństwa i krótkim cache przeglądarki dla zasobów marki.

### Changed

- README, roadmapa, handbook, backlog jakości i rejestr decyzji odzwierciedlają publiczny origin oraz zakończenie Deployment & Infrastructure #1.
- Kraken pozostaje indeksowalnym validation case'em dostępnym z metodologii; Revolut zachowuje `noindex, follow` i nie występuje w sitemap.

### Verified

- Landing, metodologia, Millennium, Nest, Pekao, Kraken i Revolut przeszły produkcyjny smoke test w 1440×900 i 390×844 bez błędów konsoli, mixed content, brakujących obrazów, duplikatów ID i poziomego overflow.
- Produkcyjne wyszukiwanie, filtr Cashback, pusty stan i reset działają; glossary otwiera się kliknięciem/tapem i klawiaturą oraz zamyka Escape z powrotem fokusu.
- North Match na produkcji zwrócił dla pełnych scenariuszy: Millennium `FIT` / `TAKE IF` / 700 zł, Nest `CONDITIONAL FIT` / `TAKE IF` / 1 250 zł oraz Pekao `FIT` / `TAKE IF` / 1 740 zł.
- Wszystkie linki evidence otwierane w nowej karcie mają `noopener`; Revolut zachowuje nieinteraktywny stan niedostępnego CTA.
- Lokalny artefakt produkcyjny zwraca `200` dla wszystkich stron, skryptów, danych, stylów, faviconów i logotypów; canonical, OG, Twitter Card, sitemap, robots i konfiguracja Vercel przechodzą walidację składni i spójności origin.

### Known limitations

- Automatyczny webhook GitHub–Vercel nie uruchomił redeployu po pushu commita `8fc5130`. Produkcję opublikowano awaryjnie jako zweryfikowany snapshot dokładnie 44 śledzonych plików `frontend/` z tego commita; przed kolejnym wydaniem trzeba naprawić i ponownie potwierdzić automatyczny trigger z `main`.
- Brak dedykowanej grafiki social, dlatego metadata świadomie nie zawierają `og:image` ani `twitter:image`.
- Structured data, analytics, backend, konta użytkowników i private beta pozostają poza tym wdrożeniem.

## [0.7.1] — 2026-08-16

### Added

- Działające wyszukiwanie i filtry ofert na landingu, z licznikiem wyników, czytelnym pustym stanem oraz resetem przywracającym fokus do wyszukiwarki.
- Zweryfikowane, znormalizowane logotypy Banku Millennium, Nest Banku i Banku Pekao z dekoracyjnym tekstem alternatywnym oraz odpornym fallbackiem do monogramu.
- Unikalne tytuły i opisy meta dla landingu, metodologii oraz stron Millennium, Nest, Pekao i Kraken.

### Changed

- Popovery North Glossary mają unikalne identyfikatory, właściwe relacje ARIA i przewidywalną obsługę focus, hover, tap, Enter, Space, Escape oraz kliknięcia poza panelem.
- North Match używa prostszego copy, czyści nieaktualne błędy po uzupełnieniu pola, przenosi fokus do wyniku i jawnie komunikuje lokalne przetwarzanie odpowiedzi.
- Wspólny renderer stron ofert toleruje brak opcjonalnych akcji, kosztów, dowodów, źródeł, powodów Confidence, safe exit, logotypu i afiliacji bez pustych lub uszkodzonych sekcji.
- Wzmocniono kontrast drugorzędnego tekstu i granic kontrolek, widoczność focus, minimalne cele dotykowe, zawijanie długich treści oraz zachowanie przy `prefers-reduced-motion`.
- Revolut jest jednoznacznie oznaczony jako archiwalny prototyp i otrzymał `noindex, follow`; nie zawiera aktywnego CTA ani pozornej bieżącej rekomendacji.

### Verified

- Landing, metodologia, Millennium, Nest, Pekao, Kraken i Revolut przeszły audyt w 1440×900, 820×900 i 390×844 bez poziomego overflow, duplikatów ID, brakujących obrazów, zerwanych relacji ARIA oraz błędów lub ostrzeżeń konsoli.
- Potwierdzono dokładnie jeden `h1`, landmarki, skip linki, etykiety formularzy, stany focus, obsługę klawiatury i dotyku oraz odnośniki kotwicowe na każdej stronie.
- Pełne i niepełne scenariusze North Match sprawdzono dla Millennium, Nest i Pekao; wynik otrzymuje fokus, brak danych pozostaje odrębny od negatywnego scenariusza, a reset przywraca formularz.
- Składnia JavaScript i dane JSON przechodzą walidację, a użyte kolory tekstu i kontrolek spełniają założone progi kontrastu WCAG AA.

### Known limitations

- Repozytorium nie definiuje produkcyjnego origin ani publicznej grafiki social. Canonical, Open Graph, Twitter Cards i sitemap należy dodać dopiero po ustaleniu rzeczywistych absolutnych adresów.
- Nie dodano danych strukturalnych: North nie jest sprzedawcą analizowanych produktów, a obecne strony nie uzasadniają typu rich result bez ryzyka mylącego `Product`, `Offer`, `Review` lub `FAQPage`.
- Kraken pozostaje publicznym validation case poza katalogiem. Przed wdrożeniem produkcyjnym trzeba potwierdzić, czy powinien pozostać indeksowalny; Revolut ma pozostać wyłączony z indeksu albo zostać usunięty z publikowanego artefaktu.
- Cała karta oferty nie jest jednym linkiem, ponieważ zawiera interaktywne przyciski glossary. Rozszerzenie obszaru kliknięcia wymaga wzorca bez zagnieżdżania kontrolek.

## [0.7.0] — 2026-08-16

### Added

- Explainable North Match na stronach Millennium, Nest i Pekao: dwuetapowy formularz lokalnego scenariusza, bandy `FIT`, `CONDITIONAL FIT`, `POOR FIT` i `CANNOT ASSESS` oraz osobny Verdict.
- Wspólny klientowy scenario engine interpretujący reguły zapisane przy ofertach w `decision-offers.json`, bez backendu, konta i profilu w chmurze.
- Wyjaśnienie wyniku z reasons, blockers, conditions, brakującymi danymi oraz listą odpowiedzi, które wpłynęły na wynik.
- Centralny North Glossary dla dwunastu terminów Decision Model i dostępne popovery obsługujące hover, tap, focus, Enter, Space, Escape oraz kliknięcie poza panelem.

### Changed

- Millennium dynamicznie rozdziela Premię I i all-or-nothing Premię II, uwzględnia próg wpływu zależny od wieku, karencję, pięciomiesięczny rytm i konflikt dla dokładnie 26 lat.
- Nest liczy 2% kwalifikowanych wydatków z miesięcznym capem 50 zł przez wybrany horyzont; brak kwalifikowanego wpływu zeruje cashback, a premia EUR pozostaje osobnym, warunkowym składnikiem.
- Pekao oddziela 300 zł części startowej od części podróżnej. Wirtualne saldo nie wchodzi do `Your Likely Value` bez jawnych danych o płatnościach i kwalifikowanych wydatkach podróżnych.
- Landing prowadzi z kart ofert bezpośrednio do „Sprawdź dla siebie”, a metodologia wyjaśnia różnicę między Match i Verdict.
- Legacy Revolut nie renderuje już pustego linku `href="#"`; niedostępne CTA jest jawnym, nieinteraktywnym stanem.

### Verified

- Scenariusze Millennium: pełne dopasowanie 700 zł, dyskwalifikacja i brak danych.
- Scenariusze Nest: 500 zł i 2 500 zł miesięcznych wydatków, brak wymaganego wpływu oraz pełny wariant z EUR.
- Scenariusze Pekao: tylko 300 zł, wyłączenie podróży, pełne dane podróżne oraz brak materialnej kwoty.
- Landing, metodologia, Millennium, Nest, Pekao, Kraken i Revolut bez poziomego overflow i duplikatów ID w 1440×900 oraz 390×844; brak błędów i ostrzeżeń konsoli.
- Popovery glossary: hover, click/tap, Enter, Space, Escape, focus return, outside click i granice viewportu desktop/mobile.

### Known limitations

- Dane scenariusza istnieją tylko w bieżącym formularzu i znikają po przeładowaniu; nie używamy `localStorage`.
- Pekao wymaga osobnego podania wydatków z pierwszych 20 transakcji i od 21. transakcji, ponieważ kolejność materialnie zmienia saldo podróżne.
- Match nie porównuje jeszcze kompletnej alternatywnej oferty; dodatni scenariusz podstawowych przypadków zachowuje Verdict `TAKE IF`.

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
