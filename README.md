# 2D Fighting Game

A browser-based 2D fighting game built around a reusable fighting game engine.

The project is intentionally split into two distinct parts:

* **Engine** - generic fighting game runtime responsible for simulation, input processing, collision detection, frame-based combat, animation and rendering.
* **Game** - the actual game built on top of the engine. It defines fighters, moves, assets, rules, controls and other game-specific behavior.

The goal is to keep the engine independent enough that, if it turns out to be useful beyond this project, it can eventually be extracted into a standalone library.

---

## Project Goals

The primary goal is not only to build a playable fighting game, but to build a **data-driven fighting game engine**.

The engine should make it possible to define a fighter using configuration and assets rather than hard-coding individual fighters into the engine.

For example, a move should be describable as:

```json
{
  "name": "Heavy Punch",
  "startup": 8,
  "active": 4,
  "recovery": 18,
  "damage": 20,
  "hitstun": 12,
  "blockstun": 8
}
```

The engine should then understand what these values mean and execute the move correctly.

The game should only need to provide the actual fighter and move definitions.

---

# Architecture

The project follows a strict separation between the **Fighting Game Engine** and the **Game**.

```text
┌─────────────────────────────────────────────────────┐
│                       GAME                           │
│                                                     │
│  Fighters     Moves     Assets     Rules     Input  │
│     │           │         │          │        │     │
│     └───────────┴─────────┴──────────┴────────┘     │
│                         │                           │
│                  Engine Interfaces                 │
└─────────────────────────┼───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                  FIGHTING GAME ENGINE               │
│                                                     │
│  Game Loop                                          │
│  Simulation                                          │
│  State Machine                                      │
│  Frame System                                       │
│  Collision / Hit Detection                          │
│  Input Processing                                   │
│  Animation                                          │
│  Renderer                                           │
│  Physics / Movement                                 │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
                    HTML5 Canvas
```

The dependency direction is intentional:

```text
Game → Engine
```

The engine must **never depend on the game**.

---

# Engine

The engine contains everything that is required to run a frame-based fighting game but does not contain any game-specific content.

A useful mental model is:

> The engine knows how fighting games work. The game knows what this particular fighting game is.

## Engine responsibilities

The engine is responsible for:

* game loop
* fixed-timestep simulation
* frame progression
* fighter state machines
* movement
* jumping
* crouching
* blocking
* attacks
* startup / active / recovery frames
* hit detection
* hitboxes
* hurtboxes
* collision detection
* damage calculation
* hitstun
* blockstun
* knockback
* animation playback
* input processing
* rendering
* camera
* debug visualization
* engine events

The engine should not know:

* who the characters are
* what a character looks like
* what moves a character has
* what the game's UI looks like
* what the game's rules are
* which keys the game uses
* which assets belong to which fighter

---

# Engine Interfaces

The engine communicates with the game through interfaces.

The engine defines the contracts.

The game provides the implementations.

For example:

```typescript
export interface FighterDefinition {
    id: string;
    name: string;
    maxHealth: number;
    moves: MoveDefinition[];
}
```

The engine can consume a `FighterDefinition` without knowing anything about the actual fighter.

The game can then provide:

```typescript
const fighter: FighterDefinition = {
    id: 'fighter-01',
    name: 'Fighter One',
    maxHealth: 1000,
    moves: [...]
};
```

The important rule is:

```text
Engine defines WHAT is required.
Game defines HOW this particular game provides it.
```

---

# Suggested Engine Interfaces

The exact interfaces may evolve as the project grows, but the initial architecture should revolve around contracts similar to these:

