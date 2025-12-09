# Card Morph Gallery

A high-performance, morphing card gallery component built with GSAP. Features smooth animations, draggable galleries, a modern lightbox, and full accessibility support.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [HTML Structure](#html-structure)
  - [Gallery Container](#gallery-container)
  - [Cards](#cards)
  - [Views](#views)
  - [Hero Section](#hero-section)
  - [Info Section](#info-section)
  - [Horizontal Gallery](#horizontal-gallery)
- [Data Attributes](#data-attributes)
- [JavaScript Initialization](#javascript-initialization)
- [Lightbox](#lightbox)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

---

## Features

- **GSAP-Powered Animations** - Smooth morph animations using ScrollTrigger, Flip, and Draggable
- **Card Stacking Effect** - Scroll-triggered stacking with pinning
- **Lenis Smooth Scroll** - Optional buttery smooth scroll experience
- **Draggable Horizontal Gallery** - Drag, swipe, or use arrows to navigate
- **Modern Lightbox** - Native `<dialog>` element with GSAP animations
- **Full Keyboard Navigation** - Arrow keys, Escape to close
- **Touch Gestures** - Swipe support for mobile devices
- **Touchpad Support** - Horizontal scroll with trackpad gestures
- **Browser Gesture Prevention** - Prevents accidental browser back/forward
- **Responsive Design** - Mobile-first with desktop enhancements
- **Accessible** - ARIA labels, focus management, screen reader announcements
- **CSS Custom Properties** - 40+ variables for complete theming control
- **BEM Naming** - Scoped styles with `cm-` prefix that don't conflict
- **Zero Dependencies (except GSAP)** - Pure vanilla JavaScript
- **UMD + ES Module Support** - Works with bundlers or script tags

---

## Quick Start

### 1. Include the Files

```html
<!-- CSS -->
<link rel="stylesheet" href="path/to/card-morph.css">

<!-- Dependencies -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js"></script>

<!-- Card Morph -->
<script src="path/to/card-morph.js"></script>
```

### 2. Add the HTML

```html
<div class="cm-gallery" data-card-morph>
  <!-- Card -->
  <article class="cm-card" data-cm-view-id="noble">
    <img class="cm-card__image" src="card-image.jpg" alt="Noble Collection">
    <h3 class="cm-card__title">Noble</h3>
  </article>

  <!-- View (Expanded State) -->
  <div id="noble-view" class="cm-view" aria-hidden="true">
    <div class="cm-view__inner">
      <button class="cm-view__close" aria-label="Close view"></button>
      <!-- Content sections here -->
    </div>
  </div>
</div>
```

### 3. Initialize

```javascript
document.addEventListener('DOMContentLoaded', () => {
  CardMorph.initAll();
});
```

---

## Installation

### CDN (Recommended for Quick Setup)

```html
<!-- Required: GSAP Core -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

<!-- Optional but Recommended: GSAP Plugins -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Flip.min.js"></script>

<!-- Optional: Lenis Smooth Scroll -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>

<!-- Card Morph -->
<link rel="stylesheet" href="path/to/card-morph.css">
<script src="path/to/card-morph.js"></script>
```

### Local Files

1. Download `card-morph.js` and `card-morph.css` from the `dist/` folder
2. Include them in your project
3. Ensure GSAP is loaded before Card Morph

### NPM (Coming Soon)

```bash
npm install card-morph gsap lenis
```

---

## Dependencies

| Dependency | Required | Purpose |
|------------|----------|---------|
| **GSAP 3.x** | Yes | Core animation library |
| **ScrollTrigger** | No | Card stacking effect on scroll |
| **Draggable** | No | Gallery drag functionality |
| **Flip** | No | Advanced morph animations |
| **Lenis** | No | Smooth scroll experience |

### Registering Dependencies Manually

If using ES modules or a bundler:

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import Lenis from 'lenis';

CardMorph.registerDependencies({
  gsap,
  ScrollTrigger,
  Draggable,
  Lenis
});
```

---

## HTML Structure

### Gallery Container

The main container wraps all cards and their corresponding views.

```html
<div class="cm-gallery" data-card-morph>
  <!-- Cards and Views go here -->
</div>
```

| Class | Required | Description |
|-------|----------|-------------|
| `cm-gallery` | Yes | Main container class |
| `data-card-morph` | Yes | Initialization marker |

### Cards

Cards are the clickable elements that open views.

```html
<article class="cm-card" data-cm-view-id="noble" tabindex="0" role="button" aria-label="View Noble Collection">
  <img class="cm-card__image" src="image.jpg" alt="Noble Collection">
  <h3 class="cm-card__title">Noble</h3>
  <div class="cm-card__overlay"></div> <!-- Optional gradient overlay -->
</article>
```

| Element | Required | Description |
|---------|----------|-------------|
| `.cm-card` | Yes | Card container |
| `.cm-card__image` | Yes | Card background image |
| `.cm-card__title` | Yes | Card title text |
| `.cm-card__overlay` | No | Optional gradient overlay |
| `data-cm-view-id` | Yes | Links to corresponding view |
| `data-collection` | No | Alternative to `data-cm-view-id` (legacy support) |
| `tabindex="0"` | Recommended | Enables keyboard focus |
| `role="button"` | Recommended | ARIA role for accessibility |

### Views

Views are the expanded full-screen states that appear when a card is clicked.

```html
<div id="noble-view" class="cm-view" aria-hidden="true">
  <div class="cm-view__inner">
    <button class="cm-view__close" aria-label="Close view"></button>

    <!-- Hero Section -->
    <section class="cm-hero">...</section>

    <!-- Info Section -->
    <section class="cm-info">...</section>

    <!-- Gallery Section -->
    <section class="cm-gallery-section">...</section>
  </div>
</div>
```

**Linking Cards to Views:** The view can be linked using either method:
1. An `id` following the pattern: `{data-cm-view-id}-view` (e.g., `id="noble-view"`)
2. A `data-cm-view-for` attribute matching the card's view ID (e.g., `data-cm-view-for="noble"`)

| Element | Required | Description |
|---------|----------|-------------|
| `.cm-view` | Yes | View container |
| `.cm-view__inner` | Yes | Inner wrapper for content |
| `.cm-view__close` | Yes | Close button |
| `id="{viewId}-view"` | Yes* | Must match card's `data-cm-view-id` + "-view" |
| `data-cm-view-for` | No | Alternative to ID pattern (e.g., `data-cm-view-for="noble"`) |
| `aria-hidden="true"` | Recommended | Initial hidden state for screen readers |

*Either `id` or `data-cm-view-for` is required, not both.

### Hero Section

Full-viewport hero with background image and content overlay.

```html
<section class="cm-hero">
  <div class="cm-hero__background">
    <img src="hero-image.jpg" alt="">
  </div>
  <div class="cm-hero__content">
    <h1 class="cm-hero__title">
      <span>Collection</span>
      <span>Name</span>
    </h1>
    <p class="cm-hero__description">Description text goes here.</p>
  </div>
</section>
```

### Info Section

Two-column layout for story and details.

```html
<section class="cm-info">
  <div class="cm-info__description">
    <h2>The Story</h2>
    <p>Story content...</p>
  </div>
  <div class="cm-info__details">
    <div class="cm-info__detail">
      <div class="cm-info__detail-label">Year</div>
      <div class="cm-info__detail-value">2024</div>
    </div>
    <div class="cm-info__detail">
      <div class="cm-info__detail-label">Materials</div>
      <div class="cm-info__detail-value">Wood, Metal</div>
    </div>
    <div class="cm-info__detail">
      <div class="cm-info__detail-label">Pieces</div>
      <div class="cm-info__detail-value">12 Items</div>
    </div>
  </div>
</section>
```

### Horizontal Gallery

Draggable horizontal gallery with images that open in the lightbox.

```html
<section class="cm-gallery-section">
  <div class="cm-gallery-section__track">
    <div class="cm-gallery-section__item">
      <img src="gallery-1.jpg" alt="Image 1" loading="lazy">
    </div>
    <div class="cm-gallery-section__item">
      <img src="gallery-2.jpg" alt="Image 2" loading="lazy">
    </div>
    <!-- More items... -->
  </div>
  <span class="cm-gallery-section__hint">Drag to explore</span>
</section>
```

| Element | Description |
|---------|-------------|
| `.cm-gallery-section` | Container with overflow hidden |
| `.cm-gallery-section__track` | Draggable horizontal track |
| `.cm-gallery-section__item` | Individual gallery item (clickable for lightbox) |
| `.cm-gallery-section__hint` | Optional hint text |

---

## Data Attributes

Configure Card Morph via HTML data attributes:

```html
<div
  data-card-morph
  data-cm-duration="0.8"
  data-cm-ease="power3.inOut"
  data-cm-draggable="true"
  data-cm-keyboard="true"
  data-cm-smooth-scroll="false"
  data-cm-card-stacking="true"
  data-cm-scroll-step="500"
  data-cm-lightbox="true"
>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-card-morph` | - | - | Required initialization marker |
| `data-card-morph-auto` | - | - | Auto-initialize on DOM ready (no JS needed) |
| `data-cm-duration` | number | 0.6 | Animation duration in seconds |
| `data-cm-ease` | string | power2.inOut | GSAP easing function |
| `data-cm-draggable` | boolean | true | Enable gallery dragging |
| `data-cm-keyboard` | boolean | true | Enable keyboard navigation |
| `data-cm-smooth-scroll` | boolean | true | Enable Lenis smooth scroll |
| `data-cm-card-stacking` | boolean | true | Enable scroll-triggered card stacking |
| `data-cm-scroll-step` | number | 400 | Pixels per arrow key press |
| `data-cm-lightbox` | boolean | true | Enable lightbox on gallery images |

**Note:** Data attributes override JavaScript options when both are provided.

### Auto-Initialization

For simple cases, you can skip JavaScript entirely by using `data-card-morph-auto`:

```html
<div class="cm-gallery" data-card-morph-auto>
  <!-- Cards and views -->
</div>
<!-- No JavaScript initialization needed! -->
```

---

## JavaScript Initialization

### Basic Initialization

```javascript
// Auto-initialize all [data-card-morph] elements
CardMorph.initAll();

// With options
CardMorph.initAll('[data-card-morph]', {
  duration: 0.8,
  smoothScroll: false
});
```

### Manual Initialization

```javascript
const gallery = new CardMorph('#my-gallery', {
  duration: 0.6,
  ease: 'power2.inOut',
  draggable: true,
  keyboard: true,
  smoothScroll: true,
  onOpen: (card, view) => {
    console.log('Opened:', card);
  },
  onClose: (card, view) => {
    console.log('Closed:', card);
  }
});
```

### Dynamic Content

```javascript
// Enable auto-initialization for dynamically added content
CardMorph.enableAutoInit('[data-card-morph]', {
  smoothScroll: false
});

// Later, disable it
CardMorph.disableAutoInit();
```

For complete API documentation, see [API.md](./API.md).

---

## Lightbox

The lightbox automatically activates when clicking images in the horizontal gallery.

### Features

- Native `<dialog>` element (2025 best practice)
- GSAP-powered open/close animations
- Image preloading for adjacent images
- Touch swipe navigation (50px threshold)
- Keyboard navigation (arrows + escape)
- Focus trapping for accessibility
- Counter showing current position
- Responsive design (arrows on sides for desktop, bottom for mobile)

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` Arrow Left | Previous image |
| `→` Arrow Right | Next image |
| `Escape` | Close lightbox |

### Touch Gestures

| Gesture | Action |
|---------|--------|
| Swipe Left | Next image |
| Swipe Right | Previous image |
| Tap outside image | Close lightbox |

### Click Behavior

- **Click overlay/background** - Closes lightbox
- **Click main content area** - Closes lightbox
- **Click on image** - Does not close (allows viewing)
- **Click navigation arrows** - Navigate images
- **Click close button (X)** - Closes lightbox

---

## Accessibility

Card Morph is built with accessibility in mind:

### Keyboard Navigation

| Key | Context | Action |
|-----|---------|--------|
| `Tab` | Anywhere | Navigate between focusable elements |
| `Enter` / `Space` | Card focused | Open the view |
| `Escape` | View open | Close the view |
| `←` / `→` | Gallery visible | Scroll gallery left/right |
| `Escape` | Lightbox open | Close lightbox |
| `←` / `→` | Lightbox open | Navigate images |

### ARIA Attributes

```html
<!-- Card -->
<article class="cm-card"
  tabindex="0"
  role="button"
  aria-label="View Noble Collection">

<!-- View -->
<div class="cm-view" aria-hidden="true">

<!-- Close Button -->
<button class="cm-view__close" aria-label="Close view">

<!-- Gallery Item -->
<div class="cm-gallery-section__item"
  tabindex="0"
  role="button"
  aria-label="View image 1: Noble Collection">
```

### Screen Reader Announcements

Card Morph announces state changes to screen readers:

- "Opened {collection} view"
- "View closed"
- "Image gallery opened. Image 1 of 13"
- "Image 3 of 13"
- "Gallery closed"

### Focus Management

- Focus moves to close button when view opens
- Focus returns to the triggering card when view closes
- Focus is trapped within lightbox when open
- Focus returns to gallery item when lightbox closes

### Reduced Motion

Respects `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  .cm-view { transition: none; }
  .cm-card__image { transition: none; }
  /* ... animations disabled */
}
```

---

## Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 88+ | Full support |
| Firefox | 78+ | Full support |
| Safari | 14+ | Full support |
| Edge | 88+ | Full support |

### Required Features

- CSS Custom Properties
- CSS Grid & Flexbox
- Native `<dialog>` element
- ES6+ JavaScript

---

## Troubleshooting

### Cards Not Clickable

1. Ensure `data-cm-view-id` matches the view's ID pattern (`{id}-view`)
2. Check that CardMorph is initialized after DOM is ready
3. Verify GSAP is loaded before card-morph.js

### View Not Opening

```javascript
// Check if instance exists
const instance = CardMorph.getInstance(element);
console.log(instance);

// Listen for errors
document.querySelector('[data-card-morph]').addEventListener('cardmorph:init', (e) => {
  console.log('Initialized:', e.detail);
});
```

### Gallery Not Draggable

1. Ensure GSAP Draggable plugin is loaded
2. Check that `draggable: true` option is set
3. Verify images have loaded (draggable calculates bounds)

### Smooth Scroll Issues

1. Disable with `smoothScroll: false` for simple pages
2. Check Lenis is loaded if enabled
3. Adjust Lenis options for faster/slower scroll:

```javascript
CardMorph.initAll('[data-card-morph]', {
  smoothScroll: true,
  lenis: {
    duration: 0.8,  // Faster than default 1.2
    smoothWheel: true
  }
});
```

**Note:** Lenis smooth scroll is automatically disabled inside opened views to allow normal scrolling within view content. This prevents conflicts between the page-level smooth scroll and scrollable content within views.

### Lightbox Keyboard Events Affecting Gallery

This is fixed in the latest version. The lightbox uses event capturing to prevent keyboard events from propagating to the gallery behind it.

### Performance Issues

1. Use `loading="lazy"` on gallery images
2. Optimize image sizes for web
3. Disable card stacking on pages with many cards:
   ```javascript
   CardMorph.initAll('[data-card-morph]', {
     cardStacking: false
   });
   ```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Card Morph Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │     CardMorph        │      │      Lightbox        │        │
│  │   (Main Class)       │─────▶│   (Static Class)     │        │
│  │                      │      │                      │        │
│  │ • Card click → View  │      │ • Gallery img click  │        │
│  │ • View animations    │      │ • Image navigation   │        │
│  │ • Gallery setup      │      │ • Touch swipe        │        │
│  │ • Keyboard nav       │      │ • Keyboard nav       │        │
│  └──────────┬───────────┘      └──────────────────────┘        │
│             │                                                    │
│             ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                   Dependencies                        │      │
│  │                                                       │      │
│  │  ┌────────┐  ┌───────────────┐  ┌─────────────────┐ │      │
│  │  │  GSAP  │  │ ScrollTrigger │  │     Lenis       │ │      │
│  │  │  Core  │  │   Draggable   │  │ (Smooth Scroll) │ │      │
│  │  │(Req'd) │  │     Flip      │  │   (Optional)    │ │      │
│  │  └────────┘  │  (Optional)   │  └─────────────────┘ │      │
│  │              └───────────────┘                       │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                    CSS Layer                          │      │
│  │                                                       │      │
│  │  • 40+ CSS Custom Properties for theming             │      │
│  │  • BEM naming with cm- prefix                        │      │
│  │  • Responsive breakpoints                            │      │
│  │  • Reduced motion support                            │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Initialization**: `CardMorph.initAll()` finds all `[data-card-morph]` containers
2. **Card Click**: Triggers `#openView()` → animates view → initializes gallery
3. **Gallery Setup**: Creates Draggable, navigation arrows, binds lightbox
4. **Lightbox Open**: `Lightbox.open()` creates `<dialog>`, animates in
5. **Close**: Reverses animations, cleans up event listeners, restores focus

---

## Related Documentation

- [API Reference](./API.md) - Complete JavaScript API documentation
- [CSS Reference](./CSS-REFERENCE.md) - Theming and CSS custom properties
- [Changelog](./CHANGELOG.md) - Version history and migration guides

---

## License

MIT License - see LICENSE file for details.

---

## Credits

Built with:
- [GSAP](https://gsap.com/) by GreenSock
- [Lenis](https://github.com/darkroomengineering/lenis) by darkroom.engineering
