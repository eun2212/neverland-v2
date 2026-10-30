'use strict';
// Narrative extension: genuine affection, deliberate danger, and a keeper who lies.
// The original puzzle rules and ending eligibility remain in story-core.js.
const keeperStoryBase={newGame,success,profileReply,offerHelp,resolve};
let keeperStoryState;
function resetKeeperStory(){keeperStoryState={orientation:false,ready:false,dream:'',stance:'',boundaries:0,suspicion:0,trust:0,incidents:new Set(),responses:new Set(),evidence:new Set(),confessed:false};}
newGame=function(){resetKeeperStory();keeperStoryBase.newGame();};
resetKeeperStory();
function keeperStage(){return Math.min(3,Math.floor((s.survivedRides||0)/2));}
function keeperBeat(lines,done){story(lines,done);}
function keeperOrientation3d(){
 keeperStoryState.orientation=true;
 keeperBeat([['키퍼','깨어나셨군요. 저는 키퍼예요. 여기는 네버랜드. 폐장 뒤의 길은 낮과 조금 달라요.'],['키퍼','당장 기억나지 않는다고 애쓰지 마세요. 우선 숨을 고르고, 제 목소리가 들리는지만 확인해요.'],[s.name,'그는 손을 내밀지만, 내가 잡을 때까지 가까이 오지 않는다. 멀리서 배의 사슬이 한 번 울린다.']],keeperOrientationMenu);
}
function keeperOrientationMenu(){
 say('키퍼','서두르지 않아도 돼요. 궁금한 것부터 물어보세요.',[
  ['지금 무슨 상황인가요?',()=>keeperBeat([['키퍼','당신은 캡틴 훅을 기다리다가 잠들었어요. 지금은 손님들이 모두 돌아간 뒤고요.'],['키퍼','정문은 닫혔지만 다른 길이 있어요. 저는 당신이 여기 있는 동안 안내를 맡을 거예요.'],[s.name,'그는 내가 어디서 잠들었는지 묻지도 않고 알고 있다.']],keeperOrientationMenu)],
  ['무엇을 해야 돌아갈 수 있나요?',()=>keeperBeat([['키퍼','먼저 중앙의 캡틴 훅에서 장치 쓰는 법을 익혀요. 그다음에는 서로 다른 놀이기구를 타고, 각 구역의 금빛 흔적을 살펴보세요.'],['키퍼','세 곳 이상 무사히 타고 길에 관한 단서를 모으면, 어느 구역에 바깥으로 이어지는 문이 드러나요. 문을 찾은 뒤에도 준비할 시간은 있어요.'],['키퍼','처음에는 누구나 돌아가고 싶어 해요. ……처음 오신 분들은요.']],keeperOrientationMenu)],
  ['걷기와 지도 사용법을 알려줘요',()=>keeperBeat([['키퍼','WASD나 화면의 방향 버튼으로 걸으세요. Shift를 누르면 빨리 걸을 수 있어요. 마우스로 둘러보고, Esc로 마우스를 풀 수 있어요.'],['키퍼','가까이 가서 E나 화면의 상호작용 버튼을 누르면 저와 대화하거나 장치를 사용할 수 있어요. 지도는 현재 위치와 방향만 보여줘요. 길은 직접 걸어야 해요.'],['키퍼','기구 입구에서 E를 누르면 안쪽으로 들어가요. 좌석에서 한 번 더 E로 앉고, 다시 E로 조작해요. 출발 전에는 Q로 일어나거나 공원으로 돌아갈 수 있어요.']],keeperOrientationMenu)],
  ['지도로 지금 위치를 확인한다',()=>{map();$('backMap').onclick=()=>{close();keeperOrientationMenu();};}],
  ['알겠어요. 주변을 살피며 캡틴 훅으로 갈게요',()=>{keeperStoryState.orientation=false;keeperBeat([['키퍼','좋아요. 입구를 지나 배 안의 좌석을 찾아오세요. 레버를 만지기 전에 한 번 더 설명해 드릴게요.'],['키퍼','길을 잃어도 괜찮아요. ……제가 당신을 놓치는 일은 없을 테니까.']],tutorial);}]
 ]);
}
function keeperFirstBoarding3d(){
 close();keeperBeat([['키퍼','좌석에 앉으셨네요. 아직 출발하지 않았어요. 준비가 되기 전에는 레버를 움직일 필요 없어요.'],['키퍼','첫 연습은 붉은 레버를 STOP에서 GO까지 미는 거예요. 조명, 작은 흔들림, 출발 준비 순서로 반응해요. 끝까지 민 뒤 출발을 누르세요.'],['키퍼','이후에는 기구마다 안전 구간이나 악보가 달라요. 그때는 끝까지 밀지 말고 표시된 조건을 맞추세요. 막히면 도움을 청할 수 있어요.']],keeperFirstBoardingMenu);
}
function keeperFirstBoardingMenu(){
 say('키퍼','출발은 당신이 준비된 다음에 해요.',[
  ['정말 안전한가요?',()=>keeperBeat([['키퍼','안전장치는 제가 확인했어요. 당신은 앞만 보시면 돼요.'],[s.name,'그가 조종대의 작은 정지 고리를 손바닥으로 가린다. 불빛이 한 번 깜빡였지만, 곧 다시 켜진다.']],keeperFirstBoardingMenu)],
  ['무서워요. 조금만 기다려줘요',()=>keeperBeat([['키퍼','그럼 잠깐만, 제 손을 잡을래요? 손잡이는 다른 손으로 잡고요.'],[s.name,'장갑 너머 손은 차갑다. 내가 먼저 놓자, 그의 손가락이 아주 조금 늦게 펴진다.'],['키퍼','괜찮아요. 아직은 기다릴 수 있어요.']],keeperFirstBoardingMenu)],
  ['내렸다가 다시 올게요',()=>{world3d.stand();returnToPark();}],
  ['준비됐어요. 레버를 조작할게요',()=>{keeperStoryState.ready=true;openFirstLever3d();}]
 ]);
}
function openFirstLever3d(){
 original3d.tutorial();
 $('launch').onclick=()=>{close();keeperBeat([['키퍼','좋아요. 제 말대로만 하면 돼요.'],[s.name,'레버가 GO에 닿자 키퍼의 엄지가 정지 고리에서 미끄러져 나온다. 배가 한 번 크게 기운다.'],['키퍼','……앞을 보세요. 저를 부르는 건, 조금 뒤에도 할 수 있으니까.']],()=>{pendingRideResult={kind:'tutorial'};world3d.setRidePower(100);world3d.startRide(8);explore3d('첫 항해 · 사슬이 팽팽해집니다. 안전 손잡이를 잡으세요.');});};
}
finishFracture3d=function(){
 document.body.classList.remove('fracture-walk');$('stage').classList.remove('walking','cut');scene('warm');showKeeperPose('06');
 keeperBeat([['키퍼','……눈을 떴네요.'],[s.name,'내 팔을 붙잡은 손에 힘이 들어간다. 키퍼는 잠깐 말을 잃었다가 천천히 웃는다.'],['키퍼','무서운 꿈을 꾼 모양이에요. 배가 흔들려서 잠깐 정신을 잃으셨거든요. 여기 있어요. 제 목소리를 들어요.']],()=>say(s.name,'무너진 인형들과 뒤틀린 바닥. 정말 꿈이었을까?',[
  ['꿈이라고 하기에는 너무 선명했어요',()=>dreamAnswer('doubt')],
  ['그럼 잠깐만 곁에 있어줘요',()=>dreamAnswer('comfort')],
  ['정지 장치에서 손을 뗀 걸 봤어요',()=>dreamAnswer('accuse')]
 ]));sync3d();
};
function dreamAnswer(choice){
 keeperStoryState.dream=choice;log('dream:'+choice);
 const lines=choice==='doubt'?[[s.name,'인형들이 쌓여 있었어요. 놀이기구와 엉켜서…….'],['키퍼','꿈은 원래 그렇죠. 익숙한 것들을 이상하게 섞어요. 당신이 실제로 본 건 이 불빛과 저뿐이에요.'],[s.name,'그는 인형이 어떻게 생겼는지는 묻지 않았다.']]:choice==='accuse'?[[s.name,'배가 기울기 전에, 당신 손이 움직였어요.'],['키퍼','당신을 꺼내려고 그랬어요. 꿈속 장면과 섞인 모양이네요.'],[s.name,'대답은 너무 빨랐다. 그는 내가 정지 장치라고 부른 고리를 끝내 내려다보지 않았다.']]:[['키퍼','그럴게요. 손이 떨리네요. 잠깐 잡고 있어도 될까요?'],[s.name,'나는 고개를 끄덕인다. 그가 손등을 감싸 쥔다. 안심이 되는데, 손을 뺄 순간을 놓친 기분이다.'],['키퍼','다음에는 제 목소리가 들리면 바로 대답해 주세요.']];
 if(choice==='comfort')keeperStoryState.trust++;else keeperStoryState.suspicion++;
 keeperBeat([...lines,['키퍼','다시 만나서 반가워요. 이제 다른 기구를 타고 금빛 흔적을 찾아봐요. 지도를 열어 드릴게요.'],['키퍼','그리고 그 꿈은……다른 데서 확인하려 하지 마세요. 더 불안해질 뿐이에요.']],()=>{firstLever3d=false;free3d=true;s.phase='main';map();});
}
const keeperRideIncidents=[
 ['정지 고리에 새 긁힌 자국이 있다. 키퍼가 그 위로 장갑을 얹는다.','그 고리는 보지 않아도 돼요. 이번에는 제가 제대로 잡고 있을게요.'],
 ['관람차의 제동등이 붉게 켜진다. 키퍼는 불을 보고도 출발 열쇠를 놓지 않는다.','높은 곳에서는 저를 불러도 조금 늦게 들려요. 그러니 필요할 때는 망설이지 마세요.'],
 ['목마의 안쪽 고정쇠 하나가 풀려 있다. 키퍼가 권한 자리가 바로 그 옆이다.','이 목마가 제일 잘 움직여요. 걱정되면 제가 바로 곁에서 잡아드릴게요.'],
 ['키퍼가 벽의 거울을 돌리자 돌아가는 문이 좁아진다. 그는 그제야 출구를 가리킨다.','저쪽의 빛만 따라가세요. 뒤를 보는 건 길을 더 어렵게 만들어요.'],
 ['찻잔의 속도침이 금빛 구간 바깥으로 튄다. 키퍼의 손가락이 보조 다이얼에 닿아 있다.','조금 더 빨라도 괜찮아요. 당신이 어지러워지기 전에는 제가 멈출 테니까.']
];
success=function(help,risk=false){
 // A successful puzzle earns a real, safe ride; narrative danger never falsifies controls.
 const key=s.ride+':'+(s.survivedRides||0);
 if(keeperStoryState.incidents.has(key)){keeperStoryBase.success(help,risk);return;}
 keeperStoryState.incidents.add(key);close();
 const incident=keeperRideIncidents[s.ride];
 keeperBeat([['',incident[0]],['키퍼',incident[1]]],()=>say(s.name,'그의 손은 위험한 곳에 먼저 닿아 있다. 나는…',[
  ['키퍼에게 안전장치를 맡긴다',()=>{keeperStoryState.trust++;keeperBeat([['키퍼','잘 생각했어요. 제가 필요할 때는, 그렇게 말해 주면 돼요.'],['','그가 고정쇠를 잠근다. 불길한 진동이 실제로 멎는다.']],()=>keeperStoryBase.success(true,risk));}],
  ['장치를 직접 확인하고 거리를 둔다',()=>{keeperStoryState.suspicion++;keeperStoryState.stance='independent';keeperBeat([[s.name,'표시된 안전 조건을 다시 확인했다. 보조 장치를 잠그자 경고등이 꺼진다.'],['키퍼',keeperStage()>0?'……제 도움이 없어도 괜찮아진 모양이네요.':'꼼꼼하시네요. 제가 놓친 걸 찾았다고 생각하시나요?']],()=>keeperStoryBase.success(help,risk));}],
  ['왜 위험을 미리 말하지 않았는지 묻는다',()=>{keeperStoryState.suspicion++;keeperStoryState.stance='doubt';keeperBeat([['키퍼','말씀드리면 타지 않으실 것 같아서요. ……걱정하실 것 같아서, 라는 뜻이에요.'],['','그는 안전장치를 고친 뒤 한 걸음 물러난다. 도움은 정확했다. 그 전에 왜 그대로 두었는지는 설명하지 않았다.']],()=>keeperStoryBase.success(help,risk));}]
 ]));
};
function keeperSafeResult3d(help,risk=false){
 close();log(help?'help':'ride-success');if(!s.cleared.has(s.ride)){s.cleared.add(s.ride);s.N++;if(help){s.K++;s.help++;}else{s.I+=2;s.wins++;}}else if(help)s.help++;
 checkExit();const stage=keeperStage();
 const opening=help?'그의 손이 제동 장치를 붙든다. 멎지 않던 진동이 가라앉는다. 그가 이번에는 정말 나를 구했다.':risk?'간신히 안전장치가 맞물린다. 키퍼는 나보다 먼저 숨을 내쉰다.':'표시한 순서대로 기구가 멈췄다. 내 손으로 끝낸 항해다. 키퍼는 잠시 박수치는 것을 잊는다.';
 keeperBeat([['',opening],['키퍼',help?['무사해서 다행이에요. 다음에도 저부터 불러요.','제 손이 없었으면 어쩔 뻔했어요. 이제는 조금 믿어도 되겠죠?','아슬아슬할 때마다 제 이름을 부르네요. 그 목소리가 좋아요.','이렇게 잘 돌아오는데도, 계속 밖으로 가려는군요.'][stage]:['정확해요. 그런데 제 손은 한 번도 찾지 않으셨네요.','혼자서도 잘하시네요. ……기뻐해야 하는 일인데.','제가 필요하지 않아지는 게 이렇게 빠를 줄은 몰랐어요.','당신이 가는 길마다 제가 먼저 있었어요. 잊지 말아요.'][stage]],['',stage>0?'가면의 별에서 번진 붉은색이 목 아래까지 내려와 있다. 전구 빛이 바뀌어도 그 색만은 사라지지 않는다.':'가면의 별 끝에 낯선 붉은 얼룩이 있다. 키퍼가 고개를 돌려 그것을 감춘다.']],()=>say(s.name,'그의 걱정과 원망이 같은 목소리로 들린다.',[
  ['도와준 건 고마워요',()=>safeRideReply('thanks',()=>afterKeeperRide())],
  ['위험한 걸 알고 있었죠?',()=>safeRideReply('doubt',()=>afterKeeperRide())],
  ['다음에는 내 선택을 존중해줘요',()=>safeRideReply('boundary',()=>afterKeeperRide())]
 ]));
}
function safeRideReply(choice,done){
 const key=s.ride+':'+choice,first=!keeperStoryState.responses.has(key);keeperStoryState.responses.add(key);keeperStoryState.stance=choice;log('keeper-response:'+choice);
 if(first){if(choice==='thanks'){s.K++;keeperStoryState.trust++;}else if(choice==='doubt'){s.N++;keeperStoryState.suspicion++;}else{s.I++;keeperStoryState.boundaries++;}}
 const answer=choice==='thanks'?(keeperStage()>0?'고맙다는 말만으로는 부족해지는 날이 올 것 같아요. ……아직은, 그걸로 됐어요.':'그 말은 기억해 둘게요. 다른 곳에 가더라도 저를 잊지 말아요.'):choice==='doubt'?(keeperStage()>0?'알고 있었으면요? 당신을 붙잡은 손도 제 손인데.':'저는 이 공원을 오래 봐 왔어요. 그게 무슨 뜻인지는 너무 깊이 생각하지 마세요.'):(keeperStage()>0?'당신의 선택. 그 말은 꼭 저를 제외하는 것처럼 들리네요.':'그럼요. 다만 위험할 때는 제가 먼저 손을 뻗을 수도 있어요.');
 keeperBeat([['키퍼',answer]],done);
}
function afterKeeperRide(){
 if(s.exit)say(s.name,rides[s.exitRide].name+' 너머에 새벽빛의 문이 나타났다. 키퍼는 문 쪽을 보며 웃음을 멈췄다.',[['출구에서 키퍼와 마주한다',finale],['흔적을 더 살피고 준비한다',()=>hub()]]);
 else hub();
}
const villainHub=hub;
hub=function(text){
 if(keeperStoryState.orientation){keeperOrientationMenu();return;}
 const stage=keeperStage(),line=stage>=2?(keeperStoryState.boundaries?'당신의 선택을 존중해 달라고 했죠. 그러려면, 제가 모르는 곳으로 사라지지는 말아요.':'또 어디로 가려고요? 다음 기구는 제가 골라 드릴까요?'):stage===1?(keeperStoryState.stance==='doubt'?'제가 위험을 알고 있었냐고요. 아직 제 대답이 마음에 들지 않나 봐요.':'아직 제게 물어볼 게 남았죠? 혼자 멀리 가지는 말아요.'):keeperStoryState.dream?'꿈 이야기는 그만하고, 다음 즐거운 일을 찾아볼까요?':text;
 villainHub(line||text);
};
talk=function(){
 if(s.talks>=2){requireRide3d();return;}
 say('키퍼',keeperStage()>0?'무엇이 그렇게 의심스러워요? 듣고 있어요.':'궁금한 게 있나요? 이번에는 무슨 이야기를 할까요?',[
  ['현재 놀이기구',()=>topic('ride')],['출구에 관해',()=>topic('exit')],['키퍼 자신에 관해',()=>topic('keeper')],
  ['사고와 붉은 가면에 관해',keeperSuspicionTopic],['돌아가기',()=>hub()]
 ]);
};
profileReply=function(topicName,text){
 const profile=rideReplies[s.temper]||rideReplies.moderate,replies=profile[topicName],stage=keeperStage();
 let extra=topicName==='exit'?(stage>0?'당신은 문 이야기를 할 때만 목소리가 또렷해지네요.': '다만 출구를 찾으면 저부터 불러요. 혼자 열려고 하지 말고요.'):topicName==='keeper'?'제 이야기를 듣는 동안에는 다른 곳을 보지 말아 주세요.':'안전 표시는 정확해요. ……그 밖의 것은 제가 알아서 할게요.';
 say('키퍼',text+'\n\n'+extra,replies.map(([line],index)=>[line,()=>{
  scoreReply(topicName,index);log('reply:'+s.temper+':'+topicName+':'+index);
  const answer=topicName==='keeper'?(index===1?'그렇게 가까워지고 싶다고 말해 놓고, 나중에 없던 일처럼 하시면 안 돼요.':'저도 무서운 게 있어요. 문이 열리고, 당신이 제 손을 놓는 순간이요.'):topicName==='exit'?(stage>=1?'끝까지 가 보세요. 마지막에 누가 서 있는지도요.':'좋아요. 길의 조각을 모으세요. 당신이 돌아와서 말해 주는 건 제가 들을게요.'):(index===0?'직접 해보고 싶군요. 좋아요. 제가 어디까지 지켜보기만 할 수 있을지…….':'도움이 필요하면 저를 불러요. 그 말은 언제든 들리니까.');
  keeperBeat([[s.name,line],['키퍼',answer]],()=>hub());
 }]));
};
function keeperSuspicionTopic(){
 s.talks++;log('talk:suspicion');
 say('키퍼','아직도 그 꿈을 생각해요? 제 얼굴보다 그쪽이 더 신경 쓰이나요?',[
  ['꿈속의 인형들이 이곳 손님인가요?',()=>keeperSuspicionReply('dolls')],
  ['가면에서 붉은색이 번지고 있어요',()=>keeperSuspicionReply('red')],
  ['도와주려는 건지 해치려는 건지 모르겠어요',()=>keeperSuspicionReply('intent')]
 ]);
}
function keeperSuspicionReply(kind){
 const key='question:'+s.ride+':'+kind;if(!keeperStoryState.responses.has(key)){keeperStoryState.responses.add(key);s.N++;keeperStoryState.suspicion++;}
 const line=kind==='dolls'?(keeperStoryState.dream==='comfort'?'제 곁에 있어 달라고 했잖아요. 그런 꿈보다 지금 잡을 수 있는 손을 믿어요.':'꿈을 확인하려 하지 말라고 했죠. ……그곳에는 다시 가지 마세요.'):kind==='red'?'당신이 기구를 탈 때마다, 제 얼굴부터 보네요. 예전보다 제가 더 잘 보이나요?':'둘 중 하나여야 하나요? 당신이 제게 돌아오는 동안에는, 저는 늘 당신 편인데.';
 keeperBeat([['키퍼',line],[s.name,'그는 질문에 대답하지 않았다. 대신 내가 다음 말을 고를 때까지 꼼짝 않고 기다린다.']],()=>hub());
}
offerHelp=function(){
 keeperStoryBase.offerHelp();$('feedback').textContent=puzzle.failed?'장치가 멈췄다. 키퍼: “그래요. 이제 제 차례죠? 손을 빌려 드릴게요. 강행하면 다칠 수 있어요.”':'키퍼: “아직 혼자 할 수 있을지 모르겠어요? 안전 조건은 그대로예요. 제 도움을 받아도 되고, 다시 풀어도 돼요.”';
};
const keeperEvidence=[
 '찢어진 승차권 뒤에 정지 고리 점검 기록이 있다. 사고 직전 시각 옆에 키퍼의 서명과 「수동 해제」라는 글자가 남아 있다.',
 '관람차 제동 기록. 경고는 고장 전에 이미 켜져 있었다. 관리자의 승인이 있어야 출발할 수 있다는 문장 아래, 익숙한 서명이 있다.',
 '목마 아래 이름표와 좌석 배치표가 겹쳐 있다. 돌아오지 못한 손님의 이름마다 「다음에는 나를 부르게 할 것」이라는 메모가 반복된다.',
 '거울 뒤 계약서: 기억과 길을 되찾은 두 사람은 함께 문을 통과할 수 있다. 「공원은 안내자에게 손님을 해치라고 명령하지 않는다」는 조항이 검게 지워져 있다.',
 '키퍼가 학생일 때 그린 안전한 공원의 설계도. 비상 정지 장치를 보강한 흔적 위로, 훗날 같은 장치를 우회하는 선이 덧그어져 있다.'
];
investigate3d=function(){
 if(!s.clues.has(s.ride)){s.clues.add(s.ride);s.N+=2;s.I++;log('explore');}
 keeperStoryState.evidence.add(s.ride);
 keeperBeat([[s.name,clues[s.ride]],['',keeperEvidence[s.ride]],['키퍼',s.ride===3?'낡은 문서예요. 지워진 문장을 전부 믿지는 마세요.':'그런 것까지 보실 필요는 없었는데. 손에 먼지가 묻었어요. 이리 주세요.']],()=>say(s.name,'그가 기록 위로 손을 뻗는다.',[
  ['기록을 기억하고 직접 보관한다',()=>{keeperStoryState.suspicion++;keeperBeat([['키퍼','……그렇게까지 기억하고 싶다면요. 나중에 저도 물어볼 게 있을 거예요.']],finishKeeperInvestigation);}],
  ['서명을 가리키며 설명을 요구한다',()=>{keeperStoryState.suspicion++;keeperBeat([['키퍼','제 글씨는 맞아요. 하지만 당신이 생각하는 이야기는 아닐 거예요.'],[s.name,'그는 무엇이 다른지는 말하지 않는다. 기록을 본 사실만큼은 지워지지 않는다.']],finishKeeperInvestigation);}]
 ]));
};
function finishKeeperInvestigation(){checkExit();explore3d(s.exit?rides[s.exitRide].name+' 구역에 출구가 나타났습니다. 키퍼가 문 앞에서 기다립니다.':'기록을 확인했습니다. 다른 구역의 흔적도 살펴보세요.');}
finale=function(){
 if(!atExit3d){const p=controls3d[s.exitRide];target3d=[p[0]+4,p[1]+2];explore3d(rides[s.exitRide].name+' 구역의 출구까지 걸어가세요.');return;}
 confronting3d=true;keeperStoryState.confessed=true;target3d=null;sync3d();world3d.faceExit();
 const recall=keeperStoryState.dream==='accuse'?'처음부터 제 손을 보고 있었죠. 그때는 꿈이라고 하면 믿어 줄 줄 알았어요.':keeperStoryState.dream==='comfort'?'그날 제 곁에 있어 달라고 했죠. 저는 그 말이 끝나지 않기를 바랐어요.':'꿈이 아니었다고, 끝까지 생각하고 있었군요. 맞아요. 당신은 정말 그곳을 봤어요.';
 keeperBeat([['','공원은 흑백의 격자로 무너져 있다. 문 앞에 선 키퍼만 단색의 붉은 형체로 남았다. 그가 손을 들자 봉인이 닫힌다.'],['키퍼','여기까지 오면 제가 비켜 줄 거라고 생각했어요?'],['키퍼',recall],['',keeperStoryState.evidence.size?'모아 둔 기록을 펼친다. 서명과 지워진 조항을 본 키퍼는 이번에는 꿈이라는 말을 하지 않는다.':'키퍼의 손목에서 정지 고리 모양의 열쇠가 떨어진다. 첫 배에서 본 바로 그 고리다.'],['키퍼','캡틴 훅은 저절로 고장 난 게 아니에요. 제가 정지 장치를 놓았어요. 다른 기구의 경고도 알고 있었고요.'],['키퍼','무서워지면 저를 부를 줄 알았어요. 제가 구해 주면, 다음에도 제 손을 찾을 줄 알았고요.'],[s.name,'공원의 명령이 아니라, 당신이 선택한 거군요.'],['키퍼','네. 제 선택이에요. 좋아하는 마음까지 거짓은 아니었어요. 그래서 더, 당신이 저 없이 괜찮아지는 걸 견딜 수 없었어요.']],keeperConfessionChoices);
};
function keeperConfessionChoices(){
 say(s.name,'구해 준 손과 위험에 밀어 넣은 손이 같았다.',[
  ['구해 준 것으로 위험을 만든 일이 없어지진 않아요',()=>keeperBeat([['키퍼','알아요. 그런데도 당신이 고맙다고 했던 순간을 자꾸 떠올리게 돼요.'],[s.name,'고마웠던 건 사실이에요. 나가고 싶은 것도 사실이고요.']],keeperFinalChoices)],
  ['좋아한다면 내 선택을 허락해줘요',()=>keeperBeat([['키퍼','허락하면……저를 두고 갈 건가요?'],[s.name,'그건 내가 정해요. 당신을 좋아해도, 여기에 갇혀 있어야 하는 건 아니에요.'],['키퍼','그 말을 제일 듣고 싶지 않았어요.']],keeperFinalChoices)],
  ['꿈이라고 속인 이유도 나를 붙잡으려던 거죠?',()=>keeperBeat([['키퍼','그곳을 본 사람이 돌아온 건 처음이었어요. 당신이 진실을 알면 다시는 웃어 주지 않을까 봐.'],[s.name,'내가 본 것을 지우려 했던 거네요.'],['키퍼','……그랬어요.']],keeperFinalChoices)]
 ]);
}
function keeperFinalChoices(){say(s.name,'키퍼가 길을 막는다. 지금까지 모은 행동과 기억으로 봉인을 넘어야 한다.',[
 ['스스로 찾은 길로 봉인을 푼다',()=>resolve('challenge')],['계약과 키퍼의 기억으로 맞선다',()=>resolve('memory')],['손을 내밀되, 문을 열라고 요구한다',()=>resolve('trust')]
 ]);}
