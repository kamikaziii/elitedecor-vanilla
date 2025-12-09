# Card Morph CSS Reference

Complete CSS documentation including custom properties, BEM classes, and theming guide.

**Related Documentation:**
- [Full Guide](./README.md) - HTML structure, installation, accessibility
- [API Reference](./API.md) - JavaScript API and events
- [Changelog](./CHANGELOG.md) - Version history

## Table of Contents

- [CSS Custom Properties](#css-custom-properties)
  - [Colors](#colors)
  - [Typography](#typography)
  - [Spacing](#spacing)
  - [Animation](#animation)
  - [Layout](#layout)
  - [Shadows](#shadows)
  - [Z-Index](#z-index)
- [BEM Class Reference](#bem-class-reference)
  - [Gallery Container](#gallery-container)
  - [Cards](#cards)
  - [Views](#views)
  - [Hero Section](#hero-section)
  - [Info Section](#info-section)
  - [Horizontal Gallery](#horizontal-gallery)
  - [Gallery Navigation](#gallery-navigation)
  - [Lightbox](#lightbox)
  - [Utilities](#utilities)
- [Theming Guide](#theming-guide)
  - [Dark Theme (Default)](#dark-theme-default)
  - [Light Theme](#light-theme)
  - [Custom Theme](#custom-theme)
  - [Brand Colors](#brand-colors)
- [Responsive Design](#responsive-design)
- [Reduced Motion](#reduced-motion)

---

## CSS Custom Properties

All custom properties use the `--cm-` prefix to avoid conflicts.

### Colors

| Property | Default | Description |
|----------|---------|-------------|
| `--cm-color-background` | `#0a0a0a` | Background for cards, views, and lightbox (gallery container is transparent) |
| `--cm-color-surface` | `#141414` | Card/element surfaces |
| `--cm-color-surface-elevated` | `#1a1a1a` | Elevated surfaces |
| `--cm-color-text` | `#ffffff` | Primary text color |
| `--cm-color-text-muted` | `rgba(255, 255, 255, 0.6)` | Secondary text |
| `--cm-color-text-subtle` | `rgba(255, 255, 255, 0.4)` | Subtle/hint text |
| `--cm-color-overlay` | `rgba(0, 0, 0, 0.9)` | Overlay background |
| `--cm-color-border` | `rgba(255, 255, 255, 0.1)` | Border color |
| `--cm-color-accent` | `#d4af37` | Accent/focus color |

### Typography

| Property | Default | Description |
|----------|---------|-------------|
| `--cm-font-family-display` | `'Instrument Sans', system-ui, sans-serif` | Headings font |
| `--cm-font-family-body` | `'Inter', system-ui, sans-serif` | Body text font |
| `--cm-font-size-xs` | `0.75rem` | Extra small (12px) |
| `--cm-font-size-sm` | `0.875rem` | Small (14px) |
| `--cm-font-size-base` | `1rem` | Base (16px) |
| `--cm-font-size-lg` | `1.25rem` | Large (20px) |
| `--cm-font-size-xl` | `1.5rem` | Extra large (24px) |
| `--cm-font-size-2xl` | `2rem` | 2X large (32px) |
| `--cm-font-size-3xl` | `3rem` | 3X large (48px) |
| `--cm-font-size-hero` | `clamp(3rem, 10vw, 8rem)` | Hero title (responsive) |

### Spacing

| Property | Default | Description |
|----------|---------|-------------|
| `--cm-spacing-xs` | `0.25rem` | 4px |
| `--cm-spacing-sm` | `0.5rem` | 8px |
| `--cm-spacing-md` | `1rem` | 16px |
| `--cm-spacing-lg` | `1.5rem` | 24px |
| `--cm-spacing-xl` | `2rem` | 32px |
| `--cm-spacing-2xl` | `3rem` | 48px |
| `--cm-spacing-3xl` | `4rem` | 64px |

### Animation

| Property | Default | Description |
|----------|---------|-------------|
| `--cm-duration-fast` | `0.2s` | Fast transitions |
| `--cm-duration-normal` | `0.4s` | Normal transitions |
| `--cm-duration-slow` | `0.6s` | Slow transitions |
| `--cm-duration-slower` | `0.8s` | Very slow transitions |
| `--cm-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default easing |
| `--cm-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Ease out |
| `--cm-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Ease in-out |

### Layout

| Property | Default | Description |
|----------|---------|-------------|
| `--cm-card-height` | `85vh` | Card height |
| `--cm-card-min-height` | `400px` | Minimum card height |
| `--cm-card-max-height` | `800px` | Maximum card height |
| `--cm-card-border-radius` | `27px` | Card corner radius |
| `--cm-gallery-gap` | `24px` | Gap between gallery items |
| `--cm-gallery-padding` | `40px` | Gallery section padding |

### Shadows

| Property | Default | Description |
|----------|---------|-------------|
| `--cm-shadow-sm` | `0 2px 8px rgba(0, 0, 0, 0.2)` | Small shadow |
| `--cm-shadow-md` | `0 4px 20px rgba(0, 0, 0, 0.3)` | Medium shadow |
| `--cm-shadow-lg` | `0 10px 40px rgba(0, 0, 0, 0.4)` | Large shadow |
| `--cm-shadow-xl` | `0 20px 60px rgba(0, 0, 0, 0.5)` | Extra large shadow |

### Z-Index

| Property | Default | Description |
|----------|---------|-------------|
| `--cm-z-card` | `1` | Card base level |
| `--cm-z-card-hover` | `10` | Card hover state |
| `--cm-z-view` | `2000` | Expanded view overlay |
| `--cm-z-view-close` | `2100` | View close button |
| `--cm-z-gallery-nav` | `100` | Gallery navigation |

---

## BEM Class Reference

Card Morph uses BEM (Block Element Modifier) naming with `cm-` prefix.

### Gallery Container

| Class | Description |
|-------|-------------|
| `.cm-gallery` | Main gallery container (transparent background by default) |
| `.cm-gallery--initialized` | Added after JS initialization |
| `.cm-gallery--light` | Light theme modifier |

**Note:** The gallery container uses `background: transparent` by default, allowing your page/body background to show through. Cards and views have their own backgrounds. To add a gallery background:

```css
.cm-gallery {
  background: var(--cm-color-background);
}
```

### Cards

| Class | Description |
|-------|-------------|
| `.cm-card` | Card block |
| `.cm-card__image` | Card background image |
| `.cm-card__title` | Card title overlay |
| `.cm-card__overlay` | Optional gradient overlay |

**States:**
- `:hover` - Scale up image
- `:focus-visible` - Accent outline

### Views

| Class | Description |
|-------|-------------|
| `.cm-view` | View block (hidden by default) |
| `.cm-view--active` | Visible/active state |
| `.cm-view__inner` | Inner content wrapper |
| `.cm-view__close` | Close button |

### Hero Section

| Class | Description |
|-------|-------------|
| `.cm-hero` | Hero block |
| `.cm-hero__background` | Background image container |
| `.cm-hero__content` | Content wrapper |
| `.cm-hero__title` | Hero title |
| `.cm-hero__title span` | Title line (stacked) |
| `.cm-hero__description` | Hero description text |

### Info Section

| Class | Description |
|-------|-------------|
| `.cm-info` | Info grid block |
| `.cm-info__description` | Left column - story content |
| `.cm-info__description h2` | Story heading |
| `.cm-info__description p` | Story paragraph |
| `.cm-info__details` | Right column - details list |
| `.cm-info__detail` | Single detail item |
| `.cm-info__detail-label` | Detail label (e.g., "Year") |
| `.cm-info__detail-value` | Detail value (e.g., "2024") |

### Horizontal Gallery

| Class | Description |
|-------|-------------|
| `.cm-gallery-section` | Gallery section block |
| `.cm-gallery-section__track` | Draggable track container |
| `.cm-gallery-section__item` | Individual gallery item |
| `.cm-gallery-section__item img` | Gallery image |
| `.cm-gallery-section__hint` | Drag hint text |

### Gallery Navigation

| Class | Description |
|-------|-------------|
| `.cm-gallery-nav` | Navigation container (auto-generated) |
| `.cm-gallery-nav__arrow` | Arrow button base |
| `.cm-gallery-nav__arrow--prev` | Previous arrow |
| `.cm-gallery-nav__arrow--next` | Next arrow |
| `.cm-gallery-nav__arrow--hidden` | Hidden state (at bounds) |

### Lightbox

| Class | Description |
|-------|-------------|
| `.cm-lightbox` | Lightbox dialog element |
| `.cm-lightbox__overlay` | Dark overlay background |
| `.cm-lightbox__container` | Main container |
| `.cm-lightbox__header` | Header with close button |
| `.cm-lightbox__close` | Close button |
| `.cm-lightbox__main` | Main content area |
| `.cm-lightbox__figure` | Image figure element |
| `.cm-lightbox__image-wrapper` | Image wrapper (for zoom) |
| `.cm-lightbox__image` | The image element |
| `.cm-lightbox__loader` | Loading spinner |
| `.cm-lightbox__caption` | Image caption |
| `.cm-lightbox__nav` | Navigation bar |
| `.cm-lightbox__prev` | Previous button |
| `.cm-lightbox__next` | Next button |
| `.cm-lightbox__counter` | Counter (e.g., "3 / 13") |
| `.cm-lightbox__current` | Current number |
| `.cm-lightbox__total` | Total number |

**States:**
- `[open]` - Dialog open state
- `[data-zoomed="true"]` - Image zoomed in (cursor: grab)
- `[data-zoomed="false"]` - Image normal (cursor: zoom-in)
- `:disabled` - Button disabled state

### Utilities

| Class | Description |
|-------|-------------|
| `.cm-sr-only` | Screen reader only (visually hidden) |
| `.cm-no-scroll` | Applied to body when view open |

---

## Theming Guide

### Dark Theme (Default)

The default theme is dark. No additional setup required.

```css
/* Default dark theme is applied automatically */
.cm-gallery {
  /* Uses default --cm-color-* values */
}
```

### Light Theme

Apply the light theme using the modifier class or data attribute:

```html
<!-- Option 1: Modifier class -->
<div class="cm-gallery cm-gallery--light" data-card-morph>

<!-- Option 2: Data attribute on parent -->
<div data-theme="light">
  <div class="cm-gallery" data-card-morph>
</div>
```

**Light Theme Values:**

```css
.cm-gallery--light,
[data-theme="light"] .cm-gallery {
  --cm-color-background: #ffffff;
  --cm-color-surface: #f8fafc;
  --cm-color-surface-elevated: #ffffff;
  --cm-color-text: #1e293b;
  --cm-color-text-muted: rgba(30, 41, 59, 0.7);
  --cm-color-text-subtle: rgba(30, 41, 59, 0.5);
  --cm-color-overlay: rgba(255, 255, 255, 0.95);
  --cm-color-border: rgba(0, 0, 0, 0.1);
}
```

### Custom Theme

Override CSS custom properties to create your own theme:

```css
/* Custom theme */
.cm-gallery.my-theme {
  /* Colors */
  --cm-color-background: #1a1b26;
  --cm-color-surface: #24283b;
  --cm-color-text: #c0caf5;
  --cm-color-text-muted: #9aa5ce;
  --cm-color-accent: #7aa2f7;

  /* Typography */
  --cm-font-family-display: 'Playfair Display', serif;
  --cm-font-family-body: 'Source Sans Pro', sans-serif;

  /* Animation - slower, more elegant */
  --cm-duration-normal: 0.5s;
  --cm-duration-slow: 0.8s;

  /* Layout */
  --cm-card-border-radius: 16px;
  --cm-gallery-gap: 32px;
}
```

### Brand Colors

Integrate your brand by setting the accent color:

```css
:root {
  /* Your brand color */
  --cm-color-accent: #e63946; /* Red */
  /* or */
  --cm-color-accent: #2a9d8f; /* Teal */
  /* or */
  --cm-color-accent: #f4a261; /* Orange */
}
```

The accent color is used for:
- Focus outlines
- Interactive element highlights
- Potential button states

---

## Complete Theme Example

```css
/* Luxury Gold Theme */
.cm-gallery.luxury-theme {
  /* Rich dark background */
  --cm-color-background: #0d0d0d;
  --cm-color-surface: #1a1a1a;
  --cm-color-surface-elevated: #262626;

  /* Warm text colors */
  --cm-color-text: #f5f5f5;
  --cm-color-text-muted: rgba(245, 245, 245, 0.7);
  --cm-color-text-subtle: rgba(245, 245, 245, 0.4);

  /* Gold accent */
  --cm-color-accent: #d4af37;
  --cm-color-border: rgba(212, 175, 55, 0.2);

  /* Elegant typography */
  --cm-font-family-display: 'Cormorant Garamond', serif;
  --cm-font-family-body: 'Montserrat', sans-serif;

  /* Smooth animations */
  --cm-duration-normal: 0.5s;
  --cm-ease-default: cubic-bezier(0.4, 0, 0.2, 1);

  /* Larger border radius */
  --cm-card-border-radius: 32px;

  /* More dramatic shadows */
  --cm-shadow-lg: 0 15px 50px rgba(0, 0, 0, 0.5);
  --cm-shadow-xl: 0 25px 80px rgba(0, 0, 0, 0.6);
}
```

---

## Responsive Design

Card Morph is mobile-first with desktop enhancements.

### Breakpoints

| Breakpoint | Description |
|------------|-------------|
| `< 768px` | Mobile (default styles) |
| `≥ 768px` | Tablet/Desktop enhancements |

### Mobile Adaptations

```css
/* Info section: single column on mobile */
@media (max-width: 768px) {
  .cm-info {
    grid-template-columns: 1fr;
  }
}

/* Gallery nav arrows hidden on mobile (use swipe) */
@media (max-width: 768px) {
  .cm-gallery-nav__arrow {
    display: none;
  }
}

/* Lightbox arrows at bottom on mobile */
@media (max-width: 767px) {
  .cm-lightbox__prev,
  .cm-lightbox__next {
    /* Positioned in nav bar at bottom */
  }
}

/* Lightbox arrows on sides for desktop */
@media (min-width: 768px) {
  .cm-lightbox__prev,
  .cm-lightbox__next {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
  }
  .cm-lightbox__prev { left: 2rem; }
  .cm-lightbox__next { right: 2rem; }
}
```

### Custom Responsive Overrides

```css
/* Example: Adjust card height on mobile */
@media (max-width: 768px) {
  .cm-gallery {
    --cm-card-height: 60vh;
    --cm-card-min-height: 300px;
    --cm-gallery-padding: 20px;
  }
}

/* Example: Larger text on desktop */
@media (min-width: 1200px) {
  .cm-gallery {
    --cm-font-size-hero: 10rem;
  }
}
```

---

## Reduced Motion

Card Morph respects the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  .cm-view {
    transition: none;
  }

  .cm-card__image {
    transition: none;
  }

  .cm-card:hover .cm-card__image {
    transform: none;
  }

  .cm-view__close:hover {
    transform: none;
  }

  .cm-gallery-section__item {
    transition: none;
  }

  .cm-gallery-section__item:hover {
    transform: none;
  }

  .cm-gallery-nav__arrow:hover {
    transform: translateY(-50%); /* No scale */
  }

  .cm-gallery-section__hint::after {
    animation: none;
  }
}
```

GSAP animations also respect reduced motion when properly configured.

---

## CSS Architecture

### File Organization

```
card-morph.css
├── CSS Custom Properties (:root)
├── Light theme override
├── Gallery Container (.cm-gallery)
├── Cards (.cm-card)
├── Views (.cm-view)
├── Hero Section (.cm-hero)
├── Info Section (.cm-info)
├── Horizontal Gallery (.cm-gallery-section)
├── Gallery Navigation (.cm-gallery-nav)
├── Lightbox (.cm-lightbox)
├── Utilities (.cm-sr-only, .cm-no-scroll)
└── Reduced Motion (@media)
```

### Specificity

All styles use single class selectors where possible for easy overriding:

```css
/* Low specificity - easy to override */
.cm-card { ... }
.cm-card__title { ... }

/* Override in your styles */
.my-gallery .cm-card__title {
  font-size: 3rem;
}
```

### CSS Isolation

The `cm-` prefix ensures styles don't conflict with your existing CSS:

```css
/* Card Morph styles won't affect your .card class */
.card { ... }       /* Your styles */
.cm-card { ... }    /* Card Morph styles */
```

---

## Customization Examples

### Rounded Cards

```css
.cm-gallery {
  --cm-card-border-radius: 50px;
}
```

### Full-Height Cards

```css
.cm-gallery {
  --cm-card-height: 100vh;
  --cm-card-max-height: none;
}
```

### Tighter Gallery Spacing

```css
.cm-gallery {
  --cm-gallery-gap: 12px;
  --cm-gallery-padding: 20px;
}
```

### Custom Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato&display=swap');

.cm-gallery {
  --cm-font-family-display: 'Playfair Display', serif;
  --cm-font-family-body: 'Lato', sans-serif;
}
```

### Slower Animations

```css
.cm-gallery {
  --cm-duration-fast: 0.3s;
  --cm-duration-normal: 0.6s;
  --cm-duration-slow: 1s;
}
```

### No Hover Effects

```css
.cm-card:hover .cm-card__image {
  transform: none;
}

.cm-gallery-section__item:hover {
  transform: none;
  box-shadow: none;
}
```
