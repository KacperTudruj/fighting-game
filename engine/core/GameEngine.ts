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

        this.gameLoop.start();
    }

    update(): void {
        console.log("Engine update");
    }
    
    render(): void {
        this.renderer.clear();
        this.renderer.render();
    }
}