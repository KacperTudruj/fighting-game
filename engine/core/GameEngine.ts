import { Fighter } from "../combat/Fighter";
import { Renderer } from "../rendering/Renderer";
import { GameLoopCallbacks } from "./loop/GameLoopCallbacks";
import { InputProvider } from "../input/InputProvider";
import { Arena } from "../physics/Arena";

export class GameEngine implements GameLoopCallbacks {

    constructor(
        private readonly renderer: Renderer,
        private readonly fighter: Fighter,
        private readonly input: InputProvider,
        private readonly arena: Arena,
    ) {
    }

    update(deltaTimeSeconds: number): void {
        this.fighter.update(deltaTimeSeconds, this.input.horizontalAxis(), this.arena);
    }
    
    render(): void {
        this.renderer.clear();
        this.renderer.render(this.fighter);
    }
}
