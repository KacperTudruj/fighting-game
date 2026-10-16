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

const fighter = new Fighter(100, 100, justRandomePlayer);
canvas.style.background = `linear-gradient(to bottom, #222 0px, #222 ${arena.floorY}px, #475569 ${arena.floorY}px, #475569 100%)`;

async function start(): Promise<void> {
    const response = await fetch(`${import.meta.env.BASE_URL}controls.txt`, { cache: "no-store" });
    if (!response.ok) throw new Error("Nie udało się wczytać controls.txt");
    const controls = parseControls(await response.text());
    await renderer.loadSprite(justRandomePlayer.sprite.source);
    const input = new KeyboardInputProvider(controls.player1);
    const engine = new GameEngine(renderer, fighter, input, arena);
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
