// Reading controls never choose a response or operate a ride for the player.
(function(){
 'use strict';
 const history=[];let mode='manual',continuation=null,deadline=0,logOpen=false,priorPause=false,priorFocus=null;
 const bar=document.createElement('nav');bar.id='dialogue-controls';bar.setAttribute('aria-label','대사 읽기 설정');
 bar.innerHTML='<button id="dialogue-log">대사 로그</button><button id="dialogue-skip" aria-pressed="false">스킵</button><button id="dialogue-auto" aria-pressed="false">Auto</button>';
 document.body.append(bar);
 const log=document.createElement('section');log.id='dialogue-history';log.hidden=true;log.setAttribute('role','dialog');log.setAttribute('aria-modal','true');log.setAttribute('aria-labelledby','dialogue-history-title');
 log.innerHTML='<div class="dialogue-history-panel"><div class="dialogue-history-heading"><h2 id="dialogue-history-title">대사 로그</h2><button id="dialogue-log-close">닫기 · Esc</button></div><p class="dialogue-history-note">이번 플레이에서 지나온 대사입니다. 재시작하면 비워집니다.</p><div id="dialogue-history-lines" tabindex="0"></div></div>';
 document.body.append(log);
 const buttons={log:$('dialogue-log'),skip:$('dialogue-skip'),auto:$('dialogue-auto')};
 const delay=()=>mode==='skip'?100:Math.min(7000,Math.max(1800,($('text').textContent||'').length*65));
 function blocked(){return logOpen||document.hidden||!!$('overlay').children.length||$('stage').classList.contains('walking');}
 function refresh(){
  bar.hidden=!s||s.phase==='profile';
  for(const key of ['skip','auto']){buttons[key].disabled=!continuation||logOpen;buttons[key].setAttribute('aria-pressed',String(mode===key));const label=key==='auto'?'Auto':'스킵';const text=label+(mode===key?' · 켜짐':'');if(buttons[key].textContent!==text)buttons[key].textContent=text;}
 }
 function stop(){mode='manual';deadline=0;refresh();}
 function setMode(value){mode=mode===value?'manual':value;deadline=Date.now()+delay();refresh();}
 function closeLog(){if(!logOpen)return;logOpen=false;log.hidden=true;window.neverlandWorld?.configure({paused:priorPause});deadline=Date.now()+delay();refresh();priorFocus?.focus?.();}
 function openLog(){
  if(logOpen)return;priorFocus=document.activeElement;priorPause=!!window.neverlandWorld?.state.config.paused;logOpen=true;window.neverlandWorld?.configure({paused:true});document.exitPointerLock?.();
  const lines=$('dialogue-history-lines');lines.replaceChildren();
  if(!history.length){const p=document.createElement('p');p.textContent='아직 기록된 대사가 없습니다.';lines.append(p);}
  for(const entry of history){const row=document.createElement('article'),name=document.createElement('strong'),text=document.createElement('p');name.textContent=entry.who||'내레이션';text.textContent=entry.text;row.append(name,text);lines.append(row);}
  log.hidden=false;lines.scrollTop=lines.scrollHeight;$('dialogue-log-close').focus();refresh();
 }
 const priorSay=say;say=function(who,text,options){
  priorSay(who,text,options);
  history.push({who:$('speaker').textContent,text:$('text').textContent});
  continuation=options?.length===1&&options[0][1]===next?options[0][1]:null;
  if(!continuation)mode='manual';deadline=Date.now()+delay();refresh();
 };
 const priorNewGame=newGame;newGame=function(...args){closeLog();stop();continuation=null;history.length=0;const result=priorNewGame(...args);refresh();return result;};
 buttons.log.onclick=openLog;$('dialogue-log-close').onclick=closeLog;buttons.skip.onclick=()=>setMode('skip');buttons.auto.onclick=()=>setMode('auto');
 log.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeLog();}else if(event.key==='Tab'){const first=$('dialogue-log-close'),last=$('dialogue-history-lines');if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!logOpen&&mode!=='manual'){stop();}},true);
 setInterval(()=>{
  if(mode!=='manual'&&!continuation)stop();refresh();if(mode==='manual'||!continuation)return;if(blocked()){deadline=Date.now()+delay();return;}
  if(Date.now()>=deadline){const advance=continuation;continuation=null;advance();}
 },100);
 window.NEVERLAND_DIALOGUE={get history(){return history.map(entry=>({...entry}));},get mode(){return mode;},openLog,closeLog,stop};
 refresh();
})();
