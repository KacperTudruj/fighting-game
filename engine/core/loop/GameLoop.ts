import { GameLoopCallbacks } from "./GameLoopCallbacks";

export class GameLoop {
    private readonly fixedStepMs = 1000 / 60;
    private readonly maxUpdatesPerTick = 5;
    private readonly timeEpsilonMs = 1e-8;
    private previousTimestampMs: number | undefined;
    private accumulatorMs = 0;

    constructor(private readonly callbacks: GameLoopCallbacks) {}

    tick(timestampMs: number): void {
        if (this.previousTimestampMs === undefined) {
            this.previousTimestampMs = timestampMs;
            this.callbacks.render();
            return;
        }

        const elapsedMs = Math.min(
            Math.max(0, timestampMs - this.previousTimestampMs),
            this.fixedStepMs * this.maxUpdatesPerTick,
        );
        this.previousTimestampMs = timestampMs;
        this.accumulatorMs += elapsedMs;

        while (this.accumulatorMs + this.timeEpsilonMs >= this.fixedStepMs) {
            this.callbacks.update(this.fixedStepMs / 1000);
            this.accumulatorMs = Math.max(0, this.accumulatorMs - this.fixedStepMs);
        }

        this.callbacks.render();
    }
}
