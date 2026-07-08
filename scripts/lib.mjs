// Shared helpers for the check scripts: a tiny static file server and
// Playwright launch/routing utilities.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// The production origin that 404.html references with absolute URLs
// (GitHub Pages renders 404.html at arbitrary paths, so it cannot use
// relative URLs). Tests map these back to the local checkout.
export const SITE_PREFIX = 'https://jaydencj.github.io/gre-peanut-support/';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

export function contentType(file) {
  return TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

// Serve the repository root on an ephemeral port.
export function startServer() {
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.normalize(path.join(ROOT, pathname));
    if (file.startsWith(ROOT + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'Content-Type': contentType(file) });
      res.end(fs.readFileSync(file));
      return;
    }
    const notFound = path.join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found');
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}

// Launch Chromium. Set CHROMIUM_BIN to use a preinstalled binary instead of
// the browser bundled by `playwright install`.
export function launchBrowser() {
  return chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined });
}

// Fulfill requests to the production origin from the local checkout so the
// checks are hermetic (no dependency on the deployed site).
export async function routeSiteOrigin(context) {
  await context.route(`${SITE_PREFIX}**`, (route) => {
    const { pathname } = new URL(route.request().url());
    let rel = pathname.replace(/^\/gre-peanut-support\/?/, '');
    if (rel === '') rel = 'index.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (file.startsWith(ROOT + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      route.fulfill({ body: fs.readFileSync(file), contentType: contentType(file) });
    } else {
      route.abort();
    }
  });
}
