import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.QA_URL||'http://127.0.0.1:5226/';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage();await page.goto(base);await fs.mkdir('public/map',{recursive:true});
 const empty=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=32;return c.toDataURL('image/png')});await fs.writeFile('public/map/empty.png',Buffer.from(empty.split(',')[1],'base64'));
 for(const scene of ['fund','office','records','client']){
  const result=await page.evaluate(async scene=>{
   const load=name=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=`./art/${name}.png`});
   const [floor,wall,windowArt,door]=await Promise.all([load(`floor-${scene}-v2`),load('wall'),load('window'),load('door')]);
   const canvas=()=>{const value=document.createElement('canvas');value.width=value.height=640;return value};
   const layer=canvas(),north=canvas(),side=canvas(),front=canvas();const ctx=layer.getContext('2d'),ng=north.getContext('2d'),sg=side.getContext('2d'),fg=front.getContext('2d');
   const doors={fund:[{x:606,y:345}],office:[{x:34,y:430},{x:606,y:320},{x:340,y:596}],records:[{x:34,y:320}],client:[{x:340,y:86}]}[scene];
   const sideGaps=doors.filter(d=>d.x<60||d.x>580).map(d=>({side:d.x<60?'left':'right',from:d.y-34,to:d.y+34}));
   ctx.fillStyle='#111920';ctx.fillRect(0,0,640,640);ctx.drawImage(floor,34,88,572,488);
   // North: cap, face, trim and short floor shadow.
   ng.drawImage(wall,24,24,592,64);ng.fillStyle='rgba(18,25,29,.38)';ng.fillRect(24,24,592,10);ng.fillStyle='rgba(224,207,174,.10)';ng.fillRect(24,34,592,2);ng.fillStyle='rgba(25,31,33,.30)';ng.fillRect(24,78,592,8);ng.fillStyle='rgba(5,11,14,.22)';ng.fillRect(34,86,572,8);
   if(scene!=='records')ng.drawImage(windowArt,218,30,204,56);for(const at of doors.filter(d=>d.y<100))ng.drawImage(door,at.x-31,27,62,62);
   // Side walls are separately assembled and cover the north corners.
   const drawSide=(x,wallSide)=>{const gaps=sideGaps.filter(g=>g.side===wallSide).sort((a,b)=>a.from-b.from);let cursor=24;for(const gap of [...gaps,{from:576,to:576}]){if(gap.from>cursor){for(let y=cursor;y<gap.from;y+=128)sg.drawImage(wall,0,0,64,256,x,y,10,Math.min(128,gap.from-y));sg.fillStyle='rgba(13,19,22,.35)';sg.fillRect(x,cursor,3,gap.from-cursor);sg.fillStyle='rgba(231,211,174,.14)';sg.fillRect(wallSide==='left'?x+8:x,cursor,2,gap.from-cursor)}if(gap.to>gap.from){sg.fillStyle='#252f32';sg.fillRect(x-2,gap.from,14,gap.to-gap.from);sg.fillStyle='#b88455';sg.fillRect(x-2,gap.from,14,4);sg.fillRect(x-2,gap.to-4,14,4)}cursor=Math.max(cursor,gap.to)}};
   drawSide(24,'left');drawSide(606,'right');
   const gap=doors.some(d=>d.y>570)?{from:300,to:380}:null;
   // South is a foreground layer and therefore covers both lower side-wall ends.
   const drawSouth=(from,to)=>{if(to<=from)return;fg.drawImage(wall,0,0,1024,256,from,548,to-from,92);fg.fillStyle='rgba(12,18,21,.34)';fg.fillRect(from,548,to-from,10);fg.fillStyle='rgba(227,204,170,.13)';fg.fillRect(from,558,to-from,2);fg.fillStyle='rgba(15,22,24,.38)';fg.fillRect(from,616,to-from,10)};
   drawSouth(24,gap?.from??616);if(gap)drawSouth(gap.to,616);if(gap){fg.fillStyle='#252f32';fg.fillRect(gap.from,548,gap.to-gap.from,92);fg.drawImage(door,309,552,62,88);fg.fillStyle='rgba(117,211,211,.22)';fg.fillRect(323,551,34,4)}
   return {base:layer.toDataURL('image/png'),north:north.toDataURL('image/png'),side:side.toDataURL('image/png'),front:front.toDataURL('image/png')};
  },scene);
  for(const [kind,data] of Object.entries(result))await fs.writeFile(`public/map/${scene}-${kind}.png`,Buffer.from(data.split(',')[1],'base64'));
  const tsx=`<?xml version="1.0" encoding="UTF-8"?><tileset version="1.10" tiledversion="1.10.2" name="${scene}" tilewidth="32" tileheight="32" tilecount="1" columns="1"><image source="empty.png" width="32" height="32"/></tileset>`;
  const tmx=`<?xml version="1.0" encoding="UTF-8"?><map version="1.10" tiledversion="1.10.2" orientation="orthogonal" renderorder="right-down" width="20" height="20" tilewidth="32" tileheight="32" infinite="0"><tileset firstgid="1" source="${scene}.tsx"/><layer id="1" name="ground" width="20" height="20"><data encoding="csv">${Array(400).fill(1).join(',')}</data></layer><objectgroup id="2" name="collision"></objectgroup></map>`;await Promise.all([fs.writeFile(`public/map/${scene}.tsx`,tsx),fs.writeFile(`public/map/${scene}.tmx`,tmx)]);
 }
}finally{await browser.close()}
