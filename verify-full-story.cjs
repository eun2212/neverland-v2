const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=__dirname,html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let assertions=0;
class Element{
 constructor(id=''){this.id=id;this.children=[];this.style={setProperty(k,v){this[k]=v}};this.dataset={};this.hidden=false;this.value='';this.textContent='';this.classes=new Set();this.classList={add:(...v)=>v.forEach(x=>this.classes.add(x)),remove:(...v)=>v.forEach(x=>this.classes.delete(x)),contains:v=>this.classes.has(v),toggle:(v,on)=>{on=on===undefined?!this.classes.has(v):on;on?this.classes.add(v):this.classes.delete(v);return on;}};}
 get childNodes(){return this.children;}setAttribute(k,v){this[k]=v;}addEventListener(){}setPointerCapture(){}getBoundingClientRect(){return{height:200};}append(...v){this.children.push(...v);}replaceChildren(...v){this.children=v;}click(){this.onclick?.();}
 set className(v){this.classes=new Set(v.split(' '));}get className(){return[...this.classes].join(' ');}
 set innerHTML(v){this.html=v;this.children=[];for(const m of v.matchAll(/<([a-z]+)[^>]*\bid="([^"]+)"[^>]*>/g)){const e=new Element(m[2]);const value=m[0].match(/\bvalue="([^"]*)"/);if(value)e.value=value[1];elements.set(m[2],e);}if(v)this.children.push(new Element());}
 get innerHTML(){return this.html||'';}querySelectorAll(q){return this.children.filter(e=>q==='button');}
}
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
for(const m of html.matchAll(/<script type="application\/json" id="([^"]+)">([\s\S]*?)<\/script>/g))el(m[1]).textContent=m[2];
for(const id of ['world-dialog','world-instructions','world-interact'])el(id).hidden=true;
let frame=null,draws=0;const handlers={},stored=new Map();
const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getError:()=>0,drawArrays:()=>draws++},{get:(t,k)=>k in t?t[k]:k===k.toUpperCase()?1:()=>({})});el('world-world').getContext=()=>gl;
const document={body:new Element('body'),getElementById:el,createElement:()=>new Element(),createElementNS:()=>new Element(),querySelectorAll(q){if(q==='[data-key]')return[];if(q==='.map-help')return[el('map-help')];if(q==='.keeper,.puzzle-portrait')return[el('keeper')];return[];},querySelector:()=>el('dialogue'),addEventListener(){},exitPointerLock(){}};
const sandbox={console,document,Float32Array,Uint8Array,Set,Map,Math:Object.create(Math),JSON,localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},Image:class{set src(v){this.width=1024;this.height=1536;this.onload?.();}},innerWidth:1200,innerHeight:800,devicePixelRatio:1,matchMedia:()=>({matches:false}),HTMLInputElement:class{},HTMLSelectElement:class{},MutationObserver:class{observe(){}},requestAnimationFrame:f=>frame=f,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},addEventListener:(k,f)=>handlers[k]=f};sandbox.window=sandbox;
vm.createContext(sandbox);for(const file of ['carnival-layout.js','ride-interiors.js','keeper-veins.js','world.js','story-core.js','story-3d.js']){
 let code=fs.readFileSync(path.join(root,file),'utf8');
 if(file==='world.js')code=code.replace(/\}\)\(\);\s*$/,'window.worldQA={valid,player,nearest,updateProgress};})();');
 vm.runInContext(code,sandbox,{filename:file});
}
const run=code=>vm.runInContext(code,sandbox);sandbox.test=(ok,label)=>{assert(ok,label);assertions++;};
const test=(ok,label)=>sandbox.test(ok,label);
function frames(n){for(let i=0;i<n;i++)frame((i+1)*1000/60);}
frames(2);test(draws>0,'renderer keeps scheduling frames');
const layout=sandbox.NEVERLAND_LAYOUT;
test(layout.entry[1]>layout.rides[0].z,'grand entry is in front of central ship');
test(layout.rides[0].x===0&&layout.rides[0].z===-24,'captain is central hub');
test(layout.rides[2].x<0&&layout.rides[2].z<-24,'carousel upper left');
test(layout.rides[1].x>0&&layout.rides[1].z<-24,'wheel upper right');
test(layout.rides[3].x<0&&layout.rides[3].z>-24,'mirror lower left');
test(layout.rides[4].x>0&&layout.rides[4].z>-24,'tea lower right');
test(layout.water(8,-16)&&!layout.water(0,-12),'lagoon blocks water but cardinal bridge is open');
test(layout.terrain(0,-12)>0,'bridge has curved raised walking surface');
run(`
test(s.phase==='profile'&&!s.keeperIntroduced,'profile and hidden keeper');
function drain(){let guard=0;while(queue.length||after){if(++guard>100)throw Error('story loop');next();}}
function startMain(){newGame();free3d=true;s.keeperIntroduced=true;explore3d();}
function operate(i){s.ride=i;atControl3d=true;openPuzzle();atControl3d=false;}
$('player').value='여행자';$('gender').value='male';$('temper').value='timid';$('start').onclick();
test(s.gender==='male'&&s.temper==='timid','profile preserved');drain();
test(intro3d&&world3d.state.config.intro,'walking intro gate');
test(world3d.state.config.paused===false,'walking unpauses renderer');
newGame();intro();drain();
test(!s.keeperIntroduced,'keeper unseen before first voice');
for(const i of [0,1,2,3,4]){
 startMain();operate(i);
 if(i===0)$('safeLever').value=puzzle.target;
 if(i===1)puzzle.rotations=puzzle.offsets.map(v=>(8-v)%8);
 if(i===2)puzzle.sequence=[...puzzle.melody];
 if(i===3)puzzle.turns=[1,1,2,3,0,0,0,0,0];
 if(i===4){puzzle.colors=new Set(['빨강','파랑']);puzzle.speed=55;}
 verify();test(s.cleared.has(i),'puzzle success '+i);test(s.wins===1&&s.I===2&&s.N===2,'first success scores '+i);drain();
 operate(i);success(false);test(s.wins===1&&s.I===2,'repeat success no duplicate score '+i);
}
startMain();operate(0);$('safeLever').value=puzzle.target+6;verify();test(puzzle.failed,'captain wrong lever offers help');success(true);test(s.help===1&&s.K===1&&s.cleared.has(0),'help recovery');
startMain();operate(1);test(!rideGameSolved(),'unaligned wheel fails');puzzle.rotations=puzzle.offsets.map(v=>(8-v)%8);test(rideGameSolved(),'aligned wheel passes');puzzle.rotations[0]=(puzzle.rotations[0]+1)%8;test(!rideGameSolved(),'one wrong wheel ring fails');
startMain();operate(2);puzzle.sequence=['XX'];test(!rideGameSolved(),'wrong melody fails');puzzle.sequence=[...puzzle.melody];test(rideGameSolved(),'correct melody succeeds');
startMain();operate(3);puzzle.turns=[1,1,2,3,0,0,0,0,0];test(traceMirrors().won,'connected mirror path');puzzle.turns[1]=0;test(!traceMirrors().won,'broken mirror path');
startMain();operate(4);puzzle.colors=new Set(['빨강','파랑']);for(const n of [44,45,65,66]){puzzle.speed=n;test(rideGameSolved()===(n>=45&&n<=65),'cup speed boundary '+n);}puzzle.speed=55;puzzle.colors.add('노랑');test(!rideGameSolved(),'extra paint fails');
for(const temper of ['confident','moderate','timid'])for(const topicName of ['ride','exit','keeper'])for(const index of [0,1]){
 startMain();s.temper=temper;topic(topicName);test($('choices').children.length===2,'two profile responses');$('choices').children[index].onclick();test($('speaker').textContent===s.name,'player speaks reply');drain();
 const before=[s.K,s.N,s.I].join();scoreReply(topicName,index);test([s.K,s.N,s.I].join()===before,'reply scored once '+temper+topicName+index);
}
startMain();s.ride=2;investigate3d();drain();const score=s.N;investigate3d();drain();test(s.N===score&&s.clues.has(2),'clue score only once');
startMain();s.cleared=new Set([1,2,3]);s.visited=new Set([0,1,2]);s.N=5;checkExit();test(s.exit,'exit discovery');finale();test($('stage').classList.contains('walking'),'finale requires walking to exit');test(target3d!==null,'exit direction marked');
startMain();openPuzzle();test(s.phase==='main'&&target3d,'ride menu requires walking to control');
startMain();s.K=10;s.M=4;s.N=12;s.I=5;s.wins=3;s.cleared=new Set([1,2,3]);
for(const method of ['challenge','memory','trust'])test(victory(method),'final victory '+method);
test(chooseEnding(true,'release')===1,'release ending');test(chooseEnding(true,'alone')===2,'alone ending');test(chooseEnding(true,'stay')===3,'romance ending');test(chooseEnding(true,'together')===5,'together ending');
s.M=0;test(chooseEnding(false,'fallback')===3,'loss romance rescue');s.K=0;test(chooseEnding(false,'fallback')===4,'loss bad ending');test(chooseEnding(true,'together')===2,'unqualified choice fallback');s.I=0;s.N=0;s.wins=0;s.escapeBonus=0;test(!victory('challenge'),'final failure');s.escapeBonus=12;test(victory('challenge'),'dice escape bonus');
for(const gender of ['male','female']){
 const art=JSON.parse($('ending-art').textContent);
 for(const id of [1,2,3,5]){newGame();s.gender=gender;end(id);test($('endingIllustration').src===art[(gender==='male'?'male-':'')+id],gender+' ending art '+id);}
 for(let i=0;i<5;i++){newGame();s.gender=gender;s.ride=i;s.phase='puzzle';end(4);const key=['captain','wheel','carousel','mirror','teacup'][i];test($('endingIllustration').src===art[gender==='male'&&i===3?'male-mirror':key],gender+' bad art '+i);}
 newGame();s.gender=gender;s.phase='final';end(4);test($('endingIllustration').src===art.final,gender+' final bad art');
}
test(endings.length===5,'five ending records');newGame();test(endings.length===5,'records survive restart');
startMain();paradeChoice('dance',()=>{});test(s.K===2&&s.N===2,'parade dance reward');
startMain();paradeChoice('clap',()=>{});test(s.K===1&&s.N===2,'parade clap reward');
startMain();paradeChoice('pass',()=>{});test(s.I===2,'parade pass reward');
`);
// Controlled randomness validates all event and accident branches without changing production code.
for(const [values,won] of [[[.99,0],true],[[0,.99],false],[[.5,.5],false]]){
 let index=0;sandbox.Math.random=()=>values[index++%values.length];sandbox.resetRandom=()=>index=0;
 run(`startMain();resetRandom();rollDice(()=>{});test(s.diceWins===${won?1:0},'dice win/tie/loss');test(s.escapeBonus===${won?2:0},'dice bonus only on win');$('diceContinue').onclick();test($('stage').classList.contains('event-cutscene')===${won},'dice CG only on win');`);
}
for(const [roll,kind] of [[.1,'parade'],[.3,'dice'],[.9,'none']]){
 sandbox.Math.random=()=>roll;
 run(`startMain();travel(1);test(s.eventChecks.has(1),'event check recorded');test(${kind==='none'?"s.ride===1":"s.actions.some(x=>x.kind==='"+kind+"')"},'travel event branch ${kind}');`);
}
for(const [roll,bad] of [[.74,true],[.75,false]]){
 sandbox.Math.random=()=>roll;run(`startMain();operate(1);offerHelp();$('puzzleActions').children[2].onclick();test(${bad?'s.ending===4':'s.cleared.has(1)'},'risk boundary ${roll}');`);
}
// Run real renderer controls in a VM, with only WebGL and DOM surfaces stubbed.
sandbox.Math.random=Math.random;
run('newGame();intro();drain();');
handlers.keydown({key:'w',repeat:false,preventDefault(){}});
for(let i=0;i<700;i++)frame((i+3)*1000/60);
test(run('s.keeperIntroduced'),'walking triggers original keeper greeting');
run('drain()');test(run('firstLever3d'),'tutorial waits for physical lever');
run(`world3d.configure({paused:false});`);
handlers.keydown({key:'w',repeat:false,preventDefault(){}});for(let i=0;i<120;i++)frame((i+703)*1000/60);handlers.keyup({key:'w'});
test(run('world3d.state.nearest?.type')==='control','physical control reachable');
handlers.keydown({key:'e',repeat:false,preventDefault(){}});test(run('world3d.state.interior?.ride')===0,'park gate teleports into captain deck');
run("worldQA.player.x=-2;worldQA.player.z=0;worldQA.updateProgress()");handlers.keydown({key:'e',repeat:false,preventDefault(){}});test(run('world3d.state.interior.seated'),'physically board captain seat');handlers.keydown({key:'e',repeat:false,preventDefault(){}});test(run('s.phase')==='tutorial','seated lever opens first ride');
run(`$('lever').oninput({target:{value:'100'}});$('launch').onclick();test(world3d.state.interior.running,'tutorial launches actual ride');`);
for(let i=0;i<510;i++)frame((i+830)*1000/60);
test(!!run('world3d.state.passage'),'first accident opens walkable graveyard instead of image sequence');
test(run('s.survivedRides||0')===0,'mandatory first death never changes keeper corruption');
test(!run('world3d.state.interior'),'graveyard leaves the ride interior');
test(run('s.phase')==='graveyard','graveyard has a separate narrative phase');
let passageFrame=1340;const passageFrames=n=>{for(let i=0;i<n;i++)frame(passageFrame++*1000/60);};
handlers.keydown({key:'s',repeat:false,preventDefault(){}});handlers.keydown({key:'a',repeat:false,preventDefault(){}});handlers.keydown({key:'arrowright',repeat:false,preventDefault(){}});passageFrames(120);
test(run('world3d.state.passage.progress')===0,'backward and sideways input cannot advance graveyard');
test(run('world3d.state.player.yaw')===0&&run('world3d.state.player.x')===0,'graveyard locks turning and lateral movement');
for(const key of ['s','a','arrowright'])handlers.keyup({key});
handlers.keydown({key:'w',repeat:false,preventDefault(){}});passageFrames(360);handlers.keyup({key:'w'});
const partialPassage=run('world3d.state.passage.progress');test(partialPassage>.2&&partialPassage<.5,'forward walking gradually opens view');passageFrames(30);
test(run('world3d.state.passage.progress')===partialPassage,'passage never auto-walks without input');
handlers.keydown({key:'w',repeat:false,preventDefault(){}});passageFrames(1040);handlers.keyup({key:'w'});
test(run('world3d.state.passage.progress')===1,'whole graveyard visible before return');test(run('world3d.state.passage.revealHold')<3.2,'full revelation has a deliberate viewing hold');passageFrames(100);
test(!run('world3d.state.passage'),'full revelation automatically teleports to park');test(run('world3d.state.player.z')===-10,'return lands in front of central captain');
test(run("$('speaker').textContent")==='키퍼'&&run("$('text').textContent").includes('어떻게'),'keeper is surprised immediately after return');
run(`drain();test(free3d,'graveyard return unlocks full park');test(s.cleared.size===0,'first accident is not a normal ride success');world3d.fracturePulse();test(world3d.state.reality.glitchCount===1,'later ride completion can queue checker glitch');test(world3d.state.reality.glitch>0,'queued checker glitch is active');`);
test(run('world3d.state.config.paused'),'map pauses walking');
run("$('backMap').onclick()");test(!run('world3d.state.config.paused'),'map close resumes walking');
// A flood fill proves each control, clue, keeper and possible exit can be reached from the cabin.
run('startMain();world3d.configure({free:true,paused:false});');
const walkable=sandbox.worldQA.valid,seen=new Set(['0,15']),frontier=[[0,15]];
for(let cursor=0;cursor<frontier.length;cursor++){
 const [x,z]=frontier[cursor];for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){
  const nx=x+dx,nz=z+dz,key=nx+','+nz;if(!seen.has(key)&&walkable(nx,nz)){seen.add(key);frontier.push([nx,nz]);}
 }
}
const positions={controls:sandbox.NEVERLAND_LAYOUT.rides.map(r=>r.control),clues:sandbox.NEVERLAND_LAYOUT.clues,keepers:sandbox.NEVERLAND_LAYOUT.keepers};
positions.exits=positions.controls.map(([x,z])=>[x+4,z+2]);
for(const [kind,points]of Object.entries(positions))for(const [i,p]of points.entries())test(frontier.some(([x,z])=>Math.hypot(x-p[0],z-p[1])<2),'walkable path to '+kind+' '+i);
run("world3d.configure({paused:true});");const stationary=JSON.stringify(sandbox.worldQA.player);handlers.keydown({key:'w',repeat:false,preventDefault(){}});frames(5);test(JSON.stringify(sandbox.worldQA.player)===stationary,'modal pause prevents movement');
// Imported core and art manifests must match the approved source exactly.
// All interior spaces have navigable entry-to-seat/control paths and reversible teleportation.
for(let i=0;i<5;i++){
 run(`startMain();s.ride=${i};sync3d();test(world3d.enterRide(${i}),'enter interior ${i}');explore3d();`);
 const d=sandbox.NEVERLAND_INTERIORS[i],visited=new Set([d.spawn.join(',')]),todo=[[...d.spawn]];
 for(let k=0;k<todo.length;k++){const [x,z]=todo[k];for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const nx=x+dx,nz=z+dz,key=nx+','+nz;if(!visited.has(key)&&sandbox.neverlandWorld.interiorValid(nx,nz)){visited.add(key);todo.push([nx,nz]);}}}
 for(const [name,p]of [['exit',d.exit],['seat',d.seat],['control',d.control],['finish',d.finish]])if(p)test(todo.some(([x,z])=>Math.hypot(x-p[0],z-p[1])<1.6),'interior path '+i+' '+name);
 test(!sandbox.neverlandWorld.interiorValid(100,100),'interior bounds '+i);
 run(`test(world3d.leaveRide(),'return from interior ${i}');test(worldQA.player.x===0&&worldQA.player.z===24,'return to saved park location ${i}');`);
}
let interiorClock=80000;const rideFrames=n=>{for(let j=0;j<n;j++)frame(interiorClock+=1000/60);};
for(let i=0;i<5;i++){
 run(`startMain();s.ride=${i};sync3d();world3d.enterRide(${i});explore3d();`);
 if(i!==3)run(`{const seat=window.NEVERLAND_INTERIORS[${i}].seat;worldQA.player.x=seat[0];worldQA.player.z=seat[1];test(world3d.sit(),'seat boarding ${i}');test(!worldQA.valid(seat[0]+1,seat[1]),'seated movement locked ${i}');}`);
 run(`operate(${i});if(s.ride===0)$('safeLever').value=puzzle.target;if(s.ride===1)puzzle.rotations=puzzle.offsets.map(v=>(8-v)%8);if(s.ride===2)puzzle.sequence=[...puzzle.melody];if(s.ride===3)puzzle.turns=[1,1,2,3,0,0,0,0,0];if(s.ride===4){puzzle.colors=new Set(['빨강','파랑']);puzzle.speed=55;}verify();test(!s.cleared.has(${i}),'no reward before actual experience ${i}');`);
 if(i===3){run("test(world3d.state.interior.solved,'mirror unlocks physical exit');worldQA.player.x=0;worldQA.player.z=-8.5");handlers.keydown({key:'e',repeat:false,preventDefault(){}});run("test(!world3d.state.interior,'mirror exit returns to park')");}
 else{run(`test(world3d.state.interior.running,'ride starts ${i}');test(!world3d.stand()&&!world3d.leaveRide(),'cannot disembark during ride ${i}');world3d.configure({paused:true});`);const progress=run('world3d.state.interior.progress');rideFrames(10);test(run('world3d.state.interior.progress')===progress,'modal pauses interior ride '+i);run('world3d.configure({paused:false});');rideFrames(Math.ceil(sandbox.NEVERLAND_INTERIORS[i].duration*60)+10);}
 run(`test(s.cleared.has(${i})&&s.wins===1,'reward after actual experience ${i}');drain();explore3d();`);if(i!==3)run('returnToPark()');
}
run(`newGame();test(!world3d.state.interior,'restart clears interior');test(!world3d.enterRide(1),'other rides locked before first accident');`);
run(`startMain();worldQA.player.x=-12.5;worldQA.player.z=-26;worldQA.player.yaw=Math.PI/2;const beforeMap=JSON.stringify(worldQA.player);map();test($('overlay').innerHTML.includes('id="map-player" transform="translate(-12.5 -26)"'),'map pin uses actual coordinates');test($('overlay').innerHTML.includes('rotate(-90)'),'map shows actual facing direction');test(!$('overlay').innerHTML.includes('ride-spot'),'map has no selectable attractions');test(($('overlay').innerHTML.match(/<button/g)||[]).length===1,'map only has close button');test(JSON.stringify(worldQA.player)===beforeMap,'opening map does not move player');$('backMap').onclick();worldQA.player.x=14;worldQA.player.z=-47;map();test($('overlay').innerHTML.includes('translate(14 -47)'),'map reflects new walking position on reopening');`);
const reference=fs.readFileSync(path.join(root,'original-2d/index.html'),'utf8');
run(`startMain();s.exit=true;s.exitRide=1;sync3d();test(world3d.state.exitReveal.age===0,'exit reveal begins at discovery');sync3d();sync3d();test(world3d.state.exitReveal.count===1,'repeated sync does not replay reveal');world3d.configure({paused:true});`);
const pausedReveal=run('world3d.state.exitReveal.age');let revealTime=20000;
for(let i=0;i<20;i++)frame(revealTime+=1000/60);
test(run('world3d.state.exitReveal.age')===pausedReveal,'reveal waits during dialogue');
run('world3d.configure({paused:false});');for(let i=0;i<420;i++)frame(revealTime+=1000/60);
test(run('world3d.state.exitReveal.age')>6,'reveal finishes after resuming walking');test(run('world3d.state.exitReveal.announced'),'reveal announces discovery');
run(`newGame();test(world3d.state.exitReveal.age===-1&&world3d.state.exitReveal.count===0,'restart clears reveal animation');`);
run(`startMain();s.exit=false;map();test(!document.querySelector('.position-map svg').children.some(x=>x.id==='map-exit'),'undiscovered exit hidden on map');$('backMap').onclick();s.exit=true;s.exitRide=3;map();const exitMarker=document.querySelector('.position-map svg').children.find(x=>x.id==='map-exit');test(exitMarker&&exitMarker.transform==='translate(-12 3)','discovered exit marked at actual world coordinates');$('backMap').onclick();s.ride=3;worldQA.player.x=-12;worldQA.player.z=4.5;sync3d();test(worldQA.nearest().type==='exit','physical exit triggers confrontation');test(!worldQA.valid(-12,3),'sealed exit blocks passage');atExit3d=true;const pos=JSON.stringify([worldQA.player.x,worldQA.player.z]);finale();atExit3d=false;test(confronting3d,'exit encounter enters confrontation');test(JSON.stringify([worldQA.player.x,worldQA.player.z])===pos,'confrontation keeps player at physical exit');next();next();test($('text').textContent.includes('네버랜드를 떠나지 않았으면'),'keeper wants player to stay');drain();test($('choices').children.length===3,'confrontation leads to original three final approaches');newGame();test(!confronting3d&&!world3d.state.config.exit,'restart clears confrontation and exit');`);
test(fs.readFileSync(path.join(root,'story-core.js'),'utf8')===reference.match(/<script>([\s\S]*?)<\/script>/)[1],'original story logic byte-for-byte retained');
run(`startMain();s.ride=1;s.talks=1;topic('keeper');$('choices').children[0].onclick();drain();test(forcedRide3d===1,'second completed conversation forces current ride');test(world3d.state.interior.ride===1&&world3d.state.interior.seated,'forced boarding enters ride and seats player');test(!world3d.leaveRide(),'forced ride blocks return to park');test(!world3d.stand(),'forced ride blocks premature dismount');arriveAtRide(2);test(s.ride===1,'forced ride cannot switch attraction');const oldPhase=s.phase;map();test(s.phase===oldPhase,'map cannot bypass boarding obligation');success(false);test(world3d.state.interior.running,'forced ride still launches physical motion');`);
for(let i=0;i<1150;i++)frame(1000000+i*1000/60);
run(`test(forcedRide3d===null&&world3d.state.config.forcedRide===-1,'physical completion releases forced ride');test(s.survivedRides===1&&s.talks===0,'successful forced ride counts once and clears question limit');drain();test(world3d.leaveRide(),'park return available after required ride');newGame();test(forcedRide3d===null,'restart clears boarding obligation');`);
const veinField=sandbox.NEVERLAND_KEEPER_VEINS.field(),veinSize=sandbox.NEVERLAND_KEEPER_VEINS.dimensions;
let veinCoverage=0;for(const level of[.19,.38,.57,.76,.95]){const coverage=veinField.reduce((n,v)=>n+(v/255<=level?1:0),0);test(coverage>veinCoverage,'single-origin red coverage increases '+level);veinCoverage=coverage;}
test(veinField[Math.floor(veinSize[1]*.17)*veinSize[0]+Math.floor(veinSize[0]*.56)]<.19*255,'red originates at mask star');
test(veinField[0]>.38*255,'early corruption preserves distant original pixels');
run(`newGame();test(s.survivedRides===0&&keeperRedLevel3d()===0,'new keeper starts in original colors');let previousRed=0;for(let i=1;i<=5;i++){s.survivedRides=i;const red=keeperRedLevel3d();test(red>previousRed&&red<1,'survival tint increases '+i);previousRed=red;}s.exit=true;sync3d();test(keeperRedLevel3d()===1&&world3d.state.config.keeperRed===1,'exit reveals solid red keeper');test($('keeper-red-matrix').values.split(' ').length===20,'portrait uses complete RGBA color matrix');newGame();test(world3d.state.config.keeperRed===0,'restart restores keeper colors');startMain();operate(0);success(true);test(s.survivedRides===1,'survived assisted ride counts');success(false);test(s.survivedRides===2,'survived repeat ride counts');newGame();end(4);test(s.survivedRides===0,'death does not increase corruption');newGame();`);
test(!fs.readFileSync(path.join(root,'reality-fracture.js'),'utf8').includes('function eye('),'graveyard neon eye geometry removed');
test(fs.readFileSync(path.join(root,'reality-fracture.js'),'utf8').includes("color:'#ff100a'"),'graveyard accent is scarlet');
test(fs.readFileSync(path.join(root,'carnival-scene.js'),'utf8').includes(".replace('#include <fog_fragment>'"),'sprite red tint targets an existing shader chunk');
for(const m of html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g))test(fs.existsSync(path.join(root,m[1])),'asset exists '+m[1]);


for(const level of [.19,.38,.57,.76,.95]){
 const w=veinSize[0],h=veinSize[1],seen=new Set(),start=veinField.findIndex(v=>v/255<=level),stack=[start];seen.add(start);
 while(stack.length){const i=stack.pop(),x=i%w,y=Math.floor(i/w);for(const j of [x?i-1:-1,x<w-1?i+1:-1,y?i-w:-1,y<h-1?i+w:-1])if(j>=0&&!seen.has(j)&&veinField[j]/255<=level){seen.add(j);stack.push(j);}}
 test(seen.size===veinField.reduce((n,v)=>n+(v/255<=level?1:0),0),'connected takeover '+level);
}

console.log(`PASS: ${assertions} assertions: original content parity, renderer frames/walking, profile, all 18 replies, 5 puzzles and boundaries, help/risk, clues, events/dice, exit proximity, victory/failure, 5 endings, both gender CGs, restart records.`);
