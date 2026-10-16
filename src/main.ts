import { Fighter } from "../engine/combat/Fighter";
import { GameEngine } from "../engine/core/GameEngine";
import { GameLoop } from "../engine/core/loop/GameLoop";
import { GameLoopRunner } from "../engine/browser/loop/GameLoopRunner";
import { CanvasRenderer } from "../engine/browser/rendering/CanvasRenderer";
import { Game } from "../game/Game";
import { trainingFighter } from "../game/fighters/training/definition";

const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

const renderer = new CanvasRenderer(canvas);

const fighter = new Fighter(100, 100, trainingFighter);
const engine = new GameEngine(renderer, fighter);
const gameLoop = new GameLoop(engine);
const gameLoopRunner = new GameLoopRunner(gameLoop);

const game = new Game(gameLoopRunner);
renderer.loadSprite(trainingFighter.sprite.source)
    .then(() => game.start())
    .catch((error: unknown) => {
        console.error("Nie udało się wczytać sprite'a postaci", error);
        const message = document.createElement("p");
        message.textContent = "Nie udało się wczytać postaci. Odśwież stronę, aby spróbować ponownie.";
        message.style.color = "white";
        canvas.replaceWith(message);
    });