```typescript
interface FighterDefinition {
    id: string;
    name: string;
    maxHealth: number;
    movement: MovementDefinition;
    moves: MoveDefinition[];
}

interface MoveDefinition {
    id: string;
    startupFrames: number;
    activeFrames: number;
    recoveryFrames: number;

    damage: number;
    hitstunFrames: number;
    blockstunFrames: number;

    frames: MoveFrameDefinition[];
}

interface MoveFrameDefinition {
    frame: number;
    hitboxes: HitboxDefinition[];
    hurtboxes?: HurtboxDefinition[];
}

interface HitboxDefinition {
    x: number;
    y: number;
    width: number;
    height: number;
    damage?: number;
}

interface HurtboxDefinition {
    x: number;
    y: number;
    width: number;
    height: number;
}
```

These are **engine contracts**, not game-specific models.

---

# Rendering

Rendering belongs to the **engine**.

The game should not need to know how a fighter is drawn to the screen.

The engine should expose a renderer abstraction:

```typescript
interface Renderer {
    render(scene: RenderScene): void;
}
```

The initial implementation can use HTML5 Canvas:

```text
Engine
  │
  ▼
Renderer interface
  │
  ▼
CanvasRenderer
  │
  ▼
HTML5 Canvas
```

This keeps rendering replaceable.

For example, the project could eventually have:

```text
CanvasRenderer
WebGLRenderer
DebugRenderer
```

without changing the fighting game simulation itself.

---

# Game Loop

The engine owns the game loop.

Conceptually:

```text
┌──────────────┐
│ Input Update │
└──────┬───────┘
       ↓
┌──────────────┐
│ Simulation   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Collisions   │
└──────┬───────┘
       ↓
┌──────────────┐
│ State Update │
└──────┬───────┘
       ↓
┌──────────────┐
│ Render       │
└──────────────┘
       │
       └──────→ next frame
```

The engine should target a deterministic **60 FPS simulation**.

The important distinction is between:

* simulation time
* rendering

The combat system should be based on frames rather than browser rendering speed.

For example:

```text
60 FPS

Frame 1
Frame 2
Frame 3
...
Frame 60
```

A move can therefore precisely define:

```text
Startup:   8 frames
Active:    4 frames
Recovery: 18 frames
```

---

# Frame-Based Combat

Combat is fundamentally frame-based.

An attack consists of:

```text
Startup → Active → Recovery
```

Example:

```text
Frame:   01 02 03 04 05 06 07 08 09 10 11 12 ... 30
         ├────────────┤ ├──────────┤ ├──────────────┤
            STARTUP        ACTIVE        RECOVERY
```

During startup:

* the attack cannot hit

During active frames:

* hitboxes are enabled
* collision detection can occur

During recovery:

* the attack cannot hit
* the fighter remains committed to the move

This allows precise fighting-game mechanics such as:

* frame advantage
* punishes
* whiff recovery
* block pressure
* combos
* cancels

---

# Hitboxes and Hurtboxes

The engine owns collision detection.

A fighter can have multiple collision regions.

### Hurtbox

Defines an area that can be hit.

```text
┌─────────┐
│         │
│ HURTBOX │
│         │
└─────────┘
```

### Hitbox

Defines an area that can hit another fighter.

```text
┌──────────┐
│  HITBOX  │
└──────────┘
```

During an active attack:

```text
Fighter A             Fighter B

    🧍                    🧍
   /│\  ███████ →        /│\
   / \   HITBOX          / \
```

The engine determines whether the hitbox intersects a valid hurtbox.

The game should only provide the hitbox definitions.

---

# Fighter State Machine

Fighters are controlled by an engine state machine.

Example states:

```text
Idle
Walking
Crouching
Jumping

AttackStartup
AttackActive
AttackRecovery

Blocking
Blockstun

Hitstun
Knockdown
GettingUp
```

The engine is responsible for transitioning between states.

Example:

```text
Idle
 │
 │ attack input
 ▼
AttackStartup
 │
 │ startup complete
 ▼
AttackActive
 │
 │ active complete
 ▼
AttackRecovery
 │
 │ recovery complete
 ▼
Idle
```

The game should not manually manipulate these states.

Instead, it should configure the fighter and let the engine execute the rules.

---

# Input

Input is an engine concern, but key bindings are a game concern.

