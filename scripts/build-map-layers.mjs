import fs from 'node:fs/promises';
import {chromium} from 'playwright';

const base=process.env.QA_URL||'http://127.0.0.1:5226/';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage();
 await page.goto(base);
 await fs.mkdir('public/map',{recursive:true});
 const empty=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;return canvas.toDataURL('image/png')});
 await fs.writeFile('public/map/empty.png',Buffer.from(empty.split(',')[1],'base64'));
 for(const scene of ['fund','office','records','client']){
  const result=await page.evaluate(async scene=>{
   const load=name=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=`./art/${name}.png`});
   const [floor,wall,windowArt,door]=await Promise.all([load(`floor-${scene}-v2`),load('wall'),load('window'),load('door')]);
   const layer=document.createElement('canvas');layer.width=640;layer.height=640;const ctx=layer.getContext('2d');
   ctx.drawImage(floor,0,0,640,640);
   for(let x=0;x<640;x+=320)ctx.drawImage(wall,x,0,320,80);
   if(scene!=='records')ctx.drawImage(windowArt,204,5,156,72);
   for(let y=0;y<640;y+=128){ctx.drawImage(wall,0,0,64,256,0,y,32,128);ctx.drawImage(wall,0,0,64,256,608,y,32,128)}
   const doors={fund:[{x:606,y:345}],office:[{x:32,y:430},{x:606,y:320},{x:340,y:596}],records:[{x:32,y:320}],client:[{x:340,y:86}]}[scene];
   for(const at of doors){
    if(at.y<100)ctx.drawImage(door,at.x-39*door.naturalWidth/door.naturalHeight,10,78*door.naturalWidth/door.naturalHeight,78);
    else if(at.x<60||at.x>580){ctx.drawImage(floor,0,0,128,128,at.x-18,at.y-28,36,56);const sw=door.naturalWidth,sh=door.naturalHeight;ctx.drawImage(door,sw*.05,sh*.88,sw*.9,sh*.06,at.x-17,at.y-29,34,5);ctx.drawImage(door,sw*.05,sh*.88,sw*.9,sh*.06,at.x-17,at.y+25,34,5)}
   }
   const front=document.createElement('canvas');front.width=640;front.height=640;const fg=front.getContext('2d');
   fg.fillStyle='#35464b';fg.fillRect(0,603,640,37);for(let x=0;x<640;x+=320)fg.drawImage(wall,x,603,320,80);
   for(const at of doors.filter(d=>d.y>570)){fg.drawImage(floor,0,0,128,128,at.x-30,588,60,52);fg.drawImage(door,at.x-39*door.naturalWidth/door.naturalHeight,596,78*door.naturalWidth/door.naturalHeight,78)}
   return {base:layer.toDataURL('image/png'),front:front.toDataURL('image/png')};
  },scene);
  for(const [kind,data] of Object.entries(result))await fs.writeFile(`public/map/${scene}-${kind}.png`,Buffer.from(data.split(',')[1],'base64'));
  const tsx=`<?xml version="1.0" encoding="UTF-8"?><tileset version="1.10" tiledversion="1.10.2" name="${scene}" tilewidth="32" tileheight="32" tilecount="1" columns="1"><image source="empty.png" width="32" height="32"/></tileset>`;
  const tmx=`<?xml version="1.0" encoding="UTF-8"?><map version="1.10" tiledversion="1.10.2" orientation="orthogonal" renderorder="right-down" width="20" height="20" tilewidth="32" tileheight="32" infinite="0"><tileset firstgid="1" source="${scene}.tsx"/><layer id="1" name="ground" width="20" height="20"><data encoding="csv">${Array(400).fill(1).join(',')}</data></layer><objectgroup id="2" name="collision"></objectgroup></map>`;
  await Promise.all([fs.writeFile(`public/map/${scene}.tsx`,tsx),fs.writeFile(`public/map/${scene}.tmx`,tmx)]);
 }
}finally{await browser.close()}
