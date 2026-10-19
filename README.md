# Trybunał. Anatomia konfliktu

Polskojęzyczny, interaktywny przewodnik po historii polskiego Trybunału Konstytucyjnego i konflikcie wokół niego. Stan wiedzy: **17 października 2026 r.**

## Uruchomienie

Wymagany Python 3. Nie ma zależności aplikacji ani etapu budowania.

```sh
npm run dev
```

Strona: http://localhost:4173. Pliki gotowe do hostowania są w `dist/`.

```sh
npm run check
```

## Zawartość

- Chronologia w sześciu rozdziałach: 1982–2026.
- Jedna opowieść do przewijania: wszystkie sześć rozdziałów i 38 wydarzeń są widoczne w kolejności, bez przełączania stron i skrótów między sekcjami.
- Kontekst wydarzeń rozwija się bezpośrednio przy opisach; źródła są odnośnikami zewnętrznymi.
- Sekcja 02 rozpoczyna się od 8 października. Wyraźne przyciski odsłaniają poniżej kolejne etapy: 2 grudnia, 3 grudnia oraz następstwa wyroku w latach 2015–2016, zachowując wcześniej przeczytane etapy. Przycisk nie przewija strony automatycznie.
- Trzeci krok oddziela autora oceny (TK, K 34/15), jej przedmiot (podstawę wyboru PO–PSL z 8 października) i wynik dla trzech oraz dwóch osób, wraz z nazwiskami i uzasadnieniem.
- Czwarty krok wyjaśnia niewykonanie wyroku w praktyce: brak ślubowań prawidłowo wybranej trójki i dopuszczenie spornej trójki do orzekania 20 grudnia 2016 r.; odróżnia też dwa grudniowe miejsca. Źródła: K 35/15, informacja TK za 2015 r. oraz wyrok ETPC Xero Flor.
- Aktualny kontekst i mapa kompetencji; opisy wszystkich pięciu instytucji są widoczne jeden pod drugim.
- Bibliografia z filtrem instytucji, metoda opracowania i licencje materiałów.
- Najpierw skrót konfliktu i schemat pięciu miejsc wyjaśniający jego początek, następnie obecna sytuacja; pełna oś czasu na końcu strony.
- Pomarańczowe oznaczenia PO/KO i granatowe PiS, wraz z logotypami przy wydarzeniach. Osobne kolory dla oceny podstaw prawnych w schemacie z 2015 r.
- Najmniejszy tekst ma co najmniej 12 px; opisy i drobne elementy interfejsu zostały powiększone także na telefonach.
- Nawigacja klawiaturą, semantyczne rozwijanie kontekstu i komunikat o odsłonięciu kroków. Pozostawiono niewidoczny poza fokusem skrót dostępności do treści głównej.

## Aktualizacja treści

Źródła, rozdziały, wydarzenia i uczestnicy: `dist/data.js`. Interakcje: `dist/app.js`. Układ: `dist/index.html`, wygląd: `dist/style.css`, `dist/overview.css` i `dist/reading.css`.

Treści są statyczną migawką. Aktualizacja wymaga ponownej weryfikacji źródeł i daty stanu wiedzy, w tym sekcji sytuacji bieżącej w HTML. Strona odróżnia fakty, stanowiska instytucji, orzeczenia i niewiążące opinie.

Fotografia i logotypy mają atrybucję w sekcji „Fotografia, logotypy i prawa do materiałów”. Fonty są pobierane z Google Fonts; przy braku połączenia stosowane są fonty systemowe.