The engine can expose an abstraction:

```typescript
interface InputProvider {
    isPressed(action: string): boolean;
    wasPressed(action: string): boolean;
}
```

The game can map physical keys to logical actions:

```text
A       → MOVE_LEFT
D       → MOVE_RIGHT
S       → CROUCH
J       → LIGHT_ATTACK
K       → HEAVY_ATTACK
SPACE   → BLOCK
```

This keeps the engine independent of keyboard layouts and allows other input methods later.

Possible future implementations:

```text
KeyboardInputProvider
GamepadInputProvider
NetworkInputProvider
AIInputProvider
```

---

# Animation

Animation is handled by the engine, while animation data and assets are provided by the game.

The engine should support frame-based animation definitions such as:

```json
{
  "animation": "heavy-punch",
  "frames": [
    {
      "sprite": "heavy-punch-01",
      "duration": 3
    },
    {
      "sprite": "heavy-punch-02",
      "duration": 2
    },
    {
      "sprite": "heavy-punch-03",
      "duration": 4
    }
  ]
}
```

This allows visual animation and combat frames to be controlled independently where necessary.

---

# Game

The `game/` directory contains everything specific to this particular game.

Examples:

* fighter definitions
* move definitions
* sprites
* sounds
* stages
* character-specific behavior
* game rules
* UI
* menus
* HUD
* character selection
* game modes
* controls
* game configuration

The game can use the engine but should not modify its internals.

---

# Data-Driven Fighters

Fighters should primarily be defined through data.

Example:

```text
game/
└── fighters/
    └── fighter-01/
        ├── fighter.json
        ├── sprites/
        └── moves/
            ├── light-punch.json
            ├── heavy-punch.json
            ├── kick.json
            └── special.json
```

Example:

```json
{
  "id": "fighter-01",
  "name": "Fighter One",
  "health": 1000,

  "movement": {
    "walkSpeed": 4,
    "jumpVelocity": 12
  }
}
```

A move can then be configured separately:

```json
{
  "id": "heavy-punch",
  "startupFrames": 8,
  "activeFrames": 4,
  "recoveryFrames": 18,
  "damage": 20,
  "hitstunFrames": 12,
  "blockstunFrames": 8
}
```

The engine consumes this data.

---

# Editor

The project is expected to eventually include a browser-based editor for creating and tuning fighters.

The editor is **not part of the engine runtime**.

It is a development tool built on top of the engine and game data.

```text
┌───────────────────────┐
│       EDITOR          │
│                       │
│ Character             │
│ Move                  │
│ Animation             │
│ Frame Timeline        │
│ Hitboxes              │
│ Hurtboxes             │
└───────────┬───────────┘
            │
            ▼
       Game Data
            │
            ▼
         Engine
```

The editor should eventually allow:

* selecting a fighter
* selecting a move
* editing startup frames
* editing active frames
* editing recovery frames
* editing damage
* editing hitstun
* editing blockstun
* editing hitboxes
* editing hurtboxes
* positioning sprites
* previewing animations
* stepping through frames
* visualizing collisions
* exporting/importing fighter definitions

The ultimate goal is to make creating a new fighter primarily a **data and asset task**, rather than a programming task.

---

# Debug Mode

The engine should provide a debug rendering mode.

Example:

```text
[ ] Show hitboxes
[ ] Show hurtboxes
[ ] Show collision boxes
[ ] Show fighter state
[ ] Show current frame
[ ] Show frame data
[ ] Show input history
[ ] Show FPS
```

During development, a fighter might look like:

```text
          🧍
        ┌─────┐
        │     │  ← hurtbox
        └─────┘

             ┌───────────┐
             │  HITBOX   │
             └───────────┘
```

Debug rendering is implemented by the engine, because the engine owns collision and simulation data.

---

# Proposed Directory Structure

