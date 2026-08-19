/* Formulario PQRSD · contador de caracteres y foco en el resumen de errores.
   La validación real vive en el servidor: esto solo mejora el recorrido. */
(function () {
  'use strict';

  var locale = document.documentElement.getAttribute('data-intl-locale') || 'es-CO';
  var nf = new Intl.NumberFormat(locale);

  // Al volver con errores, el foco salta al resumen para que un lector de
  // pantalla lo anuncie antes que cualquier otra cosa.
  var summary = document.getElementById('error-summary');
  if (summary) summary.focus();

  var textarea = document.querySelector('[data-counter-target]');
  if (!textarea) return;
  var counter = document.getElementById(textarea.getAttribute('data-counter-target'));
  if (!counter) return;

  var tpl = counter.getAttribute('data-counter-template') || '{n}';
  var max = parseInt(textarea.getAttribute('maxlength'), 10) || 1200;

  function update() {
    counter.textContent = tpl.replace('__n__', nf.format(textarea.value.length)).replace('{max}', nf.format(max));
    counter.style.color = textarea.value.length > max * 0.9 ? 'var(--accent)' : 'var(--text-mute)';
  }

  textarea.addEventListener('input', update);
  update();
})();
