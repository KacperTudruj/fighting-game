export interface FighterInput {
    direction: -1 | 0 | 1;
    doubleTap: -1 | 0 | 1;
    crouch: boolean;
    jump: boolean;
}
export interface InputProvider { sample(): FighterInput; }
