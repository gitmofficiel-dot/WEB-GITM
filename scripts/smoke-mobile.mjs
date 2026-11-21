#!/usr/bin/env node
import { spawn } from 'node:child_process';

const PORT = Number(process.env.SMOKE_PORT || 4173);
const BASE_URL = (process.env.BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/+$/, '');
const STRICT_LAYOUT = process.argv.includes('--strict-layout');
const VIEWPORT = { width: 375, height: 812 };

const ROUTES = [
  '/',
  '/about-us',
  '/projects-hub',
  '/academy',
  '/events',
  '/news',
  '/gallery',
  '/archive',
  '/verify-certificate',
  '/contact',
  '/login',
  '/register',
  '/forgot-password',
  '/projects',
  '/hardware-request',
  '/virtual-lab',
  '/collab-board',
  '/hackathon-arena',
  '/digital-twin',
  '/architecture-builder',
  '/talent-hub',
  '/methodology',
  '/privacy-policy',
  '/terms-of-service',
];

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Preview server did not start within ${timeoutMs}ms at ${url}`);
}

function startPreviewServer() {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const child = spawn(cmd, ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    stdio: 'pipe',
  });
  child.stderr.on('data', (chunk) => {
    const msg = chunk.toString().trim();
    if (msg) console.error(`[vite preview] ${msg}`);
  });
  return child;
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('Playwright is not installed. Run: npm install --no-save playwright && npx playwright install chromium');
    process.exit(1);
  }

  let serverProc = null;
  if (!process.env.BASE_URL) {
    serverProc = startPreviewServer();
    await waitForServer(BASE_URL);
  }

  let browser;
  const failures = [];
  const warnings = [];

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: VIEWPORT,
      isMobile: true,
      hasTouch: true,
      locale: 'ar-MA',
    });

    for (const route of ROUTES) {
      const page = await context.newPage();
      const pageErrors = [];
      const consoleErrors = [];

      page.on('pageerror', (err) => {
        pageErrors.push(err?.message || String(err));
      });
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      const url = `${BASE_URL}${route}`;
      let httpStatus = 0;

      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        httpStatus = res ? res.status() : 0;
        await page.waitForTimeout(1200);
      } catch (err) {
        failures.push({ route, reason: `Navigation failed: ${err.message}` });
        await page.close();
        continue;
      }

      const metrics = await page.evaluate(() => {
        const root = document.getElementById('root');
        const textLen = (root?.innerText || document.body?.innerText || '').trim().length;
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const brokenImgs = Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.getAttribute('src') || 'unknown');
        return { textLen, scrollWidth, innerWidth, brokenImgs };
      });

      const overflowPx = Math.max(0, metrics.scrollWidth - metrics.innerWidth);
      const routeFailed = httpStatus >= 500 || pageErrors.length > 0 || metrics.textLen === 0;

      if (httpStatus >= 500) {
        failures.push({ route, reason: `HTTP ${httpStatus}` });
      }
      if (pageErrors.length > 0) {
        failures.push({ route, reason: `Uncaught pageerror: ${pageErrors.join(' | ')}` });
      }
      if (metrics.textLen === 0) {
        failures.push({ route, reason: 'Blank screen (#root has no visible text)' });
      }
      if (overflowPx > 2) {
        const entry = { route, reason: `Horizontal overflow +${overflowPx}px (${metrics.scrollWidth}px > ${metrics.innerWidth}px)` };
        if (STRICT_LAYOUT) failures.push(entry);
        else warnings.push(entry);
      }
      if (metrics.brokenImgs.length > 0) {
        warnings.push({ route, reason: `Broken images (${metrics.brokenImgs.length}): ${metrics.brokenImgs.slice(0, 3).join(', ')}` });
      }
      if (consoleErrors.length > 0) {
        warnings.push({ route, reason: `Console errors (${consoleErrors.length}): ${consoleErrors[0].slice(0, 120)}` });
      }

      const tag = routeFailed ? 'FAIL' : overflowPx > 2 ? 'WARN' : 'PASS';
      console.log(`[${tag}] ${route.padEnd(20)} | status=${httpStatus} | text=${metrics.textLen} | overflow=${overflowPx}px | pageErrors=${pageErrors.length}`);

      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    if (serverProc) serverProc.kill('SIGTERM');
  }

  if (warnings.length > 0) {
    console.warn(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) {
      console.warn(`::warning::[${w.route}] ${w.reason}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\nFailures (${failures.length}):`);
    for (const f of failures) {
      console.error(`::error::[${f.route}] ${f.reason}`);
    }
    process.exit(1);
  }

  console.log(`\n[OK] All ${ROUTES.length} routes passed mobile 375px smoke test with 0 runtime crashes.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
