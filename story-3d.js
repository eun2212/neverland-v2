'use strict';
// Original narrative and scoring remain in story-core.js. Adapt movement and add the physical exit encounter.
const world3d=window.neverlandWorld;
const original3d={say,modal,close,newGame,intro,tutorial,hub,map,arriveAtRide,openPuzzle,success,finale,scene,records};
let free3d=false,intro3d=false,firstLever3d=false,atControl3d=false,atExit3d=false,target3d=null,confronting3d=false;
const controls3d=window.NEVERLAND_LAYOUT.rides.map(r=>r.control);
const cluePositions3d=window.NEVERLAND_LAYOUT.clues;
let pendingRideResult=null;
function updateRideUI(){const state=world3d.state,d=state.interior;$('ride-panel').hidden=!d;document.body.classList.toggle('inside-ride',!!d);if(!d)return;const roaming=$('stage').classList.contains('walking')&&!$('overlay').children.length;$('ride-status').textContent=d.running?'탑승 중 · '+Math.round(d.progress*100)+'%':d.ride===3?(d.solved?'봉인 해제 · 반대편 빛의 문으로 걸어가세요.':'거울 사이로 길을 찾아 빛 장치를 조작하세요.'):d.seated?'좌석에 앉았습니다 · E로 조작 / Q로 일어나기':'기구 안을 걸어 둘러보세요 · 좌석 근처에서 E';$('ride-progress').value=d.progress;$('ride-progress').hidden=!d.running;$('ride-operate').disabled=d.running||!roaming||(d.ride!==3&&!d.seated);$('ride-stand').disabled=d.running||!d.seated||!roaming;$('ride-return').disabled=d.running||!roaming;}
function returnToPark(){if(!world3d.leaveRide()){world3d.notify('움직이는 동안에는 탑승을 마칠 때까지 기다려 주세요.');return;}pendingRideResult=null;explore3d('기구 입구로 돌아왔습니다. 다른 구역을 걸어서 둘러보세요.');}
function interiorMap3d(){const state=world3d.state,d=window.NEVERLAND_INTERIORS[state.interior.ride],b=d.bounds,p=state.player;modal('<h1>'+d.name+'</h1><p>붉은 점은 현재 위치, 금빛 원은 좌석, 초록 문은 공원으로 돌아가는 곳입니다.</p><div class="position-map"><svg viewBox="'+(b[0]-2)+' '+(b[2]-2)+' '+(b[1]-b[0]+4)+' '+(b[3]-b[2]+4)+'" role="img" aria-label="놀이기구 내부 지도"><rect x="'+b[0]+'" y="'+b[2]+'" width="'+(b[1]-b[0])+'" height="'+(b[3]-b[2])+'" fill="#e1c993"/>'+d.walls.map(([x,z,w,h])=>'<rect x="'+(x-w/2)+'" y="'+(z-h/2)+'" width="'+w+'" height="'+h+'" fill="#335b4b"/>').join('')+(d.seat?'<circle cx="'+d.seat[0]+'" cy="'+d.seat[1]+'" r=".7" fill="#e4b44b"/>':'')+'<rect x="'+(d.control[0]-.4)+'" y="'+(d.control[1]-.4)+'" width=".8" height=".8" fill="#ad343a"/><circle cx="'+d.exit[0]+'" cy="'+d.exit[1]+'" r=".65" fill="#386a46"/>'+(d.finish?'<circle cx="'+d.finish[0]+'" cy="'+d.finish[1]+'" r=".65" fill="#e7e9ba"/>':'')+'<circle cx="'+p.x+'" cy="'+p.z+'" r=".4" fill="#c43146" stroke="#fff" stroke-width=".15"/></svg></div><button id="inside-map-close">닫기</button>');$('inside-map-close').onclick=()=>explore3d();}
function sync3d(){
 if(!s)return;
 const roaming=$('stage').classList.contains('walking')&&!$('overlay').children.length&&s.phase!=='ending';
 document.body.classList.toggle('exploring',roaming);
 document.getElementById('world-caption').hidden=!roaming;
 world3d.configure({paused:!roaming||!!window.carnivalScene?.overview,free:free3d,intro:intro3d,keeperIntroduced:s.keeperIntroduced,ride:s.ride,cleared:[...s.cleared],clues:[...s.clues],exit:s.exit,exitRide:s.exitRide,target:target3d,confronting:confronting3d});
 $('walk-title').textContent=world3d.state.interior?window.NEVERLAND_INTERIORS[world3d.state.interior.ride].name:rides[s.ride].name+' · 네버랜드';
 $('walk-progress').textContent='정상 탑승 '+s.cleared.size+' / 5 · 조사한 흔적 '+s.clues.size+' / 5';
 updateRideUI();
}
function explore3d(message){
 close();s.phase='main';scene('warm');$('stage').classList.add('walking');
 if(world3d.state.interior){target3d=null;message=message||window.NEVERLAND_INTERIORS[world3d.state.interior.ride].description;}
 $('walk-objective').textContent=message||'WASD로 걸어가세요. 키퍼·조작대·금빛 흔적 가까이에서 E로 상호작용합니다.';
 sync3d();
}
say=function(...args){$('stage').classList.remove('walking');original3d.say(...args);sync3d();};
modal=function(html){original3d.modal(html);sync3d();};
close=function(){original3d.close();sync3d();};
scene=function(mode){original3d.scene(mode);sync3d();};
newGame=function(){free3d=false;intro3d=false;firstLever3d=false;target3d=null;confronting3d=false;pendingRideResult=null;window.carnivalScene?.setOverview(false);$('scenic-view').textContent='전체 풍경';$('scenic-view').setAttribute('aria-pressed','false');world3d.reset();$('stage').classList.remove('walking');original3d.newGame();sync3d();};
intro=function(){
 world3d.audio();
 story([[s.name,'오랜만에 찾아온 네버랜드. 캡틴 훅을 기다리다가 졸음에 눈을 감았다.','warm'],[s.name,'눈을 뜨니 네버랜드 놀이공원이다. 텅 빈 승차 데크. 폐장했을 텐데 멀리서 음악이 들린다.']],()=>{intro3d=true;target3d=[0,-8];explore3d('선실 문을 지나 그랜드 엔트리 너머 중앙 캡틴 훅으로 걸어가세요. WASD 이동 · Shift 빠르게 걷기');});
};
tutorial=function(){firstLever3d=true;target3d=controls3d[0];explore3d('중앙 섬 앞 캡틴 훅 입구에서 E로 승선하세요. 배 안에서 좌석에 앉아 레버를 조작합니다.');};
hub=function(text){
 original3d.hub(text);
 if(world3d.state.interior){const other=$('choices').children[2];other.textContent='③ 공원으로 돌아가 다른 기구 찾기';other.onclick=()=>{returnToPark();map();};}
 $('choices').append(btn('④ 직접 걸어 둘러보기',()=>explore3d()));
};
map=function(){
 if(world3d.state.interior){interiorMap3d();return;}
 if(!free3d&&s.phase==='main'&&!intro3d&&!firstLever3d&&s.keeperIntroduced){free3d=true;target3d=null;}
 const p=world3d.state.player;
 let nearestRide=0,distance=Infinity;
 controls3d.forEach(([x,z],i)=>{const d=Math.hypot(p.x-x,p.z-z);if(d<distance){distance=d;nearestRide=i;}});
 const place=p.z>19?'선실':p.z>8?'그랜드 엔트리':distance<11?rides[nearestRide].name+' 구역':'순환 산책로';
 const labels=window.NEVERLAND_LAYOUT.rides.map(r=>[r.name,r.x,r.z]);
 modal('<div class="eyebrow">NEVERLAND / YOU ARE HERE</div><h1>네버랜드의 지도</h1><p>붉은 점이 지금 서 있는 위치입니다. 화살표는 바라보는 방향입니다.</p><div class="position-map"><svg viewBox="-40 -63 80 94" role="img" aria-label="네버랜드 지도 · 현재 위치: '+place+'"><rect x="-39" y="-62" width="78" height="92" rx="5" fill="#cbd6b9"/><circle cx="0" cy="-24" r="12" fill="none" stroke="#73b7b5" stroke-width="4"/><circle cx="0" cy="-24" r="16.5" fill="none" stroke="#eee2bc" stroke-width="4.5"/><path d="M0 28V-14M-10-24H10M0-34V-39M-23 1L-16-14M23 1L16-14M-23-36L-12-36M23-36L12-36" stroke="#eee2bc" stroke-width="4" fill="none"/><rect x="-7" y="12" width="14" height="2" fill="#9f2936"/><text x="0" y="18" class="map-place">그랜드 엔트리</text><rect x="-4.5" y="20" width="9" height="8" fill="#526f5c"/><text x="0" y="25" class="map-building">선실</text>'+labels.map(([name,x,z],i)=>'<g class="map-landmark"><circle cx="'+x+'" cy="'+z+'" r="'+(i===0?3.6:5)+'" fill="#788d73" stroke="#57715f" stroke-width=".4"/><text x="'+x+'" y="'+(z+.9)+'" text-anchor="middle" fill="#fff8de" font-size="3">'+['⚓','✦','♞','◇','☕'][i]+'</text><text x="'+x+'" y="'+(z+8)+'" class="map-place">'+name+'</text></g>').join('')+'<text x="31" y="-55" class="map-place">북 ↑</text><g id="map-player" transform="translate('+p.x+' '+p.z+')"><circle r="2.4" fill="#b43149" stroke="#fff9e6" stroke-width=".7"/><path d="M0-5.5L-1.7-2.8H1.7Z" fill="#b43149" stroke="#fff9e6" stroke-width=".35" transform="rotate('+(-p.yaw*180/Math.PI)+')"/></g></svg></div><p class="map-current" role="status">● 현재 위치: '+place+'</p><button id="backMap">닫기</button>');
 if(s.exit){
  const [x,z]=controls3d[s.exitRide],marker=document.createElementNS('http://www.w3.org/2000/svg','g');
  marker.setAttribute('id','map-exit');marker.setAttribute('transform','translate('+(x+4)+' '+(z+2)+')');
  marker.setAttribute('class',world3d.state.exitReveal.age<6?'exit-emerging':'');
  marker.innerHTML='<circle class="map-exit-aura" r="4" fill="#fff0a0" fill-opacity=".25" stroke="#e7c168" stroke-width=".3"/><g class="map-exit-door"><rect x="-2" y="-3" width="4" height="5" rx=".6" fill="#fff1a6" stroke="#986626" stroke-width=".6"/><path d="M-1 1V-2H1V1" fill="none" stroke="#986626" stroke-width=".5"/></g><text y="-5" class="map-place">출구 · 키퍼</text>';
  const svg=document.querySelector('.position-map svg');svg.append(marker);svg.append($('map-player'));
 }
 $('backMap').onclick=()=>explore3d();sync3d();
};
arriveAtRide=function(i){
 close();s.ride=i;s.visited.add(i);s.talks=0;log('travel');target3d=null;
 explore3d(rides[i].name+' 구역에 도착했습니다. 키퍼, 조작대, 금빛 흔적을 찾아보세요.');
};
openPuzzle=function(){
 if(!atControl3d){const inside=world3d.state.interior;if(inside){if(inside.ride!==3&&inside.seated){original3d.openPuzzle();sync3d();return;}explore3d(inside.ride===3?'회랑 안쪽의 빛 장치까지 걸어가 E를 누르세요.':'좌석에 다가가 E로 탑승한 뒤 장치를 조작하세요.');return;}target3d=controls3d[s.ride];explore3d(rides[s.ride].name+' 입구에 다가가 E로 내부 공간에 들어가세요.');return;}
 original3d.openPuzzle();sync3d();
};
success=function(help,risk=false){if(world3d.state.interior){close();if(s.ride===3){pendingRideResult={kind:'mirror',help,risk};world3d.unlockInterior();explore3d('거울의 봉인이 풀렸습니다. 회랑 반대편 빛의 출구까지 직접 걸어가세요.');return;}pendingRideResult={kind:'normal',help,risk};if(world3d.startRide()){explore3d('안전 장치가 잠겼습니다. 탑승한 자리에서 주변을 둘러보세요.');return;}pendingRideResult=null;world3d.notify('먼저 좌석에 앉아 주세요.');return;}world3d.animateRide(s.ride);original3d.success(help,risk);sync3d();};
finale=function(){
 if(!atExit3d){const p=controls3d[s.exitRide];target3d=[p[0]+4,p[1]+2];explore3d(rides[s.exitRide].name+' 구역의 금빛 출구로 걸어가 E를 누르세요.');return;}
 confronting3d=true;target3d=null;sync3d();world3d.faceExit();
 story([['','새벽빛이 새어 나오는 문 앞에 키퍼가 서 있다. 그가 한 걸음 앞으로 나서자, 문을 감싼 금빛 봉인이 길을 가로막는다.'],['키퍼','…정말 이 문을 찾으셨네요. 조금만 더, 저와 여기 있어 주시면 안 되나요?'],['키퍼','당신이 네버랜드를 떠나지 않았으면 해요. 당신이 가고 나면 저는 또 이곳에 혼자 남으니까.'],['', '그는 웃으려다 고개를 숙인다. 늘 길을 안내하던 손이 이번에는 출구 앞을 가로막고 있다.'],['키퍼','알아요. 제 외로움이 당신을 붙잡아 둘 이유가 될 수는 없다는 걸. 그래도… 지금은 선뜻 비켜 드릴 수가 없어요.']],()=>original3d.finale());sync3d();
};
function investigate3d(){
 if(!s.clues.has(s.ride)){s.clues.add(s.ride);s.N+=2;s.I++;log('explore');}
 story([[s.name,clues[s.ride]]],()=>{checkExit();explore3d(s.exit?rides[s.exitRide].name+' 구역에 새벽빛의 출구가 나타났습니다. 준비가 되면 걸어가세요.':'흔적을 확인했습니다. 다른 구역도 걸어서 둘러보세요.');});
}
world3d.connect(action=>{
 if(action.type==='interior-leave'){returnToPark();return;}
 if(action.type==='interior-seat'){if(world3d.sit())explore3d('탑승했습니다. E 또는 기구 조작 버튼으로 장치를 작동하세요. Q로 일어날 수 있습니다.');return;}
 if(action.type==='ride-running'){world3d.notify('탑승 중입니다. 마우스나 방향키로 주변을 둘러보세요.');return;}
 if(action.type==='mirror-locked'){world3d.notify('빛 장치를 풀어야 이 출구의 봉인이 열립니다.');return;}
 if(action.type==='mirror-finish'){const result=pendingRideResult;if(result?.kind==='mirror'){pendingRideResult=null;world3d.leaveRide();world3d.animateRide(s.ride);original3d.success(result.help,result.risk);sync3d();}return;}
 if(action.type==='ride-complete'){const result=pendingRideResult;pendingRideResult=null;if(result?.kind==='tutorial'){world3d.leaveRide();result.commit();}else if(result?.kind==='normal'){world3d.animateRide(s.ride);original3d.success(result.help,result.risk);}sync3d();return;}
 if(action.type==='intro'){
  intro3d=false;target3d=null;
  story([['키퍼','깨어나셨군요. 저는 이곳의 키퍼입니다. 즐거운 시간 되세요.'],['키퍼','출구요? 놀이기구 중 하나가 바깥과 이어져 있어요. 우선 캡틴 훅으로 가볼까요?'],['키퍼','붉은 레버를 STOP에서 GO까지 천천히 밀어주세요. 조명, 미동, 출발 준비… 마지막이 출발입니다.']],tutorial);return;
 }
 if(action.type==='control'){if(world3d.enterRide(action.ride)){target3d=null;explore3d();}return;}
 if(action.type==='interior-control'){
  const inside=world3d.state.interior;if(!inside)return;if(inside.ride!==3&&!inside.seated){world3d.notify('좌석에 가까이 가서 E로 먼저 탑승하세요.');return;}
  target3d=null;atControl3d=true;
  try{if(firstLever3d){firstLever3d=false;original3d.tutorial();const launch=$('launch').onclick;$('launch').onclick=()=>{close();pendingRideResult={kind:'tutorial',commit:launch};world3d.setRidePower(100);world3d.startRide(8);explore3d('첫 항해가 시작됩니다. 안전 손잡이를 잡고 앞을 바라보세요.');};}else openPuzzle();}finally{atControl3d=false;}
 }else if(action.type==='keeper'){
  if(firstLever3d)story([['키퍼','붉은 레버를 STOP에서 GO까지 천천히 밀어주세요.']],tutorial);else hub();
 }else if(action.type==='clue')investigate3d();
 else if(action.type==='exit'){atExit3d=true;try{finale();}finally{atExit3d=false;}}
 sync3d();
},i=>{if(free3d&&s.phase==='main'){world3d.configure({paused:true});travel(i);sync3d();}});
$('walking-map').onclick=()=>{if(s.phase!=='ending'&&$('stage').classList.contains('walking'))map();else world3d.notify('이야기나 대화를 마친 뒤 지도에서 현재 위치를 확인하세요.');};
$('scenic-view').onclick=()=>{if(world3d.state.interior){world3d.notify('공원으로 돌아가면 전체 풍경을 볼 수 있습니다.');return;}if(!window.carnivalScene)return;const v=!window.carnivalScene.overview;window.carnivalScene.setOverview(v);$('scenic-view').textContent=v?'걷기로 돌아가기':'전체 풍경';$('scenic-view').setAttribute('aria-pressed',String(v));sync3d();};
$('ride-return').onclick=returnToPark;$('ride-stand').onclick=()=>{if(world3d.stand())explore3d();};$('ride-operate').onclick=()=>{const d=world3d.state.interior;if(d&&!d.running){const n=world3d.state.nearest;if(n?.type==='interior-control')$('world-interact').click();else world3d.notify('장치 또는 좌석에 더 가까이 가세요.');}};
const originalCaptainMotion=updateCaptainMotion;updateCaptainMotion=function(value){originalCaptainMotion(value);world3d.setRidePower(value);};
setInterval(updateRideUI,150);
$('sound').onclick=()=>{const muted=world3d.mute();if(rideAudio)muted?rideAudio.suspend():rideAudio.resume();$('sound').textContent=muted?'소리 꺼짐 ♩':'소리 켜짐 ♫';$('sound').setAttribute('aria-pressed',String(muted));};
$('walking-help').onclick=()=>{
 const previous=[...$('overlay').childNodes];
 modal('<h1>네버랜드에서 걷기</h1><p>WASD: 이동 · Shift: 빠르게 걷기<br>마우스 클릭 후 둘러보기 · Esc: 마우스 해제<br>드래그 또는 ← →: 시점 회전<br>E: 가까운 키퍼·조작대·흔적·출구 상호작용</p><p>지도는 현재 위치와 바라보는 방향을 보여줍니다. 구역은 직접 걸어서 이동하세요. 키퍼의 대화와 조작대의 퍼즐, 각 구역의 금빛 흔적을 살피면 길이 열립니다.</p><p>이름·성별·성향, 모든 대화와 선택, 랜덤 이벤트, 다섯 퍼즐과 다섯 엔딩은 원래 2D 이야기와 같습니다. 자동 저장 없이 진행되며 엔딩 기록만 보관합니다.</p><button id="help-close">돌아가기</button>');
 $('help-close').onclick=()=>{$('overlay').replaceChildren(...previous);sync3d();};
};
document.addEventListener('keydown',e=>{
 if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;
 if(e.key.toLowerCase()==='q'&&world3d.state.interior&&$('stage').classList.contains('walking')){if(world3d.stand())explore3d();return;}
 if(e.key==='Escape'&&$('stage').classList.contains('walking')&&!$('overlay').children.length)return;
 if(e.key==='Enter'&&!e.repeat&&!$('stage').classList.contains('walking')&&!$('overlay').children.length){const only=$('choices').querySelectorAll('button');if(only.length===1){e.preventDefault();only[0].click();}}
});
new MutationObserver(sync3d).observe($('overlay'),{childList:true});
// Read-only snapshot for QA; narrative state stays in the original engine.
window.neverland={get state(){return{phase:s.phase,ride:s.ride,gender:s.gender,temper:s.temper,keeperIntroduced:s.keeperIntroduced,visited:[...s.visited],cleared:[...s.cleared],clues:[...s.clues],ending:s.ending,exit:s.exit,free:free3d,world:world3d.state};}};
newGame();
