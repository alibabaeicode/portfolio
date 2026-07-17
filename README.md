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
- `assets/paintings/` — artwork images referenced by `paintings.js`.

## About the artwork images

The source design references 24 original photos (portrait/collage
paintings) uploaded to the design project. The design-sync API used to
pull the project caps file reads at 256 KB, and every one of those photos
is a full-resolution phone photo well above that cap — so the actual
image bytes could not be transferred here. `assets/paintings/` currently
holds 24 generated placeholder SVGs (numbered, muted abstract gradients)
standing in for the real work so every layout, hover state and the
lightbox can be seen and tested end-to-end.

**To swap in the real photos:** replace the files in `assets/paintings/`
(any image format works — the code only cares about the `src` path) and
update the corresponding `src` in `js/paintings.js`, or just overwrite
`painting-01.svg` … `painting-24.svg` with same-named real images (e.g.
`painting-01.jpg`) and update the extension in `paintings.js`. Nothing
else needs to change — order and index mapping stay the same.

## Design reference

`Design System.md` in the source claude.ai/design project is the token
sheet (colors, type scale, spacing, components) this implementation was
built against — see the project directly for the authoritative source.
