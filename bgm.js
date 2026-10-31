'use strict';
(function(){
const tracks={profile:'assets/bgm-profile-original.wav',main:'assets/bgm-main-B.wav',captain:'assets/bgm-captain-B.wav',wheel:'assets/bgm-wheel-B.wav',carousel:'assets/bgm-carousel-A.wav',mirror:'assets/bgm-mirror-A.wav',tea:'assets/bgm-tea-A.wav',exit:'assets/bgm-exit-C.wav',monochrome:'assets/bgm-monochrome-C.wav'};
const rideKeys=['captain','wheel','carousel','mirror','tea'];
let started=false,muted=false,hidden=false,current='profile',active=null,previous=null,fade=1,last=0;
function cue(state,phase){if(phase==='profile')return 'profile';if(phase==='ending')return 'main';if(state.passage)return 'monochrome';if(state.config.confronting)return 'exit';if(state.interior)return rideKeys[state.interior.ride];
 const p=state.player;let nearest='main',best=9;for(const r of window.NEVERLAND_LAYOUT.rides){const d=Math.hypot(p.x-r.control[0],p.z-r.control[1]);if(d<best){best=d;nearest=r.id;}}return nearest;}
function play(a){if(!a||muted||hidden)return;try{const result=a.play();result?.catch(()=>{});}catch(e){}}
function switchTo(key){current=key;if(!started)return;if(active?.dataset.cue===key)return;
 if(previous){previous.pause();previous.src='';previous=null;}previous=active;
 active=new Audio(tracks[key]);active.loop=true;active.preload='auto';active.dataset.cue=key;active.volume=0;fade=0;last=Date.now();play(active);}
function start(){if(started){play(active);return;}started=true;switchTo(current);}
function mute(value){muted=value;if(muted){active?.pause();previous?.pause();}else{play(active);play(previous);}}
setInterval(()=>{if(!active)return;const now=Date.now();fade=Math.min(1,fade+(now-last)/900);last=now;const gain=muted||hidden?0:.65;active.volume=gain*fade;if(previous){previous.volume=gain*(1-fade);if(fade===1){previous.pause();previous.src='';previous=null;}}},60);
document.addEventListener('visibilitychange',()=>{hidden=!!document.hidden;if(hidden){active?.pause();previous?.pause();}else{last=Date.now();play(active);play(previous);}});
// A later user gesture can resume media if the browser initially refused playback.
function gesture(){if(!started&&current==='profile')start();else if(started)play(active);}document.addEventListener('pointerdown',gesture);document.addEventListener('keydown',gesture);
window.NEVERLAND_BGM={tracks,cue,start,mute,update(state,phase){switchTo(cue(state,phase));},get state(){return{started,muted,current,fading:!!previous};}};
})();

