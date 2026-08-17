# AI Workflow — ProjectNorth

Krótka instrukcja dla kolejnych zamkniętych tasków Work.

## Stałe źródła prawdy

- Repo: `C:\dev\zarabiaj-online`.
- GitHub: `ErbiG27/project-north`.
- `/docs` jest kanonicznym źródłem decyzji, standardów i roadmapy; Notion jest operational mirror.
- `frontend/data/decision-offers.json` jest źródłem faktów ofert. Nie kopiuj faktów do HTML.
- Produkcja działa na Vercel.

## Obowiązkowy przebieg

1. Zacznij od repo guard: `pwd`, root Git, status i ostatnie commity. Potwierdź dokładną ścieżkę repo.
2. Zachowaj lokalne zmiany użytkownika. Nie resetuj working tree.
3. Przeczytaj dokumentację i kod należące do zakresu. Nie wymyślaj faktów, źródeł ani danych marketingowych.
4. Zaimplementuj najmniejszą zmianę realizującą cel. Fakty ofert zmieniaj wyłącznie na podstawie źródeł.
5. Uruchom testy logiki i renderowanej aplikacji. Zrób smoke desktop/mobile, sprawdź konsolę, 404, overflow, dostępność, klawiaturę i kluczowe flow.
6. Przed stage sprawdź `git status`, pełny diff, statystykę oraz `git diff --check`.
7. Stage tylko pliki z zakresu sprintu. Sprawdź cached diff i cached diff check.
8. Użyj conventional commit. Push do `main` wykonuj wyłącznie w zatwierdzonym, zamkniętym tasku.
9. Po pushu zweryfikuj deployment Vercel i produkcyjny smoke. Dokumentuj rzeczywisty wynik, nie założenie.

## Zakres zabroniony bez osobnej decyzji

- Match % oraz Score 0–100 jako rdzeń produktu;
- `WAIT` bez danych historycznych i backtestu;
- backend, konta i ML personalization;
- rozszerzenie kategorii krypto;
- fake social proof;
- wpływ afiliacji na Verdict;
- kopiowanie faktów ofert do HTML.

Jeśli wykryjesz możliwy błąd merytoryczny, nie poprawiaj go intuicyjnie. Zatrzymaj zmianę faktu i zgłoś konkretny review item z potrzebnym źródłem.
