const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
let suite=fs.readFileSync(path.join(__dirname,'verify-full-story.cjs'),'utf8');
suite+=`\nvm.runInContext(fs.readFileSync(path.join(root,'keeper-story.js'),'utf8'),sandbox);vm.runInContext(fs.readFileSync(path.join(root,'lost-boys.js'),'utf8'),sandbox);
run(\`startMain();
for(const c of window.NEVERLAND_CAST.cast){
 const outside=window.NEVERLAND_LAYOUT.rides[c.ride].control;
 const p={x:outside[0]+(outside[0]>0?3:-3),z:outside[1]+2};
 test(window.NEVERLAND_CAST.nearest(p,null,world3d.state.config)?.cast===c.id,'outside cast encounter '+c.id);
 window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});$('choices').children[2].onclick();
 test(!s.castStories[c.id].accepted,'declining is optional '+c.id);
 window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});$('choices').children[0].onclick();$('choices').children[0].onclick();
 test(s.castStories[c.id].accepted,'explicit acceptance '+c.id);
 s.ride=c.ride;sync3d();test(world3d.enterRide(c.ride),'enter ride '+c.id);explore3d();
 test(window.NEVERLAND_CAST.nearest({x:c.inside[0],z:c.inside[1]},world3d.state.interior,world3d.state.config)?.cast===c.id,'inside cast encounter '+c.id);
 test(window.NEVERLAND_CAST.nearest(p,null,{...world3d.state.config,forcedRide:c.ride})===null,'forced boarding guarded');
 test(window.NEVERLAND_CAST.nearest({x:c.inside[0],z:c.inside[1]},{...world3d.state.interior,running:true},world3d.state.config)===null,'moving ride guarded');
 const before=[s.N,s.I,s.talks,s.survivedRides,s.cleared.size];
 // Verify all clues and cast are reachable from the actual spawn using collision rules.
 const spawn=window.NEVERLAND_INTERIORS[c.ride].spawn, todo=[spawn],seen=new Set([spawn.join()]);
 for(let k=0;k<todo.length;k++){const [x,z]=todo[k];for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const q=[x+dx,z+dz],key=q.join();if(!seen.has(key)&&world3d.interiorValid(...q)){seen.add(key);todo.push(q);}}}
 for(const q of [c.inside,...c.steps.map(v=>v.p)])test(todo.some(v=>Math.hypot(v[0]-q[0],v[1]-q[1])<1),'walkable quest target '+c.id);
 for(let step=0;step<3;step++){
  const item=c.steps[step];test(window.NEVERLAND_CAST.nearest({x:item.p[0],z:item.p[1]},world3d.state.interior,world3d.state.config)?.type==='cast-clue','nearby clue '+c.id+step);
  window.NEVERLAND_CAST.interact({type:'cast-clue',cast:c.id});$('choices').children[1-item.correct].onclick();test(s.castStories[c.id].step===step,'wrong answer retry');$('choices').children[0].onclick();$('choices').children[item.correct].onclick();$('choices').children[0].onclick();
  test(s.castStories[c.id].step===step+1,'chosen clue advances '+c.id+step);
  if(step===0){world3d.leaveRide();test(s.castStories[c.id].step===1,'pause keeps progress');world3d.enterRide(c.ride);explore3d();}
 }
 window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});test(s.castStories[c.id].done,'report completes quest '+c.id);$('choices').children[1].onclick();
 test(s.N===before[0]+1&&s.I===before[1]+1,'single evidence reward');
 window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});$('choices').children[1].onclick();test(s.N===before[0]+1,'repeat cannot farm');
 test(s.talks===before[2]&&s.survivedRides===before[3]&&s.cleared.size===before[4],'quests preserve compulsory-talk and ride completion counters');
 world3d.leaveRide();explore3d();
}
window.NEVERLAND_CAST.journal();test($('overlay').innerHTML.includes('캐스트의 기록'),'journal opens');$('cast-journal-close').onclick();newGame();test(Object.keys(s.castStories).length===0,'new game clears all quests');\`);
console.log('PASS: '+assertions+' assertions including optional cast quests, collision reachability, retries, rewards, restart and interior/exterior encounters.');`;
vm.runInThisContext('(function(require,__dirname){'+suite+'\n})',{filename:__filename})(require,__dirname);
