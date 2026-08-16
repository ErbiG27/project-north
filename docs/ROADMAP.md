# Roadmapa ProjectNorth

> Wersja robocza · Priorytet wyznacza wartość dla użytkownika, nie atrakcyjność techniczna.

## Zasady planowania

Element trafia do sprintu tylko z celem, właścicielem, zakresem i Definition of Done. Roadmapa jest kolejnością hipotez, nie obietnicą terminu. Funkcje finansowe, afiliacyjne i analityczne wymagają najpierw zasad transparentności oraz zgodności prawnej.

## Stan obecny — v0.6.0

**Cel osiągnięty:** uporządkowano fundamenty frontendu bez zmiany kierunku produktu.

`style.css` jest jednym punktem wejścia do modułowych arkuszy, strona główna ma własny moduł `styles/pages/home.css`, a marka korzysta z własnego logo, sygnetu i faviconów. Usunięto stare, puste pliki zastępcze CSS oraz `frontend.zip`; testy smoke zakończyły się powodzeniem.

## Następne etapy

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

**Cel:** udowodnić jakość wyjaśnialnej decyzji na małym, celowo zróżnicowanym zestawie ofert. Nie skalować katalogu do dziesiątek ofert.

- **Bank Millennium:** klasyczna premia, wysiłek miesięczny i czas do nagrody.
- **Nest Bank:** reklamowane maksimum kontra rzeczywisty scenariusz wydatków użytkownika.
- **Bank Pekao:** różne formy nagrody i ograniczona użyteczność marketingowego maksimum.
- BOŚ i Allegro Klik pozostają kolejnymi kandydatami po zamknięciu podstawowej trójki.
- Dla każdej oferty opisać trzy poziomy: `Advertised Max`, `Easy Floor` oraz `Your Likely Value` / `Conditional Max` tam, gdzie ma zastosowanie; wartość scenariuszową oprzeć na jawnych założeniach lub formule.
- Ująć formę i użyteczność nagrody, wymagany kapitał, koszty, opportunity cost, czas, powtarzalne obowiązki, warunki kwalifikacji, karencje i punkty utraty nagrody.
- Rozdzielić kierunkowo `North Value` od `North Confidence`; nie publikować fałszywie precyzyjnych procentów bez danych.
- Użyć adekwatnego werdyktu spośród `TAKE NOW`, `TAKE IF`, `SKIP` i `NOT ENOUGH DATA`. `WAIT` pozostaje poza wiarygodnym zakresem tej wersji.
- Prowadzić ręczny evidence ledger dla krytycznych pól: źródło, regulamin, data weryfikacji i status lub pewność danych.

**Definition of Done:** trzy kompletne analizy testują różne przypadki modelu, ujawniają założenia i dowody na poziomie pól oraz prowadzą do wyjaśnialnych, niekoniecznie pozytywnych decyzji. Zakres dowodzi jakości decyzji, nie skali katalogu.

### Po core v0.6.1 — optional stretch: controlled crypto pilot

Ten etap może rozpocząć się wyłącznie po walidacji podstawowej trójki v0.6.1: Bank Millennium, Nest Bank i Bank Pekao. Pierwszy publiczny MVP nadal koncentruje się na ofertach niskiego ryzyka; krypto nie staje się główną kategorią produktu.

- Przeanalizować dokładnie jeden crypto hard case: Kraken referral z Research Sprint #1.
- Traktować go jako validation case dla odporności Decision Model v1, nie jako rozszerzenie katalogu, nowy filar North ani zapowiedź szerokiego otwarcia krypto.
- Jawnie pokazać dynamiczny lub niegwarantowany charakter nagrody, większą niepewność danych, ryzyko rynkowe, `North Confidence`, kapitał użytkownika narażony na ryzyko oraz wszystkie wymagane warunki wykonania.
- Dopuścić Verdict `TAKE IF`, `SKIP` lub `NOT ENOUGH DATA`; nie publikować pozytywnego Verdict wyłącznie dlatego, że istnieje afiliacja lub referral.
- Przed publikacją ponownie zweryfikować aktualne warunki promocji, publiczną dostępność ścieżki wejścia, ograniczenia programu referral, dozwolony sposób publikacji i linkowania, ryzyko rynkowe oraz niegwarantowany charakter nagrody.

**Definition of Done:** analiza Kraken pokazuje, czy Decision Model v1 zachowuje użyteczność przy podwyższonym ryzyku i niepewności, bez zmiany core scope v0.6.1 i bez otwierania kategorii krypto.

### v0.6.2 — Evidence & freshness foundation

- Opublikować metodologię modelu decyzji i definicje kryteriów, w tym granice North Confidence.
- Rozwinąć ręczny evidence ledger o wersjonowanie edycji, snapshot regulaminu, statusy `active`, `closing`, `expired`, `unverified` oraz widoczny log korekt.
- Zaprojektować proces ręcznego QA i aktualizacji wygasających ofert przed rozważeniem automatyzacji.
- Opublikować politykę afiliacyjną, która dopuszcza zwycięstwo oferty bez linku partnerskiego i werdykt `SKIP`.

**Definition of Done:** każda liczba i rekomendacja ma określone pochodzenie oraz właściciela aktualizacji.

### v0.7.0 — Explainable North Match

- Zbudować dopasowanie oparte na jawnych założeniach użytkownika, bez zbędnych danych wrażliwych.
- Pokazywać, dlaczego oferta pasuje lub nie pasuje oraz jak zmiana założenia zmienia wartość i werdykt.
- Porównywać ofertę z alternatywą i brakiem działania; sam procent dopasowania nie jest wynikiem wystarczającym.

**Definition of Done:** użytkownik potrafi wskazać czynniki wyniku i zobaczyć konsekwencję zmiany co najmniej jednego założenia.

### v0.7.1 — Treść, SEO i dostępność

- Uzupełnić unikalne meta title, description, nagłówki oraz dane strukturalne tam, gdzie są zasadne.
- Przeprowadzić audyt klawiatury, kontrastu, alternatyw tekstowych i responsywności.
- Dodać puste stany dla wyszukiwania i filtrów.

**Definition of Done:** kluczowe strony mają pełne metadane, brak krytycznych problemów dostępności i czytelne stany braku wyników.

### v0.8.0 — Prywatna beta

- Zdefiniować grupę testową i zadania testowe.
- Mierzyć podstawowe przejścia: katalog → oferta → CTA.
- Zbierać jakościowy feedback, nie tylko liczbę kliknięć.

**Definition of Done:** decyzje o kolejnych zmianach opierają się na obserwacji użytkowników, nie tylko intuicji zespołu.

## Później, nie teraz

- Pełny North Plan / portfolio planner i conflict engine — po walidacji modelu decyzji i dopasowania.
- Historyczne `WAIT` vs `TAKE` — dopiero po zebraniu porównywalnych edycji, określeniu jakości danych i wykonaniu backtestu.
- Automatyczne monitorowanie regulaminów — dopiero po sprawdzeniu ręcznego evidence ledger na małej liczbie ofert.
- Krypto jako kategoria — poza pierwszym publicznym MVP; jedynym dopuszczonym wyjątkiem jest opisany wyżej, późniejszy i kontrolowany pilot Kraken po walidacji core v0.6.1.
- Motion i zaawansowane animacje — dopiero po stabilizacji treści i ścieżek.
- Porównywarka — po ujednoliceniu danych przynajmniej kilku ofert.
- Konta użytkowników, backend i premium — po potwierdzeniu potrzeby w becie.
- Integracje analityczne — minimalnie i z poszanowaniem prywatności; nie są substytutem badań użytkowników.
