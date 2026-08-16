# Roadmapa ProjectNorth

> Wersja robocza · Priorytet wyznacza wartość dla użytkownika, nie atrakcyjność techniczna.

## Zasady planowania

Element trafia do sprintu tylko z celem, właścicielem, zakresem i Definition of Done. Roadmapa jest kolejnością hipotez, nie obietnicą terminu. Funkcje finansowe, afiliacyjne i analityczne wymagają najpierw zasad transparentności oraz zgodności prawnej.

## Stan obecny — v0.6.0

**Cel osiągnięty:** uporządkowano fundamenty frontendu bez zmiany kierunku produktu.

`style.css` jest jednym punktem wejścia do modułowych arkuszy, strona główna ma własny moduł `styles/pages/home.css`, a marka korzysta z własnego logo, sygnetu i faviconów. Usunięto stare, puste pliki zastępcze CSS oraz `frontend.zip`; testy smoke zakończyły się powodzeniem.

## Następne etapy

### v0.6.1 — Pełne strony ofert

- Zbudować co najmniej trzy strony ofert według wzorca North.
- Ustalić minimalny model danych oferty i pole `verifiedAt`.
- Dodać warunki, ryzyka, grupę docelową oraz status weryfikacji do każdej oferty.

**Definition of Done:** użytkownik może porównać trzy realne, kompletne analizy o porównywalnym poziomie informacji.

### v0.6.2 — Metodologia i zaufanie

- Opublikować metodologię North Score i definicje kryteriów.
- Pokazać datę weryfikacji, źródła oraz politykę afiliacyjną.
- Zaprojektować proces aktualizacji wygasających ofert.

**Definition of Done:** każda liczba i rekomendacja ma określone pochodzenie oraz właściciela aktualizacji.

### v0.6.3 — Treść, SEO i dostępność

- Uzupełnić unikalne meta title, description, nagłówki oraz dane strukturalne tam, gdzie są zasadne.
- Przeprowadzić audyt klawiatury, kontrastu, alternatyw tekstowych i responsywności.
- Dodać puste stany dla wyszukiwania i filtrów.

**Definition of Done:** kluczowe strony mają pełne metadane, brak krytycznych problemów dostępności i czytelne stany braku wyników.

### v0.7.0 — Prywatna beta

- Zdefiniować grupę testową i zadania testowe.
- Mierzyć podstawowe przejścia: katalog → oferta → CTA.
- Zbierać jakościowy feedback, nie tylko liczbę kliknięć.

**Definition of Done:** decyzje o kolejnych zmianach opierają się na obserwacji użytkowników, nie tylko intuicji zespołu.

## Później, nie teraz

- Motion i zaawansowane animacje — dopiero po stabilizacji treści i ścieżek.
- Porównywarka — po ujednoliceniu danych przynajmniej kilku ofert.
- Konta użytkowników, backend i premium — po potwierdzeniu potrzeby w becie.
- Integracje analityczne — minimalnie i z poszanowaniem prywatności; nie są substytutem badań użytkowników.
