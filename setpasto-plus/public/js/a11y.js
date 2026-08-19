/* Panel de ajustes de lectura. Las preferencias se guardan en localStorage y
   se aplican antes del primer pintado (ver el script en <head>). */
(function () {
  'use strict';

  var panel = document.querySelector('[data-a11y-panel]');
  if (!panel) return;

  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
  };

  var CLASS = { contrast: 'a11y-contrast', underline: 'a11y-underline', motion: 'a11y-motion' };

  /* ---------------------------- tamaño de texto -------------------------- */
  var fontButtons = Array.prototype.slice.call(panel.querySelectorAll('[data-font]'));

  function syncFont() {
    var current = store.get('setp:font') || '100%';
    fontButtons.forEach(function (btn) {
      var on = btn.getAttribute('data-font') === current;
      btn.setAttribute('aria-pressed', String(on));
      btn.style.background = on ? 'var(--brand)' : 'transparent';
      btn.style.color = on ? '#fff' : 'var(--text)';
    });
  }

  fontButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var size = btn.getAttribute('data-font');
      root.style.fontSize = size;
      store.set('setp:font', size);
      syncFont();
    });
  });

  /* ------------------------------ interruptores -------------------------- */
  var switches = Array.prototype.slice.call(panel.querySelectorAll('[data-toggle]'));

  function paintSwitch(btn, on) {
    btn.setAttribute('aria-checked', String(on));
    btn.style.background = on ? 'var(--brand)' : 'var(--surface-sunk)';
    btn.style.borderColor = on ? 'var(--brand)' : 'var(--line)';
    var knob = btn.querySelector('span');
    knob.style.transform = on
      ? (getComputedStyle(root).direction === 'rtl' ? 'translate(-20px, -50%)' : 'translate(20px, -50%)')
      : 'translate(0, -50%)';
    knob.style.background = on ? '#fff' : 'var(--text-mute)';
  }

  function syncSwitches() {
    switches.forEach(function (btn) {
      var key = btn.getAttribute('data-toggle');
      paintSwitch(btn, store.get('setp:' + key) === '1');
    });
  }

  switches.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-toggle');
      var on = store.get('setp:' + key) !== '1';
      if (on) { store.set('setp:' + key, '1'); root.classList.add(CLASS[key]); }
      else { store.del('setp:' + key); root.classList.remove(CLASS[key]); }
      paintSwitch(btn, on);
    });
  });

  /* -------------------------------- reset -------------------------------- */
  var reset = panel.querySelector('[data-a11y-reset]');
  if (reset) {
    reset.addEventListener('click', function () {
      ['font', 'contrast', 'underline', 'motion'].forEach(function (k) { store.del('setp:' + k); });
      root.style.fontSize = '';
      Object.keys(CLASS).forEach(function (k) { root.classList.remove(CLASS[k]); });
      syncFont();
      syncSwitches();
    });
  }

  syncFont();
  syncSwitches();
})();
