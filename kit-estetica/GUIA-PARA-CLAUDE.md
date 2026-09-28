# Kit de estética AIRON — guía para Claude Code

Este kit trae la identidad visual de aironstudio.com.ar para aplicarla en otro proyecto. Seguí estas reglas al diseñar o modificar páginas.

## Archivos

| Archivo | Qué es | Cómo se carga |
|---|---|---|
| `estetica.css` | Tipografías, colores, tamaños, componentes y animaciones | `<link rel="stylesheet" href="estetica.css">` |
| `estetica.js` | Movimientos (efecto glitch, ola, apariciones, contadores, cursor, modo oscuro) | `<script src="estetica.js" defer></script>` |
| `tema-inicial.js` | Evita el parpadeo del modo oscuro | En el `<head>`, **sin defer**, antes del CSS |
| `fonts/` | Anton, Instrument Sans, IBM Plex Mono (licencia OFL) | Va al lado de `estetica.css` |
| `demo.html` | Muestra de todos los componentes | Abrir en el navegador como referencia |

No uses CDNs ni Google Fonts: las fuentes se alojan en el propio sitio. Si el proyecto usa React/Next/Vite, importá `estetica.css` una vez en el layout y cargá `estetica.js` en el cliente (o portá cada función a un `useEffect`). Si usa Tailwind, pasá las variables de `:root` al `theme` y conservá las clases del kit para los componentes.

## Tipografía (lo más importante)

- **Títulos:** Anton, siempre en MAYÚSCULAS, `font-weight: 400`, interlineado muy cerrado (0.86–0.95). Tamaños con `clamp()`:
  - `.hero-title` 54–148 px · `.page-title` 76–200 px · `.page-title--md` 52–112 px · `.h2` 44–88 px · `.h3` 34–56 px.
- **Etiquetas técnicas:** IBM Plex Mono 13 px, MAYÚSCULAS, `letter-spacing: .06em` → clase `.mono`. Arriba de cada título va una etiqueta `.kicker mono` (ej. "Portafolio · 01—14", "Método", "Servicios").
- **Textos:** Instrument Sans 17 px; introducciones con `.lead` (17–21 px, color `--texto-2`, máx. 36em de ancho).
- Numeración con dos dígitos y en mono: `01`, `02`… en `.num`.

## Color

- Fondo hueso `#F2F0EB`, texto negro `#111`, acento **rojo puro `#FF0000`**. Nada de degradés ni sombras decorativas.
- Bloques negros (`--bloque`) para pie, franja y números; bloque rojo (`.cta`) para la llamada final.
- El rojo se usa poco y con intención: palabra destacada, número grande, cuadradito separador, hover.
- Modo oscuro incluido (`#131312`): usá siempre las variables (`var(--ink)`, `var(--bg)`…), nunca colores fijos.

## Formas

- Botones y píldoras: completamente redondeados (`border-radius: 999px`), altura mínima 44 px. `.btn-accent` (rojo), `.btn-dark`, `.btn-outline`, `.pill`, `.pill-marca` (con cuadradito rojo).
- Líneas finas de 1 px `var(--ink)` para separar filas y secciones (`.seccion--borde`, bordes superiores en listas).
- Cuadraditos rojos (no círculos) como separadores.

## Movimientos (clases que activan `estetica.js`)

| Efecto | Cómo usarlo |
|---|---|
| **Glitch / letras que se arman** | Toda `.kicker` (o cualquier elemento con `data-armar`) se arma con caracteres al azar `A–Z 0–9 / # * + < >` en rojo durante 0,7 s al entrar en pantalla. |
| **Ola roja en títulos** | `class="titulo-ola"` en un título: cada palabra se pone roja y vuelve a negro, una tras otra. |
| **Aparición al bajar** | `class="reveal"`: sube 24 px y aparece en 0,7 s. |
| **Contadores** | `<span data-contar="47">47</span>`: cuenta de 0 al número. |
| **Franja en movimiento** | `.franja > .franja-pista > ul.franja-lista` **dos veces** (la segunda con `aria-hidden="true"` y links `tabindex="-1"`). Se frena al pasar el mouse. `.franja--derecha` invierte el sentido. |
| **Índice con hover** | `.indice > li > a.indice-link` con `.indice-titulo`: el elegido se pone rojo y se corre; el resto se atenúa. |
| **Cursor estrella** | Automático en computadora. Sobre links crece y gira; sobre `[data-cursor="Ver"]` muestra una bola roja con ese texto. Se desactiva con `window.ESTETICA = { cursor: false }` antes de cargar el script. |
| **Transición entre páginas** | Automática en Chrome/Edge (View Transitions). |

Todos respetan `prefers-reduced-motion`: si la persona pidió reducir movimiento, no se anima nada. Mantené esa regla en cualquier animación nueva.

## Estructura típica de una página

1. `header.site-header` fijo arriba con borde inferior.
2. Hero: etiqueta mono a los costados, `h1.hero-title.titulo-ola`, y abajo `.lead` + botones.
3. `.franja` negra en movimiento.
4. Secciones con `.kicker` + `.h2`, contenido en grilla 1/3 – 2/3 (`.lista-grid`).
5. `.numeros` negro con cifras rojas.
6. `.pasos` numerados.
7. `.cta` roja con título gigante y botón negro.
8. `footer.site-footer` negro.

## Accesibilidad (no negociable)

Contraste suficiente, áreas táctiles de 44 px, foco visible, textos alternativos, y el texto real del efecto glitch queda disponible para lectores de pantalla (ya lo resuelve `estetica.js`).
