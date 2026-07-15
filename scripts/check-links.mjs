// Internal link check: every local href/src/url() target referenced from the
// HTML pages and stylesheets must exist in the repository. Absolute URLs
// pointing at the production origin (used by 404.html) are resolved back to
// repository paths and checked too.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE_PREFIX } from './lib.mjs';

const errors = [];
let checked = 0;

function checkTarget(raw, fromFile) {
  let url = raw.trim();
  if (!url || url.startsWith('#')) return;
  if (url.startsWith(SITE_PREFIX)) {
    url = url.slice(SITE_PREFIX.length) || 'index.html';
  } else if (/^(https?:|mailto:|tel:|data:)/i.test(url)) {
    return; // external target, out of scope
  }
  url = url.split('#')[0].split('?')[0];
  if (url === '') url = 'index.html';
  const target = path.normalize(path.join(ROOT, decodeURIComponent(url)));
  checked += 1;
  if (!target.startsWith(ROOT + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    errors.push(`${fromFile}: missing local target "${raw}"`);
  }
}

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') || f.endsWith('.css'));
for (const file of files) {
  const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (file.endsWith('.html')) {
    for (const m of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)) checkTarget(m[1], file);
    // Absolute self-references in meta tags (og:url, og:image, canonical …)
    for (const m of text.matchAll(/content=["'](https:\/\/[^"']+)["']/g)) checkTarget(m[1], file);
  }
  for (const m of text.matchAll(/url\(\s*['"]?([^'")]+?)['"]?\s*\)/g)) checkTarget(m[1], file);
}

if (errors.length > 0) {
  for (const e of errors) console.error(`FAIL ${e}`);
  process.exit(1);
}
console.log(`PASS internal links: ${checked} local references checked across ${files.length} files, all targets exist`);