resolve=function(method){
 s.phase='final';log('final:'+method);const win=victory(method);
 keeperBeat([['',win?'내가 찾은 길과 기억이 봉인에 맞물린다. 키퍼가 쥔 문양이 갈라지고, 그의 손이 천천히 내려간다.':'기억의 틈을 봉인이 다시 메운다. 키퍼는 나를 붙잡으려다, 내가 물러서는 것을 보고 손을 멈춘다.'],['키퍼',win?'……문을 열게요. 당신이 저를 용서해서가 아니라, 나가겠다고 했으니까.':'문을 붙잡고 있는 건 저예요. 공원 탓으로 돌리지 않을게요. 그래도 아직, 놓기가 무서워요.']],()=>{
  if(!win){end(chooseEnding(false,'fallback'));return;}
  say(s.name,'문이 열렸다. 그의 잘못을 안 채로, 나는 마지막 선택을 한다.',[
   ['계약을 이어받아 그를 해방한다',()=>finishChoice(true,'release')],['혼자 현실로 돌아간다',()=>finishChoice(true,'alone')],['열린 문을 남겨 둔 채 곁에 머문다',()=>finishChoice(true,'stay')],['책임을 피하지 않겠다는 약속을 받고 함께 나간다',()=>finishChoice(true,'together')]
  ]);
 });
};
// Familiar romantic outcomes now remember his responsibility, including failure routes.
endingData[1][2]='그가 한때 사고로 목숨을 잃었다는 것과, 이후 다른 손님들을 위험에 빠뜨렸다는 것은 별개의 사실이다.\n당신은 계약의 이름을 이어받는다. 그를 용서하는 서명이 아니라, 다음 손님에게 진실을 말하겠다는 서명이다.\n“당신을 위해서만 남는 게 아니에요.”\n가면이 풀린 키퍼는 고개를 숙인다. 남겨진 당신은 가장 먼저 정지 장치와 출구를 연다.';
endingData[2][2]='봉인 너머로 새벽 공기가 들어온다. 키퍼가 마지막으로 손을 내민다. 당신은 그 손을 잡지 않는다.\n“도와준 건 고마워요. 하지만 나를 위험하게 만든 것도 당신이에요.”\n그는 변명하지 못한다. 당신은 혼자 문을 통과한다.\n현실의 벤치에서 눈을 뜬다. 꿈이라 부르기에는 손안의 종이 별이 너무 선명하다. 이번에는 내가 본 것을 믿는다.';
endingData[3][2]='당신은 네버랜드에 남는다. 다정함에 끌렸던 마음과, 그가 만든 위험을 잊지 않은 채로.\n“곁에 있는 것이 용서는 아니에요. 돌아갈 길부터 열어 둬요.”\n키퍼는 웃지 못한 채 정지 장치를 내린다. 문을 여는 데에는 오래 걸린다. 당신은 그것이 열릴 때까지 손을 내주지 않는다.\n불이 꺼진 목마 곁에서 그가 묻는다. “지금은, 손을 잡아도 될까요?”\n아직 대답하지 않는다. 두 사람 사이에는 온기와, 쉽게 지워지지 않을 경계가 함께 남는다.';
endingData[5][2]='기억과 계약의 빈칸이 이어진다. 당신은 문을 막은 손을 잡아당기는 대신, 그가 스스로 펴기를 기다린다.\n“함께 나가도, 당신이 한 일은 없어지지 않아요.”\n“알아요. 다음에는 당신이 멈추라고 하면 멈출게요.”\n두 사람은 열린 문을 통과한다.\n시간이 흐른 뒤, 두 사람의 책상에 안전하게 멈출 수 있는 놀이기구 설계도가 놓인다. 키퍼는 다른 손님들의 이름을 하나씩 기록한다. 책임은 끝나지 않았다. 이제 누구든 떠날 수 있는 문을 만드는 것이 시작이다.';
paradeChoice=function(choice,done){
 log('parade:'+choice);let lines;
 if(choice==='dance'){s.K+=2;s.N++;lines=[[s.name,'그의 손을 잡고 행렬 사이를 돈다. 박자가 끝나도 그는 한 박자 더 나를 붙든다.'],['키퍼','당신이 먼저 손을 내밀었어요. 그건 기억해도 되죠?']];}
 else if(choice==='clap'){s.K++;s.N++;lines=[[s.name,'행렬에 박수를 보낸다. 인형들의 고개는 모두 키퍼 쪽으로 돌아 있다.'],['키퍼','저도 봐 주실래요? 당신이 즐거운지, 여기서 제일 궁금한 건 저니까.']];}
 else{s.I+=2;lines=[[s.name,'행렬 옆을 지나가려 하자 키퍼의 지팡이가 길을 가로지른다. 잠시 뒤에야 비켜난다.'],['키퍼','가세요. 아직은 붙잡지 않을게요.']];}
 keeperBeat(lines,done);
};
// Replace the especially cheerful dice reactions without changing odds or rewards.
const keeperNarrativeSay=say;
say=function(who,text,options){
 const substitutions={
 '와앙, 짝짝짝! 당신이 이겼어요! 함께 노는 게 이렇게 즐거웠네요.':'당신이 이겼어요. 제 앞에서 이렇게 기뻐하는 모습은……더 보고 싶네요.',
 '같은 숫자네요! 무승부도 꽤 귀엽죠?':'같은 숫자네요. 이렇게 같으면, 한 번쯤 여기 머물러도 되지 않을까요?',
 '이번에는 제가 이겼네요. 같이 놀아 줘서 고마워요.':'이번에는 제가 이겼네요. 이긴 사람에게 소원을 들어주는 규칙은……아직 안 정했군요.'
 };
 keeperNarrativeSay(who,substitutions[text]||text,options);
};
const keeperOldPose=poseForLine;
poseForLine=function(who,text){if(who==='키퍼'){
 if(text.includes('꿈을 꾼')||text.includes('제가 정지')||text.includes('제 선택'))return '06';
 if(text.includes('놓기가')||text.includes('견딜 수')||text.includes('제 손을 놓'))return '07';
 if(text.includes('막고')||text.includes('붙잡')||text.includes('허락')||text.includes('이제 제 차례'))return '09';
 if(text.includes('기억해')||text.includes('손을 잡'))return '04';
 }return keeperOldPose(who,text);};
