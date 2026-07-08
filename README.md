# GRE Peanut — Support Site

Static support and privacy-policy site for **GRE Peanut**, an offline GRE prep app for iPhone.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Support page — about, contact, and FAQ |
| `privacy.html` | Privacy policy |
| `404.html` | Branded not-found page (GitHub Pages custom 404) |

## Assets

| File | Purpose |
| --- | --- |
| `shared.css` | Stylesheet shared by `index.html` and `privacy.html` |
| `favicon-32.png` | 32×32 favicon |
| `apple-touch-icon.png` | iOS home-screen icon |
| `og-image.png` | Social share image (Open Graph / Twitter card) |
| `fonts/` | Self-hosted Fredoka and Nunito (woff2, latin subset) |

## Development

No build step — plain HTML and CSS. Open the files directly in a browser, or serve the
folder with any static server:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Checks

The dev dependencies exist only for the checks in `scripts/` (the site itself has none):

```sh
npm install
npx playwright install chromium  # once, for the browser-based checks
npm test
```

`npm test` runs, in order: HTML validation (`html-validate`), an internal link check,
a Playwright render smoke test, an axe-core accessibility scan (zero violations), and
a pixel-sampled WCAG contrast check of the hero text (worst ratio must stay ≥ 5.0:1).
CI (`.github/workflows/ci.yml`) runs the same scripts. To use a preinstalled Chromium
instead of `playwright install`, set `CHROMIUM_BIN=/path/to/chrome`.

## Notes

- `index.html` and `privacy.html` share `shared.css`; `404.html` keeps an inline copy
  of those styles because GitHub Pages renders it at arbitrary paths, where a relative
  stylesheet URL would break. Fonts are served from this repo — no third-party requests.
- Light and dark color schemes are supported via `prefers-color-scheme`.
- GRE is a registered trademark of ETS. GRE Peanut is independent and is not endorsed
  or approved by ETS.
