import { GameLoopRunner } from "../engine/browser/loop/GameLoopRunner";

export class Game {
    constructor(
        private readonly gameLoopRunner: GameLoopRunner
    ) {}

    start(): void {
        this.gameLoopRunner.start();
    }
}