# Elite Decor - Documentation Index

Comprehensive documentation for the Elite Decor vanilla HTML/CSS/JS website.

## Documentation Structure

```
/Users/filipegarrido/elitedecor-vanilla/
├── CLAUDE.md                           # Claude Code guidance (architecture, gotchas)
├── DOCUMENTATION.md                    # This file - documentation index
├── src/
│   ├── README.md                       # Developer guide (setup, workflows)
│   ├── assets/
│   │   └── collections/
│   │       └── README.md               # Image guidelines and collection management
│   └── components/
│       └── card-morph/
│           └── docs/
│               ├── README.md           # Card Morph component guide
│               ├── API.md              # JavaScript API reference
│               └── CSS-REFERENCE.md    # CSS theming and variables
└── vercel.json                         # Deployment configuration
```

## Quick Links

### For Developers

| Document | Purpose | Path |
|----------|---------|------|
| **Developer README** | Setup, workflows, common tasks | `/Users/filipegarrido/elitedecor-vanilla/src/README.md` |
| **CLAUDE.md** | Architecture overview, project structure | `/Users/filipegarrido/elitedecor-vanilla/CLAUDE.md` |
| **Card Morph API** | Component JavaScript API | `/Users/filipegarrido/elitedecor-vanilla/src/components/card-morph/docs/API.md` |

### For Content Managers

| Document | Purpose | Path |
|----------|---------|------|
| **Collections Guide** | Adding/managing collection images | `/Users/filipegarrido/elitedecor-vanilla/src/assets/collections/README.md` |
| **Developer README** | Adding new collections/languages | `/Users/filipegarrido/elitedecor-vanilla/src/README.md` |

### For Designers

| Document | Purpose | Path |
|----------|---------|------|
| **Collections Guide** | Image specifications and guidelines | `/Users/filipegarrido/elitedecor-vanilla/src/assets/collections/README.md` |
| **CSS Reference** | Card Morph theming | `/Users/filipegarrido/elitedecor-vanilla/src/components/card-morph/docs/CSS-REFERENCE.md` |

## Common Tasks - Quick Reference

### Development

```bash
# Start local server
cd src && python3 -m http.server 8000

# Visit
http://localhost:8000
```

### Adding Content

**New Collection**:
1. Create `/Users/filipegarrido/elitedecor-vanilla/src/assets/collections/{name}/`
2. Add `hero.jpg` + gallery images
3. Update all 3 HTML files (EN, PT, RU)
4. See: `/Users/filipegarrido/elitedecor-vanilla/src/README.md` → "Adding a New Collection"

**New Language**:
1. Create `/Users/filipegarrido/elitedecor-vanilla/src/{lang}/index.html`
2. Update `vercel.json` rewrites
3. Add hreflang tags to all versions
4. See: `/Users/filipegarrido/elitedecor-vanilla/src/README.md` → "Adding a New Language"

**Add Images to Collection**:
1. Optimize to 1920x1280px, < 500KB
2. Name as `{collection}-{n}.jpg`
3. Add to `.cm-gallery-section__track` in all HTML files
4. See: `/Users/filipegarrido/elitedecor-vanilla/src/assets/collections/README.md`

### Card Morph Component

**Initialize**:
```javascript
CardMorph.initAll('[data-card-morph]', { duration: 0.6 });
```

**Open programmatically**:
```javascript
const gallery = CardMorph.getInstance(container);
gallery.open('noble'); // Opens noble collection
```

See: `/Users/filipegarrido/elitedecor-vanilla/src/components/card-morph/docs/API.md`

## Project Overview

### Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ IIFE pattern
- **GSAP 3.12** - Animations, ScrollTrigger, Flip API
- **Lenis 1.1** - Smooth scrolling

No build process, no npm dependencies.

### File Structure

```
src/
├── index.html              # English homepage
├── pt/index.html           # Portuguese
├── ru/index.html           # Russian
├── assets/
│   ├── collections/        # Noble (13 images), Essense (5 images)
│   ├── cards/              # Card thumbnails
│   └── gallery/            # General images
├── css/styles.css          # Global styles
├── js/app.js               # Main app logic
└── components/
    └── card-morph/         # Gallery component
```

### Multi-Language Support

