# ProjectNorth — Evidence Review #1

**Zakres:** Bank Millennium, Nest Bank i Bank Pekao

**Stan źródeł sprawdzony:** 2026-08-16

**Kontrakt danych:** `decision-model-v1` z `LANDING_2_1_DECISION_MODEL_V1.md`

**Dane do implementacji:** [`frontend/data/decision-offers.json`](../frontend/data/decision-offers.json)

## 1. Wynik review

Evidence review zamyka etap `under_verification` dla bieżących edycji wszystkich trzech ofert. Oficjalne regulaminy, strony produktów i tabele opłat pozwalają przygotować listing, stronę oferty, Snapshot oraz formularze scenariusza. Nie pozwalają natomiast wydać jednego pozytywnego Verdict bez danych konkretnego użytkownika.

| Oferta | Bieżąca edycja | Wejście | Status oferty | North Confidence dla faktów | Brama implementacji |
| --- | --- | --- | --- | --- | --- |
| Bank Millennium | „Do 700 zł na Twoje przyjemności z kontem Millennium 360°”, regulamin od 1.04.2026 | do 27.10.2026 lub 300 000 kont | `active` | `HIGH` | `ready_for_implementation` |
| Nest Bank | „Zyskaj do 1250 zł premii z Nest Kontem” | 1.04–30.09.2026; możliwy wcześniejszy koniec po komunikacie | `active` | `MEDIUM` | `ready_for_implementation` |
| Bank Pekao | kompozyt „Otwórz konto online i ruszaj po więcej – edycja II” + „Promocja Podróżna” | wspólne okno 16.07–31.08.2026; część podróżna także do wyczerpania 65 500 kont | `active` | `HIGH` | `ready_for_implementation` |

`North Confidence` w tabeli dotyczy faktów o ofercie. Confidence konkretnej decyzji może być niższe, jeśli brakuje danych użytkownika. Nest ma `MEDIUM`, ponieważ dynamiczny kurs Nest Kantoru nie pozwala z góry uznać całych 50 zł premii za wymianę EUR za wartość użyteczną. Rdzeń cashbacku i dwa scenariusze bez wymiany EUR mają `HIGH`.

Nie zaktualizowano `ROADMAP.md`: research nie zmienia core v0.6.1 ani kolejności prac.

## 2. Bank Millennium

### Edycja i status

- Oficjalna nazwa: „Do 700 zł na Twoje przyjemności z kontem Millennium 360°”.
- Regulamin obowiązuje od 1.04.2026.
- Nabór trwa do 27.10.2026 albo wcześniejszego osiągnięcia limitu 300 000 kont.
- Na dzień review oficjalna strona nadal prezentuje edycję i aktywny proces otwarcia.

### Kwalifikacja

- Uczestnik jest pełnoletnią osobą fizyczną z pełną zdolnością do czynności prawnych, polskim obywatelstwem, PESEL, polskim dowodem, polskim numerem telefonu i nie jest pracownikiem banku.
- Nie mógł posiadać osobistego rachunku oszczędnościowo-rozliczeniowego w Banku Millennium od 1.01.2022 do dnia przystąpienia.
- PESEL nie może być zastrzeżony w procesie otwierania.
- Przy otwarciu wymagane są zgody na komunikację marketingową/handlową wskazane w pkt 3 oraz Konto Millennium 360° z kartą.
- Dozwolone są ścieżki z regulaminu: procesy zdalne, wskazane procesy dla obecnego klienta i techniczny fallback w placówce.

### Wartość i wykonanie

| Składnik | Wartość | Warunki |
| --- | ---: | --- |
| Premia I | 200 zł cash | W 14 dni: wpływy 1 500 zł dla wieku 18–25 albo 3 000 zł dla 26+, pięć płatności portfelem mobilnym w sklepach stacjonarnych i rejestracja numeru do przelewów BLIK. |
| Premia II | 500 zł cash | W każdym z pięciu miesięcy po miesiącu otwarcia: taki sam próg wpływu, co najmniej 1 000 zł kwalifikowanych płatności i utrzymany numer do przelewów BLIK. |

