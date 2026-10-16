import { InputProvider } from "../../input/InputProvider";

export class KeyboardInputProvider implements InputProvider {
    private readonly pressed = new Set<string>();

    constructor(private readonly bindings: { left: string; right: string }) {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("blur", this.clear);
        document.addEventListener("visibilitychange", this.clear);
    }

    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (event.code === this.bindings.left || event.code === this.bindings.right) {
            event.preventDefault();
            this.pressed.add(event.code);
        }
    };

    private readonly onKeyUp = (event: KeyboardEvent): void => {
        this.pressed.delete(event.code);
    };

    private readonly clear = (): void => { this.pressed.clear(); };

    horizontalAxis(): -1 | 0 | 1 {
        return (Number(this.pressed.has(this.bindings.right)) -
            Number(this.pressed.has(this.bindings.left))) as -1 | 0 | 1;
    }

    dispose(): void {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        window.removeEventListener("blur", this.clear);
        document.removeEventListener("visibilitychange", this.clear);
        this.clear();
    }
}
