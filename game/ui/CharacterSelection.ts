import { FighterDefinition } from '../../engine/combat/FighterDefinition';
import { Fighter } from '../../engine/combat/Fighter';
import { CanvasRenderer } from '../../engine/browser/rendering/CanvasRenderer';
import { Controls } from '../input/Controls';
import { CharacterSelectionState, handleSelectionKey, PlayerIndex } from './CharacterSelectionState';

export function keyLabel(code: string): string {
    const names: Record<string, string> = {
        ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓',
        NumpadEnter: 'Enter numeryczny', Enter: 'Enter', Space: 'Spacja',
    };
    return names[code] ?? code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ');
}

export async function selectCharacters(
    root: HTMLElement, roster: readonly FighterDefinition[], controls: Controls,
): Promise<[FighterDefinition, FighterDefinition]> {
    const state = new CharacterSelectionState(roster.length);
    const bindings = [controls.player1, controls.player2];
    root.innerHTML = `
        <header class="selection-header"><p class="eyebrow">LOCAL VERSUS · 2 GRACZY</p>
        <h1>WYBIERZ <span>ZAWODNIKA</span></h1>
        <p>Wybierzcie postacie. Arena ruszy, gdy obaj będziecie gotowi.</p></header>
        <div class="roster" aria-label="Dostępne postacie"></div>
        <div class="player-panels"></div>
        <p class="selection-status" role="status" aria-live="polite"></p>`;
    const rosterElement = root.querySelector('.roster')!;
    const cards = roster.map(definition => {
        const card = document.createElement('article');
        card.className = 'character-card';
        const canvas = document.createElement('canvas');
        canvas.width = 280; canvas.height = 280;
        canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', definition.name);
        const title = document.createElement('h2'); title.textContent = definition.name;
        const badges = document.createElement('div'); badges.className = 'choice-badges';
        card.append(canvas, title, badges); rosterElement.append(card);
        return {card, canvas, badges};
    });
    await Promise.all(cards.map(async ({canvas}, index) => {
        const definition = roster[index];
        const frame = definition.sprite.frames[definition.sprite.animations.idle.frames[0].sprite];
        const renderer = new CanvasRenderer(canvas);
        await renderer.loadSprite(frame.source ?? definition.sprite.source);
        renderer.render(new Fighter(140, 265, definition));
    }));

    return new Promise(resolve => {
        const panels = bindings.map((binding, index) => {
            const player = index as PlayerIndex;
            const panel = document.createElement('section');
            panel.className = `player-panel player-${index + 1}`;
            panel.setAttribute('aria-label', `Wybór gracza ${index + 1}`);
            const title = document.createElement('h2'); title.textContent = `GRACZ ${index + 1}`;
            const name = document.createElement('p'); name.className = 'selected-name';
            const hint = document.createElement('p'); hint.className = 'keys-hint';
            hint.textContent = `${keyLabel(binding.left)} / ${keyLabel(binding.right)} — wybór · ${keyLabel(binding.confirm)} — zatwierdź / zmień`;
            const actions = document.createElement('div'); actions.className = 'selection-actions';
            const previous = document.createElement('button'); previous.textContent = '←'; previous.setAttribute('aria-label', `Poprzednia postać gracza ${index+1}`);
            const next = document.createElement('button'); next.textContent = '→'; next.setAttribute('aria-label', `Następna postać gracza ${index+1}`);
            const confirm = document.createElement('button'); confirm.className = 'confirm-choice';
            previous.onclick = () => { state.move(player, -1); render(); };
            next.onclick = () => { state.move(player, 1); render(); };
            confirm.onclick = () => { state.confirm(player); render(); };
            actions.append(previous, next, confirm); panel.append(title, name, hint, actions);
            root.querySelector('.player-panels')!.append(panel);
            return {panel, name, previous, next, confirm};
        });
        let finished = false;
        function render(): void {
            if (finished) return;
            cards.forEach(({card, badges}, index) => {
                const players = state.selected.flatMap((selected, player) => selected === index ? [`P${player+1}`] : []);
                badges.textContent = players.join(' + ');
                card.classList.toggle('selected-p1', state.selected[0] === index);
                card.classList.toggle('selected-p2', state.selected[1] === index);
            });
            panels.forEach(({panel, name, previous, next, confirm}, player) => {
                name.textContent = roster[state.selected[player]].name;
                previous.disabled = next.disabled = state.ready[player];
                confirm.textContent = state.ready[player] ? 'GOTOWY ✓ · ZMIEŃ' : 'ZATWIERDŹ';
                panel.classList.toggle('ready', state.ready[player]);
            });
            const status = root.querySelector('.selection-status')!;
            status.textContent = state.complete ? 'Obaj gotowi — start!' : state.ready.some(Boolean)
                ? `Gracz ${state.ready[0] ? '1' : '2'} gotowy. Czekamy na drugiego gracza.`
                : 'Możecie wybrać tę samą postać.';
            if (state.complete) {
                finished = true;
                window.removeEventListener('keydown', onKeyDown);
                resolve([roster[state.selected[0]], roster[state.selected[1]]]);
            }
        }
        function onKeyDown(event: KeyboardEvent): void {
            if (finished) return;
            const mapped = bindings.some(binding => [binding.left, binding.right, binding.confirm].includes(event.code));
            if (!mapped) return;
            event.preventDefault();
            if (event.repeat) return;
            if (handleSelectionKey(state, bindings, event.code)) {
                render();
            }
        }
        window.addEventListener('keydown', onKeyDown);
        render();
    });
}
