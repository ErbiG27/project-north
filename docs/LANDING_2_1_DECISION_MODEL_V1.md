# Landing 2.1 + Decision Model v1

> Status: specyfikacja implementacyjna · Zakres produktu: v0.6.1 · Źródła kierunku: Research Sprint #1 i ADR-006 · Ostatnia aktualizacja: 2026-08-16

## 1. Cel i granice

Ten dokument jest wspólnym kontraktem dla Landing 2.1 oraz pierwszych trzech analiz Decision Model v1: Bank Millennium, Nest Bank i Bank Pekao. Jeden dokument jest celowy: landing ma demonstrować dokładnie ten sam model wartości, scenariuszy, werdyktów i dowodów, którego użyją listing oraz strony ofert. Rozdzielenie tych zasad na kilka nowych plików tworzyłoby równoległe definicje.

North ma być wyjaśnialnym systemem decyzji, nie rankingiem premii. Użytkownik powinien zrozumieć:

- co składa się na reklamowane maksimum;
- jaka część jest łatwym rdzeniem, a jaka zależy od dodatkowych warunków;
- ile oferta może być warta dla jawnego scenariusza;
- jakich wymaga działań, czasu, kosztów i rezygnacji z alternatyw;
- co może spowodować utratę nagrody;
- czy właściwą decyzją jest `TAKE NOW`, `TAKE IF`, `SKIP` czy `NOT ENOUGH DATA`;
- z jakich źródeł i przy jakim poziomie pewności wynika ten wniosek.

### Zakres v0.6.1

- jeden spójny kontrakt danych, wystarczający dla listingu, strony szczegółów, Snapshot, Value, Confidence, Verdict i źródeł;
- ręczne przygotowanie i evidence ledger dla trzech ofert bankowych;
- scenariusze oparte na jawnych założeniach, bez pozornej personalizacji i bez procentowego Match;
- wartości pieniężne jako kwoty lub zakresy, jeśli da się je obronić, oraz jakościowe bandy dla cech, których nie da się uczciwie przeliczyć na pieniądze;
- statyczna implementacja po stronie obecnego frontendu może być pierwszym krokiem; ten kontrakt nie wymaga backendu.

### Poza zakresem

- North Score jako główne USP lub nowy uniwersalny wynik 0–100;
- aktywny Verdict `WAIT`;
- prognozowanie przyszłych edycji promocji;
- pełny North Plan, portfolio planner, conflict engine i automatyczne przypomnienia;
- automatyczny monitoring regulaminów i historia zmian edycji;
- automatycznie wyliczana completion probability;
- pełna personalizacja i procentowy North Match;
- krypto w podstawowym zakresie. Kraken pozostaje późniejszym, kontrolowanym przypadkiem walidacyjnym po zamknięciu trzech ofert bankowych.

## 2. Wspólne zasady prezentacji

1. `Advertised Max` jest twierdzeniem oferenta, a nie wartością North ani obietnicą otrzymania nagrody.
2. `Easy Floor` oznacza wartość dla opisanego, relatywnie prostego zestawu działań. Nie oznacza wartości gwarantowanej. Gdy nie istnieje uczciwy „łatwy rdzeń”, pole ma wartość `null` i UI wyjaśnia dlaczego.
3. `Your Likely Value` jest wynikiem jawnego scenariusza. Bez wymaganych założeń pokazujemy formułę, zakres lub pytania do uzupełnienia, a nie pozornie dokładną kwotę.
4. `Conditional Max` pokazujemy tylko wtedy, gdy oddzielenie trudniejszej, ograniczonej lub mniej użytecznej części wyjaśnia różnicę między reklamą a wartością użytkownika.
5. Nagrody inne niż gotówka zachowują nazwę swojej formy. Nie nazywamy vouchera, punktów, aktywa ani zwolnienia z opłaty „gotówką”.
6. Wysiłku, czasu i tarcia wyjścia nie przeliczamy domyślnie na arbitralną stawkę godzinową. Pokazujemy je obok wartości pieniężnej.
7. Afiliacja nie zmienia kolejności, Value, Confidence ani Verdict.
8. Każda aktualna liczba i każdy krytyczny warunek muszą prowadzić do dowodu dla konkretnej edycji promocji.
9. Jeśli dane są niewystarczające, UI ma to ujawnić. Brak danych nie może być zastąpiony neutralnie brzmiącym założeniem.

## 3. Landing 2.1 — architektura

### 3.1. Kolejność i decyzje redakcyjne

| Pozycja | Blok | Rola w narracji |
| ---: | --- | --- |
| 0 | Nagłówek strony | Marka, przejście do analiz i metodologii. |
| 1 | Hero | Nazwać problem: najwyższa premia nie musi być najlepszą decyzją. |
| 1a | Proof / trust strip | Natychmiast podeprzeć obietnicę konkretnymi zasadami. |
| 2 | „2 700 zł nie zawsze znaczy 2 700 zł” + Snapshot | Pokazać na jednym przypadku przejście od reklamy do rozłożonej wartości. |
| 3 | „Ta sama oferta, trzy różne osoby” | Udowodnić, że wartość zależy od scenariusza, nie od uniwersalnego rankingu. |
| 4 | North Verdict | Pokazać wynik decyzji i jego ograniczenia. |
| 5 | Evidence | Wyjaśnić field-level sourcing, świeżość i niepewność. |
| 6 | Po wyborze | Pokazać użyteczny ciąg dalszy bez obiecywania pełnego North Plan. |
| 7 | Pierwsze realne analizy | Dać dostęp do Millennium, Nest i Pekao, bez rankingu po maksimum. |
| 8 | FAQ | Zamknąć najważniejsze obiekcje i granice produktu. |
| 9 | Final CTA | Przejście do analiz po zrozumieniu metody. |
| 10 | Footer | Metodologia, afiliacja, kontakt, status i zastrzeżenia. |

Demo problemu i North Snapshot są jednym blokiem z dwiema wyraźnymi częściami. Oba korzystają z tej samej edycji Pekao i tych samych danych, więc dwa pełne rozdziały powtarzałyby treść oraz zwiększały ryzyko rozjazdu liczb. Proof strip pozostaje kompaktowym paskiem po hero, a nie samodzielną rozbudowaną sekcją. Evidence pozostaje osobną sekcją, ponieważ ma odpowiedzieć na inne pytanie: nie „ile?”, lecz „skąd to wiemy?”.

### 3.2. Nagłówek strony

**Cel:** zapewnić prostą orientację bez rozpraszania przed główną obietnicą.

**Proponowana zawartość:** logo North; linki „Jak działa”, „Analizy”, „Metodologia”; główne CTA „Zobacz analizy”. Nie dodajemy rozbudowanego menu kategorii, dopóki katalog obejmuje trzy oferty.

**CTA:** „Zobacz analizy” → `#opportunities`.

**Dane:** etykiety nawigacji, adres metodologii, liczba opublikowanych analiz wyliczana ze statusów ofert.

**UI:** lekki, nieprzyklejony nagłówek w pierwszej wersji; logo, nawigacja tekstowa, przycisk.

**Desktop / mobile:** desktop — jedna linia; mobile — logo i CTA, a linki drugorzędne w prostym menu lub pominięte na rzecz kotwic w treści. CTA nie może wypychać logo ani tworzyć poziomego scrolla.

**Trust:** CTA używa liczby analiz tylko wtedy, gdy wynika ona z opublikowanych ofert. „3 analizy” nie może obejmować kart `under_verification`.

**Nie obiecujemy:** dużego katalogu, porównania całego rynku ani personalizowanego konta.

### 3.3. Hero

**Cel:** w pięć sekund wyjaśnić zmianę z rankingu bonusów na decyzję dla konkretnej sytuacji.

**Nagłówek H1:**

> Nie pytaj, która premia jest najwyższa. Sprawdź, która ma sens dla Ciebie.

**Proponowany lead:**

> North rozkłada ofertę na wartość, warunki, wysiłek, ryzyka i źródła. Zobaczysz nie tylko kwotę z reklamy, ale też wartość dla jawnego scenariusza i powód decyzji.

**CTA:** główne „Zobacz pierwsze analizy” → `#opportunities`; drugorzędne „Jak liczymy wartość” → `#value-demo`.

**Dane potrzebne do renderowania:**

- statyczne `headline`, `lead` i etykiety CTA;
- `publishedOfferCount` wyliczone z ofert `active` lub `closing` z kompletnym evidence ledger;
- jedna zweryfikowana przykładowa wartość lub neutralny podgląd struktury Value; bez fikcyjnego Score.

**Komponenty UI:** logo; eyebrow „North · decyzja oparta na warunkach”; H1; lead; dwa CTA; podgląd `Value Summary` z etykietami `Advertised Max`, `Easy Floor`, `Your Likely Value` i `North Confidence`.

**Desktop / mobile:** desktop — dwie kolumny, copy po lewej i podgląd decyzji po prawej; mobile — copy, CTA, podgląd. Podgląd nie może wymagać hovera i nie powinien być obrócony, jeśli utrudnia odczyt.

