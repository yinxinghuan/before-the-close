import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const report=[];await fs.mkdir('_qa/ui/platform-art',{recursive:true});
try{for(const [width,height] of [[390,844],[320,568]]){
 const context=await browser.newContext({viewport:{width,height},locale:'en-US'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));
 if(process.env.QA_IMAGE_DELAY)await page.route('**/art/platform-v1/*.png*',async route=>{await new Promise(resolve=>setTimeout(resolve,Number(process.env.QA_IMAGE_DELAY)));await route.continue()});
 await page.goto(process.env.QA_URL||'http://127.0.0.1:5236/?debug=1');
 await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});
 await page.getByRole('button',{name:'Take your badge. Begin.'}).click();await page.locator('.bc-world-loading').waitFor({state:'detached'});await page.waitForTimeout(1200);
 await page.screenshot({path:`_qa/ui/platform-art/platform-layout-start-${width}.png`});
 for(const [direction,key] of [['up','ArrowUp'],['left','ArrowLeft'],['down','ArrowDown'],['right','ArrowRight']]){
  await page.keyboard.down(key);await page.waitForTimeout(200);await page.screenshot({path:`_qa/ui/platform-art/platform-layout-walk-${direction}-${width}.png`});await page.keyboard.up(key);await page.waitForTimeout(100);
 }
 for(const [name,x,y] of [['partner',507,230],['door',562,335]]){
  await page.evaluate(({x,y})=>window.addEventListener('pagehide',()=>{const s=JSON.parse(alteruLocalStorage.getItem('before-the-close'));const j=s.journeys.find(v=>v.id===s.active);j.scene='fund';j.position={x,y};alteruLocalStorage.setItem('before-the-close',JSON.stringify(s))},{once:true}),{x,y});
  await page.reload();await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});await page.locator('.bc-world-loading').waitFor({state:'detached'});await page.waitForTimeout(600);
  await page.screenshot({path:`_qa/ui/platform-art/platform-layout-${name}-${width}.png`});
 }
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(150);await page.keyboard.up('ArrowRight');
 await page.locator('.bc-primary').click();await page.locator('.bc-world-loading').waitFor({state:'detached'});await page.waitForTimeout(300);
 const outbound=await page.locator('.bc-location').innerText();if(!outbound.includes('WORKSPACE'))throw Error('Outbound door failed: '+outbound);
 await page.locator('.bc-primary').click();await page.locator('.bc-world-loading').waitFor({state:'detached'});await page.waitForTimeout(300);
 const inbound=await page.locator('.bc-location').innerText();if(!inbound.includes('NORTHLINE'))throw Error('Return door failed: '+inbound);
 if(errors.length)throw Error('Page errors: '+errors.join('\n'));
 report.push({width,height,errors,outbound,inbound,activeHero:await page.evaluate(()=>document.querySelector('#rpg').__rpgClient.getCurrentPlayer().graphicsSignals()[0].image),images:await page.evaluate(()=>performance.getEntriesByType('resource').filter(e=>e.name.includes('platform-art-20260923')).map(e=>e.name))});await context.close();
}}finally{await browser.close()}
await fs.writeFile('_qa/ui/platform-art/runtime.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
