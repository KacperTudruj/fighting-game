import { GameLoopCallbacks } from "./GameLoopCallbacks";

export class GameLoop {

    constructor(private readonly callbacks: GameLoopCallbacks) {}

    start(): void {
        const loop = () => {
            this.callbacks.update();
            this.callbacks.render();            
            
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}