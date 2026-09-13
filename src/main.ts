import { GameEngine } from "../engine/core/GameEngine";
import { CanvasRenderer } from "../engine/rendering/CanvasRenderer";
import { Game } from "../game/Game";

const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

const renderer = new CanvasRenderer(canvas);
const engine = new GameEngine(renderer);
const game = new Game(engine);
game.start();