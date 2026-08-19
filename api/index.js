'use strict';

/* Punto de entrada serverless.
   Vercel convierte cada archivo de /api en una función. Aquí solo se reexporta
   la aplicación de Express: `vercel.json` reescribe todas las rutas hacia esta
   función, así que el enrutado sigue viviendo en server.js. */
module.exports = require('../server');