**Trust:** przy podglądzie widoczne „Przykład struktury analizy” albo nazwa, edycja i data weryfikacji realnej oferty. Pasek mikrocopy: „Jawne założenia · Źródła przy warunkach · Afiliacja nie zmienia werdyktu”.

**Nie obiecujemy:** „najlepszej oferty”, gwarantowanej wartości, codziennych aktualizacji, automatycznego dopasowania ani kompletności rynku. Nie pokazujemy pierścienia North Score jako głównej grafiki.

### 3.4. Proof / trust strip

**Cel:** zamienić ogólne „zaufaj nam” na cztery sprawdzalne zasady.

**Nagłówek dostępności:** „Co odróżnia analizę North”. Wizualny nagłówek może pozostać ukryty, jeśli pasek jest jednoznaczny.

**Proponowane copy:**

- „Wartość rozbita na składniki”;
- „Scenariusz zamiast uniwersalnego wyniku”;
- „Źródła przy krytycznych polach”;
- „Afiliacja nie zmienia decyzji”.

**CTA:** brak; pasek wspiera hero i nie konkuruje z jego działaniem.

**Dane:** cztery statyczne zasady; opcjonalnie `methodologyUrl` na całym opisie, bez uczynienia całego paska nieczytelnym linkiem.

**UI:** cztery krótkie pozycje z tekstową etykietą; ikona może wspierać, ale nie zastępuje treści.

**Desktop / mobile:** desktop — jeden rząd; mobile — siatka 2 × 2 lub lista. Pełna treść ma być widoczna bez karuzeli.

**Trust:** żadnych logotypów mediów, ocen klientów ani liczników bez źródła.

**Nie obiecujemy:** niezależności rozumianej jako brak modelu afiliacyjnego. Zamiast tego ujawniamy zasadę rozdziału afiliacji od werdyktu.

### 3.5. Demo wartości i North Snapshot — Pekao

#### Część A: problem

**Cel:** pokazać, dlaczego marketingowe maksimum nie może być przedstawione jako gotówka gotowa do odebrania.

**Nagłówek H2:**

> 2 700 zł nie zawsze znaczy 2 700 zł

`2 700 zł` jest liczbą demonstracyjną pochodzącą z kierunku researchu i ma status **REVERIFY BEFORE IMPLEMENTATION**. Nie wolno opublikować tego nagłówka, dopóki oficjalna strona i regulamin konkretnej edycji Pekao nie potwierdzą kwoty, składników oraz zasad ich łączenia.

**Proponowany copy:**

> Reklamowane maksimum może łączyć kilka rodzajów nagrody, osobne warunki i różną użyteczność. North pokazuje każdy składnik oddzielnie, a wartość dla Ciebie liczy dopiero po zapisaniu założeń.

**Proponowane etykiety demo:**

- `Advertised Max`: „do 2 700 zł*” — **REVERIFY BEFORE IMPLEMENTATION**;
- „Gotówka”: `[kwota i warunki do ponownej weryfikacji]`;
- „Inne formy nagrody”: `[forma, wartość nominalna i ograniczenia do ponownej weryfikacji]`;
- `Conditional Max`: `[składniki wymagające dodatkowych warunków do ponownej weryfikacji]`;
- `Your Likely Value`: „obliczamy dopiero dla wybranego scenariusza”.

Copy nie może sugerować, że Pekao w aktualnej edycji na pewno oferuje konkretną formę inną niż gotówka. Typy składników zostaną nazwane dopiero po weryfikacji.

**CTA:** „Zobacz, co składa się na wartość” — przewinięcie lub rozszerzenie breakdownu w tym samym bloku; drugorzędny link „Otwórz analizę Pekao” tylko po publikacji kompletnej analizy.

**Dane:** `identity.edition`, `value.advertisedMax`, `value.rewardComponents`, `value.conditionalMax`, `value.rewardForms`, `value.usabilityConstraints`, odpowiadające wpisy `evidence.fieldSources` i `verifiedAt`.

**UI:** pasek reklamowanego maksimum; poniżej osobne karty składników z formą nagrody, wartością nominalną, użyteczną wartością lub regułą jej ustalenia, warunkami i statusem pewności. Nie używamy jednego zielonego sumatora, jeśli składniki nie są ekwiwalentem gotówki.

#### Część B: North Snapshot

**Cel:** zamienić breakdown z części A w dziesięciosekundowy obraz decyzji.

**Nagłówek H3:** „North Snapshot: reklama, scenariusz, obowiązki”.

**Proponowany copy:**

> Najpierw widzisz maksimum z reklamy. Potem: łatwy rdzeń, wartość dla założeń, wymagane działania, czas i najważniejszy punkt utraty nagrody.

**CTA:** „Sprawdź założenia scenariusza” — otwarcie widocznej listy założeń, nie ukrytego tooltipa.

**Dane:** `advertisedMax`, `easyFloor`, wynik `scenarioFormula`, opcjonalny `conditionalMax`, podsumowanie `actions`, `activeMonths`, `payoutLag`, główny `failurePoint`, `northConfidence` oraz dowody dla wszystkich pokazanych pól.

**UI:** sześć pól w kolejności: `Advertised Max`; `Easy Floor`; `Your Likely Value` albo „Brak założeń”; obowiązki; czas do nagrody; główne ryzyko utraty. Forma nagrody i koszt pojawiają się dodatkowo, jeśli zmieniają werdykt.

**Desktop / mobile całego bloku:** desktop — wyjaśnienie i breakdown po lewej, Snapshot po prawej; mobile — nagłówek, ostrzeżenie o reklamowanym maksimum, składniki, założenia, Snapshot. Na wąskim ekranie wartości nie mogą być ukryte w poziomej tabeli.

**Trust:** nazwa banku nie wystarcza jako dowód. Przy liczbie widoczne są: „reklamowane przez oferenta”, identyfikator edycji, data pełnej weryfikacji i link „Zobacz źródła”. Niepewny składnik ma etykietę „wymaga potwierdzenia” i nie wchodzi do opublikowanego `Your Likely Value`.

**Nie obiecujemy:** że `Easy Floor` jest gwarantowany; że suma wartości nominalnych jest równa gotówce; że użytkownik spełni warunki; że liczba 2 700 zł lub jej breakdown są aktualne przed re-verification.

### 3.6. „Ta sama oferta, trzy różne osoby” — Nest

**Cel:** pokazać, że jedna oferta może prowadzić do trzech różnych wartości i werdyktów bez procentowego Match.

**Nagłówek H2:**

> Ta sama oferta, trzy różne osoby

**Proponowany lead:**

> Reklamowane maksimum się nie zmienia. Zmieniają się wydatki, gotowość do wykonywania obowiązków i czas, przez który użytkownik chce je utrzymywać.

**Trzy scenariusze:**

1. **Niskie wydatki.** „Użytkownik wydaje mało w kategoriach kwalifikowanych. North liczy nagrodę z jego wydatków, więc `Your Likely Value` może być wyraźnie niższe od maksimum.”
2. **Bez przeniesienia wynagrodzenia.** „Użytkownik nie chce przenosić wpływu wynagrodzenia. Składnik zależny od tego warunku ma wartość zero; jeśli jest to warunek wejścia do całej promocji, scenariusz staje się niekwalifikowany.” Status warunku jest **REVERIFY BEFORE IMPLEMENTATION**.
3. **Dobre dopasowanie do warunków.** „Użytkownik ma kwalifikowane wydatki, akceptuje wymagane wpływy i chce utrzymać działania przez pełny horyzont. Może zbliżyć się do maksimum warunkowego, ale tylko dla potwierdzonej formuły i bez pominięcia miesięcy.”

Horyzont `24 miesiące` należy w demo traktować jako **REVERIFY BEFORE IMPLEMENTATION**. Przed publikacją trzeba potwierdzić, czy dotyczy aktualnej edycji, całej promocji czy wybranego składnika oraz czy wcześniejsze zakończenie powoduje tylko utratę przyszłych nagród, czy również clawback.

**CTA:** „Zobacz, jak scenariusz zmienia wynik” — przełączanie trzech opisanych scenariuszy; po publikacji analizy: „Otwórz analizę Nest”.

**Dane:** `scenarioFormula.inputs`, `requiredSpend`, `requiredIncome`, `actions`, `activeMonths`, `rewardComponents`, `usabilityConstraints`, `failurePoints`, trzy `scenarioExamples`, `northValue` i `verdict` dla każdego przykładu.

**UI:** trzy dostępne przyciski scenariuszy lub trzy karty. Aktywny scenariusz pokazuje: założenia; wartość brutto; użyteczną wartość lub zakres; koszty; horyzont; burden; failure risk; Verdict z powodami. Nie pokazujemy `Match 93%` ani innego syntetycznego procentu.

**Desktop / mobile:** desktop — scenariusze po lewej, wspólny panel wyniku po prawej; mobile — trzy karty w pełnej pionowej kolejności albo przyciski z poprawnym stanem `aria-selected`. Kluczowe różnice muszą być dostępne bez gestu przeciągania.

**Trust:** każde założenie użytkownika jest oddzielone od faktu o ofercie. Parametry formuły, wymagania i horyzont prowadzą do źródeł. Przykład ma etykietę „scenariusz demonstracyjny”, nie „typowy klient”.