- **3 languages**: English (default), Portuguese, Russian
- **Structure**: Separate HTML files in subdirectories
- **Shared assets**: All languages use same images/CSS/JS
- **SEO**: hreflang tags for proper indexing

### Collections

| Collection | Images | Year | Materials |
|------------|--------|------|-----------|
| **Noble** | 13 + hero | 2022 | Wood, Metal |
| **Essense** | 5 + hero | 2022 | Wood, Metal |

## Key Features

### Card Morph Gallery

- **Morphing transitions**: GSAP Flip API for smooth card-to-view animations
- **Draggable galleries**: Horizontal scroll with touch/mouse support
- **Lightbox**: Full-screen image viewer with keyboard navigation
- **Accessibility**: WCAG 2.1 compliant, keyboard navigation, ARIA labels

### Main App

- **Hero slideshow**: 4.5s crossfade background images
- **Text animation**: Character-by-character reveal
- **Smart header**: Hide/show on scroll
- **Scroll effects**: GSAP ScrollTrigger animations

## Deployment

**Platform**: Vercel
**Configuration**: `/Users/filipegarrido/elitedecor-vanilla/vercel.json`
**Output Directory**: `src/`
**URL Rewrites**: `/pt` → `/pt/index.html`, `/ru` → `/ru/index.html`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Performance

- Lazy loading on all gallery images
- Preconnected Google Fonts
- CDN dependencies (jsDelivr, unpkg)
- Optimized images (< 500KB each)
- No build process overhead

## Accessibility

- Full keyboard navigation
- ARIA labels and landmarks
- Focus management in modals
- Screen reader announcements
- Semantic HTML structure

## Getting Help

### Documentation

1. **Development setup**: Read `/Users/filipegarrido/elitedecor-vanilla/src/README.md`
2. **Architecture questions**: Check `/Users/filipegarrido/elitedecor-vanilla/CLAUDE.md`
3. **Component usage**: See `/Users/filipegarrido/elitedecor-vanilla/src/components/card-morph/docs/`
4. **Image management**: Read `/Users/filipegarrido/elitedecor-vanilla/src/assets/collections/README.md`

### Support Contacts

- **Email**: geral@elitedecor.pt
- **Phone**: +351 917 591 176
- **Instagram**: [@elitedecor.pt](https://www.instagram.com/elitedecor.pt/)
- **Facebook**: [elitedecor.pt](https://www.facebook.com/elitedecor.pt/)

## Version History

### Current Version (December 2025)

**Recent Enhancements**:
- Converted 3 flip cards to card-morph component
- Added Noble Collection (13 images)
- Added Essense Collection (5 images)
- Implemented multi-language support (EN/PT/RU)
- Downloaded all collection images locally
- Added language switcher to header
- Updated Vercel routing configuration

**Collections**:
- Noble: 13 gallery images + hero
- Essense: 5 gallery images + hero

**Languages**:
- English (default)
- Portuguese
- Russian

## Next Steps

### For New Developers

1. Read `/Users/filipegarrido/elitedecor-vanilla/src/README.md` - Developer guide
2. Run local server: `cd src && python3 -m http.server 8000`
3. Explore the code starting with `src/index.html`
4. Review `src/js/app.js` for main app logic
5. Check `src/components/card-morph/docs/API.md` for component API

### For Adding Content

1. **New images**: Read `/Users/filipegarrido/elitedecor-vanilla/src/assets/collections/README.md`
2. **New collection**: Follow steps in `/Users/filipegarrido/elitedecor-vanilla/src/README.md` → "Adding a New Collection"
3. **New language**: Follow steps in `/Users/filipegarrido/elitedecor-vanilla/src/README.md` → "Adding a New Language"
4. **Styling changes**: Edit `src/css/styles.css` or component CSS

### For Deployment

1. Ensure all changes tested locally
2. Commit to Git
3. Push to main branch
4. Vercel auto-deploys on push
5. Verify at production URL

## License & Credits

**Elite Decor** - Custom furniture company
Website built with vanilla HTML/CSS/JS following 2025 best practices.

**Dependencies**:
- GSAP 3.12.5 (GreenSock Animation Platform)
- Lenis 1.1.18 (Smooth scroll)
- Google Fonts (Inter, Instrument Sans)

---

**Last Updated**: December 2025
**Documentation Version**: 1.0
