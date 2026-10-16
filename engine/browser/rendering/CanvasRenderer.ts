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
        const image = this.sprites.get(sprite.source);
        if (!image) return;

        context.imageSmoothingEnabled = false;
        context.save();
        context.translate(fighter.x + (fighter.facing === -1 ? fighter.width : 0), fighter.y);
        context.scale(fighter.facing, 1);
        context.drawImage(
            image,
            (fighter.spriteFrame % sprite.columns) * sprite.frameWidth,
            Math.floor(fighter.spriteFrame / sprite.columns) * sprite.frameHeight,
            sprite.frameWidth,
            sprite.frameHeight,
            0,
            0,
            sprite.frameWidth * sprite.scale,
            sprite.frameHeight * sprite.scale,
        );
        context.restore();
    }

}
