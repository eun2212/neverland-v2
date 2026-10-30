// The monochrome route beyond the first accident. No imported image or cutscene.
window.NEVERLAND_FRACTURE={create(h){
 'use strict';
 const {T,scene,mesh,cube,ball,cylinder,beam,torus,curve,batch,keeperSprite}=h;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const uniforms={time:{value:0},full:{value:0},glitch:{value:0}},patched=new WeakSet();
 const checkCode=`vec3 rp=vRealityWorld*.82;float wobble=sin(rp.z*.7+realityTime*.38)*.38+sin(rp.x*.6-realityTime*.24)*.22;vec3 rn=abs(normalize(vRealityNormal));vec2 tile=rn.y>.55?rp.xz:rn.x>rn.z?rp.zy:rp.xy;tile.x+=wobble;float checker=mod(floor(tile.x)+floor(tile.y),2.);vec3 checkerColor=mix(vec3(.008),vec3(.92),checker)*(.62+.38*abs(dot(normalize(vRealityNormal),normalize(vec3(.3,.8,.5)))));float cell=fract(sin(dot(floor(vRealityWorld.xz*.22),vec2(12.9898,78.233))+floor(realityTime*1.5))*43758.5453);float region=smoothstep(.56,.72,cell);float realityMix=max(realityFull,realityGlitch*region);gl_FragColor.rgb=mix(gl_FragColor.rgb,checkerColor,realityMix);`;
 function patchMaterials(){scene.traverse(o=>{
  if(!o.isMesh||o===keeperSprite||o.userData.fracture)return;
  for(const m of(Array.isArray(o.material)?o.material:[o.material])){if(!m||patched.has(m)||m.isShaderMaterial)continue;patched.add(m);const previous=m.onBeforeCompile;
   m.onBeforeCompile=function(shader,renderer){previous?.call(this,shader,renderer);Object.assign(shader.uniforms,{realityTime:uniforms.time,realityFull:uniforms.full,realityGlitch:uniforms.glitch});
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vRealityWorld;varying vec3 vRealityNormal;').replace('#include <project_vertex>','#include <project_vertex>\nvRealityWorld=(modelMatrix*vec4(transformed,1.)).xyz;vRealityNormal=normalize(mat3(modelMatrix)*normal);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vRealityWorld;varying vec3 vRealityNormal;uniform float realityTime;uniform float realityFull;uniform float realityGlitch;').replace('#include <dithering_fragment>','#include <dithering_fragment>\n'+checkCode);
   };m.customProgramCacheKey=()=> 'neverland-reality-checker-v1';m.needsUpdate=true;
  }
 });}
 const grave=new T.Group();grave.name='jointed-doll-graveyard';scene.add(grave);grave.visible=false;
 const white=new T.MeshStandardMaterial({color:'#d8d8d8',roughness:.65,metalness:.13}),black=new T.MeshStandardMaterial({color:'#101014',roughness:.8}),gray=new T.MeshStandardMaterial({color:'#64646b',roughness:.75});
 for(const material of[white,black,gray]){material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat graveGray=dot(gl_FragColor.rgb,vec3(.2126,.7152,.0722));gl_FragColor.rgb=vec3(graveGray);');};material.customProgramCacheKey=()=> 'monochrome-porcelain';}
 const redGlitch=new T.MeshBasicMaterial({color:'#ff100a',toneMapped:false});
 const checker=new T.ShaderMaterial({side:T.DoubleSide,uniforms:{time:uniforms.time},vertexShader:'varying vec3 wp;varying vec3 norm;uniform float time;void main(){vec3 p=position;p.y+=sin(p.x*.32+p.z*.18+time*.4)*.16;vec4 w=modelMatrix*vec4(p,1.);wp=w.xyz;norm=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}',fragmentShader:'varying vec3 wp;varying vec3 norm;uniform float time;void main(){vec3 a=abs(norm);vec2 p=a.y>.5?wp.xz:a.x>a.z?wp.zy:wp.xy;p.x+=sin(p.y*.31+time*.25)*.55;float c=mod(floor(p.x*.8)+floor(p.y*.8),2.);float shade=.38+.62*abs(dot(normalize(norm),normalize(vec3(.3,.85,.4))));gl_FragColor=vec4(mix(vec3(.009),vec3(.83),c)*shade,1.);}'});
 let seed=93;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function doll(x,y,z,scale=1,broken=false,angle=0){const g=new T.Group();grave.add(g);g.position.set(x,y,z);g.scale.setScalar(scale);g.rotation.set(broken?(rand()-.5)*2.2:0,angle,broken?(rand()-.5)*2.4:0);
  const torso=ball(0,1,0,.22,white,g);torso.scale.set(.22,.363,.143);ball(0,.64,0,.17,gray,g);const skull=ball(0,1.66,0,.24,white,g);skull.scale.set(.211,.269,.199);beam([0,1.3,0],[0,1.5,0],.055,gray,g);
  for(const side of[-1,1]){ball(side*.25,1.24,0,.095,gray,g);const elbow=[side*.34,.92,.06],hand=[side*.33,.64,.1];beam([side*.25,1.24,0],elbow,.065,white,g);ball(...elbow,.08,gray,g);if(!broken||rand()>.45){beam(elbow,hand,.05,white,g);ball(...hand,.065,white,g);}const hip=[side*.12,.62,0],knee=[side*.14,.32,broken?.15:0],ankle=[side*.15,.04,broken?.3:0];ball(...hip,.095,gray,g);beam(hip,knee,.08,white,g);ball(...knee,.09,gray,g);if(!broken||rand()>.3){beam(knee,ankle,.055,white,g);ball(...ankle,.06,gray,g);cube(side*.15,-.02,.08,.13,.08,.27,white,g);}
   const eye=ball(side*.075,1.7,.192,.048,black,g);eye.scale.z*=.35;torus(side*.075,1.7,.197,.05,.009,gray,g);
  }curve([[-.07,1.56,.19],[0,1.54,.205],[.07,1.56,.19]],.01,black,g);ball(0,1.64,.208,.023,white,g);curve([[-.12,1.78,.16],[0,1.8,.19],[.12,1.78,.16]],.008,gray,g);
  // Hairline porcelain fracture, with no flesh or gore.
  beam([-.1,1.88,.13],[-.025,1.76,.205],.008,black,g);beam([-.025,1.76,.205],[.035,1.8,.19],.008,black,g);
  return g;
 }
 const floor=cube(0,-.35,-40,110,.3,140,checker,grave);
 // Twisted, widening prosceniums create an impossible-perspective corridor.
 for(let i=0;i<11;i++){const z=-5-i*5.3,w=3.4+i*.68,height=5.4+i*.48,g=new T.Group();grave.add(g);g.position.z=z;g.rotation.z=Math.sin(i*.72)*(.03+i*.008);
  cube(-w,0,0,.24,height,.28,checker,g);cube(w,0,0,.24,height,.28,checker,g);cube(0,height,0,w*2+.3,.25,.28,checker,g);
  beam([-w,.15,0],[-w,height,0],.045,i%2?white:black,g);beam([w,.15,0],[w,height,0],.045,i%2?white:black,g);
 }
 // Sparse broken dolls give way to dense heaps at the end of the route.
 for(let i=0;i<58;i++){const z=-8-rand()*48,x=(i%2?1:-1)*(1.8+rand()*(2+(-z)*.1));doll(x,.04,z,.65+rand()*.65,true,rand()*6.28);}
 const heapCenter=-77;
 for(let i=0;i<230;i++){const angle=rand()*Math.PI*2,r=Math.sqrt(rand())*13.8,x=Math.cos(angle)*r,z=heapCenter+Math.sin(angle)*r*.7,y=.2+Math.max(0,1-r/14)*8.5+rand()*1.8;doll(x,y,z,.7+rand()*.7,true,rand()*6.28);}
 for(let i=0;i<28;i++){const x=(rand()-.5)*29,z=-66-rand()*20;doll(x,.1,z,.8+rand()*.9,false,rand()*.8-.4);}
 // A broken Ferris wheel grows out of articulated arms and porcelain joints.
 const wheel=new T.Group();wheel.position.set(7,10,-79);wheel.rotation.z=.22;grave.add(wheel);
 torus(0,0,0,8.4,.22,white,wheel);torus(0,0,0,7.9,.13,black,wheel);
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2,x=Math.cos(a)*8.2,y=Math.sin(a)*8.2;beam([0,0,0],[x*.52,y*.52,0],.11,white,wheel);ball(x*.52,y*.52,0,.28,gray,wheel);beam([x*.52,y*.52,0],[x,y,0],.12,white,wheel);ball(x,y,0,.3,white,wheel);if(i%3!==0){cube(x,y-1.3,0,1.2,1.25,.9,checker,wheel);}}
 beam([-2,0,-74],[7,10,-79],.28,white,grave);beam([15,0,-77],[7,10,-79],.28,white,grave);
 // A snapped carousel canopy is suspended on strings among giant doll hands.
 const roof=mesh(new T.ConeGeometry(6,3,16,1,true),checker,grave);roof.position.set(-9,9,-76);roof.rotation.z=-.28;
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2,x=-9+Math.cos(a)*4.8,z=-76+Math.sin(a)*4.8;beam([x,3,z],[x,9,z],.055,black,grave);doll(x,3,z,.9,true,i*.7);}
 for(const side of[-1,1]){const g=doll(side*17,0,-79,5,false,-side*.3);g.rotation.z=side*.18;beam([side*17,7.2,-79],[side*5,14,-78],.1,white,grave);ball(side*5,14,-78,.5,gray,grave);}
 const boat=mesh(new T.SphereGeometry(5,20,10,0,Math.PI*2,0,Math.PI/2),checker,grave);boat.position.set(0,8,-77);boat.rotation.z=.5;boat.scale.set(1.4,.5,.5);
 // Broken red scan-lines replace every neon eye and colored ring.
 const glitches=[];function glitch(x,y,z,r,angle=0){const g=new T.Group();grave.add(g);g.position.set(x,y,z);g.userData.originX=x;g.rotation.z=angle;for(let j=0;j<6;j++){const width=r*(.5+rand()*1.9),xx=(rand()-.5)*r*.9;cube(xx,(j-2.5)*r*.3,0,width,r*(.055+rand()*.08),.025,redGlitch,g);}const cut=cube(r*.3,-r*.3,.01,r*.09,r*1.15,.03,redGlitch,g);cut.rotation.z=.25;batch(g);glitches.push(g);}
 for(let i=0;i<18;i++){const z=-17-i*3.3;glitch((i%2?1:-1)*(2.9+i*.22),1.7+rand()*3,z,.25+rand()*.2,(rand()-.5)*.3);}
 for(let i=0;i<16;i++)glitch((rand()-.5)*23,3+rand()*10,-70-rand()*8,.3+rand()*.45,rand()-.5);
 for(let i=0;i<8;i++){const x=(i%2?1:-1)*(3+i*.6),z=-24-i*5;for(let j=0;j<3;j++)cube(x+j*.18,.035,z+j*.16,.9+rand(),.025,.05,redGlitch,grave);}
 batch(grave,glitches);grave.traverse(o=>{if(o.isMesh){o.userData.fracture=true;o.castShadow=false;}});
 const light=new T.PointLight(0xffffff,220,42,1.8);light.position.set(0,7,-66);grave.add(light);const follow=new T.PointLight(0xffffff,38,17,1.7);grave.add(follow);
 const savedFog=scene.fog,graveFog=new T.FogExp2(0x000000,.14);
 const checkerSky=new T.Mesh(new T.SphereGeometry(170,24,16),new T.MeshBasicMaterial({color:0xffffff,side:T.BackSide,fog:false}));checkerSky.visible=false;scene.add(checkerSky);
 let active=false,fullLast=false;const shaderVisibility=new Map();
 return{update(state,t){const p=state.passage;uniforms.time.value=reduced?0:t;uniforms.full.value=!p&&state.config.exit?1:0;uniforms.glitch.value=!p&&!state.config.exit?state.reality.glitch:0;
   patchMaterials();checkerSky.visible=!!uniforms.full.value;grave.visible=!!p;
   scene.traverse(o=>{if(o.isPoints)o.visible=!p&&!state.config.exit;});
   const fullNow=!!uniforms.full.value;if(fullNow!==fullLast){scene.traverse(o=>{if(!o.isMesh||o.userData.fracture||!o.material?.isShaderMaterial)return;if(fullNow){shaderVisibility.set(o,o.visible);o.visible=false;}else if(shaderVisibility.has(o))o.visible=shaderVisibility.get(o);});fullLast=fullNow;}
   if(fullNow)for(const o of shaderVisibility.keys())o.visible=false;
   if(p){if(!active){scene.fog=graveFog;active=true;}graveFog.density=.145*(1-p.progress)**2+.003;follow.position.set(0,2,-p.progress*52-1);for(let i=0;i<glitches.length;i++)glitches[i].position.x=glitches[i].userData.originX+(reduced?0:Math.sin(t*1.25+i*2.1)*.09);}
   else if(active){scene.fog=savedFog;active=false;}
   return p?{vision:p.progress,position:new T.Vector3(0,1.7+Math.max(0,p.progress-.75)*4,-p.progress*52),pitch:0.05,yaw:0}:null;
  },get diagnostics(){return{dolls:325,neonEyes:0,redGlitches:glitches.length,accent:'#ff100a'};}};
}};
