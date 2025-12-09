/**
 * Elite Decor - Pixel-Perfect Replica JavaScript
 * Uses GSAP + ScrollTrigger + Lenis (2025 best practices)
 */

(function() {
  'use strict';

  // ==========================================================================
  // Smart Header - Hide on scroll down, show on scroll up
  // ==========================================================================

  function initSmartHeader() {
    let lastScroll = 0;
    const scrollThreshold = 50; // Minimum scroll before hiding

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Always show header at top of page
      if (currentScroll <= scrollThreshold) {
        document.body.classList.remove('header-hidden');
        lastScroll = currentScroll;
        return;
      }

      // Scrolling down - hide header
      if (currentScroll > lastScroll) {
        document.body.classList.add('header-hidden');
      }
      // Scrolling up - show header
      else if (currentScroll < lastScroll) {
        document.body.classList.remove('header-hidden');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ==========================================================================
  // Hero Slideshow - 4.5s interval crossfade
  // ==========================================================================

  class HeroSlideshow {
    constructor() {
      this.slides = document.querySelectorAll('.hero-slide');
      if (this.slides.length === 0) return;

      this.currentIndex = 0;
      this.interval = 4500; // 4.5 seconds
      this.start();
    }

    start() {
      setInterval(() => {
        this.next();
      }, this.interval);
    }

    next() {
      this.slides[this.currentIndex].classList.remove('active');
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.slides[this.currentIndex].classList.add('active');
    }
  }

  // ==========================================================================
  // Text Splitter - Split text into characters for animation
  // ==========================================================================

  class TextSplitter {
    constructor(element) {
      this.el = element;
      this.originalText = element.textContent;
      this.split();
    }

    split() {
      const text = this.originalText;
      const words = text.split(' ');
      let charIndex = 0;

      this.el.innerHTML = '';

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        [...word].forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char';
          charSpan.textContent = char;
          charSpan.style.setProperty('--char-index', charIndex);
          wordSpan.appendChild(charSpan);
          charIndex++;
        });

        this.el.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          const space = document.createTextNode(' ');
          this.el.appendChild(space);
        }
      });
    }
  }

  // ==========================================================================
  // Card Morph Component Initialization
  // ==========================================================================

  function initCardMorph() {
    if (typeof CardMorph === 'undefined') {
      console.warn('CardMorph not loaded');
      return null;
    }

    return CardMorph.initAll('[data-card-morph]', {
      duration: 0.6,
      smoothScroll: false, // Using our own Lenis instance
      cardStacking: true,
      lightbox: true,
      keyboard: true,
      draggable: true
    });
  }

  // ==========================================================================
  // Lightbox Component (WCAG 2.2 compliant)
  // ==========================================================================

  class Lightbox {
    constructor() {
      this.el = document.querySelector('.lightbox');
      if (!this.el) return;

      this.imgEl = this.el.querySelector('.lightbox-content img');
      this.currentEl = this.el.querySelector('.current');
      this.totalEl = this.el.querySelector('.total');
      this.images = [];
      this.currentIndex = 0;
      this.previouslyFocused = null;
      this.boundHandleKeydown = this.handleKeydown.bind(this);
      this.bindEvents();
    }

    bindEvents() {
      // Stop all clicks inside lightbox from propagating to elements behind
      this.el.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close only when clicking the backdrop (not buttons/content)
        if (e.target === this.el) this.close();
      });

      this.el.querySelector('.lightbox-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
      this.el.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
      this.el.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });

      let touchStartX = 0;
      this.el.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      this.el.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? this.next() : this.prev();
        }
      }, { passive: true });
    }

    handleKeydown(e) {
      if (this.el.hidden) return;

      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
        case 'Tab':
          this.trapFocus(e);
          break;
      }
    }

    trapFocus(e) {
      const focusable = this.el.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    open(images, index = 0) {
      this.images = images;
      this.currentIndex = index;
      this.render();
      this.previouslyFocused = document.activeElement;
      this.el.hidden = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', this.boundHandleKeydown);

      requestAnimationFrame(() => {
        this.el.querySelector('.lightbox-close')?.focus();
      });

      announce(`Gallery opened, image ${index + 1} of ${images.length}`);
    }

    close() {
      this.el.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this.boundHandleKeydown);

      if (this.previouslyFocused?.focus) {
        this.previouslyFocused.focus();
      }
      announce('Gallery closed');
    }

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.render();
      announce(`Image ${this.currentIndex + 1} of ${this.images.length}`);
    }

    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.render();
      announce(`Image ${this.currentIndex + 1} of ${this.images.length}`);
    }

    render() {
      if (this.imgEl) {
        this.imgEl.src = this.images[this.currentIndex];
        this.imgEl.alt = `Image ${this.currentIndex + 1}`;
      }
      if (this.currentEl) this.currentEl.textContent = this.currentIndex + 1;
      if (this.totalEl) this.totalEl.textContent = this.images.length;
    }
  }

  // ==========================================================================
  // Accessibility Announcer
  // ==========================================================================

  function announce(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }

  // ==========================================================================
  // Initialize Lenis Smooth Scroll
  // ==========================================================================

  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not loaded, using native scroll');
      return null;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate with GSAP
    if (typeof gsap !== 'undefined' && gsap.ticker) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback RAF loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    return lenis;
  }

  // ==========================================================================
  // Initialize GSAP ScrollTrigger Animations
  // ==========================================================================

  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded, using fallback animations');
      initFallbackAnimations();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero title animation on load
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.classList.add('animated');
    }

    // What We Do section - letter animation
    const whatWeDo = document.querySelector('.what-we-do');
    if (whatWeDo) {
      const splitText = whatWeDo.querySelector('.split-text');

      ScrollTrigger.create({
        trigger: whatWeDo,
        start: 'top 80%',
        onEnter: () => {
          if (splitText) {
            splitText.classList.add('animated');
          }
        }
      });
    }

    // Cards stacking effect
    initCardStacking();

    // Cards hint visibility
    const cardsHint = document.querySelector('.cards-hint');
    const cardsSection = document.querySelector('.cards-section');
    if (cardsHint && cardsSection) {
      ScrollTrigger.create({
        trigger: cardsSection,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => cardsHint.classList.add('visible'),
        onLeave: () => cardsHint.classList.remove('visible'),
        onEnterBack: () => cardsHint.classList.add('visible'),
        onLeaveBack: () => cardsHint.classList.remove('visible')
      });
    }

    // How It Works section reveal
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      gsap.fromTo(step,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          delay: index * 0.1
        }
      );
    });

    // Footer reveal
    const footer = document.querySelector('.site-footer');
    if (footer) {
      gsap.fromTo(footer,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // ==========================================================================
  // Card Stacking Effect (GSAP ScrollTrigger)
  // ==========================================================================

  function initCardStacking() {
    const cards = gsap.utils.toArray('.cm-card');

    if (cards.length === 0) return;

    const lastCard = cards[cards.length - 1];

    // All cards pin at center and stay pinned until the LAST card is also centered
    cards.forEach((card, index) => {
      const isLast = index === cards.length - 1;

      if (!isLast) {
        ScrollTrigger.create({
          trigger: card,
          start: 'center center',
          endTrigger: lastCard,
          end: 'center center', // Unpin when last card center reaches viewport center
          pin: true,
          pinSpacing: false
        });
      }
    });
  }

  // ==========================================================================
  // Fallback Animations (no GSAP)
  // ==========================================================================

  function initFallbackAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('.split-text').forEach(el => el.classList.add('animated'));
      document.querySelector('.hero-title')?.classList.add('animated');
      return;
    }

    // Hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.classList.add('animated');
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;

            if (el.classList.contains('what-we-do')) {
              const splitText = el.querySelector('.split-text');
              if (splitText) {
                setTimeout(() => splitText.classList.add('animated'), 200);
              }
            }

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.what-we-do').forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // Initialize Split Text
  // ==========================================================================

  function initSplitText() {
    document.querySelectorAll('[data-split="chars"]').forEach(el => {
      new TextSplitter(el);
    });
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    // Initialize smart header (hide on scroll down, show on scroll up)
    initSmartHeader();

    // Initialize hero slideshow (4.5s interval)
    new HeroSlideshow();

    // Split text for letter animations
    initSplitText();

    // Initialize Card Morph component
    initCardMorph();

    // Initialize lightbox (fallback for non-card-morph content)
    window.lightbox = new Lightbox();

    // Initialize Lenis smooth scroll
    const lenis = initLenis();

    // Initialize scroll animations
    initScrollAnimations();

    console.log('Elite Decor initialized with Card Morph (GSAP + Lenis)');
  });

})();