**Nie obiecujemy:** statystycznej typowości scenariuszy, completion probability, dokładnej kwoty bez danych o wydatkach ani aktualności 24-miesięcznego horyzontu przed weryfikacją.

### 3.7. North Verdict — decyzja, nie ranking

**Cel:** pokazać, że rezultatem jest działanie z uzasadnieniem, a nie miejsce w tabeli.

**Nagłówek H2:**

> Decyzja, nie miejsce w rankingu

**Proponowany copy:**

> North łączy wartość scenariusza, koszty, wysiłek, ryzyko i jakość dowodów. Wynik mówi, co zrobić i dlaczego — również wtedy, gdy najlepszą decyzją jest odpuścić.

**Stany prezentowane na landingu:**

- `TAKE NOW` — „Warunki są spełnione, źródła kompletne, a scenariusz ma sens względem alternatywy lub braku działania.”
- `TAKE IF` — „Oferta ma sens tylko po spełnieniu wskazanych warunków osobistych.”
- `SKIP` — „Koszt, ryzyko, brak kwalifikacji lub lepsza alternatywa przeważają.”
- `NOT ENOUGH DATA` — „Nie ma podstaw do pewnej decyzji; pokazujemy, czego brakuje.”

`WAIT` nie występuje jako karta, filtr ani sugerowana rekomendacja. W metodologii można wyjaśnić, że stan wymaga historii porównywalnych edycji i backtestu i dlatego jest wyłączony.

**CTA:** „Poznaj reguły Verdict” → publiczna metodologia lub rozwinięcie zasad.

**Dane:** enum `decision.verdict`, `reasons`, `conditions`, `positiveBlockers`, `alternativeComparison`, `northConfidence`, `evidenceGaps`.

**UI:** cztery karty stanów albo jeden przykład wraz z legendą. Każdy stan ma tekst, nie tylko kolor. CTA partnerskie nie należy do tego demo.

**Desktop / mobile:** desktop — cztery kolumny tylko jeśli copy pozostaje czytelne; preferowana siatka 2 × 2. Mobile — jedna kolumna. Kolejność nie sugeruje rankingu jakości.

**Trust:** przy każdym wyniku co najmniej jeden powód i jeden warunek blokujący lub ograniczenie. `NOT ENOUGH DATA` jawnie wylicza braki.

**Nie obiecujemy:** automatycznej rekomendacji dla każdej osoby, przewidywania przyszłych ofert ani bezwarunkowego „bierz”.

### 3.8. Evidence — „Dlaczego możesz nam ufać”

**Cel:** pokazać mechanizm kontroli twierdzeń, a nie ogólny symbol bezpieczeństwa.

**Nagłówek H2:**

> Dlaczego możesz nam ufać

**Proponowany copy:**

> Krytyczne liczby i warunki łączymy z konkretną edycją promocji, oficjalnym źródłem, punktem regulaminu i datą sprawdzenia. Jeśli źródła są niepełne albo niejednoznaczne, obniżamy North Confidence lub wstrzymujemy werdykt.

**CTA:** „Zobacz metodologię” oraz, w demo, „Pokaż źródła tej analizy”.

**Dane:** `evidence.sources`, `fieldSources`, `checkedAt`, `recheckBy`, `verifiedAt`, `northConfidence.factors`, `uncertaintyNotes`.

**UI:** przykładowy ledger z trzema wierszami: pole; typ źródła; dokładna referencja; data sprawdzenia; status. Obok band `North Confidence` i dwa najważniejsze czynniki. Link do dokumentu źródłowego pozostaje zwykłym, widocznym linkiem.

**Desktop / mobile:** desktop — ledger i panel Confidence obok; mobile — każdy wiersz jako pionowa karta, bez szerokiej tabeli. Referencja nie może być dostępna wyłącznie w tooltipie.

**Trust:** oficjalny regulamin ma pierwszeństwo przed landingiem banku; konflikt jest widoczny i blokuje pozytywny Verdict do wyjaśnienia. Pokazujemy datę pełnej weryfikacji, nie automatycznie generowane „aktualne”.

**Nie obiecujemy:** codziennej aktualizacji, kompletności źródeł, automatycznego śledzenia zmian ani porady finansowej.

### 3.9. Teaser: co North robi po wyborze

**Cel:** pokazać, że decyzja prowadzi do bezpiecznego wykonania, bez sprzedawania niewdrożonego North Plan.

**Nagłówek H2:**

> Po wyborze wiesz, co dokładnie zrobić

**Proponowany copy:**

> Analiza porządkuje wymagane działania, terminy, miesięczny rytm, czas wypłaty i punkty, przez które można stracić nagrodę. Informację o bezpiecznym wyjściu pokazujemy tylko wtedy, gdy potwierdza ją źródło.

**CTA:** „Zobacz kroki w analizie” → pierwsza opublikowana analiza z kompletnym Execution.

**Dane:** `actions`, `cadence`, `deadlines`, `activeMonths`, `payoutLag`, `failurePoints`, `safeExit`.

**UI:** statyczny podgląd checklisty: „przed startem”, „co miesiąc”, „przed wypłatą”, „po wypłacie / wyjście”. Obok główny failure point. To widok informacyjny, nie tracker wykonania.

**Desktop / mobile:** desktop — pozioma oś czterech etapów lub dwie kolumny; mobile — pionowa lista w kolejności czasu. Daty muszą być tekstem, nie tylko pozycją na osi.

**Trust:** każdy krok odróżnia termin regulaminowy od rekomendowanego bufora North. Nieznany safe exit jest opisany „niepotwierdzony”, a nie pominięty.

**Nie obiecujemy:** przypomnień, monitoringu konta, automatycznego odhaczania, gwarancji wypłaty ani pełnego North Plan.

### 3.10. Featured real opportunities

**Cel:** przejść od metody do trzech analiz, które testują różne problemy decyzyjne.

**Nagłówek H2:**

> Pierwsze analizy North

**Proponowany lead:**

> Trzy oferty, trzy różne pytania: miesięczny wysiłek, wartość zależna od wydatków i nagrody o różnej użyteczności.

**Karty:**

- Bank Millennium — etykieta problemu: „Obowiązki co miesiąc i czas do nagrody”;
- Nest Bank — „Maksimum kontra Twój scenariusz wydatków”;
- Bank Pekao — „Różne formy nagrody i ich użyteczność”.

**CTA:** na opublikowanej karcie „Zobacz analizę”; na `under_verification` zwykła etykieta „Analiza w przygotowaniu”, bez aktywnego zewnętrznego CTA. Link partnerski pojawia się dopiero na stronie analizy, po werdykcie i disclosure.

**Dane:** dla listingu: `id`, `slug`, `provider`, `category`, `title`, `status`, `verifiedAt`, `edition`, skrót `advertisedMax`, `easyFloor`, wariant `likelyValue`, `northConfidence.band`, `verdict`, `listing.problemLabel`, `listing.summary`, `affiliate.available`.

**UI:** trzy równorzędne karty. Pierwsza informacja to problem i werdykt, nie wielkość premii. Brak sortowania „najwyższy bonus” na tym etapie.

**Desktop / mobile:** desktop — trzy kolumny; mobile — jedna kolumna w tej samej kolejności redakcyjnej. Nie używamy poziomej karuzeli.

**Trust:** status i data weryfikacji są widoczne; `closing` pokazuje potwierdzony termin; `expired` nie prowadzi do CTA. Brak linku afiliacyjnego nie obniża pozycji karty.

**Nie obiecujemy:** rankingu rynku, najlepszych kont, kompletności kategorii ani aktualności karty bez daty.

### 3.11. FAQ

**Cel:** odpowiedzieć na obiekcje, których nie należy upychać w głównej narracji.

**Nagłówek H2:** „Najczęstsze pytania”.

**Proponowane pytania i odpowiedzi:**

1. **Czy North pokazuje najlepszą ofertę?** „Nie tworzymy uniwersalnego zwycięzcy. Pokazujemy wartość i warunki dla jawnego scenariusza oraz porównujemy je z rozsądną alternatywą lub brakiem działania.”
2. **Czym różni się Advertised Max od Your Likely Value?** „Pierwsze to maksimum komunikowane przez oferenta. Drugie wynika z Twoich założeń, kwalifikacji, działań, kosztów i użyteczności nagrody.”
3. **Czy Easy Floor jest gwarantowany?** „Nie. To relatywnie prosty, jawnie opisany zestaw warunków. Nadal trzeba spełnić regulamin i uniknąć punktów utraty.”
4. **Co oznacza North Confidence?** „Jakość źródeł, kompletność, świeżość, pewność edycji i założeń. Pokazujemy band LOW, MEDIUM lub HIGH wraz z powodami, nie pozornie dokładny procent.”
5. **Czy link partnerski wpływa na werdykt?** „Nie. Oferta bez linku może być lepszą alternatywą, a oferta partnerska może otrzymać SKIP.”
6. **Dlaczego North nie mówi WAIT?** „Bez historii porównywalnych edycji i backtestu nie umiemy wiarygodnie ocenić, czy czekanie będzie lepsze. Dlatego ten stan jest wyłączony.”
7. **Czy North udziela porady finansowej?** „North porządkuje publiczne warunki i scenariusze. Decyzja należy do użytkownika; przed działaniem należy sprawdzić regulamin konkretnej edycji.”

