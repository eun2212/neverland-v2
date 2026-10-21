const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map(),events={},timers=new Map();let timerId=0,raf=null,draws=0;
const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getError:()=>0,drawArrays:()=>draws++},{get:(t,k)=>k in t?t[k]:typeof k==='string'&&k===k.toUpperCase()?1:()=>({})});
function el(id){if(!elements.has(id))elements.set(id,{id,hidden:['dialog','instructions','interact'].includes(id),style:{},dataset:{},classList:{add(){},remove(){}},setAttribute(k,v){this[k]=v;},addEventListener(){},setPointerCapture(){},getContext:()=>gl});return elements.get(id);}
const sandbox={console,Float32Array,Uint8Array,Set,Math,Image:class{set src(v){this.width=1024;this.height=1536;this.onload?.();}},document:{getElementById:el,querySelectorAll:()=>[],addEventListener:(k,f)=>events[k]=f,exitPointerLock(){}},innerWidth:1280,innerHeight:720,devicePixelRatio:1,matchMedia:()=>({matches:false}),requestAnimationFrame:f=>raf=f,setTimeout:(f,ms)=>{timers.set(++timerId,{f,ms});return timerId;},clearTimeout:id=>timers.delete(id),setInterval:()=>1,clearInterval(){}};
sandbox.window=sandbox;sandbox.addEventListener=(k,f)=>events[k]=f;vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/game.js','utf8'),sandbox);
const run=s=>vm.runInContext(s,sandbox),state=()=>sandbox.neverland.state;let ms=0;
function frames(n){for(let i=0;i<n;i++){ms+=1000/60;raf(ms);}}
function closeDialogue(){while(!el('dialog').hidden)el('next').onclick();}
assert.equal(state().keeperVisible,false);frames(2);assert(draws>0);assert.equal(state().keeperLoaded,true);
el('start').onclick();assert(state().started);run("keys.add('w')");frames(250);run('keys.clear()');assert.equal(state().phase,2);assert(state().keeperVisible);assert(!el('dialog').hidden);closeDialogue();
// Follow physical coordinates, independently testing proximity and wall collision.
assert.equal(run('valid(-6,13)'),false);assert.equal(run('valid(0,7)'),true);assert.equal(run('valid(0,-70)'),false);
run('player.x=-2;player.z=-.2');frames(1);assert.equal(state().active,'keeper');el('interact').onclick();closeDialogue();assert(state().met);
run('player.x=3;player.z=5.3');frames(1);assert.equal(state().active,'captain');el('interact').onclick();assert(state().firstRide);assert.equal(state().phase,3);const accident=[...timers.values()].find(t=>t.ms===7500);assert(accident);accident.f();closeDialogue();assert.equal(state().player.z,10);assert(state().cleared.includes('captain'));
for(const [id,x,z] of [['wheel',-17,-21.6],['carousel',17,-20.6],['mirror',-18,-40.6],['tea',16,-40.6]]){run(`player.x=${x};player.z=${z}`);frames(1);assert.equal(state().active,id);el('interact').onclick();assert(state().cleared.includes(id));}
assert.equal(state().cleared.length,5);assert(el('chapter').textContent.includes('다섯 개의 기억'));
run('player.x=-2;player.z=-.2');frames(1);el('interact').onclick();assert(el('line').textContent.includes('다섯 개'));closeDialogue();
el('sound').onclick();assert.equal(el('sound')['aria-pressed'],'true');el('sound').onclick();assert.equal(el('sound')['aria-pressed'],'false');
el('restart').onclick();assert.equal(state().started,false);assert.equal(state().cleared.length,0);assert.equal(state().keeperVisible,false);frames(3);
console.log('PASS: renderer calls, keeper asset, walking, doorway/walls/bounds, first encounter, dialogue, physical proximity, lever, accident/reset, all 5 rides, completion, mute, restart.');
