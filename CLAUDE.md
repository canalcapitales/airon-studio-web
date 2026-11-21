# CLAUDE.md — guía para trabajar en la web de AIRON Studio

Web: https://aironstudio.com.ar · Repo: `canalcapitales/airon-studio-web` · Detalle de archivos en `README.md`.

## Quién es el usuario
- Matías Fernando González (alias de artista graffiti: **LAION**), Diseñador en Comunicación Visual (FDA–UNLP), director de AIRON Studio. Vive en La Plata.
- Es **diseñador principiante en lo técnico**: responder en **español rioplatense**, simple y directo, guiando paso a paso.
- **Seguridad primero**: no descargar ni instalar nada que pueda volver vulnerable la computadora; nunca pedir contraseñas, códigos ni tokens; revisar los SVG de terceros (sin `<script>`, `on*=`, `<foreignObject>`) antes de usarlos.
- Autorizó crear PRs y hacer merge sin preguntar, pero **no hacer cosas que no pidió**.

## Cómo se publica
1. Editar en `src/` o `build.mjs` (nunca en `dist/`, que se genera solo).
2. Probar: `node build.mjs` y abrir `dist/` con un servidor local (ver README).
3. Commit en una rama de trabajo, push, PR contra la rama por defecto **`claude/clever-lamport-hmyyn1`** y merge.
4. **Cloudflare Workers Builds publica solo** al hacer merge (tarda 1–3 minutos). Verificar en la web en vivo.