**CTA:** w odpowiedziach wyłącznie kontekstowe linki do metodologii, polityki afiliacyjnej i analiz; bez sprzedażowego przycisku w każdym akordeonie.

**Dane:** treść wersjonowana razem z metodologią; linki; `lastReviewedAt`.

**UI:** natywne, dostępne disclosure/accordion albo otwarta lista. Pytanie i odpowiedź muszą działać bez JavaScriptu.

**Desktop / mobile:** jedna czytelna kolumna o ograniczonej szerokości; te same treści na obu widokach.

**Trust:** odpowiedzi opisują granice systemu i rolę użytkownika.

**Nie obiecujemy:** indywidualnej porady, pokrycia całego rynku, automatycznej aktualności ani przyszłych wyników.

### 3.12. Final CTA

**Cel:** poprosić o jedno działanie po wyjaśnieniu metody.

**Nagłówek H2:**

> Zobacz wartość, warunki i ryzyko przed wyborem

**Proponowany copy:**

> Zacznij od jednej z trzech analiz i sprawdź nie tylko maksimum, ale też scenariusz, obowiązki, koszty oraz źródła.

**CTA:** „Zobacz pierwsze analizy” → `#opportunities`; drugorzędnie „Przeczytaj metodologię”.

**Dane:** liczba faktycznie opublikowanych analiz; jeśli wynosi zero, CTA zmienia się na „Zobacz, jak działa model” i prowadzi do demo, a copy nie mówi o dostępnych analizach.

**UI:** jeden zwarty panel bez formularza i bez presji czasowej.

**Desktop / mobile:** ten sam porządek; na mobile przyciski mogą mieć pełną szerokość.

**Trust:** żadnego sztucznego countdownu ani „zostało X miejsc”.

**Nie obiecujemy:** oszczędności, zarobku, gwarantowanej premii ani natychmiastowego dopasowania.

### 3.13. Footer, metodologia i afiliacja

**Cel:** zapewnić trwały dostęp do zasad, źródeł odpowiedzialności i disclosure.

**Proponowane copy:**

> North porządkuje publiczne warunki ofert i pokazuje scenariusze decyzji. Nie gwarantuje otrzymania nagrody i nie zastępuje regulaminu ani indywidualnej porady. Link partnerski może przynieść North wynagrodzenie bez dodatkowego kosztu dla użytkownika; nie wpływa na Value, Confidence ani Verdict.

**CTA / linki:** „Metodologia”; „Polityka afiliacyjna”; „Kontakt”; „Źródła i korekty”; opcjonalnie „Status analiz”.

**Dane:** `methodologyUrl`, `affiliatePolicyUrl`, `contactUrl`, `correctionsUrl`, rok, wersja modelu, `lastReviewedAt`.

**UI:** logo / sygnet, krótki disclaimer, grupy linków, wersja „Decision Model v1”.

**Desktop / mobile:** desktop — 2–3 kolumny; mobile — logiczna lista. Disclosure nie może być drobnym, niskokontrastowym tekstem.

**Trust:** metodologia i disclosure są dostępne z każdej strony; zewnętrzne linki partnerskie mają czytelną etykietę i `rel="sponsored noopener"`.

**Nie obiecujemy:** formalnej niezależności od wszelkich przychodów; deklarujemy regułę, według której przychód nie wpływa na decyzję.

### 3.14. Kontrakt danych landingu i stany

Landing nie ma własnej kopii liczb ofert. Demo Pekao, scenariusze Nest i karty featured pobierają dane z tego samego rekordu edycji, który zasila analizę szczegółową.

```text
landing = {
  contentVersion,
  lastReviewedAt,
  methodologyUrl,
  affiliatePolicyUrl,
  featuredOfferIds[],
  valueDemo: { offerId, editionId, scenarioId, status },
  personaDemo: { offerId, editionId, scenarioIds[], status }
}
```

Dozwolone stany demo:

- `verified` — wszystkie pokazane pola mają dowody, edycję i aktualny `checkedAt`;
- `structure_only` — UI pokazuje etykiety i metodę bez danych wyglądających jak aktualna oferta;
- `blocked` — demo nie jest renderowane, bo krytyczne dane są sprzeczne, niepełne lub przeterminowane.

Nie istnieje stan „real-looking placeholder”. Jeśli Pekao nie przejdzie bramy weryfikacji, landing używa neutralnego demo struktury bez logo banku i bez `2 700 zł`.

## 4. Decision Model v1 — minimalny kontrakt

### 4.1. Zasady modelowania

- Jeden rekord reprezentuje analizowaną ofertę, a `edition` wskazuje konkretną edycję promocji. Nowa edycja nie może po cichu nadpisać dowodów starej.
- Dane ofertowe, założenia użytkownika i wyniki pochodne są rozdzielone.
- Kwota jest obiektem `{ amount, currency }`; brak wartości to `null` z powodem, nigdy `0` użyte jako „nie wiemy”.
- Daty mają format ISO `YYYY-MM-DD`; znaczenie terminu znajduje się w nazwanym polu, nie w swobodnym copy.
- Pola krytyczne są mapowane do evidence ledger przez ścieżkę pola. Nie trzeba opakowywać każdego pola w rozbudowany obiekt źródłowy.
- Wartości pochodne zachowują `scenarioId`, założenia i wersję metodologii.
- Copy listingu i strony szczegółów jest projekcją modelu, nie drugim źródłem faktów.

### 4.2. Rekord główny

```text
offer = {
  schemaVersion: "decision-model-v1",
  identity: { ... },
  value: { ... },
  eligibility: { ... },
  execution: { ... },
  cost: { ... },
  decision: { ... },
  functionalValue: { ... } | null,
  yieldOffer: { ... } | null,
  promotionVariants: [...],
  linkedPromotions: [...],
  evidence: { ... },
  listing: { problemLabel, summary, featured },
  affiliate: { available, url, disclosure }
}
```

`listing` i `affiliate` są cienką warstwą prezentacyjną. Nie przechowują osobnych kwot, warunków ani werdyktu.

### 4.3. IDENTITY

| Pole | Wymagane | Reguła |
| --- | :---: | --- |
| `identity.id` | tak | Stabilny identyfikator analizowanej oferty, niezależny od tytułu marketingowego. |
| `identity.slug` | tak | Stabilny, czytelny URL; zmiana edycji nie wymusza zmiany sluga. |
| `identity.provider` | tak | Oficjalna nazwa oferenta. |
| `identity.category` | tak | `bank_account` albo `savings_account`; `crypto_validation` pozostaje technicznym hard case, nie kategorią katalogu. |
| `identity.productIdentityStatus` | warunkowo | `current` dla bieżącego produktu; alias historyczny nie tworzy drugiej karty. |
| `identity.previousNames` | nie | Oficjalne poprzednie nazwy produktu lub dostawcy, np. Santander → Erste. |
| `identity.redirectToProductId` | nie | Stabilny cel przekierowania wyłącznie dla rekordu aliasu; katalog nie publikuje aliasu jako osobnej oferty. |
| `identity.title` | tak | Oficjalna lub neutralna nazwa oferty; bez nieudowodnionego „najlepsza”. |
| `identity.status` | tak | `draft`, `under_verification`, `active`, `closing`, `expired` lub `withdrawn`. |
| `identity.verifiedAt` | warunkowo | Data ostatniego pełnego przeglądu wszystkich krytycznych pól. `null`, dopóki przegląd nie jest kompletny. |
| `identity.edition.id` | tak | Identyfikator z regulaminu; jeśli go nie ma, jawny identyfikator North i nota o niepewności. |
| `identity.edition.name` | tak | Pełna nazwa promocji lub neutralna etykieta edycji. |
| `identity.edition.validFrom` | warunkowo | Początek przyjmowania wniosków, jeśli określony. |
| `identity.edition.validTo` | warunkowo | Koniec przyjmowania wniosków, jeśli określony. |
| `identity.edition.certainty` | tak | `confirmed`, `ambiguous` albo `unknown`; wpływa na Confidence. |

Status `active` jest dozwolony dopiero, gdy edycja, termin wejścia, kwalifikacja, wartość, działania, koszty, wypłata i główne failure points mają wystarczające dowody.

### 4.4. VALUE

```text
value = {
  advertisedMax: {
    displayLabel,
    faceValueTotal: Money | null,
    cashValueTotal: Money | null,
    nonCashValueTotal: Money | null,
    valuationBasis,
    componentIds[],
    aggregationBasis,
    isCashEquivalent,
    caveat
  },
  rewardComponents: [{
    id,
    label,
    form,
    advertisedValue: Money | null,
    valuation: {
      amount,
      currency,
      source,
      cashEquivalent,
      userValueMustBeEstimated
    } | null,
    calculation,
    conditionActionIds[],
    combinability,
    conditional,
    usability: {
      liquidity,
      usableValueRule,
      restrictions[],
      expiry,
      transferability
    }
  }],
  easyFloor: ScenarioValue | null,
  scenarioFormula: {
    humanReadable,
    expression,
    inputs[],
    caps[],
    horizon,
    assumptions[]
  },
  conditionalMax: ScenarioValue | null,
  rewardForms[],
  usabilityConstraints[],
  scenarioExamples[]
}
```

