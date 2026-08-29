# Product Polish Backlog

Backlog jakościowy. Priorytet określa wpływ na zaufanie i ukończenie zadania użytkownika; nie jest planem wydania.

## Product UX checkpoint — 2026-08-29

- [x] North Offer Experience v1/v1.1: zaakceptowany wzorzec krótkiego, opcjonalnego Core Profile bez blokowania katalogu.
- [x] Category Shell & Header v1: visual pass po micro-fixie; `Konta` aktywne, przyszłe kategorie bez martwych linków i pustych katalogów.
- [x] Offer Identity & Visual Assets Pass v1: provider logos i North visual fallback wystarczają; bez stockowych product visuals.
- [x] Homepage Simplification v1: functional/product/visual pass po Founder Review i micro-fixie; prosty flow od hero do ofert, z metodologią niżej; lokalny checkpoint `b3593e2` kompletny.
- [ ] Public integration pełnego flow: osobny późniejszy task po decyzji Foundera, wymaganych recheckach evidence i pełnych release gates. Lokalny Homepage v1 nie jest produkcją i nie został pushed ani deployed.

Affiliate support/pilot/tracking, community, mBank public integration i dalszy catalog expansion nie są aktywnym backlogiem tego etapu.

## Pre-UX Polish Patch — North UX Test #1

- [x] Podnieść aktywne analizy bezpośrednio pod hero, przed rozbudowanymi przykładami; zachować wyszukiwanie, filtry, pusty stan i reset.
- [x] Dodać krótki przepływ „Jak działa North?” między listingiem a przykładami bez tworzenia rankingu.
- [x] Przenieść popovery Glossary do globalnej warstwy viewportu, aby kontenery z `overflow` ich nie ucinały na desktopie ani mobile.
- [x] Zastąpić niejasne „Dane ręcznie zweryfikowane” komunikatem „Warunki sprawdzone w oficjalnych źródłach”.
- [x] Pokazywać prosty sens Confidence przed bandem `HIGH` / `MEDIUM` / `LOW`, a przy niższej pewności także konkretny istniejący powód.

## P0 — przed publikacją

- Naprawić wszystkie linki kart i CTA; nie publikować `href="#"` ani stron nieistniejących.
- Potwierdzić aktualność bonusów, warunków, dostępności oraz informacji o partnerach.
- Ujednolicić kodowanie plików do UTF-8, aby polskie znaki i ikony nie były uszkodzone.
- [x] Oznaczyć linki partnerskie, dodać podstawową politykę afiliacyjną oraz źródła warunków — v0.6.2.
- [x] Dla Millennium, Nest i Pekao ręcznie połączyć krytyczne pola z konkretnym źródłem lub punktem regulaminu, datą weryfikacji i statusem pewności — v0.6.2.
- [x] Nie pokazywać jednej „realnej nagrody” bez jawnego scenariusza; stosować `Advertised Max`, `Easy Floor` oraz `Your Likely Value` / `Conditional Max` tam, gdzie ma zastosowanie — v0.6.1.
- [x] Nie publikować werdyktu `WAIT` ani precyzyjnego procentu Confidence/Match bez wystarczających danych i walidacji — v0.6.1/v0.6.2.
- [x] Sprawdzić wersję mobilną, klawiaturę i stany focus — v0.6.2.
- [x] Ustalić produkcyjny origin i dodać poprawne canonical, podstawowe Open Graph, Twitter Summary Card, sitemap oraz robots — Deployment & Infrastructure #1. Dedykowana grafika social pozostaje osobnym zadaniem; nie używać przypadkowego logo jako `og:image`.

## P1 — fundament zaufania

