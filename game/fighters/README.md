# Dodawanie postaci

Przykład docelowy: `just-randome-player/definition.ts`.
Przykład zastępczy: `training/definition.ts` (proste pozy zamiast pełnego zestawu).
Styl i prompt generowania: `docs/SPRITES.md`.

1. Utwórz folder postaci z PNG RGBA i plikiem `definition.ts`.
2. Określ `id`, `name`, `walkSpeed`, `runSpeed`, `jumpSpeed`.
3. `body` opisuje rozmiar kolizji w pikselach świata: `width`, `height`,
   `crouchHeight`. Jest niezależny od wielkości grafiki. Dla obecnej postaci
   szerokość obejmuje wszystkie pozy, żeby sprite nie wychodził za ściany.
4. W `sprite.frames` zdefiniuj prostokąty źródłowe `x`, `y`, `width`, `height`.
   `anchorX` i `anchorY` to punkt stóp wewnątrz prostokąta. Silnik utrzymuje
   go w pozycji zawodnika. Nie ma wymogu równej siatki ani limitu klatek.
5. W `animations` przypisz `idle`, `walk`, `run`, `jump`, `fall`, `land`,
   `crouch`. Każda sekwencja ma `loop` oraz niepustą listę
   `{ sprite: indeks, durationTicks: dodatnia_liczba_całkowita }`.
   Jedna jednostka czasu to krok symulacji 60 Hz. Animacja jednorazowa
   pozostaje na ostatniej klatce do zmiany stanu. Klip może używać dowolnej
   liczby klatek i różnych czasów, także wielokrotnie tej samej grafiki.
6. Podmień import definicji w `src/main.ts`. Mechanika wybiera nazwy animacji;
   dodanie nowego zachowania wymaga również jego obsługi w silniku.

Sterowanie z `public/controls.txt` (format `KeyboardEvent.code`):

| Akcja | Gracz 1 | Gracz 2 (przygotowana konfiguracja) |
| --- | --- | --- |
| Lewo / prawo | A / D | strzałki lewo / prawo |
| Bieg (przytrzymaj razem z kierunkiem) | lewy Shift | prawy Shift |
| Skok (nowe naciśnięcie) | W | strzałka w górę |
| Kucanie (przytrzymaj) | S | strzałka w dół |

Demo ma jednego zawodnika, korzystającego z gracza 1. Przeciwne kierunki
znoszą się. Kucanie działa na podłożu i blokuje chód oraz skok.
W powietrzu można zmieniać kierunek. Skok nie powtarza się od przytrzymania.
Po zmianach w Dockerze: `docker compose up -d --build`, potem odśwież stronę.
Wymiary areny i grawitacja: `game/arena.ts`.

Testy: `node tests/movement.mjs`, `npx tsc --noEmit`, `npx vite build`.
