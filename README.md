# SETPasto+

Rediseño del portal del **Sistema Estratégico de Transporte Público de Pasto**
(`http://181.49.177.91/`) para el taller de **contenido, voz e internacionalización**
de Diseño de Interfaces de Software.

No es una copia con otra piel: el sitio original se auditó en tres dimensiones y
cada decisión de este rediseño responde a un hallazgo concreto. La auditoría
completa está en [`docs/AUDITORIA.md`](docs/AUDITORIA.md) y también vive dentro
de la aplicación, en `/es/auditoria`.

---

## Cómo ejecutarlo

```bash
npm install      # dependencias
npm run build    # copia vendor + compila Tailwind a public/css/app.css
npm start        # http://localhost:3000
```

Para desarrollar, en dos terminales (así funciona igual en Windows, macOS y Linux):

```bash
npm run css:watch   # recompila Tailwind al guardar
npm run dev         # reinicia el servidor al guardar
```

La raíz `/` negocia el idioma con la cabecera `Accept-Language` y redirige a
`/es`, `/en`, `/pt` o `/ar`.

---

## Despliegue en Vercel

Vercel no mantiene un proceso escuchando en un puerto: importa el módulo y usa
la app de Express como manejador de cada petición. Tres piezas lo resuelven:

- `server.js` exporta `app` y solo llama a `listen()` cuando se ejecuta
  directamente (`require.main === module`).
- `api/index.js` reexporta esa app como función serverless.
- `vercel.json` compila el CSS en el build, sirve `public/` como estático y
  reescribe el resto de las rutas hacia la función.

```bash
npm i -g vercel
vercel          # vista previa
vercel --prod   # producción
```

**Si ves un 404, mira primero el log del build.**

Si el log dice `Build Completed in /vercel/output [39ms]` y **nunca aparece
`Installing dependencies`**, Vercel no encontró el proyecto: no compiló nada y
desplegó una salida vacía. Pasa cuando `package.json` y `vercel.json` no están
en la carpeta que Vercel está mirando.

El log correcto empieza con `Installing dependencies…`, sigue con el
`Rebuilding…` de Tailwind y tarda decenas de segundos, no milisegundos.

Este proyecto vive en la **raíz del repositorio**, así que *Settings → Build and
Deployment → Root Directory* debe estar **vacío**. Si alguna vez apuntó a una
subcarpeta, bórralo, guarda y vuelve a desplegar desde *Deployments → ⋯ →
Redeploy*.

Si aun así falla, revisa:

1. **Framework Preset** en `Other`. Si quedó en Next.js o similar, ignora la
   configuración de este proyecto.
2. **Build Command** y **Output Directory** vacíos en el dashboard, para que
   manden los valores de `vercel.json`.
3. Que `api/index.js` y `vercel.json` estén realmente en el commit desplegado.

`public/css/app.css` y `public/vendor/` están en `.gitignore` a propósito: los
genera `npm run build` durante el despliegue.

---

## Stack

| Pieza | Elección | Por qué |
|---|---|---|
| Servidor | Node.js + Express 5 | El idioma se resuelve en el servidor, no en el cliente: la primera respuesta ya trae `lang`, `dir` y `hreflang` correctos. |
| Vistas | EJS | Plantillas sin cadenas de texto: todo el contenido viene de los diccionarios. |
| Estilos | Tailwind CSS 3 | Layout con `grid` y `flex` según los lineamientos del curso; propiedades lógicas (`ps-`, `me-`, `text-start`) para que el árabe funcione sin CSS aparte. |
| Gráficos | Chart.js 4 | Paleta categórica propia, validada para daltonismo; cada gráfico trae su tabla equivalente. |
| Animación | anime.js 3 | Revelados escalonados y contadores; todo desactivable por `prefers-reduced-motion` y por el panel de accesibilidad. |

No se carga nada desde un CDN: `npm run vendor` copia `anime.js` y `chart.js`
a `public/vendor/`, para que el portal funcione en una red restringida.

---

## Estructura

