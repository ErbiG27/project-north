# ProjectNorth Handbook

> Wersja: 1.6 · Status: aktywny kontrakt produktu · Publiczny katalog: 12 ofert · Decision Model v1

## Cel dokumentacji

ProjectNorth jest produktem, który pomaga świadomie oceniać oferty, promocje i narzędzia finansowe. Ten katalog jest źródłem prawdy dla zasad produktu, decyzji i planu rozwoju. Kod pozostaje źródłem prawdy dla implementacji; dokumentacja opisuje intencję, standard i historię decyzji. Element opisany jako kierunek, specyfikacja lub plan nie jest funkcją produkcyjną.

## Wizja

North ma być wyjaśnialnym systemem podejmowania i realizowania decyzji dotyczących okazji finansowych. Nie jest katalogiem linków, stroną z promocjami ani „lepszym rankingiem”. Przekłada warunki oferty i sytuację użytkownika na jasną odpowiedź: **ile ta oferta jest dla niego warta, ile wymaga wysiłku i czasu, jakie ma koszty i opportunity cost, co może spowodować utratę nagrody, czy lepsza jest alternatywa lub brak działania oraz skąd pochodzi wniosek**.

## Misja

W kilka minut dać użytkownikowi kontekst potrzebny do podjęcia decyzji i jej bezpiecznego wykonania, bez ukrywania warunków, bez sztucznego pompowania atrakcyjności oferty i bez udawania pewności, której nie potwierdzają dane.

## Zasady produktu

1. **Najpierw decyzja, potem szczegóły.** Najważniejsza rekomendacja musi być czytelna bez studiowania regulaminu.
2. **Każdy komponent odpowiada na jedno pytanie użytkownika.** Jeśli nie odpowiada, nie powinien istnieć.
3. **Korzyści i ryzyka są równoważne.** Link partnerski nie może wpływać na ocenę ani copy.
4. **Kontekst jest ważniejszy od listy funkcji.** Oferta jest dobra wyłącznie dla określonej osoby i sytuacji.
5. **Aktualność jest częścią jakości.** Data weryfikacji i warunki mają być możliwe do sprawdzenia.
6. **Każdy sprint kończy się działającym, sprawdzonym efektem.** Pomysły bez właściciela i kryterium ukończenia nie trafiają do sprintu.
7. **Wartość jest scenariuszem, nie jedną liczbą.** Stosujemy trzy poziomy: reklamowane maksimum, łatwy rdzeń oraz prawdopodobną wartość dla założeń użytkownika lub maksimum warunkowe tam, gdzie ma zastosowanie.
8. **Brak działania jest prawidłową alternatywą.** Model afiliacyjny nie może wymuszać pozytywnego werdyktu ani ukrywać lepszej oferty bez linku partnerskiego.
9. **Wniosek musi mieć dowód.** Krytyczne pola prowadzą do źródła, regulaminu, daty weryfikacji oraz statusu pewności.

## Dla kogo

Początkowo dla polskojęzycznych osób porównujących konta, bonusy i inne niskiego ryzyka okazje finansowe. Najważniejsze grupy to początkujący, osoby aktywne online i podróżujące. Krypto nie wchodzi do pierwszego publicznego MVP. North nie obiecuje zysku; ułatwia ocenę warunków i może rekomendować rezygnację z działania.

## Marka i język

Marka jest spokojna, konkretna i niezależna. Czerń oraz grafit budują skupienie, a zielony akcent oznacza kierunek i pozytywną decyzję — nie presję sprzedażową. Copy powinno być proste, stanowcze i weryfikowalne. Unikamy: „najlepszy”, „gwarantowany”, „zarób”, jeśli nie są udowodnione i konieczne.

Główne etykiety mówią najpierw językiem użytkownika: „ile realnie możesz dostać”, „jak pewne są dane” i „czy oferta ma dla Ciebie sens”. Nazwy Decision Model mogą pozostać drugą warstwą dla transparentności. Glossary pomaga, ale nie może być wymagane do wykonania głównego flow. Pełny standard utrzymuje [North Writing Guide](NORTH_WRITING_GUIDE.md).

## Obecna architektura

