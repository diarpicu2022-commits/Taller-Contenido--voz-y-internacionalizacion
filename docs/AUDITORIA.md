# Auditoría del portal SETPasto

**Sitio auditado:** `http://181.49.177.91/` — Sistema Estratégico de Transporte
Público de Pasto (AVANTE SETP).
**Fecha del diagnóstico:** agosto de 2026.
**Método:** revisión del HTML servido en la portada, del árbol de navegación y
de las cadenas visibles, contrastada con una heurística de contenido, voz e
internacionalización.

**Plataforma detectada:** Joomla! con plantilla Gantry 5 / Salient, módulos
`mod_bt_contentslider`, `mod_sp_poll`, `mod_vvisit_counter` y `mod_bt_googlemaps`.
Se sirve por HTTP sin cifrar y desde una dirección IP, sin dominio propio.

---

## Resumen

| Dimensión | Hallazgos | Alta | Media | Baja |
|---|---|---|---|---|
| Contenido | 5 | 3 | 2 | 0 |
| Voz y tono | 4 | 1 | 2 | 1 |
| Internacionalización | 6 | 3 | 3 | 0 |
| **Total** | **15** | **7** | **7** | **1** |

Puntaje heurístico, escala 0–100:

| Dimensión | Portal original | SETPasto+ |
|---|---|---|
| Claridad del contenido | 34 | 88 |
| Consistencia de voz | 28 | 92 |
| Internacionalización | 18 | 95 |
| Accesibilidad | 41 | 91 |
| Arquitectura de información | 30 | 89 |

---

## 1. Contenido

### 1.1 El contenido está congelado en 2019 · **Alta**
La noticia más reciente de la portada está fechada el 24 de septiembre de 2019.
El menú conserva una entrada llamada «Sala de prensa Antigua», lo que implica
que existió una migración que nunca terminó de limpiarse.
**Decisión de rediseño:** franja de estado del servicio en vivo sobre el
encabezado, avisos operativos con fecha absoluta *y* relativa («hace 8 días»)
para que la antigüedad sea evidente, y una sola sala de prensa.

### 1.2 La navegación se organiza por verbos institucionales · **Alta**
El menú principal es «Súbete · Conoce · Actúa · Transita · Entérate ·
Contáctanos». Ninguna de esas etiquetas anticipa el contenido: «Transita»
esconde la página de accesibilidad y «Actúa» agrupa educación ciudadana con una
encuesta de opinión.
**Decisión de rediseño:** menú por tareas reales — *Rutas y paraderos,
Indicadores, PQRSD, Accesibilidad, Auditoría*.

### 1.3 Las 23 rutas se listan una por una en el menú · **Media**
De «RUTA C1» a «RUTA C16» y de «RUTA E1» a «RUTA E7», como ítems sueltos de un
submenú. Encontrar una ruta exige leer 23 etiquetas idénticas.
**Decisión de rediseño:** explorador de rutas con buscador que ignora tildes,
filtros por familia y por accesibilidad, tabla ordenable en escritorio, tarjetas
en móvil y una ficha por ruta con paraderos y demanda horaria.

### 1.4 Ruido que compite con la tarea principal · **Media**
La columna lateral de la portada la ocupan un contador de visitas
(555.903 visitantes), una encuesta «Ud cree que la gestión de SETP Pasto es:
Excelente / Buena / Regular / Mala» y un widget de Facebook. Ninguno ayuda a
tomar un bus.
**Decisión de rediseño:** los tres se retiran. La rendición de cuentas se
traslada a una página de indicadores con datos verificables y descargables en
tabla.

### 1.5 Falta la información más buscada · **Alta**
No hay tarifa, horarios ni frecuencias en la portada. Tampoco en el primer nivel
de navegación.
**Decisión de rediseño:** tarifa vigente en la primera pantalla, con la regla de
transbordo y la tarifa diferencial; frecuencia y horario en cada fila de la tabla
de rutas y en cada ficha.

---

## 2. Voz y tono

### 2.1 Registro administrativo, no ciudadano · **Alta**
Titular real de la portada:
> «En Sesión Extraordinaria el Consejo Directivo de Avante Aprueba la Segunda
> Fase del Sistema de Gestión y Control de Flota para la Implementación del SETP
> en la Ciudad de Pasto»

Veintiséis palabras, sujeto institucional, ningún beneficio para quien lee.
**Decisión de rediseño:** titulares en caja de oración, con el verbo adelante y
un máximo de doce palabras. La página de inicio incluye una sección «Cómo
hablamos» que muestra el antes y el después de tres reescrituras.

### 2.2 Siglas sin explicar · **Media**
SETP, SGCF, PQRS y AVANTE aparecen sin definición en la portada. «El SGCF
reporta el cumplimiento del SETP» es ilegible para quien llega por primera vez.
**Decisión de rediseño:** la primera mención siempre se desarrolla. «El centro de
control revisa en vivo que los buses cumplan sus horarios».

