import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

async function load(file) {
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
        compilerOptions: {module: ts.ModuleKind.ESNext},
    }).outputText;
    return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}
const {CharacterSelectionState, handleSelectionKey} = await load('game/ui/CharacterSelectionState.ts');
const {parseControls} = await load('game/input/Controls.ts');
const text = fs.readFileSync('public/controls.txt', 'utf8');
const controls = parseControls(text);
const bindings = [controls.player1, controls.player2];
assert.equal(bindings[0].confirm, 'KeyF');
assert.equal(bindings[1].confirm, 'NumpadEnter');
assert.throws(() => parseControls(text.replace('NumpadEnter', 'KeyF')));
assert.throws(() => parseControls(text.replace('player1.confirm=KeyF', '')));
assert.throws(() => new CharacterSelectionState(0));

const state = new CharacterSelectionState(3);
assert.deepEqual(state.selected, [0,1]);
assert.equal(handleSelectionKey(state, bindings, 'Enter'), false);
assert.deepEqual(state.ready, [false,false]);
handleSelectionKey(state, bindings, 'KeyA');
assert.deepEqual(state.selected, [2,1]); // P1 wraps to Smith, P2 stays unchanged.
handleSelectionKey(state, bindings, 'KeyF');
assert.equal(state.complete, false); // One confirmation must never start the arena.
handleSelectionKey(state, bindings, 'KeyD');
assert.equal(state.selected[0], 2); // Ready choice is locked.
handleSelectionKey(state, bindings, 'KeyF');
handleSelectionKey(state, bindings, 'KeyD');
assert.deepEqual(state.selected, [0,1]); // Can undo readiness before the other player confirms.
handleSelectionKey(state, bindings, 'ArrowLeft');
assert.deepEqual(state.selected, [0,0]); // Mirror match is legal.
handleSelectionKey(state, bindings, 'NumpadEnter');
assert.deepEqual(state.ready, [false,true]);
assert.equal(state.complete, false);
handleSelectionKey(state, bindings, 'KeyF');
assert.equal(state.complete, true);
handleSelectionKey(state, bindings, 'KeyA');
handleSelectionKey(state, bindings, 'NumpadEnter');
assert.deepEqual(state.selected, [0,0]);
assert.equal(state.complete, true); // Completed selection is terminal.
const remapped = [{left:'KeyJ',right:'KeyL',confirm:'Space'},bindings[1]];
const custom = new CharacterSelectionState(3);
assert.equal(handleSelectionKey(custom, remapped, 'KeyF'), false);
handleSelectionKey(custom, remapped, 'KeyL');
handleSelectionKey(custom, remapped, 'Space');
assert.deepEqual(custom.selected, [1,1]);
assert.deepEqual(custom.ready, [true,false]);
console.log('PASS: independent selection, wraparound, ready/undo, same character, two confirmations, NumpadEnter vs Enter, remapped keys and invalid configuration.');
