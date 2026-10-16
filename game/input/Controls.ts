export interface PlayerControls { left: string; right: string; }
export interface Controls { player1: PlayerControls; player2: PlayerControls; }

export function parseControls(text: string): Controls {
    const values = new Map<string, string>();
    const required = ["player1.left", "player1.right", "player2.left", "player2.right"];
    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const match = /^([^=]+)=([^=]+)$/.exec(line);
        if (!match) throw new Error(`Niepoprawny wpis controls.txt: ${line}`);
        const key = match[1].trim();
        const value = match[2].trim();
        if (!required.includes(key) || values.has(key) || !/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
            throw new Error(`Niepoprawne lub powtórzone ustawienie: ${line}`);
        }
        values.set(key, value);
    }
    const player = (id: string): PlayerControls => {
        const left = values.get(`${id}.left`);
        const right = values.get(`${id}.right`);
        if (!left || !right || left === right) throw new Error(`Brak lub konflikt klawiszy: ${id}`);
        return { left, right };
    };
    return { player1: player("player1"), player2: player("player2") };
}
