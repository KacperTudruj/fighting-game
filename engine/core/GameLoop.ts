export class GameLoop {
    start(): void {
        console.log("Game loop started");

        const loop = () => {
            this.update();
            this.render();            
            
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(() => {
            loop();
        });
    }

    private update(): void {
        console.log("Update");
    }
    private render(): void {
        console.log("Render");
    }

}