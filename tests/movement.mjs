import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import assert from 'node:assert/strict';
const cache = new Map();
async function moduleURL(file) {
    file=path.resolve(file);
    if(cache.has(file))return cache.get(file);
    let code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
    const matches=[...code.matchAll(/from\s+['"]([^'"]+)['"]/g)];
    for(const match of matches){
        const spec=match[1];
        const url=spec.endsWith('?url') ? 'data:text/javascript,export default '+encodeURIComponent(JSON.stringify(spec)) : await moduleURL(path.resolve(path.dirname(file),spec+'.ts'));
        code=code.replace(match[0],`from '${url}'`);
    }
    const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(file,url);return url;
}
async function load(file){return import(await moduleURL(file));}
const {Fighter}=await load('engine/combat/Fighter.ts');
const {GameEngine}=await load('engine/core/GameEngine.ts');
const {justRandomePlayer: definition}=await load('game/fighters/just-randome-player/definition.ts');
const {neo}=await load('game/fighters/neo/definition.ts');
const {parseControls}=await load('game/input/Controls.ts');
const controls=parseControls(fs.readFileSync('public/controls.txt','utf8'));
assert.equal(controls.player2.jump,'ArrowUp');
assert.throws(()=>parseControls(fs.readFileSync('public/controls.txt','utf8').replace('KeyW','KeyA')));
const arena={width:1280,floorY:640,gravity:1800};
const neutral={direction:0,doubleTap:0,jump:false,crouch:false};
const make=(x=320,def=definition)=>{const f=new Fighter(x,640,def);f.grounded=true;return f;};
const f=make();
f.update(1/60,{...neutral,direction:-1},arena);
assert.equal(f.facing,1);assert.equal(f.animation,'walkBackward');assert.ok(Math.abs(f.x-(320-95/60))<1e-6);
f.update(1/60,{...neutral,direction:1,doubleTap:1},arena);assert.equal(f.animation,'run');
const before=f.x; f.update(1/60,{...neutral,direction:1},arena);assert.ok(Math.abs(f.x-before-340/60)<1e-6);
f.update(1/60,neutral,arena);const stopped=f.x;f.update(1/60,{...neutral,direction:1},arena);assert.ok(Math.abs(f.x-stopped-180/60)<1e-6);
f.update(1/60,{...neutral,direction:-1,doubleTap:-1},arena);assert.equal(f.animation,'backdash');assert.ok(f.y<640);
const dashStart=f.x;for(let i=0;i<17;i++)f.update(1/60,neutral,arena);assert.ok(f.x<dashStart);assert.equal(f.y,640);
const dashEnd=f.x;f.update(1/60,neutral,arena);assert.equal(f.x,dashEnd);
f.faceOpponent(0);assert.equal(f.facing,-1);f.update(1/60,{...neutral,direction:1},arena);assert.equal(f.animation,'walkBackward');
f.update(1/60,{...neutral,crouch:true},arena);assert.equal(f.height,115);assert.equal(f.y,640);
f.update(1/60,{...neutral,jump:true},arena);assert.equal(f.animation,'jump');
let fell=false,landed=false;for(let i=0;i<120;i++){f.update(1/60,neutral,arena);fell ||= f.animation==='fall';landed ||= f.animation==='land';}assert.ok(fell&&landed);assert.equal(f.y,640);
for(let i=0;i<900;i++)f.update(1/60,{...neutral,direction:-1},arena);assert.equal(f.x,f.wallInset);
for(let i=0;i<900;i++)f.update(1/60,{...neutral,direction:1},arena);assert.equal(f.x,1280-f.wallInset);
let rendered=0; const a=make(320),b=make(960,neo);let ai={...neutral,direction:1},bi={...neutral,direction:-1};
const engine=new GameEngine({clear(){},render(){rendered++;}},[{fighter:a,input:{sample:()=>ai}},{fighter:b,input:{sample:()=>bi}}],arena);
assert.equal(b.facing,-1);for(let i=0;i<200;i++)engine.update(1/60);assert.ok(b.x-a.x>=96-1e-6);engine.render();assert.equal(rendered,2);
// Both facing directions use the same pre-step positions and change correctly after crossing in air.
a.x=800;b.x=600;a.y=300;b.y=640;ai=bi=neutral;engine.update(1/60);assert.equal(a.facing,-1);assert.equal(b.facing,1);
globalThis.window=new EventTarget();globalThis.document=new EventTarget();
const {KeyboardInputProvider}=await load('engine/browser/input/KeyboardInputProvider.ts');
const input=new KeyboardInputProvider(controls.player1), input2=new KeyboardInputProvider(controls.player2);
function key(type,code,repeat=false){const e=new Event(type,{cancelable:true});e.code=code;e.repeat=repeat;window.dispatchEvent(e);}
key('keydown','KeyD');assert.equal(input.sample().doubleTap,0);key('keydown','KeyD',true);assert.equal(input.sample().doubleTap,0);
key('keyup','KeyD');key('keydown','KeyD');assert.equal(input.sample().doubleTap,1);assert.equal(input.sample().doubleTap,0);assert.equal(input2.sample().direction,0);
key('keydown','ArrowLeft');assert.equal(input2.sample().direction,-1);assert.equal(input.sample().direction,1);
window.dispatchEvent(new Event('blur'));assert.deepEqual(input.sample(),neutral);assert.deepEqual(input2.sample(),neutral);
key('keydown','KeyA');input.sample();key('keyup','KeyA');for(let i=0;i<13;i++)input.sample();key('keydown','KeyA');assert.equal(input.sample().doubleTap,0);
key('keydown','KeyW');assert.equal(input.sample().jump,true);assert.equal(input.sample().jump,false);
input.dispose();input2.dispose();
for(const def of [definition,neo])for(const anim of Object.values(def.sprite.animations))assert.ok(anim.frames.every(frame=>def.sprite.frames[frame.sprite]));
console.log('PASS: two players, independent keys, facing, body/wall collision, backward movement, double tap/timeout/repeat, run release, single backdash, crouch and jump/landing, sprite mappings.');

