const fs=require('node:fs'),path=require('node:path');
let html='<base href="/">'+fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
html+=`<div id="keeper-qa" style="position:fixed;top:70px;left:10px;z-index:20;max-width:420px;background:#101d2de8;padding:8px;border:1px solid #d6b46d;font:11px sans-serif"></div><script>
const previewPoses=['00','01','03','04','15','05','06','07','10','08'];
function previewKeeperPose(id){newGame();close();s.keeperIntroduced=true;s.phase='main';scene('warm');document.getElementById('stage').classList.remove('walking');say('키퍼','새로운 네버랜드에 오신 것을 환영해요. 이곳에서 잠시 함께 있어 주시겠어요?',[['계속 이야기하기',()=>previewKeeperPose('03')]]);showKeeperPose(id);sync3d();}
for(const id of previewPoses){const b=document.createElement('button');b.textContent=keeperArt[id].name;b.style.cssText='font-size:11px;padding:4px;margin:2px';b.onclick=()=>previewKeeperPose(id);document.getElementById('keeper-qa').append(b);}previewKeeperPose('00');
</script>`;
fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'qa/keeper-standing.html'),html);
console.log('QA fixture: /qa/keeper-standing.html');
