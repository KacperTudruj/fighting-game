import { Fighter } from "../combat/Fighter";
import { Renderer } from "../rendering/Renderer";
import { GameLoopCallbacks } from "./loop/GameLoopCallbacks";

export class GameEngine implements GameLoopCallbacks {

    constructor(
        private readonly renderer: Renderer,
        private readonly fighter: Fighter,
    ) {
    }

    update(_deltaTimeSeconds: number): void {
        console.log("Engine update");
    }
    
    render(): void {
        this.renderer.clear();
        this.renderer.render(this.fighter);
    }
}
