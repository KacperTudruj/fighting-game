export interface GameLoopCallbacks {
    update(deltaTimeSeconds: number): void;
    render(): void;
}
