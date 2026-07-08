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
| `favicon-32.png` | 32×32 favicon |
| `apple-touch-icon.png` | iOS home-screen icon |
| `og-image.png` | Social share image (Open Graph / Twitter card) |
| `fonts/` | Self-hosted Fredoka and Nunito (woff2, latin subset) |

## Development

No build step and no dependencies — plain HTML and CSS. Open the files directly in a
browser, or serve the folder with any static server:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Notes

- All pages are self-contained: one inline stylesheet each, and fonts are served from
  this repo — no third-party requests.
- Light and dark color schemes are supported via `prefers-color-scheme`.
- GRE is a registered trademark of ETS. GRE Peanut is independent and is not endorsed
  or approved by ETS.
