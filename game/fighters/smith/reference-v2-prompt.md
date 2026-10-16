# Agent Smith — poprawka tożsamości

Narzędzie: wbudowany ImageGen. Pierwsza generacja bez referencji graficznej
JustRandomePlayer, żeby uniknąć kopiowania jego tożsamości. Kolejna korekta
używa pierwszego wyniku jako referencji twarzy Smitha.

## Pierwsza generacja

```text
Use case: stylized-concept. Create ONE full-body character model reference of AGENT SMITH as portrayed by HUGO WEAVING in the original 1999 film THE MATRIX, reinterpreted as a polished 2D arcade fighting-game caricature. Identity is crucial: recognizable Hugo Weaving Agent Smith face, long angular facial structure, high forehead, receding hairline at temples, neatly slicked-back dark brown hair close to skull (NO voluminous quiff), strong cheekbones, long prominent straight nose, thin tight lips with characteristic stern slightly disdainful expression, broad angular jaw, completely clean shaven. Narrow rectangular black agent sunglasses, small coiled earpiece. Black formal suit jacket with FULL LENGTH SLEEVES covering arms to wrists, pale green-tinted white shirt and dark tie, matching suit trousers and formal black leather shoes. Stylization: approximately 4.5 head-heights standing tall, visibly enlarged head and slightly enlarged fists, compact limbs; crisp charcoal comic outlines and controlled two-tone cel shading. Preserve film character identity despite caricature. Cinematic original Matrix color grading translated into flat art: muted olive/emerald green shadows, cool desaturated slightly green-tinted skin, dark green-black suit highlights and pale green shirt. Keep skin recognizably human; not neon green, not a monster. Full body side-on facing RIGHT, face slightly three-quarter toward viewer, composed intimidating martial-arts guard, both hands visible, feet grounded, readable silhouette. SINGLE figure centered with generous transparent padding on all sides. Actual transparent alpha background. No scene, no floor shadow, no poster, no captions, no logo, no weapons, no alternate views. Do not draw a young generic gamer, beard, muscular bare forearms, rolled sleeves, spiky haircut, or a round youthful face. This must look like film Agent Smith, with arcade proportions, not a reskinned existing game character.
```

Pierwszy wynik zachował filmową tożsamość, ale miał zbyt realistyczne
proporcje i poświatę w tle, dlatego wymagał korekty.

## Korekta proporcji i tła

```text
Edit this exact Agent Smith illustration. Preserve the recognizable Hugo Weaving Agent Smith FACE and receding slicked hair, sunglasses, full-sleeved suit, earpiece, muted olive Matrix palette. TWO corrections: 1) transform body proportions to an arcade caricature, full standing height exactly about FOUR AND A HALF HEAD HEIGHTS; enlarge head substantially relative to torso and shorten torso and legs, compact stocky cartoon game proportions, slightly enlarged hands and shoes. Keep facial identity mature and angular. Current figure is much too tall and realistically proportioned. Head should be about 22 percent of the full character height, not 13 percent. 2) REMOVE ALL BACKGROUND AND GLOW, produce an isolated clean character on ACTUAL alpha transparency, including between limbs. No halo, gradients behind head, shadows or scenic elements. Simplify shading to crisp comic base plus one shadow tone, reduce tiny face texture. Full body guard facing right three-quarter, both shoes visible, centered with substantial transparent padding, square canvas. Do not change face into another person. ONE figure only.
```

Wybrany wynik: `reference-v2.png`. Wzorzec do oceny przez użytkownika;
animacje i definicja postaci w grze pozostają na razie bez zmian.
