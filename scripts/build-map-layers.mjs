import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const doorLayout=JSON.parse(await fs.readFile(new URL('../src/door-layout.json',import.meta.url),'utf8'));
const base=process.env.QA_URL||'http://127.0.0.1:5226/';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage();await page.goto(base);await fs.mkdir('public/map',{recursive:true});
 const empty=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=32;return c.toDataURL('image/png')});await fs.writeFile('public/map/empty.png',Buffer.from(empty.split(',')[1],'base64'));
 for(const scene of ['fund','office','records','client']){
  const result=await page.evaluate(async ({scene,doorLayout})=>{
   const load=name=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=`./art/${name}.png`});
   const [floor,wall,windowArt,door,passageArt]=await Promise.all([load(`floor-${scene}-v2`),load('wall'),load('window'),load('door-native'),load('door-threshold-native')]);
   const canvas=()=>{const value=document.createElement('canvas');value.width=value.height=640;return value};
   const layer=canvas(),north=canvas(),side=canvas(),front=canvas();const ctx=layer.getContext('2d'),ng=north.getContext('2d'),sg=side.getContext('2d'),fg=front.getContext('2d');
   const doors=Object.entries(doorLayout).filter(([,d])=>d.room===scene).map(([id,d])=>({id,...d}));const doorLayers={};
   const sideGaps=doors.filter(d=>d.x<60||d.x>580).map(d=>({side:d.x<60?'left':'right',id:d.id,from:d.y-34,to:d.y+34}));
   ctx.fillStyle='#111920';ctx.fillRect(0,0,640,640);ctx.drawImage(floor,34,88,572,488);
   // North: cap, face, trim and short floor shadow.
   ng.drawImage(wall,24,24,592,64);ng.fillStyle='rgba(18,25,29,.38)';ng.fillRect(24,24,592,10);ng.fillStyle='rgba(224,207,174,.10)';ng.fillRect(24,34,592,2);ng.fillStyle='rgba(25,31,33,.30)';ng.fillRect(24,78,592,8);ng.fillStyle='rgba(5,11,14,.22)';ng.fillRect(34,86,572,8);
   if(scene!=='records'&&!doors.some(d=>d.side==='N'))ng.drawImage(windowArt,218,30,204,56);for(const at of doors.filter(d=>d.side==='N')){ng.clearRect(at.x-26,16,52,78);const h=48*door.height/door.width;ng.drawImage(door,at.x-24,88-h,48,h);}
   // Side walls are separately assembled and cover the north corners.
   const drawSide=(x,wallSide)=>{const gaps=sideGaps.filter(g=>g.side===wallSide).sort((a,b)=>a.from-b.from);let cursor=24;for(const gap of [...gaps,{from:576,to:576}]){if(gap.from>cursor){sg.drawImage(wall,64,48,32,110,x,cursor,10,gap.from-cursor);sg.fillStyle='rgba(13,19,22,.35)';sg.fillRect(x,cursor,3,gap.from-cursor);sg.fillStyle='rgba(231,211,174,.14)';sg.fillRect(wallSide==='left'?x+8:x,cursor,2,gap.from-cursor)}if(gap.to>gap.from){
     const cy=(gap.from+gap.to)/2,scale=68/247,px=x+5-passageArt.width*scale/2,py=cy-205.5*scale;
     // Ground and far jamb behind actors; near jamb is a separately sorted event.
     sg.save();sg.beginPath();sg.rect(0,0,640,py+244*scale);sg.clip();sg.drawImage(passageArt,px,py,passageArt.width*scale,passageArt.height*scale);sg.restore();
     // The floor beside the near jamb also stays behind actors.
     sg.drawImage(passageArt,0,244,30,125,px,py+244*scale,30*scale,125*scale);
     sg.drawImage(passageArt,102,244,29,125,px+102*scale,py+244*scale,29*scale,125*scale);
     const near=canvas(),leaf=canvas(),jg=near.getContext('2d'),lg=leaf.getContext('2d');
     jg.drawImage(passageArt,30,244,72,125,px+30*scale,py+244*scale,72*scale,125*scale);
     lg.save();lg.translate(wallSide==='left'?x+54:x-44,cy-22);if(wallSide==='left')lg.scale(-1,1);const h=44*door.height/door.width;lg.drawImage(door,0,-h,44,h);lg.restore();
     doorLayers[`door-${gap.id}-near`]=near.toDataURL('image/png');doorLayers[`door-${gap.id}-leaf`]=leaf.toDataURL('image/png');
    }cursor=Math.max(cursor,gap.to)}};
   drawSide(24,'left');drawSide(606,'right');
   const gap=doors.some(d=>d.y>570)?{from:doors.find(d=>d.side==='S').x-26,to:doors.find(d=>d.side==='S').x+26}:null;
   // South is a foreground layer and therefore covers both lower side-wall ends.
   const drawSouth=(from,to)=>{if(to<=from)return;fg.drawImage(wall,0,0,1024,256,from,548,to-from,92);fg.fillStyle='rgba(12,18,21,.34)';fg.fillRect(from,548,to-from,10);fg.fillStyle='rgba(227,204,170,.13)';fg.fillRect(from,558,to-from,2);fg.fillStyle='rgba(15,22,24,.38)';fg.fillRect(from,616,to-from,10)};
   drawSouth(24,gap?.from??616);if(gap)drawSouth(gap.to,616);if(gap){fg.fillStyle='#252f32';fg.fillRect(gap.from,548,gap.to-gap.from,92);fg.drawImage(door,gap.from+2,548,48,48*door.height/door.width);fg.fillStyle='rgba(117,211,211,.22)';fg.fillRect(323,551,34,4)}
   return {...doorLayers,base:layer.toDataURL('image/png'),north:north.toDataURL('image/png'),side:side.toDataURL('image/png'),front:front.toDataURL('image/png')};
  },{scene,doorLayout});
  for(const [kind,data] of Object.entries(result))await fs.writeFile(`public/map/${scene}-${kind}.png`,Buffer.from(data.split(',')[1],'base64'));
  const tsx=`<?xml version="1.0" encoding="UTF-8"?><tileset version="1.10" tiledversion="1.10.2" name="${scene}" tilewidth="32" tileheight="32" tilecount="1" columns="1"><image source="empty.png" width="32" height="32"/></tileset>`;
  const tmx=`<?xml version="1.0" encoding="UTF-8"?><map version="1.10" tiledversion="1.10.2" orientation="orthogonal" renderorder="right-down" width="20" height="20" tilewidth="32" tileheight="32" infinite="0"><tileset firstgid="1" source="${scene}.tsx"/><layer id="1" name="ground" width="20" height="20"><data encoding="csv">${Array(400).fill(1).join(',')}</data></layer><objectgroup id="2" name="collision"></objectgroup></map>`;await Promise.all([fs.writeFile(`public/map/${scene}.tsx`,tsx),fs.writeFile(`public/map/${scene}.tmx`,tmx)]);
 }
}finally{await browser.close()}
