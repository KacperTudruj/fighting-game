export type FighterAnimation = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'land' | 'crouch';
export interface SpriteFrame { x: number; y: number; width: number; height: number; anchorX: number; anchorY: number; }
export interface AnimationDefinition {
    frames: readonly { sprite: number; durationTicks: number }[];
    loop: boolean;
}
export interface FighterDefinition {
    id: string;
    name: string;
    walkSpeed: number;
    runSpeed: number;
    jumpSpeed: number;
    body: { width: number; height: number; crouchHeight: number };
    sprite: {
        source: string;
        scale: number;
        frames: readonly SpriteFrame[];
        animations: Record<FighterAnimation, AnimationDefinition>;
    };
}