```text
/
├── engine/
│   ├── core/
│   │   ├── GameEngine.ts
│   │   ├── GameLoop.ts
│   │   └── Simulation.ts
│   │
│   ├── combat/
│   │   ├── Fighter.ts
│   │   ├── Attack.ts
│   │   ├── Hitbox.ts
│   │   ├── Hurtbox.ts
│   │   ├── CollisionSystem.ts
│   │   └── CombatSystem.ts
│   │
│   ├── state/
│   │   ├── FighterState.ts
│   │   └── StateMachine.ts
│   │
│   ├── input/
│   │   ├── InputProvider.ts
│   │   └── InputManager.ts
│   │
│   ├── animation/
│   │   ├── Animation.ts
│   │   └── AnimationPlayer.ts
│   │
│   ├── rendering/
│   │   ├── Renderer.ts
│   │   ├── CanvasRenderer.ts
│   │   └── DebugRenderer.ts
│   │
│   ├── physics/
│   │   ├── MovementSystem.ts
│   │   └── Physics.ts
│   │
│   └── interfaces/
│       ├── FighterDefinition.ts
│       ├── MoveDefinition.ts
│       ├── Renderer.ts
│       └── InputProvider.ts
│
├── game/
│   ├── fighters/
│   │   ├── fighter-01/
│   │   └── fighter-02/
│   │
│   ├── stages/
│   ├── rules/
│   ├── ui/
│   ├── assets/
│   └── Game.ts
│
├── editor/
│   ├── components/
│   ├── timeline/
│   ├── hitbox-editor/
│   └── Editor.ts
│
├── public/
│
├── tests/
│   ├── engine/
│   └── game/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

# Dependency Rules

The most important architectural rule is:

```text
game → engine
editor → game + engine

engine → nothing from game
```

The engine must never contain imports such as:

```typescript
import FighterOne from '../../game/fighters/FighterOne';
```

Instead:

```typescript
engine.start({
    fighters: gameFighters
});
```

The engine receives implementations/data through interfaces.

This keeps the engine extractable.

---

# Example Runtime

The final application should conceptually work like this:

```typescript
const game = new FightingGame({
    engine: new FightingGameEngine({
        renderer: new CanvasRenderer(),
        input: new KeyboardInputProvider()
    }),

    fighters: [
        fighterOne,
        fighterTwo
    ]
});

game.start();
```

The game configures the engine.

The engine runs the simulation.

The renderer displays the result.

---

# Docker

The project should run entirely in a container.

Development:

```bash
docker compose up
```

Then open:

```text
http://localhost:8080
```

The initial version should not require a backend.

The browser application can be served as a static application through a lightweight web server such as nginx.

---

# Testing

The engine should be testable without a browser wherever possible.

Combat logic should be deterministic and testable with unit tests.

Examples:

```text
Attack with 8 startup frames
→ must not hit on frame 7

Attack with 8 startup frames
→ may hit on frame 8

Attack with 4 active frames
→ hitbox exists only during active frames

Attack enters recovery
→ hitbox is disabled

Blocked attack
→ defender receives blockstun

Successful hit
→ defender receives hitstun and damage

Hitbox does not intersect hurtbox
→ no hit

Hitbox intersects hurtbox
→ hit event is generated
```

This is particularly important because the engine should eventually be reusable outside the game itself.

---

# Long-Term Vision

The project starts as a single browser game.

However, the architecture intentionally leaves open the possibility of turning the engine into a standalone reusable package.

Potential future structure:

```text
fighting-game-engine/
```

and:

```text
my-fighting-game/
```

where the game depends on the engine:

```text
my-fighting-game
        │
        ▼
fighting-game-engine
```

The engine could eventually provide:

* frame-based combat
* fighter state machines
* hitbox/hurtbox collision
* animation system
* input abstraction
* rendering abstraction
* physics/movement
* combat events
* debug tools

while the game provides:

* characters
* moves
* sprites
* sounds
* stages
* rules
* UI
* game modes

The project therefore treats the engine as a **first-class product**, even if the first user of that engine is this game.


peon resume
peon notifications on
peon volume 0.7