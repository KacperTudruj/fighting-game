import { Renderer } from "../rendering/Renderer";
import { GameLoop } from "./loop/GameLoop";

export class GameEngine {

    constructor(
        private readonly renderer: Renderer,
        private readonly gameLoop: GameLoop,
    ) {
    }

    start(): void {
        console.log('Engine started');

        this.renderer.clear();
        this.gameLoop.start();
    }
}