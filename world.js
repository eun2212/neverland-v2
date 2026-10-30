(function(){
'use strict';
// Dependency-free WebGL scene. All positions are world-space metres.
const $=id=>document.getElementById('world-'+id),canvas=$('world');
const gl=canvas.getContext('webgl',{alpha:false,antialias:false});
if(!gl){$('start').disabled=true;$('start').textContent='WebGL을 지원하는 브라우저가 필요합니다.';throw Error('WebGL unavailable');}
const vs=`attribute vec3 p;attribute vec3 c;attribute vec2 uv;uniform mat4 vp;varying vec3 col;varying vec2 tex;varying float fog;void main(){gl_Position=vp*vec4(p,1.);col=c;tex=uv;fog=clamp((gl_Position.w-12.)/85.,0.,.91);}`;
const fs=`precision mediump float;varying vec3 col;varying vec2 tex;varying float fog;uniform sampler2D image;uniform bool textured;void main(){vec4 t=textured?texture2D(image,tex):vec4(col,1.);if(t.a<.1)discard;gl_FragColor=vec4(mix(t.rgb,vec3(.23,.38,.40),fog),t.a);}`;
function shader(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const buffer=gl.createBuffer(),vpLoc=gl.getUniformLocation(program,'vp'),texLoc=gl.getUniformLocation(program,'textured');gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
for(const [name,n,offset]of[['p',3,0],['c',3,12],['uv',2,24]]){const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,n,gl.FLOAT,false,32,offset);}
gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(.23,.38,.40,1);
function multiply(a,b){let o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function cameraMatrix(){const f=1/Math.tan(Math.PI/6),aspect=canvas.width/canvas.height,n=.08,far=180;const proj=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+n)/(n-far),-1,0,0,2*far*n/(n-far),0]);const sy=Math.sin(player.yaw),cy=Math.cos(player.yaw),sp=Math.sin(player.pitch),cp=Math.cos(player.pitch);const right=[cy,0,-sy],up=[sy*sp,cp,cy*sp],back=[sy*cp,-sp,cy*cp];const eye=[player.x,player.eye,player.z];const dot=v=>v[0]*eye[0]+v[1]*eye[1]+v[2]*eye[2];const view=new Float32Array([right[0],up[0],back[0],0,right[1],up[1],back[1],0,right[2],up[2],back[2],0,-dot(right),-dot(up),-dot(back),1]);return multiply(proj,view);}
const color=h=>{const n=parseInt(h.replace('#',''),16);return[(n>>16)/255,(n>>8&255)/255,(n&255)/255];};
let vertices=[],fixed=[],colliders=[];
function vertex(p,c,uv=[0,0]){vertices.push(...p,...c,...uv);}
function tri(a,b,c,h){const co=typeof h==='string'?color(h):h;vertex(a,co);vertex(b,co);vertex(c,co);}
function quad(a,b,c,d,h){tri(a,b,c,h);tri(a,c,d,h);}
function box(x,y,z,w,h,d,co,solid=false){const c=color(co),shade=k=>c.map(v=>v*k),a=x-w/2,b=x+w/2,l=z-d/2,r=z+d/2,t=y+h;quad([a,t,l],[b,t,l],[b,t,r],[a,t,r],shade(1.12));quad([a,y,l],[a,t,l],[b,t,l],[b,y,l],shade(.72));quad([b,y,l],[b,t,l],[b,t,r],[b,y,r],shade(.9));quad([b,y,r],[b,t,r],[a,t,r],[a,y,r],c);quad([a,y,r],[a,t,r],[a,t,l],[a,y,l],shade(.8));if(solid)colliders.push({a:a-.25,b:b+.25,l:l-.25,r:r+.25});}
function rod(a,b,r,co,sides=6){const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz),u=Math.abs(dy)/len>.95?[1,0,0]:[-dz/Math.hypot(dx,dz),0,dx/Math.hypot(dx,dz)];const v=[dy*u[2]-dz*u[1],dz*u[0]-dx*u[2],dx*u[1]-dy*u[0]].map(x=>x/len);let pts=[];for(let i=0;i<sides;i++){let t=i/sides*Math.PI*2;pts.push(u.map((x,j)=>r*(x*Math.cos(t)+v[j]*Math.sin(t))));}for(let i=0;i<sides;i++){const p=pts[i],q=pts[(i+1)%sides];quad(a.map((x,j)=>x+p[j]),b.map((x,j)=>x+p[j]),b.map((x,j)=>x+q[j]),a.map((x,j)=>x+q[j]),color(co).map(x=>x*(.8+i/sides*.25)));}}
function disk(x,y,z,r,co,sides=24){for(let i=0;i<sides;i++){let a=i/sides*2*Math.PI,b=(i+1)/sides*2*Math.PI;tri([x,y,z],[x+r*Math.cos(a),y,z+r*Math.sin(a)],[x+r*Math.cos(b),y,z+r*Math.sin(b)],co);}}
function cone(x,y,z,r,h,co){for(let i=0;i<8;i++){let a=i/8*Math.PI*2,b=(i+1)/8*Math.PI*2;tri([x,y+h,z],[x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],color(co).map(v=>v*(.8+.2*Math.cos(a))));}}
function lamp(x,z){rod([x,0,z],[x,3,z],.055,'#a1956d');box(x,2.7,z,.35,.5,.35,'#e1cf9a');cone(x,3.2,z,.3,.2,'#425d53');}
function tree(x,z,s=1){rod([x,0,z],[x,2*s,z],.16*s,'#5d6052');cone(x,1.2*s,z,1.2*s,3*s,'#3f695f');cone(x,2.4*s,z,.9*s,2.5*s,'#567b6a');}
function ring(x,y,z,r,co){for(let i=0;i<48;i++){let a=i/48*2*Math.PI,b=(i+1)/48*2*Math.PI;rod([x+Math.cos(a)*r,y+Math.sin(a)*r,z],[x+Math.cos(b)*r,y+Math.sin(b)*r,z],.07,co,4);}}
const layout=window.NEVERLAND_LAYOUT,rides=layout.rides;
let currentMap="deck";
function build(){vertices=[];colliders=layout.colliders();fixed=new Float32Array(0);}
build();
const player={x:0,z:15,yaw:0,pitch:0,eye:1.65};let phase=0,started=false,keeperVisible=false,met=false,firstRide=false,active=null,dialogue=[],dialogAfter=null,keys=new Set(),cleared=new Set(),runUntil={},lastTime=0,elapsed=0,drag=null,muted=false,audio=null,audioTimer=null,audioNodes=[],rideTimer=null,captionUntil=0;
const keeper={x:-2,z:-2.5};let keeperLoaded=false;const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));
const keeperImage=new Image();keeperImage.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,keeperImage);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);keeperLoaded=true;};keeperImage.onerror=()=>toast('키퍼 이미지를 불러오지 못했습니다. assets 폴더를 확인해 주세요.');keeperImage.src='assets/keeper-v3-01-basic.webp';
function drawData(data,textured=false){gl.uniform1i(texLoc,textured?1:0);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,data.length/8);}
function dynamicScene(){return new Float32Array(0);}
function billboard(){if(!keeperVisible||!keeperLoaded||!$('dialog').hidden)return;vertices=[];const dx=player.x-keeper.x,dz=player.z-keeper.z,len=Math.hypot(dx,dz),rx=dz/len,rz=-dx/len;const h=2.8,w=h*keeperImage.width/keeperImage.height;const p=(side,y)=>[keeper.x+rx*side*w/2,y,keeper.z+rz*side*w/2];const co=[1,1,1];vertex(p(-1,0),co,[0,0]);vertex(p(1,0),co,[1,0]);vertex(p(1,h),co,[1,1]);vertex(p(-1,0),co,[0,0]);vertex(p(1,h),co,[1,1]);vertex(p(-1,h),co,[0,1]);gl.bindTexture(gl.TEXTURE_2D,texture);drawData(new Float32Array(vertices),true);}
let config={paused:true,free:false,intro:false,keeperIntroduced:false,ride:0,cleared:[],clues:[],exit:false},zone=0,actionCallback=()=>{},zoneCallback=()=>{};
let toastTimer;
let exitRevealAge=-1,exitRevealLast=0,exitRevealAnnounced=false,exitRevealCount=0;
let interior=null,parkReturn=null,interiorLast=0;
let passage=null,passageReturn=null,fractureUnlocked=false,glitchRemaining=0,glitchCount=0;
function passageStep(dt,forward){if(!passage)return;const step=Math.max(0,Math.min(.05,dt));if(forward>0&&passage.progress<1)passage.progress=Math.min(1,passage.progress+step*3.1/64);player.x=0;player.z=-passage.progress*52;player.yaw=0;player.pitch=0;player.eye=1.7;if(passage.progress===1){passage.revealHold+=step;if(passage.revealHold>=3.2){passage=null;Object.assign(player,passageReturn);passageReturn=null;keys.clear();config.paused=true;actionCallback({type:'passage-complete'});}}}
function blocked(){return config.paused;}
function caption(text,seconds=6){$('caption').textContent=text;captionUntil=elapsed+seconds;}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),5000);}
function advance(){}
function setChapter(){}
function stamps(){}
const cluePoints=layout.clues;
const keeperPoints=layout.keepers;
function updateProgress(){
 if(passage)return;
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
 if(passage)return null;
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
 if(interior||passage)return;
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
 enterPassage(){if(passage)return false;if(interior&&!this.leaveRide())return false;passageReturn={...player,x:0,z:-10,yaw:0,pitch:0,eye:1.65};passage={progress:0,revealHold:0};fractureUnlocked=true;Object.assign(player,{x:0,z:0,yaw:0,pitch:0,eye:1.7});keys.clear();document.exitPointerLock?.();return true;},
 fracturePulse(){if(fractureUnlocked){glitchRemaining=4;glitchCount++;}},
 configure(next){const wasPaused=config.paused,hadExit=config.exit;config={...config,...next};if(config.exit&&!hadExit){exitRevealAge=0;exitRevealLast=elapsed;exitRevealAnnounced=false;exitRevealCount++;}started=true;phase=3;keeperVisible=config.keeperIntroduced;const p=keeperPoints[config.ride||0];keeper.x=p[0];keeper.z=p[1];if(config.exit&&config.ride===config.exitRide){const r=rides[config.exitRide];keeper.x=r.control[0]+4;keeper.z=r.control[1]+2.8;}if(next.free&&currentMap!=='park'){currentMap='park';build();}if(config.paused){keys.clear();document.exitPointerLock?.();}if(wasPaused&&!config.paused)keys.clear();},
 faceExit(){player.yaw=Math.atan2(player.x-keeper.x,player.z-keeper.z);player.pitch=-.04;keys.clear();},
 forceBoard(i){if(passage||i<0||i>4)return false;if(!interior&&!this.enterRide(i))return false;if(interior.ride!==i||interior.running)return false;const d=window.NEVERLAND_INTERIORS[i],p=d.seat||d.control;Object.assign(player,{x:p[0],z:p[1],yaw:0,pitch:0,eye:d.seat?1.35:1.65});interior.seated=!!d.seat;keys.clear();return true;},
 enterRide(i){if(passage||interior||i<0||i>4||(!config.free&&i!==0))return false;const d=window.NEVERLAND_INTERIORS[i];parkReturn={...player};interior={ride:i,seated:false,running:false,time:0,progress:0,duration:d.duration,solved:false,power:0};Object.assign(player,{x:d.spawn[0],z:d.spawn[1],yaw:0,pitch:0,eye:1.65});$('caption').textContent='';captionUntil=0;keys.clear();interiorLast=elapsed;return true;},
 leaveRide(){if(!interior||interior.running||config.forcedRide>=0)return false;Object.assign(player,parkReturn);interior=null;parkReturn=null;keys.clear();return true;},
 sit(){if(!interior||interior.running||interior.ride===3)return false;const d=window.NEVERLAND_INTERIORS[interior.ride];if(Math.hypot(player.x-d.seat[0],player.z-d.seat[1])>1.8)return false;interior.seated=true;player.x=d.seat[0];player.z=d.seat[1];player.eye=1.35;keys.clear();return true;},
 stand(){if(!interior||interior.running||config.forcedRide>=0)return false;interior.seated=false;player.eye=1.65;keys.clear();return true;},
 startRide(seconds){if(!interior||!interior.seated||interior.running)return false;interior.running=true;interior.time=0;interior.progress=0;interior.duration=seconds||window.NEVERLAND_INTERIORS[interior.ride].duration;interiorLast=elapsed;keys.clear();return true;},
 unlockInterior(){if(interior)interior.solved=true;},
 setRidePower(value){if(interior)interior.power=Math.max(0,Math.min(100,Number(value)||0));},
 interiorValid(x,z){if(!interior)return false;if(interior.seated)return false;const d=window.NEVERLAND_INTERIORS[interior.ride],b=d.bounds;if(x<b[0]||x>b[1]||z<b[2]||z>b[3])return false;if(interior.ride===4&&Math.hypot(x,z)>4.55)return false;if(interior.ride===2&&Math.hypot(x,z)>7.9)return false;return !d.walls.some(([xx,zz,w,h])=>Math.abs(x-xx)<w/2+.23&&Math.abs(z-zz)<h/2+.23);},
 reset(){config={paused:true,free:false,intro:false,keeperIntroduced:false,ride:0,cleared:[],clues:[],exit:false};passage=null;passageReturn=null;fractureUnlocked=false;glitchRemaining=0;glitchCount=0;interior=null;parkReturn=null;exitRevealAge=-1;exitRevealLast=elapsed;exitRevealAnnounced=false;exitRevealCount=0;zone=0;currentMap='deck';build();started=true;keeperVisible=false;Object.assign(player,layout.spawn);player.pitch=0;keys.clear();runUntil={};},
 animateRide(i){runUntil[rides[i].id]=elapsed+24;},
 audio(){initAudio();},
 mute(){muted=!muted;if(audio)audio.master.gain.setTargetAtTime(muted?0:.18,audio.currentTime,.1);return muted;},
 notify:toast,
 get state(){return{player:{...player},keeper:{...keeper},elapsed,passage:passage?{...passage}:null,reality:{unlocked:fractureUnlocked,glitchCount,glitch:glitchRemaining>0?(.5+.5*Math.sin(glitchRemaining*3.4)**2):0},interior:interior?{...interior}:null,running:{...runUntil},zone,config:{...config},exitReveal:{age:exitRevealAge,count:exitRevealCount,announced:exitRevealAnnounced},nearest:nearest(),glError:gl.getError()};}
};

