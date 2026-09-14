import { Fighter } from "../combat/Fighter";
import { Renderer } from "../rendering/Renderer";
import { GameLoopCallbacks } from "./loop/GameLoopCallbacks";

export class GameEngine implements GameLoopCallbacks {

    constructor(
        private readonly renderer: Renderer,
        private readonly fighter: Fighter,
    ) {
    }

    update(deltaTimeSeconds: number): void {
        this.fighter.update(deltaTimeSeconds);
    }
    
    render(): void {
        this.renderer.clear();
        this.renderer.render(this.fighter);
    }
}