```text
frontend/
├── index.html                  # Landing 2.1
├── offers/
│   ├── millennium.html         # Cienkie wejście do wspólnego renderera
│   ├── nest.html               # Cienkie wejście do wspólnego renderera
│   ├── pekao.html              # Cienkie wejście do wspólnego renderera
│   ├── [9 dalszych tras]        # Pozostałe publiczne oferty katalogowe
│   ├── offer.js                # Wspólny renderer Decision Model v1
│   ├── match.js                # Wspólny interpreter reguł scenariusza
│   └── kraken.html             # Validation-only, poza katalogiem
├── data/
│   ├── decision-offers.json    # Źródło faktów 12 ofert + Kraken validation-only
│   └── offers.js               # Cienki loader i formatowanie danych
├── script.js                   # Projekcje landingu, dem i listingu
├── glossary.js                 # Centralne definicje i dostępny popover
├── style.css                   # Punkt wejścia do modułowych arkuszy CSS
├── styles/pages/decision-model.css
├── assets/brand/               # Logo, sygnet i favicony North
├── sitemap.xml                 # Indeksowalne produkcyjne URL-e
├── robots.txt                  # Reguły crawlerów i adres sitemap
└── vercel.json                 # Minimalne nagłówki hostingu
```

Landing, listing i wszystkie strony analiz pobierają fakty z `decision-offers.json`. Osobne dokumenty HTML przechowują wyłącznie routing i metadane, a treść renderuje wspólny `offers/offer.js`. `script.js` odpowiada za katalog, wyszukiwanie i filtry, a `match.js` interpretuje scenariusze bez uzależnienia od nazw banków. `style.css` pozostaje jednym punktem wejścia dla modułowych arkuszy.

## Produkcja

Frontend jest publicznie dostępny pod `https://project-north-mu.vercel.app/`. Bieżąca aplikacja odpowiada release commitowi `24c2d7c5450b44ae07e12267f592b5898849bb54` i publikuje 12 kart katalogowych. Projekt Vercel wskazuje katalog `frontend/` i gałąź GitHub `main`; nie ma procesu budowania, backendu, sekretów ani zmiennych środowiskowych. Automatyczny deployment GitHub → Vercel działa. Manualny snapshot `frontend/` pozostaje wyłącznie historycznym fallbackiem. `docs/`, lokalne artefakty i pliki z root repo nie są częścią publikowanej strony.

Landing, metodologia, 12 ofert i Kraken mają własne trasy oraz metadane zgodne z opublikowanym katalogiem. Kraken pozostaje publicznym validation case'em z `LOW` Confidence i `NOT ENOUGH DATA`, poza kartami katalogowymi i bez publicznego CTA. Revolut Standard jest obecnie normalną analizą katalogową wartości funkcjonalnej bez ogólnej gwarantowanej premii bazowej; nie jest już legacy prototypem.

Brak dedykowanej grafiki social oznacza świadomy brak `og:image` i `twitter:image`. Structured data nadal nie mają uczciwej podstawy semantycznej. Analytics nie są częścią Deployment & Infrastructure #1.

## Model danych: bieżąca implementacja

`frontend/data/decision-offers.json` implementuje kontrakt `decision-model-v1`. Jeden rekord zasila listing, demo, Snapshot i stronę szczegółów:

```js
{
  identity,
  value,
  eligibility,
  execution,
  cost,
  decision,
  evidence,
  listing,
  affiliate
}
```

Fakty nie są kopiowane do `offers.js` ani stron HTML. Dwanaście rekordów katalogowych ma wykonywalne reguły Match odpowiednie do swoich mechanik; trzynasty rekord Kraken zachowuje kategorię `crypto_validation`. Model rozdziela `cash`, `cashback`, `voucher`, `physical_reward`, `interest`, `fee_waiver` i `functional`, obsługuje warianty i promocje powiązane bez automatycznego sumowania oraz modeluje yield jako funkcję salda, czasu i warunków. Evidence pozostaje procesem ręcznym.

## Model decyzji: aktywny kontrakt

