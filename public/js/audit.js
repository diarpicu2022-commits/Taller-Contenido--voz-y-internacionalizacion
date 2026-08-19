/* Antes y después de la auditoría · radar de dos series comparables. */
(function () {
  'use strict';

  var S = window.SETPCharts;
  var data = S.readData('audit-data');
  if (!data) return;

  var chart = null;

  function alpha(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function build() {
    if (chart) chart.destroy();
    var tk = S.applyDefaults(data.locale);
    var nf = new Intl.NumberFormat(data.locale);

    chart = new Chart(document.getElementById('chartAudit'), {
      type: 'radar',
      data: {
        labels: data.dims,
        datasets: [
          {
            label: data.beforeLabel,
            data: data.before,
            borderColor: tk.cats[3],
            backgroundColor: alpha(tk.cats[3], 0.14),
            borderWidth: 2,
            pointBackgroundColor: tk.cats[3],
            pointBorderColor: tk.surface,
            pointBorderWidth: 2,
            pointRadius: 4,
          },
          {
            label: data.afterLabel,
            data: data.after,
            borderColor: tk.cats[0],
            backgroundColor: alpha(tk.cats[0], 0.18),
            borderWidth: 2.4,
            pointBackgroundColor: tk.cats[0],
            pointBorderColor: tk.surface,
            pointBorderWidth: 2,
            pointRadius: 4,
          },
        ],
      },
      options: {
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { color: tk.grid },
            grid: { color: tk.grid },
            pointLabels: { color: tk.soft, font: { size: 12 } },
            ticks: {
              color: tk.mute,
              backdropColor: 'transparent',
              stepSize: 25,
              callback: function (v) { return nf.format(v); },
            },
          },
        },
        plugins: {
          legend: { display: false }, // la leyenda vive en el HTML del figcaption
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + nf.format(c.parsed.r); } } },
        },
      },
    });
  }

  build();
  S.onThemeChange(build);
})();
