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
