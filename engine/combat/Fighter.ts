import { FighterAnimation, FighterDefinition } from './FighterDefinition';
import { FighterInput } from '../input/InputProvider';
import { Arena } from '../physics/Arena';

export class Fighter {
    private animationTicks = 0;
    private velocityY = 0;
    private crouching = false;
    private running = false;
    private dashTicks = 0;
    private dashDirection = 0;
    public animation: FighterAnimation = 'idle';
    public facing: -1 | 1 = 1;
    public grounded = false;
    constructor(public x: number, public y: number, public readonly definition: FighterDefinition) {
        for (const animation of Object.values(definition.sprite.animations)) {
            if (!animation.frames.length || animation.frames.some(frame =>
                !Number.isInteger(frame.durationTicks) || frame.durationTicks <= 0 ||
                !Number.isInteger(frame.sprite) || !definition.sprite.frames[frame.sprite])) {
                throw new Error(`Invalid animation for ${definition.id}`);
            }
        }
    }
    get wallInset(): number {
        return Math.max(this.width/2, ...this.definition.sprite.frames.map(frame => Math.max(frame.anchorX, frame.width-frame.anchorX)*(frame.scale ?? this.definition.sprite.scale)));
    }
    get width(): number { return this.definition.body.width; }
    get height(): number { return this.crouching ? this.definition.body.crouchHeight : this.definition.body.height; }
    faceOpponent(opponentX: number): void {
        if (opponentX !== this.x) {
            const facing = opponentX > this.x ? 1 : -1;
            if (facing !== this.facing) this.running = false;
            this.facing = facing;
        }
    }
    private get animationDuration(): number {
        return this.definition.sprite.animations[this.animation].frames.reduce((sum, frame) => sum + frame.durationTicks, 0);
    }
    update(dt: number, input: FighterInput, arena: Arena): void {
        const wasGrounded = this.grounded;
        this.crouching = wasGrounded && input.crouch && this.dashTicks === 0;
        const forward = input.direction === this.facing;
        if (!forward || this.crouching) this.running = false;
        if (wasGrounded && !this.crouching && this.dashTicks === 0) {
            if (input.doubleTap === this.facing && forward) this.running = true;
            else if (input.doubleTap === -this.facing && input.direction === -this.facing) {
                this.dashTicks = 18;
                this.dashDirection = -this.facing;
                this.velocityY = -160;
                this.running = false;
            } else if (input.jump) {
                this.velocityY = -this.definition.jumpSpeed;
                this.grounded = false;
            }
        }
        const dashing = this.dashTicks > 0;
        const previousX = this.x;
        const speed = this.crouching ? 0 : this.running ? this.definition.runSpeed : forward ? this.definition.walkSpeed : this.definition.backwardSpeed;
        const movement = dashing ? this.dashDirection * this.definition.backdashSpeed : input.direction * speed;
        const halfWidth = Math.min(this.wallInset, arena.width / 2);
        this.x = Math.max(halfWidth, Math.min(arena.width - halfWidth, this.x + movement * dt));
        this.velocityY += arena.gravity * dt;
        this.y += this.velocityY * dt;
        this.grounded = this.y >= arena.floorY;
        if (this.grounded) { this.y = arena.floorY; this.velocityY = 0; }
        const moving = previousX !== this.x;
        let next: FighterAnimation;
        if (dashing) next = 'backdash';
        else if (!this.grounded) next = this.velocityY < 0 ? 'jump' : 'fall';
        else if (this.crouching) next = 'crouch';
        else if (moving) next = !forward ? 'walkBackward' : this.running ? 'run' : 'walk';
        else if (!wasGrounded || (this.animation === 'land' && this.animationTicks < this.animationDuration)) next = 'land';
        else next = 'idle';
        if (next !== this.animation) { this.animation = next; this.animationTicks = 0; }
        else this.animationTicks++;
        if (dashing) this.dashTicks--;
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
