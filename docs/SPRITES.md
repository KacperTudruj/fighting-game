# Sprite'y i animacje — żywa specyfikacja

Dokument rozwijamy wraz z grą. Zmiana stylu lub układu arkusza wymaga
aktualizacji tego pliku i konfiguracji postaci. Sam obraz nie zawiera
informacji pozwalających silnikowi rozpoznać chód, bieg lub skok.

## Styl gry

Komiksowe arcade: czysty ciemny kontur, płaskie kolory, oszczędne
dwutonowe cieniowanie, lekko powiększona głowa i czytelna sylwetka.
Bez fotorealizmu, rozmycia, malarskich tekstur i szczegółów znikających
po zmniejszeniu. Wszystkie postacie zachowują podobne proporcje i kreskę.
Widok boczny w prawo, twarz lekko w trzech czwartych. Lewy kierunek
uzyskujemy przez odbicie obrazu, dlatego unikamy napisów na ubraniu.

## JustRandomePlayer

Referencja: zdjęcie dostarczone przez użytkownika 2026-10-16.
Zdjęcia źródłowego nie dodajemy do repozytorium.

- Krótkie brązowe włosy, prostokątne ciemne okulary, krótka ciemna broda.
- Czarna koszulka z uproszczonym szarym motywem kosmicznego mopsa.
- Ciemne przetarte jeansy i ciemne sportowe buty.
- Ta sama twarz, strój, proporcje i rozmiar głowy we wszystkich klatkach.
- Arkusz ruchu bez rakiety; ewentualna broń jest osobnym przyszłym zadaniem.

## Format docelowy

- PNG z rzeczywistym kanałem alfa, bez narysowanej szachownicy.
- Jednakowe prostokątne komórki; żadnych podpisów ani linii siatki.
- Cała postać mieści się w komórce, również przy rozłożonych rękach.
- Stały rozmiar postaci; animacja nie może zmieniać skali ani stroju.
- Ruch animujemy w miejscu. Przesunięcie w świecie i wysokość skoku
  wynikają z fizyki, a nie ze zmiany położenia całej sylwetki w komórce.
- Punkt odniesienia to środek między stopami na podłodze.
  Docelowo renderer powinien używać jawnego punktu zaczepienia.
- Kolizje ciała muszą być niezależne od przezroczystych marginesów grafiki.

## Pierwszy arkusz v1 — zamówiony układ

6 kolumn × 6 wierszy, docelowo 1536 × 1536 px, komórka 256 × 256 px.
Stojąca postać ma około 205 px wysokości, podeszwy na y=232 komórki.
Numeracja od zera, od lewej do prawej, potem kolejny wiersz.
To wymagania generacji; faktyczny obraz trzeba sprawdzić przed podłączeniem.

| Sekwencja | Klatki | Znaczenie | Docelowe odtwarzanie |
| --- | --- | --- | --- |
| idle | 0–5 | spokojny oddech w staniu | pętla |
| walk | 6–11 | pełen cykl chodu | pętla |
| run | 12–17 | pełen cykl biegu | pętla |
| jump | 18–23 | przygotowanie, wybicie, wznoszenie, szczyt | jednorazowo |
| fall / land | 24–29 | szczyt, opadanie, kontakt, amortyzacja, powrót | rozdzielić według fizyki |
| crouch | 30–35 | zejście do przysiadu i niski oddech | wejście jednorazowe, końcówka w pętli |

Pierwszy arkusz jest materiałem do przeglądu. Sześć klatek na sekwencję
to decyzja dla tej wersji grafiki, a nie limit silnika.

### Wynik generacji v1

Plik: `game/fighters/just-randome-player/sprites-v1.png`.
Wygenerowany wbudowanym narzędziem ImageGen z referencją zdjęciową.
Faktyczny rozmiar wynosi **1254 × 1254 px**, PNG RGBA (kanał alfa),
czyli przy podziale 6 × 6 komórka wynosi **209 × 209 px**, nie 256.
Nie używać wymiarów z zamówienia jako konfiguracji tego pliku.

Wizualnie arkusz zawiera sześć rzędów po sześć postaci i zachowuje
uzgodniony styl. Pozycje stóp, zwłaszcza w skoku i lądowaniu,
oraz skala sylwetek wymagają dokładnej kontroli i wyrównania.
Nie sprawdzono jeszcze cykli w odtwarzaniu. Status: **arkusz roboczy
do oceny**, nie podłączony do gry. Kontrola nagłówka potwierdza format
RGBA; nie zastępuje sprawdzenia krawędzi alfa i wszystkich klatek.

