'use strict';

const fs = require('fs');
const path = require('path');

/* ---------------------------------------------------------------------------
 * Registro de locales
 * ---------------------------------------------------------------------------
 * El prefijo de URL (`es`, `en`, `pt`, `ar`) es corto y estable; el tag BCP-47
 * completo (`es-CO`, `pt-BR`, …) es el que se declara en <html lang> y el que
 * consume la API Intl. Separar ambos evita el error del sitio original, que
 * declaraba `es-ES` para un público colombiano.
 * ------------------------------------------------------------------------- */
const LOCALES = [
  { prefix: 'es', tag: 'es-CO', file: 'es-CO.json' },
  { prefix: 'en', tag: 'en-US', file: 'en-US.json' },
  { prefix: 'pt', tag: 'pt-BR', file: 'pt-BR.json' },
  { prefix: 'ar', tag: 'ar',    file: 'ar.json'    },
];

const DEFAULT_PREFIX = 'es';

const dictionaries = new Map();
for (const loc of LOCALES) {
  const raw = fs.readFileSync(path.join(__dirname, loc.file), 'utf8');
  dictionaries.set(loc.prefix, Object.freeze(JSON.parse(raw)));
}

const byPrefix = new Map(LOCALES.map((l) => [l.prefix, l]));

function isSupported(prefix) {
  return byPrefix.has(prefix);
}

/**
 * Negociación de idioma a partir de Accept-Language.
 * Ordena por factor de calidad `q` y devuelve el primer idioma soportado,
 * comparando solo la subetiqueta primaria (es-419 y es-ES caen ambos en `es`).
 */
function negotiate(acceptLanguage) {
  if (!acceptLanguage) return DEFAULT_PREFIX;
  const ranked = String(acceptLanguage)
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params
        .map((p) => p.trim())
        .filter((p) => p.startsWith('q='))
        .map((p) => Number.parseFloat(p.slice(2)))
        .find((n) => !Number.isNaN(n));
      return { primary: tag.trim().toLowerCase().split('-')[0], q: q === undefined ? 1 : q };
    })
    .filter((entry) => entry.primary && entry.primary !== '*')
    .sort((a, b) => b.q - a.q);

  const hit = ranked.find((entry) => isSupported(entry.primary));
  return hit ? hit.primary : DEFAULT_PREFIX;
}

/** Lee una clave con notación de punto: `hero.title`, `audit.groups.0.title`. */
function lookup(dict, key) {
  return key.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), dict);
}

/**
 * Interpolación `{nombre}`. Es deliberadamente mínima: la pluralización y todo
 * el formato de fecha/número se resuelven con Intl, no con cadenas concatenadas.
 */
function interpolate(template, vars) {
  if (typeof template !== 'string' || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
}

/**
 * Crea el contexto de idioma que se inyecta en cada vista.
 * Todos los formateadores se construyen una sola vez por petición.
 */
function createContext(prefix) {
  const meta = byPrefix.get(prefix) || byPrefix.get(DEFAULT_PREFIX);
  const dict = dictionaries.get(meta.prefix);
  const tag = meta.tag;

  const fmt = {
    dateLong: new Intl.DateTimeFormat(tag, { dateStyle: 'long' }),
    dateFull: new Intl.DateTimeFormat(tag, { dateStyle: 'full' }),
    dateShort: new Intl.DateTimeFormat(tag, { dateStyle: 'medium' }),
    time: new Intl.DateTimeFormat(tag, { timeStyle: 'short' }),
    number: new Intl.NumberFormat(tag),
    compact: new Intl.NumberFormat(tag, { notation: 'compact', maximumFractionDigits: 1 }),
    percent: new Intl.NumberFormat(tag, { style: 'percent', maximumFractionDigits: 1 }),
    currency: new Intl.NumberFormat(tag, {
      style: 'currency',
      currency: dict.currency || 'COP',
      maximumFractionDigits: 0,
    }),
    relative: new Intl.RelativeTimeFormat(tag, { numeric: 'auto' }),
    list: new Intl.ListFormat(tag, { style: 'long', type: 'conjunction' }),
    plural: new Intl.PluralRules(tag),
  };

  /** Traduce una clave; devuelve la clave misma si falta (visible en QA). */
  function t(key, vars) {
    const value = lookup(dict, key);
    if (value === undefined) return key;
    if (typeof value === 'string') return interpolate(value, vars);
    return value;
  }

  /**
   * Plural apoyado en Intl.PluralRules: se buscan las claves
   * `<base>One`, `<base>Two`, `<base>Few`, `<base>Many`, `<base>Other`.
   * El árabe usa hasta seis categorías; el código no cambia por idioma.
   */
  function plural(base, n, vars = {}) {
    const cat = fmt.plural.select(n);
    const suffix = cat.charAt(0).toUpperCase() + cat.slice(1);
    const key = lookup(dict, base + suffix) !== undefined ? base + suffix : base + 'Other';
    return interpolate(lookup(dict, key) || key, { n: fmt.number.format(n), ...vars });
  }

  /** Diferencia en días respecto de hoy, expresada en lenguaje natural. */
  function relativeDays(isoDate, now = new Date()) {
    const then = new Date(isoDate + 'T12:00:00Z');
    const days = Math.round((then - now) / 86400000);
    if (Math.abs(days) < 1) return fmt.relative.format(0, 'day');
    if (Math.abs(days) < 30) return fmt.relative.format(days, 'day');
    return fmt.relative.format(Math.round(days / 30), 'month');
  }

  return {
    prefix: meta.prefix,
    tag,
    dir: dict.dir,
    dict,
    t,
    plural,
    fmt,
    relativeDays,
    locales: LOCALES.map((l) => ({
      prefix: l.prefix,
      tag: l.tag,
      nativeName: dictionaries.get(l.prefix).nativeName,
      shortName: dictionaries.get(l.prefix).shortName,
      dir: dictionaries.get(l.prefix).dir,
    })),
  };
}

module.exports = { LOCALES, DEFAULT_PREFIX, isSupported, negotiate, createContext };
