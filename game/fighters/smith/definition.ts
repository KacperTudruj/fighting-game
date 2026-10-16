import { FighterDefinition, AnimationDefinition } from '../../../engine/combat/FighterDefinition';
import source from './sprites-v1.png?url';
import { bounds } from './sprites-v1-bounds';
const clip = (sprites: number[], durationTicks: number, loop = true): AnimationDefinition => ({
    loop, frames: sprites.map(sprite => ({sprite, durationTicks})),
});
export const smith: FighterDefinition = {
    id: 'smith', name: 'Agent Smith',
    walkSpeed: 180, runSpeed: 340, backwardSpeed: 95, backdashSpeed: 380, jumpSpeed: 1050,
    body: {width: 96, height: 210, crouchHeight: 115},
    sprite: {
        source, scale: 0.95,
        frames: bounds.map(([x,y,right,bottom]) => ({
            x, y, width: right-x, height: bottom-y, anchorX: (right-x)/2, anchorY: bottom-y,
        })),
        animations: {
            idle: clip([0,1,2,3,4,5],12), walk: clip([6,7,8,9,10,11],7),
            run: clip([12,13,14,15,16,17],5), jump: clip([19,20],6,false),
            fall: clip([21],6,false), land: clip([22,23],5,false),
            crouch: clip([31,32],18), walkBackward: clip([24,25,26,27,28,29],8),
            backdash: clip([33,34,35],6,false),
        },
    },
};