## Kontrakt animacji do wdrożenia w kolejnym kroku

Aktualny silnik obsługuje tylko `idle` i `walk`, jeden czas na klatkę
w obrębie animacji oraz zapętlanie. Poniższy przykład opisuje planowany
format, nie aktualne API ani gotową konfigurację do zaimportowania:

```json
{
  "animations": {
    "run": {
      "loop": true,
      "frames": [
        { "sprite": 12, "durationTicks": 5 },
        { "sprite": 13, "durationTicks": 4 },
        { "sprite": 14, "durationTicks": 5 }
      ]
    },
    "jump": {
      "loop": false,
      "frames": [
        { "sprite": 20, "durationTicks": 4 },
        { "sprite": 21, "durationTicks": 4 },
        { "sprite": 22, "durationTicks": 6 }
      ]
    }
  }
}
```

Lista może zawierać dowolną dodatnią liczbę klatek, również powtórzenia.
`durationTicks` jest dodatnią liczbą całkowitą kroków symulacji 60 Hz.
Indeks musi wskazywać komórkę istniejącą w arkuszu. Animacja jednorazowa
zatrzymuje ostatnią klatkę do zmiany stanu, chyba że zdefiniowano przejście.

Nazwy są mapowaniem stanu gry na grafikę. Dopisanie nowej grafiki lub nazwy
nie tworzy nowej mechaniki: np. atak wymaga logiki trafień.
Skok wolno rozpocząć z podłoża; fizyka wyznacza wznoszenie, opadanie
i lądowanie. Kucanie wymaga osobnej wysokości kolizji bez przesuwania stóp.
Animacja nie może powodować unoszenia postaci ani przenikania podłogi.

## Prompt do ponownego użycia

Dołącz zdjęcie jako referencję wyglądu. Przy kolejnych arkuszach dołącz
także zaakceptowany arkusz v1 jako referencję stylu i proporcji.

```text
Use case: stylized-concept.
Create a 2D fighting game animation sprite sheet for JustRandomePlayer.
Use the attached photograph as an identity reference only: rectangular
black glasses, short slightly tousled brown hair, trimmed dark beard,
black t-shirt with a simplified gray space pug emblem, charcoal distressed
jeans and dark sneakers. No racket in this movement sheet.
Friendly arcade comic artwork: crisp dark outlines, flat colors,
restrained two-tone cel shading, slightly enlarged head, readable silhouette.
Keep the exact same identity, clothing, proportions and scale in every cell.
Side view facing RIGHT, face slightly three-quarter visible.
Actual transparent alpha background; no scenery, labels, text, grid lines
or shadows outside the character.
Exact regular grid: 6 columns by 6 rows, preferably 1536 by 1536 pixels,
equal 256 by 256 pixel cells. Exactly one full body character in each cell.
No overlap or cropping. Center each character horizontally with padding.
Standing height about 205 pixels, grounded feet baseline y=232 in each cell.
Row 1: six chronological subtle idle breathing frames, seamless loop.
Row 2: six chronological walk cycle frames, distinct opposing arms and legs.
Row 3: six chronological run cycle frames, forward lean and airborne strides.
Row 4: six jump poses: anticipation, push off, rising extension,
knees rising, tucked rise, apex.
Row 5: six fall/landing poses: apex, descending tucked, legs extended,
landing contact, compressed landing, recovery standing.
Row 6: six crouch poses: upright to bent knees to low crouching guard;
last two poses subtly breathing crouched.
Animate in place. Do not translate the whole character upwards for jumping;
the game's physics handles world motion. Maintain head size and identity.
Clean reusable game assets, not a poster.
```

## Kontrola przed użyciem w grze

Sprawdzić rozmiar i kanał alfa, liczbę komórek, kompletność sylwetek,
stałą skalę, pozycję stóp i zgodność kolejności z tabelą. Obejrzeć cykle
w ruchu: samo zestawienie póz nie potwierdza płynnej animacji.
Generacja może wymagać poprawienia pojedynczych klatek lub ich wyrównania.
Nie podłączać arkusza do gry bez weryfikacji i konfiguracji stanu animacji.

## Historia

- 2026-10-16: styl v1, JustRandomePlayer, prompt pierwszego arkusza,
  specyfikacja przyszłych animacji. Bez zmian fizyki i runtime'u.

