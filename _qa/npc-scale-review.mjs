import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const base = process.env.QA_URL || 'http://127.0.0.1:5226/';
const reviews = [
  ['partner', 'fund', { x: 508, y: 226 }],
  ['analyst', 'fund', { x: 271, y: 370 }],
  ['founder', 'office', { x: 348, y: 388 }],
  ['finance', 'records', { x: 308, y: 373 }],
  ['client', 'client', { x: 308, y: 373 }],
];

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base);
  await page.getByRole('button', { name: 'Take your badge. Begin.' }).click();
  for (const [person, scene, position] of reviews) {
    await page.evaluate(({ scene, position }) => window.addEventListener('pagehide', () => {
      const store = JSON.parse(alteruLocalStorage.getItem('before-the-close'));
      const journey = store.journeys.find((entry) => entry.id === store.active);
      journey.scene = scene;
      journey.position = position;
      alteruLocalStorage.setItem('before-the-close', JSON.stringify(store));
    }, { once: true }), { scene, position });
    await page.reload();
    await page.addStyleTag({ content: '#alteru-guest-banner{display:none!important}' });
    await page.locator('.bc-world-loading').waitFor({ state: 'detached' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `_qa/ui/platform-layout-npc-scale-${person}-390x844.png` });
  }
  await context.close();
} finally {
  await browser.close();
}
