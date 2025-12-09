# Elite Decor Vanilla

A modern, vanilla HTML/CSS/JavaScript replica of the Elite Decor website featuring smooth animations and a custom card morph gallery component.

## Features

- Pure HTML5, CSS3, and vanilla JavaScript (no frameworks)
- GSAP-powered animations with ScrollTrigger
- Smooth scrolling with Lenis
- Custom Card Morph gallery component
- Modern lightbox with native `<dialog>` element
- Fully responsive design
- Accessible (ARIA labels, keyboard navigation)

## Quick Start

### Option 1: Simple HTTP Server

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

### Option 3: VS Code

Use the Live Server extension and open `src/index.html`.

## Project Structure

```
elitedecor-vanilla/
├── src/                     # Website source files
│   ├── index.html           # Main homepage
│   ├── css/styles.css       # Main stylesheet
│   ├── js/app.js            # Main JavaScript
│   ├── assets/              # Images, fonts
│   └── components/
│       └── card-morph/      # Reusable component
│           ├── dist/        # JS & CSS files
│           ├── docs/        # Documentation
│           └── examples/    # Usage examples
├── vercel.json              # Deployment config
└── README.md
```

## Card Morph Component

A standalone, reusable gallery component with:
- Card-to-view morphing animations
- Draggable horizontal gallery
- Modern lightbox
- Full keyboard & touch support
- 40+ CSS custom properties for theming

See [Card Morph Documentation](src/components/card-morph/docs/README.md) for details.

## Dependencies (CDN)

- [GSAP 3.x](https://gsap.com/) - Animation library
- [Lenis](https://github.com/darkroomengineering/lenis) - Smooth scroll

## Deployment

This site is configured for Vercel deployment:

1. Connect your GitHub repo to Vercel
2. Vercel automatically serves the `src/` directory
3. Push to main branch to deploy

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## License

MIT

## Credits

- Original design inspired by [Elite Decor](https://elitedecor.pt)
- Built with [GSAP](https://gsap.com/) and [Lenis](https://github.com/darkroomengineering/lenis)
