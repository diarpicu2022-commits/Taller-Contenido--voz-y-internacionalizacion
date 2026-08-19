'use strict';
// Copia las dependencias de navegador desde node_modules a /public/vendor.
// Nada se sirve desde un CDN: el portal debe funcionar en una red restringida.
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'public', 'vendor');
fs.mkdirSync(out, { recursive: true });

const files = [
  ['animejs/lib/anime.min.js', 'anime.min.js'],
  ['chart.js/dist/chart.umd.min.js', 'chart.umd.min.js'],
];

for (const [from, to] of files) {
  const src = path.join(__dirname, '..', 'node_modules', from);
  fs.copyFileSync(src, path.join(out, to));
  console.log('vendor →', to);
}
