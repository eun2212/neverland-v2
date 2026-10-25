'use strict';
// Dependency-free WebGL scene. All positions are world-space metres.
const $=id=>document.getElementById(id),canvas=$('world');
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
const rides=[{id:'captain',name:'캡틴 훅',x:3,z:0,control:[3,4],verb:'붉은 레버를 당긴다'},{id:'wheel',name:'별의 관람차',x:-21,z:-28,control:[-17,-23],verb:'별 모양 손잡이를 돌린다'},{id:'carousel',name:'장미 회전목마',x:21,z:-27,control:[17,-22],verb:'오르골 태엽을 감는다'},{id:'mirror',name:'거울 미로',x:-22,z:-48,control:[-18,-42],verb:'거울의 각도를 바꾼다'},{id:'tea',name:'달빛 찻잔',x:20,z:-48,control:[16,-42],verb:'보라색 찻잔의 손잡이를 돌린다'}];
let currentMap="deck";
function build(){vertices=[];colliders=[];
// Park island, winding paths, deck and enclosed cabin with an actual doorway.
box(0,-1.1,-19,78,1,102,'#4b7066');box(0,-.11,-23,8,.12,58,'#b1ae8d');box(0,-.1,-25,48,.12,5,'#b1ae8d');box(0,-.1,-44,48,.12,5,'#b1ae8d');
box(0,-.2,8,17,.2,22,'#777c68');for(let z=-2;z<19;z+=.55)box(0,.005,z,17,.015,.025,'#999982');
box(-6,0,13,1,4,12,'#304f4a',true);box(6,0,13,1,4,12,'#304f4a',true);box(0,0,19,12,4,.5,'#304f4a',true);box(-4,0,7,4,4,.5,'#304f4a',true);box(4,0,7,4,4,.5,'#304f4a',true);box(0,3.2,7,4,.8,.5,'#304f4a');box(0,4,13,13,.2,12,'#243e3e');
// Bed, portholes, brass door frame.
box(-3,.2,15,3,.6,5,'#795f53',true);box(-3,.8,15,2.8,.25,4.8,'#d3c9aa');box(-3,1.05,16.5,2,.18,1.1,'#dfd7bb');box(4,0,16,1.1,1.2,1.1,'#7a725a',true);box(4,1.2,16,.45,.55,.45,'#e7ce90');
for(let x of[-2.15,2.15])rod([x,0,6.65],[x,3.3,6.65],.07,'#c9b779');rod([-2.15,3.3,6.65],[2.15,3.3,6.65],.07,'#c9b779');
// Rails leave the north stairs open.
for(let x of[-8.3,8.3]){for(let z=-2;z<19;z+=2)rod([x,0,z],[x,1.15,z],.06,'#bbb58d');rod([x,1.15,-2],[x,1.15,19],.065,'#bdb992');colliders.push({a:x-.2,b:x+.2,l:-2,r:19});}
for(let x of[-5.2,5.2]){box(x,0,-2,6,1.1,.12,'#8e987c',true);lamp(x,1);}
// Captain Hook boat silhouette and its lever.
for(let x of[1,7]){rod([x,0,-1.5],[x,6,0],.13,'#6d8c78');rod([x,6,0],[x,0,1.5],.13,'#6d8c78');}rod([1,6,0],[7,6,0],.15,'#b3a676');
// Scenic planting, railings and floating lanterns.
for(let i=0;i<38;i++){let x=Math.sin(i*7.91)*34,z=-8-((i*13.7)%56);if(Math.abs(x)>27||Math.abs(x)>7&&Math.abs(z+34)<4)tree(x,z,.7+(i%4)*.17);}
for(let z=-10;z>-59;z-=8){lamp(-5,z);lamp(5,z);}for(let x of[-30,30])for(let z=-10;z>-60;z-=10)lamp(x,z);
if(currentMap==='park'){
// Ferris wheel supports.
for(let x of[-25,-17])rod([x,0,-27],[-21,8,-28],.18,'#839d89');ring(-21,8,-28,7,'#bfb383');ring(-21,8,-28.3,6.6,'#6f9d91');
// Carousel pavilion.
disk(21,.12,-27,5.5,'#ae9b8b');rod([21,0,-27],[21,6,-27],.22,'#c9b788');cone(21,5,-27,6,2,'#8b777a');cone(21,6.2,-27,3.1,1.2,'#c3af8b');
for(let i=0;i<10;i++){let a=i*Math.PI/5;rod([21+Math.cos(a)*5,0,-27+Math.sin(a)*5],[21+Math.cos(a)*5,5,-27+Math.sin(a)*5],.08,'#d3c19b');}
// Mirror maze: actual walkable aisles, reflective-looking panels.
for(let x of[-27,-22,-17]){box(x,0,-49,.15,3.5,8,'#a4c5bf',true);for(let z of[-52,-46])rod([x,0,z],[x,3.6,z],.06,'#dfca96');}box(-22,0,-53,10,3.5,.15,'#7fa4a4',true);
// Teacup pavilion.
disk(20,.05,-48,6,'#899998');rod([20,0,-48],[20,4.6,-48],.16,'#c3ae82');cone(20,4.6,-48,6.5,1.4,'#728d91');
}
// Nearby control pedestals and markers.
for(const r of rides.filter(r=>currentMap==='park'||r.id==='captain')){const[x,z]=r.control;box(x,0,z,.7,.95,.65,'#536a5b',true);box(x,.95,z,.85,.1,.75,'#c0ac7c');disk(x,.015,z+1.3,.55,'#d9c48c',16);}
// A luminous gateway marks the automatic map transition.
const gateZ=currentMap==='deck'?-6:-8;
for(const x of[-2,2])rod([x,0,gateZ],[x,3.8,gateZ],.14,'#d9c48c');
rod([-2,3.8,gateZ],[2,3.8,gateZ],.14,'#d9c48c');
disk(0,.04,gateZ,1.8,'#d9c48c');
// Footpath petals.
for(let i=0;i<100;i++){let x=Math.sin(i*91)*6,z=-3-(i*.6);disk(x,.025,z,.04+(i%3)*.02,'#c4b9b5',4);}
fixed=new Float32Array(vertices);}
build();
const player={x:0,z:15,yaw:0,pitch:0,eye:1.65};let phase=0,started=false,keeperVisible=false,met=false,firstRide=false,active=null,dialogue=[],dialogAfter=null,keys=new Set(),cleared=new Set(),runUntil={},lastTime=0,elapsed=0,drag=null,muted=false,audio=null,audioTimer=null,audioNodes=[],rideTimer=null,captionUntil=0;
const keeper={x:-2,z:-2.5};let keeperLoaded=false;const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));
const keeperImage=new Image();keeperImage.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,keeperImage);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);keeperLoaded=true;};keeperImage.onerror=()=>toast('키퍼 이미지를 불러오지 못했습니다. assets 폴더를 확인해 주세요.');keeperImage.src='assets/keeper-full.png';
function drawData(data,textured=false){gl.uniform1i(texLoc,textured?1:0);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,data.length/8);}
function dynamicScene(t){vertices=[];
const swingAngle=runUntil.captain>t?Math.sin(t*1.8)*.38:0;
box(3,.35,0,5,.7,3,'#5f4a44');box(3,1.05,0,4.4,.5,2.4,'#9a7860');rod([3,1.3,0],[3,5,0],.09,'#c6b37c');quad([3,4.8,0],[3,2.4,0],[5.2,2.5,0],[4.5,4.8,0],'#d1c7a7');
for(let i=0;i<vertices.length;i+=8){let x=vertices[i]-3,y=vertices[i+1]-6;vertices[i]=3+x*Math.cos(swingAngle)-y*Math.sin(swingAngle);vertices[i+1]=6+x*Math.sin(swingAngle)+y*Math.cos(swingAngle);}
if(currentMap==='park'){
// Wheel spins after the player turns the physical control.
let angle=t*(runUntil.wheel>t?.42:.025);for(let i=0;i<12;i++){let a=i*Math.PI/6+angle,x=-21+Math.cos(a)*6.7,y=8+Math.sin(a)*6.7;rod([-21,8,-28],[x,y,-28],.035,'#c9b887',4);box(x,y-.7,-28,.9,1.1,.85,i%2?'#bea6a1':'#a7bbad');box(x,y+.4,-28,1,.12,.95,'#d2c39d');}
let ca=t*(runUntil.carousel>t?.5:.035);for(let i=0;i<6;i++){let a=i*Math.PI/3+ca,x=21+Math.cos(a)*3.5,z=-27+Math.sin(a)*3.5,y=1.1+Math.sin(t*2+i)*.18;rod([x,.2,z],[x,5,z],.045,'#d2c194',4);box(x,y,z,1.1,.65,.45,'#d7c8b1');box(x+.45,y+.5,z,.35,.6,.35,'#d7c8b1');for(let d of[-.35,.35])rod([x+d,y,z],[x+d,y-.6,z],.07,'#d7c8b1',4);}
let ta=t*(runUntil.tea>t?.7:.04);for(let i=0;i<5;i++){let a=i*Math.PI*2/5+ta,x=20+Math.cos(a)*3.5,z=-48+Math.sin(a)*3.5;cone(x,.25,z,1.15,.8,i%2?'#aaa2be':'#c1a6af');disk(x,1.05,z,1.15,'#e1d6bd');disk(x,1.06,z,.8,'#857b92');rod([x+1,.6,z],[x+1.5,.8,z],.1,'#d2c19b',5);}
}
// Red lever is visibly tilted while Captain Hook is running.
let swing=runUntil.captain>t?Math.sin(t*2)*.45:0;rod([3,1.05,4],[3+Math.sin(swing)*.65,1.7,4],.07,'#a44949');box(3+Math.sin(swing)*.65,1.65,4,.45,.14,.14,'#c25c50');
// Distant fireflies move gently through the mist.
for(let i=0;i<35;i++){let x=Math.sin(i*9.7)*30,z=-10-((i*7.9)%50),y=1.6+Math.sin(t*.4+i)*.8;box(x,y,z,.045,.045,.045,'#dbd5a7');}
return new Float32Array(vertices);}
function billboard(){if(currentMap!=='deck'||!keeperVisible||!keeperLoaded||!$('dialog').hidden)return;vertices=[];const dx=player.x-keeper.x,dz=player.z-keeper.z,len=Math.hypot(dx,dz),rx=dz/len,rz=-dx/len;const h=2.8,w=h*keeperImage.width/keeperImage.height;const p=(side,y)=>[keeper.x+rx*side*w/2,y,keeper.z+rz*side*w/2];const co=[1,1,1];vertex(p(-1,0),co,[0,0]);vertex(p(1,0),co,[1,0]);vertex(p(1,h),co,[1,1]);vertex(p(-1,0),co,[0,0]);vertex(p(1,h),co,[1,1]);vertex(p(-1,h),co,[0,1]);gl.bindTexture(gl.TEXTURE_2D,texture);drawData(new Float32Array(vertices),true);}
function setChapter(num,title,objective){$('chapter').textContent=`0${num} / ${title}`;$('objective').textContent=objective;}
function caption(text,seconds=6){$('caption').textContent=text;captionUntil=elapsed+seconds;}
let toastTimer;function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),5000);}
function say(lines,after){keys.clear();document.exitPointerLock?.();dialogue=lines.slice();dialogAfter=after;$('dialog').hidden=false;$('keeper-front').hidden=!keeperVisible;$('interact').hidden=true;$('caption').textContent='';advance();}
function advance(){if(dialogue.length){const line=dialogue.shift();$('speaker').textContent=line[0];$('line').textContent=line[1];$('next').textContent=dialogue.length?'계속 ↵':'돌아가기 ↵';}else{$('dialog').hidden=true;$('keeper-front').hidden=true;const fn=dialogAfter;dialogAfter=null;fn?.();}}
function travel(map){
currentMap=map;keys.clear();player.x=0;player.z=map==='park'?-12:-4;player.yaw=map==='park'?0:Math.PI;player.pitch=0;build();
$('map-name').textContent=map==='park'?'네버랜드 · 놀이기구 광장':'네버랜드 · 선실과 데크';
caption(map==='park'?'안개를 지나자, 네버랜드의 놀이기구 광장이 펼쳐졌다.':'빛의 문을 지나 데크로 돌아왔다.',8);
if(cleared.size<5)setChapter(6,map==='park'?'놀이기구 광장':'다시, 데크',map==='park'?'각 놀이기구의 조작대를 찾아보세요. 뒤쪽 빛의 문으로 돌아갈 수 있습니다.':'북쪽 빛의 문으로 걸어가면 놀이기구 광장으로 이동합니다.');
}
function updateProgress(){if(!started)return;
if(currentMap==='deck'&&Math.abs(player.x)<1.8&&player.z<-5){if(firstRide&&cleared.has('captain'))travel('park');else{player.z=-4.9;toast('키퍼와 이야기하고 캡틴 훅의 붉은 레버를 먼저 확인하세요.');}return;}
if(currentMap==='park'&&Math.abs(player.x)<1.8&&player.z>-9){travel('deck');return;}
if(phase===0&&player.z<6.5){phase=1;setChapter(2,'안개 너머의 데크','데크 끝의 빛을 향해 걸어가세요.');caption('차가운 난간 너머로, 커다란 원 하나가 천천히 돌아간다.');}
if(phase===1&&player.z<3){phase=2;keeperVisible=true;player.yaw=Math.atan2(player.x-keeper.x,player.z-keeper.z);player.pitch=-.08;setChapter(3,'첫 번째 인사','목소리가 들리는 왼쪽으로 다가가세요.');say([['???','…깨어나셨군요.'],['나','배 밖으로 펼쳐진 건 바다가 아니었다. 안개 속에 관람차와 회전목마가 서 있었다.'],['키퍼','네버랜드 놀이공원에 오신 것을 환영합니다. 저는 이곳의 키퍼예요.']]);}
}
function nearest(){if(phase<2||!$('dialog').hidden||!$('instructions').hidden)return null;let kd=Math.hypot(player.x-keeper.x,player.z-keeper.z);if(currentMap==='deck'&&kd<3.2)return{label:met?'E · 키퍼에게 말 걸기':'E · 키퍼에게 다가가 인사하기',type:'keeper'};if(!met)return null;for(const r of rides.filter(r=>currentMap==='park'||r.id==='captain')){if(Math.hypot(player.x-r.control[0],player.z-r.control[1])<2.65)return{label:`E · ${r.verb}`,type:r.id,ride:r};}return null;}
function interact(){if(!started)return;if(!$('dialog').hidden){advance();return;}const n=nearest();if(!n)return;if(n.type==='keeper'){if(!met){say([['키퍼','너무 서두르지 마세요. 이곳에서는 길도, 기구도 당신을 기다리니까요.'],['나','출구는 어디에 있나요?'],['키퍼','먼저 이 공원의 소리를 들어보는 건 어떨까요. 바로 옆 캡틴 훅의 붉은 레버부터요. 직접 다가가 당겨 보세요.']],()=>{met=true;phase=3;setChapter(4,'붉은 레버','캡틴 훅 옆 조작대에 다가가 레버를 당기세요.');});}else{say([['키퍼',cleared.size===5?'다섯 개의 소리가 모두 돌아왔네요. 이제 이 풍경이 조금은 당신의 기억이 되었을까요?':'저 길을 따라 걸어보세요. 별의 관람차, 장미 회전목마, 거울 미로, 달빛 찻잔… 손이 닿는 곳마다 이야기가 있어요.'],['키퍼','이곳에서 잠시 더 쉬어가셔도 좋아요. 저는 여기 있을 테니까.']]);}return;}const r=n.ride;if(r.id!=='captain'&&!firstRide){toast('먼저 키퍼가 알려준 캡틴 훅의 붉은 레버를 확인해 보세요.');return;}if(runUntil[r.id]>elapsed){toast('기구가 움직이고 있습니다. 잠시 소리를 들어보세요.');return;}runUntil[r.id]=elapsed+22;note(r.id==='carousel'?659:440,.8);if(r.id==='captain'&&!firstRide){firstRide=true;setChapter(5,'되돌아오는 풍경','레버가 움직인다. 배의 삐걱거리는 소리를 들어보세요.');caption('붉은 레버를 당기자 배가 크게 기울었다. 잠깐, 발밑에서 속삭임이…',7);rideTimer=setTimeout(()=>{player.x=0;player.z=10;player.yaw=0;player.pitch=0;runUntil.captain=0;setChapter(6,'다시, 네버랜드','데크 북쪽 빛의 문으로 걸어가 놀이기구 광장에 들어가세요.');cleared.add('captain');stamps();say([['나','눈을 뜨니, 다시 같은 데크였다. 방금 전의 추락은 꿈이었을까.'],['키퍼','…이상하네요. 분명 잘 움직였는데. 괜찮으세요?'],['나','기구 아래에 무언가 있었다. 겹겹이 포개진 그림자들.'],['키퍼','다른 곳도 둘러보시겠어요? 이번에는 천천히 걸어가 봐요.']]);},7500);return;}cleared.add(r.id);stamps();const lines={captain:'레버가 부드럽게 돌아간다. 배가 조용히 출항했다.',wheel:'별 모양 손잡이가 빛난다. 안개 속 곤돌라가 천천히 올라간다.',carousel:'태엽이 풀리며 오래된 선율이 흐른다. 장미빛 목마가 움직이기 시작했다.',mirror:'거울이 돌아간다. 반사된 빛 사이로, 잠깐 출구 같은 것이 보인다.',tea:'보라색 찻잔이 둥글게 돈다. 바람에서 달콤한 차 향기가 난다.'};caption(lines[r.id],9);if(cleared.size===5){setChapter(7,'다섯 개의 기억','탐험을 마쳤습니다. 키퍼에게 돌아가 마지막 인사를 나눠보세요.');toast('탐험 기록 완성 · 키퍼가 데크에서 기다립니다.');}}
function stamps(){$('stamps').textContent=rides.filter(r=>cleared.has(r.id)).map(r=>'✧ '+r.name).join('\n');}
// Music is synthesized locally and begins only inside the user's start gesture.
function initAudio(){if(audio){audio.resume();return;}const AC=window.AudioContext||window.webkitAudioContext;if(!AC){toast('이 브라우저에서는 배경음을 지원하지 않습니다.');return;}audio=new AC();const master=audio.createGain();master.gain.value=muted?0:.18;master.connect(audio.destination);audio.master=master;const delay=audio.createDelay(2);delay.delayTime.value=.43;const feedback=audio.createGain();feedback.gain.value=.24;delay.connect(feedback);feedback.connect(delay);delay.connect(master);audio.delay=delay;let beat=0;const chords=[[130.81,164.81,196,246.94],[110,130.81,164.81,196],[87.31,130.81,174.61,220],[98,146.83,196,246.94]];function schedule(){if(!audio||audio.state==='closed')return;let now=audio.currentTime;const chord=chords[Math.floor(beat/8)%4];for(let j=0;j<4;j++)tone(chord[j],now,.9,.042,'sine');tone(chord[(beat*3)%4]*2,now,.65,.09,'triangle');beat++;}schedule();audioTimer=setInterval(schedule,1150);}
function tone(freq,time,duration,volume,type='sine'){if(!audio)return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+.035);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(gain);gain.connect(audio.master);gain.connect(audio.delay);osc.start(time);osc.stop(time+duration+.02);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
function note(freq,duration){if(audio)tone(freq,audio.currentTime,duration,.12,'triangle');}
$('start').onclick=()=>{started=true;$('cover').hidden=true;initAudio();caption('천천히 눈을 떴다. 나무 바닥에, 희미한 빛이 내려앉아 있다.',8);};
$('sound').onclick=()=>{muted=!muted;if(audio)audio.master.gain.setTargetAtTime(muted?0:.18,audio.currentTime,.1);$('sound').textContent=muted?'소리 꺼짐 ♩':'소리 켜짐 ♫';$('sound').setAttribute('aria-pressed',String(muted));};
$('next').onclick=advance;$('interact').onclick=interact;
$('help').onclick=()=>{keys.clear();document.exitPointerLock?.();$('instructions').hidden=false;};$('closeHelp').onclick=()=>{$('instructions').hidden=true;};
$('restart').onclick=()=>{clearTimeout(rideTimer);currentMap='deck';build();$('map-name').textContent='네버랜드 · 선실과 데크';phase=0;started=false;keeperVisible=false;met=false;firstRide=false;cleared.clear();runUntil={};keys.clear();player.x=0;player.z=15;player.yaw=0;player.pitch=0;stamps();$('dialog').hidden=true;$('keeper-front').hidden=true;$('cover').hidden=false;$('interact').hidden=true;setChapter(1,'낯선 선실','빛이 새어드는 문으로 걸어가세요.');};
window.addEventListener('keydown',e=>{if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' ','e','enter'].includes(e.key.toLowerCase()))e.preventDefault();if(e.repeat&&(e.key==='e'||e.key==='Enter'))return;if(e.key.toLowerCase()==='e')interact();else if(e.key==='Enter'&&!$('dialog').hidden)advance();else keys.add(e.key.toLowerCase());});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();if(audio){if(document.hidden)audio.suspend();else if(started)audio.resume();}});
canvas.addEventListener('click',()=>{if(started&&$('dialog').hidden&&$('instructions').hidden&&matchMedia('(pointer:fine)').matches){const request=canvas.requestPointerLock?.();request?.catch?.(()=>{});}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&started&&$('dialog').hidden){player.yaw-=e.movementX*.0022;player.pitch=Math.max(-.7,Math.min(.7,player.pitch-e.movementY*.0018));}});
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(drag&&document.pointerLockElement!==canvas&&started&&$('dialog').hidden){player.yaw-=(e.clientX-drag.x)*.005;player.pitch=Math.max(-.7,Math.min(.7,player.pitch-(e.clientY-drag.y)*.003));drag.x=e.clientX;drag.y=e.clientY;}});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);b.onlostpointercapture=()=>keys.delete(b.dataset.key);});
function valid(x,z){if(currentMap==='deck'&&z<-7||currentMap==='park'&&z>-7)return false;if(x<-35||x>35||z<-60||z>18.5)return false;return !colliders.some(c=>x>c.a&&x<c.b&&z>c.l&&z<c.r);}
function resize(){const scale=Math.min(devicePixelRatio,1.3),w=Math.floor(innerWidth*scale),h=Math.floor(innerHeight*scale);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}}
function landmarks(){const m=cameraMatrix();for(const r of rides){const el=$('label-'+r.id),p=[r.control[0],2,r.control[1],1],q=[0,0,0,0];for(let row=0;row<4;row++)for(let k=0;k<4;k++)q[row]+=m[k*4+row]*p[k];const visible=(currentMap==='park'||r.id==='captain')&&started&&$('dialog').hidden&&phase>=1&&player.z<7&&q[3]>1&&Math.abs(q[0]/q[3])<.94&&Math.abs(q[1]/q[3])<.8&&Math.hypot(player.x-p[0],player.z-p[2])<55;el.style.display=visible?'block':'none';if(visible){el.style.left=(q[0]/q[3]*.5+.5)*innerWidth+'px';el.style.top=(-q[1]/q[3]*.5+.5)*innerHeight+'px';}}}
function frame(ms){let dt=Math.min((ms-lastTime)/1000,.05);lastTime=ms;elapsed+=dt;resize();if(started&&$('dialog').hidden&&$('instructions').hidden){let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),strafe=(keys.has('d')?1:0)-(keys.has('a')?1:0);player.yaw+=((keys.has('arrowleft')?1:0)-(keys.has('arrowright')?1:0))*dt*1.6;const norm=Math.hypot(forward,strafe)||1,speed=(keys.has('shift')?5:3)*dt;const dx=(-Math.sin(player.yaw)*forward+Math.cos(player.yaw)*strafe)/norm*speed,dz=(-Math.cos(player.yaw)*forward-Math.sin(player.yaw)*strafe)/norm*speed;if(valid(player.x+dx,player.z))player.x+=dx;if(valid(player.x,player.z+dz))player.z+=dz;player.eye=1.65+(forward||strafe?Math.sin(elapsed*7)*.025:0);updateProgress();}gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(vpLoc,false,cameraMatrix());drawData(fixed);drawData(dynamicScene(elapsed));billboard();landmarks();if(started){active=nearest();$('interact').hidden=!active;$('interact').textContent=active?.label||'';if(elapsed>captionUntil)$('caption').textContent='';}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// Read-only runtime state supports reproducible QA without altering play behavior.
window.neverland={get state(){return{currentMap,phase,started,keeperVisible,keeperLoaded,met,firstRide,cleared:[...cleared],player:{...player},active:active?.type,glError:gl.getError()};}};
