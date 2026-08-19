/* Filtro en vivo del explorador de rutas.
   Sin JavaScript la tabla completa sigue siendo utilizable; esto solo acorta
   el camino. El recuento se anuncia en una región aria-live. */
(function () {
  'use strict';

  var form = document.querySelector('[data-route-filters]');
  if (!form) return;

  var locale = document.documentElement.getAttribute('lang') || 'es-CO';
  var nf = new Intl.NumberFormat(locale);
  var pr = new Intl.PluralRules(locale);

  var input = document.getElementById('rq');
  var accessBox = form.querySelector('input[name="access"]');
  var rows = Array.prototype.slice.call(document.querySelectorAll('[data-route]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-route-card]'));
  var countEl = document.querySelector('[data-route-count]');
  var emptyEl = document.querySelector('[data-route-empty]');
  var emptyTitle = emptyEl ? emptyEl.querySelector('[data-empty-title]') : null;

  /** Normaliza para que «Nariño» encuentre «narino». */
  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function currentFamily() {
    var checked = form.querySelector('input[name="fam"]:checked');
    return checked ? checked.value : 'all';
  }

  function countText(n) {
    var one = countEl.getAttribute('data-tpl-one');
    var other = countEl.getAttribute('data-tpl-other');
    var tpl = pr.select(n) === 'one' ? one : other;
    return tpl.replace('{n}', nf.format(n));
  }

  function apply() {
    var q = norm(input.value.trim());
    var fam = currentFamily();
    var onlyAccess = accessBox.checked;
    var visible = 0;

    function test(el) {
      var hay = norm(el.getAttribute('data-search'));
      var okQ = !q || hay.indexOf(q) !== -1;
      var okF = fam === 'all' || el.getAttribute('data-fam') === fam;
      var okA = !onlyAccess || el.getAttribute('data-access') === '1';
      return okQ && okF && okA;
    }

    rows.forEach(function (el) {
      var ok = test(el);
      el.hidden = !ok;
      if (ok) visible++;
    });
    cards.forEach(function (el) { el.hidden = !test(el); });

    countEl.textContent = countText(visible);

    if (emptyEl) {
      emptyEl.classList.toggle('hidden', visible !== 0);
      if (visible === 0 && emptyTitle) {
        emptyTitle.textContent = emptyEl.getAttribute('data-tpl-empty').replace('{q}', input.value.trim());
      }
    }
  }

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(apply, 140);
  });
  form.addEventListener('change', apply);

  if (input.value.trim()) apply();
})();
