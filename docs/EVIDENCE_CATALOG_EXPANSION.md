# ProjectNorth — Evidence Reviews #2–#4 — Catalog Expansion

> Canonical implementation input · Founder-approved · release refresh 2026-08-24

Ten dokument porządkuje zatwierdzony pakiet Evidence Review #2–#4 dla pierwszego katalogu 12 produktów. Nie jest nowym discovery researchem. Dane krytyczne są odwzorowane w `frontend/data/decision-offers.json`; ten dokument zachowuje uzasadnienie implementacyjne, rozdział form wartości i guardy, których nie wolno zgubić przy kolejnej edycji.

## Zasady wspólne

- Affiliate commission, CPA/CPS, network bonus i acceptance data nie wpływają na North Value, Match, Confidence ani Verdict.
- Rekord bez krytycznych danych scenariusza ma `CANNOT ASSESS` oraz `NOT ENOUGH DATA`. `TAKE IF` nie jest stałym Verdict produktu.
- Warianty promocji nie sumują się automatycznie. Łączenie wymaga `stackability: confirmed`.
- Promocja powiązana nie jest częścią głównego `advertisedMax`.
- Voucher, nagroda rzeczowa i odsetki nie są gotówką. Wartość funkcjonalna nie dostaje arbitralnego score.
- Rekord po przekroczeniu `recheckBy` wymaga widocznego ostrzeżenia i ręcznej weryfikacji.

## Release freshness refresh — 24.08.2026

- Millennium: oficjalna strona i regulamin nadal pokazują 700 zł, nabór do 27.10.2026 albo do 300 000 kont. Strona nie pokazuje komunikatu o wyczerpaniu limitu. Konto Oszczędnościowe Profit nadal oferuje do 5,25% dla nowych środków do 200 000 zł przez 90 dni, z wejściem do 10.09.2026. Następny recheck: 2026-09-07.
- Nest: strona produktu i regulamin nadal pokazują 1 250 zł jako 1 200 zł cashbacku przez 24 kolejne miesiące oraz 50 zł za wymianę minimum 100 EUR. Nie znaleziono widocznego komunikatu o wcześniejszym zakończeniu naboru. Następny recheck: 2026-08-31.
- Pekao: oficjalna strona nadal prowadzi nabór do obu promocji do 31.08.2026, pokazuje 300 zł oraz do 2 400 zł nagród podróżnych i nadal podaje limit 65 500 kont bez komunikatu o jego wyczerpaniu. Landing gate pozostaje `verified` tylko dla pełnego breakdownu 300 + 2 400. Następny recheck: 2026-08-31.
- mBank: główna edycja do 1 000 zł przyjmuje zgłoszenia do 31.08.2026; osobny bonus mobilny 10 zł do 30.11.2026; osobna promocja Media Expert daje 200 zł w bonach i przyjmuje zgłoszenia do 31.08.2026 albo do limitu 2 000 rachunków. Wariantów nie sumuje się bez potwierdzonej łączności. Następny recheck rekordu: 2026-08-31.
- UniCredit: oficjalna strona promocji i regulamin potwierdzają 3 e-vouchery Żabka po 50 zł, nabór 18.08–10.09.2026 albo do 5 000 uczestników oraz progi 3 000 zł wpływu i 1 000 zł płatności dla drugiego i trzeciego bonu. `cashValueTotal` pozostaje 0 zł. Następny recheck: 2026-09-03.
- Kraken: oficjalne materiały nadal pozostają niespójne — generic page pokazuje do 20 EUR i 15 dni, wariant EEA losowe 10–75 EUR i 15 dni, a support stałe 20 w walucie domyślnej oraz 30 dni. Progi pozostają w Promotion Details. Rekord zachowuje `LOW`, `NOT ENOUGH DATA`, status validation-only i brak publicznego CTA. Następny recheck: 2026-08-31.

## Evidence Review #2 — Catalog Expansion Batch 1

**Data:** 2026-08-23. **Historyczny zakres:** Millennium 360°, Nest Konto, Pekao Konto Przekorzystne, Alior Konto 18–25, Erste Konto Smart i VeloKonto.

### Millennium 360°

