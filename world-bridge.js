let config={paused:true,free:false,intro:false,keeperIntroduced:false,ride:0,cleared:[],clues:[],exit:false},zone=0,actionCallback=()=>{},zoneCallback=()=>{};
let toastTimer;
let exitRevealAge=-1,exitRevealLast=0,exitRevealAnnounced=false,exitRevealCount=0;
let interior=null,parkReturn=null,interiorLast=0;
function blocked(){return config.paused;}
function caption(text,seconds=6){$('caption').textContent=text;captionUntil=elapsed+seconds;}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),5000);}
function advance(){}
function setChapter(){}
function stamps(){}
const cluePoints=layout.clues;
const keeperPoints=layout.keepers;
function updateProgress(){
 if(interior){
  if(interior.running){interior.time+=Math.max(0,Math.min(.05,elapsed-interiorLast));interior.progress=Math.min(1,interior.time/interior.duration);if(interior.progress>=1){interior.running=false;actionCallback({type:'ride-complete',ride:interior.ride});}}
  interiorLast=elapsed;return;
 }
 if(config.target){
  const dx=config.target[0]-player.x,dz=config.target[1]-player.z,distance=Math.hypot(dx,dz);
  const angle=Math.atan2(-dx,-dz)-player.yaw,delta=Math.atan2(Math.sin(angle),Math.cos(angle));
  caption((Math.abs(delta)<.35?'↑':Math.abs(delta)>2.5?'↶':delta>0?'←':'→')+' 목적지 '+Math.round(distance)+'m · 물길은 다리를 따라 건너세요.',2);
 }
 if(config.intro&&player.z<-7){config.paused=true;actionCallback({type:'intro',ride:0});return;}
 if(!config.free)return;
 let nextZone=0,best=Infinity;
 for(let i=0;i<rides.length;i++){let d=Math.hypot(player.x-rides[i].control[0],player.z-rides[i].control[1]);if(d<best){best=d;nextZone=i;}}
 if(nextZone!==zone&&best<11){zone=nextZone;keys.clear();zoneCallback(zone);}
}
function nearest(){
 if(!started||blocked())return null;
 if(interior){const d=window.NEVERLAND_INTERIORS[interior.ride],near=p=>p&&Math.hypot(player.x-p[0],player.z-p[1])<1.7;
  if(interior.running)return{type:'ride-running',ride:interior.ride,label:'탑승 중 · 주변을 둘러보세요 ('+Math.round(interior.progress*100)+'%)'};
  if(interior.seated)return{type:'interior-control',ride:interior.ride,label:'E · 앉은 자리에서 기구 조작하기 / Q · 일어나기'};
  if(interior.ride===3&&near(d.finish))return{type:interior.solved?'mirror-finish':'mirror-locked',ride:3,label:interior.solved?'E · 열린 빛의 출구로 나가기':'빛의 출구 · 먼저 장치를 풀어야 합니다'};
  if(near(d.exit))return{type:'interior-leave',ride:interior.ride,label:'E · 공원으로 돌아가기'};
  if(near(d.seat))return{type:'interior-seat',ride:interior.ride,label:'E · '+(interior.ride===2?'목마에 올라타기':'좌석에 앉기')};
  if(near(d.control))return{type:'interior-control',ride:interior.ride,label:'E · '+(interior.ride===3?'거울 빛 장치 조작하기':'장치 살펴보기 · 탑승 후 작동')};
  return null;
 }
 const i=config.ride||0,r=rides[i];
 if(config.exit&&i===config.exitRide&&Math.hypot(player.x-(r.control[0]+4),player.z-(r.control[1]+2))<2.6)return{type:'exit',ride:i,label:'E · 새벽의 출구에서 키퍼와 마주한다'};
 if(config.keeperIntroduced&&Math.hypot(player.x-keeper.x,player.z-keeper.z)<3.2)return{type:'keeper',ride:i,label:'E · 키퍼에게 말 걸기'};
 if(Math.hypot(player.x-r.control[0],player.z-r.control[1])<2.65)return{type:'control',ride:i,label:'E · '+r.name+' 안으로 들어가기'};
 const c=cluePoints[i];if(config.free&&Math.hypot(player.x-c[0],player.z-c[1])<2.5)return{type:'clue',ride:i,label:'E · '+(config.clues.includes(i)?'흔적을 다시 살핀다':'난간 아래의 흔적을 조사한다')};
 return null;
}
function interact(){const n=nearest();if(n){keys.clear();document.exitPointerLock?.();actionCallback(n);}}
function drawMarkers(){
 if(!started)return;vertices=[];
 if(interior)return;
 if(config.free){for(let i=0;i<cluePoints.length;i++){const p=cluePoints[i];box(p[0],.1,p[1],.65,.45,.65,config.clues.includes(i)?'#748878':'#dfc394');rod([p[0],.5,p[1]],[p[0],1.1,p[1]],.04,'#dfc394');}}
 if(config.exit){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!config.paused){
   exitRevealAge+=Math.max(0,Math.min(.05,elapsed-exitRevealLast));
   if(!exitRevealAnnounced){exitRevealAnnounced=true;toast('안개 속에 흩어진 빛이 모여, 새벽의 출구가 나타납니다. 지도에서 위치를 확인하세요.');if(audio&&!muted){for(const [i,f]of [523.25,659.25,783.99].entries())tone(f,audio.currentTime+i*.22,1.8,.07,'sine');}}
  }
  exitRevealLast=elapsed;
  const r=rides[config.exitRide],x=r.control[0]+4,z=r.control[1]+2;
  const age=reduced?8:exitRevealAge,form=Math.max(.02,Math.min(1,(age-.8)/3.2)),h=3.4*form;
  // Light rises from a luminous seal; fragments gather into the doorway.
  for(let j=0;j<2;j++){const radius=1.45+j*.28+.07*Math.sin(elapsed*.9+j);for(let i=0;i<40;i++){const a=i/40*Math.PI*2,b=(i+1)/40*Math.PI*2;rod([x+Math.cos(a)*radius,.055+j*.03,z+Math.sin(a)*radius],[x+Math.cos(b)*radius,.055+j*.03,z+Math.sin(b)*radius],.018,j?'#8cc6c1':'#ffe5a3',4);}}
  if(age<6&&!reduced){const height=(1-age/6)*11+3.4;for(let i=0;i<7;i++){const a=i/7*Math.PI*2;rod([x+Math.cos(a)*.8,.1,z+Math.sin(a)*.6],[x+Math.cos(a)*.2,height,z+Math.sin(a)*.15],.018,'#b3ded5',4);}}
  if(age>.8){for(const dx of[-1.3,1.3])rod([x+dx,0,z],[x+dx,h,z],.12,'#ffe5a3');rod([x-1.3,h,z],[x+1.3,h,z],.12,'#ffe5a3');box(x,.05,z,2.3,Math.max(.03,h-.2),.1,'#345b51');for(let i=0;i<5;i++){const y=(.4+i*.6)*form;rod([x-1.1,y,z+.08],[x+1.1,y+.25*form,z+.08],.025,'#d7ba6c');}}
  for(let i=0;i<32;i++){const t=reduced?i*.31:elapsed*.45+i*2.4,a=t+i*.7,radius=(age<4?3.4*(1-form):.6)+.6;const px=x+Math.cos(a)*radius,py=.25+((t*.55+i*.17)%3.9),pz=z+Math.sin(a)*radius*.55;box(px,py,pz,.045,.045,.045,i%3?'#ffe5a3':'#adddd7');}
 }
 if(config.target){const p=config.target;cone(p[0],3.5+Math.sin(elapsed*2)*.15,p[1],.35,-.7,'#ffe5a3');}
 drawData(new Float32Array(vertices));
}
window.neverlandWorld={
 connect(actions,zones){actionCallback=actions;zoneCallback=zones;},
 configure(next){const wasPaused=config.paused,hadExit=config.exit;config={...config,...next};if(config.exit&&!hadExit){exitRevealAge=0;exitRevealLast=elapsed;exitRevealAnnounced=false;exitRevealCount++;}started=true;phase=3;keeperVisible=config.keeperIntroduced;const p=keeperPoints[config.ride||0];keeper.x=p[0];keeper.z=p[1];if(config.exit&&config.ride===config.exitRide){const r=rides[config.exitRide];keeper.x=r.control[0]+4;keeper.z=r.control[1]+2.8;}if(next.free&&currentMap!=='park'){currentMap='park';build();}if(config.paused){keys.clear();document.exitPointerLock?.();}if(wasPaused&&!config.paused)keys.clear();},
 faceExit(){player.yaw=Math.atan2(player.x-keeper.x,player.z-keeper.z);player.pitch=-.04;keys.clear();},
 enterRide(i){if(interior||i<0||i>4||(!config.free&&i!==0))return false;const d=window.NEVERLAND_INTERIORS[i];parkReturn={...player};interior={ride:i,seated:false,running:false,time:0,progress:0,duration:d.duration,solved:false,power:0};Object.assign(player,{x:d.spawn[0],z:d.spawn[1],yaw:0,pitch:0,eye:1.65});$('caption').textContent='';captionUntil=0;keys.clear();interiorLast=elapsed;return true;},
 leaveRide(){if(!interior||interior.running)return false;Object.assign(player,parkReturn);interior=null;parkReturn=null;keys.clear();return true;},
 sit(){if(!interior||interior.running||interior.ride===3)return false;const d=window.NEVERLAND_INTERIORS[interior.ride];if(Math.hypot(player.x-d.seat[0],player.z-d.seat[1])>1.8)return false;interior.seated=true;player.x=d.seat[0];player.z=d.seat[1];player.eye=1.35;keys.clear();return true;},
 stand(){if(!interior||interior.running)return false;interior.seated=false;player.eye=1.65;keys.clear();return true;},
 startRide(seconds){if(!interior||!interior.seated||interior.running)return false;interior.running=true;interior.time=0;interior.progress=0;interior.duration=seconds||window.NEVERLAND_INTERIORS[interior.ride].duration;interiorLast=elapsed;keys.clear();return true;},
 unlockInterior(){if(interior)interior.solved=true;},
 setRidePower(value){if(interior)interior.power=Math.max(0,Math.min(100,Number(value)||0));},
 interiorValid(x,z){if(!interior)return false;if(interior.seated)return false;const d=window.NEVERLAND_INTERIORS[interior.ride],b=d.bounds;if(x<b[0]||x>b[1]||z<b[2]||z>b[3])return false;if(interior.ride===4&&Math.hypot(x,z)>4.55)return false;if(interior.ride===2&&Math.hypot(x,z)>7.9)return false;return !d.walls.some(([xx,zz,w,h])=>Math.abs(x-xx)<w/2+.23&&Math.abs(z-zz)<h/2+.23);},
 reset(){config={paused:true,free:false,intro:false,keeperIntroduced:false,ride:0,cleared:[],clues:[],exit:false};interior=null;parkReturn=null;exitRevealAge=-1;exitRevealLast=elapsed;exitRevealAnnounced=false;exitRevealCount=0;zone=0;currentMap='deck';build();started=true;keeperVisible=false;Object.assign(player,layout.spawn);player.pitch=0;keys.clear();runUntil={};},
 animateRide(i){runUntil[rides[i].id]=elapsed+24;},
 audio(){initAudio();},
 mute(){muted=!muted;if(audio)audio.master.gain.setTargetAtTime(muted?0:.18,audio.currentTime,.1);return muted;},
 notify:toast,
 get state(){return{player:{...player},keeper:{...keeper},elapsed,interior:interior?{...interior}:null,running:{...runUntil},zone,config:{...config},exitReveal:{age:exitRevealAge,count:exitRevealCount,announced:exitRevealAnnounced},nearest:nearest(),glError:gl.getError()};}
};
