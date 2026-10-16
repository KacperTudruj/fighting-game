export type FighterAnimation = "idle" | "walk";

export interface AnimationDefinition {
    frames: readonly number[];
    frameDuration: number;
}

export interface FighterDefinition {
    id: string;
    name: string;
    walkSpeed: number;
    sprite: {
        source: string;
        frameWidth: number;
        frameHeight: number;
        columns: number;
        scale: number;
        animations: Record<FighterAnimation, AnimationDefinition>;
    };
}
