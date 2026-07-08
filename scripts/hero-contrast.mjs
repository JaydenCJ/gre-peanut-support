// Pixel-sampled WCAG contrast check for the hero text.
//
// For every page and color scheme, the hero is screenshotted twice: once as
// rendered and once with the hero text painted transparent. Pixels that
// differ between the two shots are exactly the pixels covered by text
// (including anti-aliased edges). For each of those sample points the WCAG
// contrast ratio of the text color against the underlying background pixel
// is computed; the worst ratio must stay at or above MIN_RATIO.
import { startServer, launchBrowser, routeSiteOrigin } from './lib.mjs';

const MIN_RATIO = 5.0;

const PAGES = [
  { path: 'index.html', textSelectors: ['.hero h1', '.hero .tag'] },
  { path: 'privacy.html', textSelectors: ['.hero h1', '.hero .updated'] },
  { path: '404.html', textSelectors: ['.hero h1', '.hero .tag'] },
];
const MODES = [
  { colorScheme: 'light', viewport: { width: 1280, height: 900 } },
  { colorScheme: 'dark', viewport: { width: 1280, height: 900 } },
  { colorScheme: 'light', viewport: { width: 390, height: 844 } },
];

function channelToLinear(c8) {
  const c = c8 / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function luminance([r, g, b]) {
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}
function contrast(la, lb) {
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// Minimal PNG decode via the browser itself: draw the screenshot on a canvas
// and read the RGBA bytes back, so no image library is needed.
async function pngToRgba(page, buffer) {
  return page.evaluate(async (b64) => {
    const res = await fetch(`data:image/png;base64,${b64}`);
    const bmp = await createImageBitmap(await res.blob());
    const canvas = new OffscreenCanvas(bmp.width, bmp.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bmp, 0, 0);
    const { data } = ctx.getImageData(0, 0, bmp.width, bmp.height);
    return { width: bmp.width, height: bmp.height, data: Array.from(data) };
  }, buffer.toString('base64'));
}

const server = await startServer();
const browser = await launchBrowser();
let failed = false;

for (const { path: pagePath, textSelectors } of PAGES) {
  for (const { colorScheme, viewport } of MODES) {
    const context = await browser.newContext({ viewport, colorScheme, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    await routeSiteOrigin(context);
    const page = await context.newPage();
    await page.goto(`${server.url}/${pagePath}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const selectorList = textSelectors.join(', ');
    const textColor = await page.$eval(selectorList, (el) => getComputedStyle(el).color);
    const colors = await page.$$eval(selectorList, (els) => els.map((el) => getComputedStyle(el).color));
    if (new Set(colors).size !== 1) {
      console.error(`${pagePath} [${colorScheme} ${viewport.width}px]: hero text colors differ: ${colors.join(' / ')}`);
      failed = true;
    }
    const rgb = textColor.match(/\d+/g).slice(0, 3).map(Number);
    const textLum = luminance(rgb);

    const clip = await page.$eval('.hero', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });

    const shotWithText = await page.screenshot({ clip });
    await page.addStyleTag({ content: `${selectorList} { color: transparent !important; }` });
    const shotBackground = await page.screenshot({ clip });

    const a = await pngToRgba(page, shotWithText);
    const b = await pngToRgba(page, shotBackground);
    let samples = 0;
    let worst = Infinity;
    let worstBg = null;
    for (let i = 0; i < a.data.length; i += 4) {
      if (a.data[i] === b.data[i] && a.data[i + 1] === b.data[i + 1] && a.data[i + 2] === b.data[i + 2]) continue;
      const bg = [b.data[i], b.data[i + 1], b.data[i + 2]];
      const ratio = contrast(textLum, luminance(bg));
      samples += 1;
      if (ratio < worst) {
        worst = ratio;
        worstBg = bg;
      }
    }

    const label = `${pagePath} [${colorScheme} ${viewport.width}px]`;
    if (samples === 0) {
      console.error(`${label}: no text pixels sampled`);
      failed = true;
    } else {
      const ok = worst >= MIN_RATIO;
      console.log(
        `${ok ? 'PASS' : 'FAIL'} ${label}: text ${textColor}, ${samples} sampled pixels, ` +
          `worst contrast ${worst.toFixed(3)}:1 (bg rgb(${worstBg.join(',')})), required >= ${MIN_RATIO}:1`,
      );
      if (!ok) failed = true;
    }
    await context.close();
  }
}

await browser.close();
await server.close();
process.exit(failed ? 1 : 0);