Oba składniki łączą się do 700 zł. Premia II jest modelowana jako `all-or-nothing`: regulamin wymaga kompletu działań „w każdym z 5 miesięcy” i nie przewiduje częściowej wypłaty za pojedyncze miesiące. Pominięcie jednego miesiąca blokuje całe 500 zł.

`easyFloor` wynosi 200 zł wyłącznie dla jawnego scenariusza użytkownika, który spełnia warunki 14-dniowe i utrzyma konto oraz zgody do wypłaty. Nie jest obietnicą łatwej ani gwarantowanej nagrody.

Premie są wypłacane na Konto Millennium 360°. Regulamin podaje terminy zależne od miesiąca otwarcia. Przykładowo dla otwarcia w sierpniu 2026: Premia I do 30.09.2026, Premia II do 28.02.2027.

### Koszty i wyjście

- Otwarcie i prowadzenie rachunku: 0 zł bez warunku.
- Karta/płatności zbliżeniowe BLIK po dwóch pierwszych miesiącach: 0 zł po wymaganej aktywności; w przeciwnym razie 5 zł miesięcznie dla wieku 18–26 albo 11 zł dla osób powyżej 26 lat.
- Zamknięcie konta lub wycofanie wymaganych zgód przed wypłatą blokuje niewypłaconą premię.
- Standardowe wypowiedzenie konta trwa miesiąc; oficjalne FAQ wskazuje Millenet, infolinię, oddział i drogę listowną.
- Regulamin nie zawiera afirmatywnej klauzuli `no clawback`. Nie opisuje zwrotu prawidłowo wypłaconej premii, ale North nie zamienia braku klauzuli w gwarancję banku.

### Brak / konflikt

Pkt 4 najpierw dzieli uczestników na 18–25 i 26+, ale nagłówek dalszej tabeli używa zwrotu „powyżej 26 lat”. Model stosuje jednoznaczne wprowadzenie do pkt 4, czyli 26+. Interfejs nie może ukryć tej rozbieżności użytkownikowi mającemu dokładnie 26 lat.

Status puli 300 000 kont wymaga ponownego sprawdzenia przed publikacją lub aktywnym CTA.

### Verdict case

- Scenariusz 30 lat, wpływ 3 000 zł, wydatki 1 000 zł miesięcznie, komplet działań: `TAKE IF`.
- Warunki Verdict: naturalne spełnianie progów, akceptacja zgód i ryzyka utraty całych 500 zł po jednym błędzie.
- Rekord bez danych użytkownika: `NOT ENOUGH DATA`.

## 3. Nest Bank

### Edycja i status

- Oficjalna nazwa: „Zyskaj do 1250 zł premii z Nest Kontem”.
- Nabór: 1.04–30.09.2026.
- Bank może zakończyć nabór wcześniej, publikując informację co najmniej siedem dni wcześniej; dotychczasowi uczestnicy zachowują prawa.
- Na dzień review oficjalna strona prezentuje tę edycję jako bieżącą.

### Kwalifikacja

- Uczestnik ma co najmniej 18 lat, mieszka w Polsce, działa jako konsument i ma pełną zdolność do czynności prawnych.
- Nie posiadał Nest Konta od 1.01.2021.
- Składa wniosek kwalifikowaną ścieżką, wybiera udział w promocji tam, gdzie wymaga tego formularz, utrzymuje zgodę marketingową na wszystkie kanały i zawiera umowę ramową w 14 dni.
- Wpływ wynagrodzenia jest warunkiem składnika cashback, a nie całej promocji ani osobnej premii EUR.

Kwalifikowany wpływ to 1 500 zł dla wieku 18–25 albo 3 000 zł powyżej 25 lat. Regulamin definiuje źródła: m.in. wskazane stosunki zatrudnienia, emeryturę/rentę, stypendium i świadczenia rodzinne. Odbiorcą musi być posiadacz, tytuł musi wskazywać wynagrodzenie/świadczenie, a nadawca nie może być jednocześnie odbiorcą.

### Wartość i audytowalna formuła

| Składnik | Wartość | Warunki |
| --- | ---: | --- |
| Zwrot za transakcje | do 1 200 zł cash | 2% kwalifikowanych płatności kartą/BLIK, maks. 50 zł miesięcznie przez 24 kolejne miesiące; w każdym miesiącu wymagany wpływ wynagrodzenia, wszystkie kanały zgody i co najmniej jedna płatność. |
| Premia EUR | 50 zł cash | Nest Konto Waluta EUR oraz kupno lub sprzedaż łącznie minimum 100 EUR w Nest Kantorze w 30 dni od otwarcia, przy utrzymanej zgodzie. |

