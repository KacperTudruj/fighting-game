import { neo } from '../game/fighters/neo/definition';
import { Fighter } from "../engine/combat/Fighter";
import { GameEngine } from "../engine/core/GameEngine";
import { GameLoop } from "../engine/core/loop/GameLoop";
import { GameLoopRunner } from "../engine/browser/loop/GameLoopRunner";
import { CanvasRenderer } from "../engine/browser/rendering/CanvasRenderer";
import { Game } from "../game/Game";
import { justRandomePlayer } from "../game/fighters/just-randome-player/definition";
import { KeyboardInputProvider } from "../engine/browser/input/KeyboardInputProvider";
import { parseControls } from "../game/input/Controls";
import { arena } from "../game/arena";

const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

const renderer = new CanvasRenderer(canvas);

const fighter = new Fighter(320, arena.floorY, justRandomePlayer);
const opponent = new Fighter(960, arena.floorY, neo);
fighter.grounded = opponent.grounded = true;
canvas.style.background = `linear-gradient(to bottom, #222 0px, #222 ${arena.floorY}px, #475569 ${arena.floorY}px, #475569 100%)`;

async function start(): Promise<void> {
    const response = await fetch(`${import.meta.env.BASE_URL}controls.txt`, { cache: "no-store" });
    if (!response.ok) throw new Error("Nie udało się wczytać controls.txt");
    const controls = parseControls(await response.text());
    const definitions = [justRandomePlayer, neo];
    const sources = new Set(definitions.flatMap(def => [def.sprite.source, ...def.sprite.frames.map(frame => frame.source ?? def.sprite.source)]));
    await Promise.all([...sources].map(source => renderer.loadSprite(source)));
    const input = new KeyboardInputProvider(controls.player1);
    const input2 = new KeyboardInputProvider(controls.player2);
    const engine = new GameEngine(renderer, [{fighter, input}, {fighter: opponent, input: input2}], arena);
    const game = new Game(new GameLoopRunner(new GameLoop(engine)));
    game.start();
}

start()
    .catch((error: unknown) => {
        console.error("Nie udało się uruchomić gry", error);
        const message = document.createElement("p");
        message.textContent = "Nie udało się uruchomić gry. Sprawdź controls.txt i dostępność grafiki; szczegóły w konsoli.";
        message.style.color = "white";
        canvas.replaceWith(message);
    });
