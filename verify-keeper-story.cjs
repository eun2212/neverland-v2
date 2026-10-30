// Run the original mechanics suite first, then exercise the published extension
// in the same instrumented VM. Tests drive actual choices and callbacks.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
let suite=fs.readFileSync(path.join(__dirname,'verify-full-story.cjs'),'utf8');
suite+=`\nvm.runInContext(fs.readFileSync(path.join(root,'keeper-story.js'),'utf8'),sandbox,{filename:'keeper-story.js'});
run(\`newGame();s.keeperIntroduced=true;keeperOrientation3d();drain();
test($('choices').children.length===5,'orientation offers paced explanations, map and readiness');
for(const index of [0,1,2,0,1,2]){$('choices').children[index].onclick();drain();}
test(s.talks===0&&forcedRide3d===null,'tutorial questions never force a ride');
$('choices').children[3].onclick();test($('overlay').children.length>0,'orientation current-position map opens');$('backMap').onclick();
$('choices').children[4].onclick();drain();test(firstLever3d&&world3d.state.config.paused===false,'orientation resumes physical walking');
world3d.enterRide(0);world3d.forceBoard(0);keeperFirstBoarding3d();drain();
test(!world3d.state.interior.running,'boarding explanation never launches automatically');
$('choices').children[1].onclick();drain();test(!world3d.state.interior.running,'waiting for reassurance keeps ride still');
$('choices').children[3].onclick();test(s.phase==='tutorial'&&keeperStoryState.ready,'readiness opens lever');
$('lever').oninput({target:{value:'100'}});$('launch').onclick();test(!world3d.state.interior.running,'launch threat has deliberate dialogue pause');drain();
test(world3d.state.interior.running&&pendingRideResult.kind==='tutorial','launch proceeds to real first ride');
\`);
for(const choice of [0,1,2]){
 run(\`newGame();finishFracture3d();test(queue.some(q=>q[1].includes('꿈을 꾼')),'return explicitly denies reality as a dream');drain();
 $('choices').children[\`+choice+\`].onclick();drain();
 test(!!keeperStoryState.dream&&free3d&&s.survivedRides===0,'dream choice recorded and park unlocked without survival credit');
 test($('overlay').children.length>0,'all dream branches reach the park map');\`);
}
for(const temper of ['confident','moderate','timid'])for(const topicName of ['ride','exit','keeper'])for(const index of [0,1]){
 run(\`startMain();s.temper='\`+temper+\`';topic('\`+topicName+\`');test($('choices').children.length===2,'profile replies retained');$('choices').children[\`+index+\`].onclick();drain();
 var narrativeScore=[s.K,s.N,s.I].join();scoreReply('\`+topicName+\`',\`+index+\`);test([s.K,s.N,s.I].join()===narrativeScore,'new replies preserve one-time scoring');\`);
}
run(\`startMain();topic('ride');$('choices').children[0].onclick();drain();topic('exit');$('choices').children[0].onclick();drain();
 test(forcedRide3d===0&&world3d.state.interior.seated,'second completed answer still forces boarding');
 test(!world3d.leaveRide()&&!world3d.stand(),'compulsory ride cannot be evaded');\`);
for(let ride=0;ride<5;ride++)for(let choice=0;choice<3;choice++){
 run(\`startMain();s.ride=\`+ride+\`;s.visited.add(s.ride);success(false);drain();
 test($('choices').children.length===3,'each ride has three connected danger responses');
 $('choices').children[\`+choice+\`].onclick();drain();
 test(s.cleared.has(s.ride)&&s.survivedRides===1,'all danger choices complete a survived ride once');
 test($('choices').children.length===3,'survival exposes emotional followup');
 $('choices').children[\`+choice+\`].onclick();drain();test(s.phase==='main'&&s.talks===0,'followup reconnects to hub');\`);
}
for(const choice of [0,1])for(let ride=0;ride<5;ride++){
 run(\`startMain();s.ride=\`+ride+\`;investigate3d();drain();$('choices').children[\`+choice+\`].onclick();drain();
 test(s.clues.has(s.ride)&&keeperStoryState.evidence.has(s.ride),'both evidence responses retain the record');
 var narrativeScore=s.N;investigate3d();drain();$('choices').children[0].onclick();drain();test(s.N===narrativeScore,'rechecking evidence cannot farm points');\`);
}
for(const dream of ['doubt','comfort','accuse'])for(const choice of [0,1,2]){
 run(\`startMain();keeperStoryState.dream='\`+dream+\`';s.exit=true;atExit3d=true;finale();atExit3d=false;
 test(queue.some(q=>q[1].includes('제가 정지 장치를 놓았어요')),'keeper admits intentional sabotage');drain();
 $('choices').children[\`+choice+\`].onclick();drain();test($('choices').children.length===3,'all confrontation responses reach resolution methods');\`);
}
run(\`startMain();s.ride=0;world3d.forceBoard(0);success(false);drain();$('choices').children[1].onclick();drain();
 test(world3d.state.interior.running&&s.survivedRides===0,'new danger scene starts real ride without awarding early credit');\`);
for(let i=0;i<1200;i++)frame(3000000+i*1000/60);
run(\`test(s.survivedRides===1&&s.cleared.has(0),'real physical completion commits extended safe-result once');drain();
 $('choices').children[2].onclick();drain();test(keeperStoryState.boundaries===1,'physical result connects to remembered boundary choice');\`);
for(const method of ['challenge','memory','trust']){
 run(\`startMain();s.K=10;s.M=4;s.N=12;s.I=5;s.wins=3;s.cleared=new Set([1,2,3]);resolve('\`+method+\`');drain();test($('choices').children.length===4,'all winning approaches reach four endings');\`);
}
run(\`startMain();s.phase='final';resolve('challenge');drain();test(s.ending===4,'failed confrontation still reaches bad ending');
 newGame();test(keeperStoryState.dream===''&&keeperStoryState.incidents.size===0&&keeperStoryState.evidence.size===0,'restart clears added narrative memory');\`);
console.log('PASS: '+assertions+' total assertions including tutorial, dream denial, all 15 ride branches, 18 replies, evidence, compulsory boarding and confrontation.');
`;
vm.runInThisContext('(function(require,__dirname){'+suite+'\n})',{filename:__filename})(require,__dirname);

