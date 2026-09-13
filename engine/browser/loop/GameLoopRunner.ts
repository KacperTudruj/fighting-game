import { GameLoopCallbacks } from "../../core/loop/GameLoopCallbacks";

export class GameLoopRunner implements GameLoopCallbacks {
    
    update(): void {
        console.log("Update");
    }

    render(): void {
        console.log("Render");
    }
}