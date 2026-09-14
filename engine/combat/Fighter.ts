export class Fighter {
    private readonly horizontalSpeed = 120;

    constructor(
        public x: number,
        public y: number,
    ) {}

    update(deltaTimeSeconds: number): void {
        this.x += this.horizontalSpeed * deltaTimeSeconds;
    }
}