```text
cashback_m = jeśli salary_m AND consent_m AND eligibleSpend_m > 0
             wtedy min(2% × eligibleSpend_m, 50 zł)
             inaczej 0 zł

cashback = suma cashback_m dla m = 1..24, maks. 1 200 zł
fxBonus  = 50 zł, jeśli EUR account AND exchangeWithin30Days >= 100 EUR AND consent
total    = cashback + fxBonus, maks. 1 250 zł
```

Pierwszy kwalifikowany miesiąc musi wystąpić najpóźniej do końca drugiego pełnego miesiąca po otwarciu. Jeśli nie, prawo do całego cashbacku przepada. Późniejszy pominięty miesiąc daje 0 zł, nadal zajmuje miejsce w 24-miesięcznym okresie i nie przesuwa jego końca. Wypłata następuje do ostatniego dnia miesiąca po miesiącu spełnienia warunków.

Kwalifikowane są zakupy towarów/usług kartą lub BLIK stacjonarnie i online, w tym płatność powtarzalna BLIK. Wyłączone są m.in. gotówka, zwroty, money transfer i zasilenia wskazanych usług finansowych, hazard oraz przelew BLIK na telefon.

### Trzy scenariusze demonstracyjne

To jawne przykłady wejściowe, nie „typowi klienci”.

| Scenariusz | Jawne założenia | Wynik formuły | Verdict przykładu |
| --- | --- | ---: | --- |
| A. Niskie kwalifikowane wydatki | 500 zł miesięcznie, wpływ i zgody w każdym z 24 miesięcy, bez wymiany EUR | 24 × 10 zł = 240 zł | `TAKE IF` — głównie jeśli konto i wpływ są potrzebne niezależnie od promocji |
| B. Brak chęci przeniesienia wynagrodzenia | 2 500 zł wydatków, brak kwalifikowanego wpływu, brak wymiany EUR | 0 zł | `SKIP` — twardy warunek głównego składnika nie jest spełniony |
| C. Dobre dopasowanie | 2 500 zł miesięcznie, wpływ i zgody przez 24 miesiące, wymiana 100 EUR w terminie | 1 200 zł cashback + 50 zł nominalnej premii EUR | `TAKE IF` — przy akceptacji 24 miesięcy; użyteczne 1 200–1 250 zł zależnie od kosztu kursowego |

### Koszty i wyjście

- Otwarcie i prowadzenie Nest Konta: 0 zł.
- Wydanie i obsługa pierwszej karty plastikowej albo karty wirtualnej: 0 zł bez warunku.
- Płatne usługi dodatkowe, np. przelew natychmiastowy lub wypłata z wybranego obcego bankomatu, nie są konieczne do promocji.
- Koszt premii EUR nie jest stałą opłatą: dynamiczny kurs/spread trzeba porównać w chwili wymiany. Dlatego pełne 50 zł nie jest automatycznie `expectedUsableValue`.
- Wypowiedzenie/rezygnacja wyklucza z promocji i kończy przyszłe wypłaty. Regulamin rachunku przewiduje miesięczny okres wypowiedzenia albo uzgodniony dzień.
- Brak afirmatywnej klauzuli `no clawback`; regulamin opisuje utratę przyszłych praw, nie zwrot prawidłowo wypłaconych premii.

### Brak / konflikt

Nie ma konfliktu w stawce, capie, horyzoncie ani definicji wpływu. Otwarte pozostaje dynamiczne porównanie kursu Nest Kantoru dla składnika 50 zł. Przed CTA trzeba też sprawdzić, czy bank nie ogłosił wcześniejszego końca naboru.

Rekord bez danych użytkownika ma `NOT ENOUGH DATA`.

## 4. Bank Pekao

### Edycja i status

Pekao nie ma jednej promocji „2 700 zł”. Aktualny przypadek jest kompozytem dwóch osobnych, oficjalnie łączących się promocji:

1. „Otwórz konto online i ruszaj po więcej – edycja II”: do 300 zł, nabór 16.07–31.08.2026.
2. „Promocja Podróżna”: nagrody do 2 400 zł, nabór 1.06–31.08.2026 albo do wyczerpania 65 500 kont.

Wspólne okno wejścia dla sumy 2 700 zł to 16.07–31.08.2026. Oba regulaminy wprost dopuszczają ich łączenie.

### Kwalifikacja kompozytu

Użytkownik musi spełnić przecięcie kryteriów obu regulaminów, a nie łagodniejszy zestaw jednej promocji:

- co najmniej 18 lat, konsument, pełna zdolność, mieszkanie w Polsce; edycja II wymaga polskiego dowodu;
- brak posiadania/współposiadania konta od 1.06.2024 do 15.07.2026;
- brak jakiejkolwiek umowy o produkt lub usługę Pekao od 1.06.2024 do 31.05.2026;
- brak produktu kredytowego w dniu wejścia do edycji II;
- indywidualne Konto Przekorzystne ze złotą kartą, Pekao24/PeoPay, wymagane oświadczenia i kwalifikowana ścieżka otwarcia.

### Breakdown 2 700 zł

| Składnik | Forma | Nominał | Co jest potrzebne |
| --- | --- | ---: | --- |
| Nagroda I | przelew pieniężny | 100 zł | Kwalifikowane otwarcie konta z kartą i Pekao24/PeoPay oraz logowanie w dniu wejścia. |
| Nagroda II | przelew pieniężny | 100 zł | Co najmniej pięć kwalifikowanych płatności kartą w pierwszym miesiącu po otwarciu. |
| Nagroda III | przelew pieniężny | 100 zł | Co najmniej pięć kwalifikowanych płatności kartą w drugim miesiącu po otwarciu. |
| Promocja Podróżna | warunkowe nagrody pieniężne po wykorzystaniu wirtualnego salda | do 2 400 zł | Budowanie salda przez 12 miesięcy, potem kwalifikowane wydatki podróżne; saldo samo nie jest pieniądzem. |

Nagrody II i III są od siebie niezależne. BLIK nie liczy się do pięciu transakcji w promocji 300 zł.

### Mechanika i użyteczność części podróżnej

- Pierwsze 20 kwalifikowanych transakcji w miesiącu nalicza 3%, z capem 100 zł dla tej części.
- Od 21. transakcji naliczane jest 6%.
- Łączny miesięczny cap wirtualnego salda wynosi 200 zł, a cap 12-miesięczny 2 400 zł.
- Wirtualne saldo ma wyłącznie charakter informacyjny, nie jest pieniądzem i nie ma samodzielnego ekwiwalentu.
- Bank wypłaca nagrodę równą 20% kwalifikowanego wydatku podróżnego, ale nie więcej niż dostępne saldo i 2 000 zł na jedną wypłatę.
- Kwalifikowane wydatki podróżne obejmują paliwo, wskazane bilety lotnicze, kolejowe i autokarowe oraz wycieczki w biurach/agencjach. Komunikacja miejska jest wyłączona.
- Nagroda podróżna trafia najpóźniej następnego dnia roboczego na Skarbonkę, jeśli istnieje, albo na konto.
- Naliczanie trwa 12 miesięcy. Saldo można wykorzystać jeszcze przez dwa miesiące, potem jest zerowane.

Pełne 2 400 zł wymaga dostępnego salda oraz co najmniej 12 000 zł kwalifikowanych wydatków podróżnych przy stawce wypłaty 20%. To dolna granica arytmetyczna, nie opis „typowego” klienta. Ta sama transakcja podróżna może najpierw powiększyć saldo, a następnie uruchomić wypłatę, zgodnie z przykładem regulaminowym.

### Koszty i wyjście

