# Design System

Design tokens live as CSS custom properties in `css/style.css` (`:root`). This
file documents what they mean and the conventions for using them.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ffffff` | Page background |
| `--ink` | `#0a0a0a` | Primary text / high-contrast fills |
| `--muted` | `#4a4a4a` | Secondary text (taglines, captions) |
| `--font-display` | Barriecito | Large display type (hero name, page titles) |
| `--font-label` | Space Grotesk | UI labels (nav, buttons, links) |
| `--font-body` | Inter | Body copy |

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

The mobile breakpoint for this and related layout changes (unsticking the
home sidebar, tightening the tagline) is `max-width: 700px`.
