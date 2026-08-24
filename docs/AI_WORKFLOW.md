# AI Workflow — ProjectNorth

Krótka instrukcja dla kolejnych zamkniętych tasków Work.

Każdy agent zaczyna od `AGENTS.md`, a lokalizację źródeł i zasady rozstrzygania konfliktów bierze z `CONTEXT_MAP.md`.

## Stałe źródła prawdy

- Repo: `C:\dev\zarabiaj-online`.
- GitHub: `ErbiG27/project-north`.
- `/docs` jest kanonicznym źródłem decyzji, standardów i roadmapy; Notion jest operational mirror.
- `frontend/data/decision-offers.json` jest źródłem faktów ofert. Nie kopiuj faktów do HTML.
- Produkcja działa na Vercel.
- `AGENTS.md` jest wspólnym cross-AI entrypointem; `CLAUDE.md` jest wyłącznie cienkim adapterem.
- `SYNC_PROTOCOL.md` definiuje obowiązkową synchronizację końca tasku.

## Obowiązkowy przebieg

1. Przeczytaj `AGENTS.md`, następnie wykonaj repo guard: `pwd`, root Git, branch, status i ostatnie commity. Potwierdź dokładną ścieżkę repo.
2. Zachowaj lokalne zmiany użytkownika. Nie resetuj working tree.
3. Przeczytaj dokumentację i kod należące do zakresu. Nie wymyślaj faktów, źródeł ani danych marketingowych.
4. Zaimplementuj najmniejszą zmianę realizującą cel. Fakty ofert zmieniaj wyłącznie na podstawie źródeł.
5. Uruchom testy logiki i renderowanej aplikacji. Zrób smoke desktop/mobile, sprawdź konsolę, 404, overflow, dostępność, klawiaturę i kluczowe flow.
6. Zastosuj `SYNC_PROTOCOL.md`. Materialne zadanie nie jest `Done`, dopóki ocenione i zsynchronizowane nie są właściwe docs, changelog, ADR, North State i Notion mirror.
7. Przed stage sprawdź `git status`, pełny diff, statystykę oraz `git diff --check`.
8. Stage tylko pliki z allowlisty zadania. Sprawdź cached names, stat, diff i cached diff check.
9. Użyj conventional commit. Push do `main` wykonuj wyłącznie w zatwierdzonym, zamkniętym tasku.
10. Po pushu zapisz rzeczywisty stan `HEAD`, `origin/main`, deploymentu i produkcji. Docs-only commit poza `frontend/` nie wymaga ręcznego deployu.

## Zakres zabroniony bez osobnej decyzji

- Match % oraz Score 0–100 jako rdzeń produktu;
- `WAIT` bez danych historycznych i backtestu;
- backend, konta i ML personalization;
- rozszerzenie kategorii krypto;
- fake social proof;
- wpływ afiliacji na Verdict;
- kopiowanie faktów ofert do HTML.

## End-of-task synchronization

Przed finalnym raportem przejdź checklistę z `SYNC_PROTOCOL.md`: kod/fakty, testy, Git status, docs, Notion mirror, changelog, ADR, state snapshot, commit/push, produkcja i następny krok. Jeśli któryś element nie ma zastosowania, oznacz go jawnie jako `not required` zamiast pomijać.

Jeśli wykryjesz możliwy błąd merytoryczny, nie poprawiaj go intuicyjnie. Zatrzymaj zmianę faktu i zgłoś konkretny review item z potrzebnym źródłem.
