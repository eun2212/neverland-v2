const fs=require('node:fs'),path=require('node:path');
let html='<base href="/">'+fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
html+=`<div style="position:fixed;top:70px;right:10px;z-index:15;background:#143b2c;padding:8px;font:11px sans-serif;border:1px solid gold">내부 체험 검증용<br><span id="test-rides"></span></div><script>
function previewRide(i){newGame();free3d=true;s.keeperIntroduced=true;s.ride=i;explore3d();world3d.enterRide(i);explore3d();}
rides.forEach((r,i)=>{const b=document.createElement('button');b.textContent=r.name;b.style.cssText='font-size:10px;padding:5px';b.onclick=()=>previewRide(i);document.getElementById('test-rides').append(b);});previewRide(0);
</script>`;
fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'qa/ride-interiors.html'),html);console.log('QA fixture: /qa/ride-interiors.html');
