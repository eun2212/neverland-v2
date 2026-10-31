const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const audio=[],events={};let timer,now=1000;
class FakeAudio{constructor(src){this.src=src;this.dataset={};this.paused=true;audio.push(this);}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}}
const context={Audio:FakeAudio,Date:{now:()=>now},setInterval:f=>timer=f,document:{hidden:false,addEventListener:(name,f)=>events[name]=f},window:{NEVERLAND_LAYOUT:{rides:[{id:'captain',control:[0,-14]},{id:'wheel',control:[17,-35]},{id:'carousel',control:[-17,-35]},{id:'mirror',control:[-16,1]},{id:'tea',control:[16,1]}]}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/bgm.js','utf8'),context);const b=context.window.NEVERLAND_BGM;
const state={player:{x:0,z:20},config:{confronting:false},interior:null,passage:null};
assert.equal(audio.length,0);b.update(state,'main');assert.equal(audio.length,0);b.start();assert.equal(audio.length,1);assert(audio[0].loop);assert.equal(b.state.current,'main');
for(let i=0;i<5;i++){const key=['captain','wheel','carousel','mirror','tea'][i];assert.equal(b.cue({...state,interior:{ride:i}},'main'),key);const r=context.window.NEVERLAND_LAYOUT.rides[i];assert.equal(b.cue({...state,player:{x:r.control[0],z:r.control[1]}},'main'),key);}
assert.equal(b.cue({...state,passage:{progress:.1},interior:{ride:0},config:{confronting:true}},'graveyard'),'monochrome');assert.equal(b.cue({...state,config:{confronting:true}},'final'),'exit');assert.equal(b.cue(state,'profile'),'profile');assert.equal(b.cue(state,'ending'),'main');
b.update({...state,interior:{ride:1}},'main');const count=audio.length;b.update({...state,interior:{ride:1}},'main');assert.equal(audio.length,count);now+=1000;timer();assert(audio[0].paused);assert.equal(audio.at(-1).volume,.65);
b.mute(true);assert(audio.at(-1).paused);b.update({...state,passage:{}},'graveyard');assert(audio.at(-1).paused);b.mute(false);assert(!audio.at(-1).paused);assert.equal(b.state.current,'monochrome');
context.document.hidden=true;events.visibilitychange();assert(audio.at(-1).paused);context.document.hidden=false;events.visibilitychange();assert(!audio.at(-1).paused);
for(const [key,file]of Object.entries(b.tracks)){assert(fs.existsSync(__dirname+'/'+file),key);assert(fs.readFileSync(__dirname+'/'+file).toString('ascii',0,4)==='RIFF');}
b.update(state,'profile');events.keydown();assert.equal(b.state.current,'profile');b.update(state,'main');assert.equal(b.state.current,'main');console.log('PASS: selected tracks, five map cues, main/profile/ending, passage priority, exit confrontation, start gesture, crossfade, deduplication, mute and background-tab pause.');

