// Player menus and reproducible authoring checkpoints. Never infer a story callback from text.
(function(){
 'use strict';
 const key='neverland-settings-v1',albumKey='neverland-album-v1';
 function read(k,fallback){try{return JSON.parse(localStorage.getItem(k))||fallback;}catch{return fallback;}}
 const settings=Object.assign({font:18,auto:65,volume:65,reduced:false},read(key,{}));
 let collected=read(albumKey,[]);if(!Array.isArray(collected))collected=[];
 let testing=false,resetting=false,opened=false,paused=false,focus=null;
 const nav=document.createElement('nav');nav.id='game-menu';nav.setAttribute('aria-label','게임 메뉴');
 nav.innerHTML='<button id="game-log">로그</button><button id="game-album">앨범</button><button id="game-settings">설정</button><button id="game-jump">장면 이동 · 제작</button>';
 document.body.append(nav);
 const shell=document.createElement('section');shell.id='game-tools';shell.hidden=true;shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');shell.setAttribute('aria-labelledby','game-tools-title');
 shell.innerHTML='<div class="tools-panel"><div class="tools-heading"><h2 id="game-tools-title"></h2><button id="tools-close">닫기 · Esc</button></div><div id="tools-content"></div></div>';document.body.append(shell);
 const badge=document.createElement('div');badge.id='test-play-badge';badge.hidden=true;badge.textContent='제작 테스트 · 수집 기록에 저장되지 않음';document.body.append(badge);
 function persist(){try{localStorage.setItem(key,JSON.stringify(settings));}catch{}}
 function apply(){document.documentElement.style.setProperty('--dialogue-font',settings.font+'px');document.body.classList.toggle('reduce-motion',settings.reduced);window.NEVERLAND_BGM?.setVolume(settings.volume/100);}
 function hide(){if(!opened)return;opened=false;shell.hidden=true;world3d.configure({paused});focus?.focus?.();}
 function show(title){window.NEVERLAND_DIALOGUE?.closeLog();window.NEVERLAND_DIALOGUE?.stop();if(!opened){focus=document.activeElement;paused=!!world3d.state.config.paused;}opened=true;shell.hidden=false;world3d.configure({paused:true});document.exitPointerLock?.();$('game-tools-title').textContent=title;$('tools-content').replaceChildren();$('tools-close').focus();return $('tools-content');}
 function node(tag,text,parent){const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;}
 function action(parent,text,fn){const b=node('button',text,parent);b.onclick=fn;return b;}
 function collect(id){if(resetting||testing||collected.includes(id))return;collected.push(id);try{localStorage.setItem(albumKey,JSON.stringify(collected));}catch{}}
 function album(){const host=show('앨범 · 네버랜드의 기억');node('p','플레이에서 만난 키퍼의 표정과 이벤트 그림을 모읍니다. 엔딩은 기록으로 보관하며, 채택되지 않은 엔딩 그림은 표시하지 않습니다.',host);
  const grid=node('div','',host);grid.className='album-grid';const seen=new Set();
  for(const [id,item]of Object.entries(keeperArt)){if(seen.has(item.src))continue;seen.add(item.src);const card=node('article','',grid);if(collected.includes('pose:'+item.src)){const image=document.createElement('img');image.src=item.src;image.alt=item.name;card.append(image);node('p',item.name,card);}else{node('div','◇',card).className='album-lock';node('p','아직 만나지 않은 표정',card);}}
  for(const [id,src]of Object.entries(eventArt)){const card=node('article','',grid);if(collected.includes('event:'+id)){const image=document.createElement('img');image.src=src;image.alt=id==='parade'?'퍼레이드':'주사위 승리';card.append(image);node('p',image.alt,card);}else{node('div','◇',card).className='album-lock';node('p','아직 만나지 않은 이벤트',card);}}
  node('h3','엔딩 기록 · '+endings.length+' / 5',host);for(let id=1;id<=5;id++)node('p',endings.includes(id)?'✦ '+endingData[id][0]:'◇ 아직 쓰이지 않은 이야기',host);
 }
 function options(){const host=show('설정');node('p','설정은 이 브라우저에 보관됩니다. 진행 자동 저장은 없으며, 장면 이동은 제작 테스트용입니다.',host);
  function range(label,field,min,max,step,unit){const row=node('label','',host);row.className='setting-row';const title=node('span',label,row),out=node('output',settings[field]+unit,row),input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.step=step;input.value=settings[field];input.setAttribute('aria-label',label);row.append(input);input.oninput=()=>{settings[field]=Number(input.value);out.value=settings[field]+unit;apply();persist();};}
  range('대사 글자 크기','font',16,30,1,'px');range('Auto 읽기 간격 · 클수록 느림','auto',30,120,5,'ms/글자');range('배경음 크기','volume',0,100,5,'%');
  const label=node('label','',host);label.className='setting-check';const input=document.createElement('input');input.type='checkbox';input.checked=settings.reduced;label.append(input);node('span','동작 줄이기 · 미로의 점멸과 화면 효과 완화',label);input.onchange=()=>{settings.reduced=input.checked;apply();persist();};
  action(host,window.NEVERLAND_BGM?.state.muted?'소리 켜기':'소리 끄기',()=>{$('sound').click();options();});
  node('h3','읽기 도구',host);node('p','대화 중 스킵은 계속 대사만 넘깁니다. Auto는 읽기 간격에 맞춰 진행하며, 선택지에서는 둘 다 멈춥니다. Esc로 정지할 수 있습니다.',host);
  action(host,'대사 로그 열기',()=>{hide();window.NEVERLAND_DIALOGUE.openLog();});
 }
 function profile(){return{name:s?.name||'여행자',gender:s?.gender||'female',temper:s?.temper||'moderate'};}
 function prepare(){const p=profile();hide();window.NEVERLAND_DIALOGUE.closeLog();newGame();testing=true;badge.hidden=false;close();Object.assign(s,p,{phase:'main',keeperIntroduced:true});queue=[];after=null;puzzle=null;releaseForcedRide3d();pendingRideResult=null;atControl3d=false;atExit3d=false;confronting3d=false;free3d=true;intro3d=false;firstLever3d=false;target3d=null;keeperStoryState.orientation=false;keeperStoryState.ready=true;world3d.configure({free:true,paused:false});}
 function late(){world3d.unlockFracture();s.cleared=new Set([0,1,2,3]);s.visited=new Set([0,1,2,3,4]);s.clues=new Set([0,1,2,3,4]);s.survivedRides=4;s.K=10;s.M=4;s.N=12;s.I=6;s.wins=3;s.exit=true;s.exitRide=1;s.ride=1;keeperStoryState.dream='accuse';keeperStoryState.evidence=new Set([0,1,2,3,4]);}
 function jump(where,id=0){
  if(where==='title'){hide();newGame();return;}
  const parkState=where==='park'&&s.phase!=='profile'?{story:s,keeper:keeperStoryState}:null;
  prepare();
  if(parkState){s=parkState.story;keeperStoryState=parkState.keeper;s.phase='main';s.talks=0;}
  if(where==='start'){free3d=false;keeperOrientation3d();}
  else if(where==='first'){world3d.unlockFracture();s.visited=new Set([0]);keeperStoryState.dream='';finishFracture3d();}
  else if(where==='ride'){s.ride=id;s.visited.add(id);s.talks=0;world3d.jumpToPark(controls3d[id][0],controls3d[id][1]+5);world3d.enterRide(id);if(id===0){free3d=false;firstLever3d=true;world3d.forceBoard(0);keeperFirstBoarding3d();}else explore3d(rides[id].name+' · 내부에서 테스트합니다.');}
  else if(where==='park'){s.ride=id;world3d.jumpToPark(controls3d[id][0],controls3d[id][1]+5);explore3d('공원으로 돌아왔습니다. 제작 메뉴에서 다음 장면으로 이동할 수 있습니다.');}
  else if(where==='exit'){late();world3d.jumpToPark(controls3d[1][0]+4,controls3d[1][1]+6);explore3d('출구가 나타난 직후 · 앞의 출구에서 E를 누르면 고백이 시작됩니다.');world3d.faceExit();}
  else if(where==='branch'){late();confronting3d=true;keeperStoryState.confessed=true;world3d.jumpToPark(controls3d[1][0]+4,controls3d[1][1]+6);sync3d();world3d.faceExit();keeperFinalChoices();}
  else if(where==='outside'){late();s.phase='final';end(2);}
  else if(where==='ending'){late();s.phase='final';end(id);}
  sync3d();world3d.audio();
 }
 function jumps(){const host=show('장면 이동 · 제작');node('p','선택하면 현재 진행을 테스트 상태로 교체합니다. 이름·성별·성향은 유지하며, 테스트에서 본 앨범과 엔딩은 수집 기록에 저장하지 않습니다. 일반 플레이로 돌아가려면 타이틀부터 다시 시작하세요.',host);
  const grid=node('div','',host);grid.className='jump-grid';for(const [label,id]of [['처음 · 키퍼 안내','start'],['첫 놀이기구 사고 후 · 꿈 대사','first'],['출구 등장 후 · 공원','exit'],['엔딩 분기점 · 최종 선택','branch'],['출구를 통과한 후 · 현실','outside']])action(grid,label,()=>jump(id));
  node('h3','놀이기구로 바로 이동',host);const ridesGrid=node('div','',host);ridesGrid.className='jump-grid';rides.forEach((ride,id)=>action(ridesGrid,ride.name+' 내부',()=>jump('ride',id)));
  action(host,'현재 기구에서 나와 공원으로',()=>jump('park',s.ride||0));node('h3','엔딩 공간 미리보기',host);const endingsGrid=node('div','',host);endingsGrid.className='jump-grid';for(let id=1;id<=5;id++)action(endingsGrid,id+' · '+endingData[id][0],()=>jump('ending',id));
  action(host,'타이틀 · 일반 플레이 새로 시작',()=>jump('title'));
 }
 const oldNew=newGame;newGame=function(...args){hide();testing=false;badge.hidden=true;resetting=true;try{return oldNew(...args);}finally{resetting=false;}};
 const oldPose=showKeeperPose;showKeeperPose=function(id,...args){const result=oldPose(id,...args);if(s?.phase!=='profile'&&keeperArt[id])collect('pose:'+keeperArt[id].src);return result;};
 const oldEvent=showEventArt;showEventArt=function(id,...args){const result=oldEvent(id,...args);collect('event:'+id);return result;};
 $('game-log').onclick=()=>{hide();window.NEVERLAND_DIALOGUE.openLog();};$('game-album').onclick=album;$('game-settings').onclick=options;$('game-jump').onclick=jumps;$('tools-close').onclick=hide;
 shell.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide();}if(e.key==='Tab'){const items=Array.from(shell.querySelectorAll('button,input,select')).filter(el=>!el.disabled);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 document.addEventListener('keydown',e=>{if(opened){if(!shell.contains(e.target))return;e.stopPropagation();}},{capture:true});
 window.NEVERLAND_TOOLS={get testing(){return testing;},get open(){return opened;},get settings(){return{...settings};},jump,hide,album,options,jumps};apply();
})();
