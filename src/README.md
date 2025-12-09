# Elite Decor - Developer Documentation

Static website for Elite Decor custom furniture company built with vanilla HTML/CSS/JS.

## Quick Start

```bash
# Development server
cd src && python3 -m http.server 8000
# or: npx serve src

# Visit: http://localhost:8000
```

## Project Structure

```
src/
├── index.html                  # English homepage
├── pt/index.html               # Portuguese homepage
├── ru/index.html               # Russian homepage
├── assets/
│   ├── cards/                  # Card thumbnails
│   ├── collections/            # Collection galleries
│   │   ├── noble/              # Noble Collection (13 images)
│   │   └── essense/            # Essense Collection (5 images)
│   ├── gallery/                # General gallery images
│   └── logo.svg
├── css/
│   └── styles.css              # Global styles
├── js/
│   └── app.js                  # Main application logic
└── components/
    └── card-morph/             # Card morph gallery component
        ├── dist/               # Production files
        ├── docs/               # API documentation
        └── examples/           # Usage examples
```

## Multi-Language Support

The site supports English (default), Portuguese, and Russian through separate HTML files.

### Language Structure

- **English**: `/` → `src/index.html`
- **Portuguese**: `/pt/` → `src/pt/index.html`
- **Russian**: `/ru/` → `src/ru/index.html`

All languages share the same assets, CSS, and JavaScript files.

### Adding a New Language

1. **Create language directory**
   ```bash
   mkdir src/{lang}
   ```

2. **Copy and translate HTML**
   ```bash
   cp src/index.html src/{lang}/index.html
   # Translate content in the new file
   ```

3. **Update hreflang tags** in all HTML files:
   ```html
   <link rel="alternate" hreflang="en" href="https://elitedecor.pt/">
   <link rel="alternate" hreflang="pt" href="https://elitedecor.pt/pt/">
   <link rel="alternate" hreflang="ru" href="https://elitedecor.pt/ru/">
   <link rel="alternate" hreflang="{lang}" href="https://elitedecor.pt/{lang}/">
   ```

4. **Add language switcher link** in all HTML files:
   ```html
   <nav class="lang-switcher" aria-label="Language">
     <a href="/" lang="en" hreflang="en">EN</a>
     <a href="/pt/" lang="pt" hreflang="pt">PT</a>
     <a href="/ru/" lang="ru" hreflang="ru">RU</a>
     <a href="/{lang}/" lang="{lang}" hreflang="{lang}">{LANG}</a>
   </nav>
   ```

5. **Add Vercel rewrite** to `/Users/filipegarrido/elitedecor-vanilla/vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/{lang}", "destination": "/{lang}/index.html" }
     ]
   }
   ```

## Collections

Collections are furniture galleries displayed using the card-morph component.

### Current Collections

| Collection | Images | Path |
|------------|--------|------|
| Noble | 13 + hero | `assets/collections/noble/` |
| Essense | 5 + hero | `assets/collections/essense/` |

### Adding a New Collection

1. **Create collection directory**
   ```bash
   mkdir src/assets/collections/{collection-name}
   ```

2. **Add images** with consistent naming:
   ```
   hero.jpg                    # Card thumbnail (required)
   {collection-name}-1.jpg     # Gallery image 1
   {collection-name}-2.jpg     # Gallery image 2
   ...
   ```

3. **Add card** to all language versions (`index.html`, `pt/index.html`, `ru/index.html`):
   ```html
   <div class="cm-gallery" data-card-morph>
     <!-- Existing cards... -->

     <!-- New collection card -->
     <article class="cm-card" data-cm-view-id="{collection-id}" tabindex="0" role="button" aria-label="View {Collection Name}">
       <img class="cm-card__image" src="assets/collections/{collection-name}/hero.jpg" alt="{Collection Name}" loading="lazy">
       <h3 class="cm-card__title">{Collection Name}</h3>
     </article>
   ```

4. **Add view** after the cards section:
   ```html
   <!-- {Collection Name} View -->
   <div id="{collection-id}-view" class="cm-view" aria-hidden="true">
     <div class="cm-view__inner">
       <button class="cm-view__close" aria-label="Close view"></button>

       <!-- Hero Section -->
       <section class="cm-hero">
         <div class="cm-hero__background">
           <img src="assets/collections/{collection-name}/hero.jpg" alt="">
         </div>
         <div class="cm-hero__content">
           <h1 class="cm-hero__title">
             <span>{Collection}</span>
             <span>{Name}</span>
           </h1>
           <p class="cm-hero__description">Collection tagline here.</p>
         </div>
       </section>

       <!-- Info Section -->
       <section class="cm-info">
         <div class="cm-info__description">
           <h2>Collection heading</h2>
           <p>Description paragraph 1...</p>
           <p>Description paragraph 2...</p>
         </div>
         <div class="cm-info__details">
           <div class="cm-info__detail">
             <div class="cm-info__detail-label">Year</div>
             <div class="cm-info__detail-value">2023</div>
           </div>
           <div class="cm-info__detail">
             <div class="cm-info__detail-label">Materials</div>
             <div class="cm-info__detail-value">Wood, Metal</div>
           </div>
           <div class="cm-info__detail">
             <div class="cm-info__detail-label">Pieces</div>
             <div class="cm-info__detail-value">X Items</div>
           </div>
         </div>
       </section>

       <!-- Gallery Section -->
       <section class="cm-gallery-section">
         <div class="cm-gallery-section__track">
           <div class="cm-gallery-section__item"><img src="assets/collections/{collection-name}/{collection-name}-1.jpg" alt="{Collection Name} 1" loading="lazy"></div>
           <div class="cm-gallery-section__item"><img src="assets/collections/{collection-name}/{collection-name}-2.jpg" alt="{Collection Name} 2" loading="lazy"></div>
           <!-- Add all images... -->
         </div>
         <span class="cm-gallery-section__hint">Drag to explore</span>
       </section>
     </div>
   </div>
   ```

