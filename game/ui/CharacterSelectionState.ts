export type PlayerIndex = 0 | 1;

export function handleSelectionKey(
    state: CharacterSelectionState,
    bindings: readonly { left: string; right: string; confirm: string }[],
    code: string,
): boolean {
    let handled = false;
    bindings.forEach((binding, index) => {
        const player = index as PlayerIndex;
        if (code === binding.left) state.move(player, -1);
        else if (code === binding.right) state.move(player, 1);
        else if (code === binding.confirm) state.confirm(player);
        else return;
        handled = true;
    });
    return handled;
}

export class CharacterSelectionState {
    readonly selected: [number, number];
    readonly ready: [boolean, boolean] = [false, false];

    constructor(private readonly characterCount: number) {
        if (!Number.isInteger(characterCount) || characterCount < 1) throw new Error('Empty character roster');
        this.selected = [0, Math.min(1, characterCount - 1)];
    }

    get complete(): boolean { return this.ready[0] && this.ready[1]; }

    move(player: PlayerIndex, direction: -1 | 1): void {
        if (this.ready[player] || this.complete) return;
        this.selected[player] = (this.selected[player] + direction + this.characterCount) % this.characterCount;
    }

    confirm(player: PlayerIndex): void {
        if (!this.complete) this.ready[player] = !this.ready[player];
    }
}
