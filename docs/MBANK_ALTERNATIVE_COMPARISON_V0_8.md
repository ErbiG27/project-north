# mBank Alternative Comparison — bounded UI prototype v0.8.0

> Status: Founder Review PASS 2026-08-25 · bounded UX density pass i skrócona rewalidacja ukończone · gotowy do kolejnego Founder Review · nie jest funkcją publiczną

## Cel i granice

Prototyp sprawdza, czy generyczny kontrakt Alternative Comparison potrafi przejść od sytuacji użytkownika do właściwego `Product Identity`, a dopiero później ocenić kwalifikację do jednej Promotion Edition. Pierwszą kontrolowaną rodziną jest mBank:

- eKonto możliwości 18–24;
- eKonto do usług;
- mKonto Intensive;
- konto wspólne jako `ownership mode` / potrzeba użytkownika, nie Promotion Variant.

Implementacja jest dostępna wyłącznie jako nieindeksowana trasa `frontend/prototypes/mbank-alternative-comparison.html`. Homepage, listing, `decision-offers.json`, sitemap i publiczne trasy 12 ofert nie zostały zmienione. Prototyp nie ma CTA afiliacyjnego, nie zapisuje odpowiedzi i nie jest produkcyjną rekomendacją.

## Kontrakt

Źródłem danych UI jest `frontend/data/mbank-alternative-comparison-v0.8.0.json`. Interpreter w `frontend/prototypes/mbank-alternative-comparison.mjs` nie rozpoznaje nazw ani ID produktów w logice decyzji. Product-specific różnice są deklaratywnymi regułami i overrides kontraktu.

Kontrakt utrzymuje kolejność:

```text
User Scenario
  → Product Identity
  → Product eligibility
  → Promotion eligibility
  → North decision
```

Guardy:

- brak numeric score 0–100;
- reklamowane maksimum nie może zastąpić Product Fit;
- `preferredProductId` może być `null`;
- jedna Promotion Edition obejmuje trzy Product Identities;
- linked savings ma relację `linked_not_summed`;
- brak Product eligibility blokuje Promotion eligibility;
- dane afiliacyjne nie wpływają na wybór, Match, Verdict, Confidence ani kolejność.

## Evidence użyte w bounded kontrakcie

Stan sprawdzony: 2026-08-24. Następny recheck: 2026-08-31.

