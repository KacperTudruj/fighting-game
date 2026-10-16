import { FighterAnimation, FighterDefinition } from './FighterDefinition';
import { FighterInput } from '../input/InputProvider';
import { Arena } from '../physics/Arena';

export class Fighter {
    private animationTicks = 0;
    private velocityY = 0;
    private crouching = false;
    public animation: FighterAnimation = 'idle';
    public facing: -1 | 1 = 1;
    public grounded = false;
    // x/y denote the center of the feet, independent of the visual frame.
    constructor(public x: number, public y: number, public readonly definition: FighterDefinition) {
        for (const animation of Object.values(definition.sprite.animations)) {
            if (!animation.frames.length || animation.frames.some(frame =>
                !Number.isInteger(frame.durationTicks) || frame.durationTicks <= 0 ||
                !Number.isInteger(frame.sprite) || !definition.sprite.frames[frame.sprite])) {
                throw new Error(`Invalid animation for ${definition.id}`);
            }
        }
    }
    get width(): number { return this.definition.body.width; }
    get height(): number { return this.crouching ? this.definition.body.crouchHeight : this.definition.body.height; }
    private get animationDuration(): number {
        return this.definition.sprite.animations[this.animation].frames.reduce((sum, frame) => sum + frame.durationTicks, 0);
    }
    update(dt: number, input: FighterInput, arena: Arena): void {
        const wasGrounded = this.grounded;
        this.crouching = wasGrounded && input.crouch;
        if (wasGrounded && input.jump && !this.crouching) {
            this.velocityY = -this.definition.jumpSpeed;
            this.grounded = false;
        }
        const previousX = this.x;
        const speed = this.crouching ? 0 : input.run ? this.definition.runSpeed : this.definition.walkSpeed;
        const halfWidth = Math.min(this.width / 2, arena.width / 2);
        this.x = Math.max(halfWidth, Math.min(arena.width - halfWidth, this.x + input.direction * speed * dt));
        if (input.direction) this.facing = input.direction;
        this.velocityY += arena.gravity * dt;
        this.y += this.velocityY * dt;
        this.grounded = this.y >= arena.floorY;
        if (this.grounded) { this.y = arena.floorY; this.velocityY = 0; }
        const moving = previousX !== this.x;
        let next: FighterAnimation;
        if (!this.grounded) next = this.velocityY < 0 ? 'jump' : 'fall';
        else if (this.crouching) next = 'crouch';
        else if (moving) next = input.run ? 'run' : 'walk';
        else if (!wasGrounded || (this.animation === 'land' && this.animationTicks < this.animationDuration)) next = 'land';
        else next = 'idle';
        if (next !== this.animation) { this.animation = next; this.animationTicks = 0; }
        else this.animationTicks++;
    }
    get spriteFrame(): number {
        const animation = this.definition.sprite.animations[this.animation];
        let tick = animation.loop ? this.animationTicks % this.animationDuration : Math.min(this.animationTicks, this.animationDuration - 1);
        for (const frame of animation.frames) {
            if (tick < frame.durationTicks) return frame.sprite;
            tick -= frame.durationTicks;
        }
        return animation.frames[animation.frames.length - 1].sprite;
    }
}
