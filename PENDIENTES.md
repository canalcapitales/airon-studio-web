# Pendientes — Web AIRON Studio

Tareas para retomar. Cada una dice qué hace falta y quién lo hace.

Web publicada: https://aironstudio.com.ar (inglés: `/en/`)

---

## 1. Dominio + email profesional

- [x] Comprar el dominio `aironstudio.com.ar` en nic.ar (**vence el 27/09/2027** — renovar antes).
- [x] Conectarlo en Cloudflare a la web.
- [x] Cambiar `url:` en `build.mjs` por la nueva dirección (para Google, el mapa del sitio y las imágenes para compartir).
- [x] `www.aironstudio.com.ar` lleva a `aironstudio.com.ar` (regla de redirección en Cloudflare + "Always Use HTTPS" activado).
- [ ] (Opcional) Crear un email con el dominio (nombre a elegir, por ejemplo `contacto@aironstudio.com.ar`) con **Cloudflare Email Routing** (gratis), reenviando a aironstudio.ar@gmail.com. No hace falta para la web: el formulario usa Formspree.

**Qué falta:** solo el email opcional; elegir el nombre de la dirección.

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

- [x] Propiedad de **Dominio** `aironstudio.com.ar` verificada con Cloudflare (registro TXT `google-site-verification`).
- [x] Mapa del sitio enviado: `https://aironstudio.com.ar/sitemap.xml`. Los datos aparecen a los 2 o 3 días.

**Hecho.** No hizo falta agregar código a la web.

## 6. Cuentas propias — no necesario por ahora

AIRON y Capitales los maneja la misma persona y nadie más tiene acceso, así que la web sigue en el GitHub de **canalcapitales** y en el Cloudflare de **Capitales**.

- [ ] Tener la verificación en dos pasos activada en GitHub y Cloudflare de Capitales.
- [ ] (Opcional) Borrar la carpeta temporal "AIRON STUDIO — ESTRUCTURA (descargar)" del Drive de Capitales.
- Si en el futuro se suma otra persona a Capitales, separar AIRON en cuentas propias.

---

## 7. Murales — sumar más estéticas

La página `/murales/` (en inglés `/en/murals/`) muestra automáticamente todos los proyectos con la categoría `urbano`, cada uno con su estética.

- [ ] Pasar más proyectos de murales (fotos del antes, el proceso y el resultado, más los datos: cliente, lugar, medidas, jornadas y técnica).
- [ ] Para cada uno, elegir el nombre de su estética (por ejemplo "Abstracto orgánico" o "Graffiti"). Va en el campo `"estetica"` del proyecto.
- [ ] Confirmar la zona de trabajo que figura en las preguntas frecuentes: "CABA, La Plata y alrededores".

**Qué hace falta de AIRON:** fotos y datos de cada mural nuevo.

## 8. Calculadora de murales — actualizar valores

La calculadora de `/murales/` usa los valores de `src/data/tarifario-murales.json` (Tarifario Mural 2026 de la comunidad de muralistas).

- [ ] Cuando salga una actualización del tarifario (el tarifario recomienda actualizar cada mes por inflación), cambiar los números en ese archivo y la fecha en `"actualizado"`. O pasarle las capturas nuevas a Claude.

## 9. Tarifario de diseño — actualizar valores

La herramienta `/tarifario-diseno/` usa los valores de `src/data/tarifario-diseno.json`, adaptados **con permiso** del Tarifario de la Cámara de Diseñadores de Rafaela y la región (versión 3.3, septiembre 2026). La Cámara ajusta los precios según el IPC del INDEC.

- [ ] Cuando la Cámara publique una versión nueva, pedirle a Claude que la vuelva a transcribir (o cambiar los números en ese archivo, junto con `"version"` y `"actualizado"`).
- Mantener siempre el crédito a la Cámara y a Brújula Estudio, que aparece arriba de la herramienta y en el PDF.

## Otros detalles anotados

- **CapiTales (diseño web):** agregarlo cuando se lance (01/04/2027) o antes si hay permiso, con capturas, rol y año.
- **Branding x AIRON Studio:** ~~faltaban identidades en el muro~~ ✔ El muro ya muestra las 21 identidades, igual que en Behance.
- **Tarjeta del logo M93:** en la imagen original dice "BRANDY — Pizzas & empanadas". Corregir en Illustrator y en Behance.
- **Traducción al inglés:** revisarla (`src/data/proyectos.en.json`). Cada proyecto nuevo necesita su texto en inglés.
