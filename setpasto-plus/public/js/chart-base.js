/* ===========================================================================
 * Base común de los gráficos.
 *
 * Reglas que se respetan en todos ellos:
 *  · paleta categórica en orden fijo (nunca ciclada) y validada para daltonismo
 *  · un solo eje por gráfico; nunca dos escalas y
 *  · marcas finas, rejilla discreta, leyenda siempre para dos o más series
 *  · todo el texto viene formateado por Intl con el locale de la página
 *  · el tema oscuro tiene su propia paleta, no un volteo automático
 * ======================================================================== */
window.SETPCharts = (function () {
  'use strict';

  var css = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  function palette() {
    return [css('--cat-1'), css('--cat-2'), css('--cat-3'), css('--cat-4'), css('--cat-5'), css('--cat-6')];
  }

  function tokens() {
    return {
      text: css('--text'),
      soft: css('--text-soft'),
      mute: css('--text-mute'),
      grid: css('--grid-line'),
      surface: css('--surface-raised'),
      line: css('--line'),
      cats: palette(),
    };
  }

  function applyDefaults(locale) {
    var tk = tokens();
    var C = window.Chart;
    C.defaults.font.family = '"Instrument Sans", "IBM Plex Sans Arabic", system-ui, sans-serif';
    C.defaults.font.size = 12;
    C.defaults.color = tk.mute;
    C.defaults.locale = locale;
    C.defaults.maintainAspectRatio = false;
    C.defaults.animation.duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900;
    C.defaults.plugins.legend.labels.usePointStyle = true;
    C.defaults.plugins.legend.labels.boxWidth = 8;
    C.defaults.plugins.legend.labels.padding = 16;
    C.defaults.plugins.tooltip.backgroundColor = tk.surface;
    C.defaults.plugins.tooltip.titleColor = tk.text;
    C.defaults.plugins.tooltip.bodyColor = tk.soft;
    C.defaults.plugins.tooltip.borderColor = tk.line;
    C.defaults.plugins.tooltip.borderWidth = 1;
    C.defaults.plugins.tooltip.padding = 12;
    C.defaults.plugins.tooltip.cornerRadius = 10;
    C.defaults.plugins.tooltip.displayColors = true;
    C.defaults.plugins.tooltip.boxPadding = 4;
    return tk;
  }

  /** Rejilla y ejes discretos: el dato manda, no el marco. */
  function axis(tk, opts) {
    return Object.assign({
      grid: { color: tk.grid, drawTicks: false, drawBorder: false },
      border: { display: false },
      ticks: { color: tk.mute, padding: 8 },
    }, opts || {});
  }

  /** Línea de meta: una referencia horizontal, no una segunda escala. */
  function targetLine(value, label, color) {
    return {
      id: 'targetLine-' + label,
      afterDatasetsDraw: function (chart) {
        var y = chart.scales.y;
        if (!y) return;
        var ctx = chart.ctx;
        var py = y.getPixelForValue(value);
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(chart.chartArea.left, py);
        ctx.lineTo(chart.chartArea.right, py);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(label, chart.chartArea.right, py - 6);
        ctx.restore();
      },
    };
  }

  /**
   * Vuelve a crear los gráficos cuando cambia el tema, porque el modo oscuro
   * usa su propia paleta validada y no un simple invertido de la clara.
   */
  function onThemeChange(rebuild) {
    document.addEventListener('setp:themechange', function () {
      // Un cuadro de espera para que las variables CSS ya estén aplicadas.
      requestAnimationFrame(function () { requestAnimationFrame(rebuild); });
    });
  }

  function readData(id) {
    var node = document.getElementById(id);
    return node ? JSON.parse(node.textContent) : null;
  }

  return {
    tokens: tokens,
    palette: palette,
    applyDefaults: applyDefaults,
    axis: axis,
    targetLine: targetLine,
    onThemeChange: onThemeChange,
    readData: readData,
  };
})();
