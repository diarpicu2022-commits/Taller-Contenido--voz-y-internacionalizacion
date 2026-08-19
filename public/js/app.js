/* ===========================================================================
 * SETPasto+ · comportamiento común
 * Todo aquí es mejora progresiva: la página funciona con JavaScript apagado.
 * ======================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  // El tag de formato puede diferir del de idioma (p. ej. ar-u-nu-arab).
  var LOCALE = root.getAttribute('data-intl-locale') || root.getAttribute('lang') || 'es-CO';

  /** ¿El usuario pidió menos movimiento, por sistema o por nuestro panel? */
  function reducedMotion() {
    return root.classList.contains('a11y-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ------------------------------ tema ---------------------------------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var dark = root.classList.toggle('dark');
      try { localStorage.setItem('setp:theme', dark ? 'dark' : 'light'); } catch (e) {}
      document.dispatchEvent(new CustomEvent('setp:themechange', { detail: { dark: dark } }));
    });
  }

  /* --------------------------- menú en móvil ----------------------------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('hidden') === false;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ------------------- cerrar el selector de idioma ---------------------- */
  var switcher = document.querySelector('[data-lang-switcher]');
  if (switcher) {
    document.addEventListener('click', function (e) {
      if (switcher.open && !switcher.contains(e.target)) switcher.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && switcher.open) { switcher.open = false; switcher.querySelector('summary').focus(); }
    });
  }

  /* ---------------- píldoras de filtro: color al seleccionar ------------- */
  // Tailwind no puede pintar `peer-checked` con una variable CSS arbitraria,
  // así que el color de marca se aplica aquí.
  function paintPills() {
    document.querySelectorAll('[data-checked-bg]').forEach(function (span) {
      var input = span.previousElementSibling;
      if (!input) return;
      span.style.background = input.checked ? 'var(--brand)' : 'transparent';
      span.style.color = input.checked ? '#fff' : 'var(--text-soft)';
    });
  }
  document.addEventListener('change', paintPills);
  paintPills();

  /* --------------------- revelado al entrar en pantalla ------------------ */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (revealables.length && !reducedMotion() && window.anime && 'IntersectionObserver' in window) {
    revealables.forEach(function (el) { el.style.opacity = '0'; });

    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (en) { return en.isIntersecting; }).map(function (en) { return en.target; });
      if (!batch.length) return;
      batch.forEach(function (el) { io.unobserve(el); });
      window.anime({
        targets: batch,
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 720,
        delay: window.anime.stagger(70),
        easing: 'cubicBezier(.22,1,.36,1)',
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });

    // Red de seguridad: si algo impide que el observador dispare (una pestaña
    // en segundo plano, un navegador que no repinta), el contenido aparece
    // igualmente. Nada debe quedarse invisible por culpa de una animación.
    setTimeout(function () {
      revealables.forEach(function (el) {
        if (getComputedStyle(el).opacity === '0') el.style.opacity = '1';
      });
    }, 3000);
  }

  /* ------------------------ contadores animados -------------------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length && window.anime && !reducedMotion() && 'IntersectionObserver' in window) {
    var nf = new Intl.NumberFormat(LOCALE);
    var pf = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 1 });
    var cf = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });

    var format = function (kind, value) {
      if (kind === 'percent') return pf.format(value);
      if (kind === 'compact') return cf.format(value);
      return nf.format(Math.round(value));
    };

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var kind = el.getAttribute('data-count-kind') || 'int';
        var state = { v: 0 };
        window.anime({
          targets: state,
          v: target,
          duration: 1400,
          easing: 'cubicBezier(.16,1,.3,1)',
          update: function () { el.textContent = format(kind, state.v); },
        });
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { cio.observe(el); });
  }

  /* --------------------- barras de la página de auditoría ---------------- */
  var bars = Array.prototype.slice.call(document.querySelectorAll('[data-bar-to]'));
  if (bars.length && 'IntersectionObserver' in window) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        bio.unobserve(en.target);
        en.target.style.width = en.target.getAttribute('data-bar-to') + '%';
      });
    }, { threshold: 0.3 });
    bars.forEach(function (el) {
      if (reducedMotion()) el.style.width = el.getAttribute('data-bar-to') + '%';
      else bio.observe(el);
    });
  }
})();
