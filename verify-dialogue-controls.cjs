const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let clock=0,tick;const nodes=new Map();
function element(id=''){return {id,children:[],textContent:'',hidden:false,disabled:false,attrs:{},classList:{contains(){return false;}},setAttribute(k,v){this.attrs[k]=v;},append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},addEventListener(){},focus(){document.activeElement=this;}};}
const document={hidden:false,activeElement:null,body:element(),createElement:()=>element(),addEventListener(){},exitPointerLock(){}};
const $=id=>{if(!nodes.has(id))nodes.set(id,element(id));return nodes.get(id);};
let advances=0;const context={console,document,$,Date:{now:()=>clock},setInterval:f=>tick=f,s:{phase:'story'},window:{neverlandWorld:{state:{config:{paused:false}},configure(update){Object.assign(this.state.config,update);}}},next(){advances++;context.say('키퍼','다음 대사',[['계속 →',context.next]]);},say(who,text){$('speaker').textContent=who;$('text').textContent=text;},newGame(){context.s.phase='profile';context.say('네버랜드','처음',[]);}};
vm.createContext(context);vm.runInContext(fs.readFileSync('dialogue-controls.js','utf8'),context);
let count=0;const check=(condition,message)=>{assert.ok(condition,message);count++;};
context.say('키퍼','안녕하세요.',[['계속 →',context.next]]);
check(context.window.NEVERLAND_DIALOGUE.history.length===1,'line is logged');
$('dialogue-auto').onclick();clock=1700;tick();check(advances===0,'auto respects reading delay');clock=1800;tick();check(advances===1,'auto advances dialogue');
context.say('여행자','선택합니다.',[['왼쪽',()=>{throw Error('choice selected');}],['오른쪽',()=>{}]]);clock=10000;tick();check(advances===1&&context.window.NEVERLAND_DIALOGUE.mode==='manual','choices stop auto without selecting');
context.say('키퍼','긴 대사입니다.',[['계속 →',context.next]]);$('dialogue-skip').onclick();clock+=99;tick();check(advances===1,'skip is bounded');clock++;tick();check(advances===2,'skip advances dialogue');
context.window.NEVERLAND_DIALOGUE.openLog();check(context.window.neverlandWorld.state.config.paused,'log pauses movement');clock+=1000;tick();check(advances===2,'log pauses skip');check($('dialogue-history-lines').children.length===5,'history contains skipped and choice lines');context.window.NEVERLAND_DIALOGUE.closeLog();check(!context.window.neverlandWorld.state.config.paused,'closing log restores prior pause state');
$('overlay').children=[element()];clock+=1000;tick();check(advances===2,'modal blocks automated progress');$('overlay').children=[];
document.hidden=true;clock+=1000;tick();check(advances===2,'background tab never advances');document.hidden=false;
context.newGame();check(context.window.NEVERLAND_DIALOGUE.mode==='manual'&&context.window.NEVERLAND_DIALOGUE.history.length===1,'restart clears prior log and mode');
check($('dialogue-controls')!==null,'controls available');
console.log('PASS: '+count+' dialogue control checks.');