// Music is synthesized locally and begins only inside the user's start gesture.
function initAudio(){if(audio){audio.resume();return;}const AC=window.AudioContext||window.webkitAudioContext;if(!AC){toast('이 브라우저에서는 배경음을 지원하지 않습니다.');return;}audio=new AC();const master=audio.createGain();master.gain.value=muted?0:.18;master.connect(audio.destination);audio.master=master;const delay=audio.createDelay(2);delay.delayTime.value=.43;const feedback=audio.createGain();feedback.gain.value=.24;delay.connect(feedback);feedback.connect(delay);delay.connect(master);audio.delay=delay;let beat=0;const chords=[[130.81,164.81,196,246.94],[110,130.81,164.81,196],[87.31,130.81,174.61,220],[98,146.83,196,246.94]];function schedule(){if(!audio||audio.state==='closed')return;let now=audio.currentTime;const chord=chords[Math.floor(beat/8)%4];for(let j=0;j<4;j++)tone(chord[j],now,.9,.042,'sine');tone(chord[(beat*3)%4]*2,now,.65,.09,'triangle');beat++;}schedule();audioTimer=setInterval(schedule,1150);}
function tone(freq,time,duration,volume,type='sine'){if(!audio)return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+.035);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(gain);gain.connect(audio.master);gain.connect(audio.delay);osc.start(time);osc.stop(time+duration+.02);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
function note(freq,duration){if(audio)tone(freq,audio.currentTime,duration,.12,'triangle');}
$('interact').onclick=interact;
window.addEventListener('keydown',e=>{if(!started||blocked())return;if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' ','e','enter'].includes(e.key.toLowerCase()))e.preventDefault();if(e.repeat&&(e.key==='e'||e.key==='Enter'))return;if(e.key.toLowerCase()==='e')interact();else if(e.key==='Enter'&&!$('dialog').hidden)advance();else keys.add(e.key.toLowerCase());});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();if(audio){if(document.hidden)audio.suspend();else if(started)audio.resume();}});
canvas.addEventListener('click',()=>{if(started&&!blocked()&&matchMedia('(pointer:fine)').matches){const request=canvas.requestPointerLock?.();request?.catch?.(()=>{});}});
document.addEventListener('mousemove',e=>{if(!passage&&document.pointerLockElement===canvas&&started&&!blocked()){player.yaw-=e.movementX*.0022;player.pitch=Math.max(-.7,Math.min(.7,player.pitch-e.movementY*.0018));}});
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!passage&&drag&&document.pointerLockElement!==canvas&&started&&!blocked()){player.yaw-=(e.clientX-drag.x)*.005;player.pitch=Math.max(-.7,Math.min(.7,player.pitch-(e.clientY-drag.y)*.003));drag.x=e.clientX;drag.y=e.clientY;}});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);b.onlostpointercapture=()=>keys.delete(b.dataset.key);});
function valid(x,z){if(interior)return window.neverlandWorld.interiorValid(x,z);const b=layout.bounds;if(x<b.minX||x>b.maxX||z<b.minZ||z>b.maxZ||layout.water(x,z))return false;if(!config.free&&(z<-18||Math.abs(x)>11))return false;if(config.exit){const r=rides[config.exitRide];if(Math.abs(x-r.control[0]-4)<1.55&&Math.abs(z-r.control[1]-2)<.4)return false;}return !colliders.some(c=>x>c.a&&x<c.b&&z>c.l&&z<c.r);}
function resize(){const scale=Math.min(devicePixelRatio,1.3),w=Math.floor(innerWidth*scale),h=Math.floor(innerHeight*scale);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}}
function landmarks(){const m=cameraMatrix();for(const r of rides){const el=$('label-'+r.id);el.textContent=r.name+(config.cleared?.includes(rides.indexOf(r))?' ✓':'');const p=[r.control[0],2,r.control[1],1],q=[0,0,0,0];for(let row=0;row<4;row++)for(let k=0;k<4;k++)q[row]+=m[k*4+row]*p[k];const visible=(currentMap==='park'||r.id==='captain')&&started&&!blocked()&&phase>=1&&player.z<7&&q[3]>1&&Math.abs(q[0]/q[3])<.94&&Math.abs(q[1]/q[3])<.8&&Math.hypot(player.x-p[0],player.z-p[2])<55;el.style.display=visible?'block':'none';if(visible){el.style.left=(q[0]/q[3]*.5+.5)*innerWidth+'px';el.style.top=(-q[1]/q[3]*.5+.5)*innerHeight+'px';}}}
function frame(ms){let dt=Math.min((ms-lastTime)/1000,.05);lastTime=ms;elapsed+=dt;resize();if(started&&!blocked()&&passage){passageStep(dt,keys.has('w')||keys.has('arrowup')?1:0);}else if(started&&!blocked()){if(!interior)glitchRemaining=Math.max(0,glitchRemaining-dt);let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),strafe=(keys.has('d')?1:0)-(keys.has('a')?1:0);player.yaw+=((keys.has('arrowleft')?1:0)-(keys.has('arrowright')?1:0))*dt*1.6;const norm=Math.hypot(forward,strafe)||1,speed=(keys.has('shift')?5:3)*dt;const dx=(-Math.sin(player.yaw)*forward+Math.cos(player.yaw)*strafe)/norm*speed,dz=(-Math.cos(player.yaw)*forward-Math.sin(player.yaw)*strafe)/norm*speed;if(valid(player.x+dx,player.z))player.x+=dx;if(valid(player.x,player.z+dz))player.z+=dz;player.eye=(interior?.seated?1.35:1.65)+(forward||strafe?Math.sin(elapsed*7)*.025:0);updateProgress();}gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(vpLoc,false,cameraMatrix());drawData(fixed);drawData(dynamicScene(elapsed));billboard();drawMarkers();landmarks();if(started){active=nearest();$('interact').hidden=!active;$('interact').textContent=active?.label||'';if(elapsed>captionUntil)$('caption').textContent='';}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// Read-only runtime state supports reproducible QA without altering play behavior.
window.neverlandRenderer={get state(){return{currentMap,phase,started,keeperVisible,keeperLoaded,met,firstRide,cleared:[...cleared],player:{...player},active:active?.type,glError:gl.getError()};}};

})();
