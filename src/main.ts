import { Fighter } from "../engine/combat/Fighter";
import { GameEngine } from "../engine/core/GameEngine";
import { GameLoop } from "../engine/core/loop/GameLoop";
import { GameLoopRunner } from "../engine/browser/loop/GameLoopRunner";
import { CanvasRenderer } from "../engine/browser/rendering/CanvasRenderer";
import { Game } from "../game/Game";

const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

const renderer = new CanvasRenderer(canvas);

const fighter = new Fighter(100, 100);
const engine = new GameEngine(renderer, fighter);
const gameLoop = new GameLoop(engine);
const gameLoopRunner = new GameLoopRunner(gameLoop);

const game = new Game(gameLoopRunner);
game.start();
