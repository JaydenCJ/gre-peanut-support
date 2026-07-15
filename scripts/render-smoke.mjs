// Render smoke test: every page must load over HTTP with no console errors,
// no page errors, no failed requests, the expected heading, a landmark
// structure, and the self-hosted fonts actually loaded.
import { startServer, launchBrowser, routeSiteOrigin } from './lib.mjs';

const PAGES = [
  { path: 'index.html', h1: 'GRE Peanut' },
  { path: 'privacy.html', h1: 'Privacy Policy — GRE Peanut' },
  { path: '404.html', h1: 'Page not found' },
];
const SCHEMES = ['light', 'dark'];

const server = await startServer();
const browser = await launchBrowser();
let failed = false;

function report(ok, label, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: ${detail}`);
  if (!ok) failed = true;
}

for (const { path: pagePath, h1 } of PAGES) {
  for (const colorScheme of SCHEMES) {
    const context = await browser.newContext({ colorScheme, reducedMotion: 'reduce' });
    await routeSiteOrigin(context);
    const page = await context.newPage();
    const problems = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') problems.push(`console error: ${msg.text()}`);
    });
    page.on('pageerror', (err) => problems.push(`page error: ${err.message}`));
    page.on('requestfailed', (req) => problems.push(`request failed: ${req.url()} (${req.failure()?.errorText})`));

    const label = `${pagePath} [${colorScheme}]`;
    const response = await page.goto(`${server.url}/${pagePath}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    report(response.ok(), label, `HTTP ${response.status()}`);
    const heading = (await page.locator('h1').textContent()).replace(/\s+/g, ' ').trim();
    report(heading === h1, label, `h1 "${heading}"`);
    report(await page.locator('main').count() === 1 && (await page.locator('footer').count()) === 1, label, 'main and footer landmarks present');
    const fontsLoaded = await page.evaluate(() => document.fonts.check('16px Fredoka') && document.fonts.check('16px Nunito'));
    report(fontsLoaded, label, 'Fredoka and Nunito loaded');
    report(problems.length === 0, label, problems.length === 0 ? 'no console/page/request errors' : problems.join('; '));

    await context.close();
  }
}

await browser.close();
await server.close();
process.exit(failed ? 1 : 0);
