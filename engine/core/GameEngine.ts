import { Fighter } from '../combat/Fighter';
import { Renderer } from '../rendering/Renderer';
import { GameLoopCallbacks } from './loop/GameLoopCallbacks';
import { InputProvider } from '../input/InputProvider';
import { Arena } from '../physics/Arena';
export interface Player { fighter: Fighter; input: InputProvider; }
export class GameEngine implements GameLoopCallbacks {
    constructor(private readonly renderer: Renderer, private readonly players: readonly [Player, Player], private readonly arena: Arena) {
        this.faceOpponents();
    }
    private faceOpponents(): void {
        const [a,b] = this.players;
        a.fighter.faceOpponent(b.fighter.x);
        b.fighter.faceOpponent(a.fighter.x);
    }
    update(dt: number): void {
        this.faceOpponents();
        for (const player of this.players) player.fighter.update(dt, player.input.sample(), this.arena);
        // Bodies cannot walk through each other; jumping above the other body can swap sides.
        const [a,b] = this.players.map(player => player.fighter);
        if (a.y > b.y - b.height && b.y > a.y - a.height) {
            const distance = (a.width + b.width) / 2;
            const overlap = distance - Math.abs(a.x-b.x);
            if (overlap > 0) {
                const left = a.x < b.x || (a.x === b.x && a.facing === 1) ? a : b;
                const right = left === a ? b : a;
                left.x = Math.max(left.wallInset, left.x-overlap/2);
                right.x = Math.min(this.arena.width-right.wallInset, right.x+overlap/2);
                const remaining = distance-(right.x-left.x);
                if (remaining > 0) {
                    if (left.x === left.wallInset) right.x = left.x+distance;
                    else left.x = right.x-distance;
                }
            }
        }
        this.faceOpponents();
    }
    render(): void {
        this.renderer.clear();
        for (const player of this.players) this.renderer.render(player.fighter);
    }
}
