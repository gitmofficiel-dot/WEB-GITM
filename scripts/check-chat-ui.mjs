import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire('C:/Users/mJJGK/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch({channel:'msedge',headless:true});
try {
  for (const viewport of [{width:390,height:844},{width:1440,height:1000}]) {
    const page = await browser.newPage({viewport,serviceWorkers:'block'});
    page.on('pageerror', error => console.log('PAGE ERROR:',error.stack));
    page.setDefaultTimeout(60000);
    await page.addInitScript(() => localStorage.setItem('gitm_chat','broken-json'));
    const answer = 'هذا رد عربي طويل لاختبار ظهور الإجابة كاملة. '.repeat(20) + 'نهاية الاختبار';
    await page.route('**/api/chat/completions', route => route.fulfill({status:200,contentType:'text/event-stream',body:`data: ${JSON.stringify({choices:[{delta:{content:answer}}]})}\n\ndata: [DONE]\n\n`}));
    await page.goto(process.argv[2] || 'http://localhost:4173', {waitUntil:'domcontentloaded'});
    const launcher = page.locator('button[aria-controls="gitm-ai-panel"]');
    await launcher.waitFor({timeout:90000});
    await launcher.click().catch(async error => { await page.screenshot({path:'C:/Users/mJJGK/.codex/attachments/gitm-ai-error.png'}); throw error; });
    const panel = page.locator('#gitm-ai-panel');
    await panel.locator('input[type=text]').fill('مرحبا');
    await panel.locator('button[type=submit]').click();
    await panel.getByText(answer,{exact:true}).waitFor({timeout:15000});
    assert.ok((await panel.innerText()).includes('نهاية الاختبار'));
    const bounds = await panel.boundingBox();
    assert.ok(bounds.x >= -1 && bounds.x + bounds.width <= viewport.width + 1);
    await page.screenshot({path:`C:/Users/mJJGK/.codex/attachments/gitm-ai-${viewport.width}.png`});
    await panel.locator('button[aria-label="إغلاق المساعد"],button[aria-label="Close assistant"]').click();
    assert.equal(await panel.count(),0);
    console.log(`PASS ${viewport.width}px: opens, complete streamed reply, fits viewport, closes`);
    await page.close();
  }
} finally { await browser.close(); }
