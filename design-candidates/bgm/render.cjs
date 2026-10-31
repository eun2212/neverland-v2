// Original procedural compositions; no sampled recordings or external services.
const fs=require('fs'),path=require('path');
const RATE=22050,root=__dirname,out=path.resolve(root,'../../../outputs/bgm');fs.mkdirSync(out,{recursive:true});
const groups=[
 ['main','메인 · 공원 산책',[
 ['불 꺼지기 전의 초대',76,4,'minor','box','strings','waltz','따뜻한 오르골과 낮은 현악. 환영 속에 한 음씩 불안이 스칩니다.'],
 ['별빛 입장권',88,3,'lydian','celesta','harp','waltz','가볍고 맑은 천상 왈츠. 아름다운 공원에 먼저 마음이 가는 방향.'],
 ['폐장하지 않는 공원',64,4,'dorian','piano','pad','sparse','비어 있는 피아노와 느린 잔향. 처음부터 외롭고 조금 낯선 방향.']]],
 ['captain','캡틴 훅',[
 ['검은 물 위의 돛',78,3,'minor','wood','strings','sway','목관풍 선율과 낮은 현악이 배처럼 좌우로 흔들립니다.'],
 ['금빛 갑판 행진곡',96,4,'dorian','calliope','bass','march','낡은 유원지 오르간과 가벼운 북. 모험 같지만 끝음은 불안합니다.'],
 ['밧줄 아래의 수심',60,4,'phrygian','bell','pad','pulse','물속 같은 저음과 드문 종소리. 사고 전 긴장감에 가까운 방향.']]],
 ['wheel','관람차',[
 ['마지막 별자리',68,4,'lydian','celesta','strings','float','높이 올라가는 첼레스타와 긴 현악. 고요하고 경이로운 밤하늘.'],
 ['하차하지 않은 시간',72,3,'minor','box','piano','clock','시계 같은 작은 박동과 쓸쓸한 오르골. 멈춘 시간의 느낌.'],
 ['유리 곤돌라',62,4,'dorian','glass','pad','sparse','유리 음색과 넓은 공간. 아름다움보다 고립감이 강합니다.']]],
 ['carousel','회전목마',[
 ['장미빛 회전 왈츠',104,3,'major','calliope','bass','waltz','유원지 오르간이 이끄는 화려한 왈츠. 밝은 표면에 작은 뒤틀림.'],
 ['누나의 빈 목마',76,3,'minor','box','strings','waltz','작은 오르골과 가느다란 현악. 동화처럼 시작하는 애잔한 곡.'],
 ['한 바퀴 더',92,3,'harmonic','wood','harp','clock','태엽 같은 반복과 목관. 계속 돌아가는 기구의 기묘한 규칙성.']]],
 ['mirror','거울 미로',[
 ['반사된 출구',74,4,'phrygian','glass','pad','echo','유리 음색의 응답이 좌우로 번집니다. 길을 오인하는 미로의 느낌.'],
 ['얼굴 없는 반주',66,4,'harmonic','piano','strings','sparse','낮은 피아노와 조용한 현악. 멜로디가 비어 있는 틈이 많습니다.'],
 ['빛을 따라가지 마',86,4,'whole','bell','pad','pulse','온음 음계와 조심스러운 박동. 방향 감각이 흐려지는 불안.']]],
 ['tea','찻잔',[
 ['식지 않는 티파티',100,3,'major','wood','harp','waltz','피치카토 같은 목질음과 하프의 작은 왈츠. 정중하고 기묘한 환대.'],
 ['작은 잔 하나',80,4,'dorian','celesta','piano','sparse','작은 첼레스타 선율과 피아노. 누군가를 기다리는 빈자리.'],
 ['설탕 세 바퀴',108,3,'harmonic','calliope','bass','clock','장난감 오르간과 가벼운 회전 리듬. 달콤하면서 어딘가 어긋납니다.']]],
 ['exit','출구 · 키퍼와 대치',[
 ['닫힌 새벽의 문',72,4,'harmonic','piano','strings','pulse','낮은 현악과 단호한 피아노. 위협과 슬픔이 함께 있는 대치.'],
 ['당신을 위한 감옥',66,3,'minor','box','pad','clock','메인 음형을 느리게 비튼 오르골. 친절했던 안내자의 집착.'],
 ['왕관 아래의 고백',88,4,'phrygian','bell','strings','march','무거운 종과 현악의 규칙적 압박. 악역의 존재감이 강한 방향.']]],
 ['monochrome','흑백 맵 · 인형 무덤',[
 ['색이 사라진 자장가',56,3,'minor','box','pad','sparse','느리고 드문 오르골. 불완전한 자장가가 빈 공간에 남습니다.'],
 ['앞으로만 걷는 행렬',64,4,'phrygian','wood','strings','pulse','마른 목질음과 낮은 지속음. 돌아갈 수 없는 발걸음.'],
 ['이름이 지워진 곳',52,4,'whole','glass','pad','echo','유리 잔향과 방향 없는 화음. 가장 추상적이고 적막한 방향.']]]
];
const scales={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],lydian:[0,2,4,6,7,9,11],phrygian:[0,1,3,5,7,8,10],harmonic:[0,2,3,5,7,8,11],whole:[0,2,4,6,8,10]};
const midi=n=>440*2**((n-69)/12);let seed=1;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function compose(id,index,spec){const [title,bpm,meter,key,lead,back,groove,description]=spec,beat=60/bpm,bars=12,duration=beat*meter*bars,N=Math.round(duration*RATE),left=new Float32Array(N),right=new Float32Array(N),events=[];seed=12341+index*313+id.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
 const scale=scales[key],tonic=([ 'exit','monochrome','captain'].includes(id)?48:60)+(index===1?2:index===2?-2:0);
 const degree=(n,oct=0)=>tonic+scale[((n%scale.length)+scale.length)%scale.length]+12*(Math.floor(n/scale.length)+oct);
 function note(t,deg,len,amp,type,oct=0,pan=0){const pitch=degree(deg,oct);events.push({t,pitch,len,amp,type,pan});}
 const harmonies=index===0?[0,5,3,4]:index===1?[0,3,5,4]:[0,4,1,3];
 // Shared 0-2-1-4 gesture; each option has its own meter, phrasing and accompaniment.
 const motifs=[[0,2,1,4,3,2,1,0],[4,2,0,1,5,4,2,1],[0,1,4,3,1,0,2,-1]];
 const motif=motifs[index];
 for(let bar=0;bar<bars;bar++){const t=bar*meter*beat,h=harmonies[Math.floor(bar/3)%4],last=bar===bars-1;
  if(back==='strings'||back==='pad'){for(const deg of [h,h+2,h+4])note(t,deg,meter*beat*1.1,back==='strings'?.055:.045,back,-1,(deg-h-2)*.2);}
  else if(back==='harp'){for(let b=0;b<meter*2;b++)note(t+b*beat/2,h+[0,2,4,6][b%4],beat*1.7,.055,'harp',b%4===3?0:-1,Math.sin(b)*.5);}
  else if(back==='piano'){note(t,h,meter*beat*.85,.075,'piano',-1,-.3);note(t+beat*(meter>3?2:1),h+4,beat*1.7,.05,'piano',-1,.3);}
  else{note(t,h,beat*1.1,.1,'bass',-2,-.1);for(let b=1;b<meter;b++){note(t+b*beat,h+2,beat*.65,.045,'wood',-1,.2);note(t+b*beat,h+4,beat*.65,.035,'wood',-1,-.2);}}
  const sparse=groove==='sparse'||id==='monochrome';const pattern=sparse?[0,Math.floor(meter*.66)]:index===0?[0,1,2]:index===1?[0,.5,1.5,meter-1]:[0,1,meter-1];
  for(let j=0;j<pattern.length;j++){const b=pattern[j];if(b>=meter||bar%4===3&&j===pattern.length-1)continue;let deg=motif[(bar*2+j)%motif.length]+(bar>=4&&bar<8?2:0);if(last&&j===0)deg=0;if(id==='mirror'&&bar%3===2)deg+=1;
   note(t+b*beat,deg,beat*(sparse?2.2:1.3),.13*(bar%4===0?1:.88),lead,tonic<55?1:0,Math.sin(bar+j)*.25);
   if(groove==='echo'&&j===0)note(t+(b+.75)*beat,deg,beat*1.9,.06,lead,tonic<55?1:0,.65);
  }
  if(groove==='clock'){for(let b=0;b<meter;b++)events.push({t:t+b*beat,pitch:b%2?1900:1400,len:.055,amp:.015,type:'tick',pan:b%2?.3:-.3});}
  if(['pulse','march','sway'].includes(groove)){for(let b=0;b<meter;b+=groove==='march'?1:2)note(t+b*beat,h,beat*.65,.075,'bass',-2,0);}
  if(id==='main'&&bar===7)note(t+beat*(meter-.5),6,beat*1.4,.045,'glass',0,.5);
 }
 function synth(e){const start=Math.round(e.t*RATE),freq=e.type==='tick'?e.pitch:midi(e.pitch),samples=Math.ceil(Math.min(e.len,6)*RATE),angle=(e.pan+1)*Math.PI/4,l=Math.cos(angle),r=Math.sin(angle);for(let k=0;k<samples;k++){const t=k/RATE,x=t/e.len,phase=2*Math.PI*freq*t;let v=0,env=1;switch(e.type){
  case 'box':v=Math.sin(phase)+.28*Math.sin(phase*2.01)*Math.exp(-t*8)+.12*Math.sin(phase*4.02)*Math.exp(-t*12);env=(1-Math.exp(-t*200))*Math.exp(-t*4.2);break;
  case 'celesta':v=Math.sin(phase)+.32*Math.sin(phase*3)*Math.exp(-t*5)+.1*Math.sin(phase*5.02);env=(1-Math.exp(-t*150))*Math.exp(-t*3);break;
  case 'glass':v=Math.sin(phase)+.24*Math.sin(phase*2.76)+.12*Math.sin(phase*5.4);env=(1-Math.exp(-t*90))*Math.exp(-t*1.9);break;
  case 'bell':v=Math.sin(phase)+.48*Math.sin(phase*2.4)*Math.exp(-t*2)+.2*Math.sin(phase*5.2)*Math.exp(-t*4);env=(1-Math.exp(-t*160))*Math.exp(-t*1.7);break;
  case 'piano':v=Math.sin(phase)+.38*Math.sin(phase*2)*Math.exp(-t*3)+.17*Math.sin(phase*3)*Math.exp(-t*5)+.05*Math.sin(phase*7);env=(1-Math.exp(-t*180))*Math.exp(-t*2.5);break;
  case 'wood':v=Math.sin(phase)+.35*Math.sin(phase*3)*Math.exp(-t*15);env=(1-Math.exp(-t*200))*Math.exp(-t*7);break;
  case 'harp':v=Math.sin(phase)+.3*Math.sin(phase*2)+.12*Math.sin(phase*3);env=(1-Math.exp(-t*150))*Math.exp(-t*5);break;
  case 'calliope':v=Math.sin(phase)+.32*Math.sin(phase*2)+.2*Math.sin(phase*3)+.09*Math.sin(phase*4);env=Math.min(1,t/.035)*Math.min(1,(e.len-t)/.14)*.6;break;
  case 'strings':for(let h=1;h<=5;h++)v+=Math.sin(phase*h+.009*h*Math.sin(t*31))/h**1.6;env=Math.min(1,t/.3)*Math.min(1,(e.len-t)/.5)*.6;break;
  case 'pad':v=Math.sin(phase)+.26*Math.sin(phase*1.003)+.14*Math.sin(phase*.5);env=Math.min(1,t/.7)*Math.min(1,(e.len-t)/.7)*.6;break;
  case 'bass':v=Math.sin(phase)+.2*Math.sin(phase*2);env=(1-Math.exp(-t*90))*Math.exp(-t*3);break;
  case 'tick':v=(rand()*2-1)*.5+Math.sin(phase)*.5;env=Math.exp(-t*95);break;
 }env*=Math.min(1,Math.max(0,(e.len-t)*60));const z=v*env*e.amp,at=(start+k)%N;left[at]+=z*l;right[at]+=z*r;}}
 events.forEach(synth);
 // Circular reverb keeps the preview loop tail continuous.
 const dl=new Float32Array(N),dr=new Float32Array(N);for(const [sec,gain]of [[.113,.13],[.227,.1],[.389,.075],[.617,.05],[.941,.035]]){const d=Math.round(sec*RATE);for(let i=0;i<N;i++){const j=(i+d)%N;dl[j]+=right[i]*gain;dr[j]+=left[i]*gain;}}let peak=0,sum=0;for(let i=0;i<N;i++){left[i]+=dl[i];right[i]+=dr[i];peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));sum+=left[i]**2+right[i]**2;}const gain=Math.min(.8/(peak||1),.15/Math.sqrt(sum/(2*N)||1));
 const wav=Buffer.alloc(44+N*4);wav.write('RIFF');wav.writeUInt32LE(36+N*4,4);wav.write('WAVE',8);wav.write('fmt ',12);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(RATE,24);wav.writeUInt32LE(RATE*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(N*4,40);for(let i=0;i<N;i++){wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,left[i]*gain))*32767),44+i*4);wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,right[i]*gain))*32767),46+i*4);}const filename=id+'-'+String.fromCharCode(65+index)+'.wav';fs.writeFileSync(path.join(root,filename),wav);fs.writeFileSync(path.join(out,filename),wav);
 return{id,option:String.fromCharCode(65+index),title,bpm,meter,scale:key,instruments:[lead,back],description,duration:Math.round(duration*10)/10,filename,notes:events.length,peak:Math.round(peak*gain*1000)/1000};
}
const manifest=[];for(const [id,label,options]of groups){for(let i=0;i<3;i++){const info=compose(id,i,options[i]);manifest.push({...info,scene:label});console.log(id+' '+info.option+' '+info.duration+'s');}}
fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify({status:'audition only; game unchanged',method:'original procedural synthesis',sampleRate:RATE,tracks:manifest},null,2)+'\n');fs.copyFileSync(path.join(root,'manifest.json'),path.join(out,'manifest.json'));
const html='<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>네버랜드 BGM · 24곡 비교</title><style>body{background:#131923;color:#ede4ce;font:16px system-ui;max-width:1300px;margin:35px auto;padding:20px}h1,h2{color:#e4c17a}p{line-height:1.7}section{margin:45px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}article{padding:20px;background:#212d35;border:1px solid #576252;border-radius:12px}audio{width:100%}small{color:#bcc5bf}.pick{color:#e4c17a}button{padding:10px;background:#334b43;color:#fff;border:1px solid #b59a65;cursor:pointer}a{color:#e4c17a}@media(max-width:800px){.grid{grid-template-columns:1fr}}</style><h1>네버랜드 · BGM 후보 24곡</h1><p>8개 상황 × A·B·C. 직접 작곡하고 악기 소리를 합성한 감상용 시안입니다. 전문 연주 음원의 최종 마스터가 아닙니다. 각 트랙은 반복 재생됩니다. 게임에는 아직 적용하지 않았습니다.</p><p>다른 곡을 재생하면 이전 곡이 멈춥니다. 상황마다 하나씩 골라주세요.</p>'+groups.map(([id,label])=>'<section><h2>'+label+'</h2><div class="grid">'+manifest.filter(t=>t.id===id).map(t=>'<article><h3>'+t.option+' · '+t.title+'</h3><small>'+t.bpm+' BPM · '+t.meter+'/4 · '+t.duration+'초</small><p>'+t.description+'</p><audio controls loop preload="none" src="'+t.filename+'"></audio><p><label><input type="radio" name="'+id+'" value="'+t.option+'"> 이 곡 선택</label> · <a href="'+t.filename+'" download>WAV 저장</a></p></article>').join('')+'</div></section>').join('')+'<button id="copy">선택 결과 복사</button><p class="pick" id="selection">아직 선택한 곡이 없습니다.</p><script>const players=[...document.querySelectorAll("audio")];players.forEach(a=>a.addEventListener("play",()=>players.forEach(b=>{if(b!==a)b.pause()})));const update=()=>{const chosen=[...document.querySelectorAll("input:checked")].map(x=>x.name+" "+x.value).join(" / ");document.getElementById("selection").textContent=chosen||"아직 선택한 곡이 없습니다."};document.querySelectorAll("input").forEach(x=>x.onchange=update);document.getElementById("copy").onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById("selection").textContent)}catch(e){document.getElementById("selection").style.userSelect="all"}};</script></html>';
for(const dir of [root,out])fs.writeFileSync(path.join(dir,'index.html'),html);
console.log('Rendered '+manifest.length+' original stereo WAV previews.');
