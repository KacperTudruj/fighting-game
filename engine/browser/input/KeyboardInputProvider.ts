import { FighterInput, InputProvider } from '../../input/InputProvider';
export interface KeyboardBindings { left: string; right: string; run: string; jump: string; crouch: string; }
export class KeyboardInputProvider implements InputProvider {
    private readonly pressed = new Set<string>();
    private jumpPending = false;
    constructor(private readonly bindings: KeyboardBindings) {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('blur', this.clear);
        document.addEventListener('visibilitychange', this.clear);
    }
    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (!Object.values(this.bindings).includes(event.code)) return;
        event.preventDefault();
        if (event.code === this.bindings.jump && !this.pressed.has(event.code) && !event.repeat) this.jumpPending = true;
        this.pressed.add(event.code);
    };
    private readonly onKeyUp = (event: KeyboardEvent): void => { this.pressed.delete(event.code); };
    private readonly clear = (): void => { this.pressed.clear(); this.jumpPending = false; };
    sample(): FighterInput {
        const result: FighterInput = {
            direction: (Number(this.pressed.has(this.bindings.right)) - Number(this.pressed.has(this.bindings.left))) as -1 | 0 | 1,
            run: this.pressed.has(this.bindings.run), crouch: this.pressed.has(this.bindings.crouch), jump: this.jumpPending,
        };
        this.jumpPending = false;
        return result;
    }
    dispose(): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('blur', this.clear);
        document.removeEventListener('visibilitychange', this.clear);
        this.clear();
    }
}