- Edycja: „Do 700 zł na Twoje przyjemności z kontem Millennium 360°”, 1.04–27.10.2026 albo do 300 000 kont.
- Wartość: 200 zł + jedna niepodzielna premia 500 zł. Nie używać 900 ani 1 000 zł jako bieżącego maksimum konta indywidualnego.
- 200 zł: w 14 dni kwalifikowany wpływ, 5 płatności portfelem mobilnym w sklepach stacjonarnych i rejestracja numeru do przelewów BLIK.
- Próg wpływu: 1 500 zł dla 18–25 oraz 3 000 zł dla 27+. Dla wieku dokładnie 26 lat oficjalne sformułowania są niejednoznaczne: `CANNOT ASSESS / NOT ENOUGH DATA`.
- 500 zł: komplet warunków w każdym z pięciu pełnych miesięcy, w tym 1 000 zł kwalifikowanych płatności kartą/portfelem; BLIK nie zastępuje wydatków. Jeden błąd odbiera całe 500 zł.
- Konto 0 zł. Karta po okresie początkowym: dla 18–26 lat 5 zł bez aktywności, dla starszych 11 zł.
- Konto Oszczędnościowe Profit do 5,25%, 200 000 zł i 90 dni jest promocją powiązaną, nie częścią 700 zł.
- Confidence: MEDIUM z powodu wieku 26. Recheck: 2026-09-07.
- Źródła: [produkt](https://www.bankmillennium.pl/klienci-indywidualni/konta-osobiste/konto-millennium-360), [regulamin](https://www.bankmillennium.pl/delegate/managedfiles/66001/latest), [opłaty](https://www.bankmillennium.pl/delegate/managedfiles/25/latest), [Profit](https://www.bankmillennium.pl/klienci-indywidualni/produkty-oszczednosciowe/rachunki-oszczednosciowe/konto-oszczednosciowe-profit).

### Nest Konto

- Edycja: „Zyskaj do 1250 zł premii z Nest Kontem”, 1.04–30.09.2026; możliwy wcześniejszy koniec po siedmiodniowym komunikacie.
- Wartość: 1 200 zł cashbacku + 50 zł promocji walutowej. To 50 PLN, nie 50 EUR.
- Cashback: 2%, maks. 50 zł miesięcznie przez 24 kolejne miesiące. Pełny cap wymaga 2 500 zł wydatków miesięcznie, czyli 60 000 zł przez 24 miesiące.
- Wymagany wpływ musi spełniać regulaminową definicję wynagrodzenia/świadczenia: 1 500 zł dla 18–25 albo 3 000 zł dla 26+. Zwykły własny przelew nie wystarcza.
- Pominięty miesiąc daje 0 zł, zużywa miesiąc programu i nie tworzy miesiąca 25.
- Brak uczciwego uniwersalnego easy floor. Składnik 50 zł wymaga kupna lub sprzedaży łącznie minimum 100 EUR i ma dynamiczny koszt FX/spread.
- Konto oraz pierwsza karta fizyczna/wirtualna: 0 zł.
- Produkty oszczędnościowe 6,1% dla dorosłych i 6,6% dla młodych są osobnymi produktami, nie konfliktem i nie częścią 1 250 zł.
- Confidence: HIGH. Recheck: 2026-08-31.
- Źródła: [produkt](https://nestbank.pl/nest-konto/), [regulamin](https://nestbank.pl/assets/gen/regulamin-promocji-zyskaj-do-1250-zl-premii-z-nest-kontem.pdf), [dokument opłat](https://nestbank.pl/assets/gen/57-57-01-dokument_dotyczacy_oplat_nest_konto.pdf), [pełna tabela](https://nestbank.pl/assets/gen/57-18-00-toip_ki.pdf).

### Pekao Konto Przekorzystne

- Dwie potwierdzone promocje z wejściem do 31.08.2026: 300 zł cash oraz do 2 400 zł mechanizmu podróżnego.
- 300 zł: trzy niezależne składniki po 100 zł; łącznie 10 płatności kartą w dwóch miesiącach. BLIK nie liczy się. Easy floor: 100 zł.
- Mechanizm podróżny nie jest gotówką. Tworzy wirtualne saldo: 3% dla pierwszych 20 transakcji do 100 zł oraz 6% od transakcji 21, miesięcznie maks. 200 zł przez 12 miesięcy.
- Wypłata wynosi 20% kwalifikowanego wydatku podróżnego, do dostępnego salda. Pełne 2 400 zł wymaga minimum 12 000 zł kwalifikowanych wydatków podróżnych.
- Nagłówek może mówić „Łącznie do 2 700 zł wartości” tylko z natychmiastowym breakdownem 300 zł cash + do 2 400 zł mechanizmu podróżnego. Nigdy „2 700 zł gotówki”.
- Konto 0 zł; złota karta dla 26+ może kosztować 9 zł bez osobnych warunków zwolnienia.
- Oszczędności 5,7% są promocją powiązaną.
- Confidence: HIGH. Release recheck wykonany 2026-08-24; następny recheck: 2026-08-31.
- Źródła: [produkt](https://www.pekao.com.pl/konto), [300 zł](https://www.pekao.com.pl/dam/ROOT-EXTERNAL/DOCS/Regulamin_promocji_Otworz_konto_online_i_ruszaj_po_wiecej.pdf), [podróże](https://www.pekao.com.pl/dam/ROOT-EXTERNAL/DOCS/Promocja_Podrozna_regulamin.pdf), [opłaty](https://www.pekao.com.pl/dam/jcr%3Aeab0d421-5e06-4d39-a23a-a4b9a98e9c0c/Taryfa-prowizji-i-oplat-oferta-biezaca-od-1-11-2025.pdf).

### Alior Konto 18–25

- Segment 18–25, kod `BONUS500`, brak ROR PLN w Alior przez poprzednie 3 lata.
- 500 zł cash = 200 zł + 3 × 100 zł. Easy floor: 200 zł.
- Start: karta w portfelu cyfrowym i 3 płatności portfelem w 10 dni.
- Miesiące 1–3: 500 zł zewnętrznego wpływu, 10 płatności kartą w portfelu i logowanie do aplikacji. BLIK nie zastępuje płatności wymaganych promocją.
- Konto 0 zł; karta 7 zł bez 5 płatności kartą/BLIK.
- Oszczędności 6% do 50 000 zł przez 3 miesiące są osobną promocją powiązaną.
- Confidence: MEDIUM/HIGH. Recheck implementacyjny: 2026-09-03.
- Źródła: [produkt](https://www.aliorbank.pl/klienci-indywidualni/konta-osobiste/alior-konto-18-25-lat.html), [promocja](https://www.aliorbank.pl/dam/jcr%3A9320aad2-99e5-4e7d-964b-888dc2a2bea7/regulamin-sprzedazy-premiowej-mlodzi-zyskuja.pdf), [opłaty](https://www.aliorbank.pl/dam/jcr%3A2c557a27-9d52-4c66-8fb5-f2652658e43e/toip-konta-osobiste.pdf), [oszczędności](https://www.aliorbank.pl/dam/jcr%3Aeb1b3723-6abe-4c78-a626-d5208fb16fda/regulamin-promocji-konto-oszczednosciowe-na-start-10-edycja.pdf).

### Erste Konto Smart

- Produkt został objęty Batch 1. Historyczna tożsamość Santander → Erste została dodatkowo sprawdzona w Review #3, aby nie tworzyć dwóch kart dla tego samego produktu.
- Warianty 600 i 800 zł są wzajemnie wyłączne; nie sumują się do 1 400 zł.
- Szczegółowy follow-up identity i warunków znajduje się w sekcji Review #3 poniżej.

### VeloKonto

- VeloKonto było w zakresie Review #2, ale nie weszło do pierwszego publicznego katalogu 12 ofert.
- Nie należy mylić go z opublikowanym w Review #4 produktem VeloBank Elastyczne Konto Oszczędnościowe (`savings_account`).

## Evidence Review #3 — Catalog Expansion Batch 2 + Affiliate Bonus Research

**Zakres:** Revolut Standard, Santander → Erste identity change, mBank eKonto do usług, PKO Konto za Zero, BNP Konto Otwarte na Ciebie oraz oddzielna analiza wybranych affiliate bonus/source mechanics.

### Revolut Standard

- Plan 0 zł miesięcznie, bez stałej bazowej premii pieniężnej. Główna wartość jest funkcjonalna: konto wielowalutowe, SEPA, karty wirtualne, użycie podróżne i FX.
- Pierwsza karta ma cenę 0 zł, lecz standardowa dostawa to około 25,99 zł, ekspresowa około 85,99 zł.
- Bankomaty: 0 zł do 800 zł albo 5 wypłat miesięcznie; potem 2%, minimum 5 zł.
- FX: limit 5 000 zł miesięcznie przed dodatkową opłatą 1%; weekendowy narzut 1%. Nie gwarantować kursu międzybankowego bez spreadu.
- NBA 85 zł jest osobnym wariantem kanałowym po właściwym linku i pierwszej płatności minimum 85 zł; nie jest `advertisedMax` planu Standard.
- Confidence: HIGH. Recheck: 2026-09-30.
- Źródła: [opłaty](https://www.revolut.com/pl-PL/legal/standard-fees/), [karta](https://help.revolut.com/pl-PL/help/cards/card-order/fees-for-ordering-a-card/), [bankomaty](https://help.revolut.com/pl-PL/help/card-payments-withdrawals/atm-withdrawals/withdrawing-in-other-currencies/), [FX](https://help.revolut.com/pl-PL/help/wealth/exchanging-money/how-much-does-it-cost-to-make-an-exchange/will-i-be-charged-for-exchanging-foreign-currencies/), [NBA](https://www.revolut.com/pl-PL/legal/nba-welcome-bonus-promotion/).

### Santander → Erste identity change (follow-up)

- Santander Bank Polska zmienił nazwę na Erste Bank Polska 24.04.2026; Konto Santander jest teraz Kontem Smart. Santander nie jest osobną kartą produktu.
- Wariant A: do 600 zł = 4 × 100 zł + 200 zł all-or-nothing po komplecie czterech miesięcy.
- Wariant B: do 800 zł = 4 × 100 zł + 100/250/400 zł za ubezpieczenie samochodu. Maks. 400 zł wymaga składki minimum 1 701 zł.
- Warianty są wzajemnie wyłączne i nigdy nie sumują się do 1 400 zł. Easy floor: 100 zł.
- Miesiąc wymaga m.in. 2 000 zł wpływu, 10 płatności kartą/BLIK, celu oszczędnościowego i zewnętrznego przelewu online.
- Karencja obejmuje dawną relację z Santander: brak ROR PLN od 1.08.2024.
- Konto 6 zł i karta 9 zł bez właściwych warunków zwolnienia.
- Confidence: HIGH. Źródła: [tożsamość](https://media.erste.pl/informacje-prasowe/wierz-w-siebie-z-erste-bank-polska), [produkt](https://www.erste.pl/klient-indywidualny/konta/konto-smart).

### mBank eKonto do usług

- Główna promocja do 1 000 zł cash: 100 zł startu + 400 zł aktywności + 100 zł za sposób otwarcia + 300 zł za wynagrodzenie + 100 zł za konto dziecka.
- Easy floor: 100 zł po 2 000 zł wpływu w 7 dni, 350 zł wydatków kartą i 100 zł na celu oszczędnościowym.
- Pełny wariant trwa sześć miesięcy; minimum 2 100 zł wydatków kartą. BLIK nie zastępuje kartowego warunku promocji.
- Bonus mobilny 10 zł jest osobnym wariantem. Media Expert to osobny wariant: 1 000 zł cash + 200 zł voucherów. Nie pokazywać 1 210 zł jako jednej prostej premii.
- Oszczędności 5,3% do 50 000 zł przez 90 dni są powiązane, nie sumowane.
- Konto 0 zł; karta 9 zł bez 350 zł miesięcznego wydatku.
- Okna wejścia: główna promocja do 31.08.2026; bonus mobilny do 30.11.2026; Media Expert do 31.08.2026 albo do 2 000 rachunków.
- Confidence: HIGH dla rdzenia, MEDIUM dla stackability kanałów. Recheck: 2026-08-31.
- Źródła: [produkt](https://www.mbank.pl/indywidualny/konta/konta-osobiste/ekonto-do-uslug/), [główna promocja](https://www.mbank.pl/pdf/promocje/konta/regulamin-promocji-cala-naprzod-zyskuj-z-kontem-w-mbanku-edycja-i.pdf), [Media Expert](https://www.mbank.pl/pdf/promocje/konta/regulamin-promocji-zgarnij-nagrode-z-ekontem-do-uslug-edycja-ii.pdf), [mobile](https://www.mbank.pl/pdf/promocje/konta/regulamin-promocji-bonus-dla-mobilnych-edycja-iii.pdf).

### PKO Konto za Zero

- Konto 0 zł; karta 10 zł bez 5 płatności kartą/BLIK.
- Letni Bonus: 10% cashbacku do 100 zł miesięcznie przez 5 miesięcy + 100 zł za ukończenie, maks. 600 zł cash/cashback. Pełna część miesięczna wymaga 5 000 zł wydatków.
- Samsung: voucher/rabat do 600 zł, nie gotówka; najwyższy próg zwykle wymaga zakupu około 4 000 zł i ma sens tylko przy planowanym zakupie.
- Allegro Klik: 1–3% do 100 zł miesięcznie przez maks. 12 miesięcy. Poziom 3% wymaga 2 000 zł wpływu i dodatkowego produktu; pełne 1 200 zł odpowiada około 40 000 zł wydatków Allegro.
- Konto dziecka do 300 zł jest osobnym produktem/promocją powiązaną. Nie pokazywać 1 200 zł cash ani 1 500 zł dla jednego konta dorosłego.
- Confidence: HIGH dla składników, MEDIUM dla stackability. Recheck: 2026-09-15.
- Źródła: [produkt](https://www.pkobp.pl/klient-indywidualny/konta/konto-za-zero), [Letni Bonus](https://www.pkobp.pl/api/public/53a0cbb0-6070-41a9-bd1e-a521322f5293.pdf), [Samsung](https://www.pkobp.pl/api/default/c9016e68-14d5-4bc1-922b-6bb79832a58a.pdf), [promocje](https://www.pkobp.pl/klient-indywidualny/promocje).

### BNP Konto Otwarte na Ciebie

- Bieżący wariant: Podróżnik 1000, wejście do 13.09.2026 albo limitu uczestników; `shortLivedPromotion: true`.
- Maks. 1 000 zł = 12 × 75 zł + 100 zł za składnik oszczędnościowy. Easy floor: 75 zł za pierwszy kwalifikowany miesiąc.
- Każdy miesiąc: 1 000 zł wpływu, 7 transakcji kartą, logowanie GOmobile oraz wymagane zgody/ustawienia. Pełny horyzont to 84 transakcje.
- Oficjalna promocja użytkownika wymaga 24-miesięcznej karencji ROR. Afiliacyjne 12 miesięcy nie może jej zastąpić.
- Stara edycja Podróżnik 700 pozostaje oddzielona.
- Confidence: HIGH. Recheck: 2026-09-05.
- Źródła: [produkt](https://www.bnpparibas.pl/klienci-indywidualni/konta/promocja-podroznik-2), [regulamin](https://www.bnpparibas.pl/_fileserver/item/1552031), [edycja 2](https://www.bnpparibas.pl/_fileserver/item/1552032), [opłaty](https://www.bnpparibas.pl/_fileserver/item/1517762).

## Evidence Review #4 — Small Batch 3

**Zakres:** UniCredit Konto Osobiste, VeloBank Elastyczne Konto Oszczędnościowe i Alior Konto Plus. **Decyzja końcowa:** zakończyć szeroki catalog discovery i przejść do implementacji pierwszego kontrolowanego katalogu.

### UniCredit Konto Osobiste

- Pakiet Easy 0 zł. Promocja ma 150 zł nominału w formie 3 × 50 zł voucheru Żabka; `cashValueTotal: 0`, `nonCashValueTotal: 150`. Easy floor: 50 zł voucheru.
- Pełny nominał wymaga przez dwa miesiące po 3 000 zł zewnętrznego wpływu i 1 000 zł wydatków kartą, łącznie 2 000 zł wydatków.
- Wcześniejsza relacja z UniCredit/Aion wyklucza promocję.
- Wartość funkcjonalna: konto, pierwsze konto oszczędnościowe, pierwsza karta, Elixir, Express Elixir, SEPA i instant SEPA bez opłat banku; bankomat może doliczyć opłatę operatora. Wybrane pary UE, w tym EUR/PLN, bez marży banku, inne standardowe FX mogą mieć 0,5%.
- Oszczędności 4% do 100 000 zł przez 90 dni są promocją powiązaną i nie zwiększają 150 zł voucheru.
- Confidence: HIGH. Recheck: 2026-09-03.
- Źródła: [produkt](https://unicredit.pl/indywidualni/konto-osobiste), [Żabka](https://unicredit.pl/dam/jcr%3A2dc8108c-d0d5-4c82-a7d8-2884ea95a18e/regulamin-promocji-bonus-na-start%20-zabka.pdf), [oszczędności](https://unicredit.pl/promocje-dla-ciebie/zysk-na-start), [opłaty](https://unicredit.pl/dam/jcr%3Aa53ed3a0-ed8b-4930-bdbf-96ed602dcabd/Lista%20op%C5%82at%20i%20prowizji%20dla%20klientow%20detalicznych%20UniCredit.pdf).

### VeloBank Elastyczne Konto Oszczędnościowe

- Kategoria `savings_account`; „Nowe środki — edycja 10/2026”, wejście 6.08–16.09.2026.
- Nowy klient zdalny: 6% do 50 000 zł, następnie 4% do 400 000 zł; fallback 2%.
- Inny kwalifikowany klient: 4,5% do 200 000 zł, następnie 3% do 400 000 zł; fallback 1%.
- Okres 92 dni. W każdym miesiącu kalendarzowym, także krótkim pierwszym, wymagane jest 5 zakupowych płatności kartą/BLIK.
- Nowe środki są ustalane względem salda referencyjnego 14.06.2026 według pełnej definicji regulaminu; nie upraszczać do zwykłego przelewu.
- Brak stałego maksimum PLN. Stopa nie jest `faceValueTotal`.
- Referencje dla nowego klienta zdalnego i 6%/92 dni: 5 000 zł → około 75,62 zł brutto / 61,25 zł netto; 10 000 zł → 151,23 / 122,50 zł; 50 000 zł → 756,16 / 612,49 zł. Netto zakłada 19% podatku. Każda kwota jest przykładem dla wskazanego salda, nie gwarantowaną wartością.
- Konto 0 zł. Pierwsza zewnętrzna operacja miesięcznie 0 zł, kolejne kwalifikowane operacje 10 zł.
- Confidence: HIGH. Recheck: 2026-09-09.
- Źródła: [produkt](https://www.velobank.pl/klienci-indywidualni/oszczednosci/konto-oszczednosciowe.html), [promocja](https://www.velobank.pl/centralne_repozytorium_dokumentow/6CC28A9A30E5F464D1132A895097A0EBC0B12834E42B088D4E3D519B4780FE2B), [opłaty](https://www.velobank.pl/centralne_repozytorium_dokumentow/D89B8B1C845DDAC79BEC3DCB1AFF28F7A83588E38699CE4F0A6DD7094BF10701), [stawki standardowe](https://www.velobank.pl/centralne_repozytorium_dokumentow/560900CD2C68F03ED178BE645E523832DEC4B954476B8C4BCB168E23428E6B18).

### Alior Konto Plus

- Edycja 13.07–13.10.2026 albo do wyczerpania puli.
- Wartość: 800 zł cash + pierścień płatniczy wyceniany przez bank na 500 zł. `faceValueTotal: 1300`, `cashValueTotal: 800`, `nonCashValueTotal: 500`.
- Poprawne copy: „800 zł gotówki + pierścień wyceniany przez bank na 500 zł”. Nigdy „1 300 zł gotówki”.
- Cash: 200 zł + 200 zł + 4 × 100 zł. Easy floor: 200 zł.
- Pierścień: `physical_reward`, provider-advertised 500 zł, `cashEquivalent: false`, wartość musi oszacować użytkownik.
- Warunki promocji: 1 000 zł wpływu i 3 płatności kartą/BLIK. Dla kolejnych zdarzeń łącznie co najmniej 15 płatności.
- Zwolnienie z opłat dla 26+ jest osobne: 3 000 zł wpływu + 5 płatności. Bez zwolnienia konto 12 zł i karta 6 zł. Spełnienie promocji nie oznacza darmowego konta/karty.
- Oszczędności 6% do 50 000 zł przez 3 miesiące, 500 zł płatności miesięcznie i fallback 2% są promocją powiązaną.
- Confidence: HIGH dla wartości, MEDIUM dla Safe Exit i cross-promotion stackability. Recheck oszczędności: 2026-08-31; promocja główna: 2026-10-06.
- Źródła: [produkt](https://www.aliorbank.pl/klienci-indywidualni/konta-osobiste/alior-konto-plus.html), [promocja](https://www.aliorbank.pl/dam/jcr%3Aaf46bfca-1846-4be1-aa89-3fce817c0b56/regulamin-sprzedazy-premiowej-alior-konto-plus-z-premia.pdf), [oszczędności](https://www.aliorbank.pl/dam/jcr%3Aeb1b3723-6abe-4c78-a626-d5208fb16fda/regulamin-promocji-konto-oszczednosciowe-na-start-10-edycja.pdf), [opłaty](https://www.aliorbank.pl/dam/jcr%3Ac8aea0f7-6e70-4eea-a243-8f3a06f64eb9/oplaty-alior-konto-plus.pdf).

## Guard implementacyjny

- Katalog ma dokładnie 12 kart produktów; Santander jest aliasem Erste, a VeloKonto pozostaje poza zakresem.
- `cash`, `voucher`, `physical_reward`, `cashback`, `interest`, `fee_waiver` i `functional` pozostają rozdzielone.
- `promotionVariants[]` przechowuje własne źródła, daty, status, stackability i składniki; wariantów nie sumuje się bez potwierdzenia.
- `linkedPromotions[]` nie zwiększa głównego `advertisedMax`.
- `functionalValue` ma opis kosztu bazowego, funkcji, bankomatów, przelewów i FX, bez numeric score.
- `yieldOffer` przechowuje stopy, progi, czas, definicję nowych środków, datę referencyjną, aktywność, podatek i scenariusze kapitału. Stopa procentowa nigdy nie jest kwotą `faceValueTotal`.
- Wszystkie aktywne rekordy mają oficjalne źródła, `verifiedAt`, `recheckBy`, Confidence reasons i statyczny Verdict `NOT ENOUGH DATA`.

## Lokalne assety marek

Assety są przechowywane lokalnie w `frontend/assets/logos/`; frontend nie hotlinkuje plików banków. Nie zmieniono chronionych, nieśledzonych plików Millennium, Pekao ani Nest.

| Marka | Plik lokalny | Oficjalne źródło |
| --- | --- | --- |
| Alior Bank | `alior-bank.png` | nagłówek [aliorbank.pl](https://www.aliorbank.pl/) |
| Erste | `erste.png` | asset używany przez [erste.pl](https://www.erste.pl/) |
| Revolut | `revolut.svg` | oficjalny pakiet na stronie [Open Banking Logo Guidelines](https://developer.revolut.com/docs/resources/open-banking-logo-guidelines) |
| mBank | `mbank.jpg` | oficjalna [teczka prasowa mBanku](https://pl.media.mbank.pl/presskits/logotyp-mbanku) |
| PKO Bank Polski | `pko-bank-polski.svg` | asset używany na oficjalnej stronie [pkobp.pl](https://www.pkobp.pl/) |
| BNP Paribas | `bnp-paribas.png` | oficjalna [teczka prasowa BNP Paribas](https://media.bnpparibas.pl/teczka-prasowa/17768) |
| UniCredit | `unicredit.svg` | oficjalne [biuro prasowe UniCredit](https://unicredit.pl/media) |
| VeloBank | `velobank.svg` | asset używany przez [velobank.pl](https://www.velobank.pl/) |

Preferowany był SVG. PNG/JPG pozostawiono wyłącznie tam, gdzie oficjalne źródło udostępniało raster odpowiedniej jakości; pliki nie były odrysowywane ani konwertowane do pozornego SVG.
