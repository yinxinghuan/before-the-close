import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const out='_qa/ui/platform-gait';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const report=[];
try{for(const [width,height] of [[390,844],[320,568]]){
 const context=await browser.newContext({viewport:{width,height},locale:'en-US',recordVideo:{dir:out,size:{width,height}}});const page=await context.newPage();
 await page.goto(process.env.QA_URL||'http://127.0.0.1:5236/?debug=1');await page.getByRole('button',{name:'Take your badge. Begin.'}).click();await page.locator('.bc-world-loading').waitFor({state:'detached'});
 for(const [direction,key,x,y] of [['up','ArrowUp',330,410],['down','ArrowDown',330,230],['left','ArrowLeft',520,370],['right','ArrowRight',340,370]]){
  await page.evaluate(({x,y})=>window.addEventListener('pagehide',()=>{const s=JSON.parse(alteruLocalStorage.getItem('before-the-close'));const j=s.journeys.find(v=>v.id===s.active);j.scene='fund';j.position={x,y};alteruLocalStorage.setItem('before-the-close',JSON.stringify(s))},{once:true}),{x,y});
  await page.reload();await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});await page.locator('.bc-world-loading').waitFor({state:'detached'});await page.waitForTimeout(300);
  await page.evaluate(()=>{window.__gait=[];window.__captureGait=true;const tick=()=>{if(!window.__captureGait)return;const p=document.querySelector('#rpg').__rpgClient.getCurrentPlayer();window.__gait.push({at:performance.now(),x:p.x(),y:p.y(),pose:p.animationName(),direction:p.direction()});requestAnimationFrame(tick)};tick()});
  await page.keyboard.down(key);await page.waitForTimeout(1120);await page.keyboard.up(key);await page.waitForTimeout(120);
  const frames=await page.evaluate(()=>{window.__captureGait=false;return window.__gait});
  const moving=frames.filter(f=>f.pose!=='stand'),first=moving[0],last=moving.at(-1);const distance=first&&last?Math.hypot(last.x-first.x,last.y-first.y):0;const transitions=moving.filter((f,i)=>!i||f.pose!==moving[i-1].pose).map(f=>f.pose);
  await page.screenshot({path:`${out}/platform-layout-${direction}-${width}.png`});
  if(distance<104||transitions.length<8)throw Error(`Gait insufficient ${width} ${direction}: ${distance}, ${transitions}`);
  report.push({width,height,direction,distance,transitions,frames});
 }
 const video=page.video();await context.close();await video.saveAs(`${out}/platform-layout-walk-${width}.webm`);
}}finally{await browser.close()}
await fs.writeFile(`${out}/runtime.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(({frames,...r})=>r)));
