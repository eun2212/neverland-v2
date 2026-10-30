const fs=require('node:fs'),path=require('node:path');
let html='<base href="/">'+fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const qaWorld=fs.readFileSync(path.join(__dirname,'world.js'),'utf8').replace(/\}\)\(\);\s*$/,'window.graveyardQA={passageStep,player};})();');
html=html.replace('<script src="world.js"></script>',()=>'<script>'+qaWorld+'</script>');
html+=`<div style="position:fixed;top:100px;right:10px;z-index:25;background:#101018dd;padding:6px;border:1px solid #bbb" id="fracture-qa"><button id="qa-passage">사고 후 회랑</button><button id="qa-middle">회랑 중간</button><button id="qa-heap">무덤 전체</button><button id="qa-return">복귀</button><button id="qa-glitch">탑승 후 오류</button><button id="qa-exit">출구 붕괴</button><button id="qa-hide">검증 패널 닫기</button></div><script>
document.getElementById('qa-passage').onclick=()=>{newGame();s.keeperIntroduced=true;beginFracture3d();};
function previewProgress(p){if(!world3d.state.passage)document.getElementById('qa-passage').click();while(world3d.state.passage.progress<p)graveyardQA.passageStep(.05,1);world3d.configure({paused:true});}
function finishPreviewPassage(){previewProgress(1);while(world3d.state.passage)graveyardQA.passageStep(.05,0);}
document.getElementById('qa-middle').onclick=()=>previewProgress(.55);
document.getElementById('qa-heap').onclick=()=>previewProgress(1);
document.getElementById('qa-return').onclick=()=>finishPreviewPassage();
document.getElementById('qa-glitch').onclick=()=>{finishPreviewPassage();queue=[];after=null;free3d=true;s.ride=0;explore3d();world3d.fracturePulse();};
document.getElementById('qa-exit').onclick=()=>{newGame();close();s.keeperIntroduced=true;free3d=true;s.exit=true;s.exitRide=1;s.ride=1;Object.assign(graveyardQA.player,{x:21,z:-26,yaw:0,pitch:0});explore3d();world3d.faceExit();};
function previewRed(count,dialog=false){newGame();close();s.keeperIntroduced=true;s.survivedRides=count;free3d=true;Object.assign(graveyardQA.player,{x:-3,z:-3,yaw:0,pitch:0});explore3d();if(dialog){s.exit=true;say('키퍼','조금만 더, 여기 있어 주시면 안 되나요?',[]);}sync3d();}
for(const count of[0,1,3,5]){const b=document.createElement('button');b.textContent='변질 '+count+'회';b.onclick=()=>previewRed(count);document.getElementById('fracture-qa').append(b);}
const redDialog=document.createElement('button');redDialog.textContent='붉은 대화';redDialog.onclick=()=>previewRed(5,true);document.getElementById('fracture-qa').append(redDialog);
const veinDialog=document.createElement('button');veinDialog.textContent='핏줄 대화';veinDialog.onclick=()=>{previewRed(3);say('키퍼','조금만 더 이야기할까요?',[]);};document.getElementById('fracture-qa').append(veinDialog);
const forceTalk=document.createElement('button');forceTalk.textContent='대화 제한 검증';forceTalk.onclick=()=>{previewRed(0);s.talks=1;hub();};document.getElementById('fracture-qa').append(forceTalk);
document.getElementById('qa-hide').onclick=()=>document.getElementById('fracture-qa').hidden=true;document.getElementById('qa-passage').click();
</script>`;
fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'qa/fracture.html'),html);
