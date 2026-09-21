import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(process.env.QA_URL||'http://127.0.0.1:5225/');
 await page.addStyleTag({content:'#alteru-guest-banner{display:none!important}'});
 await page.getByText('NORTHLINE CAPITAL / CASE 01',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Take your badge. Begin.'}).click();
 await page.locator('.bc-world-loading').waitFor({state:'detached'});
 const partner=page.locator('[data-entity="partner"]');
 await partner.focus();
 await partner.press('Enter');
 await page.waitForFunction(()=>document.querySelector('.bc-primary')?.getAttribute('data-active')==='true'&&document.querySelector('.bc-primary')?.textContent?.includes('Partner by the window'),null,{timeout:20000});
 assert.match(await page.locator('.bc-primary').innerText(),/Partner by the window/);
 await page.locator('.bc-primary').click();
 await page.getByRole('button',{name:'Introduce yourself'}).click();
 await page.waitForTimeout(520);
 assert.match(await page.locator('.bc-interaction').innerText(),/Mara Ellison|Partner by the window/);
 await page.screenshot({path:'_qa/ui/platform-layout-international-conversation-390x844.png'});
 await page.getByRole('button',{name:'Enlarge portrait'}).click();
 await page.locator('.bc-portrait-large').waitFor();
 await page.screenshot({path:'_qa/ui/platform-layout-international-portrait-390x844.png'});
 console.log('International cast, English flow, conversation and portrait rendered.');
}finally{await browser.close()}
