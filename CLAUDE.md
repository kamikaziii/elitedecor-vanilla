# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vanilla HTML/CSS/JS replica of Elite Decor website. Static site, no build process.

## Run Locally

```bash
cd src && python3 -m http.server 8000
# or: npx serve src
```

## Architecture

- **Main site**: `src/index.html` + `src/js/app.js` + `src/css/styles.css`
- **Card Morph component**: Self-contained in `src/components/card-morph/` with its own JS/CSS/docs
- **CDN dependencies**: GSAP (animations), ScrollTrigger (scroll effects), Lenis (smooth scroll) - no npm

### Main App Pattern (app.js)

IIFE structure with class-based components:
- `HeroSlideshow` - Background image cycling
- `TextSplitter` - Character-by-character text animation
- `FlipCard` - Interactive flip cards with carousel support
- `Lightbox` - WCAG-compliant modal gallery
- Scroll animations via GSAP ScrollTrigger

### Card Morph Component

Standalone morphing gallery. See `src/components/card-morph/docs/API.md` for full API. Uses `cm-` BEM prefix.

```javascript
CardMorph.initAll('[data-card-morph]', { duration: 0.6, smoothScroll: false });
```

## Gotchas

- Multiple entry points: `index.html`, `index-card-morph.html`, `index-chapters.html`
- Images reference elitedecor.pt CDN (external URLs)
- Deployment: Vercel serves `src/` directory directly (`vercel.json`)
