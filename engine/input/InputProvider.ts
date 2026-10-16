export interface FighterInput {
    direction: -1 | 0 | 1;
    run: boolean;
    crouch: boolean;
    jump: boolean;
}
export interface InputProvider { sample(): FighterInput; }
