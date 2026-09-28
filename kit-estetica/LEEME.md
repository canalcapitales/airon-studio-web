# Kit de estética AIRON

La estética de aironstudio.com.ar (tipografías, títulos, tamaños, colores, botones y movimientos) empaquetada para usar en otro proyecto.

Esta carpeta no se publica en la web: es solo para copiar.

## Qué trae

- **Tipografías:** Anton (títulos), Instrument Sans (textos) e IBM Plex Mono (etiquetas). Licencia libre, también para uso comercial.
- **Colores:** hueso, negro y rojo, con modo oscuro.
- **Movimientos:** letras que se arman con caracteres al azar, títulos con "ola" roja, aparición al bajar, números que cuentan, franja en movimiento, índice con hover, cursor estrella y transición entre páginas.
- **`demo.html`:** abrilo en el navegador para ver todo junto.

## Cómo pasarlo a otro proyecto de Claude Code

**Opción A (la más fácil):** en la sesión de Claude Code del otro proyecto, escribí:

> Traé el kit de estética de la carpeta `kit-estetica` del repositorio `canalcapitales/airon-studio-web` y aplicalo a este proyecto siguiendo `GUIA-PARA-CLAUDE.md`.

Claude va a pedir acceso a ese repositorio (es tuyo, aceptalo), va a copiar la carpeta y va a adaptar el diseño.

**Opción B (a mano):**
1. En GitHub, entrá a este repositorio y descargalo con **Code → Download ZIP**.
2. Copiá la carpeta `kit-estetica` dentro del otro proyecto.
3. Pedile a Claude: *"Aplicá la estética de `kit-estetica/GUIA-PARA-CLAUDE.md` a este proyecto"*.

## Para cambiar algo

- **Otro color de acento** (por ejemplo, para otra marca): en `estetica.css`, cambiá `--acento` y `--acento-texto`.
- **Sin cursor estrella:** antes de cargar `estetica.js`, poné `<script>window.ESTETICA = { cursor: false }</script>`.
- **La estrella es la del logo de AIRON.** Si el otro proyecto es de otra marca, conviene cambiarla por otro dibujo (`cursorSvg` en los ajustes de `estetica.js`).
