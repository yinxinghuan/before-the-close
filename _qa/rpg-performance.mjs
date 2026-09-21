import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.QA_URL||'http://127.0.0.1:5225/';
try{
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3});
 const page=await context.newPage();await page.route('https://**',route=>route.abort());
 await page.addInitScript(()=>{window.__qaFrameTimes=[];window.__qaDrawImages=0;const draw=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(...args){window.__qaDrawImages++;return draw.apply(this,args)};let last=performance.now();const sample=now=>{window.__qaFrameTimes.push(now-last);last=now;requestAnimationFrame(sample)};requestAnimationFrame(sample)});
 await page.goto(new URL('?debug=1',base).href);await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});await page.getByRole('button',{name:'Take your badge. Begin.'}).click();await page.locator('.bc-world-loading').waitFor({state:'detached'});await page.waitForTimeout(500);
 const before=await page.evaluate(()=>{const p=document.querySelector('#rpg').__rpgClient.getCurrentPlayer();window.__qaFrameTimes=[];window.__qaDrawImages=0;return{x:p.x(),y:p.y()}});
 await page.keyboard.down('ArrowUp');await page.waitForTimeout(2500);await page.keyboard.up('ArrowUp');await page.waitForTimeout(250);
 const result=await page.evaluate(()=>{const p=document.querySelector('#rpg').__rpgClient.getCurrentPlayer(),frames=window.__qaFrameTimes.slice(3).sort((a,b)=>a-b),at=q=>frames[Math.min(frames.length-1,Math.floor(frames.length*q))];return{after:{x:p.x(),y:p.y()},samples:frames.length,p50:at(.5),p95:at(.95),max:at(1),drawImages:window.__qaDrawImages}});
 assert.ok(result.after.y<before.y-100,JSON.stringify({before,result}));assert.ok(result.samples>100,JSON.stringify(result));assert.ok(result.p95<40,JSON.stringify(result));assert.equal(result.drawImages,0,JSON.stringify(result));console.log(JSON.stringify({before,...result}));
 await context.close();
}finally{await browser.close()}
