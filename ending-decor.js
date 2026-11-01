'use strict';
// Native star architecture: no ending illustrations or external art dependencies.
window.NEVERLAND_ENDING_DECOR={build(id,g,T){if(id===4)return;
const materials={};const mat=(name,color,glow=false)=>materials[name]||(materials[name]=glow?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.48,metalness:.24}));
const gold=mat('gold',0xbca16c),ink=mat('ink',0x090e20),wood=mat('wood',0x27334c),paper=mat('paper',0xcadbdc),light=mat('light',0xbceaff,true),warm=mat('warm',0xffdda2,true);
const box=(x,y,z,w,h,d,m=gold)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x+w/2,y+h/2,z+d/2);g.add(o);return o;};
const line=(a,b,r=.018,m=gold)=>{const v=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(v);const o=new T.Mesh(new T.CylinderGeometry(r,r,delta.length(),5),m);o.position.copy(v).add(end).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());g.add(o);};
const orb=(x,y,z,r=.055,m=light)=>{const o=new T.Mesh(new T.SphereGeometry(r,8,6),m);o.position.set(x,y,z);g.add(o);return o;};
const ring=(x,y,z,r,m=gold)=>{const o=new T.Mesh(new T.TorusGeometry(r,.018,5,64),m);o.position.set(x,y,z);g.add(o);return o;};
function star(x,y,z,size=.25,m=warm){const shape=new T.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?size*.4:size;const px=Math.cos(a)*r,py=Math.sin(a)*r;i?shape.lineTo(px,py):shape.moveTo(px,py);}shape.closePath();m.side=T.DoubleSide;const o=new T.Mesh(new T.ShapeGeometry(shape),m);o.position.set(x,y,z);g.add(o);return o;}
function sky(w,d,z0){for(let i=0;i<140;i++){const x=Math.sin(i*24.71)*w,y=4+((i*17)%43)/9,z=z0+Math.cos(i*15.13)*d;orb(x,y,z,.018+(i%4)*.009,i%3?light:warm);}for(let row=0;row<4;row++){let prev=null;for(let i=0;i<7;i++){const p=[-w*.8+i*w*.26,5.4+Math.sin(i*1.9+row)*.7,z0-d*.7+row*d*.45];orb(...p,.065);if(prev)line(prev,p,.008,light);prev=p;}}}
function bottle(x,y,z,i){const tint=[0x81b9d8,0xc09be0,0xe0b97d][i%3],glass=materials['glass'+i%3]||(materials['glass'+i%3]=new T.MeshPhysicalMaterial({color:tint,transparent:true,opacity:.25,roughness:.18,metalness:.1,depthWrite:false,side:T.DoubleSide}));const b=new T.Mesh(new T.CylinderGeometry(.13,.19,.52,10),glass);b.position.set(x,y+.3,z);g.add(b);box(x-.085,y+.56,z-.08,.17,.12,.16,gold);orb(x,y+.29,z,.055,i%2?light:warm);star(x,y+.31,z-.04,.075,i%2?light:warm);}
function shelves(side){const x=side*6.6;for(let level=0;level<4;level++){const y=.5+level*.86;box(x-.43,y,-13.7,.86,.08,14,wood);for(let i=0;i<15;i++)bottle(x,y+.08,-13.3+i*.88,i+level);}for(const z of[-13.7,-6.7,.3])box(x-.48,0,z,.08,4,.08,gold);}
if(id===1||id===2){box(-9,-.15,-16,18,.15,24,ink);sky(8,11,-6);shelves(-1);shelves(1);
 for(const side of[-1,1])for(let i=0;i<9;i++){orb(side*3.2,.06,5-i*1.5,.05,warm);line([side*3.2,.04,5-i*1.5],[side*3.2,.04,3.7-i*1.5],.012,gold);}
 for(let i=0;i<7;i++){const z=4-i*2.5;ring(0,3.6,z,2.8);star(0,6.3,z,.25);line([-2.8,3.6,z],[-2.8,.02,z],.025);line([2.8,3.6,z],[2.8,.02,z],.025);}
 if(id===1){ring(0,2.7,-8,2.1);ring(0,2.7,-8,1.65,light);star(0,2.7,-7.95,.8);box(-1.6,0,-1.7,3.2,.08,1.4,gold);for(let i=0;i<9;i++)bottle(-3+i*.75,.1,-4, i);}
 else{for(let i=0;i<5;i++){ring(0,2.1,-6-i*.2,2.55-i*.16,i%2?light:gold);}for(const side of[-1,1])for(let i=0;i<7;i++)star(side*(2.2+i*.25),1.2+i*.6,-6,.13+i*.035);const glow=new T.Mesh(new T.PlaneGeometry(4.2,4.7),new T.MeshBasicMaterial({color:0xffffef,side:T.DoubleSide}));glow.position.set(0,2.1,-6.1);g.add(glow);}
}
if(id===3){sky(7,5,-12);for(const side of[-1,1]){for(let i=0;i<11;i++){const z=-6-i;line([side*5,.1,z],[side*5,3.8,z],.016);star(side*5,3.8+Math.sin(i)*.25,z,.18,i%2?warm:light);}}for(let i=0;i<5;i++){const z=-8-i*1.7;ring(0,3.1,z,3.5,gold);star(0,6.6,z,.25);}for(let i=0;i<20;i++){const a=i/20*Math.PI*2;orb(Math.cos(a)*3,.04,-14+Math.sin(a)*2,.07,warm);}}
if(id===5){box(-17,-.22,-18,34,.22,30,ink);box(-17,0,-18,.2,8,30,wood);box(16.8,0,-18,.2,8,30,wood);box(-17,0,11.8,34,8,.2,wood);box(-17,0,-18,34,8,.2,wood);sky(15,12,-5);g.add(new T.HemisphereLight(0xb3dfff,0x242137,1.5));
 for(let x=-12;x<=12;x+=6){box(x-2,1.7,-17.8,4,4.6,.03,new T.MeshBasicMaterial({color:0x17294a}));for(let i=0;i<12;i++)star(x+Math.sin(i*9)*1.6,2+((i*7)%12)/3,-17.65,.045,light);line([x,1.7,-17.5],[x,6.3,-17.5],.018);}
 function desk(x,z,key=false){box(x-1.3,.88,z-.8,2.6,.12,1.6,wood);for(const dx of[-1.1,1.1])for(const dz of[-.6,.6])box(x+dx-.035,0,z+dz,.07,.9,.07,gold);const sheet=box(x-.65,1.01,z-.45,1.3,.015,.8,paper);if(key)sheet.name=x<0?'campus-sheet-left':'campus-sheet-right';for(let i=0;i<4;i++){line([x-.5,1.035,z-.25+i*.15],[x+.4,1.035,z-.25+i*.15],.006,gold);}box(x-.42,.42,z+1,.84,.1,.7,wood);box(x-.42,.45,z+1.5,.84,.75,.08,wood);for(const dx of[-.34,.34])for(const dz of[.75,1.35])box(x+dx,0,z+dz,.05,.43,.05,gold);line([x+.85,1,z+.35],[x+.85,1.7,z+.35],.018);star(x+.85,1.75,z+.35,.13,light);box(x-.95,1.01,z+.15,.32,.13,.35,gold);}
 desk(-2,-1.5,true);desk(2,-1.5,true);for(const x of[-12,-7,7,12])for(const z of[-12,-7,0,6])desk(x,z);
 for(const side of[-1,1])for(let i=0;i<5;i++){const z=-14+i*5;box(side*15.8-.4,0,z,.8,4,2.8,wood);for(let level=0;level<5;level++){box(side*15.8-.4,.6+level*.65,z,.8,.08,2.8,gold);for(let k=0;k<5;k++)box(side*15.8-.35,.68+level*.65,z-1.1+k*.45,.55,.4,.22,k%2?wood:paper);}}
 for(let i=0;i<4;i++){ring(0,5.8,-13+i*6,2.1);star(0,5.8,-13+i*6,.6);line([0,5.8,-13+i*6],[0,8.3,-13+i*6],.012);}
}

// Merge static decor by material to keep hundreds of stars and bottles inexpensive.
const batches=new Map();for(const o of [...g.children]){if(!o.isMesh||o.name)continue;o.updateMatrix();const src=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();src.applyMatrix4(o.matrix);const key=o.material.uuid;if(!batches.has(key))batches.set(key,{material:o.material,parts:[],objects:[]});batches.get(key).parts.push(src);batches.get(key).objects.push(o);}
for(const b of batches.values()){const geo=new T.BufferGeometry();for(const name of ['position','normal','uv']){if(!b.parts.every(p=>p.attributes[name]))continue;const size=b.parts[0].attributes[name].itemSize,total=b.parts.reduce((n,p)=>n+p.attributes[name].array.length,0),values=new Float32Array(total);let offset=0;for(const p of b.parts){values.set(p.attributes[name].array,offset);offset+=p.attributes[name].array.length;}geo.setAttribute(name,new T.BufferAttribute(values,size));}g.add(new T.Mesh(geo,b.material));for(const o of b.objects){g.remove(o);o.geometry.dispose();}for(const p of b.parts)p.dispose();}
}};

