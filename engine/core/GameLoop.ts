export class GameLoop {
    start(): void {
        requestAnimationFrame(this.tick);
    }

    private tick = (): void => {
        requestAnimationFrame(this.tick);
    };
}