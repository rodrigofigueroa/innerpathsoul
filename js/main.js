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

  /* ---------- Submenú "Terapias" (dropdown desktop) ---------- */
  function initSubmenu() {
    var submenuItems = document.querySelectorAll('.has-submenu');
    var CLOSE_DELAY = 400; // ms de gracia antes de cerrar al salir el cursor
    var closeTimer = null;

    function closeAll(except) {
      submenuItems.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('is-open');
        var trigger = item.querySelector('.submenu-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    function openItem(item, trigger) {
      clearTimeout(closeTimer);
      closeAll(item);
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function scheduleClose(item, trigger) {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, CLOSE_DELAY);
    }

    submenuItems.forEach(function (item) {
      var trigger = item.querySelector('.submenu-trigger');
      if (!trigger) return;

      // Click: para teclado/touch y como confirmación directa
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        clearTimeout(closeTimer);
        var isOpen = item.classList.contains('is-open');
        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          openItem(item, trigger);
        }
      });

      // Hover con delay de cierre: abre al instante, cierra con margen de tiempo
      item.addEventListener('mouseenter', function () {
        if (window.matchMedia('(hover: hover)').matches) {
          openItem(item, trigger);
        }
      });
      item.addEventListener('mouseleave', function () {
        if (window.matchMedia('(hover: hover)').matches) {
          scheduleClose(item, trigger);
        }
      });
    });

    document.addEventListener('click', function (e) {
      submenuItems.forEach(function (item) {
        if (!item.contains(e.target)) {
          item.classList.remove('is-open');
          var trigger = item.querySelector('.submenu-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        clearTimeout(closeTimer);
        closeAll();
      }
    });
  }

  /* ---------- Submenú en menú móvil (acordeón) ---------- */
  function initMobileSubmenu() {
    var triggers = document.querySelectorAll('.mobile-submenu-trigger');
    triggers.forEach(function (trigger) {
      var targetId = trigger.getAttribute('aria-controls');
      var panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;

      trigger.addEventListener('click', function () {
        var isOpen = panel.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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

  /* ---------- Resaltar página actual en los submenús ---------- */
  function initCurrentPageHighlight() {
    var currentFile = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.submenu a, .mobile-submenu a');
    links.forEach(function (link) {
      var linkFile = link.getAttribute('href').split('/').pop();
      if (linkFile === currentFile) {
        link.classList.add('is-current');
        link.setAttribute('aria-current', 'page');
      }
    });
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
    initSubmenu();
    initMobileSubmenu();
    initCurrentPageHighlight();
    initTestimonialCarousel();
    initFooterYear();
    initHeaderScroll();
  });
})();
