import { GameEngine } from "../engine/core/GameEngine";
import { GameLoop } from "../engine/core/loop/GameLoop";
import { GameLoopRunner } from "../engine/browser/loop/GameLoopRunner";
import { CanvasRenderer } from "../engine/browser/rendering/CanvasRenderer";
import { Game } from "../game/Game";

const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

const gameLoopRunner = new GameLoopRunner();
const gameLoop = new GameLoop(gameLoopRunner);

const renderer = new CanvasRenderer(canvas);
const engine = new GameEngine(
    renderer,
    gameLoop
);

const game = new Game(engine);
game.start();