**Dozwolone `rewardComponents.form`:** `cash`, `voucher`, `physical_reward`, `cashback`, `interest`, `fee_waiver`, `functional`, `points`, `asset`, `other`. Typ nie przesądza wartości użytecznej; tę określa `usability` i opcjonalna `valuation`.

**Dozwolone `usability.liquidity`:** `cash`, `cash_equivalent`, `restricted`, `market_exposed`, `unknown`.

**`ScenarioValue` zawiera:** `scenarioId`; `grossValue` jako kwotę lub zakres; `usableValue` jako kwotę, zakres albo `null`; `includedComponentIds`; `excludedComponentIds` z powodami; `assumptions`; `calculatedAt`; `methodologyVersion`.

Reguły:

- `faceValueTotal` można zsumować tylko dla składników w tej samej walucie, które regulamin pozwala łączyć. Suma nadal nie staje się gotówką, jeśli zawiera formy ograniczone.
- `easyFloor` musi mieć własne założenia i action IDs. Jeśli najprostszy zestaw nadal wymaga istotnego commitmentu lub nie ma wiarygodnej dolnej wartości, ustawiamy `null`.
- `conditionalMax` nie dubluje `advertisedMax`; wyjaśnia, jaka część maksimum wymaga dodatkowego kapitału, dłuższego horyzontu, szczególnych zachowań lub ma ograniczoną użyteczność.
- `scenarioFormula.expression` ma być audytowalna, lecz UI zawsze pokazuje także wersję `humanReadable`.
- Completion probability nie jest mnożnikiem w v1. Nie używamy domyślnego `0.8 × bonus` ani podobnych heurystyk.

### 4.4a. Rozszerzenia katalogu 12 produktów

`functionalValue` opisuje korzyści produktu, których nie wolno zamieniać w arbitralny wynik liczbowy:

```text
functionalValue = {
  baselineMonthlyCost,
  coreFeatures[],
  feeWaiverRequired,
  atmProfile,
  transferProfile,
  fxProfile,
  utilityCaveat
}
```

`yieldOffer` reprezentuje ofertę oszczędnościową zależną od kapitału i czasu. Zawiera co najmniej `rateType`, `promotionalTiers`, `fallbackTiers`, `standardTiers`, `maxEligibleBalance`, `durationDays`, `newMoneyDefinition`, `referenceBalanceDate`, `requiredActivity`, `taxAssumption` i `capitalScenarios`. Roczna stopa nie jest `faceValueTotal`; scenariusz odsetkowy zawsze zachowuje saldo, czas, stopę i założenie podatkowe.

`promotionVariants[]` przechowuje `id`, `name`, `status`, daty, `rewardComponents`, kwalifikację, wymagania, `sourceRefs`, `recheckBy`, `shortLivedPromotion` i `stackability`. Dozwolone stany stackability: `confirmed`, `conditional`, `unknown`, `prohibited`. Wariantów nie wolno sumować automatycznie, jeśli każdy wybrany wariant nie ma `confirmed`.

`linkedPromotions[]` opisuje osobny produkt lub promocję powiązaną. Jej identyfikator ani wartość nie trafiają do głównego `advertisedMax`. UI pokazuje relację, ale nie tworzy fikcyjnej sumy konta, oszczędności i nagrody kanałowej.

### 4.5. USER / ELIGIBILITY

```text
eligibility = {
  geography: { allowed[], excluded[], basis },
  age: { min, max, note },
  newCustomer: {
    required,
    definition,
    lookbackFrom,
    lookbackTo,
    relationshipTypes[]
  },
  priorRelationshipExclusions[],
  requiredIncome: {
    required,
    type,
    amount: Money | null,
    cadence,
    qualifyingSources[],
    excludedSources[]
  },
  requiredSpend: [{
    amount: Money | null,
    cadence,
    eligibleTransactions,
    excludedTransactions,
    appliesToComponentIds[]
  }],
  requiredCapital: {
    amount: Money | null,
    holdingPeriod,
    capitalAtRisk,
    appliesToComponentIds[]
  },
  disqualifiers[],
  userInputsRequired[]
}
```

`requiredIncome`, `requiredSpend` i `requiredCapital` rozróżniają warunek kwalifikacji do całej oferty od warunku pojedynczego składnika. Brak chęci spełnienia warunku komponentu zeruje ten komponent; brak spełnienia warunku wejścia daje `ineligible`, nie wartość zero udającą ważny scenariusz.

### 4.6. EXECUTION

```text
execution = {
  actions: [{
    id,
    label,
    type,
    timing,
    cadence,
    activeMonths,
    threshold,
    appliesToComponentIds[],
    consequenceIfMissed,
    recoverable
  }],
  cadence: { summary, repeatedActionIds[] },
  activeMonths: { min, max, basis },
  deadlines: [{ type, date, relativeRule, appliesTo }],
  payoutLag: {
    earliest,
    latest,
    relativeTo,
    payoutForm,
    uncertaintyNote
  },
  failurePoints: [{
    id,
    label,
    severity,
    scope,
    consequence,
    mitigation,
    sourceRequired
  }],
  safeExit: {
    status,
    earliestExit,
    notice,
    fee,
    clawback,
    steps[],
    uncertaintyNote
  }
}
```

`safeExit.status` przyjmuje `verified`, `partial`, `unknown` albo `not_applicable`. Nie zakładamy braku clawbacku lub opłaty dlatego, że landing promocji o nich nie wspomina.

### 4.7. COST

```text
cost = {
  directFees: [{ label, amount, cadence, unavoidable, appliesDuring }],
  avoidableFees: [{ label, amount, cadence, avoidanceCondition, failurePointId }],
  downstreamCosts: [{ label, amountOrRule, trigger, uncertaintyNote }],
  opportunityCost: [{
    label,
    amountOrRange: MoneyRange | null,
    assumption,
    comparisonId,
    monetized
  }],
  totalsByScenario: [{ scenarioId, direct, avoidableIfMissed, downstream, opportunity }]
}
```

Koszt bezpośredni jest odejmowany od scenariusza, jeśli jest nieunikniony. Opłata możliwa do uniknięcia pozostaje osobno wraz z warunkiem. Opportunity cost jest liczony tylko wobec nazwanej alternatywy lub jawnego założenia użytkownika, np. alternatywnego użycia wynagrodzenia lub kapitału. Nie nadajemy czasu użytkownika arbitralnej wartości pieniężnej w domyślnym modelu.

### 4.8. DECISION

```text
decision = {
  scenarios: [{ id, label, userInputs, eligibilityResult }],
  northValue: [{
    scenarioId,
    advertisedMax,
    easyFloor,
    likelyGrossValue,
    expectedUsableValue,
    netScenarioValue,
    rewardQuality,
    effortBurden,
    duration,
    directCost,
    opportunityCost,
    failureRisk,
    flexibility,
    completionOutlook,
    assumptions[]
  }],
  northConfidence: {
    band,
    factors,
    reasons[],
    blockers[],
    assessedAt
  },
  verdict: {
    scenarioId,
    state,
    summary,
    reasons[],
    conditions[],
    positiveBlockers[],
    missingData[]
  },
  comparison: {
    doNothing,
    alternatives[],
    conclusion,
    limitations[]
  }
}
```

`completionOutlook` jest jakościowe: `ROBUST`, `CONDITIONAL`, `FRAGILE` albo `UNKNOWN`. Nie jest estymatą prawdopodobieństwa. `expectedUsableValue` w v1 oznacza obroniony zakres dla jawnego scenariusza: dolna granica obejmuje składniki wystarczająco potwierdzone i odporne na założenia, górna obejmuje składniki osiągalne przy opisanych warunkach. Nie jest statystyczną wartością oczekiwaną i nie używa wymyślonej completion probability.

### 4.9. EVIDENCE

```text
evidence = {
  regulationUrl,
  officialUrl,
  sources: [{
    id,
    type,
    title,
    url,
    editionReference,
    publishedAt,
    accessedAt,
    status
  }],
  fieldSources: [{
    fieldPath,
    sourceId,
    reference,
    checkedAt,
    supportLevel,
    uncertaintyNote
  }],
  conflicts: [{ fieldPath, sourceIds[], description, resolutionStatus }],
  recheckBy,
  owner,
  notes[]
}
```

**Dozwolone `source.type`:** `official_regulation`, `official_fee_table`, `official_product_page`, `official_faq`, `official_support_confirmation`, `secondary`. Źródło wtórne może pomóc znaleźć problem, ale samo nie wystarcza dla krytycznej liczby lub pozytywnego Verdict.

**Dozwolone `supportLevel`:** `direct`, `interpreted`, `missing`, `conflicting`. Interpretacja wymaga noty, a konflikt musi być rozwiązany przed pozytywnym Verdict.