## Integracja v2 — 2026-10-16

Arkusz v1 jest podłączony jako JustRandomePlayer. Pomiar sylwetek wykazał,
że podział na równe komórki 209 px przecinałby postacie. Konfiguracja
`game/fighters/just-randome-player/definition.ts` zawiera więc 36 osobnych
prostokątów zmierzonych z kanału alfa, zamiast siatki. PNG pozostaje oryginalny.
Każdy prostokąt ma punkt zaczepienia na środku dolnej krawędzi sylwetki.
To wyrównuje podłogę, choć ręcznie rysowane pozy mogą nadal wykazywać
niewielkie różnice proporcji i przesunięcia w cyklu; wymagają oceny w ruchu.

Opisany wcześniej kontrakt animacji jest już wdrożony: `loop`, lista
`{ sprite, durationTicks }`, dowolna liczba klatek i indywidualne czasy.
Przykład JSON opisuje teraz strukturę animacji; pełna definicja pozostaje TS.
Silnik obsługuje idle/walk/run/jump/fall/land/crouch. Podczas skoku wybiera
pozy 20–23 (bez przygotowania, żeby reakcja na klawisz była natychmiastowa),
opadanie używa 24–25, lądowanie 26–29, kucanie pętli 34–35.
Wszystkie indeksy odnoszą się do listy prostokątów, nie równych komórek PNG.
Pozycja zawodnika to teraz środek stóp, nie lewy górny róg klatki.
Fizyka steruje skokiem, podłogą i wysokością ciała przy kucaniu.
Nowa nazwa animacji nadal wymaga logiki, która wybierze jej odtwarzanie.

Przyszłe generacje nadal powinny stosować regularną siatkę z prompta.
Obecna obsługa prostokątów pozwala też korzystać z atlasów nieregularnych.

## Sprite'y v2 — korekta cykli i drugi zawodnik

Ten rozdział jest aktualnym planem. Dotychczasowy arkusz v1 pozostaje
w grze do osobnego zatwierdzenia integracji v2.

### Zasady ruchu do następnej implementacji

- Przód oznacza kierunek do przeciwnika, tył kierunek oddalania się.
- Postać patrzy na przeciwnika również podczas cofania. Odbicie grafiki
  następuje przy zmianie strony względem przeciwnika, nie od klawisza ruchu.
- Dwukrotne naciśnięcie przodu uruchamia bieg, gdy drugie naciśnięcie jest
  przytrzymane. Puszczenie klawisza kończy bieg. Docelowo zastępuje Shift.
- Dwukrotne naciśnięcie tyłu uruchamia pojedynczy krótki odskok w tył.
- Proponowane okno dwukliku: 12 kroków symulacji (200 ms), konfigurowalne.
  Powtarzanie klawisza przez system nie jest drugim naciśnięciem.
- Obaj zawodnicy korzystają ze swoich przypisań w `public/controls.txt`.
  Konieczna będzie obsługa dwóch zawodników w symulacji i rendererze.
- To specyfikacja przyszłej mechaniki. W tym kroku zmieniamy tylko grafikę
  i dokumentację, bez podłączania drugiej postaci i nowych wejść.

### Plan sekwencji

| Sekwencja | Klatki docelowe | Odtwarzanie |
| --- | ---: | --- |
| idle | 8 | pętla oddechu w gardzie |
| walkForward | 16 | pełen cykl obu nóg |
| walkBackward | 12 | powolne cofanie w gardzie, twarz do przeciwnika |
| runForward | 16 | pełen cykl, dwa kontakty i dwie fazy lotu |
| backdash | 10 | wybicie, odskok, lądowanie; jednorazowo |
| jump | 8 | wybicie i wznoszenie |
| fall | 4 | opadanie |
| land | 6 | kontakt, amortyzacja, powrót |
| crouchEnter / crouchIdle | 6 / 4 | wejście jednorazowe / pętla |

Liczby są planem artystycznym, nie ograniczeniem. Postacie i sekwencje
mogą mieć różne długości i czasy klatek. Dodatkowe klatki muszą przedstawiać
nowe fazy ruchu. Kopie podobnych póz nie rozwiązują problemu cyklu.

### Wymagania chodu i biegu

- Osobny PNG dla każdej sekwencji; 16 klatek w układzie 4 × 4.
- Odczyt kolejno wierszami: 0–15. Cały arkusz to JEDEN pełen cykl.
- W pierwszej połowie bliższa noga przechodzi od kontaktu z przodu do tyłu.
  W drugiej połowie role nóg zamieniają się. Dalsze kończyny są ciemniejsze.
