# North Writing Guide

> Trwały standard copy ProjectNorth. Obowiązuje w głównym flow, formularzach, wynikach, błędach i dokumentacji użytkowej.

## Zasady

1. Pisz językiem użytkownika, nie regulaminu ani architektury produktu.
2. Najpierw podaj odpowiedź i jej konsekwencję. Metodologię pokaż później.
3. Pytaj o sytuację użytkownika, nie o nazwy pól modelu.
4. Angielskie terminy North są drugą warstwą, nigdy warunkiem zrozumienia.
5. Termin bankowy od razu wyjaśnij po ludzku. Nie upraszczaj go tak, by zmienić zakres regulaminu.
6. Jedno zdanie powinno nieść jedną główną myśl.
7. Każdy koszt pokaż jako kwotę lub uczciwie napisz, dlaczego nie można jej ustalić.
8. Ryzyko tłumacz przez konsekwencję: co użytkownik straci i czy błąd da się naprawić.
9. Błąd lub brak danych musi mówić, co uzupełnić albo zrobić dalej.
10. Glossary pomaga, ale nie jest wymagane do przejścia głównego flow.
11. Prosty język nie usuwa warunków, wyjątków, konfliktów ani niepewności.
12. Jeśli zdanie trzeba przeczytać dwa razy, przepisz je.
13. Nie używaj „najlepszy”, „gwarantowany” ani „zarobisz” bez dowodu.
14. Wynik zaczynaj od: czy oferta ma sens, ile realnie można dostać, główny warunek i największe ryzyko.
15. Na mobile pełne słowo może przejść do nowej linii. Nie rozcinaj przypadkowo długich słów i nazw.

## Preferowane etykiety UI

| Termin modelu | Pierwsza warstwa |
| --- | --- |
| Advertised Max | Maksimum z reklamy |
| Easy Floor | Prostszy wariant |
| Your Likely Value | Ile realnie możesz dostać |
| Expected Usable Value | Ile faktycznie wykorzystasz |
| Net Scenario Value | Ile zostaje po kosztach |
| North Confidence | Jak pewne są dane |
| North Match | Jak dobrze oferta pasuje do Ciebie |
| North Verdict | Czy ta oferta ma dla Ciebie sens |
| Evidence | Skąd mamy te dane |
| Failure Risk | Co może pójść nie tak |
| Opportunity Cost | Z czego rezygnujesz, wybierając tę ofertę |

Confidence pokazujemy w dwóch warstwach. Najpierw prosty sens: `HIGH` — „Dane są dobrze potwierdzone w oficjalnych źródłach.”, `MEDIUM` — „Większość danych jest potwierdzona, ale jedna rzecz pozostaje niejasna.”, `LOW` — „Brakuje ważnych informacji, które mogą zmienić decyzję.” Niżej pozostaje band systemowy i konkretny powód z evidence. Przy `MEDIUM` i `LOW` nie wolno poprzestać na ogólnej etykiecie ani wymyślać konfliktu, którego nie ma w danych.

Nie trzeba używać tych zdań literalnie. Liczy się ten sam sens w naturalnym kontekście.

## Hierarchia głównego flow

Pierwsza warstwa treści odpowiada w tej kolejności:

1. **Co dostanę?** — forma i użyteczna wartość, bez mieszania gotówki z voucherem, rzeczą, odsetkami lub wartością warunkową.
2. **Co muszę zrobić?** — najważniejsze działania, czas i powtarzalne warunki.
3. **Gdzie jest haczyk?** — największe ryzyko, koszt albo warunek utraty korzyści.
4. **Dla kogo to ma sens?** — jakościowy kontekst sytuacji użytkownika, bez procentowego Match i bez udawania pełnej kwalifikacji.

Pełne wyjątki, evidence i metodologia schodzą niżej lub na podstronę. Nie wolno ich usuwać, ale nie powinny blokować zrozumienia pierwszej warstwy.

W globalnym headerze bez zapisanego Core Profile używamy `Dopasuj oferty`, a po zapisie `Twoje dopasowanie`. Słów `Profil` i `Konto` nie używamy jako nazwy tej lokalnej warstwy kontekstu; są zarezerwowane dla przyszłego user account/login.

## Kontrola przed publikacją

Przeczytaj kluczowy flow bez otwierania Glossary. Użytkownik powinien zrozumieć kwotę, działania, czas, koszt, ryzyko i decyzję. Szczególnie sprawdź słowa: „kwalifikowany”, „scenariusz”, „horyzont”, „warunkowy”, „komponent”, „nominalny”, „usable”, „execution”, „downstream”, „opportunity cost”, „evidence” i „confidence”. Jeśli termin jest konieczny, wyjaśnij go przy pierwszym użyciu.
