# Ali Babaei — Portfolio

A static, dependency-free implementation of the `Ali Babaei Portfolio.dc.html`
design from the [claude.ai/design](https://claude.ai/design) project. No
build step, no framework — just `index.html` + `css/` + `js/`, deployable
anywhere that serves static files (GitHub Pages, Netlify, S3, etc.).

## Run locally

```bash
cd portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

## Structure

- `index.html` — page shell, header, cursor, mount points.
- `css/style.css` — all design tokens (color, type, spacing) and component
  styles, ported 1:1 from the source design's inline styles.
- `js/paintings.js` — the ordered artwork manifest (24 entries). Index
  order matches the source design's `FILES` array, so the hero/feature
  picks on Home (indices 9, 14, 17, 20, 3, 11) and the "No. NN" labels in
  the gallery line up correctly.
- `js/app.js` — view state (home/gallery/about/contact), routing, the
  custom cursor, and the lightbox — a vanilla-JS port of the design's
  React-ish `DCLogic` component.
- `assets/paintings/` — the 24 artwork photos referenced by `paintings.js`,
  resized to a 2000px long edge and re-compressed (JPEG, quality 82) for
  web delivery.

## About the artwork images

The 24 photos are Ali's originals, order-matched to the source design's
`FILES` array (so the hero/feature picks on Home and the "No. NN" labels
in the gallery line up correctly). To swap any of them out, replace the
file in `assets/paintings/` — the code only cares about the `src` path
in `js/paintings.js`.

## Design reference

`Design System.md` in the source claude.ai/design project is the token
sheet (colors, type scale, spacing, components) this implementation was
built against — see the project directly for the authoritative source.
