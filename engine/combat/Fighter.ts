import { FighterAnimation, FighterDefinition } from "./FighterDefinition";

export class Fighter {
    private animationTicks = 0;
    private animation: FighterAnimation = "idle";

    constructor(
        public x: number,
        public y: number,
        public readonly definition: FighterDefinition,
    ) {}

    update(deltaTimeSeconds: number): void {
        this.x += this.definition.walkSpeed * deltaTimeSeconds;
        this.playAnimation(this.definition.walkSpeed === 0 ? "idle" : "walk");
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
