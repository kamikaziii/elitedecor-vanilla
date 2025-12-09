/**
 * Elite Decor - Automatic Language Detection
 * Detects browser language and redirects to appropriate version
 * Stores user preference in localStorage
 */
(function() {
  'use strict';

  var SUPPORTED_LANGS = ['pt', 'en', 'ru'];
  var LANG_PATHS = { pt: '/', en: '/en/', ru: '/ru/' };
  var STORAGE_KEY = 'elite-decor-lang';

  /**
   * Get current page language from URL path
   */
  function getCurrentLang() {
    var path = window.location.pathname;
    if (path.indexOf('/en/') === 0 || path === '/en') return 'en';
    if (path.indexOf('/ru/') === 0 || path === '/ru') return 'ru';
    return 'pt'; // Root = Portuguese (default)
  }

  /**
   * Detect browser's preferred language
   */
  function getBrowserLang() {
    var lang = (navigator.language || navigator.userLanguage || 'pt').toLowerCase();
    var primary = lang.split('-')[0];
    return SUPPORTED_LANGS.indexOf(primary) !== -1 ? primary : 'pt';
  }

  /**
   * Check localStorage for stored preference
   */
  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Store language preference
   */
  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Main detection and redirect logic
   */
  function detectAndRedirect() {
    var stored = getStoredLang();
    var current = getCurrentLang();

    // If user has stored preference and it differs from current, redirect
    if (stored && stored !== current && LANG_PATHS[stored]) {
      window.location.replace(LANG_PATHS[stored]);
      return;
    }

    // If no preference stored (first visit), detect browser language
    if (!stored) {
      var browser = getBrowserLang();
      storeLang(browser);

      // Redirect if browser language differs from current
      if (browser !== current) {
        window.location.replace(LANG_PATHS[browser]);
        return;
      }
    }
  }

  /**
   * Handle language switcher clicks - store preference
   */
  function initSwitcherHandlers() {
    var links = document.querySelectorAll('.lang-switcher a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        var lang = this.getAttribute('hreflang');
        if (lang) storeLang(lang);
      });
    }
  }

  // Run detection immediately (before DOM loads)
  detectAndRedirect();

  // Set up switcher handlers when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitcherHandlers);
  } else {
    initSwitcherHandlers();
  }
})();
