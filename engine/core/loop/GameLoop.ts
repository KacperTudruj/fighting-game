import { GameLoopCallbacks } from "./GameLoopCallbacks";

export class GameLoop {

    constructor(private readonly callbacks: GameLoopCallbacks) {}

    tick(): void {
        this.callbacks.update();
        this.callbacks.render();
    }
}