- Konto Przekorzystne i wydanie standardowej złotej karty: 0 zł.
- Dla nowej złotej karty klienta 26+: 9 zł miesięcznie albo 0 zł, jeśli w poprzednim miesiącu był kwalifikowany wpływ minimum 1 000 zł, pięć płatności złotą kartą i utrzymane zgody. Dla osób poniżej 26 lat obsługa wynosi 0 zł.
- Wpływ 1 000 zł nie jest warunkiem nagrody; jest warunkiem uniknięcia opłaty za złotą kartę.
- Wcześniejsze zamknięcie blokuje niewypłacone nagrody 100-złotowe i kończy udział w części podróżnej. Niewykorzystane saldo wymaga utrzymania konta także w dwumiesięcznym oknie realizacji.
- Standardowy okres wypowiedzenia rachunku wynosi miesiąc.
- Brak afirmatywnej klauzuli `no clawback`; brak opisanej podstawy do odzyskania prawidłowo wypłaconej nagrody nie jest prezentowany jako gwarancja.

### Landing i Verdict

Pekao Landing Demo ma status `verified`, ale wyłącznie dla konstrukcji:

> Do 2 700 zł łącznie = 300 zł przelewów + do 2 400 zł warunkowych nagród podróżnych.

Zakazane copy: „2 700 zł gotówki”, „odbierz 2 700 zł” bez breakdownu albo pokazanie salda portfela jako już zarobionych pieniędzy.

- Scenariusz tylko z częścią startową i dziesięcioma kwalifikowanymi płatnościami: 300 zł, `TAKE IF` po pełnym sprawdzeniu kwalifikacji.
- Scenariusz części podróżnej bez danych o miesięcznych transakcjach i planowanej podróży: `NOT ENOUGH DATA`.
- Rekord ogólny bez danych użytkownika: `NOT ENOUGH DATA`.

Przed publikacją trzeba ponownie sprawdzić termin 31.08.2026 i pulę 65 500 kont.

## 5. Evidence ledger i Confidence

Pełny ledger pól znajduje się przy każdym rekordzie w `frontend/data/decision-offers.json`. Każdy wpis ma `fieldPath`, `sourceId`, `sourceType`, dokładną sekcję/punkt, `checkedAt`, `supportLevel` i notę niepewności. Pokryte są co najmniej:

- edycja, okres i status;
- `advertisedMax`, każdy `rewardComponent`, łączenie i `easyFloor`;
- kwalifikacja, wpływ, wydatki i kapitał/obrót;
- działania, terminy, `activeMonths`, wypłata i failure points;
- opłaty bezpośrednie i możliwe do uniknięcia;
- wcześniejsze wyjście i clawback;
- fakty używane przez przykładowe North Value i Verdict.

| Czynnik | Millennium | Nest | Pekao |
| --- | --- | --- | --- |
| Source quality | `HIGH` | `HIGH` | `HIGH` |
| Completeness | `HIGH` | `MEDIUM` — dynamiczny koszt kursowy EUR | `HIGH` |
| Freshness | `HIGH` | `HIGH` | `HIGH` |
| Ambiguity | `MEDIUM` — wording wieku 26 | `MEDIUM` — wartość użyteczna EUR zależy od kursu | `MEDIUM` — kompozyt i wirtualne saldo wymagają jawnego breakdownu |
| Edition certainty | `HIGH` | `HIGH` | `HIGH` |
| Overall dla faktów | `HIGH` | `MEDIUM` | `HIGH` |

Nie ma krytycznego konfliktu blokującego implementację rekordów. Pozytywny Verdict pozostaje zablokowany bez scenariusza użytkownika. Dodatkowo:

- Millennium: użytkownik dokładnie 26-letni musi zobaczyć notę o wording conflict;
- Nest: Verdict zaliczający premię EUR wymaga aktualnego porównania kursu;
- Pekao: Verdict dla części podróżnej wymaga transakcji, salda i wydatków podróżnych użytkownika.

## 6. Zmiany względem Research Sprint #1

- Millennium: bieżąca edycja to 700 zł; potwierdzono dwa składniki, progi wieku, 14 dni, pięć miesięcy i skutek all-or-nothing dla Premii II.
- Nest: potwierdzono 1 250 zł, stawkę 2%, cap 50 zł miesięcznie, pełne 24 miesiące, brak pauzy po pominiętym miesiącu i osobne 50 zł za wymianę EUR. `24 miesiące` nie jest już placeholderem.
- Pekao: aktualne oficjalne źródła potwierdzają łączne maksimum 2 700 zł, ale jako sumę dwóch promocji. Poprzedni znacznik `REVERIFY BEFORE IMPLEMENTATION` dla liczby można zamknąć dla tej edycji. Liczby nie wolno przenosić do kolejnej edycji bez nowego review.
- Pekao 2 400 zł nie jest voucherem ani gotowym cash balance. To limit nagród pieniężnych dostępnych dopiero po wcześniejszym naliczeniu niepieniężnego salda i kwalifikowanych wydatkach podróżnych.
- Nie znaleziono powodu do zmiany trzech core cases ani scope v0.6.1.