**Krytyczne ścieżki wymagające mapowania do źródła:** edycja i okres; status; `advertisedMax`; każdy `rewardComponent`; warunki łączenia; `easyFloor`; parametry formuły; kwalifikacja i wykluczenia; wpływ, wydatki i kapitał; działania; terminy; active months; payout; opłaty; failure points; clawback i safe exit, jeśli są komunikowane; wszystkie fakty użyte w Verdict.

### 4.10. Projekcje na interfejs

| Widok | Minimalny zestaw |
| --- | --- |
| Listing | provider, title, status, verifiedAt, problem label, Advertised Max z formą, wariant Your Likely Value lub „uzupełnij scenariusz”, Confidence band, Verdict, slug. |
| Strona szczegółów | pełne Identity, Value, Eligibility, Execution, Cost, Decision i Evidence. |
| Snapshot | trzy poziomy wartości, obowiązki, czas, failure point, forma nagrody / koszt, jeśli materialne, Confidence. |
| Verdict | state, summary, reasons, conditions, blockers, comparison, Confidence, źródła krytycznych przesłanek. |
| Źródła | regulationUrl, officialUrl, ledger pól, dokładne referencje, checkedAt, konflikty i niepewność. |

## 5. North Value v1

### 5.1. Decyzja prezentacyjna

W v0.6.1 **nie pokazujemy jednego wyniku North Value** w punktach ani jednej kwoty bez kontekstu. Pokazujemy rozkład:

1. `Advertised Max` — co komunikuje oferent;
2. `Easy Floor` — prosty, opisany scenariusz, jeśli istnieje;
3. `Your Likely Value` — kwota lub zakres dla jawnych danych użytkownika;
4. `Conditional Max` — opcjonalnie, dla części wymagającej dodatkowych warunków lub o ograniczonej użyteczności;
5. `Expected Usable Value` — zakres po uwzględnieniu formy i ograniczeń nagrody, bez fikcyjnego prawdopodobieństwa;
6. `Net Scenario Value` — użyteczna wartość minus potwierdzone koszty bezpośrednie i jawny opportunity cost;
7. osobno: effort, duration, failure risk i flexibility.

To jest mniej efektowne niż `82/100`, ale bardziej audytowalne. Magiczny wynik mieszałby pieniądze, czas, płynność i ryzyko w wagach, których v0.6.1 nie potrafi jeszcze empirycznie obronić.

### 5.2. Składniki i reguły

| Składnik | Format v1 | Reguła |
| --- | --- | --- |
| Reward quality | `cash`, `cash-equivalent`, `restricted`, `market-exposed`, `mixed`, `unknown` + powód | Nie zamienia automatycznie wartości nominalnej na gotówkę. |
| Expected usable value | kwota lub zakres + założenia | Dolna i górna granica wynikają ze składników i ograniczeń; `null`, jeśli brakuje danych. |
| Effort / burden | `LOW`, `MEDIUM`, `HIGH` + liczba działań i rytm | Bez przeliczenia na PLN; powtarzalność i złożoność są widoczne. |
| Duration | dokładny okres lub zakres | Obejmuje okres działań i payout lag; nie tylko czas otwarcia konta. |
| Direct cost | kwota / zakres | Odejmowany, gdy nieunikniony w scenariuszu. |
| Opportunity cost | kwota / zakres albo opis jakościowy | Tylko wobec jawnej alternatywy lub założenia. |
| Failure risk | `LOW`, `MEDIUM`, `HIGH`, `UNKNOWN` + failure points | Ocenia liczbę, dotkliwość i możliwość naprawy pominięć; nie jest prawdopodobieństwem. |
| Flexibility / exit friction | `LOW`, `MEDIUM`, `HIGH`, `UNKNOWN` + powód | Uwzględnia czas utrzymania, opłaty, clawback i utratę przyszłych składników. |

### 5.3. Obliczenie scenariusza

```text
likelyGrossValue(scenario)
  = suma składników osiągalnych według danych scenariusza i reguł łączenia

expectedUsableValue(scenario)
  = obroniony zakres użytecznej wartości osiągalnych składników
    po zastosowaniu jawnych ograniczeń użycia

netScenarioValue(scenario)
  = expectedUsableValue
    - nieuniknione direct costs
    - jawny, porównywalny opportunity cost
```

Effort, duration, failure risk i flexibility pozostają obok `netScenarioValue`. Nie odejmujemy ich jako ukrytej kary punktowej. Gdy użytkownik poda własną wartość czasu, można pokazać dodatkowy wariant „z Twoją stawką czasu”, ale nie jest to domyślna wartość North.

## 6. North Confidence v1

### 6.1. Decyzja prezentacyjna

W v0.6.1 pokazujemy **wyłącznie band `LOW` / `MEDIUM` / `HIGH` wraz z czynnikami i powodami**. Nie pokazujemy liczby ani połączenia liczby z bandem.

Liczba sugerowałaby skalę pomiarową i różnicę, np. między 78% a 82%, której ręczny evidence ledger na trzech ofertach nie uzasadnia. Band wystarcza do bramkowania Verdict, a breakdown zachowuje wyjaśnialność.

### 6.2. Czynniki

| Czynnik | HIGH | MEDIUM | LOW |
| --- | --- | --- | --- |
| Source quality | Aktualny oficjalny regulamin / tabela opłat bez konfliktu dla krytycznych pól. | Oficjalna strona lub FAQ wspiera część pól, a brak regulaminu nie dotyczy krytycznego wniosku. | Krytyczny fakt opiera się na źródle wtórnym, brak źródła albo źródła są sprzeczne. |
| Source completeness | Wszystkie krytyczne pola i powody Verdict mają mapowanie. | Braki są niematerialne dla bieżącego scenariusza i jawnie opisane. | Brakuje wartości, kwalifikacji, kosztu, terminu, wypłaty lub failure point wpływającego na decyzję. |
| Freshness | Pełny przegląd wykonano po publikacji bieżącej edycji i przed `recheckBy`. | Część źródeł zbliża się do `recheckBy`, ale brak sygnału zmiany i edycja jest pewna. | Minął `recheckBy`, status oferty jest niejasny albo wykryto nowszą edycję. |
| Ambiguity | Krytyczne definicje są jednoznaczne. | Istnieje interpretacja, lecz pokazano ją i nie zmienia kierunku decyzji. | Niejednoznaczność może zmienić wartość, kwalifikację, koszt lub Verdict. |
| Edition certainty | Identyfikator i okres są zgodne we wszystkich oficjalnych źródłach. | Edycja jest rozpoznana, ale drugorzędna etykieta lub data wymaga doprecyzowania. | Nie wiadomo, którego regulaminu lub okresu dotyczy oferta. |
| Scenario assumption quality | Wszystkie materialne dane użytkownika są jawne i mieszczą się w formule. | Część danych ma zakres; wynik jest pokazany jako zakres i kierunek pozostaje stabilny. | Brakuje założenia, które może zmienić kwalifikację, wartość lub Verdict. |

### 6.3. Agregacja i bramy

- `HIGH`: source quality, completeness i edition certainty są `HIGH`; żaden czynnik nie jest `LOW`; ewentualne `MEDIUM` nie zmienia kierunku decyzji.
- `MEDIUM`: nie ma krytycznego braku ani konfliktu; co najmniej oficjalne źródło, edycja i główna formuła są wystarczające, lecz istnieje jawna luka lub zakres założeń.
- `LOW`: dowolny materialny brak lub konflikt w source quality, completeness albo edition certainty; przeterminowana weryfikacja; lub brak scenariusza mogący zmienić wynik.

Overall band dotyczy konkretnego wniosku dla scenariusza. Oferta może mieć dobre źródła, ale `LOW` dla decyzji użytkownika, jeśli brakuje jego materialnych założeń.

## 7. Verdict v1

### 7.1. Wspólne minimum danych

Przed każdym Verdict muszą istnieć: rozpoznana edycja; status; kryteria kwalifikacji; składniki nagrody i reguły łączenia; działania; terminy; active months; payout lag lub jawna niewiadoma; koszty; główne failure points; scenariusz użytkownika; Confidence; porównanie z brakiem działania. Porównanie z inną ofertą jest wymagane, gdy North używa twierdzenia o przewadze nad alternatywą.

### 7.2. Reguły stanów

