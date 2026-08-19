'use strict';

/* ---------------------------------------------------------------------------
 * Datos de rutas (ilustrativos, para el prototipo académico).
 *
 * Nota de internacionalización: los topónimos —Anganoy, Aranda, Tamasagra—
 * son nombres propios y NO se traducen. Solo se traducen las etiquetas que
 * los rodean («Cabecera», «cada 12 min»), que viven en los diccionarios.
 * ------------------------------------------------------------------------- */

/** Perfil de demanda por hora (05:00 a 22:00), normalizado a validaciones/hora. */
function profile(peakAm, peakPm, base) {
  const shape = [0.25, 0.55, 1, 0.86, 0.6, 0.5, 0.48, 0.55, 0.62, 0.58, 0.6, 0.72, 0.9, 1, 0.82, 0.55, 0.36, 0.2];
  return shape.map((s, i) => {
    const peak = i < 8 ? peakAm : peakPm;
    return Math.round(base + s * peak);
  });
}

const routes = [
  { id: 'C1',  from: 'Anganoy',            to: 'Centro',              headway: 10, spanFrom: '05:00', spanTo: '21:30', low: true,  km: 12.4, fleet: 14, demand: profile(320, 380, 60) },
  { id: 'C2',  from: 'Tamasagra',          to: 'Terminal',            headway: 12, spanFrom: '05:00', spanTo: '21:00', low: true,  km: 10.9, fleet: 12, demand: profile(280, 320, 55) },
  { id: 'C3',  from: 'Aranda',             to: 'Centro',              headway: 14, spanFrom: '05:15', spanTo: '20:45', low: false, km: 9.6,  fleet: 10, demand: profile(240, 265, 45) },
  { id: 'C4',  from: 'Villa Flor',         to: 'Universidad',         headway: 9,  spanFrom: '04:50', spanTo: '22:00', low: true,  km: 14.2, fleet: 16, demand: profile(410, 455, 70) },
  { id: 'C5',  from: 'Panorámico',         to: 'Centro',              headway: 15, spanFrom: '05:30', spanTo: '20:30', low: false, km: 8.8,  fleet: 9,  demand: profile(205, 230, 40) },
  { id: 'C6',  from: 'Chapal',             to: 'Terminal',            headway: 13, spanFrom: '05:10', spanTo: '21:00', low: true,  km: 11.3, fleet: 11, demand: profile(255, 290, 48) },
  { id: 'C7',  from: 'Obrero',             to: 'Universidad',         headway: 11, spanFrom: '05:00', spanTo: '21:30', low: true,  km: 12.8, fleet: 13, demand: profile(330, 370, 58) },
  { id: 'C8',  from: 'Corazón de Jesús',   to: 'Centro',              headway: 16, spanFrom: '05:30', spanTo: '20:15', low: false, km: 7.9,  fleet: 8,  demand: profile(190, 210, 36) },
  { id: 'C9',  from: 'La Carolina',        to: 'Terminal',            headway: 14, spanFrom: '05:20', spanTo: '20:45', low: false, km: 10.1, fleet: 10, demand: profile(230, 250, 42) },
  { id: 'C10', from: 'Briceño',            to: 'Centro',              headway: 12, spanFrom: '05:00', spanTo: '21:15', low: true,  km: 11.8, fleet: 12, demand: profile(275, 305, 50) },
  { id: 'C11', from: 'Miraflores',         to: 'Universidad',         headway: 13, spanFrom: '05:10', spanTo: '21:00', low: true,  km: 12.1, fleet: 12, demand: profile(290, 325, 52) },
  { id: 'C12', from: 'Las Lunas',          to: 'Centro',              headway: 17, spanFrom: '05:40', spanTo: '20:00', low: false, km: 7.2,  fleet: 7,  demand: profile(165, 185, 32) },
  { id: 'C13', from: 'Potrerillo',         to: 'Terminal',            headway: 15, spanFrom: '05:20', spanTo: '20:30', low: false, km: 9.4,  fleet: 9,  demand: profile(215, 235, 40) },
  { id: 'C14', from: 'San Vicente',        to: 'Centro',              headway: 12, spanFrom: '05:00', spanTo: '21:15', low: true,  km: 11.6, fleet: 12, demand: profile(265, 300, 49) },
  { id: 'C15', from: 'Jongovito',          to: 'Terminal',            headway: 20, spanFrom: '05:45', spanTo: '19:45', low: false, km: 15.7, fleet: 7,  demand: profile(150, 170, 28) },
  { id: 'C16', from: 'Catambuco',          to: 'Centro',              headway: 18, spanFrom: '05:30', spanTo: '20:00', low: false, km: 16.3, fleet: 8,  demand: profile(175, 195, 34) },

  { id: 'E1',  from: 'Anganoy',            to: 'Aranda',              headway: 7,  spanFrom: '04:40', spanTo: '21:30', low: true,  km: 18.6, fleet: 22, demand: profile(520, 590, 95) },
  { id: 'E2',  from: 'Terminal',           to: 'Universidad',         headway: 6,  spanFrom: '04:40', spanTo: '22:00', low: true,  km: 17.2, fleet: 24, demand: profile(580, 660, 105) },
  { id: 'E3',  from: 'Villa Flor',         to: 'Chapal',              headway: 8,  spanFrom: '04:50', spanTo: '21:30', low: true,  km: 16.4, fleet: 20, demand: profile(480, 540, 88) },
  { id: 'E4',  from: 'Tamasagra',          to: 'Miraflores',          headway: 9,  spanFrom: '05:00', spanTo: '21:15', low: true,  km: 15.1, fleet: 18, demand: profile(440, 495, 80) },
  { id: 'E5',  from: 'Catambuco',          to: 'Centro',              headway: 10, spanFrom: '04:50', spanTo: '21:30', low: true,  km: 19.8, fleet: 19, demand: profile(410, 470, 76) },
  { id: 'E6',  from: 'Briceño',            to: 'Terminal',            headway: 8,  spanFrom: '05:00', spanTo: '21:15', low: true,  km: 14.9, fleet: 18, demand: profile(455, 505, 82) },
  { id: 'E7',  from: 'Obrero',             to: 'La Carolina',         headway: 11, spanFrom: '05:00', spanTo: '21:00', low: false, km: 13.7, fleet: 15, demand: profile(370, 415, 68) },
];

/** Paraderos representativos por ruta (nombres propios, sin traducir). */
const CORRIDOR_POOL = [
  'Plaza de Nariño', 'Parque Bolívar', 'Cra 27 · Calle 16', 'Hospital Departamental',
  'Estadio Libertad', 'Unicentro', 'Parque Infantil', 'Calle 18 · Cra 19',
  'Universidad de Nariño', 'CAM Anganoy', 'Mercado El Potrerillo', 'Terminal de Transportes',
];

function stopsFor(route) {
  const start = (route.id.charCodeAt(1) + route.id.length) % CORRIDOR_POOL.length;
  const mid = Array.from({ length: 4 }, (_, i) => CORRIDOR_POOL[(start + i * 3) % CORRIDOR_POOL.length]);
  return [route.from, ...mid, route.to];
}

const byId = new Map(routes.map((r) => [r.id, r]));

module.exports = {
  routes,
  byId,
  stopsFor,
  families: ['C', 'E'],
  hours: Array.from({ length: 18 }, (_, i) => `${String(i + 5).padStart(2, '0')}:00`),
};