- [x] Uzupełnić spójne użycie istniejących zasobów marki North w stopce i metadanych — v0.7.1.
- [x] Dodać footer z informacją o metodologii i aktualizacji; kontakt pozostaje do zdefiniowania przed publikacją kanału wsparcia — v0.6.2.
- [x] Dodać datę weryfikacji i status oferty — v0.6.2.
- [x] Przygotować stronę metodologii modelu decyzji: North Value, North Confidence, scenariusze wartości, koszty, ryzyko niedowiezienia i zasady Verdict — v0.6.2.
- [x] Zapewnić, że North Score — jeśli pozostaje widoczny — jest skrótem wtórnym z rozkładem i uzasadnieniem, a nie głównym USP — Decision Model v1 nie używa Score jako wyniku.
- [x] Dodać czytelne stany `TAKE NOW`, `TAKE IF`, `SKIP` i `NOT ENOUGH DATA`; `WAIT` zachować jako późniejszy stan wymagający historii i backtestu — v0.6.1/v0.6.2.
- [x] Dodać puste stany dla braku wyników wyszukiwania oraz filtrów — v0.7.1.
- Przygotować dedykowaną grafikę social zgodną z aktualnym brandingiem i dopiero wtedy dodać `og:image` / `twitter:image`.
- Uczynić całą kartę oferty logicznie klikalną bez zagnieżdżania interaktywnych elementów; obecne karty zawierają przyciski glossary, więc prosty wrapper-link byłby błędem semantycznym.

## P2 — czytelność i komfort

- Breadcrumb na stronach ofert, jeśli rośnie liczba kategorii i podstron.
- Skeleton/loading tylko tam, gdzie pojawi się asynchroniczne ładowanie danych.
- [x] Spójne stany aktywne filtrów i formularzy — v0.7.1; sortowanie nie występuje w bieżącym interfejsie.
- [x] Testy na długich nazwach ofert oraz braku logo — v0.7.2; wspólne nagłówki nie rozcinają pojedynczych słów, a fallback logo używa monogramu.
- [x] Przegląd treści pod kątem prostego języka i nieuzasadnionych obietnic — v0.7.2; główny flow działa bez znajomości Glossary.
- [x] Formularze Match pytają o sytuację użytkownika i wyjaśniają szczególne definicje banku bez zmiany faktów — v0.7.2.
- [x] Wynik zaczyna się od sensu oferty, realnej kwoty, głównego warunku i największego ryzyka — v0.7.2.
- Ustalić politykę zakończeń linii i uporządkować `.gitattributes` (nie blokuje kolejnego etapu).
- Poprawić kontrast sygnetu North wewnątrz North Verdict (nie blokuje kolejnego etapu).

## Później — po walidacji Decision Model v1

- [x] Przeprowadzić jeden kontrolowany crypto hard case: Kraken referral, wyłącznie jako stretch validation case po Millennium, Nest i Pekao — v0.6.3; poza katalogiem.
- [x] W analizie Kraken jawnie pokazać reward uncertainty, market risk, `North Confidence`, user capital at risk i conditions required — v0.6.3; Verdict `NOT ENOUGH DATA`.
- [x] Nie nadawać pozytywnego Verdict z powodu samej afiliacji lub referral — brak referral CTA.
- [x] Przed publikacją Kraken ponownie sprawdzić aktualne warunki promocji, dostępność, ograniczenia linkowania, ryzyko rynkowe i niegwarantowany charakter nagrody — v0.6.3; publiczne linkowanie przez portal pozostaje niepotwierdzone, więc CTA nie istnieje.
- Wersjonowanie edycji ofert i historia zmian regulaminów.
- Automatyczne monitorowanie regulaminów po sprawdzeniu procesu ręcznego.
- [x] Explainable North Match pokazujący wpływ zmiany założeń bez procentowego score'u — v0.7.0.
- [x] Centralny North Glossary z dostępnymi popoverami dla terminów Decision Model — v0.7.0.
- Pełny North Plan, conflict engine i historyczne `WAIT` vs `TAKE`.

## Kryterium zamknięcia zadania

Zadanie jest zamknięte, gdy ma zaakceptowany efekt na desktop i mobile, nie psuje dostępności oraz gdy zmiana jest odnotowana w changelogu lub decyzjach — zależnie od charakteru.
