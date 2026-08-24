# ProjectNorth — instrukcja dla agentów AI

Ten plik jest wspólnym entrypointem dla ChatGPT, Claude, Codex i innych agentów. Nie przechowuje pełnego kontekstu; kieruje do kanonicznego continuity pack.

## Cel produktu

ProjectNorth to polskojęzyczny **explainable decision system** dla okazji finansowych. Odpowiada na pytanie „Czy ta oferta ma sens dla konkretnego użytkownika?”, a nie „Która premia jest najwyższa?”.

North rozdziela North Value, North Confidence, North Match, North Verdict i Evidence. `Do Nothing` jest prawidłową alternatywą. `WAIT`, Match %, arbitralny EV i Score 0–100 jako rdzeń są wyłączone.

## Obowiązkowy start

1. Wykonaj repo guard:

   ```powershell
   pwd
   git rev-parse --show-toplevel
   git branch --show-current
   git status
   git log --oneline -15
   ```

2. Repo musi być dokładnie `C:\dev\zarabiaj-online`. Nie resetuj working tree i nie usuwaj lokalnych zmian.
3. Przeczytaj w tej kolejności:
   - `README.md`;
   - `docs/NORTH_STATE.md`;
   - `docs/CONTEXT_MAP.md`;
   - `docs/HANDBOOK.md`;
   - `docs/DECISIONS.md`;
   - `docs/ROADMAP.md`;
   - `docs/AI_WORKFLOW.md`;
   - dokumenty evidence/research należące do bieżącego zadania.
4. Sprawdź aktualny `HEAD`, `origin/main`, kod/dane i produkcję w zakresie potrzebnym dla zadania. Nie rekonstruuj faktów z pamięci czatu.
5. Przed pracą podsumuj własnymi słowami cel produktu, publiczny release, aktualny etap i zakres zadania.

## Hierarchia źródeł prawdy

- `docs/NORTH_STATE.md` — bieżący stan i master recovery.
- GitHub `/docs` — zatwierdzone decyzje, zasady, roadmapa i historia.
- `frontend/data/decision-offers.json` — fakty ofert używane przez frontend.
- Oficjalne regulaminy, strony produktów i tabele opłat — prawda finansowa; sam kod nie dowodzi prawdziwości warunków.
- Kod i lokalny working tree — rzeczywista implementacja oraz otwarte zmiany.
- Notion — operational mirror, Sprint Board, hipotezy i Validation Archive.
- Chat — materiał pomocniczy, nigdy canonical.

Pełną mapę i zasady konfliktów opisuje `docs/CONTEXT_MAP.md`.

## Chronione leftovers

Nie modyfikuj, nie stage'uj i nie commituj bez osobnego jawnego zakresu:

- `.gitattributes`;
- `frontend/assets/logos/Bank_Millenium.svg`;
- `frontend/assets/logos/Bank_Pekao_SA_Logo_(2017).svg`;
- `frontend/assets/logos/nest1.svg`.

Znany globalny `git diff --check` może zgłaszać wcześniejszy blank EOF w `.gitattributes`. Oddziel go od własnych zmian.

## Reguły produktu i evidence

- Nie zmieniaj faktu finansowego bez aktualnego oficjalnego evidence.
- Zachowuj konflikty, warianty, daty i niepewność; nie wypełniaj luk intuicją.
- Nie przedstawiaj gotówki, cashbacku, vouchera, nagrody rzeczowej, odsetek ani wartości funkcjonalnej jako jednej wymiennej puli.
- Każde krytyczne pole musi prowadzić do źródła, daty sprawdzenia i poziomu wsparcia.
- `PASS WITH WARNINGS` oznacza strukturalny pass tylko przy `0 FAIL`; warning może być operacyjnym recheckiem.
- Kraken jest rekordem `crypto_validation`, validation-only, poza katalogiem i bez publicznego CTA.

## Affiliate neutrality

```text
AFFILIATE SOURCE LAYER != PRODUCT DECISION LAYER
```

Prowizja, bonus, sieć, kampania i placement nie mogą zmieniać North Value, Match, Confidence produktu, Verdict ani kolejności ofert. Produkt i wariant wybieramy najpierw dla użytkownika; źródło afiliacyjne dopiero później, jako decyzję operacyjną.

## Workflow

1. Ustal konkretny cel i allowlistę plików.
2. Przeczytaj aktualne dokumenty, dane i kod w zakresie zadania.
3. Wprowadź najmniejszą zmianę realizującą cel.
4. Zweryfikuj logikę oraz renderowane zachowanie proporcjonalnie do ryzyka.
5. Zastosuj `docs/SYNC_PROTOCOL.md`: materialne zadanie nie jest Done bez synchronizacji odpowiednich dokumentów.
6. Przed stage pokaż status, diff, stat i diff check.
7. Stage'uj wyłącznie pliki z allowlisty. Sprawdź cached names, stat i whitespace.
8. Commit, push i deploy wykonuj tylko po jawnej zgodzie. Nie używaj ręcznego deployu, jeśli task go wyklucza.
9. Po zakończeniu zapisz stan commita/pusha/produkcji oraz następny krok.

## Działania zakazane bez osobnej decyzji

- resetowanie lub czyszczenie working tree;
- kopiowanie faktów ofert do HTML;
- wpływ afiliacji na wynik produktu;
- hurtowy import ofert lub utożsamianie kampanii afiliacyjnej z ofertą użytkownika;
- aktywowanie `WAIT`, Match %, fake precision lub fake social proof;
- dodawanie backendu, kont, ML/AI personalization albo szerokiej kategorii krypto;
- traktowanie Notion lub historii czatu jako nadrzędnych wobec kanonicznego repo;
- przedstawianie backlogu jako aktywnego sprintu.

## End-of-task synchronization

Przed oznaczeniem zadania jako Done sprawdź checklistę z `docs/SYNC_PROTOCOL.md`, w szczególności: testy, Git status, docs, changelog, ADR, North State, Notion mirror, commit/push, produkcję i następny krok.
