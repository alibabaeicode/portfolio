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
- `js/app.js` — fetches `content/*.json`, then handles view state
  (home/gallery/about/contact), hash routing, the custom cursor, and the
  lightbox — a vanilla-JS port of the design's React-ish `DCLogic`
  component.
- `content/paintings.json` — the ordered artwork manifest (24 entries).
  Array position is the catalog order: it's what the "No. NN" labels in the
  gallery count from, and what `content/home.json`'s hero/feature picks
  reference (by `src`, not position — see below).
- `content/home.json`, `content/about.json`, `content/contact.json` — the
  editable copy for each page (tagline, About paragraphs, contact note,
  etc.) and, for Home, which paintings are featured.
- `assets/paintings/` — the 24 artwork photos referenced from
  `content/paintings.json`, resized to a 2000px long edge and re-compressed
  (JPEG, quality 82) for web delivery.
- `admin/` — the CMS (Sveltia CMS) for editing everything in `content/`
  through a web UI instead of hand-editing JSON. See `CMS_SETUP.md` for the
  one-time account setup this needs before it's usable.

## About the artwork images

The 24 photos are Ali's originals, order-matched to the source design's
`FILES` array (so the "No. NN" labels in the gallery line up correctly). To
swap any of them out, replace the file in `assets/paintings/` and update its
`src` in `content/paintings.json` — or use the CMS at `/admin` instead of
editing either by hand.

## Deploying changes

`index.html` links `css/style.css` and `js/app.js` with a `?v=N` query
string. There's no build step to hash filenames for cache-busting, so bump
that `N` (in both tags) whenever you change either file — otherwise some
visitors' browsers may keep serving a cached copy of the old one after a
deploy. Editing `content/*.json` (by hand or via the CMS) doesn't need a
version bump — those are fetched fresh on every page load, not cached by
the browser via this mechanism.

## Design reference

`Design System.md` in the source claude.ai/design project is the token
sheet (colors, type scale, spacing, components) this implementation was
built against — see the project directly for the authoritative source.
