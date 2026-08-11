# ProjectNorth Handbook

> Wersja: 1.0 · Status: aktywny dokument roboczy · Produkt: v0.5.9

## Cel dokumentacji

ProjectNorth jest produktem, który pomaga świadomie oceniać oferty, promocje i narzędzia finansowe. Ten katalog jest źródłem prawdy dla zasad produktu, decyzji i planu rozwoju. Kod pozostaje źródłem prawdy dla implementacji; dokumentacja opisuje intencję, standard i historię decyzji.

## Wizja

North ma być zaufanym przewodnikiem po ofertach. Nie jest katalogiem linków ani stroną z promocjami. Przekłada warunki oferty na jasną odpowiedź: **dla kogo ma sens, jaka jest jej realna wartość i gdzie leży ryzyko**.

## Misja

W kilka minut dać użytkownikowi kontekst potrzebny do podjęcia decyzji, bez ukrywania warunków i bez sztucznego pompowania atrakcyjności oferty.

## Zasady produktu

1. **Najpierw decyzja, potem szczegóły.** Najważniejsza rekomendacja musi być czytelna bez studiowania regulaminu.
2. **Każdy komponent odpowiada na jedno pytanie użytkownika.** Jeśli nie odpowiada, nie powinien istnieć.
3. **Korzyści i ryzyka są równoważne.** Link partnerski nie może wpływać na ocenę ani copy.
4. **Kontekst jest ważniejszy od listy funkcji.** Oferta jest dobra wyłącznie dla określonej osoby i sytuacji.
5. **Aktualność jest częścią jakości.** Data weryfikacji i warunki mają być możliwe do sprawdzenia.
6. **Każdy sprint kończy się działającym, sprawdzonym efektem.** Pomysły bez właściciela i kryterium ukończenia nie trafiają do sprintu.

## Dla kogo

Początkowo dla polskojęzycznych osób porównujących konta, bonusy i oferty krypto. Najważniejsze grupy to początkujący, osoby aktywne online i podróżujące. North nie obiecuje zysku; ułatwia ocenę warunków.

## Marka i język

Marka jest spokojna, konkretna i niezależna. Czerń oraz grafit budują skupienie, a zielony akcent oznacza kierunek i pozytywną decyzję — nie presję sprzedażową. Copy powinno być proste, stanowcze i weryfikowalne. Unikamy: „najlepszy”, „gwarantowany”, „zarób”, jeśli nie są udowodnione i konieczne.

## Obecna architektura

```text
/
├── index.html              # Landing i katalog ofert
├── offers/revolut.html     # Strona oferty: wzorzec premium
├── data/config.js          # Konfiguracja etykiet i ikon
├── data/offers.js          # Dane kart ofert
├── script.js               # Renderowanie, wyszukiwanie, filtry, sortowanie
├── style.css               # Aktualny arkusz główny i style North
├── styles/                 # Początek podziału na moduły CSS
├── assets/logos/           # Logotypy partnerów
└── docs/                   # Dokumentacja produktu
```

Strona główna renderuje karty z `offers.js` po stronie klienta. `offers/revolut.html` zawiera wzorzec dla stron analitycznych: Hero, North Score, Snapshot, Verdict i CTA. Aktualnie występują zarówno `style.css`, jak i `styles/`; jest to etap przejściowy, nie docelowy podział odpowiedzialności.

## Model danych: kierunek

Dzisiejszy model karty zawiera m.in. `id`, `name`, `category`, `badge`, `bonus`, `time`, `level`, `audience`, `availability`, `url`, `logo` i `featured`. Docelowo jedna oferta powinna zasilać katalog, stronę szczegółów, SEO i analitykę:

```js
{
  id, slug, category, status, verifiedAt,
  northScore, scoreBreakdown, snapshot, verdict,
  hero, badges, affiliate, seo
}
```

Nie wdrażamy tego schematu przed ustaleniem metodologii wyniku i wymagań dla co najmniej trzech pełnych ofert.

## Standard pracy

Każdy sprint zawiera: cel, zakres, kryteria ukończenia, testy i aktualizację dokumentacji. Decyzje o trwałym wpływie wpisujemy do `DECISIONS.md`; zmiany widoczne dla użytkownika do `CHANGELOG.md`; nowe zadania do `ROADMAP.md` albo `PRODUCT_POLISH.md`.

Przed połączeniem zmian sprawdzamy desktop, 600 px, 900 px, klawiaturę, fokus, treść CTA, realność danych oraz linki. Gdy projekt trafi do Git, dokumentację zmieniamy w tym samym commicie co zmianę produktu.

## Mapa dokumentów

- [Roadmapa](ROADMAP.md) — kolejność i kryteria etapów.
- [Dziennik zmian](CHANGELOG.md) — wydania i istotne poprawki.
- [Decyzje](DECISIONS.md) — dlaczego wybrano dany kierunek.
- [System projektowy](DESIGN_SYSTEM.md) — tokeny i reguły interfejsu.
- [Product polish](PRODUCT_POLISH.md) — jakościowy backlog.
- [Komponenty](COMPONENTS/) — kontrakty kluczowych bloków UI.

## Zasada aktualizacji

Ten handbook jest celowo konkretny dla v0.5.9. Rzeczy niezaimplementowane są oznaczane jako plan. Nie opisujemy ich jako istniejących funkcji.