| Verdict | Kiedy dozwolony | Minimalne dane / Confidence | Przykładowe blokery |
| --- | --- | --- | --- |
| `TAKE NOW` | Użytkownik jest kwalifikowany, wszystkie materialne warunki są już akceptowane, net scenario value jest dodatnia względem `do nothing`, burden i ryzyko są akceptowalne, a znana porównywalna alternatywa nie daje udowodnionej przewagi. | `HIGH`; kompletne krytyczne źródła i założenia. | Niepewna edycja, przyszły wymagany wybór użytkownika, nieznany koszt, niewyjaśniona forma nagrody, lepsza zweryfikowana alternatywa. |
| `TAKE IF` | Oferta ma sens tylko pod nazwanymi warunkami: np. odpowiednie wydatki, gotowość do wpływu wynagrodzenia, utrzymanie działań lub akceptacja ograniczonej formy nagrody. | `MEDIUM` lub `HIGH`; warunek i jego wpływ są policzone. | `LOW` Confidence, brak możliwości sprawdzenia warunku, niespełniona twarda kwalifikacja, nierozwiązany konflikt. |
| `SKIP` | Zweryfikowana dyskwalifikacja, ujemna / nieużyteczna wartość, nieakceptowalny koszt lub ryzyko, albo lepsza zweryfikowana alternatywa przeważa w tym samym horyzoncie. | Wystarczająca pewność negatywnego powodu. Overall może być `MEDIUM`; `LOW` jest dozwolone tylko, gdy pojedynczy negatywny blocker jest bezpośrednio i oficjalnie potwierdzony. | Brak danych sam w sobie nie uzasadnia `SKIP`; wtedy używamy `NOT ENOUGH DATA`. |
| `NOT ENOUGH DATA` | Brakuje krytycznego faktu lub założenia, źródła są sprzeczne / nieaktualne, edycja jest niepewna albo różne rozsądne interpretacje zmieniają decyzję. | Zwykle `LOW`; lista braków jest obowiązkowa. | Nie ma CTA sugerującego pozytywną rekomendację; można linkować wyłącznie do źródeł lub statusu weryfikacji. |

### 7.3. Blokery pozytywnego Verdict

`TAKE NOW` i `TAKE IF` są niedozwolone, gdy zachodzi co najmniej jeden z warunków:

- oferta nie ma statusu `active` lub potwierdzonego `closing` z czasem na bezpieczne wykonanie;
- edycja albo regulamin są niepewne;
- krytyczna wartość, kwalifikacja, koszt, termin, wypłata lub failure point nie ma wystarczającego źródła;
- `North Confidence` wynosi `LOW`;
- użytkownik jest niekwalifikowany albo nie podał założenia mogącego zmienić kwalifikację;
- użyteczność materialnego składnika jest nieznana;
- net scenario value nie przewyższa `do nothing` w sposób istotny dla użytkownika;
- porównywalna, zweryfikowana alternatywa ma lepszy wynik bez kompensującej przewagi;
- konflikt źródeł może zmienić wniosek;
- pozytywny wynik zależy od afiliacji.

### 7.4. Alternatywa i „do nothing”

`do nothing` jest zawsze obecne i w tym samym horyzoncie ma:

- reward = 0;
- direct cost = 0;
- effort = minimalny;
- brak nowego failure risk i exit friction;
- zachowany kapitał, wynagrodzenie i możliwość użycia ich gdzie indziej.

To nie oznacza automatycznie zerowego opportunity cost; jeśli użytkownik traci realną, zweryfikowaną alternatywę przez brak działania, opisujemy ją osobno.

Alternatywa musi mieć ten sam istotny cel, horyzont i ograniczenia użytkownika. Jeśli nie ma kompletnej analizy alternatywy, North może powiedzieć „oferta ma dodatnią wartość dla tego scenariusza”, ale nie „to najlepszy wybór”. Brak linku partnerskiego nie wyklucza alternatywy.

### 7.5. `WAIT`

`WAIT` nie istnieje w aktywnym enumie UI v0.6.1 i nie może być zwracany przez Decision Model v1. Gdy brakuje podstaw do działania, stosujemy `NOT ENOUGH DATA`; gdy działanie jest wyraźnie niekorzystne, `SKIP`. Nie prognozujemy, że przyszła edycja będzie lepsza.

## 8. Pierwsze trzy oferty — specyfikacje przypadków

Wartości poniżej definiują strukturę testu. Wszystkie aktualne nazwy edycji, kwoty, terminy i warunki pozostają `null` / `under_verification`, dopóki nie przejdą ręcznego evidence review.

### 8.1. Bank Millennium

**Tożsamość robocza:**

```text
id: "millennium-bank-account-promotion"
slug: "bank-millennium-account-promotion"
provider: "Bank Millennium"
category: "bank_account"
title: "[oficjalna nazwa bieżącej promocji]"
status: "under_verification"
verifiedAt: null
edition: "[REVERIFY BEFORE IMPLEMENTATION]"
```

**Co testuje:** klasyczną premię bankową, w której wartość zależy od poprawnego wejścia, powtarzalnych działań, czasu aktywnego wykonywania i opóźnienia wypłaty. To test, czy North nie sprowadza prostej kwoty do „łatwego bonusu”, gdy obowiązki są rozłożone w czasie.

**Krytyczne pola:**

- identyfikator, daty i limit dostępności edycji;
- definicja nowego klienta i wszystkie okresy wcześniejszej relacji;
- wymagany kanał otwarcia i ewentualny kod / zgoda;
- definicja wpływu dochodu lub wynagrodzenia, minimalna kwota, źródła uznawane i wykluczone;
- wydatki / transakcje: próg, rytm, kwalifikowane i wykluczone operacje;
- liczba aktywnych miesięcy i konsekwencja pominięcia jednego miesiąca;
- składniki nagrody, ich niezależność, kolejność i warunki łączenia;
- termin oraz forma wypłaty każdego składnika;
- opłaty za konto / kartę i warunki uniknięcia;
- wcześniejsze zamknięcie, clawback, utrata przyszłych składników i bezpieczny moment wyjścia.

Wszystkie konkretne wartości tych pól: **REVERIFY BEFORE IMPLEMENTATION**.

**North Value:** pokazuje kwotę osiągalną dla liczby miesięcy, które użytkownik rzeczywiście chce wykonać, osobno koszty, effort i payout lag. Nie stosuje completion probability. Pominięcie miesiąca wpływa tylko na te składniki, które według regulaminu są od niego zależne.

**Możliwe Verdict:**

- `TAKE NOW` — tylko przy `HIGH` Confidence, pełnej kwalifikacji i akceptacji wszystkich działań;
- `TAKE IF` — naturalny stan, gdy wartość zależy od wpływu, wydatków lub utrzymania rytmu;
- `SKIP` — przy potwierdzonej dyskwalifikacji, kosztach / burden przewyższających wartość lub lepszej alternatywie;
- `NOT ENOUGH DATA` — gdy nie można powiązać edycji, działania lub wypłaty ze źródłem.

### 8.2. Nest Bank

**Tożsamość robocza:**

```text
id: "nest-bank-account-promotion"
slug: "nest-bank-account-promotion"
provider: "Nest Bank"
category: "bank_account"
title: "[oficjalna nazwa bieżącej promocji]"
status: "under_verification"
verifiedAt: null
edition: "[REVERIFY BEFORE IMPLEMENTATION]"
```

**Co testuje:** różnicę między reklamowanym maksimum a wartością zależną od faktycznych kwalifikowanych wydatków, warunków dodatkowych i długiego horyzontu.

**Formuła scenariusza:**

```text
componentValue(month)
  = jeśli warunki komponentu są spełnione:
      min(qualifiedSpend(month) × verifiedRewardRate, verifiedMonthlyCap)
    w przeciwnym razie:
      0

likelyGrossValue(horizon)
  = suma componentValue(month)
    + suma innych osiągalnych składników stałych
    dla miesięcy w wybranym horyzoncie
```

Jeśli aktualna edycja używa progów lub kwot stałych zamiast stawki, `componentValue` przyjmuje odpowiednią funkcję schodkową. `verifiedRewardRate`, `verifiedMonthlyCap`, kwalifikowane kategorie, inne składniki i sposób łączenia są **REVERIFY BEFORE IMPLEMENTATION**. Formuły nie wolno dopasować do marketingowej kwoty; ma wynikać z regulaminu.

**Trzy scenariusze dla landingu:**

- niskie wydatki: `qualifiedSpend` pochodzi z jawnego niskiego scenariusza; wynik pozostaje kwotą / zakresem, nie oceną użytkownika;
- bez chęci przeniesienia wynagrodzenia: zależny składnik = 0 albo cały scenariusz = `ineligible`, zależnie od potwierdzonej roli warunku;
- dobre dopasowanie: wydatki, wpływy i pełny horyzont spełniają potwierdzone reguły, więc wynik może zbliżyć się do `Conditional Max`.

**24-miesięczny commitment:** `24 miesiące` ma status **REVERIFY BEFORE IMPLEMENTATION**. Po potwierdzeniu model pokazuje:

- wartość w horyzoncie wybranym przez użytkownika, nie tylko pełne maksimum;
- liczbę powtarzalnych działań i payout cadence;
- utratę przyszłych składników po wcześniejszym zakończeniu;
- clawback lub brak clawbacku tylko ze źródłem;
- opportunity cost przeniesienia wynagrodzenia albo utrzymania produktu, jeśli istnieje porównywalna alternatywa;
- `flexibility` co najmniej `MEDIUM` lub `HIGH` friction według potwierdzonych zasad, bez automatycznej kary pieniężnej.

**Krytyczne pola:** parametry formuły, definicja kwalifikowanych wydatków i zwrotów, capy, wpływ wynagrodzenia, aktywne miesiące, warunki ciągłości, payout, opłaty, wcześniejsze wyjście oraz zależność między składnikami.

