# ProjectNorth — Context Map

> Odpowiedź na pytanie: „Gdzie znajduje się prawda o danym typie informacji?”

## Mapa źródeł

| Typ informacji | Źródło główne | Uwagi |
| --- | --- | --- |
| Bieżący stan, release, etap, deadline | `docs/NORTH_STATE.md` | Master recovery document. |
| Długoterminowe zasady produktu | `docs/HANDBOOK.md` | Wizja, misja i trwały kontrakt. |
| Trwałe decyzje architektoniczne/produktowe | `docs/DECISIONS.md` | ADR-y i konsekwencje. |
| Priorytety i kolejność hipotez | `docs/ROADMAP.md` | Nie jest obietnicą terminów. |
| Historia wydań | `docs/CHANGELOG.md` | Faktycznie wydane zmiany i wyniki. |
| Historia kierunku produktu | `docs/PROJECT_HISTORY.md` | Dlaczego North ma obecną formę. |
| Workflow agentów | `AGENTS.md`, `docs/AI_WORKFLOW.md` | Entry point i przebieg tasku. |
| Synchronizacja po tasku | `docs/SYNC_PROTOCOL.md` | Kiedy aktualizować GitHub/Notion/state. |
| Decision Model | `docs/LANDING_2_1_DECISION_MODEL_V1.md` | Pełny kontrakt modelu i UI. |
| Fakty ofert używane przez frontend | `frontend/data/decision-offers.json` | Structured source dla wdrożonych rekordów. |
| Core Evidence Review #1 | `docs/EVIDENCE_REVIEW_V1.md` | Millennium, Nest, Pekao. |
| Evidence Reviews #2–#4 | `docs/EVIDENCE_CATALOG_EXPANSION.md` | Historyczny zakres i input implementacyjny katalogu. |
| Kraken validation | `docs/CRYPTO_HARD_CASE_V1.md` | Pojedynczy hard case, nie kategoria. |
| Taksonomia ofert i afiliacji | `docs/OFFER_TAXONOMY.md` | Product/promotion/variant/campaign/source/placement. |
| Affiliate Source Research / Discovery | Notion operational research oraz stan streszczony w `NORTH_STATE.md` | Pełne panele i matryce nie są kopiowane do publicznego repo. |
| Validation history | Notion Validation Archive + odpowiednie pliki repo | Wniosek wymaga faktycznego artefaktu. |
| Kod i bieżąca implementacja | lokalne repo / GitHub `main` | Produkcja serwuje `frontend/`. |
| Produkcja | `https://project-north-mu.vercel.app/` | Vercel; porównuj z release SHA. |
| Operational mirror | Notion | Nie nadpisuje kanonicznego GitHub `/docs`. |
| Historia rozmów | Chat | Pomocnicza; nigdy canonical. |

## Główne obszary Notion

- North State Snapshot;
- Sprint Board;
- Roadmap;
- North Validation Archive;
- North Validation & Review Framework;
- Affiliate Source Matrix;
- Affiliate Source Research;
- Full Affiliate Offer Discovery;
- Changelog;
- Architecture Decisions;
- AI Continuity & Sync Protocol.

## Precedence przy sprzeczności

1. **Aktualny lokalny working tree** dla jawnie otwartego tasku — pokazuje najnowszą niezatwierdzoną zmianę, ale nie staje się stanem publicznym przed commit/push/release.
2. **GitHub `main` i `/docs`** dla zatwierdzonego stanu, decyzji i historii.
3. **Structured data source** (`decision-offers.json`) dla faktów faktycznie używanych przez frontend.
4. **Notion operational mirror** dla bieżącej organizacji, hipotez i materiałów roboczych.
5. **Chat/history** jako materiał pomocniczy.

Wyjątek: fakty finansowe zawsze wymagają aktualnego official evidence. Sam kod, dokument, Notion ani rozmowa nie dowodzą, że bieżący regulamin banku jest prawdziwy. Gdy oficjalne źródło zmienia fakt, należy nazwać drift i zsynchronizować evidence, dane i dokumentację.

## Procedura konfliktu

1. Ustal datę, zakres i status każdego źródła.
2. Sprawdź, czy różnica dotyczy otwartego tasku, zatwierdzonego stanu, implementacji czy prawdy finansowej.
3. Zastosuj powyższą hierarchię i wskaż, co wymaga synchronizacji.
4. Jeżeli konfliktu nie da się rozstrzygnąć bez nowej decyzji Foundera, zapisz dokładnie: `CONTEXT CONFLICT — NEEDS FOUNDER REVIEW`.
5. Nie scalaj dwóch wersji pozornie i nie wybieraj wygodniejszego faktu.
