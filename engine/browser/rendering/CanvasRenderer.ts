import { Fighter } from "../../combat/Fighter";
import { Renderer } from "../../rendering/Renderer";

export class CanvasRenderer implements Renderer {
    private readonly sprites = new Map<string, HTMLImageElement>();

    constructor(private readonly canvas: HTMLCanvasElement) {}

    async loadSprite(source: string): Promise<void> {
        if (this.sprites.has(source)) return;
        const image = new Image();
        image.src = source;
        await image.decode();
        this.sprites.set(source, image);
    }

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

    render(fighter: Readonly<Fighter>): void {
        const context = this.canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas context is not available");
        }

        const sprite = fighter.definition.sprite;
        const frame = sprite.frames[fighter.spriteFrame];
        const image = this.sprites.get(frame.source ?? sprite.source);
        if (!image) return;

        const scale = frame.scale ?? sprite.scale;
        context.imageSmoothingEnabled = true;
        context.save();
        context.translate(fighter.x, fighter.y);
        context.scale(fighter.facing, 1);
        context.drawImage(
            image,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            -frame.anchorX * scale,
            -frame.anchorY * scale,
            frame.width * scale,
            frame.height * scale,
        );
        context.restore();
    }

}
