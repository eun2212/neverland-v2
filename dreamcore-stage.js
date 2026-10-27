// Scenic dressing only: all new ground-level pieces stay outside walking routes.
window.NEVERLAND_DREAM_STAGE=function(h){
 'use strict';
 const {T,scene,stat,mats,mesh,cube,ball,cylinder,beam,torus,curve,bulb,batch}=h;
 const mobile=matchMedia('(pointer:coarse)').matches,reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const stage=new T.Group();stage.name='dreamcore-theatre';stat.add(stage);
 const motion=new T.Group();scene.add(motion);
 const basic=(color)=>new T.MeshBasicMaterial({color,toneMapped:false});
 mats.starLight=basic('#ffe69a');mats.coralLight=basic('#ff737d');mats.blueLight=basic('#99c8ff');
 // Woven velvet and celestial brocade give the large surfaces detail up close.
 const fabric=document.createElement('canvas');fabric.width=fabric.height=256;const ink=fabric.getContext('2d');ink.fillStyle='#fff';ink.fillRect(0,0,256,256);
 for(let y=0;y<256;y+=2){ink.fillStyle=y%4?'#e4cbb5':'#f2e2d2';ink.fillRect(0,y,256,1);}for(let x=0;x<256;x+=3){ink.fillStyle='#42304a12';ink.fillRect(x,0,1,256);}
 const textile=new T.CanvasTexture(fabric);textile.wrapS=textile.wrapT=T.RepeatWrapping;textile.repeat.set(3,3);textile.colorSpace=T.SRGBColorSpace;
 mats.red.map=textile;mats.green.map=textile;
 mats.velvet=new T.MeshStandardMaterial({color:'#691d37',roughness:.87,side:T.DoubleSide,map:textile});
 mats.nightTrim=new T.MeshStandardMaterial({color:'#152644',metalness:.35,roughness:.4});
 function star(x,y,z,r,m='starLight',p=stage,points=4){
  const s=new T.Shape();for(let i=0;i<points*2;i++){const a=i/points*Math.PI+Math.PI/2,rr=i%2?r*.29:r;if(i===0)s.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else s.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}s.closePath();
  const o=mesh(new T.ExtrudeGeometry(s,{depth:.06,bevelEnabled:false}),m,p);o.position.set(x,y,z);o.castShadow=false;return o;
 }
 function moon(x,y,z,r,p=stage){const s=new T.Shape();s.absarc(0,0,r,.25*Math.PI,1.75*Math.PI,false);s.quadraticCurveTo(-r*.15,0,r*Math.cos(.25*Math.PI),r*Math.sin(.25*Math.PI));const o=mesh(new T.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false}),'starLight',p);o.position.set(x,y,z);o.rotation.z=-.25;return o;}
 function bulbsAlong(points,n=60,p=stage){const c=new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a)));curve(points,.025,'gold',p);for(let i=0;i<=n;i++){const v=c.getPoint(i/n);bulb(v.x,v.y,v.z,.075,p);}}
 function curtain(x,z,w,height,p=stage){
  const g=new T.PlaneGeometry(w,height,32,12),pos=g.attributes.position;
  for(let i=0;i<pos.count;i++){const xx=pos.getX(i),yy=pos.getY(i),v=(yy+height/2)/height;pos.setZ(i,Math.sin(xx/w*Math.PI*12)*.3*(.4+.6*v));pos.setX(i,xx*(.73+.27*v));}g.computeVertexNormals();
  const o=mesh(g,'velvet',p);o.position.set(x,height/2+.6,z);o.castShadow=false;
  curve([[x-w*.5,height+.6,z],[x,height+.15,z-.1],[x+w*.5,height+.6,z]],.08,'gold',p);
  for(let i=0;i<7;i++){const xx=x+(i/6-.5)*w*.75;beam([xx,.6,z],[xx,.22,z],.035,'gold',p);ball(xx,.2,z,.085,'gold',p);}
  torus(x,height*.42,z+.15,w*.35,.065,'gold',p);
 }
 // A black firmament with separate pin-point and cross-shaped stars.
 let seed=1027;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const starPositions=[],starColors=[];for(let i=0;i<(mobile?650:1150);i++){const a=random()*Math.PI*2,e=.08+random()*1.44,r=145;starPositions.push(Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r-20);const c=new T.Color(i%9===0?'#b0c6ff':i%7===0?'#ffd49d':'#e9e9ff');starColors.push(c.r,c.g,c.b);}
 const starsGeo=new T.BufferGeometry();starsGeo.setAttribute('position',new T.Float32BufferAttribute(starPositions,3));starsGeo.setAttribute('color',new T.Float32BufferAttribute(starColors,3));
 const stars=new T.Points(starsGeo,new T.PointsMaterial({size:mobile?.32:.25,vertexColors:true,sizeAttenuation:true,toneMapped:false,fog:false}));scene.add(stars);
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2,r=90,y=25+random()*50;const o=star(Math.cos(a)*r,y,Math.sin(a)*r-20,.22+random()*.35,i%5?'starLight':'blueLight',motion);o.lookAt(0,8,-20);}
 // Back-of-stage moon, ribbons, tiered clouds, and gilt proscenium.
 moon(-9,27,-65,5.2);star(1,32,-66,2.1);star(13,26,-65,1.2,'coralLight');
 for(const side of[-1,1]){
  const x=side*39;beam([x,0,-62],[x,27,-62],.35,'green',stage);beam([x-side*.6,0,-61.8],[x-side*.6,27,-61.8],.09,'gold',stage);
  curtain(x-side*3,-62,6,23);star(x,28,-62,1.4);
  for(let i=0;i<4;i++){const xx=side*(18+i*6);curve([[xx-4,2+i*.4,-63],[xx-2,5+i*.5,-63],[xx,5.8+i*.5,-63],[xx+2,4.5+i*.5,-63],[xx+4,3+i*.4,-63]],.65,'nightTrim',stage);}
 }
 bulbsAlong([[-39,27,-62],[-20,32,-64],[0,34,-65],[20,32,-64],[39,27,-62]],100);
 // Real scalloped valances hang across the rear proscenium, edged with tassels.
 for(let i=0;i<8;i++){const x=-35+i*10,s=new T.Shape();s.moveTo(-5,0);s.lineTo(5,0);s.quadraticCurveTo(4,-3,0,-3.4);s.quadraticCurveTo(-4,-3,-5,0);const o=mesh(new T.ShapeGeometry(s,20),'velvet',stage);o.position.set(x,29.5,-63);curve([[x-5,29.4,-62.8],[x,26.2,-62.8],[x+5,29.4,-62.8]],.07,'gold',stage);beam([x,26.2,-62.8],[x,25.6,-62.8],.04,'gold',stage);ball(x,25.5,-62.8,.13,'gold',stage);}
 for(let i=0;i<7;i++){const x=-27+i*9,y=29-Math.abs(x)*.12;beam([x,y+3,-62],[x,y,-62],.018,'gold',stage);star(x,y,-62,.55+i%2*.25,i%2?'starLight':'coralLight');}
 // Entrance acts as the opening of a jewel-box theatre; nothing blocks its center.
 for(const side of[-1,1]){curtain(side*10,16,5,10);beam([side*12.8,0,16],[side*12.8,12,16],.22,'green',stage);star(side*12.8,12.5,16,.7);}
 bulbsAlong([[-13,11,16],[-7,13,16],[0,14,16],[7,13,16],[13,11,16]],65);star(0,14.7,16,1.05);moon(0,12,16,1);
 // Each attraction gets its own suspended stage crown and luminous apron.
 const crowns=[{x:0,z:-24,r:8,y:15},{x:-23,z:-44,r:8,y:11},{x:23,z:-44,r:10,y:24},{x:-23,z:-5,r:8,y:10},{x:23,z:-5,r:8,y:9}];
 for(let j=0;j<crowns.length;j++){
  const a=crowns[j];torus(a.x,a.y,a.z,a.r,.07,'gold',stage,true);
  for(let i=0;i<32;i++){const angle=i/32*Math.PI*2,x=a.x+Math.cos(angle)*a.r,z=a.z+Math.sin(angle)*a.r;bulb(x,a.y,z,.09,stage);if(i%4===0){beam([x,a.y,z],[x,a.y-1.2,z],.015,'gold',stage);star(x,a.y-1.5,z,.4,i%8?'coralLight':'starLight');}}
  star(a.x,a.y+1,a.z,a.r*.16);if(j!==2)moon(a.x+2,a.y-.1,a.z,1.1);
  for(const r of[a.r+.7,a.r+1])torus(a.x,.065,a.z,r,.035,j%2?'blueLight':'starLight',stage,true);
 }
 // Scalloped festoons overhead, with hanging stars at walking scale.
 for(const z of[5,-18,-39,-54]){
  const line=[[-34,7.8,z],[-17,6.8,z],[0,8.7,z],[17,6.8,z],[34,7.8,z]];bulbsAlong(line,80);
  for(let i=0;i<9;i++){const x=-30+i*7.5,y=6.7+Math.cos(x*.1)*.5;beam([x,y+.7,z],[x,y-.3,z],.012,'gold',stage);star(x,y-.6,z,.28,i%3===0?'coralLight':'starLight');}
 }
 // Jewel lighting on the lagoon and the main promenade, visible against the dark lawn.
 torus(0,.09,-24,10.08,.045,'blueLight',stage,true);torus(0,.08,-24,13.95,.045,'starLight',stage,true);
 for(const side of[-1,1]){
  curve([[side*3.5,.08,19],[side*3.5,.08,8],[side*4,.08,-8]],.028,'starLight',stage);
  for(let z=10;z>=-52;z-=7){star(side*34,4.5,z,.38,'starLight');bulb(side*34,.25,z,.14,stage);}
 }
 // Raised gilt medallions and crimson/emerald diamonds decorate the promenade.
 for(const z of[10,4,-2,-8]){const o=star(0,.055,z,.8,'gold',stage,8);o.rotation.x=-Math.PI/2;for(const side of[-1,1]){const d=cube(side*2.3,.025,z,.65,.025,.65,z%4?'green':'red',stage);d.rotation.y=Math.PI/4;}}
 // Scenic plinths with constellation globes at the four outer corners.
 for(const [x,z]of[[-34,12],[34,12],[-34,-55],[34,-55]]){cylinder(x,0,z,.85,.25,'green',stage);cylinder(x,.25,z,.65,.5,'gold',stage);cylinder(x,.75,z,.45,1.3,'green',stage);torus(x,2.7,z,.9,.035,'gold',stage);torus(x,2.7,z,.9,.035,'gold',stage,true);star(x,2.7,z,.55);bulb(x,3.7,z,.1,stage);}
 // Soft translucent theatrical shafts: limited count and no extra shadow lights.
 const beamMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{color:{value:new T.Color('#f7c675')}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform vec3 color;void main(){float edge=pow(max(0.,1.-abs(v.x-.5)*2.),2.);gl_FragColor=vec4(color,edge*.045*pow(1.-v.y,.65));}'});
 const shafts=[];for(const [i,a]of crowns.entries()){const g=new T.Group();g.position.set(a.x,a.y+5,a.z);motion.add(g);const cone=new T.Mesh(new T.ConeGeometry(a.r*.8,a.y+5,24,1,true),beamMat);cone.position.y=-(a.y+5)/2;g.add(cone);shafts.push(g);const light=new T.PointLight(i%2?0x8bb9ef:0xffca70,95,26,2);light.position.set(a.x,5,a.z);motion.add(light);}
 // Floating confetti uses one draw call; muted sizes retain a clear path view.
 const dustPos=[];for(let i=0;i<180;i++)dustPos.push((random()-.5)*70,2+random()*14,random()*75-57);
 const dustGeo=new T.BufferGeometry();dustGeo.setAttribute('position',new T.Float32BufferAttribute(dustPos,3));
 const dust=new T.Points(dustGeo,new T.PointsMaterial({color:'#ffe5a1',size:.045,transparent:true,opacity:.68,depthWrite:false,blending:T.AdditiveBlending}));motion.add(dust);
 batch(stage);
 return{update(t,inside){motion.visible=!inside;stars.visible=true;if(!reduced){shafts.forEach((g,i)=>{g.rotation.z=Math.sin(t*.14+i)*.045;});dust.position.y=Math.sin(t*.2)*.25;}}};
};
