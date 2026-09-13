import { Renderer } from "../rendering/Renderer";

export class GameEngine {

    constructor(
        private readonly renderer: Renderer,
    ) {}

    start(): void {
        console.log('Engine started');

        this.renderer.clear();
    }
}