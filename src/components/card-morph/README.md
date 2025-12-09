# Card Morph Gallery

A high-performance, morphing card gallery component built with GSAP. Features smooth animations, draggable galleries, a modern lightbox, and full accessibility support.

**Version:** 1.0.0 | **License:** MIT

## Quick Start

### 1. Include Files

```html
<!-- CSS -->
<link rel="stylesheet" href="dist/card-morph.css">

<!-- Dependencies -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js"></script>

<!-- Card Morph -->
<script src="dist/card-morph.js"></script>
```

### 2. Add HTML

```html
<div class="cm-gallery" data-card-morph>
  <!-- Card -->
  <article class="cm-card" data-cm-view-id="noble">
    <img class="cm-card__image" src="image.jpg" alt="Noble Collection">
    <h3 class="cm-card__title">Noble</h3>
  </article>

  <!-- View -->
  <div id="noble-view" class="cm-view" aria-hidden="true">
    <div class="cm-view__inner">
      <button class="cm-view__close" aria-label="Close"></button>
      <!-- Hero, Info, Gallery sections -->
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

## Features

- GSAP-powered animations with ScrollTrigger
- Draggable horizontal gallery with momentum
- Modern lightbox (native `<dialog>` element)
- Full keyboard & touch support
- 40+ CSS custom properties for theming
- Screen reader accessible
- Zero jQuery dependency

## Documentation

| Document | Description |
|----------|-------------|
| [**Full Guide**](./docs/README.md) | Comprehensive documentation |
| [**API Reference**](./docs/API.md) | JavaScript API & events |
| [**CSS Reference**](./docs/CSS-REFERENCE.md) | Theming & custom properties |
| [**Changelog**](./docs/CHANGELOG.md) | Version history |

## Examples

- [Basic Example](./examples/basic.html) - Simple two-card demo

## Basic Configuration

```javascript
CardMorph.initAll('[data-card-morph]', {
  duration: 0.6,           // Animation duration
  smoothScroll: false,     // Disable Lenis (for simple pages)
  cardStacking: true,      // Enable scroll stacking
  onOpen: (card, view) => console.log('Opened:', card)
});
```

## Theming

```css
.cm-gallery {
  --cm-color-background: #0a0a0a;
  --cm-color-accent: #d4af37;
  --cm-card-border-radius: 27px;
}
```

## Dependencies

| Package | Required | Purpose |
|---------|----------|---------|
| GSAP 3.x | Yes | Animations |
| ScrollTrigger | No | Card stacking |
| Draggable | No | Gallery drag |
| Lenis | No | Smooth scroll |

## Browser Support

Chrome 88+ | Firefox 78+ | Safari 14+ | Edge 88+

## File Structure

```
card-morph/
├── dist/
│   ├── card-morph.js
│   └── card-morph.css
├── docs/
│   ├── README.md
│   ├── API.md
│   ├── CSS-REFERENCE.md
│   └── CHANGELOG.md
├── examples/
│   └── basic.html
└── README.md (this file)
```

## License

MIT - see LICENSE file for details.

## Credits

Built with [GSAP](https://gsap.com/) and [Lenis](https://github.com/darkroomengineering/lenis).
