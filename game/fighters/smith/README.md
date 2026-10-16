# Agent Smith

Trzecia postać dostępna dla obu graczy w menu wyboru.

- `sprites-v1.png`: 36 póz wygenerowanych wbudowanym ImageGen.
- `sprites-v1-bounds.ts`: prostokąty sylwetek zmierzone z kanału alfa.
- `definition.ts`: prędkości, rozmiar ciała i przypisania animacji.

Wzorzec stylu: JustRandomePlayer. Smith ma powiększoną głowę, krótsze
kończyny, ciemny garnitur, biały kołnierzyk, krawat, okulary i słuchawkę.
Docelowe proporcje: około 4,5 głowy wysokości. Generowane pozy nadal
wymagają oceny płynności; liczba klatek nie gwarantuje pełnego cyklu nóg.

Arkusz ma 1254 × 1254 px i rzeczywisty kanał alfa. Klatki używają własnych
prostokątów, a nie zakładanej równej siatki. Wymiary źródła nie są rozmiarem
kolizji. Skala wyświetlania: 0,95.

## Prompt użyty do generacji

```text
Use case: stylized-concept. Create a transparent PNG 2D fighting-game sprite atlas of AGENT SMITH from The Matrix. Reference image establishes ONLY the cohesive game ART STYLE AND PROPORTIONS, not identity or clothes. Smith: clean-shaven angular square jaw, slicked-back brown hair, narrow black sunglasses, stern expression, black suit jacket and trousers, white shirt, black tie, small coiled earpiece, black dress shoes. Strong friendly arcade caricature: total standing body 4.5 HEAD HEIGHTS tall, oversized expressive head approximately 22% of total standing height, slightly enlarged fists and shoes, short compact limbs, matching reference's caricature. NOT realistic adult anatomy, NOT slender 7-head proportions. Crisp charcoal outlines, flat colors and exactly two-tone cel shading, no gradients or texture. Exactly 6 columns x6 rows, 36 complete separate figures, identical head size and character scale in ALL cells. Side view facing RIGHT with face slightly three-quarter visible, no text/grid/background/shadows. True alpha transparency. Generous gutters, every full figure including feet contained. Prefer 1536 square. Rows ordered left to right: row1 six subtle IDLE guard breathing poses; row2 six WALK keyposes of one complete alternating leg cycle: near foot forward contact, legs passing, far foot forward contact, legs passing, near foot recovery, near forward precontact; row3 six RUN keyposes, two opposing strides with far leg leading in half the frames, both passing and flight poses, arms counter-swing; row4 six poses: jump anticipation, rising push-off, airborne apex, descending, landing compression, standing recovery; row5 six BACKWARD WALK poses, retreating LEFT while always facing RIGHT, weight shifts rearward in guarded stance; row6 first three are standing-to-crouch then two deep crouch guard poses, last three are BACKDASH poses: backward lean, airborne backward hop, low landing. Preserve exact same square jaw, hair, glasses, head size, clothing and body proportions throughout. Do not shrink bottom rows. Favor readable distinct poses over minor costume detail.
```
