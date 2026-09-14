import { Fighter } from "../combat/Fighter";

export interface Renderer {
    clear(): void;
    render(fighter: Readonly<Fighter>): void;
}