## 7. Bramy Landing 2.1

| Brama | Status | Warunek utrzymania statusu |
| --- | --- | --- |
| `PEKAO DEMO` | `verified` | Pełny breakdown 300 + 2 400, jawne ograniczenie portfela i recheck edycji/puli przed wdrożeniem. |
| `NEST PERSONA DEMO` | `verified` | Zachowanie jawnych wejść 500/2 500 zł; żadnego określenia „typowy klient”; recheck edycji przed wdrożeniem. |
| Millennium opportunity | `ready_for_implementation` | Widoczny termin/pula, wording wieku 26 i pięciomiesięczny failure point. |
| Nest opportunity | `ready_for_implementation` | Widoczne 24 miesiące, component-only salary condition i zakres 1 200–1 250 zł przy nieznanym przyszłym kursie. |
| Pekao opportunity | `ready_for_implementation` | Brak copy „2 700 zł gotówki”; pełny mechanizm użyteczności i deadline 31.08.2026. |

Najbliższy wspólny `recheckBy`: **2026-08-23**. Recheck musi objąć status naboru, komunikaty o limitach, podmianę plików `latest`, strony produktów i tabele opłat. Po `validTo` rekord przechodzi na `expired`, jeśli nie ma nowej oficjalnej edycji.

## 8. Oficjalne źródła

### Bank Millennium

- [Regulamin promocji „Do 700 zł na Twoje przyjemności z kontem Millennium 360°”](https://www.bankmillennium.pl/delegate/managedfiles/66001/latest)
- [Oficjalna strona Konta Millennium 360°](https://www.bankmillennium.pl/klienci-indywidualni/konta-osobiste/konto-millennium-360)
- [Cennik usług – karty debetowe](https://www.bankmillennium.pl/delegate/managedfiles/25/latest)

### Nest Bank

- [Regulamin promocji „Zyskaj do 1250 zł premii z Nest Kontem”](https://nestbank.pl/assets/gen/regulamin-promocji-zyskaj-do-1250-zl-premii-z-nest-kontem.pdf)
- [Oficjalna strona Nest Konta](https://nestbank.pl/nest-konto/)
- [Dokument dotyczący opłat dla Nest Konta](https://nestbank.pl/assets/gen/57-57-01-dokument_dotyczacy_oplat_nest_konto.pdf)
- [Tabela opłat i prowizji – rachunki i karty](https://nestbank.pl/assets/gen/57-18-00-toip_ki.pdf)
- [Regulamin rachunków dla klientów indywidualnych](https://nestbank.pl/assets/gen/regulamin_rachunkow_ki.pdf)

### Bank Pekao

- [Regulamin „Otwórz konto online i ruszaj po więcej – edycja II”](https://www.pekao.com.pl/dam/ROOT-EXTERNAL/DOCS/Regulamin_promocji_Otworz_konto_online_i_ruszaj_po_wiecej.pdf)
- [Regulamin „Promocji Podróżnej”](https://www.pekao.com.pl/dam/ROOT-EXTERNAL/DOCS/Promocja_Podrozna_regulamin.pdf)
- [Oficjalna strona Konta Przekorzystnego](https://www.pekao.com.pl/konto)
- [Taryfa prowizji i opłat – rachunki w bieżącej ofercie](https://www.pekao.com.pl/dam/jcr%3Aeab0d421-5e06-4d39-a23a-a4b9a98e9c0c/Taryfa-prowizji-i-oplat-oferta-biezaca-od-1-11-2025.pdf)
- [Regulamin rachunków dla umów od 1.07.2026](https://www.pekao.com.pl/dam/jcr%3A951ed9bc-fb22-4382-978a-123e1ed977a2/Regulamin_Rachunkow_Bankowych_dla_umow_zawartych_od_1072026.pdf)
