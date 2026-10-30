const fs=require('node:fs'),path=require('node:path');
let html='<base href="/">'+fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
html+=`<div id="narrative-qa" style="position:fixed;top:76px;left:8px;z-index:100;background:#10251feb;padding:8px;display:flex;gap:5px;flex-wrap:wrap"><button id="qa-orientation">초반 안내</button><button id="qa-board">탑승 전 설명</button><button id="qa-dream">꿈이라고 부정</button><button id="qa-danger">기구의 위험</button><button id="qa-possessive">후반 대화</button><button id="qa-confess">정체 고백</button><button id="qa-hide-story">패널 숨김</button></div><script>
function prepareStoryQA(){newGame();close();s.keeperIntroduced=true;s.temper='moderate';free3d=true;s.phase='main';}
document.getElementById('qa-orientation').onclick=()=>{prepareStoryQA();free3d=false;keeperOrientation3d();};
document.getElementById('qa-board').onclick=()=>{prepareStoryQA();firstLever3d=true;world3d.forceBoard(0);keeperFirstBoarding3d();};
document.getElementById('qa-dream').onclick=()=>{prepareStoryQA();finishFracture3d();};
document.getElementById('qa-danger').onclick=()=>{prepareStoryQA();s.ride=1;world3d.forceBoard(1);success(false);};
document.getElementById('qa-possessive').onclick=()=>{prepareStoryQA();s.survivedRides=4;keeperStoryState.dream='doubt';hub();};
document.getElementById('qa-confess').onclick=()=>{prepareStoryQA();s.exit=true;s.survivedRides=5;s.K=10;s.N=12;s.M=4;s.I=6;s.wins=3;s.cleared=new Set([1,2,3]);keeperStoryState.dream='accuse';atExit3d=true;finale();atExit3d=false;};
document.getElementById('qa-hide-story').onclick=()=>document.getElementById('narrative-qa').remove();
</script>`;
fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'qa/keeper-story.html'),html);
