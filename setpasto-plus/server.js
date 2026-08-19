'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');

const i18n = require('./src/i18n');
const { routes, byId, stopsFor, hours } = require('./src/data/routes');
const metrics = require('./src/data/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

/* --------------------------------- infra --------------------------------- */

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ------------------------------ helpers de vista -------------------------- */

/**
 * Construye los datos que toda página necesita: el contexto de idioma, la
 * lista de alternativas hreflang y el ítem de navegación activo.
 */
function baseLocals(ctx, req, pathAfterLocale) {
  const alternates = i18n.LOCALES.map((l) => ({
    prefix: l.prefix,
    tag: l.tag,
    href: `/${l.prefix}${pathAfterLocale}`,
  }));
  return {
    ctx,
    t: ctx.t,
    plural: ctx.plural,
    fmt: ctx.fmt,
    lang: ctx.prefix,
    dir: ctx.dir,
    href: (p = '') => `/${ctx.prefix}${p}`,
    alternates,
    canonicalPath: pathAfterLocale,
    currentPath: pathAfterLocale,
    year: new Date().getFullYear(),
    now: new Date(),
    overview: metrics.overview,
  };
}

/* -------------------------------- enrutado -------------------------------- */

// Raíz: negocia el idioma con Accept-Language y redirige (302, no 301: la
// preferencia del usuario puede cambiar y no queremos que quede cacheada).
app.get('/', (req, res) => {
  const prefix = i18n.negotiate(req.headers['accept-language']);
  res.redirect(302, `/${prefix}/`);
});

const router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
  const prefix = req.params.lang;
  if (!i18n.isSupported(prefix)) return next('router');
  req.ctx = i18n.createContext(prefix);
  next();
});

/* --------------------------------- inicio --------------------------------- */
router.get('/', (req, res) => {
  const ctx = req.ctx;
  res.render('pages/home', {
    ...baseLocals(ctx, req, '/'),
    title: ctx.t('meta.titleHome'),
    description: ctx.t('meta.descHome'),
    nav: 'home',
    routes,
    metrics,
  });
});

/* -------------------------------- rutas ----------------------------------- */
router.get('/rutas', (req, res) => {
  const ctx = req.ctx;
  res.render('pages/routes', {
    ...baseLocals(ctx, req, '/rutas'),
    title: `${ctx.t('meta.titleRutas')} · ${ctx.t('meta.siteName')}`,
    description: ctx.t('meta.descRutas'),
    nav: 'rutas',
    routes,
    prefill: typeof req.query.q === 'string' ? req.query.q : '',
  });
});

router.get('/rutas/:id', (req, res, next) => {
  const ctx = req.ctx;
  const route = byId.get(String(req.params.id).toUpperCase());
  if (!route) return next();
  res.render('pages/route-detail', {
    ...baseLocals(ctx, req, `/rutas/${route.id}`),
    title: `${route.id} · ${route.from} — ${route.to}`,
    description: ctx.t('meta.descRutas'),
    nav: 'rutas',
    route,
    stops: stopsFor(route),
    hours,
  });
});

/* ------------------------------ indicadores -------------------------------- */
router.get('/indicadores', (req, res) => {
  const ctx = req.ctx;
  res.render('pages/indicators', {
    ...baseLocals(ctx, req, '/indicadores'),
    title: `${ctx.t('meta.titleIndicadores')} · ${ctx.t('meta.siteName')}`,
    description: ctx.t('meta.descIndicadores'),
    nav: 'indicadores',
    metrics,
  });
});

/* ---------------------------------- PQRSD ---------------------------------- */
function renderPqrs(req, res, extra = {}) {
  const ctx = req.ctx;
  res.render('pages/pqrs', {
    ...baseLocals(ctx, req, '/pqrs'),
    title: `${ctx.t('meta.titlePqrs')} · ${ctx.t('meta.siteName')}`,
    description: ctx.t('meta.descPqrs'),
    nav: 'pqrs',
    routes,
    values: {},
    errors: {},
    submitted: null,
    ...extra,
  });
}

router.get('/pqrs', (req, res) => renderPqrs(req, res));

// Validación en el servidor: el formulario funciona con JavaScript desactivado.
router.post('/pqrs', (req, res) => {
  const ctx = req.ctx;
  const values = {
    tipo: String(req.body.tipo || 'peticion'),
    ruta: String(req.body.ruta || ''),
    nombre: String(req.body.nombre || '').trim(),
    email: String(req.body.email || '').trim(),
    mensaje: String(req.body.mensaje || '').trim(),
    consent: req.body.consent === 'on',
  };

  const errors = {};
  if (values.nombre.length < 2) errors.nombre = ctx.t('pqrs.errName');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = ctx.t('pqrs.errEmail');
  if (values.mensaje.length < 10) errors.mensaje = ctx.t('pqrs.errMessage');
  if (!values.consent) errors.consent = ctx.t('pqrs.errConsent');

  if (Object.keys(errors).length) {
    return res.status(422).render('pages/pqrs', {
      ...baseLocals(ctx, req, '/pqrs'),
      title: `${ctx.t('meta.titlePqrs')} · ${ctx.t('meta.siteName')}`,
      description: ctx.t('meta.descPqrs'),
      nav: 'pqrs',
      routes,
      values,
      errors,
      submitted: null,
    });
  }

  const deadline = new Date(Date.now() + 15 * 86400000);
  const id = `SETP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  return renderPqrs(req, res, {
    values,
    submitted: { id, email: values.email, date: ctx.fmt.dateLong.format(deadline) },
  });
});

/* ------------------------------ accesibilidad ------------------------------ */
router.get('/accesibilidad', (req, res) => {
  const ctx = req.ctx;
  res.render('pages/accessibility', {
    ...baseLocals(ctx, req, '/accesibilidad'),
    title: `${ctx.t('meta.titleAccesibilidad')} · ${ctx.t('meta.siteName')}`,
    description: ctx.t('meta.descAccesibilidad'),
    nav: 'accesibilidad',
  });
});

/* -------------------------------- auditoría -------------------------------- */
router.get('/auditoria', (req, res) => {
  const ctx = req.ctx;
  res.render('pages/audit', {
    ...baseLocals(ctx, req, '/auditoria'),
    title: `${ctx.t('meta.titleAuditoria')} · ${ctx.t('meta.siteName')}`,
    description: ctx.t('meta.descAuditoria'),
    nav: 'auditoria',
    scores: metrics.auditScores,
  });
});

app.use('/:lang', router);

/* --------------------------------- 404/500 --------------------------------- */
app.use((req, res) => {
  const prefix = i18n.isSupported(req.path.split('/')[1])
    ? req.path.split('/')[1]
    : i18n.negotiate(req.headers['accept-language']);
  const ctx = i18n.createContext(prefix);
  res.status(404).render('pages/not-found', {
    ...baseLocals(ctx, req, '/'),
    title: '404 · ' + ctx.t('meta.siteName'),
    description: ctx.t('meta.descHome'),
    nav: null,
  });
});

app.listen(PORT, () => {
  console.log(`\n  SETPasto+  ·  http://localhost:${PORT}\n`);
  console.log('  Idiomas:', i18n.LOCALES.map((l) => `/${l.prefix} (${l.tag})`).join('  '));
  console.log('');
});
