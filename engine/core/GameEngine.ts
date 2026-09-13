import { Renderer } from "../rendering/Renderer";
import { GameLoop } from "./GameLoop";

export class GameEngine {
    private readonly gameLoop: GameLoop;

    constructor(
        private readonly renderer: Renderer,
    ) {
        this.gameLoop = new GameLoop();
    }

    start(): void {
        console.log('Engine started');

        this.renderer.clear();
        this.gameLoop.start();
    }
}