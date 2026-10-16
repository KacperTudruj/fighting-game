import retreatSource from './retreat-v1.png?url';
import { bounds as retreatBounds } from './retreat-v1-bounds';
import { FighterDefinition, AnimationDefinition } from '../../../engine/combat/FighterDefinition';
import source from './sprites-v1.png?url';
// Bounds measured from opaque connected silhouettes; no bitmap modification.
const bounds = [
[48,10,172,230],[259,7,385,229],[468,8,594,230],[676,9,802,230],[885,10,1011,230],[1094,8,1220,230],
[44,242,172,453],[244,241,377,453],[447,241,576,452],[642,241,809,452],[848,242,1019,452],[1075,243,1199,453],
[27,465,186,657],[215,464,395,659],[425,464,614,658],[635,463,826,645],[847,462,1027,643],[1052,465,1228,657],
[50,722,178,874],[231,705,386,877],[461,664,600,880],[677,663,799,879],[894,661,1006,846],[1105,661,1213,827],
[52,879,161,1047],[254,886,379,1075],[467,895,596,1075],[670,932,787,1075],[876,949,1001,1076],[1079,886,1218,1075],
[47,1061,171,1248],[259,1080,368,1246],[466,1094,574,1246],[669,1105,786,1246],[877,1113,993,1247],[1088,1110,1207,1247],
];
const clip = (sprites: number[], durationTicks: number, loop = true): AnimationDefinition => ({
    loop, frames: sprites.map(sprite => ({ sprite, durationTicks })),
});
export const justRandomePlayer: FighterDefinition = {
    id: 'just-randome-player', name: 'JustRandomePlayer',
    walkSpeed: 180, runSpeed: 340, backwardSpeed: 95, backdashSpeed: 380, jumpSpeed: 1050,
    body: { width: 96, height: 210, crouchHeight: 115 },
    sprite: {
        source, scale: 1,
        frames: [...bounds.map(([x,y,right,bottom]) => ({ x, y, width: right-x, height: bottom-y, anchorX: (right-x)/2, anchorY: bottom-y })), ...retreatBounds.map(([x,y,right,bottom]) => ({ x, y, width:right-x, height:bottom-y, anchorX:(right-x)/2, anchorY:bottom-y, source:retreatSource, scale:0.51 }))],
        animations: {
            walkBackward: clip([36,37,38,39], 9), backdash: clip([40,41,42,43], 4, false),
            idle: clip([0,1,2,3,4,5], 12), walk: clip([6,7,8,9,10,11], 7),
            run: clip([12,13,14,15,16,17], 5), jump: clip([20,21,22,23], 5, false),
            fall: clip([24,25], 7, false), land: clip([26,27,28,29], 3, false),
            crouch: clip([34,35], 18),
        },
    },
};