## Convenciones
- Sitio estático bilingüe: `build.mjs` arma ES (`/`) y EN (`/en/`). Textos de interfaz en `TXT`, rutas en `RUTAS`.
- `src/data/proyectos.json` (ES) y `src/data/proyectos.en.json` (EN): en el inglés hacer **cambios mínimos**, nunca reescribirlo entero.
- Áreas de proyecto (en este orden): integral (Diseño integral), branding, redes (Redes sociales), ploteo (Ploteo vehicular), flyers (Flyers), musical (Gráfica musical), motion (Motion y video), web (Web y sistemas), urbano (Murales), foto (Fotografía), ilustracion (Ilustración). Un área sin trabajos no se linkea ni aparece en los filtros.
- Los trabajos se recorren de **dos formas**: por **Áreas** (`/proyectos/`, según `categorias`) y por **Clientes** (`/clientes/`). Los clientes y sus casos están en `src/data/clientes.json`: al sumar un caso nuevo, agregarlo también a su cliente (o crear el cliente). Si un caso reúne muchos clientes, va en `colecciones`. En `/clientes/` las colecciones aparecen en cada cliente solo como enlace de texto ("También en las colecciones"); su tarjeta con imagen está una vez, en la sección Colecciones. **Cada cliente tiene su propia página** (`/clientes/<id>/`, en inglés `/en/clients/<id>/`) que se arma sola desde `clientes.json`; las viejas anclas `/clientes/#id` siguen funcionando. Los números y muros de "clientes" no cuentan `airon-studio` (trabajos propios).
- **Carruseles por área** (pedido del usuario 2026-11-21, referencia: carrusel de eventos con la pieza central grande y las laterales giradas): `/proyectos/` muestra **un carrusel por área**, cada uno sobre un **pleno** de color de AIRON alternado (rojo: branding, ploteo, motion, foto · crema: redes, musical, web, ilustración · negro: integral, flyers, urbano). Cada proyecto va en su área principal (`categorias[0]`). La barra de áreas queda fija y salta a `#area-<id>`; `?categoria=<id>` baja a esa área. Los **muros** de Branding (logos), Flyers y Portadas también son carruseles, con filtro por grupo. Código: `piezaCarrusel` y `carruselHTML` en `build.mjs`, `carrusel()` en `main.js` (avanza solo cada ~4 s, se frena con el mouse encima o fuera de pantalla), estilos en "carrusel por área" de `styles.css` (colores por `data-area`; formatos `carrusel--apaisado` y `carrusel--historia`). Un área nueva necesita su color en `styles.css`.
- **Menú** (desde 2026-11-21, auditoría de contenido repetido): Trabajos (`/proyectos/`, con filtros por área) · Clientes · Diseño web · Nosotros · Herramientas · Contacto. "Ver todos los trabajos" lleva a `/proyectos/`.
- **Inicio**: después del título va la sección **Áreas** (`#areas`, adonde lleva el botón del título), para que se vea enseguida qué cubre el estudio; en Áreas, "Web y sistemas" no lista las webs: lleva a la vitrina de Diseño web que está justo abajo. Sigue un solo bloque oscuro con la presentación breve del estudio y los números (`numeros(l, proyectos, { intro: true })`); después, **3 proyectos destacados** de áreas distintas (constante `DESTACADOS` en `build.mjs`, en orden), el muro de clientes y "Cómo trabajamos". Ya no hay franja de disciplinas. La publicidad del inicio va al final, arriba del pie.
- **Nosotros** no repite el portafolio: presentación, equipo, números, "Cómo trabajamos" y el botón final (sin destacados, disciplinas ni muro de clientes).
- **Diseño web al frente** (pedido del usuario 2026-11-20, para conseguir clientes): en el inicio, después de Áreas, va la sección oscura **Diseño web** (`#diseno-web`, función `disenoWeb` en `build.mjs`, textos en `TXT.webHome`) armada como **vitrina**: lista de webs a la izquierda y una ventana de navegador que recorre sola cada web de arriba a abajo y pasa a la siguiente (`vitrinaWeb` en `main.js`). Cada web muestra un **video real recorriéndola** (`src/static/video/<slug>-recorrido-v2.mp4`, 1280×800, ~20 s, se carga recién cuando le toca); sin JavaScript o con "reducir movimiento" queda la captura completa `/img/casos/<slug>-scroll.webp` (1100 px de ancho). **Al sumar una web nueva** hay que hacer las dos cosas con las herramientas de `scripts/` (solo usan el Chrome instalado): `node scripts/grabar-web.mjs <url> src/static/video/<slug>-recorrido-v2.mp4` (graba cuadro por cuadro a 30 fps parejos, frenando las animaciones de la web mientras saca cada foto, y deja el MP4 con su duración; tarda ~2 minutos; desde 2026-11-21 reemplaza la grabación en tiempo real, que salía trabada; `scripts/duracion-mp4.mjs` solo hace falta para videos viejos de MediaRecorder) y `node scripts/captura-completa.mjs <url> captura.png` (pasarla a WebP de 1100 px). Los videos tienen caché de 7 días: si se regraba uno, **cambiarle el nombre** (`-v3`, etc. en el archivo y en `disenoWeb`) para que todos vean el nuevo. Botón "Quiero mi web" (`/contacto/?tipo=web`). El menú tiene "Diseño web" que lleva ahí. Casaca (casaca.ar) es la primera web de la lista.
- **Webs publicadas**: un proyecto con `"externo": "<url>"` (por ejemplo las webs del área Web y sistemas) no tiene página propia: su tarjeta abre el sitio en otra pestaña. Sus portadas siguen el diseño de Graffiti/R5 con la captura del sitio en una ventana de navegador.
- **Fichas**: cada proyecto lleva la clase `proyecto--<tipo>` según su primera área (marca, mural, musical, web, motion, foto, grafica) para tener su propia puesta en `styles.css`. La ficha suma sola la fila "Disciplinas" y al final aparecen "Proyectos relacionados".
- **LAION** es un proyecto aparte: su sitio es **laion.com.ar**, con repo propio `canalcapitales/laion-web` (carpeta `02_laion/laion-web`, Worker `laion`). Desde 2026-11-18 la web de AIRON muestra laion.com.ar como una de las webs del área Web y sistemas (pedido del usuario); el proyecto Graffiti sigue sin nombrar a LAION. Si cambia el Tarifario Mural, actualizar también la copia de laion-web.
- **Murales** (`/murales/`) muestra directo los trabajos (proyectos con categoría `urbano`: Blend David, R5 y Graffiti); la idea es que cada mural nace de la identidad del cliente, no de un estilo fijo. **Graffiti** es un proyecto más (`slug: graffiti`), presentado como "otra línea estética", **sin nombrar a LAION** ni linkear a su web; sus fotos salen de `02_laion/laion-web` y la portada se armó con el mismo diseño que R5. La vieja página `/murales/encargos/` redirige a `/murales/#trabajos`.
- Imágenes en WebP. `/img/*` tiene caché de 1 hora: si se reemplaza una imagen, **cambiarle el nombre** (ej. `portada-v2`) para que se actualice.
- Tipografías alojadas (licencia OFL): Anton, Instrument Sans, IBM Plex Mono, Michroma (hoy sin uso) y Oswald.
- Estética: fondo claro `#F2F0EB`, tinta `#111`, acento rojo `#FF0000`, cuadradito rojo antes de los kickers en mono.
- Sin links a Behance.

## Sponsors (marquesina "Marcas que acompañan")
- Datos en `src/data/publicidad.json` (`nombre`, `logo`, `url`, `desde`, `hasta`). Logos en `src/static/img/publicidad/`.
- Formato de logo: **800 × 320 px** (2,5:1), PNG transparente o SVG, **recortado al borde**. La web calcula el tamaño óptico según la proporción.
- Fechas `desde`/`hasta`: el navegador oculta el sponsor fuera del período. Si no queda ninguno, vuelven los espacios de ejemplo.
- Se cargan desde la carpeta de Drive "AIRON WEB - Sponsors" (planilla + carpeta Logos).

## Material pendiente en Drive
- "AIRON WEB - Proyectos para cargar": casos nuevos por área (GSP Seguridad, Trust Fund, ploteos de Hilux y Ford Ka, zócalo, redes). Cuando el usuario avise, armar los proyectos.
- Lista de pendientes general en `PENDIENTES.md`.
