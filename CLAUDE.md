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
- Áreas de proyecto (en este orden): integral (Diseño integral), branding, redes (Redes sociales), ploteo (Ploteo vehicular), aplicada (Gráfica), musical (Gráfica musical), motion (Motion y video), web (Web y sistemas), urbano (Murales), foto (Fotografía).
- Los trabajos se recorren de **dos formas**: por **Áreas** (`/proyectos/`, según `categorias`) y por **Clientes** (`/clientes/`). Los clientes y sus casos están en `src/data/clientes.json`: al sumar un caso nuevo, agregarlo también a su cliente (o crear el cliente). Si un caso reúne muchos clientes, va en `colecciones`.
- **LAION** es un proyecto aparte: su sitio es **laion.com.ar**, con repo propio `canalcapitales/laion-web` (carpeta `02_laion/laion-web`, Worker `laion`). Acá solo hay botones hacia laion.com.ar (menú y bloque en Murales, imagen `src/static/img/laion/pieza-28-700.webp`) y `/laion/` redirige ahí. Si cambia el Tarifario Mural, actualizar también la copia de laion-web. Los murales por encargo van en `/murales/encargos/`.
- Imágenes en WebP. `/img/*` tiene caché de 1 hora: si se reemplaza una imagen, **cambiarle el nombre** (ej. `portada-v2`) para que se actualice.
- Tipografías alojadas (licencia OFL): Anton, Instrument Sans, IBM Plex Mono, Michroma (bloque de LAION en Murales) y Oswald.
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
