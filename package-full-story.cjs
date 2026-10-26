const fs=require('node:fs'),path=require('node:path');
const root=__dirname,out=path.join(root,'..','outputs');fs.mkdirSync(out,{recursive:true});
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="full-story.css">',()=>'<style>'+fs.readFileSync(path.join(root,'full-story.css'),'utf8')+'</style>');
html=html.replace('<link rel="stylesheet" href="position-map.css">',()=>'<style>'+fs.readFileSync(path.join(root,'position-map.css'),'utf8')+'</style>');
html=html.replace('<link rel="stylesheet" href="carnival-scene.css">',()=>'<style>'+fs.readFileSync(path.join(root,'carnival-scene.css'),'utf8')+'</style>');
for(const file of ['carnival-layout.js','ride-interiors.js','vendor/three.min.js','world.js','ride-interior-scenes.js','carnival-scene.js','story-core.js','story-3d.js']){
 const script=fs.readFileSync(path.join(root,file),'utf8').replace(/<\/script/gi,'<\\/script');
 html=html.replace('<script src="'+file+'"></script>',()=>'<script>'+script+'</script>');
}
const assets=new Map();
html=html.replace(/assets\/[A-Za-z0-9_.-]+\.(?:webp|png|jpg|svg)/g,file=>{
 if(!assets.has(file)){const mime=({'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)];assets.set(file,'data:'+mime+';base64,'+fs.readFileSync(path.join(root,file)).toString('base64'));}
 return assets.get(file);
});
if(/(?:src|href)="(?:assets\/|(?:world|story-).*\.js|full-story\.css)/.test(html))throw Error('Unbundled resource');
fs.writeFileSync(path.join(root,'play-full-story.html'),html);
fs.writeFileSync(path.join(out,'neverland-v2-full-story-play.html'),html);
console.log('Packaged offline full-story 3D game with '+assets.size+' embedded images.');
