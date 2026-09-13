import { GameEngine } from "../engine/core/GameEngine";
import { Game } from "../game/Game";

const engine = new GameEngine();
const game = new Game(engine);
game.start();