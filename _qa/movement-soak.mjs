import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:Number(process.env.QA_WIDTH||390),height:Number(process.env.QA_HEIGHT||844)},deviceScaleFactor:3,locale:'en-US',hasTouch:true,isMobile:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.goto(process.env.QA_URL||'http://127.0.0.1:5236/?debug=1');
await page.getByRole('button',{name:'Take your badge. Begin.'}).click();await page.locator('.bc-world-loading').waitFor({state:'detached'});
const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');if(process.env.QA_CPU)await cdp.send('Emulation.setCPUThrottlingRate',{rate:Number(process.env.QA_CPU)});
await page.evaluate(()=>{window.__soak=[];window.__running=true;let last=performance.now();function frame(now){if(!window.__running)return;const p=document.querySelector('#rpg').__rpgClient.getCurrentPlayer();window.__soak.push({dt:now-last,x:p.x(),y:p.y(),queued:p.frames?.length});last=now;requestAnimationFrame(frame)}requestAnimationFrame(frame)});
if(process.env.QA_PROFILE){await cdp.send('Profiler.enable');await cdp.send('Profiler.start')}
const samples=[];
const stick=await page.locator('.bc-stick').boundingBox();
async function move(right){
 if(process.env.QA_INPUT==='touch'){
  const x=stick.x+stick.width/2,y=stick.y+stick.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let tick=0;tick<17;tick++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(right?25:-25),y:y+Math.sin(tick)*2}]});await page.waitForTimeout(50)}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }else{const key=right?'ArrowRight':'ArrowLeft';await page.keyboard.down(key);await page.waitForTimeout(850);await page.keyboard.up(key)}
}

for(let block=0;block<Number(process.env.QA_BLOCKS||6);block++){
 for(let i=0;i<5;i++){await move(true);await move(false)}
 if(process.env.QA_GC==='1')await cdp.send('HeapProfiler.collectGarbage');
 const perf=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
 const sample=await page.evaluate(()=>{const frames=window.__soak.splice(0),times=frames.map(f=>f.dt).sort((a,b)=>a-b);return {frames:frames.length,p50:times[Math.floor(times.length*.5)],p95:times[Math.floor(times.length*.95)],max:Math.max(...times),stalls:times.filter(t=>t>40).length,travel:frames.reduce((n,f,i)=>n+(i?Math.hypot(f.x-frames[i-1].x,f.y-frames[i-1].y):0),0),queued:Math.max(...frames.map(f=>f.queued||0))}});
 samples.push({block,...sample,perf});console.log(JSON.stringify(samples.at(-1)));
}
await page.evaluate(()=>{window.__running=false});
await page.waitForTimeout(200);const stoppedAt=await page.evaluate(()=>{const p=document.querySelector('#rpg').__rpgClient.getCurrentPlayer();return{x:p.x(),y:p.y()}});await page.waitForTimeout(200);const released=await page.evaluate(()=>{const p=document.querySelector('#rpg').__rpgClient.getCurrentPlayer();return{x:p.x(),y:p.y(),pose:p.animationName(),knob:document.querySelector('.bc-stick__knob').style.transform}});
const failures=[];
if(errors.length)failures.push('page errors');
if(samples.some(s=>s.travel<100))failures.push('not enough actual movement');
if(Math.hypot(released.x-stoppedAt.x,released.y-stoppedAt.y)>1||released.pose!=='stand')failures.push('input release did not stop movement');
if(samples.at(-1).perf.Nodes>samples[0].perf.Nodes+64)failures.push('DOM nodes grew continuously');
if(samples.at(-1).perf.JSEventListeners>samples[0].perf.JSEventListeners+64)failures.push('event listeners grew continuously');
if(samples.at(-1).p95>Math.max(33.4,samples[0].p95*1.5))failures.push('tail frame pacing degraded');

if(process.env.QA_PROFILE){const {profile}=await cdp.send('Profiler.stop');await fs.mkdir('_qa/performance',{recursive:true});await fs.writeFile('_qa/performance/movement.cpuprofile',JSON.stringify(profile));const ranked=profile.nodes.filter(n=>n.hitCount).sort((a,b)=>b.hitCount-a.hitCount).slice(0,25).map(n=>({hits:n.hitCount,...n.callFrame}));console.log(JSON.stringify({hot:ranked}))}
await fs.mkdir('_qa/performance',{recursive:true});await fs.writeFile(`_qa/performance/${process.env.QA_LABEL||'before'}.json`,JSON.stringify({environment:{url:process.env.QA_URL||'http://127.0.0.1:5236/?debug=1',cpu:Number(process.env.QA_CPU||1),input:process.env.QA_INPUT||'keyboard',width:Number(process.env.QA_WIDTH||390),height:Number(process.env.QA_HEIGHT||844),forcedGC:process.env.QA_GC==='1'},samples,errors,released,failures},null,2));
if(failures.length)throw Error(failures.join('; '));
}finally{await browser.close()}
