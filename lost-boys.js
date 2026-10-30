'use strict';
// Optional cast stories live separately from compulsory boarding and ride puzzles.
(function(){
const cast=[
 {id:'wheel',ride:1,name:'휠',image:'assets/cast-wheel.png',inside:[4,3],title:'내리지 않은 한 사람',ask:'마지막 곤돌라의 승객 수가 맞지 않습니다. 안쪽의 승차 기록을 함께 확인해 주시겠어요?',greeting:'표는 버리지 마세요. 내려오셨다는 표시가 있어야 하니까요.',past:'회중시계 뚜껑 안에 오래된 입장권이 끼워져 있다. 그날의 마지막 운행 시각에서 초침이 멈췄다.',ending:'승차 기록의 마지막 칸에 휠이라는 이름이 남아 있다. 하차 확인은 비어 있다. 휠은 그것을 오래 바라보다 시계를 덮는다. “한 사람을 더 세고 있었군요.”',hint:'오래된 사고 명부와 오늘의 직원 명부에 같은 이름이 있다. 이 공원의 캐스트는 사고 이후에도 퇴근하지 못한다.',steps:[
  {p:[4,0],name:'승차 기록',text:'승차 인원은 열둘, 하차 인원은 열하나. 지워진 한 칸이 있다.',choices:['빈칸까지 포함해 센다','적힌 열한 명만 센다'],correct:0,result:'종이 뒷면에서 마지막 승객 번호 12가 비친다.'},
  {p:[4,-4],name:'곤돌라 점검표',text:'12번 곤돌라 고정부의 균열이 붉게 표시되어 있다. 그 아래 운행 승인 도장이 겹쳤다.',choices:['승인 도장만 확인한다','균열 표시와 승인 날짜를 겹쳐 본다'],correct:1,result:'균열 보고 뒤에도 마지막 운행이 승인됐다. 단순히 오래된 기구였던 것만은 아니다.'},
  {p:[0,1],name:'하차 확인대',text:'12번 입장권에는 하차 도장 대신 별 모양의 직원 인장이 찍혀 있다.',choices:['직원 인장의 이름을 읽는다','기록을 찢는다'],correct:0,result:'승객 이름 위에 안내 담당 휠이 덧써졌다. 승객의 기록이 직원의 기록으로 바뀌었다.'}]},
 {id:'carousel',ride:2,name:'로라',image:'assets/cast-carousel.png',inside:[-5,4],title:'두 장의 목마표',ask:'동생의 목마표가 악보 사이에서 사라졌어요. 안에서 같은 문양을 찾아줄래요?',greeting:'둘이 왔다면 둘이 돌아가야죠. 손, 놓치지 말아요.',past:'로라는 작은 목마 쪽에 손을 뻗었다가 거둔다. “동생은 늘 저 말을 골랐어요.”',ending:'두 장의 표에는 같은 성이 적혀 있다. 작은 표에는 구조 확인, 큰 표에는 사망 확인. 로라가 큰 표를 자기 주머니에 넣는다. “내가 밀어 줬으니까, 그 애는 밖으로 갔겠죠?”',hint:'천장 붕괴 사고 뒤 공연 중단 공지는 지워지고 다음 회차 안내가 덧붙었다. 공원은 죽음을 공연의 공백처럼 처리했다.',steps:[
  {p:[-4,-2],name:'찢어진 악보',text:'행진곡 끝에 어린 손으로 그린 작은 목마가 있다. 두 장의 표에 찍힌 문양이다.',choices:['큰 목마 문양을 고른다','작은 목마 문양을 고른다'],correct:1,result:'접힌 악보 안에서 작은 승차권이 나온다. 뒷면에는 누나랑 함께라고 적혔다.'},
  {p:[3,-4],name:'천장 장식의 흔적',text:'바닥의 긁힌 자국이 두 목마 사이에서 어린이 출입문 쪽으로 이어진다.',choices:['긁힌 자국의 방향을 따라 확인한다','반짝이는 장식을 다시 매단다'],correct:0,result:'추락한 장식 아래에는 큰 표, 출입문 쪽에는 작은 표의 반쪽이 남았다. 누군가 아이를 바깥으로 밀어냈다.'},
  {p:[-2,4],name:'구조 대장',text:'두 사람의 기록이 다른 칸에 있다. 접힌 부분을 펼칠 수 있다.',choices:['작은 표만 남긴다','두 표를 나란히 맞춘다'],correct:1,result:'동생은 생존, 누나는 현장에서 사망. 구조 메모에는 누나가 대신 잔해를 맞았다고 적혀 있다.'}]},
 {id:'mirror',ride:3,name:'바니쉬',image:'assets/cast-mirror.png',inside:[-3,7],title:'빛나지 않는 출구',ask:'거울 안의 비상등이 아직 켜져 있어요. 진짜 문까지 이어지는 흔적을 안에서 찾아보시겠어요?',greeting:'출구를 보셨다고요? 손잡이에 손이 닿았나요?',past:'바니쉬는 연기 냄새가 나지 않는데도 장갑으로 입을 가린다. 손거울 가장자리가 열에 그을렸다.',ending:'현장 사진 속 비상구는 거울에 비친 불빛이었다. 사진 아래 희생자 이름과 바니쉬의 서명이 일치한다. “이번에는 당신이 같은 곳을 돌게 두지 않겠어요.”',hint:'화재 대피도에서 실제 비상문은 잠겨 있었고 반사된 표지판만 밝았다. 누군가 안전 안내보다 손님을 안에 머물게 하는 일을 우선했다.',steps:[
  {p:[5,7],name:'반사된 비상등',text:'초록 불빛 두 개 중 하나는 거울 표면에서만 보인다.',choices:['빛의 반사 방향을 확인한다','더 밝은 불빛을 믿는다'],correct:0,result:'가장 밝은 화살표는 벽을 향한다. 그을음은 반대 방향으로 이어진다.'},
  {p:[7,3],name:'그을린 문손잡이',text:'실제 문에는 손자국과 바깥쪽 잠금 흔적이 남았다.',choices:['손자국을 닦는다','잠금 흔적과 대피도를 대조한다'],correct:1,result:'대피도에는 비상문, 운영 메모에는 공연 종료까지 잠금이라고 쓰였다.'},
  {p:[-7,-1],name:'마지막 현장 사진',text:'사진 속 인물은 거울을 보고 있다. 뒤쪽 문손잡이는 빛에 가려졌다.',choices:['사진을 뒤집어 이름을 확인한다','거울 속 빛만 확대한다'],correct:0,result:'사고 사진의 인물과 지금 안내인의 얼굴이 같다. 뒤에는 바니쉬, 미귀환이라고 적혔다.'}]},
 {id:'tea',ride:4,name:'낸시',image:'assets/cast-tea.png',inside:[-2,2],title:'작은 손님의 자리',ask:'우리 아이를 못 보셨나요? 안에 작은 찻잔과 노란 리본이 있을 거예요. 같이 찾아주실래요?',greeting:'작은 아이 한 명을 찾고 있어요. 제 손을 잡고 있었는데… 다음 잔에는 없더군요.',past:'낸시는 아이 몫의 찻잔을 식탁 가장자리에서 멀리 밀어 둔다. 자신의 차에는 손을 대지 않는다.',ending:'구조 기록에는 아이가 먼저 구출되어 보호자에게 인계되었다고 적혀 있다. 보호자 낸시는 현장에서 사망했다. 낸시는 리본을 꼭 쥔다. “그럼 이 안에서 찾을 게 아니었군요. 밖에… 잘 도착했겠죠?”',hint:'아이의 퇴장 기록은 있는데 낸시의 직원 등록은 사망 직후 시작됐다. 키퍼가 말한 잃어버린 손님은 이미 공원을 떠난 아이였다.',steps:[
  {p:[-3,0],name:'노란 리본',text:'작은 좌석 아래 노란 리본이 걸렸다. 매듭 안쪽에 이름표가 접혔다.',choices:['리본을 회전판에 건다','이름표를 조심히 펼친다'],correct:1,result:'아이의 이름 옆 보호자 칸에 낸시가 적혀 있다. 둘은 같은 날 이 찻잔에 탔다.'},
  {p:[0,-3],name:'긴급 정지 기록',text:'정지 요청은 접수됐지만 회전 속도는 계속 올라갔다.',choices:['정지 요청 시각을 구조 기록과 맞춘다','기록을 다시 작동시킨다'],correct:0,result:'제동 고장과 기구 분리 사고. 구조 순서 첫 줄에는 어린이 생존이라고 적혔다.'},
  {p:[3,1],name:'퇴장 확인표',text:'아이의 표에 공원 밖 보호자 인계 도장이 있다. 낸시의 칸은 검은 띠로 묶였다.',choices:['아이의 표를 숨긴다','인계 도장과 직원 등록일을 비교한다'],correct:1,result:'아이의 퇴장은 사고 당일, 낸시의 직원 등록도 같은 날이다. 사고 명부의 검은 띠는 사망자를 뜻한다.'}]}
];
function memory(){return s.castStories||(s.castStories={});}
function progress(c){return memory()[c.id]||(memory()[c.id]={accepted:false,step:0,done:false});}
function enabled(config,inside){return config.free&&config.forcedRide<0&&!config.confronting&&!inside?.running&&!inside?.seated;}
function position(c,inside){const r=window.NEVERLAND_LAYOUT.rides[c.ride];return inside?c.inside:[r.control[0]+(r.control[0]>0?3:-3),r.control[1]+2];}
function nearest(p,inside,config){if(!enabled(config,inside))return null;
 for(const c of cast){if(inside&&inside.ride!==c.ride)continue;const q=position(c,inside);if(Math.hypot(p.x-q[0],p.z-q[1])<1.55)return{type:'cast',cast:c.id,ride:c.ride,label:'E · '+c.name+'와 이야기하기'};
 const m=progress(c);if(inside&&m.accepted&&!m.done&&m.step<3){const item=c.steps[m.step];if(Math.hypot(p.x-item.p[0],p.z-item.p[1])<1.35)return{type:'cast-clue',cast:c.id,ride:c.ride,label:'E · '+item.name+' 조사하기'};}}
 return null;}
function leave(){document.body.classList.remove('cast-dialog');explore3d();}
function panel(c,text,options){close();say(c.name,text,options);document.body.classList.add('cast-dialog');const img=$('cast-portrait');img.src=c.image;img.alt=c.name+' · '+c.title;}
function meet(c){const m=progress(c);if(m.done){panel(c,c.ending+'\n\n기록: '+c.hint,[['기록 보기',journal],['돌아가기',leave]]);return;}
 if(m.accepted&&m.step===3){m.done=true;s.N+=1;s.I+=1;checkExit();panel(c,c.ending+'\n\n기록: '+c.hint,[['발견한 기록을 정리한다',journal],['조용히 자리를 떠난다',leave]]);return;}
 if(m.accepted){const item=c.steps[m.step];panel(c,'고마워요. '+item.name+'을 확인해 주세요. 기구 안에서 찾을 수 있어요. ('+m.step+'/3)',[['과거를 묻는다',()=>panel(c,c.past,[['계속 찾아본다',leave]])],['나중에 이어서 한다',leave]]);return;}
 panel(c,c.greeting+'\n\n'+c.ask,[['도와준다 · 선택 퀘스트 수락',()=>{m.accepted=true;panel(c,'고마워요. 기구 안에서 '+c.steps[0].name+'부터 살펴봐 주세요. 금빛 마름모가 가까운 흔적을 알려줄 거예요.',[['직접 찾아본다',leave]]);}],['당신에 대해 묻는다',()=>panel(c,c.past,[['다시 이야기한다',()=>meet(c)],['돌아가기',leave]])],['지금은 지나간다',leave]]);}
function investigate(c){const m=progress(c),inside=world3d.state.interior;if(!m.accepted||m.done||m.step>=3||inside?.ride!==c.ride)return;const item=c.steps[m.step];panel(c,item.text,item.choices.map((label,i)=>[label,()=>{if(i!==item.correct){panel(c,'이 방법으로는 기록이 이어지지 않는다. 주변의 표시를 다시 살펴볼 수 있다.',[['다시 살펴본다',()=>investigate(c)],['잠시 그만둔다',leave]]);return;}m.step++;panel(c,item.result,[['계속 걷는다',()=>{leave();world3d.notify(m.step===3?c.name+'에게 돌아가 발견한 기록을 전하세요.':c.steps[m.step].name+'을 찾아보세요.');}]]);}]).concat([['조사하지 않고 돌아간다',leave]]));}
function journal(){document.body.classList.remove('cast-dialog');const entries=cast.map(c=>{const m=progress(c);return '<section><h2>'+c.name+' · '+c.title+'</h2><p>'+(m.done?c.hint:m.accepted?(m.step===3?'세 흔적을 찾았다. '+c.name+'에게 돌아가자.':m.step+'/3 · 다음: '+c.steps[m.step].name):'아직 부탁을 받지 않았다.')+'</p>'+(m.step?'<p>'+c.steps.slice(0,m.step).map(x=>x.result).join('<br>')+'</p>':'')+'</section>';}).join('');modal('<h1>캐스트의 기록</h1><p>선택해서 돕는 이야기입니다. 기구의 금빛 마름모를 찾아 직접 걸어가세요. 진행은 이번 플레이 동안 유지됩니다.</p>'+entries+'<button id="cast-journal-close">돌아가기</button>');$('cast-journal-close').onclick=leave;}
let models=null;
function render(T,scene,state,t){if(!models){models=cast.map(c=>{const texture=new T.TextureLoader().load(c.image);texture.encoding=T.sRGBEncoding;const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));sprite.scale.set(1.65,2.48,1);scene.add(sprite);const marker=new T.Mesh(new T.OctahedronGeometry(.18),new T.MeshBasicMaterial({color:0xffd680}));scene.add(marker);return{c,sprite,marker};});}
 for(const {c,sprite,marker}of models){const inside=state.interior;const visible=state.config.free&&!state.passage&&s.phase!=='ending'&&(!inside||inside.ride===c.ride);sprite.visible=visible;const p=position(c,inside);sprite.position.set(p[0],1.24+(inside?0:window.NEVERLAND_LAYOUT.terrain(...p)),p[1]);const m=progress(c);marker.visible=visible&&!!inside&&m.accepted&&!m.done&&m.step<3&&!inside.running;if(marker.visible){const q=c.steps[m.step].p;marker.position.set(q[0],1.2+Math.sin(t*2)*.1,q[1]);marker.rotation.y=t;}}
}
const portrait=document.createElement('img');portrait.id='cast-portrait';$('stage').append(portrait);
const journalButton=btn('캐스트 기록',()=>{if($('stage').classList.contains('walking')&&!world3d.state.passage&&!world3d.state.interior?.running)journal();else world3d.notify('걷거나 기구를 둘러볼 때 기록을 열 수 있어요.');});journalButton.id='cast-journal';document.querySelector('header').append(journalButton);
const reset=newGame;newGame=function(){document.body.classList.remove('cast-dialog');reset();s.castStories={};};
window.NEVERLAND_CAST={cast,nearest,render,interact(action){const c=cast.find(c=>c.id===action.cast);if(!c)return;if(!enabled(world3d.state.config,world3d.state.interior))return;action.type==='cast-clue'?investigate(c):meet(c);},journal};
})();
