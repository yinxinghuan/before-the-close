import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const dir='_qa/ui/topic-flow-20260924';await fs.mkdir(dir,{recursive:true});const results=[];
try{for(const [width,height] of [[390,844],[320,568]]){
 const context=await browser.newContext({viewport:{width,height},locale:'en-US',reducedMotion:width===320?'reduce':'no-preference'}),page=await context.newPage();
 await page.route('https://**',r=>r.abort());await page.goto(process.env.QA_URL||'http://127.0.0.1:5239/');await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});
 await page.getByRole('button',{name:'Take your badge. Begin.'}).click();await page.locator('.bc-world-loading').waitFor({state:'detached'});
 assert.ok(await page.locator('.bc-access-targets button').evaluateAll(es=>es.every(e=>getComputedStyle(e,'::after').content==='none')));
 const b=page.locator('[data-entity=partner]');await b.focus();await b.press('Enter');await page.waitForFunction(()=>document.querySelector('.bc-primary').textContent.includes(document.querySelector('[data-entity=partner]').textContent),null,{timeout:20000});
 await page.locator('.bc-primary').click();assert.equal(await page.locator('.bc-introduce').isVisible(),false);await page.getByRole('button',{name:'Introduce yourself'}).click();
 await page.screenshot({path:`${dir}/platform-layout-player-${width}.png`});await page.waitForFunction(()=>document.querySelector('.bc-turn')?.dataset.phase==='reply');assert.equal(await page.locator('.bc-topics').count(),0);
 await page.screenshot({path:`${dir}/platform-layout-reply-${width}.png`});
 while(await page.locator('.bc-turn .bc-solid').count())await page.locator('.bc-turn .bc-solid').click();await page.locator('.bc-topics').waitFor();await page.waitForTimeout(200);
 await page.screenshot({path:`${dir}/platform-layout-choices-${width}.png`});
 const labels=['What do you need from me?','What if the evidence contradicts your view?','How should I present what remains unknown?'];
 for(const [i,label] of labels.entries()){
  await page.getByRole('button',{name:label,exact:true}).click();await page.waitForFunction(()=>document.querySelector('.bc-turn')?.dataset.phase==='reply');
  while(await page.locator('.bc-turn .bc-solid').count())await page.locator('.bc-turn .bc-solid').click();await page.locator('.bc-topics').waitFor();await page.waitForTimeout(200);
  assert.equal(await page.getByRole('button',{name:label,exact:true}).count(),0);await page.screenshot({path:`${dir}/platform-layout-round-${i+1}-${width}.png`});
 }
 await page.reload();await page.locator('.bc-world-loading').waitFor({state:'detached'});await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});await page.locator('[data-entity=partner]').focus();await page.locator('[data-entity=partner]').press('Enter');await page.waitForFunction(()=>document.querySelector('.bc-primary').textContent.includes(document.querySelector('[data-entity=partner]').textContent),null,{timeout:20000});await page.locator('.bc-primary').click();await page.locator('.bc-topics').waitFor();
 for(const label of labels)assert.equal(await page.getByRole('button',{name:label,exact:true}).count(),0);
 await page.getByText('Earlier conversations',{exact:false}).click();assert.ok((await page.locator('.bc-interaction').innerText()).includes(labels[0]));await page.screenshot({path:`${dir}/platform-layout-history-${width}.png`});results.push({width,height,threeRounds:true,reloadNoRepeat:true,historyReadable:true});await context.close();
}}finally{await browser.close()}
await fs.writeFile(`${dir}/report.json`,JSON.stringify(results,null,2));console.log(results);