- Chód zawiera kontakt pięty, obciążenie, przejście nóg i uniesienie.
- Bieg zawiera kontakt, kompresję, wybicie, lot i powrót nogi.
- Ramiona pracują przeciwnie do nóg; brak efektu stale wysuniętej jednej nogi.
- Ta sama skala głowy, ubrania, kamera i punkt odniesienia sylwetki.
- Preferowana siatka 1536 × 1536, komórka 384 × 384; trzeba sprawdzić
  rzeczywisty plik. Gdy generator nie zachowa siatki, opisać osobne prostokąty.
- Podgląd odtwarza klatki i pozwala ocenić przejście ostatnia → pierwsza.
  Widok arkusza nie zastępuje oceny w ruchu.

### Neo — wzorzec drugiej postaci

Neo z Matrixa: krótkie ciemne włosy, wąskie czarne okulary, twarz bez brody,
czarny płaszcz z wysokim kołnierzem i rozciętymi połami do połowy łydki,
czarne spodnie i buty. Spokojna garda sztuk walki, widok w prawo.
Ta sama komiksowa kreska i proporcje co JustRandomePlayer.
Bez broni. Osobno czytelne dłonie i nogi, płaszcz nie ukrywa całego ruchu.
Na tym etapie generujemy jedną sylwetkę wzorcową, nie pełny zestaw animacji.

### Prompty v2

Pełne prompty faktycznie wysłane do wbudowanego ImageGen są zapisane
w `docs/sprite-prompts-v2.md`. Referencją stylu i wyglądu JustRandomePlayer
jest `game/fighters/just-randome-player/sprites-v1.png`.
Dla Neo referencja określa tylko styl — nie tożsamość ani strój.

### Wyniki i ocena v2

Dostarczone pliki (wbudowany ImageGen, po jednej korekcie każdego cyklu):

- `game/fighters/just-randome-player/walk-v2.png` — 16 póz, 1254 × 1254 RGBA.
- `game/fighters/just-randome-player/run-v2.png` — 16 póz, 1254 × 1254 RGBA.
- `game/fighters/neo/reference-v1.png` — jedna sylwetka, 1254 × 1254 RGBA.
- `docs/sprite-review/index.html` — lokalny odtwarzacz obu sekwencji,
  pauza, pojedyncze klatki i tempo 2–24 kl./s. Otwórz plik w przeglądarce;
  podgląd nie wymaga zmiany gry ani przebudowania obrazu Docker.
- `docs/sprite-review/frames.js` — prostokąty 16 sylwetek na arkusz,
  ustalone przez analizę połączonych pikseli alfa >128. PNG nie modyfikowano.

Kontrola: oba arkusze mają 16 głównych sylwetek; wszystkie trzy PNG
mają kanał alfa z wartościami od 0 do 255. Sprawdzono składnię JS podglądu
oraz poprawność zakresów prostokątów. Nie wykonano przeglądu animowanego
w narzędziu przeglądarkowym; cykle wymagają oceny użytkownika w odtwarzaczu.

**Status: materiały robocze do przeglądu, nie gotowe do integracji.**
Generator nie spełnił w pełni żądania cykli mimo korekty:
chód ma podobne pozy i wyraźnie mniejsze sylwetki w dolnym rzędzie
(wysokość ok. 251–254 px wobec 317–329 px w górnych rzędach).
Dwie dolne sylwetki dochodzą do dolnej krawędzi obrazu, więc nie można
uznać ich marginesu za poprawny. Zamiana nóg w chodzie pozostaje nieczytelna.
W biegu korekta wyraźniej rozróżnia przeciwne fazy nóg i ramion,
ale część póz powtarza się i wymaga korekty rytmu i przejść.
Sama liczba 16 klatek nie potwierdza płynności.

Dalsza praca artystyczna powinna skupić się na kilku jednoznacznych pozach
kluczowych obu kontaktów i przejścia nóg, następnie klatkach pośrednich;
nie na ponownym zwiększaniu liczby podobnych póz. Poprawki muszą utrzymać
stałą skalę i zapewnić margines pod stopami. Dopiero po akceptacji cykli
podłączymy je oraz wygenerujemy cofanie i odskok. Neo na tym etapie jest
wzorcem wyglądu, bez kodu postaci i bez animacji.
