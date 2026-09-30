# AIRON Studio — Web portafolio

Sitio web de AIRON Studio: Inicio, Proyectos (con filtros), una página por proyecto, Sobre mí y Contacto.

## Cómo está organizado

| Archivo / carpeta | Qué es |
|---|---|
| `src/data/proyectos.json` | **La lista de proyectos** en español: títulos, textos, categorías, portadas e imágenes. |
| `src/data/proyectos.en.json` | **La traducción al inglés** de cada proyecto. |
| `"previa": 2` (en un proyecto) | Elige qué imagen de la galería aparece al pasar el mouse por su tarjeta (1 = la primera). |
| `src/data/tarifario-diseno.json` | **Valores del Tarifario de diseño** (118 servicios por rubro y tipo de cliente), adaptado con permiso de la Cámara de Diseñadores de Rafaela. |
| `src/data/legales.mjs` | **Textos de la página Legales** (privacidad, herramientas, derechos de autor) y **preguntas frecuentes de Herramientas**, en español e inglés. Si cambiás algo, actualizá también la fecha `ACTUALIZADO`. |
| `src/data/logos.json` | **Muro de logos** del proyecto Branding x AIRON Studio: los 25 logos (archivos en `src/static/img/logos/`), con nombre, rubro, grupo para el filtro y, si lo tiene, el proyecto con su caso completo. |
| `src/data/publicidad.json` | **Marquesina de publicidad** (en el inicio, en cada herramienta y arriba del pie en el resto): anunciantes con logo, enlace y fecha de fin. Los logos van en `src/static/img/publicidad/`. Sin anunciantes vigentes, muestra espacios de ejemplo que llevan a Contacto. |
| `kit-estetica/` | **Kit de estética** para llevar el diseño de la web a otro proyecto: tipografías, colores, componentes y movimientos, con `demo.html` y una guía para Claude Code. No se publica en la web. |
| `src/data/tarifario-murales.json` | **Valores de la calculadora de murales** (Tarifario Mural): precio por m² según tramo, tipo de cliente y diseño, más boceto, evento y asistencia. |
| `src/static/css/styles.css` | Colores, tipografías y diseño. Arriba están los colores del modo claro (`:root`) y debajo los del modo oscuro. |
| `src/static/js/main.js` | Menú de celular, botón de modo claro/oscuro, filtros, visor de imágenes, formulario y las herramientas (calculadora de murales, tarifario de diseño, letras Unicode y convertidor a PNG). Todas funcionan en el navegador, sin servicios externos. |
| `src/static/js/tema.js` | Aplica el modo (claro u oscuro) que eligió el visitante antes de mostrar la página. |
| `src/static/ia/` | Motor de IA (ONNX Runtime Web, MIT) y modelo U²-Netp (Apache 2.0) para "Quitar fondo con IA" en el convertidor a PNG. Se descargan solo cuando alguien activa esa opción; licencias en `LICENCIAS.txt`. |
| `src/static/site.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Nombre e íconos para cuando alguien guarda la web en la pantalla de inicio del celular. |
| `build.mjs` | Arma todas las páginas en español (`/`) e inglés (`/en/`). Los textos de menú, botones y secciones están arriba, en `TXT`. |
| `src/static/_headers` | Cabeceras de seguridad. |
| `wrangler.jsonc` | Configuración de publicación en Cloudflare. |

La carpeta `dist/` se genera sola: no se edita a mano. Las tipografías están en `src/static/fonts/` (licencia SIL Open Font License).

## Ver la web en tu computadora

Necesitás tener [Node.js](https://nodejs.org) instalado (descargalo solo desde su web oficial).

```bash
node build.mjs
cd dist && python3 -m http.server 8000
```

Después abrí `http://localhost:8000` en el navegador.

## Publicar en Cloudflare

La web se publica con **Cloudflare Workers** (plan gratis). La configuración está en `wrangler.jsonc`.

1. En Cloudflare: **Workers & Pages → Create → Import a repository** y elegí este repositorio.
2. Completá así:
   - **Build command:** `node build.mjs`
   - **Deploy command:** `npx wrangler deploy` (viene puesto)
3. **Deploy.** Cada vez que se actualiza el repositorio, la web se vuelve a publicar sola.

## Formulario de contacto

Usa **Formspree** (plan gratis), que reenvía los mensajes a tu email.

1. Creá una cuenta en formspree.io y un formulario nuevo.
2. Formspree te da una dirección como `https://formspree.io/f/xyzabcde`.
3. Copiá el código final (`xyzabcde`) en `formspree:` dentro de `build.mjs`.

Mientras ese código esté vacío, el formulario muestra un aviso para escribir por redes.

## Imágenes

Todas las imágenes están en la propia web, en `src/static/img/p/<proyecto>/`, en formato WebP y en dos tamaños (640 y 1280 px). Las imágenes para compartir en redes están en `src/static/img/og/`.

## Pendientes

La lista completa de tareas para retomar está en [`PENDIENTES.md`](PENDIENTES.md).
