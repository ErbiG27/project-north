# ProjectNorth — Synchronization Protocol

> Żadne materialne zadanie ProjectNorth nie jest naprawdę `Done`, dopóki odpowiednia dokumentacja i operational mirror nie zostały ocenione pod kątem synchronizacji.

Synchronizacja nie oznacza kopiowania wszystkiego wszędzie. Każde źródło zachowuje własną rolę opisaną w `CONTEXT_MAP.md`.

## A. Zmiana kodu lub produktu

- zaktualizuj `CHANGELOG.md`;
- zaktualizuj `NORTH_STATE.md`, jeśli zmienia się stan publiczny, architektura lub aktywny etap;
- zapisz adekwatny wynik testów/release;
- sprawdź, czy README, Handbook albo ADR stały się nieaktualne.

## B. Zmiana roadmapy lub priorytetów

- zaktualizuj `ROADMAP.md`;
- zaktualizuj `NORTH_STATE.md`, jeśli zmienia się aktywny etap;
- zsynchronizuj Notion Sprint Board i Roadmap.

## C. Trwała decyzja

- dodaj lub zaktualizuj ADR w `DECISIONS.md`;
- zaktualizuj `HANDBOOK.md`, jeśli zmienia się trwała zasada produktu;
- zsynchronizuj Notion Architecture Decisions.

## D. Evidence lub fakt ofertowy

- zaktualizuj właściwy Evidence doc;
- zaktualizuj `decision-offers.json`, jeśli fakt trafia do produktu;
- ustaw `verifiedAt`, `recheckBy`, evidence ledger i Confidence zgodnie z wynikiem;
- zaktualizuj Notion Validation Archive / research mirror;
- nie zmieniaj faktu wyłącznie na podstawie panelu afiliacyjnego.

## E. Affiliate

- zaktualizuj affiliate research/source matrix;
- zachowaj product identity, promotion variant, campaign, source i placement jako osobne warstwy;
- nie zmieniaj Decision Model, North Value, Match, Confidence produktu, Verdict ani kolejności ofert z powodu prowizji;
- zsynchronizuj Notion Affiliate Source Matrix / Affiliate Source Research.

## F. Release

- zaktualizuj `CHANGELOG.md`;
- zaktualizuj `NORTH_STATE.md`;
- zapisz commit SHA, deployment state, publiczny URL i production smoke result;
- odróżnij release aplikacji od późniejszego docs-only commita;
- zsynchronizuj Notion North State Snapshot i Changelog.

## G. Validation lub test

- zapisz wynik w odpowiednim validation history/archive;
- zaktualizuj `NORTH_STATE.md` tylko wtedy, gdy wynik zmienia decyzję, stan, ryzyko lub aktywny etap;
- rutynowego smoke nie licz automatycznie jako kolejnego strategicznego Review.

## End-of-task checklist

- [ ] Kod i fakty są zgodne z zakresem oraz źródłami.
- [ ] Adekwatne testy zostały uruchomione, a wynik zapisany.
- [ ] `git status` i diff są przejrzane; leftovers zachowane.
- [ ] Odpowiednie docs zostały zaktualizowane.
- [ ] Oceniono: Notion mirror required?
- [ ] Oceniono: changelog required?
- [ ] Oceniono: ADR required?
- [ ] Oceniono: state snapshot required?
- [ ] Commit/push state został zapisany.
- [ ] Production state został zapisany albo jawnie oznaczony jako niezmieniony.
- [ ] Następny krok, deadline lub brak następnego sprintu został zapisany.

## Git gate

Przed stage:

```powershell
git status
git diff --stat
git diff --check
```

Po stage:

```powershell
git status
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
```

Stage'uj wyłącznie jawnie dozwolone ścieżki. Globalny, wcześniejszy warning w chronionym `.gitattributes` należy opisać osobno od własnych zmian.
