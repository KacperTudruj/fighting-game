import { GameLoopCallbacks } from "../../core/loop/GameLoopCallbacks";
import { CanvasRenderer } from "../rendering/CanvasRenderer";

export class GameLoopRunner implements GameLoopCallbacks {
    
    constructor(private readonly renderer: CanvasRenderer) {}

    update(): void {
        console.log("Update");        
    }

    render(): void {
        console.log("Render");

        this.renderer.render();
    }
}