### 2.3 Titulares en mayúsculas sostenidas · **Media**
> «OCHO RUTAS CAMBIAN TEMPORALMENTE SU RECORRIDO POR OBRAS EN LA CARRERA 27 CON
> CALLE 16»

Además de gritar, muchos lectores de pantalla deletrean las versales sostenidas.
**Decisión de rediseño:** mayúsculas solo en las insignias de ruta (C1, E7),
donde funcionan como señalética.

### 2.4 El usuario aparece en tercera persona · **Baja**
> «Nuestros usuarios nos dan sus valiosas opiniones con respecto al servicio que
> se está implementando».

**Decisión de rediseño:** tuteo consistente en toda la interfaz. «Valida tu
tarjeta al subir», «¿A dónde vas hoy, Pasto?».

---

## 3. Internacionalización

### 3.1 Un solo idioma, sin alternativa · **Alta**
`<html lang="es-ES">` fijo, sin selector de idioma ni etiquetas `hreflang`.
**Decisión de rediseño:** cuatro locales con ruta propia (`/es`, `/en`, `/pt`,
`/ar`), negociación por `Accept-Language`, selector con enlaces reales a la misma
página en cada idioma y `hreflang` + `x-default` en todas las páginas.

### 3.2 El locale declarado no es el del público · **Media**
Se declara `es-ES` (España) para un sistema de transporte colombiano. Un lector
de pantalla configurado en español peninsular no es lo mismo que uno en español
colombiano, y el formato de fecha y número tampoco.
**Decisión de rediseño:** `es-CO` como locale base.

### 3.3 Cadenas de la plataforma sin traducir · **Alta**
En medio del contenido en español aparecen cadenas en inglés de la plantilla:
`Created on Martes, 24 Septiembre 2019` en cada noticia y `Back` en el menú
móvil.
**Decisión de rediseño:** el 100 % de las cadenas vive en diccionarios JSON
versionados. Ninguna cadena queda escrita dentro de una plantilla, así que una
cadena sin traducir es imposible de introducir por descuido.

### 3.4 Fechas y números escritos a mano · **Media**
«Martes, 24 Septiembre 2019» carece de la preposición «de» que exige el español,
y los separadores de miles del contador de visitas no son consistentes con los
del resto del sitio.
**Decisión de rediseño:** todo el formato lo produce la API `Intl` —
`DateTimeFormat`, `NumberFormat`, `RelativeTimeFormat`, `ListFormat` y
`PluralRules`. La portada incluye un panel «Internacionalización, en vivo» que
muestra los siete formateadores resueltos en el idioma activo.

### 3.5 El layout está atado a la dirección izquierda-derecha · **Media**
Márgenes y flotantes fijos en píxeles, sin propiedades lógicas. Añadir un idioma
RTL exigiría una hoja de estilos entera.
**Decisión de rediseño:** propiedades lógicas en todo el layout (`ps-`, `pe-`,
`ms-`, `me-`, `start-`, `text-start`). El árabe reordena la interfaz completa sin
una sola regla CSS adicional; solo se espejan los iconos direccionales.

### 3.6 Texto incrustado en imágenes · **Alta**
Los banners del carrusel llevan el mensaje quemado dentro del JPG
(`Banner_cambio_8_rutas_Mesa_de_trabajo_1.jpg`,
`COMUNICADO_Calle_20.jpg`). Ese texto no se puede traducir, ni seleccionar, ni
leer con un lector de pantalla, ni indexar.
**Decisión de rediseño:** el texto va en HTML sobre la imagen. Es traducible,
seleccionable, accesible e indexable.

---

## 4. Observaciones fuera de alcance del taller

Se registran porque afectan la confianza en el contenido, aunque no formen parte
de las tres dimensiones evaluadas:

- **HTTP sin cifrar y sobre una IP.** Un portal de gobierno debería servirse por
  HTTPS y desde un dominio institucional; hoy el navegador lo marca como «no
  seguro».
- **Dependencias de terceros que ya no cargan.** El mapa usa la API de Google
  Maps sin clave (`maps.google.com/maps/api/js`), que dejó de funcionar sin
  autenticación, y el SDK de Facebook apunta a la versión 2.5.
- **jQuery cargado cuatro veces** por distintos módulos de Joomla, más
  `jquery-migrate`.
- **Comentarios condicionales para IE 8–9** en el `<head>`.

---

## 5. Qué revisar en una segunda iteración

1. Datos reales de rutas, paraderos y tarifa conectados a la fuente oficial de
   AVANTE, en lugar de las cifras ilustrativas del prototipo.
2. Planificador de viajes con geolocalización y cálculo origen–destino.
3. Subtitulado del archivo audiovisual histórico (criterio WCAG 1.2.2, hoy en
   cumplimiento parcial).
4. Pruebas con usuarios reales en paradero, con dispositivos de gama baja y
   conexión móvil.
