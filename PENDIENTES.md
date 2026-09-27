# Pendientes — Web AIRON Studio

Tareas para retomar. Cada una dice qué hace falta y quién lo hace.

Web publicada: https://airon-studio-web.laionbeats.workers.dev (inglés: `/en/`)

---

## 1. Dominio + email profesional

- [ ] Comprar el dominio (sugerido: `aironstudio.com.ar` en nic.ar; opcional `aironstudio.com`).
- [ ] Conectarlo en Cloudflare a la web.
- [ ] Crear el email `hola@aironstudio.com.ar` con **Cloudflare Email Routing** (gratis), reenviando a aironstudio.ar@gmail.com.
- [ ] Cambiar `url:` en `build.mjs` por la nueva dirección (para Google, el mapa del sitio y las imágenes para compartir).

**Qué hace falta de AIRON:** comprar el dominio y avisar cuál es.

## 2. Testimonios de clientes

- [ ] Pedir 2 o 3 testimonios reales (por ejemplo a GSP Seguridad, Blend David, Eleven Games).
- [ ] Agregar la sección de testimonios en el Inicio (español e inglés).

**Qué hace falta de AIRON:** la frase de cada cliente + nombre, cargo y empresa.

## 3. Reel en video

- [ ] Video de 20–30 segundos, sin sonido, horizontal, en MP4, con cortes de los trabajos.
- [ ] Subirlo al Drive (`AIRON STUDIO › 02_WEB-PORTAFOLIO`).
- [ ] Agregarlo al Inicio, optimizado para que no haga lenta la web.

**Qué hace falta de AIRON:** el video.

## 4. Estadísticas de visitas (Cloudflare Web Analytics)

- [ ] En Cloudflare: **Web Analytics → Add a site** con la dirección de la web.
- [ ] Copiar el *token* del código que da Cloudflare.
- [ ] Agregar el código a la web. Las cabeceras de seguridad (`src/static/_headers`) ya permiten `static.cloudflareinsights.com` y `cloudflareinsights.com`.

**Qué hace falta de AIRON:** el token.

## 5. Google Search Console

- [ ] Entrar a search.google.com/search-console → **Agregar propiedad → Prefijo de URL** con la dirección de la web.
- [ ] Elegir el método **"Etiqueta HTML"** y copiar el código de `content="..."`.
- [ ] Agregar la etiqueta a la web y enviar el mapa del sitio (`/sitemap.xml`).

**Qué hace falta de AIRON:** el código de verificación. Conviene hacerlo después de conectar el dominio (punto 1).

## 6. Pasar la web a cuentas propias

Hoy el código está en el GitHub de **canalcapitales** y la web en el Cloudflare de **Capitales**.

- [ ] Crear una cuenta de GitHub con aironstudio.ar@gmail.com (con verificación en dos pasos).
- [ ] Transferir el repositorio `airon-studio-web` a esa cuenta.
- [ ] Crear una cuenta de Cloudflare propia (con verificación en dos pasos) y volver a conectar la web.
- [ ] Quitar el acceso de canal@capitales.com.ar a la carpeta AIRON STUDIO del Drive.
- [ ] Borrar la carpeta temporal "AIRON STUDIO — ESTRUCTURA (descargar)" del Drive de Capitales.

**Qué hace falta de AIRON:** crear las cuentas.

---

## Otros detalles anotados

- **CapiTales (diseño web):** agregarlo cuando se lance (01/04/2027) o antes si hay permiso, con capturas, rol y año.
- **Branding x AIRON Studio:** el muro muestra 20 de 27 identidades. Faltan las otras 7 (subirlas al Drive).
- **Tarjeta del logo M93:** en la imagen original dice "BRANDY — Pizzas & empanadas". Corregir en Illustrator y en Behance.
- **Traducción al inglés:** revisarla (`src/data/proyectos.en.json`). Cada proyecto nuevo necesita su texto en inglés.