5. **Repeat for all language versions** with translated content.

### Adding Images to Existing Collection

1. **Add images** to collection directory:
   ```bash
   # Copy new images
   cp new-image.jpg src/assets/collections/{collection-name}/{collection-name}-{n}.jpg
   ```

2. **Update gallery track** in all language versions:
   ```html
   <div class="cm-gallery-section__track">
     <!-- Existing images... -->
     <div class="cm-gallery-section__item"><img src="assets/collections/{collection-name}/{collection-name}-{n}.jpg" alt="{Collection Name} {n}" loading="lazy"></div>
   </div>
   ```

3. **Update piece count** in `.cm-info__details`:
   ```html
   <div class="cm-info__detail">
     <div class="cm-info__detail-label">Pieces</div>
     <div class="cm-info__detail-value">{new count} Items</div>
   </div>
   ```

## Components

### Card Morph Gallery

Interactive morphing card gallery with full-screen views and draggable image galleries.

**Documentation**: `components/card-morph/docs/`
- `README.md` - Full guide and HTML structure
- `API.md` - JavaScript API reference
- `CSS-REFERENCE.md` - Theming and CSS variables

**Initialization** (in `app.js`):
```javascript
CardMorph.initAll('[data-card-morph]', {
  duration: 0.6,
  smoothScroll: false
});
```

**Features**:
- GSAP Flip API for smooth card-to-view morphing
- Draggable horizontal galleries
- Keyboard navigation (Arrow keys, Esc)
- WCAG 2.1 compliant
- Lightbox for image zoom

### Main App Components (app.js)

Class-based components in IIFE pattern:

- **HeroSlideshow** - Crossfade background images every 4.5s
- **TextSplitter** - Character-by-character text reveal animation
- **FlipCard** - Interactive flip cards (legacy, partially replaced by card-morph)
- **Smart Header** - Hide on scroll down, show on scroll up
- **Scroll Animations** - GSAP ScrollTrigger effects

## Dependencies

All dependencies loaded via CDN (no npm):

```html
<!-- GSAP Core + Plugins -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Flip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js"></script>

<!-- Lenis Smooth Scroll -->
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
```

## Styling

### CSS Architecture

- **Global styles**: `css/styles.css`
- **Component styles**: `components/card-morph/dist/card-morph.css`
- **BEM naming**: Card morph uses `cm-` prefix
- **CSS Custom Properties**: Used for theming

### Fonts

```css
/* Google Fonts */
font-family: 'Inter', sans-serif;        /* Body text */
font-family: 'Instrument Sans', sans-serif; /* Headings */
```

## Deployment

Deployed to Vercel. Configuration in `/Users/filipegarrido/elitedecor-vanilla/vercel.json`.

### Vercel Configuration

```json
{
  "outputDirectory": "src",
  "cleanUrls": true,
  "trailingSlash": true,
  "rewrites": [
    { "source": "/pt", "destination": "/pt/index.html" },
    { "source": "/ru", "destination": "/ru/index.html" }
  ]
}
```

### Build Process

No build process required. Vercel serves the `src/` directory directly as static files.

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- **Lazy loading**: Images use `loading="lazy"` attribute
- **Preconnect**: Google Fonts preconnected
- **CDN**: Dependencies loaded from jsDelivr/unpkg
- **No bundling**: Direct HTML/CSS/JS serving

## Accessibility

- **ARIA labels**: All interactive elements labeled
- **Keyboard navigation**: Full keyboard support in galleries
- **Focus management**: Proper focus trapping in modals
- **Screen readers**: Announcements for dynamic content
- **Semantic HTML**: Proper heading hierarchy and landmarks

## Common Issues

### Card Morph Not Working

**Symptoms**: Cards don't morph or gallery doesn't open

**Solutions**:
1. Check browser console for errors
2. Verify GSAP dependencies loaded before card-morph.js
3. Ensure `data-cm-view-id` matches view `id` attribute
4. Check that view exists with correct ID format: `{view-id}-view`

### Language Links Broken

**Symptoms**: 404 errors on `/pt/` or `/ru/`

**Solutions**:
1. Verify `vercel.json` contains correct rewrites
2. Check that `src/pt/index.html` and `src/ru/index.html` exist
3. Test locally with `npx serve src` to simulate Vercel routing

### Images Not Loading

**Symptoms**: Broken image icons or 404 errors

**Solutions**:
1. Check image paths relative to HTML file location
2. For `/pt/index.html` and `/ru/index.html`, use `../assets/` paths
3. Verify images exist in `src/assets/` directory

## Testing

### Manual Testing Checklist

- [ ] All language versions load correctly
- [ ] Language switcher works
- [ ] Hero slideshow transitions smoothly
- [ ] Cards morph into full-screen views
- [ ] Gallery dragging works
- [ ] Lightbox opens and closes
- [ ] Keyboard navigation works (Tab, Enter, Esc, Arrows)
- [ ] Mobile responsive design works
- [ ] All images load correctly

### Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Support

For questions or issues:
- Email: geral@elitedecor.pt
- Phone: +351 917 591 176
- Instagram: [@elitedecor.pt](https://www.instagram.com/elitedecor.pt/)
- Facebook: [elitedecor.pt](https://www.facebook.com/elitedecor.pt/)