// Start/restart resolves the current global newGame function through the existing UI.

rollDice=function(done){
 const player=1+Math.floor(Math.random()*6),keeper=1+Math.floor(Math.random()*6);log('dice:'+player+':'+keeper);const won=player>keeper;
 if(won){s.K+=2;s.escapeBonus+=2;s.diceWins++;log('dice-win');}
 const result=won?'당신이 이겼어요. 제 앞에서 이렇게 기뻐하는 모습은……더 보고 싶네요.':player===keeper?'같은 숫자네요. 이렇게 같으면, 한 번쯤 여기 머물러도 되지 않을까요?':'이번에는 제가 이겼네요. 이긴 사람에게 소원을 들어주는 규칙은……아직 안 정했군요.';
 modal('<div class="eyebrow">NEVERLAND / DICE</div><h1>두 사람의 주사위</h1><div class="dice-pair"><div><span class="die">'+['','⚀','⚁','⚂','⚃','⚄','⚅'][player]+'</span><p>'+s.name.replace(/[<>&]/g,'')+' · '+player+'</p></div><div><span class="die">'+['','⚀','⚁','⚂','⚃','⚄','⚅'][keeper]+'</span><p>키퍼 · '+keeper+'</p></div></div><p>'+result+'</p><button id="diceContinue">계속 →</button>');
 $('diceContinue').onclick=()=>{close();if(won)showEventArt('diceWin');keeperBeat([['키퍼',result]],done);};
};
