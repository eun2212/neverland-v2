const fs=require('fs'),vm=require('vm'),path=require('path');
let suite=fs.readFileSync(path.join(__dirname,'verify-full-story.cjs'),'utf8');
suite+=`\nElement.prototype.focus=function(){document.activeElement=this;};document.documentElement=new Element();
for(const file of ['keeper-story.js','ending-dialogue.js','ending-world.js','dialogue-controls.js','game-tools.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file});
run(\`const tools=window.NEVERLAND_TOOLS;const baseline=[...endings];
s.name='테스터';s.gender='male';s.temper='timid';tools.jump('start');
test(tools.testing&&s.name==='테스터'&&s.gender==='male'&&s.temper==='timid','jump retains profile');
test(!free3d&&keeperStoryState.orientation,'start opens tutorial');
tools.jump('first');test($('text').textContent.includes('눈을 떴네요')&&!world3d.state.passage,'first accident resumes dream scene');
for(let i=0;i<5;i++){tools.jump('ride',i);test(world3d.state.interior.ride===i,'jump enters ride '+i);test(forcedRide3d===null&&pendingRideResult===null,'jump clears forced boarding and pending result');if(i===0)test(firstLever3d&&world3d.state.interior.seated,'first ship retains tutorial');}
tools.jump('ride',1);world3d.forceBoard(1);world3d.startRide();tools.jump('park',1);test(!world3d.state.interior&&!world3d.state.passage&&free3d,'can leave running test ride');
tools.jump('exit');test(s.exit&&s.cleared.size===4&&world3d.state.config.exit,'exit checkpoint creates physical exit');
tools.jump('branch');test(keeperStoryState.confessed&&confronting3d&&$('choices').children.length===3,'branch has real resolution callbacks');
test(victory('challenge')&&victory('memory')&&victory('trust'),'branch preset supports all methods');
test(chooseEnding(true,'release')===1&&chooseEnding(true,'alone')===2&&chooseEnding(true,'stay')===3&&chooseEnding(true,'together')===5,'branch preset reaches all positive endings');
for(let i=1;i<=5;i++){tools.jump('ending',i);test(window.NEVERLAND_ENDING.state.id===i&&world3d.state.config.epilogue===i,'ending preview '+i);test(JSON.stringify(endings)===JSON.stringify(baseline),'preview never collects ending '+i);}
tools.jump('outside');test(window.NEVERLAND_ENDING.state.id===2,'outside checkpoint uses actual escape map');
tools.jump('park',3);test(!window.NEVERLAND_ENDING.state&&!world3d.state.config.epilogue&&!world3d.state.interior,'jump resets epilogue');
tools.options();test(tools.open&&world3d.state.config.paused,'settings pause world');tools.hide();test(!tools.open&&!world3d.state.config.paused,'close restores movement');
tools.album();test(tools.open,'album opens');tools.hide();tools.jumps();test(tools.open,'checkpoint menu opens');tools.hide();
tools.jump('title');test(!tools.testing&&s.phase==='profile'&&!world3d.state.config.epilogue,'normal restart clears testing');
showKeeperPose('01');test(!localStorage.getItem('neverland-album-v1'),'title pose does not unlock album');s.phase='main';showKeeperPose('01');test(JSON.parse(localStorage.getItem('neverland-album-v1')).length===1,'normal play collects pose');
tools.jump('branch');showKeeperPose('06');test(JSON.parse(localStorage.getItem('neverland-album-v1')).length===1,'test pose does not collect');
\`);console.log('PASS: '+assertions+' assertions including authoring checkpoints, cleanup, real ending branches, profile, menus and collection isolation.');`;
vm.runInThisContext('(function(require,__dirname){'+suite+'\n})',{filename:__filename})(require,__dirname);
