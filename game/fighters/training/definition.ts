import { FighterDefinition } from '../../../engine/combat/FighterDefinition';
import source from './sprites.svg?url';
const idle = { loop: true, frames: [0,1].map(sprite => ({sprite, durationTicks:24})) };
const walk = { loop: true, frames: [2,3].map(sprite => ({sprite, durationTicks:10})) };
export const trainingFighter: FighterDefinition = {
    id: 'training', name: 'Treningowy wojownik', walkSpeed:120, runSpeed:240, backwardSpeed:80, backdashSpeed:380, jumpSpeed:950,
    body: {width:80,height:180,crouchHeight:100},
    sprite: {
        source, scale:2,
        frames: [0,1,2,3].map(i => ({x:i*64,y:0,width:64,height:96,anchorX:32,anchorY:90})),
        animations: {idle,walk,walkBackward:walk,backdash:walk,run:walk,jump:idle,fall:idle,land:idle,crouch:idle},
    },
};
