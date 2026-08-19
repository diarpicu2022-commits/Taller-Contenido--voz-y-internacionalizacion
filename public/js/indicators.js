/* Panel de indicadores · cuatro gráficos, cuatro trabajos distintos. */
(function () {
  'use strict';

  var S = window.SETPCharts;
  var data = S.readData('chart-data');
  if (!data) return;

  var charts = [];

  function destroyAll() {
    charts.forEach(function (c) { c.destroy(); });
    charts = [];
  }

  function build() {
    destroyAll();
    var tk = S.applyDefaults(data.locale);
    var nf = new Intl.NumberFormat(data.locale);
    var pf = new Intl.NumberFormat(data.locale, { style: 'percent', maximumFractionDigits: 1 });

    /* 1 · Cambio en el tiempo → línea. Dos series, leyenda obligatoria. */
    charts.push(new Chart(document.getElementById('chartDemand'), {
      type: 'line',
      data: {
        labels: data.months,
        datasets: [
          {
            label: data.demandPrev,
            data: data.demand.previous,
            borderColor: tk.cats[2],
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 5,
            tension: 0.32,
          },
          {
            label: data.demandCurr,
            data: data.demand.current,
            borderColor: tk.cats[0],
            backgroundColor: 'transparent',
            borderWidth: 2.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderColor: tk.surface,
            pointHoverBorderWidth: 2,
            tension: 0.32,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: S.axis(tk, { grid: { display: false }, border: { display: false } }),
          y: S.axis(tk, {
            title: { display: true, text: data.demandAxis, color: tk.mute, font: { size: 11 } },
            ticks: { color: tk.mute, padding: 8, callback: function (v) { return nf.format(v); } },
          }),
        },
        plugins: {
          legend: { position: 'top', align: 'end' },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + nf.format(c.parsed.y); } } },
        },
      },
    }));

    /* 2 · Identidad de categorías → dona. La leyenda va en HTML, con cifras. */
    charts.push(new Chart(document.getElementById('chartModal'), {
      type: 'doughnut',
      data: {
        labels: data.modalLabels,
        datasets: [{
          data: data.modal,
          backgroundColor: tk.cats,
          borderColor: tk.surface,
          borderWidth: 2, // separador de 2 px entre segmentos
          hoverOffset: 6,
        }],
      },
      options: {
        cutout: '62%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.label + ': ' + pf.format(c.parsed / 100); } } },
        },
      },
    }));

    /* 3 · Magnitud comparada → barras agrupadas, con la meta como referencia. */
    charts.push(new Chart(document.getElementById('chartPunctuality'), {
      type: 'bar',
      data: {
        labels: data.punctuality.quarters,
        datasets: data.punctuality.series.map(function (s, i) {
          return {
            label: s.key,
            data: s.values,
            backgroundColor: tk.cats[i === 0 ? 2 : 0],
            borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
            borderSkipped: false,
            barPercentage: 0.72,
            categoryPercentage: 0.66,
          };
        }),
      },
      options: {
        scales: {
          x: S.axis(tk, { grid: { display: false } }),
          y: S.axis(tk, {
            min: 70,
            max: 100,
            title: { display: true, text: data.punctualityAxis, color: tk.mute, font: { size: 11 } },
            ticks: { color: tk.mute, padding: 8, callback: function (v) { return nf.format(v) + '%'; } },
          }),
        },
        plugins: {
          legend: { position: 'top', align: 'end' },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + nf.format(c.parsed.y) + '%'; } } },
        },
      },
      plugins: [S.targetLine(data.punctuality.target, nf.format(data.punctuality.target) + '%', tk.cats[1])],
    }));

    /* 4 · Ranking de categorías → barras horizontales, serie única, sin leyenda. */
    charts.push(new Chart(document.getElementById('chartPqrs'), {
      type: 'bar',
      data: {
        labels: data.pqrsLabels,
        datasets: [{
          label: data.pqrsAxis,
          data: data.pqrs,
          backgroundColor: tk.cats[3],
          borderRadius: { topRight: 4, bottomRight: 4, topLeft: 0, bottomLeft: 0 },
          borderSkipped: false,
          barPercentage: 0.7,
        }],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: S.axis(tk, {
            title: { display: true, text: data.pqrsAxis, color: tk.mute, font: { size: 11 } },
            ticks: { color: tk.mute, padding: 8, callback: function (v) { return nf.format(v); } },
          }),
          y: S.axis(tk, { grid: { display: false } }),
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return nf.format(c.parsed.x); } } },
        },
      },
    }));
  }

  build();
  S.onThemeChange(build);
})();
