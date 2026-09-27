# AIRON Studio — Web portafolio

Sitio web de AIRON Studio: Inicio, Proyectos (con filtros), una página por proyecto, Sobre mí y Contacto.

## Cómo está organizado

| Archivo / carpeta | Qué es |
|---|---|
| `src/data/proyectos.json` | **La lista de proyectos**: títulos, textos, categorías, portadas e imágenes. Casi todo lo que cambies va acá. |
| `src/static/css/styles.css` | Colores, tipografías y diseño. |
| `src/static/js/main.js` | Menú de celular y filtros de proyectos. |
| `build.mjs` | Arma todas las páginas a partir de la lista de proyectos. |
| `netlify.toml` | Configuración de publicación y de seguridad para Netlify. |

La carpeta `dist/` se genera sola: no se edita a mano.

## Ver la web en tu computadora

Necesitás tener [Node.js](https://nodejs.org) instalado (descargalo solo desde su web oficial).

```bash
node build.mjs
cd dist && python3 -m http.server 8000
```

Después abrí `http://localhost:8000` en el navegador.

## Publicar en Netlify

1. En Netlify: **Add new site → Import an existing project → GitHub** y elegí este repositorio.
2. Netlify lee `netlify.toml` solo: no hace falta configurar nada más.
3. Cada vez que se actualiza el repositorio, la web se vuelve a publicar sola.

El formulario de contacto usa **Netlify Forms**: los mensajes llegan al panel de Netlify (*Forms*), y desde ahí se pueden reenviar a tu email.

## Imágenes provisorias

Por ahora las portadas y galerías se muestran desde los servidores de Adobe Portfolio (`cdn.myportfolio.com`). Cuando estén las imágenes definitivas en Drive (`06_Web-Behance` de cada proyecto), se reemplazan en `src/data/proyectos.json` por archivos propios.

## Pendientes

- Imágenes definitivas de cada proyecto.
- Foto para "Sobre mí".
- Enlace de Behance de cada proyecto (hoy apuntan al perfil).
- Conectar el dominio propio.
