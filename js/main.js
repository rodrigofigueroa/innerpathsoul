/* ============================================
   INNER PATH — Comportamiento del sitio
   ============================================ */
(function () {
  'use strict';

  /* ---------- Selector de idioma ---------- */
  var STORAGE_KEY = 'innerpath-lang';

  function getPreferredLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* almacenamiento no disponible */ }
    if (saved === 'es' || saved === 'en') return saved;
    var browserLang = (navigator.language || 'es').toLowerCase();
    return browserLang.indexOf('es') === 0 ? 'es' : 'en';
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);

    var nodes = document.querySelectorAll('[lang-content]');
    nodes.forEach(function (node) {
      var isMatch = node.getAttribute('lang-content') === lang;
      node.classList.toggle('is-active', isMatch);
      node.setAttribute('aria-hidden', isMatch ? 'false' : 'true');
    });

    var buttons = document.querySelectorAll('[data-lang-btn]');
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang-btn') === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* almacenamiento no disponible */ }
  }

  function initLangSwitch() {
    var lang = getPreferredLang();
    applyLang(lang);

    var buttons = document.querySelectorAll('[data-lang-btn]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang-btn'));
      });
    });
  }

  /* ---------- Menú móvil ---------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.mobile-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Carrusel de testimoniales ---------- */
  function initTestimonialCarousel() {
    var track = document.querySelector('.testimonial-carousel');
    if (!track) return;

    var prevBtn = document.querySelector('[data-carousel-prev]');
    var nextBtn = document.querySelector('[data-carousel-next]');
    var scrollAmount = function () {
      var card = track.querySelector('.testimonial-card');
      return card ? card.offsetWidth + 24 : 280;
    };

    if (prevBtn) prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    /* Reproducción de video al hacer clic en play, pausa al salir de vista */
    var cards = track.querySelectorAll('.testimonial-card');
    cards.forEach(function (card) {
      var playBtn = card.querySelector('.testimonial-card__play');
      var video = card.querySelector('video');
      if (!playBtn || !video) return;

      playBtn.addEventListener('click', function () {
        cards.forEach(function (c) {
          var v = c.querySelector('video');
          if (v && v !== video) { v.pause(); c.classList.remove('is-playing'); }
        });
        video.play();
        card.classList.add('is-playing');
      });

      video.addEventListener('pause', function () { card.classList.remove('is-playing'); });
      video.addEventListener('ended', function () { card.classList.remove('is-playing'); });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            var v = entry.target.querySelector('video');
            if (v && !v.paused) v.pause();
          }
        });
      }, { threshold: 0.4 });
      cards.forEach(function (c) { observer.observe(c); });
    }
  }

  /* ---------- Año dinámico en footer ---------- */
  function initFooterYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Header con sombra al hacer scroll ---------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(53,59,44,0.08)' : 'none';
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLangSwitch();
    initMobileNav();
    initTestimonialCarousel();
    initFooterYear();
    initHeaderScroll();
  });
})();
