export interface PlayerControls { left: string; right: string; jump: string; crouch: string; confirm: string; }
export interface Controls { player1: PlayerControls; player2: PlayerControls; }
const actions = ['left', 'right', 'jump', 'crouch', 'confirm'] as const;
export function parseControls(text: string): Controls {
    const values = new Map<string, string>();
    const required = ['player1', 'player2'].flatMap(player => actions.map(action => `${player}.${action}`));
    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const match = /^([^=]+)=([^=]+)$/.exec(line);
        if (!match) throw new Error(`Niepoprawny wpis controls.txt: ${line}`);
        const key = match[1].trim(), value = match[2].trim();
        if (!required.includes(key) || values.has(key) || !/^[A-Za-z][A-Za-z0-9]*$/.test(value)) throw new Error(`Niepoprawne ustawienie: ${line}`);
        values.set(key, value);
    }
    const player = (id: string): PlayerControls => {
        const result = {} as PlayerControls;
        for (const action of actions) {
            const key = values.get(`${id}.${action}`);
            if (!key) throw new Error(`Brak klawisza: ${id}.${action}`);
            result[action] = key;
        }
        if (new Set(Object.values(result)).size !== actions.length) throw new Error(`Konflikt klawiszy: ${id}`);
        return result;
    };
    const result = { player1: player('player1'), player2: player('player2') };
    const menuKeys = [result.player1, result.player2].flatMap(keys => [keys.left, keys.right, keys.confirm]);
    if (new Set(menuKeys).size !== menuKeys.length) throw new Error('Klawisze wyboru i zatwierdzania obu graczy muszą być różne');
    return result;
}
