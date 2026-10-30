// One continuous scarlet front spreads from the mask star, shared by every renderer.
window.NEVERLAND_KEEPER_VEINS=(function(){
 const width=192,height=288,cache=new Map();let field=null,textureCanvas=null;
 const origin=[.56,.17];
 function ensure(){if(field)return field;field=new Uint8Array(width*height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const dx=(x/(width-1)-origin[0])*.67,dy=y/(height-1)-origin[1];
   const angle=Math.atan2(dy,dx),distance=Math.hypot(dx,dy);
   // One rough-edged front; no independent islands or secondary origins.
   const edge=1+.055*Math.sin(angle*5)+.025*Math.sin(angle*11);
   const arrival=.035+.965*Math.pow(Math.min(1,distance/(.91*edge)),.74);
   field[y*width+x]=Math.round(Math.min(1,arrival)*255);
  }return field;
 }
 function canvas(){const c=document.createElement('canvas');c.width=width;c.height=height;return c;}
 return{field:ensure,
  texture(T){if(!textureCanvas){textureCanvas=canvas();const ctx=textureCanvas.getContext?.('2d');if(!ctx)return null;const image=ctx.createImageData(width,height),f=ensure();for(let i=0;i<f.length;i++){const j=i*4;image.data[j]=image.data[j+1]=image.data[j+2]=f[i];image.data[j+3]=255;}ctx.putImageData(image,0,0);}const texture=new T.CanvasTexture(textureCanvas);texture.minFilter=T.LinearFilter;texture.magFilter=T.LinearFilter;return texture;},
  maskURL(level){const key=level.toFixed(3);if(cache.has(key))return cache.get(key);const c=canvas(),ctx=c.getContext?.('2d');if(!ctx)return '';const image=ctx.createImageData(width,height),f=ensure();for(let i=0;i<f.length;i++){const j=i*4,amount=level>=.999?1:level<=0?0:Math.max(0,Math.min(1,(level-f[i]/255)/.012+.5));image.data[j]=255;image.data[j+1]=5;image.data[j+2]=2;image.data[j+3]=Math.round(amount*255);}ctx.putImageData(image,0,0);const url=c.toDataURL('image/png');cache.set(key,url);return url;},
  get dimensions(){return[width,height];}
 };
})();
