# AIRON Studio — Web portafolio

Sitio web de AIRON Studio: Inicio, Proyectos (con filtros), una página por proyecto, Sobre mí y Contacto.

## Cómo está organizado

| Archivo / carpeta | Qué es |
|---|---|
| `src/data/proyectos.json` | **La lista de proyectos**: títulos, textos, categorías, portadas e imágenes. Casi todo lo que cambies va acá. |
| `src/static/css/styles.css` | Colores, tipografías y diseño. |
| `src/static/js/main.js` | Menú de celular, filtros, visor de imágenes y formulario. |
| `build.mjs` | Arma todas las páginas a partir de la lista de proyectos. |
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

## Imágenes provisorias

Por ahora las portadas y galerías se muestran desde los servidores de Adobe Portfolio (`cdn.myportfolio.com`). Cuando estén las imágenes definitivas en Drive (`06_Web-Behance` de cada proyecto), se reemplazan en `src/data/proyectos.json` por archivos propios.

## Pendientes

- Imágenes definitivas de cada proyecto.
- Conectar el dominio propio (y cambiar `url:` en `build.mjs` por la nueva dirección, para Google y el mapa del sitio).
