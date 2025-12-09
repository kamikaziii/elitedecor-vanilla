# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vanilla HTML/CSS/JS replica of Elite Decor website. Static site, no build process, no npm dependencies.

## Run Locally

```bash
cd src && python3 -m http.server 8000
# or: npx serve src
```

Visit: `http://localhost:8000`

## Architecture

### Core Files

- **Main site**: `src/index.html` + `src/js/app.js` + `src/css/styles.css`
- **Card Morph component**: Self-contained in `src/components/card-morph/` with own JS/CSS/docs
- **CDN dependencies**: GSAP (animations), ScrollTrigger (scroll), Flip (FLIP animations), Draggable (gallery), Lenis (smooth scroll)

### Multi-Language Structure

```
src/
├── index.html          # Portuguese (default at /)
├── en/index.html       # English (at /en/)
├── ru/index.html       # Russian (at /ru/)
├── js/
│   ├── app.js          # Main app logic
│   └── lang-detect.js  # Browser language detection
├── assets/             # Shared assets (all languages use same images)
├── css/                # Shared styles
├── components/         # Shared components
└── sitemap.xml         # SEO sitemap with hreflang
```

- **Default language**: Portuguese (served at root `/`)
- Language switcher in header: `<nav class="lang-switcher">`
- hreflang tags for SEO: `<link rel="alternate" hreflang="...">`
- Canonical URLs on all pages: `<link rel="canonical" href="...">`
- Automatic language detection via `lang-detect.js` (localStorage-based)
- Vercel rewrites handle `/en` and `/ru` routing (see `vercel.json`)

### Assets Organization

```
assets/
├── cards/              # Card thumbnails (exclusive-design.jpg, etc.)
├── collections/        # Collection galleries
│   ├── noble/          # Noble Collection (13 images + hero.jpg)
│   └── essense/        # Essense Collection (5 images + hero.jpg)
└── gallery/            # General gallery images
```

### Main App Pattern (app.js)

IIFE structure with class-based components:
- `HeroSlideshow` - Background image cycling (4.5s interval)
- `TextSplitter` - Character-by-character text animation
- `FlipCard` - Interactive flip cards with carousel support
- `Lightbox` - WCAG-compliant modal gallery
- Smart header (hide on scroll down, show on scroll up)
- Scroll animations via GSAP ScrollTrigger

### Card Morph Component

Standalone morphing gallery component. See `src/components/card-morph/docs/API.md` for full API.

**Integration:**
- 5 cards: Exclusive Design, Quality Materials, Delivery & Installation, Noble Collection, Essense Collection
- Each card links to a full-screen view with hero, info section, and draggable gallery
- Uses GSAP Flip API for smooth morphing transitions
- BEM prefix: `cm-`

**Initialization:**
```javascript
CardMorph.initAll('[data-card-morph]', { duration: 0.6, smoothScroll: false });
```

**View Structure:**
- `.cm-card` with `data-cm-view-id="noble"` links to `#noble-view`
- `.cm-view` contains `.cm-hero`, `.cm-info`, and `.cm-gallery-section`
- Gallery tracks use GSAP Draggable for horizontal scrolling

## Collections

### Noble Collection
- **Path**: `assets/collections/noble/`
- **Images**: 13 items (noble-1.jpg through noble-13.jpg) + hero.jpg
- **Year**: 2022
- **Materials**: Wood, Metal

### Essense Collection
- **Path**: `assets/collections/essense/`
- **Images**: 5 items (essense-1.jpg through essense-5.jpg) + hero.jpg
- **Year**: 2022
- **Materials**: Wood, Metal

## Deployment

- **Platform**: Vercel
- **Output directory**: `src/`
- **Rewrites**: `/en` → `/en/index.html`, `/ru` → `/ru/index.html`
- **Clean URLs**: Enabled (no `.html` extensions)
- **Trailing slash**: Enabled

## Key Files

| File | Purpose |
|------|---------|
| `src/index.html` | Portuguese homepage (default) |
| `src/en/index.html` | English homepage |
| `src/ru/index.html` | Russian homepage |
| `src/js/app.js` | Main app logic (IIFE pattern) |
| `src/js/lang-detect.js` | Browser language detection + localStorage |
| `src/css/styles.css` | Global styles |
| `src/sitemap.xml` | SEO sitemap with hreflang annotations |
| `src/components/card-morph/dist/card-morph.js` | Card morph component |
| `src/components/card-morph/dist/card-morph.css` | Card morph styles |
| `vercel.json` | Deployment configuration |

## Common Tasks

### Add New Language
1. Create `src/{lang}/index.html` (copy and translate)
2. Add rewrite to `vercel.json`: `{ "source": "/{lang}", "destination": "/{lang}/index.html" }`
3. Add hreflang to all language versions
4. Add link to lang-switcher nav

### Add New Collection
1. Create directory: `src/assets/collections/{name}/`
2. Add images: `{name}-1.jpg`, `{name}-2.jpg`, etc. + `hero.jpg`
3. Add card to gallery in `index.html`:
   ```html
   <article class="cm-card" data-cm-view-id="{name}" tabindex="0" role="button">
     <img class="cm-card__image" src="assets/collections/{name}/hero.jpg" alt="{Name} Collection">
     <h3 class="cm-card__title">{Name} Collection</h3>
   </article>
   ```
4. Add view with `id="{name}-view"` containing hero, info, and gallery sections
5. Update all language versions

### Add Collection Images
1. Place in `assets/collections/{collection}/`
2. Use naming convention: `{collection}-{number}.jpg` or descriptive names
3. Add to `.cm-gallery-section__track` in collection view
4. Update "Pieces" count in `.cm-info__detail`

## Gotchas

- Images: Mix of local assets and elitedecor.pt CDN URLs (legacy)
- Language versions: Must manually update all 3 HTML files when content changes
- Card morph views: View IDs must match `data-cm-view-id` attributes
- Draggable galleries: Require GSAP Draggable plugin (CDN)
- Smooth scroll: Lenis instance managed by CardMorph when `smoothScroll: true`
- Language detection: Uses localStorage (`elite-decor-lang` key) to store user preference
- Portuguese diacritics: Ensure all Portuguese text includes proper accents (ç, ã, á, é, etc.)
