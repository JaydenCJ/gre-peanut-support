// Accessibility scan with axe-core: every page must have zero violations in
// both color schemes.
import { AxeBuilder } from '@axe-core/playwright';
import { startServer, launchBrowser, routeSiteOrigin } from './lib.mjs';

const PAGES = ['index.html', 'privacy.html', '404.html'];
const SCHEMES = ['light', 'dark'];

const server = await startServer();
const browser = await launchBrowser();
let failed = false;

for (const pagePath of PAGES) {
  for (const colorScheme of SCHEMES) {
    const context = await browser.newContext({ colorScheme, reducedMotion: 'reduce' });
    await routeSiteOrigin(context);
    const page = await context.newPage();
    await page.goto(`${server.url}/${pagePath}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const results = await new AxeBuilder({ page }).analyze();
    const label = `${pagePath} [${colorScheme}]`;
    if (results.violations.length === 0) {
      console.log(`PASS ${label}: 0 axe violations (${results.passes.length} rules passed)`);
    } else {
      failed = true;
      console.error(`FAIL ${label}: ${results.violations.length} axe violations`);
      for (const v of results.violations) {
        console.error(`  [${v.impact}] ${v.id}: ${v.help}`);
        for (const node of v.nodes) console.error(`    ${node.target.join(' ')}`);
      }
    }
    await context.close();
  }
}

await browser.close();
await server.close();
process.exit(failed ? 1 : 0);
