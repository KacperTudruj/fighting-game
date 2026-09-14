import { GameLoop } from "../../core/loop/GameLoop";

export class GameLoopRunner {
    
    constructor(private readonly gameLoop: GameLoop) {}

    start(): void {
        const loop = () => {
            this.gameLoop.tick();            
            
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}