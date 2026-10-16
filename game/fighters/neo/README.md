# Neo — gracz 2

Postać jest podłączona do gry. `reference-v1.png` jest wzorcem wyglądu,
`sprites-v1.png` arkuszem 36 póz, `sprites-v1-bounds.ts` zawiera ich
prostokąty, a `definition.ts` mapuje je na stany silnika.

Obsługiwane animacje: stanie, chód, bieg, skok, opadanie, lądowanie,
kucanie, cofanie oraz odskok w tył. Generowane pozy pozostają prototypem.

Sterowanie z `public/controls.txt`: strzałki lewo/prawo, góra skok,
dół kucanie. Dwuklik kierunku do przeciwnika i przytrzymanie oznacza bieg;
dwuklik kierunku od przeciwnika oznacza jeden odskok. Przód zależy od
położenia drugiego zawodnika. Neo zawsze patrzy na niego.

Styl, dalsze wymagania animacji i historia: `docs/SPRITES.md`.
