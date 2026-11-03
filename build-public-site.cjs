// Copy only browser runtime files; keep source, QA, high-resolution art and credentials out.
const fs=require('node:fs'),path=require('node:path');
const source=__dirname,target=path.resolve(process.argv[2]||path.join(source,'dist'));
fs.mkdirSync(target,{recursive:true});
const html=fs.readFileSync(path.join(source,'index.html'),'utf8');
const runtime=['index.html',...Array.from(html.matchAll(/(?:src|href)="([^"<>]+\.(?:js|css))"/g),m=>m[1])];
for(const file of new Set(runtime)){const destination=path.join(target,file);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(path.join(source,file),destination);}
fs.mkdirSync(path.join(target,'assets'),{recursive:true});
const assets=fs.readdirSync(path.join(source,'assets')).filter(file=>/\.(webp|wav)$/.test(file)||['keeper-campus.png','1d58883c9e687b99069f.png','174bf17bf4ad207648c0.png'].includes(file));
for(const file of assets)fs.copyFileSync(path.join(source,'assets',file),path.join(target,'assets',file));
for(const file of runtime){const content=fs.readFileSync(path.join(source,file),'utf8');for(const match of content.matchAll(/assets\/[A-Za-z0-9_.-]+\.(?:webp|png|wav)/g))if(!fs.existsSync(path.join(target,match[0])))throw Error('Missing asset: '+match[0]);}
console.log('Prepared '+new Set(runtime).size+' runtime files and '+assets.length+' assets.');