```
.
├─ server.js                 rutas, negociación de idioma, validación del formulario
├─ api/index.js              entrada serverless (Vercel): reexporta la app
├─ vercel.json               build, estáticos y reescrituras del despliegue
├─ src/
│  ├─ i18n/
│  │  ├─ index.js            registro de locales, negociación, formateadores Intl
│  │  ├─ es-CO.json          ← locale base
│  │  ├─ en-US.json  pt-BR.json  ar.json
│  ├─ data/
│  │  ├─ routes.js           23 rutas (C1–C16, E1–E7) con frecuencia, horario y accesibilidad
│  │  └─ metrics.js          series de los indicadores y puntajes de la auditoría
│  └─ css/input.css          tokens, componentes y utilidades de Tailwind
├─ views/
│  ├─ partials/              head · header · footer · fondo topográfico
│  └─ pages/                 home · routes · route-detail · indicators · pqrs · accessibility · audit · 404
├─ public/
│  ├─ css/app.css            compilado (no se edita a mano)
│  ├─ js/                    app · routes · route-detail · indicators · audit · pqrs · a11y · chart-base
│  └─ vendor/                anime.min.js · chart.umd.min.js
└─ shots/                    capturas de referencia
```

---

## Internacionalización

Cuatro locales, cada uno con su propia URL y su propio diccionario:

| URL | `lang` | Tag de formato | Dirección |
|---|---|---|---|
| `/es` | `es-CO` | `es-CO` | ltr |
| `/en` | `en-US` | `en-US` | ltr |
| `/pt` | `pt-BR` | `pt-BR` | ltr |
| `/ar` | `ar` | `ar-u-nu-arab` | **rtl** |

Lo que hace este proyecto y el portal original no hacía:

- **Negociación real.** `/` lee `Accept-Language`, ordena por factor `q` y
  redirige al idioma soportado más alto en la lista.
- **`hreflang` en las cuatro versiones**, más `x-default`, en cada página.
- **`lang` y `dir` correctos por idioma**, emitidos por el servidor.
- **Locale del público, no del idioma.** `es-CO`, no `es-ES`: la fecha sale
  «19 de agosto de 2026» y el número «1.284.000».
- **Formato delegado a `Intl`**: fechas, horas, números, moneda, tiempo
  relativo, listas y plurales. No hay una sola cadena de formato escrita a mano.
- **Plurales por categoría CLDR** (`one`, `two`, `few`, `many`, `other`), no por
  un `if (n === 1)`. El mismo código sirve para el árabe.
- **Sistema de numeración separado de la identidad lingüística.** `<html lang="ar">`
  y `ar-u-nu-arab` para el formato: los dígitos indoarábigos (٢٬٩٠٠) salen de
  `Intl`, no de una traducción manual.
- **RTL sin hoja de estilos aparte.** Todo el layout usa propiedades lógicas;
  los iconos de flecha se espejan con la utilidad `flip-rtl`.
- **Cero texto dentro de imágenes.** Todo lo que se lee es HTML traducible.

Para añadir un idioma: se copia un JSON de `src/i18n/`, se traduce y se agrega
una línea al array `LOCALES` de `src/i18n/index.js`. Nada más.

---

## Accesibilidad

- Objetivo WCAG 2.2 AA y Resolución 1519 de 2020 (MinTIC).
- Enlace de salto al contenido, foco visible en todo el sitio, navegación
  completa por teclado.
- Cada gráfico trae `role="img"`, etiqueta accesible y **tabla de datos
  equivalente** en un `<details>`.
- Panel de ajustes en `/es/accesibilidad`: tamaño de texto, contraste reforzado,
  subrayado de enlaces y reducción de animaciones, guardados en `localStorage`.
- El formulario PQRSD valida en el servidor: funciona con JavaScript desactivado,
  y con JavaScript el foco salta al resumen de errores.
- La paleta de los gráficos se validó con el verificador de contraste y
  separación para daltonismo, en modo claro y oscuro por separado.

---

## Datos

Las cifras de rutas, indicadores y noticias son **ilustrativas**, construidas
para el ejercicio. Este es un prototipo académico sin vínculo oficial con
AVANTE SETP ni con la Alcaldía de Pasto.
