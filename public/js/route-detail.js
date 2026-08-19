/* Demanda de una ruta por franja horaria · área de una sola serie. */
(function () {
  'use strict';

  var S = window.SETPCharts;
  var data = S.readData('route-data');
  if (!data) return;

  var chart = null;

  function build() {
    if (chart) chart.destroy();
    var tk = S.applyDefaults(data.locale);
    var nf = new Intl.NumberFormat(data.locale);

    var canvas = document.getElementById('routeDemand');
    var ctx = canvas.getContext('2d');
    // El canvas no entiende color-mix(): el degradado se arma en rgba.
    var alpha = function (hex, a) {
      var h = hex.replace('#', '');
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var n = parseInt(h, 16);
      return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    };
    var fill = ctx.createLinearGradient(0, 0, 0, canvas.parentElement.clientHeight || 280);
    fill.addColorStop(0, alpha(tk.cats[0], 0.34));
    fill.addColorStop(1, alpha(tk.cats[0], 0.02));

    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.axis,
          data: data.values,
          borderColor: tk.cats[0],
          backgroundColor: fill,
          borderWidth: 2.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBorderColor: tk.surface,
          pointHoverBorderWidth: 2,
          tension: 0.35,
        }],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: S.axis(tk, { grid: { display: false } }),
          y: S.axis(tk, { ticks: { color: tk.mute, padding: 8, callback: function (v) { return nf.format(v); } } }),
        },
        plugins: {
          legend: { display: false }, // una sola serie: el título ya la nombra
          tooltip: { callbacks: { label: function (c) { return nf.format(c.parsed.y); } } },
        },
      },
    });
  }

  build();
  S.onThemeChange(build);
})();