// A running jump can clear the other body and change sides without reversing from a backward key.
const jumper=make(400), defender=make(620,neo);let jumpInput={...neutral,direction:1,doubleTap:1};
const crossing=new GameEngine({clear(){},render(){}},[{fighter:jumper,input:{sample:()=>jumpInput}},{fighter:defender,input:{sample:()=>neutral}}],arena);
crossing.update(1/60);jumpInput={...neutral,direction:1,jump:true};crossing.update(1/60);
jumpInput={...neutral,direction:1};for(let i=0;i<70;i++)crossing.update(1/60);
assert.ok(jumper.x>defender.x);assert.equal(jumper.facing,-1);assert.equal(defender.facing,1);
const custom=structuredClone(definition);custom.sprite.animations.idle={loop:false,frames:[{sprite:0,durationTicks:1},{sprite:1,durationTicks:2},{sprite:2,durationTicks:1}]};
const anim=make(400,custom);assert.equal(anim.spriteFrame,0);anim.update(1/60,neutral,arena);assert.equal(anim.spriteFrame,1);anim.update(1/60,neutral,arena);assert.equal(anim.spriteFrame,1);
for(let i=0;i<20;i++)anim.update(1/60,neutral,arena);assert.equal(anim.spriteFrame,2);
console.log('PASS: running jump changes sides; individual frame durations and non-looping clips.');
const {smith} = await load('game/fighters/smith/definition.ts');
const roster=[definition,neo,smith];
for(const first of roster) for(const second of roster){
    const one=make(320,first),two=make(960,second);
    const match=new GameEngine({clear(){},render(){}},[{fighter:one,input:{sample:()=>neutral}},{fighter:two,input:{sample:()=>neutral}}],arena);
    for(let i=0;i<60;i++)match.update(1/60);
    assert.equal(one.y,640);assert.equal(two.y,640);assert.equal(one.facing,1);assert.equal(two.facing,-1);
    assert.notEqual(one,two);
    assert.ok(first.sprite.frames[one.spriteFrame]);assert.ok(second.sprite.frames[two.spriteFrame]);
    one.x+=10;assert.equal(two.x,960);
}
console.log('PASS: all nine character pairings including Smith and independent mirror matches.');
