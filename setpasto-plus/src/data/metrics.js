'use strict';

/* ---------------------------------------------------------------------------
 * Series de indicadores (ilustrativas).
 * Los datos viajan sin etiquetas: los rótulos de meses, categorías y ejes
 * vienen del diccionario del idioma activo. Así una serie nunca queda
 * "quemada" en español, que es justo el problema del portal original.
 * ------------------------------------------------------------------------- */

const demand = {
  // miles de viajes validados por mes
  previous: [1042, 1088, 1131, 902, 1145, 1120, 1039, 1172, 1198, 1210, 1188, 1024],
  current:  [1118, 1163, 1207, 968, 1231, 1215, 1126, 1284, 1301, 1322, 1295, 1140],
};

const punctuality = {
  // cumplimiento por familia, cuatro trimestres
  quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
  series: [
    { key: 'E', values: [88.4, 90.1, 92.6, 93.8] },
    { key: 'C', values: [84.2, 86.0, 88.7, 89.9] },
  ],
  target: 90,
};

const modalSplit = [38.4, 24.1, 17.6, 12.3, 4.8, 2.8];

const pqrs = [412, 268, 231, 189, 96, 74];

const kpis = [
  { key: 'onTime',       value: 0.912, format: 'percent', delta: 0.028,  hint: 'kpiHintQuarter' },
  { key: 'wait',         value: 8.4,   format: 'minutes', delta: -1.2,   hint: 'kpiHintQuarter', goodWhenDown: true },
  { key: 'satisfaction', value: 0.741, format: 'percent', delta: 0.035,  hint: 'kpiHintSurvey' },
  { key: 'response',     value: 0.78,  format: 'percent', delta: 0.06,   hint: 'kpiHintLegal' },
];

/** Puntajes de la heurística de auditoría, 0–100. */
const auditScores = {
  before: [34, 28, 18, 41, 30],
  after:  [88, 92, 95, 91, 89],
};

const overview = {
  rutas: 23,
  paraderos: 412,
  viajesMes: 1284000,
  puntualidad: 0.912,
  fare: 2900,
  fareReduced: 1450,
};

module.exports = { demand, punctuality, modalSplit, pqrs, kpis, auditScores, overview };
