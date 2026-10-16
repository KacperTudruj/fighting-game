import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
async function load(path, transform = value => value) {
    const code = ts.transpileModule(transform(fs.readFileSync(path, 'utf8')), {compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
    return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}
const {Fighter} = await load('engine/combat/Fighter.ts');
const {justRandomePlayer: definition} = await load('game/fighters/just-randome-player/definition.ts', source => source.replace("import source from './sprites-v1.png?url';", "const source = 'sprite.png';"));
const {parseControls} = await load('game/input/Controls.ts');
const controls = parseControls(fs.readFileSync('public/controls.txt', 'utf8'));
assert.equal(controls.player1.jump, 'KeyW');
assert.equal(controls.player2.crouch, 'ArrowDown');
assert.throws(() => parseControls(fs.readFileSync('public/controls.txt', 'utf8').replace('KeyW', 'KeyA')));
const arena = {width:1280,floorY:640,gravity:1800};
const neutral = {direction:0,run:false,jump:false,crouch:false};
const fighter = new Fighter(200,100,definition);
for(let i=0;i<90;i++) fighter.update(1/60,neutral,arena);
assert.equal(fighter.y,640); assert.equal(fighter.grounded,true);
fighter.update(1/60,{...neutral,direction:1},arena);
assert.equal(fighter.x,203); assert.equal(fighter.animation,'walk');
fighter.update(1/60,{...neutral,direction:1,run:true},arena);
assert.ok(Math.abs(fighter.x - (203+340/60))<1e-8); assert.equal(fighter.animation,'run');
const x = fighter.x;
fighter.update(1/60,{...neutral,direction:1,crouch:true},arena);
assert.equal(fighter.x,x); assert.equal(fighter.height,115); assert.equal(fighter.y,640); assert.equal(fighter.animation,'crouch');
fighter.update(1/60,neutral,arena); assert.equal(fighter.height,210);
fighter.update(1/60,{...neutral,jump:true},arena);
assert.ok(fighter.y<640); assert.equal(fighter.animation,'jump');
fighter.update(1/60,{...neutral,jump:true},arena);
assert.ok(fighter.y>615); // A second press in air must not reset the upward velocity.
let fell=false, landed=false;
for(let i=0;i<90;i++){fighter.update(1/60,neutral,arena); fell ||= fighter.animation==='fall'; landed ||= fighter.animation==='land';}
assert.ok(fell && landed); assert.equal(fighter.y,640); assert.equal(fighter.animation,'idle');
for(let i=0;i<500;i++)fighter.update(1/60,{...neutral,direction:-1,run:true},arena);
assert.equal(fighter.x,definition.body.width/2); assert.equal(fighter.facing,-1);
for(let i=0;i<500;i++)fighter.update(1/60,{...neutral,direction:1,run:true},arena);
assert.equal(fighter.x,1280-definition.body.width/2);
const custom = structuredClone(definition);
custom.sprite.animations.idle={loop:false,frames:[{sprite:0,durationTicks:1},{sprite:1,durationTicks:2},{sprite:2,durationTicks:1}]};
const animation = new Fighter(200,640,custom); animation.grounded=true;
assert.equal(animation.spriteFrame,0);
animation.update(1/60,neutral,arena); assert.equal(animation.spriteFrame,1);
animation.update(1/60,neutral,arena); assert.equal(animation.spriteFrame,1);
for(let i=0;i<20;i++)animation.update(1/60,neutral,arena);
assert.equal(animation.spriteFrame,2);
custom.sprite.animations.idle.frames=[]; assert.throws(()=>new Fighter(0,0,custom));
globalThis.window=new EventTarget(); globalThis.document=new EventTarget();
const {KeyboardInputProvider}=await load('engine/browser/input/KeyboardInputProvider.ts');
const input=new KeyboardInputProvider(controls.player1);
function key(type,code,repeat=false){const event=new Event(type,{cancelable:true});event.code=code;event.repeat=repeat;window.dispatchEvent(event);}
key('keydown','KeyW');assert.equal(input.sample().jump,true);assert.equal(input.sample().jump,false);
key('keydown','KeyW',true);assert.equal(input.sample().jump,false);
key('keyup','KeyW');key('keydown','KeyW');assert.equal(input.sample().jump,true);
key('keydown','KeyA');key('keydown','KeyD');assert.equal(input.sample().direction,0);
window.dispatchEvent(new Event('blur'));assert.deepEqual(input.sample(),neutral);input.dispose();
console.log('PASS: controls, walking/running, crouch collision height, jump/no double jump, landing, walls, variable frame timing, one-shot animation, keyboard press edges.');
