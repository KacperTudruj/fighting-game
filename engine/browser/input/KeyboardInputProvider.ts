import { FighterInput, InputProvider } from '../../input/InputProvider';
export interface KeyboardBindings { left: string; right: string; jump: string; crouch: string; }
export class KeyboardInputProvider implements InputProvider {
    private readonly pressed = new Set<string>();
    private jumpPending = false;
    private taps: (-1 | 1)[] = [];
    private tick = 0;
    private lastTap = { direction: 0, tick: -Infinity };
    constructor(private readonly bindings: KeyboardBindings, private readonly doubleTapTicks = 12) {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('blur', this.clear);
        document.addEventListener('visibilitychange', this.clear);
    }
    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (!Object.values(this.bindings).includes(event.code)) return;
        event.preventDefault();
        if (!this.pressed.has(event.code) && !event.repeat) {
            if (event.code === this.bindings.jump) this.jumpPending = true;
            if (event.code === this.bindings.left) this.taps.push(-1);
            if (event.code === this.bindings.right) this.taps.push(1);
        }
        this.pressed.add(event.code);
    };
    private readonly onKeyUp = (event: KeyboardEvent): void => { this.pressed.delete(event.code); };
    private readonly clear = (): void => {
        this.pressed.clear(); this.jumpPending = false; this.taps = [];
        this.lastTap = { direction: 0, tick: -Infinity };
    };
    sample(): FighterInput {
        let doubleTap: -1 | 0 | 1 = 0;
        for (const direction of this.taps) {
            if (this.lastTap.direction === direction && this.tick - this.lastTap.tick <= this.doubleTapTicks) {
                doubleTap = direction;
                this.lastTap = {direction: 0, tick: -Infinity};
            } else this.lastTap = {direction, tick: this.tick};
        }
        this.taps = []; this.tick++;
        const direction = (Number(this.pressed.has(this.bindings.right)) - Number(this.pressed.has(this.bindings.left))) as -1 | 0 | 1;
        const result: FighterInput = { direction, doubleTap: direction === doubleTap ? doubleTap : 0,
            crouch: this.pressed.has(this.bindings.crouch), jump: this.jumpPending };
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
