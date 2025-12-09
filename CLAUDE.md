# CLAUDE.md

## Project

Vanilla HTML/CSS/JS replica of Elite Decor website. Static site, no build process.

## Structure

- `src/` - Website files (served by Vercel)
- `src/components/card-morph/` - Reusable gallery component with own docs

## Run Locally

```bash
cd src && python3 -m http.server 8000
```

## Key Decisions

- **No frameworks** - Pure vanilla JS with GSAP for animations
- **CDN dependencies** - GSAP, Lenis loaded via CDN (no npm)
- **Component isolation** - Card Morph is self-contained with own CSS/JS/docs
- **BEM naming** - `cm-` prefix for Card Morph component styles

## Gotchas

- Card Morph docs are in `src/components/card-morph/docs/` - check there for API details
- Multiple index files: `index.html` (main), `index-card-morph.html`, `index-chapters.html`
- Images load from elitedecor.pt CDN in examples (external URLs)
