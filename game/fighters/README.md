# Dodawanie postaci

Przykład: `training/definition.ts` i `training/sprites.svg`.

1. Skopiuj katalog `training` pod nową nazwą.
2. Przygotuj przezroczysty arkusz PNG z klatkami jednakowej wielkości.
   Przykład ma cztery klatki 64 × 96 px w jednym wierszu:
   0–1 to stanie, 2–3 to chód. Klatki numerujemy od zera,
   od lewej do prawej, potem kolejne wiersze.
3. Podmień import grafiki w definicji, np. `import spriteSource from "./sprites.png?url"`.
4. Ustaw unikalne `id`, nazwę, `walkSpeed` (piksele na sekundę),
   rozmiar klatki, liczbę kolumn i skalę wyświetlania.
5. W `animations` ustaw numery klatek i `frameDuration`:
   dodatnią całkowitą liczbę kroków symulacji 60 Hz na klatkę.
   Każda animacja musi zawierać przynajmniej jedną istniejącą klatkę.
6. W `src/main.ts` podmień import i używaną definicję `trainingFighter`.

Nie trzeba zmieniać silnika ani renderera przy dodawaniu grafiki.
SVG jest tylko prostym przykładowym arkuszem; PNG działa tak samo.
Zachowaj tę samą pozycję stóp w każdej klatce, aby postać nie skakała.
Pozycja zawodnika oznacza lewy górny róg klatki.

Demo korzysta z klawiszy gracza 1 z `public/controls.txt` (domyślnie A/D).
Klawisze zapisujemy jako `KeyboardEvent.code`, np. `KeyJ`, `KeyL`.
Plik zawiera też ustawienia gracza 2, przygotowane na kolejny etap.
Po zmianie pliku odśwież stronę; w Dockerze najpierw wykonaj
`docker compose up -d --build`. Niepoprawna konfiguracja zatrzymuje start
gry z komunikatem; szczegóły są w konsoli przeglądarki.

Postać spada na podłogę i zatrzymuje się przy obu brzegach areny.
Wymiary areny i grawitację określa `game/arena.ts`.
Granice fizyczne są obecnie prostokątem całej klatki sprite'a.
