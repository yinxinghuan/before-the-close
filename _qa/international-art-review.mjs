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
 await page.keyboard.down('ArrowUp');
 await page.waitForTimeout(2800);
 await page.keyboard.up('ArrowUp');
 await page.keyboard.down('ArrowRight');
 await page.waitForTimeout(1900);
 await page.keyboard.up('ArrowRight');
 await page.waitForTimeout(300);
 const primaryText=await page.locator('.bc-primary').innerText();
 if(!primaryText.includes('Partner by the window')){
  console.log(JSON.stringify({primaryText,save:await page.evaluate(()=>alteruLocalStorage.getItem('before-the-close'))}));
 }
 assert.match(primaryText,/Partner by the window/);
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
