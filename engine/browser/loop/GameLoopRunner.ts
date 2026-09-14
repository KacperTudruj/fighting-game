import { GameLoop } from "../../core/loop/GameLoop";

export class GameLoopRunner {
    
    constructor(private readonly gameLoop: GameLoop) {}

    start(): void {
        const loop = (timestampMs: number) => {
            this.gameLoop.tick(timestampMs);
            
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}
