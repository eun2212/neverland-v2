const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
let suite=fs.readFileSync(path.join(__dirname,'verify-full-story.cjs'),'utf8');
suite+=`\nvm.runInContext(fs.readFileSync(path.join(root,'keeper-story.js'),'utf8'),sandbox);vm.runInContext(fs.readFileSync(path.join(root,'lost-boys.js'),'utf8'),sandbox);
run(\`startMain();
for(const c of window.NEVERLAND_CAST.cast){
 const q=window.NEVERLAND_CAST.position(c,null),p={x:q[0],z:q[1]};
 test(window.NEVERLAND_CAST.nearest(p,null,world3d.state.config)?.label==='E · 관절인형을 살핀다','unidentified silent doll outside');
 window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});test($('speaker').textContent==='','dolls never speak');test(!$('text').textContent.includes(c.name),'name hidden until nameplate');$('choices').children[1].onclick();test(!s.dollMemories[c.id].found,'can pass without accepting a quest');
 window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});$('choices').children[0].onclick();test(s.dollMemories[c.id].named&&$('text').textContent.includes(c.name),'optional nameplate identifies doll');$('choices').children[0].onclick();
 s.ride=c.ride;sync3d();world3d.enterRide(c.ride);explore3d();
 const state=world3d.state;window.NEVERLAND_CAST.update(state);
 test(window.NEVERLAND_CAST.nearest({x:c.inside[0],z:c.inside[1]},state.interior,state.config)?.type==='cast','doll exists inside');
 test(window.NEVERLAND_CAST.nearest({x:c.item[0],z:c.item[1]},state.interior,state.config)?.type==='cast-clue','object found without quest acceptance');
 test(window.NEVERLAND_CAST.nearest(p,null,{...state.config,forcedRide:c.ride})===null,'forced boarding cannot be bypassed');
 test(window.NEVERLAND_CAST.nearest(p,{...state.interior,running:true},state.config)===null,'running ride cannot be interrupted');
 const todo=[window.NEVERLAND_INTERIORS[c.ride].spawn],seen=new Set([todo[0].join()]);for(let k=0;k<todo.length;k++){const [x,z]=todo[k];for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const v=[x+dx,z+dz],key=v.join();if(!seen.has(key)&&world3d.interiorValid(...v)){seen.add(key);todo.push(v);}}}
 for(const v of [c.inside,c.item,window.NEVERLAND_CAST.position(c,true,true)])test(todo.some(a=>Math.hypot(a[0]-v[0],a[1]-v[1])<1),'original and moved doll and object reachable');
 window.NEVERLAND_CAST.interact({type:'cast-clue',cast:c.id});$('choices').children[1].onclick();test(!s.dollMemories[c.id].found,'object may be left untouched');
 window.NEVERLAND_CAST.interact({type:'cast-clue',cast:c.id});$('choices').children[0].onclick();$('choices').children[0].onclick();test(s.dollMemories[c.id].found,'object collected');
 world3d.leaveRide();explore3d();world3d.enterRide(c.ride);explore3d();test(s.dollMemories[c.id].found,'object retained when leaving area');
 const before=[s.N,s.I,s.talks,s.survivedRides,s.cleared.size];window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});$('choices').children[1].onclick();test(s.dollMemories[c.id].placed,'physical offering chosen');$('choices').children[0].onclick();
 test(s.N===before[0]+1&&s.I===before[1]+1,'evidence awarded once');window.NEVERLAND_CAST.interact({type:'cast',cast:c.id});test($('choices').children.length===2,'offering cannot be repeated');$('choices').children[1].onclick();test(s.N===before[0]+1,'no score farming');test(s.talks===before[2]&&s.survivedRides===before[3]&&s.cleared.size===before[4],'core counters unchanged');
 const base=world3d.state;window.NEVERLAND_CAST.update(base);const outside={...base,interior:null,player:{x:q[0],z:q[1]+3,yaw:0}};window.NEVERLAND_CAST.update(outside);test(!s.dollMemories[c.id].moved,'doll never moves while watched');window.NEVERLAND_CAST.update({...outside,player:{...outside.player,yaw:Math.PI}});test(s.dollMemories[c.id].moved,'doll shifts only offscreen after leaving');
 const moved=window.NEVERLAND_CAST.position(c,null,true);test(window.NEVERLAND_CAST.nearest({x:moved[0],z:moved[1]},null,outside.config)?.cast===c.id,'interaction follows moved doll');
 world3d.leaveRide();explore3d();
}
newGame();test(Object.keys(s.dollMemories).length===0&&!s.dollKeeperAsked,'new game resets doll traces and keeper question');\`);
console.log('PASS: '+assertions+' assertions including silent dolls, optional objects, collision reachability, unseen shifts, one-time evidence and reset.');`;
vm.runInThisContext('(function(require,__dirname){'+suite+'\n})',{filename:__filename})(require,__dirname);
