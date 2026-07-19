# Design System

Design tokens live as CSS custom properties in `css/style.css` (`:root`). This
file documents what they mean and the conventions for using them.

## Keeping this in sync

This document and the UI must change together, in both directions:

- A UI change that introduces a new size, color, or repeated pattern updates
  this file in the same commit/PR — either as a new token (if it's reusable)
  or a note on why it's a deliberate one-off (if it isn't).
- A change to this file (a new token, a changed scale step, a renamed
  convention) gets applied to every place in the CSS/HTML it affects, not
  left as documentation of an aspiration.

Never let the two drift apart — a design system that doesn't match the
actual UI is worse than no design system, since it actively misleads.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ffffff` | Page background, text/icon color on dark fills |
| `--ink` | `#0a0a0a` | Primary text / high-contrast fills |
| `--muted` | `#4a4a4a` | Secondary text (taglines, captions) |
| `--paper-90` / `--paper-97` | translucent white | Header blur backdrop / lightbox scrim |
| `--font-display` | Barriecito | Large display type (hero name, page titles, H2/statement) |
| `--font-label` | Space Grotesk | UI labels (nav, buttons, links, meta) |
| `--font-body` | Inter | Body copy |
| `--font-body-size` | `clamp(17px, 2vw, 20px)` | The one fluid size for every paragraph that isn't a heading or UI label |
| `--space-2` … `--space-12` | `8px` … `48px` | Spacing scale — see below |
| `--radius-pill` | `999px` | Pill-shaped buttons |
| `--ease-signature` | `cubic-bezier(.16, 1, .3, 1)` | Page-enter animation, image-hover transitions |
| `--z-header` / `--z-lightbox` / `--z-cursor` | `500` / `900` / `9999` | Stacking order, low to high |
| `--page-pad-y` / `--page-pad-x` / `--page-pad-bottom` | `clamp(110px,18vw,150px)` / `clamp(20px,5vw,48px)` / `120px` | Shared padding for every top-level page section |

Rule: never hardcode `#fff` / `#000` for something the tokens already cover —
use `var(--paper)` / `var(--ink)` so a future palette change only touches
`:root`.

## Spacing scale

Every `gap`, `padding`, and `margin` that isn't driven by content or viewport
width (those still use `clamp(..., vw, ...)`, see below) should come from
this scale instead of a hand-picked pixel value:

| Token | Value |
|---|---|
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-7` | 28px |
| `--space-8` | 32px |
| `--space-9` | 36px |
| `--space-10` | 40px |
| `--space-12` | 48px |

Naming is by multiplier on the 4px base (`--space-3` = 3 × 4 = 12px), so a
new step (say 44px = `--space-11`) slots in without renaming anything else.

This exists because the site used to have 10px/12px/14px gaps doing the same
job in different places, and four different page-bottom-padding values
(90/100/120/120px) with no reason for the spread. If you need a new spacing
value, check this table for the closest existing step before adding a raw
pixel number — a slightly-off value from the scale reads as more intentional
than an exact one that doesn't.

Fluid, viewport-driven sizes (image tile heights, page top padding, display
type) are a different category — they're deliberately bespoke per element
and stay as `clamp()`, not part of this scale.

## Shared style groups

A few visual patterns repeat across otherwise-unrelated elements. Instead of
duplicating the declarations, they're grouped under one comma-separated
selector in `style.css`, with each element's own rule holding only what's
actually different about it (size, position, spacing).

- **Label text** (`.icon-link span, .pill-button span, .poster-head,
  .lightbox-close`) — small bold uppercase UI chrome: Space Grotesk, 700,
  14px, `.04em` tracking.
- **Display heading** (`.home .home-name, .home-h2, .home-statement div,
  .page h1`) — the site's large uppercase headline style: Barriecito, 700,
  uppercase, `-.01em` tracking. This is also the site's **display type
  scale**, three sizes for three roles:
  - Hero name: `clamp(56px, 11vw, 160px)`
  - Page title (`.page h1`, e.g. About/Gallery/Contact heading): `clamp(40px, 7vw, 96px)`
  - H2 / statement line: `clamp(30px, 5vw, 56px)`
- **Muted copy** (`.home-tagline, .home-closing, .home-row-text p,
  .contact-note`) — secondary paragraphs and captions: `var(--font-body-size)`,
  1.6 line-height, `var(--muted)`. `.about p` uses the same
  `--font-body-size` but in `var(--ink)` since it's primary reading content,
  not secondary.

When adding a new element that's clearly "another one of these" (another
small UI label, another display heading, another muted lede), add its
selector to the relevant shared group rather than re-typing the properties.

## Page shell

Every top-level page (`.home`, `.gallery`, `.about`, `.contact`) uses
`var(--page-pad-y) var(--page-pad-x) var(--page-pad-bottom)` for its padding,
so header-clearance, side gutter, and bottom breathing room stay identical
across every page. Don't give an individual page its own one-off bottom
padding — if a page genuinely needs more room at the end, change
`--page-pad-bottom` and let every page move together, or ask whether that
page really needs to be different.

## Mobile breakpoint

There is one responsive breakpoint for the whole site: **`max-width: 700px`**,
used in a single `@media` block in `style.css`. Add new mobile-only overrides
to that block rather than introducing another breakpoint, unless a specific
element genuinely needs to change at a different width.

## Mobile type scale

Large display headings use `clamp(min, preferred-vw, max)` so they scale
smoothly with viewport width. On phones, the `vw` term alone often lands
below the size we actually want, so the `min` bound is what's visible in
practice — but if that `min` is just picked by eye, nobody downstream can
tell what relationship it has to the desktop size.

Convention: a mobile heading's `min` is the desktop base size multiplied by
`--mobile-heading-scale`, defined once in `:root`:

```css
--mobile-heading-scale: 1.4;
```

Example — hero name (`.home-name`):

```css
/* Desktop */
.home .home-name { font-size: clamp(56px, 11vw, 160px); }

/* Mobile (<=700px) */
.home .home-name { font-size: clamp(calc(56px * var(--mobile-heading-scale)), 19vw, 130px); }
```

56px is the desktop `min`; the mobile `min` is always `56px * 1.4 = 78.4px`.
To change how much bigger display headings get on mobile, change
`--mobile-heading-scale` in one place — every rule that references it moves
together.