**Możliwe Verdict:** zwykle `TAKE IF`, ponieważ wynik zależy od wydatków, wpływu i horyzontu; `TAKE NOW` tylko dla pełnego, potwierdzonego scenariusza z `HIGH` Confidence; `SKIP` dla niekwalifikowanego lub niskowartościowego scenariusza; `NOT ENOUGH DATA` przy brakujących parametrach formuły.

### 8.3. Bank Pekao

**Tożsamość robocza:**

```text
id: "pekao-bank-account-promotion"
slug: "bank-pekao-account-promotion"
provider: "Bank Pekao"
category: "bank_account"
title: "[oficjalna nazwa bieżącej promocji]"
status: "under_verification"
verifiedAt: null
edition: "[REVERIFY BEFORE IMPLEMENTATION]"
```

**Co testuje:** ofertę, w której reklamowane maksimum może agregować różne formy nagrody, poziomy płynności, warunki i horyzonty. Model ma zapobiec przedstawieniu wartości nominalnej całego pakietu jako gotówki.

**Rozdzielenie składników:** każdy element ma osobny `rewardComponent` z:

- dokładną formą (`cash`, `cashback`, `voucher`, `points`, `interest`, `fee_waiver`, `asset` lub `other`);
- wartością nominalną albo formułą;
- warunkami i action IDs;
- możliwością łączenia z innymi elementami;
- ograniczeniami użycia, wygaśnięciem, transferowalnością i ekspozycją rynkową;
- `usableValueRule` dla scenariusza;
- dowodem dla konkretnej edycji.

Typy wyżej są możliwościami modelu, nie twierdzeniem o składzie aktualnej oferty Pekao. Faktyczne formy i liczby: **REVERIFY BEFORE IMPLEMENTATION**.

**Reguły prezentacji:**

- nagłówek może pokazać „do 2 700 zł” wyłącznie po potwierdzeniu kwoty i dodawalności składników — **REVERIFY BEFORE IMPLEMENTATION**;
- obok kwoty widnieje „reklamowane maksimum”, nigdy „2 700 zł gotówki”, jeśli choć jeden składnik nie jest gotówką;
- gotówka, cashback i ograniczone nagrody są rozpisane osobno;
- wartość nominalna ograniczonej nagrody nie staje się `expectedUsableValue` bez jawnego scenariusza użycia;
- składnik nieużyteczny dla użytkownika może mieć użyteczną wartość 0, ale pozostaje widoczny w `Advertised Max`;
- składnik o nieznanej użyteczności daje zakres lub `null`, nie arbitralny dyskont;
- `Conditional Max` grupuje elementy wymagające dodatkowego warunku, kapitału, produktu lub horyzontu, jeśli regulamin potwierdza taką strukturę.

**Usability / conditional value:**

```text
usableComponentValue
  = face value, jeśli składnik jest gotówką bez ograniczeń;
  = wartość scenariusza użycia, jeśli użytkownik może i chce wykorzystać ograniczoną nagrodę;
  = 0, jeśli ograniczenie wyklucza użycie w scenariuszu;
  = zakres lub null, jeśli użyteczność jest niepewna.
```

Nie stosujemy stałych mnożników typu „voucher = 80% gotówki” bez danych użytkownika lub osobno zatwierdzonej metodologii.

**Krytyczne pola:** reklamowane maksimum i jego arytmetyka; forma, wartość i warunki każdego składnika; łączność składników; wymagany produkt / kapitał; ograniczenia, wygaśnięcie i transferowalność; okres działań; payout; opłaty; safe exit; dowody na wszystkie twierdzenia z dema.

**Możliwe Verdict:** `TAKE IF` dla użytkownika akceptującego i wykorzystującego ograniczone składniki; `TAKE NOW` tylko jeśli istotna wartość jest płynna, warunki spełnione, a Confidence `HIGH`; `SKIP` gdy marketingowe maksimum ukrywa niską użyteczność lub nieakceptowalny koszt; `NOT ENOUGH DATA` przy niejasnym breakdownie albo niepotwierdzonej edycji.

## 9. Reverification register

Poniższe dane muszą być ponownie sprawdzone bezpośrednio przed implementacją danych, a następnie jeszcze raz przed publikacją:

### Dla wszystkich trzech ofert

- oficjalna nazwa, identyfikator, wersja i okres bieżącej edycji;
- status dostępności i wszystkie deadline’y wejścia / wykonania;
- `Advertised Max`, każdy składnik, reguły łączenia i forma wypłaty;
- definicja nowego klienta, lookback i prior relationship exclusions;
- geografia, wiek i inne twarde warunki kwalifikacji;
- wymagane wpływy / wynagrodzenie, wydatki, transakcje i kapitał;
- actions, cadence, active months i konsekwencje pominięcia;
- payout lag, kolejność wypłat i ewentualny clawback;
- tabela opłat, warunki ich uniknięcia i downstream costs;
- safe exit oraz wpływ wcześniejszego zamknięcia;
- oficjalne URL-e, dokładne punkty regulaminu, daty dostępu i `recheckBy`;
- dostępność afiliacji i poprawne disclosure;
- każda alternatywa użyta do porównania.

### Liczby i warunki nazwane w tej specyfikacji

- Pekao `2 700 zł`, pełny breakdown, dodawalność i użyteczność wszystkich składników — **REVERIFY BEFORE IMPLEMENTATION**;
- Nest `24 miesiące`, zakres obowiązywania, continuity, wcześniejsze wyjście i clawback — **REVERIFY BEFORE IMPLEMENTATION**;
- rola przeniesienia wynagrodzenia w scenariuszu Nest — warunek całej promocji czy wybranych składników — **REVERIFY BEFORE IMPLEMENTATION**;
- wszystkie parametry formuły Nest: stawka / progi, cap, kwalifikowane wydatki, aktywne miesiące i dodatkowe składniki — **REVERIFY BEFORE IMPLEMENTATION**;
- wszystkie miesięczne obowiązki i terminy wypłat Millennium — **REVERIFY BEFORE IMPLEMENTATION**.

Do czasu zamknięcia ledgerów rekordy pozostają `under_verification`, `verifiedAt` pozostaje `null`, a landing może używać wyłącznie stanu `structure_only`.

## 10. Kryteria akceptacji specyfikowanej implementacji

### Spójność produktu

- Hero komunikuje decyzję dla scenariusza, nie ranking ani Score.
- Pekao demo i strona Pekao korzystają z jednego rekordu edycji.
- Trzy scenariusze Nest używają jednej formuły i jawnie różnych inputów.
- Listing, Snapshot i Verdict nie duplikują ręcznie kwot ani statusów.
- Millennium, Nest i Pekao testują trzy różne problemy, a nie trzy kosmetyczne warianty tej samej karty.

### Zaufanie i metodologia

- Każde krytyczne pole ma źródło, dokładną referencję, `checkedAt` i notę niepewności, jeśli potrzebna.
- Widoczne są `verifiedAt`, edycja, status i North Confidence.
- Nie ma aktualnej liczby bez evidence ani placeholdera wyglądającego jak fakt.
- Link partnerski jest oznaczony i nie zmienia Verdict.
- `WAIT`, procentowy Match, completion probability i magiczny North Value nie są renderowane.

### Treść i decyzja

- `Advertised Max`, `Easy Floor` i `Your Likely Value` są jednoznacznie rozróżnione; `Conditional Max` pojawia się tylko z powodem.
- Nagrody inne niż gotówka nie są przedstawiane jako gotówka.
- Każdy Verdict ma powody, warunki, blokery oraz porównanie z `do nothing`.
- Pozytywny Verdict nie przechodzi bramy przy `LOW` Confidence lub brakującym krytycznym polu.
- `NOT ENOUGH DATA` wskazuje dokładnie, czego brakuje.

### Responsywność i dostępność

- Kolejność mobile zachowuje tok: obietnica → dowód → scenariusz → decyzja → analizy.
- Wszystkie tabele mają wariant kart lub czytelną pionową prezentację na mobile.
- Stan, forma nagrody, ryzyko i Confidence nie są komunikowane wyłącznie kolorem.
- Scenariusze i FAQ działają klawiaturą i zachowują sens bez JavaScriptu.
- Linki, źródła, daty i założenia są dostępne bez hovera i tooltipa.

## 11. Relacja do obecnych komponentów

- Obecny Landing Hero 2.0 jest bazą wizualną, ale podgląd oparty na North Score wymaga zastąpienia przez Value + Confidence podczas implementacji Landing 2.1.
- Obecna strona Revolut pozostaje wzorcem kompozycji, nie wzorcem danych ani zatwierdzoną analizą.
- `North Snapshot` rozwija się z czterech ogólnych pól do wartości scenariuszowej, obowiązków, czasu i failure points.
- `North Verdict` otrzymuje cztery aktywne stany v0.6.1, bramy danych i obowiązkowe porównanie.
- `North Score` może pozostać późniejszym skrótem wtórnym, ale nie jest potrzebny do wdrożenia tej specyfikacji.

Roadmapa nie wymaga korekty: najpierw powstaje ta specyfikacja, następnie ręczne ledgery i trzy analizy Decision Model v1, a dopiero później ewentualny controlled crypto stretch case i automatyzacja evidence.
