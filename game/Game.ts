import { GameEngine } from "../engine/core/GameEngine";

export class Game {
    constructor(
        private readonly engine: GameEngine,
    ) {}

    start(): void {
        this.engine.start();
    }
}