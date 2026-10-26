// Shared world coordinates: rendering, walking, map and story all use this layout.
window.NEVERLAND_LAYOUT={
 rides:[{id:'captain',name:'캡틴 훅',x:0,z:-24,control:[0,-14],verb:'붉은 레버를 당긴다'},{id:'wheel',name:'별의 관람차',x:23,z:-44,control:[17,-35],verb:'별 모양 손잡이를 돌린다'},{id:'carousel',name:'장미 회전목마',x:-23,z:-44,control:[-17,-35],verb:'오르골 태엽을 감는다'},{id:'mirror',name:'거울 미로',x:-23,z:-5,control:[-16,1],verb:'거울의 각도를 바꾼다'},{id:'tea',name:'달빛 찻잔',x:23,z:-5,control:[16,1],verb:'보라색 찻잔의 손잡이를 돌린다'}],
 clues:[[-5,-16],[30,-34],[-30,-34],[-30,3],[30,3]],
 keepers:[[-3,-8],[13,-32],[-13,-32],[-13,5],[13,5]],
 spawn:{x:0,z:24,yaw:0},entry:[0,13],center:[0,-24],bounds:{minX:-38,maxX:38,minZ:-60,maxZ:28},
 terrain(x,z){const r=Math.hypot(x,z+24);if(r<9.8)return .28;if(r>=9.8&&r<=14.2&&(Math.abs(x)<2.8||Math.abs(z+24)<2.8)){const t=(r-9.8)/4.4;return .28+Math.sin(t*Math.PI)*.55;}return 0;},
 water(x,z){const r=Math.hypot(x,z+24);return r>10&&r<14&&Math.abs(x)>2.7&&Math.abs(z+24)>2.7;},
 colliders(){const c=[],b=(x,z,w,d)=>c.push({a:x-w/2-.2,b:x+w/2+.2,l:z-d/2-.2,r:z+d/2+.2});
  b(0,-24,9,4);for(const x of[-6.6,6.6])b(x,13,2.2,2.2);
  b(-4.5,24,.5,8);b(4.5,24,.5,8);b(0,27.8,9,.4);b(-3,20,3,.4);b(3,20,3,.4);b(-2.8,25,2,3);
  for(const r of this.rides)b(r.control[0],r.control[1],.7,.7);
  for(const x of[-29.6,-16.4])b(x,-6,.3,10);b(-23,-11,13,.3);for(const x of[-27,-23,-19])b(x,-7,.18,5);
  return c;
 }
};
