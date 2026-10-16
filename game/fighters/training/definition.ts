import { FighterDefinition } from "../../../engine/combat/FighterDefinition";
import spriteSource from "./sprites.svg?url";

export const trainingFighter: FighterDefinition = {
    id: "training",
    name: "Treningowy wojownik",
    walkSpeed: 120,
    sprite: {
        source: spriteSource,
        frameWidth: 64,
        frameHeight: 96,
        columns: 4,
        scale: 2,
        animations: {
            idle: { frames: [0, 1], frameDuration: 24 },
            walk: { frames: [2, 3], frameDuration: 10 },
        },
    },
};