- **North Value** opisuje wartość dla jawnego scenariusza użytkownika, uwzględniając formę nagrody, koszty, opportunity cost, czas, wysiłek i ryzyko niedowiezienia.
- **North Confidence** opisuje jakość, kompletność i aktualność danych oraz wniosku. Nie jest precyzyjnym procentem, dopóki nie ma danych uzasadniających taką skalę.
- **North Verdict** przyjmuje `TAKE NOW`, `TAKE IF`, `SKIP` albo `NOT ENOUGH DATA`. Stan oparty na prognozowaniu przyszłej edycji pozostaje wyłączony do czasu zbudowania historii porównywalnych edycji i backtestu.
- **North Match** pokazuje band `FIT`, `CONDITIONAL FIT`, `POOR FIT` albo `CANNOT ASSESS`, powody, warunki, blokery i dane wpływające na wynik. Nie jest procentem i nie zastępuje Verdict.
- **Evidence ledger** łączy krytyczne pola ze źródłem, regulaminem, datą weryfikacji i statusem pewności. W v0.6.1 proces jest ręczny dla małej liczby ofert; historia zmian edycji i automatyczne monitorowanie należą do późniejszych etapów.

## Kontrolowany pilot krypto: zamknięta walidacja

Pierwszy publiczny MVP pozostaje skoncentrowany na ofertach niskiego ryzyka. Krypto nie jest główną kategorią North. Podstawowy zakres v0.6.1 pozostaje bez zmian: Bank Millennium, Nest Bank i Bank Pekao.

Po walidacji core dopuszczono dokładnie jeden optional stretch case: Kraken referral wskazany w Research Sprint #1. Test zakończono z `LOW` Confidence i `NOT ENOUGH DATA`. Jest to kontrolowany hard case dla Decision Model v1, a nie nowy filar katalogu ani sygnał szerokiego otwarcia kategorii krypto.

Analiza musi jawnie pokazać reward uncertainty, market risk, `North Confidence`, user capital at risk i conditions required. Verdict może wynosić `TAKE IF`, `SKIP` albo `NOT ENOUGH DATA`; afiliacja lub referral nigdy nie są wystarczającą podstawą pozytywnego Verdict.

Kraken pozostaje dostępny jako validation-only bez publicznego referral CTA. Każda zmiana tego statusu wymaga ponownej weryfikacji warunków, ścieżki wejścia, zasad linkowania, ryzyka i Promotion Details.

## Standard pracy

Każdy sprint zawiera: cel, zakres, kryteria ukończenia, testy i aktualizację dokumentacji. Decyzje o trwałym wpływie wpisujemy do `DECISIONS.md`; zmiany widoczne dla użytkownika do `CHANGELOG.md`; nowe zadania do `ROADMAP.md` albo `PRODUCT_POLISH.md`.

Przed połączeniem zmian sprawdzamy desktop, 600 px, 900 px, klawiaturę, fokus, treść CTA, realność danych oraz linki. Gdy projekt trafi do Git, dokumentację zmieniamy w tym samym commicie co zmianę produktu.

## Mapa dokumentów

- [Roadmapa](ROADMAP.md) — kolejność i kryteria etapów.
- [Dziennik zmian](CHANGELOG.md) — wydania i istotne poprawki.
- [Decyzje](DECISIONS.md) — dlaczego wybrano dany kierunek.
- [System projektowy](DESIGN_SYSTEM.md) — tokeny i reguły interfejsu.
- [Product polish](PRODUCT_POLISH.md) — jakościowy backlog.
- [North Writing Guide](NORTH_WRITING_GUIDE.md) — trwały standard prostego copy.
- [AI Workflow](AI_WORKFLOW.md) — stałe reguły kolejnych zamkniętych tasków Work.
- [North State](NORTH_STATE.md) — master recovery document i bieżący etap operacyjny.
- [Historia projektu](PROJECT_HISTORY.md) — krótka historia decyzji i rund walidacji.
- [Komponenty](COMPONENTS/) — kontrakty kluczowych bloków UI.

## Zasada aktualizacji

Ten handbook utrzymuje trwały kontrakt produktu i architektury. Bieżący release, deadline'y i aktywne strumienie pracy należą do `NORTH_STATE.md`. Rzeczy niezaimplementowane muszą być oznaczone jako plan lub hipoteza.