- [Porównanie kont osobistych mBank](https://www.mbank.pl/indywidualny/konta/konta-osobiste/) — bank jawnie rozdziela konto 18–24, standard, premium i potrzebę konta wspólnego.
- [eKonto możliwości 18–24](https://www.mbank.pl/indywidualny/dla-mlodych/i-mozesz-wiecej/) — 0 zł za konto i kartę, segment 18–24, do 900 zł w bieżącej edycji.
- [eKonto do usług](https://www.mbank.pl/indywidualny/konta/konta-osobiste/ekonto-do-uslug/) — 0 zł za konto, karta 0 zł po 350 zł płatności miesięcznie, obsługa konta indywidualnego i wspólnego.
- [mKonto Intensive](https://www.mbank.pl/indywidualny/konta/konta-osobiste/mkonto-intensive/) — 49,50 zł miesięcznie bez zwolnienia; zwolnienie przy minimum 10 000 zł wpływów albo 100 000 zł kwalifikowanych aktywów; funkcje premium i podróżne.
- [Wspólne eKonto do usług](https://www.mbank.pl/indywidualny/konta/konta-osobiste/wspolne/) — osobna karta dla każdej osoby i próg 350 zł liczony dla każdej karty.
- [Wspólne mKonto Intensive](https://www.mbank.pl/indywidualny/konta/konta-osobiste/wspolne-mkonto-intensive/) — potwierdza wspólny ownership mode także dla produktu premium.
- [Regulamin Cała naprzód — edycja I](https://www.mbank.pl/pdf/promocje/konta/regulamin-promocji-cala-naprzod-zyskuj-z-kontem-w-mbanku-edycja-i.pdf) — jedna edycja dla trzech produktów; do 900 zł dla eKonta możliwości i do 1 000 zł dla pozostałych; progi wpływów 1 000 / 2 000 zł; 350 zł kartą; rachunek wspólny poza promocją; 5,3% / 5,5% na moje cele jako osobna wartość powiązana.

Krótki flow świadomie nie pyta o historię relacji od 01.01.2022, typ wpływu wynagrodzenia, metodę otwarcia ani comiesięczny wzrost oszczędności. Te czynniki trafiają do `unresolvedFactors`; dla rachunku indywidualnego Promotion eligibility pozostaje `CONDITIONAL`, a dla wspólnego `NOT ELIGIBLE`.

## Acceptance scenarios

| Scenariusz | Oczekiwany Product Identity | Wynik |
| --- | --- | --- |
| 22 lata / solo / zwykłe użycie | eKonto możliwości | PASS |
| 30 lat / standard / bez premium | eKonto do usług | PASS |
| premium-qualified traveler | mKonto Intensive | PASS |
| shared finances | eKonto do usług; promocja `NOT ELIGIBLE` | PASS |

Scenariusz 22-letni zachowuje eKonto możliwości mimo maksymalnej premii niższej o 100 zł od standardu. To kontrolowany dowód, że wyższa premia nie wygrywa automatycznie z lepszym Product Fit.

## Bounded UX density pass

Founder Review zakończył się `PASS` z warunkiem małego density pass przed commitem. Zmiana nie naruszyła kontraktu ani ośmiu pytań:

- rekomendowany Product Identity jest pełną, rozwiniętą kartą z Product Fit, Product eligibility, kosztem, fee waiver, Promotion eligibility, możliwą wartością promocji, wartością funkcjonalną, effort, failure risk, Confidence i Verdict;
- dwie pozostałe Product Identities są natywnymi `details/summary`, domyślnie zamkniętymi i zachowującymi komplet danych po rozwinięciu;
- główne powody, trade-offs i unresolved factors pozostają widoczne przed szczegółami;
- evidence, źródła i granice metodologii są domyślnie zwinięte, bez ukrywania Confidence albo Verdict zwycięzcy;
- reset usuwa wynik, zamyka disclosure metodologii i przywraca fokus do pierwszego pola.

Wysokość sekcji wyniku w scenariuszu 22-letnim wyniosła 1 328 px przy zamkniętych szczegółach wobec 3 151 px po pełnym rozwinięciu na desktopie oraz 2 185 px wobec 5 526 px na mobile. Pierwsza warstwa jest więc odpowiednio o 58% i 60% krótsza od pełnego widoku wszystkich danych; to techniczny pomiar gęstości UI, nie metryka decyzji produktu.

## Walidacja techniczna po density pass

- Alternative Comparison validator: 4/4 acceptance PASS; `preferredProductId: null` PASS; affiliate neutrality PASS; higher-bonus guard PASS.
- Cztery scenariusze acceptance przeszły ponownie przez realny formularz; shared finances zachował eKonto do usług i `NOT ELIGIBLE` dla promocji Cała naprzód.
- Data Guard na 2026-08-25: `0 FAIL / 6 WARN / 17 OK` — istniejące warningi freshness na 31.08.2026, bez fail.
- Data Guard tests: 16/16 PASS.
- Istniejąca Match matrix: 50/50 PASS.
- Składnia JavaScript/MJS: 11/11 plików PASS.
- Desktop Edge 1440×900 i mobile Edge 390×844: PASS.
- Keyboard/basic accessibility: natywne disclosure myszą i klawiaturą, fokus po submit, fokus disclosure oraz fokus po reset PASS.
- DOM/accessibility: 1 `h1`, 0 duplikatów ID, 0 brakujących etykiet inputów, 0 zerwanych `aria-describedby`.
- Konsola i zasoby: 0 błędów/ostrzeżeń konsoli, 0 page errors, 0 failed requests, 0 odpowiedzi HTTP 4xx/5xx.
- Horizontal overflow: 0 px desktop i mobile.
- Regresja katalogu: lokalnie i publicznie po 12 kart, lokalnie i publicznie 12/12 tras HTTP 200, brak linku do prototypu z homepage i sitemap.

## Stan Git i publikacji

- Commit: zakres przygotowany w logicznym commicie `feat: add bounded mBank alternative comparison prototype`; dokładny SHA zapisuje historia Git.
- Push: nie wykonano.
- Deploy: nie wykonano.
- PR: nie otwarto.
- Publiczna produkcja: bez zmian; nadal release aplikacji `24c2d7c` z 12 ofertami.

## Founder Review

Founder zaakceptował model i prototyp z małym UX density pass przed commitem. Warunek został wykonany bez zmiany modelu. Kolejny review powinien potwierdzić przede wszystkim:

1. czy pełna karta zwycięzcy oraz zwinięte alternatywy tworzą właściwą hierarchię na mobile;
2. czy widoczne „Dlaczego” i „Na co uważać” wystarczają przed rozwinięciem evidence;
3. czy `CONDITIONAL` dla Promotion eligibility uczciwie komunikuje pominiętą karencję i typ wpływu;
4. czy wspólne finanse wymagają w następnym kroku osobnego pytania o wydatki każdej osoby, czy obecny unresolved factor wystarcza;
5. czy prototyp pozostaje odseparowany, czy można otworzyć osobny task dalszej walidacji lub integracji z publicznym flow.
