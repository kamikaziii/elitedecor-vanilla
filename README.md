# Elite Decor Vanilla

Modern, vanilla HTML/CSS/JavaScript website for Elite Decor custom furniture company featuring smooth animations, card morph gallery component, and multi-language support.

## Features

- Pure HTML5, CSS3, and vanilla JavaScript (no build process, no npm)
- Multi-language support (English, Portuguese, Russian)
- GSAP-powered animations with ScrollTrigger and Flip API
- Smooth scrolling with Lenis
- Custom Card Morph gallery component
- Draggable horizontal galleries
- Modern lightbox with keyboard navigation
- Fully responsive design
- WCAG 2.1 accessible (ARIA labels, keyboard navigation)

## Quick Start

### Option 1: Python HTTP Server

```bash
cd src
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 2: Node.js

```bash
npx serve src
# Visit http://localhost:3000
```

### Option 3: VS Code Live Server

Use the Live Server extension and open `src/index.html`.

## Project Structure

```
elitedecor-vanilla/
├── src/                              # Website source files
│   ├── index.html                    # English homepage
│   ├── pt/index.html                 # Portuguese homepage
│   ├── ru/index.html                 # Russian homepage
│   ├── css/styles.css                # Main stylesheet
│   ├── js/app.js                     # Main JavaScript
│   ├── assets/
│   │   ├── collections/              # Collection galleries
│   │   │   ├── noble/                # Noble Collection (13 images)
│   │   │   └── essense/              # Essense Collection (5 images)
│   │   ├── cards/                    # Card thumbnails
│   │   └── gallery/                  # General images
│   └── components/
│       └── card-morph/               # Reusable gallery component
│           ├── dist/                 # Production JS & CSS
│           ├── docs/                 # API documentation
│           └── examples/             # Usage examples
├── vercel.json                       # Deployment config
├── CLAUDE.md                         # Architecture documentation
├── DOCUMENTATION.md                  # Documentation index
└── README.md                         # This file
```

## Multi-Language Support

The site supports 3 languages:
- **English** (default): `/` → `src/index.html`
- **Portuguese**: `/pt/` → `src/pt/index.html`
- **Russian**: `/ru/` → `src/ru/index.html`

All languages share the same assets, CSS, and JavaScript. Language switcher in header, hreflang tags for SEO.

## Collections

Two furniture collections with local image galleries:

| Collection | Images | Path |
|------------|--------|------|
| **Noble** | 13 + hero | `src/assets/collections/noble/` |
| **Essense** | 5 + hero | `src/assets/collections/essense/` |

Each collection displayed using the Card Morph component with full-screen views and draggable galleries.

## Card Morph Component

Standalone, reusable gallery component featuring:
- Card-to-view morphing animations (GSAP Flip API)
- Draggable horizontal galleries
- Lightbox for full-screen images
- Full keyboard & touch support
- 40+ CSS custom properties for theming
- WCAG 2.1 compliant accessibility

**Documentation**: See `src/components/card-morph/docs/`

## Documentation

Comprehensive documentation following 2025 best practices:

| Document | Purpose | Location |
|----------|---------|----------|
| **Documentation Index** | Overview and quick links | `DOCUMENTATION.md` |
| **Developer Guide** | Setup, workflows, common tasks | `src/README.md` |
| **Architecture Guide** | Project structure, gotchas | `CLAUDE.md` |
| **Collections Guide** | Image management, guidelines | `src/assets/collections/README.md` |
| **Card Morph API** | Component API reference | `src/components/card-morph/docs/API.md` |

## Dependencies (CDN)

All dependencies loaded via CDN (no npm):
- [GSAP 3.12.5](https://gsap.com/) - Animations (core + ScrollTrigger + Flip + Draggable)
- [Lenis 1.1.18](https://github.com/darkroomengineering/lenis) - Smooth scroll

## Deployment

Configured for Vercel deployment:

1. Connect GitHub repo to Vercel
2. Vercel serves `src/` directory directly
3. Push to main branch to auto-deploy
4. Multi-language routing handled by `vercel.json`

**Configuration**: See `vercel.json` for rewrites and headers.

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Common Tasks

**Add new collection**:
```bash
mkdir src/assets/collections/{name}
# Add hero.jpg + gallery images
# Update HTML files (see src/README.md)
```

**Add new language**:
```bash
mkdir src/{lang}
cp src/index.html src/{lang}/index.html
# Translate content, update vercel.json (see src/README.md)
```

**Add images to collection**:
```bash
# Optimize to 1920x1280px, < 500KB
cp image.jpg src/assets/collections/{collection}/{collection}-{n}.jpg
# Update HTML gallery tracks (see src/assets/collections/README.md)
```

## Contact

**Elite Decor**
- Email: geral@elitedecor.pt
- Phone: +351 917 591 176
- Instagram: [@elitedecor.pt](https://www.instagram.com/elitedecor.pt/)
- Facebook: [elitedecor.pt](https://www.facebook.com/elitedecor.pt/)

## Credits

- Website for [Elite Decor](https://elitedecor.pt) custom furniture
- Built with [GSAP](https://gsap.com/) and [Lenis](https://github.com/darkroomengineering/lenis)
- Vanilla HTML/CSS/JS following 2025 best practices
