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
- Filtrowanie według tematów i wyszukiwanie w całej historii.
- Szczegóły wydarzeń, konsekwencje i bezpośrednie odnośniki do źródeł.
- Interaktywny schemat pięciu miejsc z 2015 roku.
- Aktualny kontekst i mapa kompetencji instytucji.
- Bibliografia z filtrem instytucji, metoda opracowania i licencje materiałów.
- Najpierw skrót konfliktu i obecna sytuacja; pełna oś czasu na końcu strony.
- Pomarańczowe oznaczenia PO/KO i granatowe PiS, wraz z logotypami przy wydarzeniach. Osobne kolory dla oceny podstaw prawnych w schemacie z 2015 r.
- Najmniejszy tekst ma co najmniej 12 px; opisy i drobne elementy interfejsu zostały powiększone także na telefonach.
- Linki do wydarzeń poprzez parametr `?event=2026-10-16`; filtry zapisują się w URL.

## Aktualizacja treści

Źródła, rozdziały, wydarzenia i uczestnicy: `dist/data.js`. Interakcje: `dist/app.js`. Układ: `dist/index.html`, wygląd: `dist/style.css` oraz `dist/overview.css`.

Treści są statyczną migawką. Aktualizacja wymaga ponownej weryfikacji źródeł i daty stanu wiedzy, w tym sekcji sytuacji bieżącej w HTML. Strona odróżnia fakty, stanowiska instytucji, orzeczenia i niewiążące opinie.

Fotografia i logotypy mają atrybucję w sekcji „Fotografia, logotypy i prawa do materiałów”. Fonty są pobierane z Google Fonts; przy braku połączenia stosowane są fonty systemowe.
