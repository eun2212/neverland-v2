// Dedicated visual QA fixture. Does not add debug controls to the playable game.
const fs=require('node:fs'),path=require('node:path');
let html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
let world=fs.readFileSync(path.join(__dirname,'world.js'),'utf8');
world=world.replace('zone=0;currentMap=\'deck\'','zone=1;currentMap=\'deck\'').replace('Object.assign(player,layout.spawn);','Object.assign(player,{x:21,z:-29,yaw:0});');
html='<base href="/">'+html.replace('<script src="world.js"></script>',()=>'<script>'+world+'</script>');
html+=`<script>
function previewExit(){newGame();free3d=true;s.keeperIntroduced=true;s.ride=1;s.exitRide=1;explore3d('연출 확인 화면 · 출구가 나타나는 모습을 확인하세요.');s.exit=true;sync3d();}
const replay=document.createElement('button');replay.textContent='출구 연출 다시 보기';replay.style.cssText='position:fixed;bottom:12px;right:12px;z-index:20;font-size:11px';replay.onclick=previewExit;document.body.append(replay);previewExit();
</script>`;
fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'qa/exit-reveal.html'),html);
console.log('Created dedicated visual QA scene: /qa/exit-reveal.html');
