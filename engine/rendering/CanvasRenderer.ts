import { Renderer } from "./Renderer";

export class CanvasRenderer implements Renderer {

    constructor(private readonly canvas: HTMLCanvasElement) {}

    clear(): void {
         const context = this.canvas.getContext('2d');

          if (!context) {
            throw new Error('Canvas context is not available');
        }

        context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height,
        );
    }

    render(): void {
        // Implementation for rendering on the canvas
    }

}

    