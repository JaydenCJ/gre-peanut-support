# GRE Peanut — Support Site

Static support and privacy-policy site for **GRE Peanut**, an offline GRE prep app for iPhone.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Support page — about, contact, and FAQ |
| `privacy.html` | Privacy policy |

## Development

No build step and no dependencies — plain HTML and CSS. Open the files directly in a
browser, or serve the folder with any static server:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Notes

- Both pages are self-contained: one inline stylesheet each, Google Fonts as the only
  external resource.
- Light and dark color schemes are supported via `prefers-color-scheme`.
- GRE is a registered trademark of ETS. GRE Peanut is independent and is not endorsed
  or approved by ETS.
