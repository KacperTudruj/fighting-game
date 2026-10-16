import { FighterAnimation, FighterDefinition } from "./FighterDefinition";
import { Arena } from "../physics/Arena";

export class Fighter {
    private animationTicks = 0;
    private animation: FighterAnimation = "idle";
    private velocityY = 0;
    public facing: -1 | 1 = 1;

    get width(): number { return this.definition.sprite.frameWidth * this.definition.sprite.scale; }
    get height(): number { return this.definition.sprite.frameHeight * this.definition.sprite.scale; }

    constructor(
        public x: number,
        public y: number,
        public readonly definition: FighterDefinition,
    ) {}

    update(deltaTimeSeconds: number, direction: -1 | 0 | 1, arena: Arena): void {
        const previousX = this.x;
        this.x = Math.max(0, Math.min(Math.max(0, arena.width - this.width),
            this.x + direction * this.definition.walkSpeed * deltaTimeSeconds));
        if (direction !== 0) this.facing = direction;
        this.velocityY += arena.gravity * deltaTimeSeconds;
        this.y += this.velocityY * deltaTimeSeconds;
        if (this.y + this.height >= arena.floorY) {
            this.y = arena.floorY - this.height;
            this.velocityY = 0;
        }
        this.playAnimation(this.x === previousX ? "idle" : "walk");
        this.animationTicks++;
    }

    playAnimation(animation: FighterAnimation): void {
        if (this.animation !== animation) {
            this.animation = animation;
            this.animationTicks = 0;
        }
    }

    get spriteFrame(): number {
        const animation = this.definition.sprite.animations[this.animation];
        return animation.frames[
            Math.floor(this.animationTicks / animation.frameDuration) % animation.frames.length
        ];
    }
}
