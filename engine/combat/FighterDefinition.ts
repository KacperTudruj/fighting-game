export type FighterAnimation = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'land' | 'crouch' | 'walkBackward' | 'backdash';
export interface SpriteFrame { x: number; y: number; width: number; height: number; anchorX: number; anchorY: number; source?: string; scale?: number; }
export interface AnimationDefinition {
    frames: readonly { sprite: number; durationTicks: number }[];
    loop: boolean;
}
export interface FighterDefinition {
    id: string;
    name: string;
    walkSpeed: number;
    runSpeed: number;
    backwardSpeed: number;
    backdashSpeed: number;
    jumpSpeed: number;
    body: { width: number; height: number; crouchHeight: number };
    sprite: {
        source: string;
        scale: number;
        frames: readonly SpriteFrame[];
        animations: Record<FighterAnimation, AnimationDefinition>;
    };
}
