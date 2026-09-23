import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const dir='_qa/ui/interaction-r8.3';await fs.mkdir(dir,{recursive:true});const results=[];
try{for(const [width,height] of [[390,844],[320,568]]){
 const context=await browser.newContext({viewport:{width,height},locale:'en-US',reducedMotion:width===320?'reduce':'no-preference'}),page=await context.newPage();
 await page.route('https://**',r=>r.abort());await page.goto(process.env.QA_URL||'http://127.0.0.1:5236/');await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});
 await page.getByRole('button',{name:'Take your badge. Begin.'}).click();await page.locator('.bc-world-loading').waitFor({state:'detached'});
 assert.ok(await page.locator('.bc-access-targets button').evaluateAll(es=>es.every(e=>getComputedStyle(e,'::after').content==='none')));
 const b=page.locator('[data-entity=partner]');await b.focus();await b.press('Enter');await page.waitForFunction(()=>document.querySelector('.bc-primary').textContent.includes(document.querySelector('[data-entity=partner]').textContent),null,{timeout:20000});
 await page.locator('.bc-primary').click();assert.equal(await page.locator('.bc-introduce').isVisible(),false);await page.getByRole('button',{name:'Introduce yourself'}).click();
 await page.screenshot({path:`${dir}/platform-layout-player-${width}.png`});await page.waitForFunction(()=>document.querySelector('.bc-turn')?.dataset.phase==='reply');assert.equal(await page.locator('.bc-topics').count(),0);
 await page.screenshot({path:`${dir}/platform-layout-reply-${width}.png`});
 while(await page.locator('.bc-turn .bc-solid').count())await page.locator('.bc-turn .bc-solid').click();await page.locator('.bc-topics').waitFor();await page.waitForTimeout(200);
 await page.screenshot({path:`${dir}/platform-layout-choices-${width}.png`});
 await page.locator('.bc-topics>button').first().click();await page.getByRole('button',{name:'Close interaction',exact:true}).click();await page.waitForTimeout(1600);assert.equal(await page.locator('.bc-interaction').count(),0);
 await page.screenshot({path:`${dir}/platform-layout-near-${width}.png`});results.push({width,height,permanentDots:false,readingSequence:true,cancelledReply:true,reducedMotion:width===320});await context.close();
}}finally{await browser.close()}
await fs.writeFile(`${dir}/report.json`,JSON.stringify(results,null,2));console.log(results);
