// Genera el sitio estático de AIRON Studio en la carpeta dist/.
// Uso: node build.mjs   (no necesita instalar nada)

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';

const OUT = 'dist';
const SITIO = {
  nombre: 'AIRON STUDIO',
  lema: 'Diseño que construye marcas, ideas y experiencias',
  descripcion: 'Estudio de diseño multimedial en Buenos Aires desde 2015. Branding, diseño gráfico, gráfica musical, motion, fotografía analógica y arte urbano.',
  behance: 'https://www.behance.net/AIRONSTUDIO',
  linkedin: 'https://www.linkedin.com/in/aironstudio/',
  instagram: 'https://www.instagram.com/_aironstudio/',
  // Código del formulario en Formspree (ej: 'xyzabcde'). Vacío = formulario en pausa.
  formspree: '',
};

const CATEGORIAS = [
  { id: 'branding', nombre: 'Branding' },
  { id: 'aplicada', nombre: 'Gráfica aplicada' },
  { id: 'musical', nombre: 'Gráfica musical' },
  { id: 'motion', nombre: 'Motion' },
  { id: 'urbano', nombre: 'Arte urbano y foto' },
];
const DESTACADOS = ['gsp-seguridad', 'blend-david', 'zocalo-fox-sports', 'branding-x-airon-studio'];

const SERVICIOS = [
  ['Identidad & branding', 'Logos, sistemas visuales y manuales de marca.'],
  ['Diseño gráfico', 'Catálogos, flyers, piezas impresas y ploteo vehicular.'],
  ['Comunicación digital', 'Redes sociales, web y campañas.'],
  ['Gráfica musical', 'Portadas y covers para Spotify.'],
  ['Motion graphics', 'Animación para TV y redes.'],
  ['Arte urbano & foto', 'Murales, graffiti y fotografía analógica.'],
];

const proyectos = JSON.parse(readFileSync('src/data/proyectos.json', 'utf8'));
const anio = new Date().getFullYear();

// ---------- utilidades ----------
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (i) => String(i + 1).padStart(2, '0');
const nombreCat = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;
const catsTexto = (p) => p.categorias.map(nombreCat).join(' / ');

function img(tamanos, { alt, sizes, clase = '', eager = false }) {
  const anchos = Object.keys(tamanos).map(Number).sort((a, b) => a - b);
  const srcset = anchos.map((w) => `${esc(tamanos[w])} ${w}w`).join(', ');
  const base = tamanos[anchos.find((w) => w >= 1200) ?? anchos.at(-1)];
  const carga = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<img class="${clase}" src="${esc(base)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" ${carga} decoding="async">`;
}

const ICONO_MENU = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><line x1="3" y1="7" x2="17" y2="7"/><line x1="3" y1="13" x2="17" y2="13"/></svg>';

function redes(clase = '') {
  return `<a class="${clase}" href="${SITIO.behance}" target="_blank" rel="noopener noreferrer">Behance ↗</a>
      <a class="${clase}" href="${SITIO.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      <a class="${clase}" href="${SITIO.instagram}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>`;
}

function pagina({ titulo, descripcion = SITIO.descripcion, activo = '', imagen = '', cuerpo }) {
  const actual = (id) => (activo === id ? ' aria-current="page"' : '');
  const tituloCompleto = titulo ? `${titulo} — AIRON Studio` : `AIRON Studio — ${SITIO.lema}`;
  return `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(tituloCompleto)}</title>
  <meta name="description" content="${esc(descripcion)}">
  <meta name="theme-color" content="#F2F0EB">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(tituloCompleto)}">
  <meta property="og:description" content="${esc(descripcion)}">
  ${imagen ? `<meta property="og:image" content="${esc(imagen)}">` : ''}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.myportfolio.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/main.js" defer></script>
</head>
<body>
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <header class="site-header">
    <div class="wrap header-in">
      <a class="logo" href="/">AIRON STUDIO</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú">${ICONO_MENU}</button>
      <nav id="menu" class="nav" aria-label="Principal">
        <a class="nav-link only-menu" href="/"${actual('inicio')}>Inicio</a>
        <a class="nav-link" href="/proyectos/"${actual('proyectos')}>Proyectos</a>
        <a class="nav-link" href="/sobre-mi/"${actual('sobre')}>Sobre mí</a>
        <a class="nav-link nav-cta" href="/contacto/"${actual('contacto')}>Hablemos</a>
        <div class="nav-redes only-menu">${redes()}</div>
      </nav>
    </div>
  </header>
  <main id="contenido">
${cuerpo}
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <span class="footer-logo">AIRON STUDIO</span>
        <nav class="footer-redes" aria-label="Redes">${redes()}</nav>
      </div>
      <div class="footer-bottom mono">
        <span>© ${anio} AIRON Studio · Buenos Aires, Argentina</span>
        <span>Diseño multimedial desde 2015</span>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

function tarjeta(p, i, { sizes, destacado = false }) {
  return `<a class="card${destacado ? ' card--destacado' : ''}" href="/proyectos/${p.slug}/" data-cats="${p.categorias.join(' ')}">
        <div class="card-img">${img(p.portada, { alt: `Portada del proyecto ${p.titulo}`, sizes })}</div>
        <div class="card-meta">
          <div class="card-text">
            <span class="card-title">${esc(p.titulo)}</span>
            <span class="card-sub">${esc(p.subtitulo)}</span>
          </div>
          <span class="card-cat mono">${num(i)} · ${esc(catsTexto(p))}</span>
        </div>
      </a>`;
}

function ctaBloque(titulo, texto = 'Escribime →') {
  return `<section class="cta">
    <div class="wrap cta-in">
      <h2 class="cta-title">${titulo}</h2>
      <a class="btn btn-dark btn-lg" href="/contacto/">${texto}</a>
    </div>
  </section>`;
}

// ---------- páginas ----------
function inicio() {
  const dest = DESTACADOS.map((s) => proyectos.find((p) => p.slug === s)).filter(Boolean);
  const cards = dest
    .map((p, i) => tarjeta(p, i, { destacado: true, sizes: '(min-width: 900px) 58vw, 100vw' }))
    .join('\n      ');
  const franja = SERVICIOS.map(([t]) => `<span>${esc(t)}</span>`).join('<i aria-hidden="true"></i>');
  const servicios = SERVICIOS.map(
    ([t, d], i) => `<li class="servicio"><span class="mono num">${num(i)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`
  ).join('\n        ');
  return pagina({
    activo: 'inicio',
    imagen: dest[0]?.portada['1280'],
    cuerpo: `
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-kicker mono"><span>Estudio de diseño multimedial</span><span>Buenos Aires · desde 2015</span></div>
      <h1 class="hero-title">${SITIO.lema}</h1>
      <div class="hero-bottom">
        <p class="lead">Branding, diseño gráfico, gráfica musical, motion, fotografía analógica y arte urbano.</p>
        <div class="btn-row">
          <a class="btn btn-accent btn-lg" href="/proyectos/">Ver proyectos →</a>
          <a class="btn btn-outline btn-lg" href="/contacto/">Hablemos</a>
        </div>
      </div>
    </div>
  </section>

  <div class="franja" aria-label="Servicios"><div class="franja-in">${franja}</div></div>

  <section class="seccion">
    <div class="wrap">
      <div class="seccion-head">
        <div>
          <span class="kicker mono">Selección · 01—${num(dest.length - 1)}</span>
          <h2 class="h2">Proyectos destacados</h2>
        </div>
        <a class="link-arrow" href="/proyectos/">Ver todos los proyectos →</a>
      </div>
      <div class="destacados">
      ${cards}
      </div>
    </div>
  </section>

  <section class="seccion seccion--borde">
    <div class="wrap servicios-grid">
      <div>
        <span class="kicker mono">Servicios</span>
        <h2 class="h2">Qué hago</h2>
      </div>
      <ul class="servicios">
        ${servicios}
      </ul>
    </div>
  </section>

  ${ctaBloque('¿Tenés un proyecto en mente?')}
`,
  });
}

function listado() {
  const filtros = [{ id: 'todos', nombre: 'Todos', n: proyectos.length }]
    .concat(CATEGORIAS.map((c) => ({ ...c, n: proyectos.filter((p) => p.categorias.includes(c.id)).length })))
    .map(
      (c) =>
        `<button type="button" class="pill" data-filter="${c.id}" aria-pressed="${c.id === 'todos'}">${esc(c.nombre)}<span class="mono">${c.n}</span></button>`
    )
    .join('\n        ');
  const cards = proyectos
    .map((p, i) => tarjeta(p, i, { sizes: '(min-width: 900px) 30vw, 50vw' }))
    .join('\n      ');
  return pagina({
    titulo: 'Proyectos',
    activo: 'proyectos',
    descripcion: 'Trabajos de identidad, gráfica, motion y arte urbano de AIRON Studio.',
    cuerpo: `
  <section class="page-head">
    <div class="wrap page-head-in">
      <div>
        <span class="kicker mono">Portafolio</span>
        <h1 class="page-title">Proyectos</h1>
      </div>
      <p class="lead">Trabajos de identidad, gráfica, motion y arte urbano. Filtrá por categoría para ver cada disciplina.</p>
    </div>
  </section>
  <div class="filtros" hidden>
    <div class="wrap filtros-in">
      <div class="filtros-pills" role="group" aria-label="Filtrar por categoría">
        ${filtros}
      </div>
      <span class="mono contador" aria-live="polite"><span data-count>${proyectos.length}</span> proyectos</span>
    </div>
  </div>
  <section class="seccion seccion--top">
    <div class="wrap">
      <div class="grid-proyectos">
      ${cards}
      </div>
    </div>
  </section>
`,
  });
}

function detalle(p, i) {
  const sig = proyectos[(i + 1) % proyectos.length];
  const ficha = p.ficha
    .map(([k, v]) => `<div class="ficha-item"><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join('\n        ');
  const bloques = p.bloques
    .map((b, j) => {
      const destacado = b.destacado ? `<p class="texto-destacado">${esc(b.destacado)}</p>` : '';
      const parrafos = (b.parrafos || []).map((t) => `<p>${esc(t)}</p>`).join('');
      const lista = b.lista
        ? `<ul class="lista-marcas">${b.lista.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul>`
        : '';
      return `<section class="bloque">
      <div class="wrap bloque-in">
        <div class="bloque-head"><span class="mono num">${num(j)}</span><h2 class="h3">${esc(b.titulo)}</h2></div>
        <div class="bloque-body">${destacado}${parrafos}${lista}</div>
      </div>
    </section>`;
    })
    .join('\n    ');
  const videos = p.videos.length
    ? `<div class="videos">${p.videos
        .map(
          (id) =>
            `<div class="video"><iframe src="https://www-ccv.adobe.io/v1/player/ccv/${esc(id)}/embed?bgcolor=%23111111&lazyLoading=true&api_key=BehancePro2View" title="Video del proyecto ${esc(p.titulo)}" loading="lazy" allowfullscreen></iframe></div>`
        )
        .join('')}</div>`
    : '';
  const galeria = p.galeria.length
    ? `<div class="galeria">${p.galeria
        .map((g, k) =>
          `<figure class="${k === 0 ? 'galeria-full' : ''}">${img(g, {
            alt: `${p.titulo} — imagen ${k + 1}`,
            sizes: k === 0 ? '100vw' : '(min-width: 900px) 50vw, 100vw',
          })}</figure>`
        )
        .join('')}</div>`
    : '';
  return pagina({
    titulo: p.titulo,
    activo: 'proyectos',
    descripcion: `${p.titulo} — ${p.subtitulo}. Proyecto de AIRON Studio.`,
    imagen: p.portada['1280'],
    cuerpo: `
  <article>
    <header class="proyecto-head">
      <div class="wrap">
        <div class="proyecto-crumbs mono">
          <a href="/proyectos/">← Volver a proyectos</a>
          <span>Proyectos / ${esc(catsTexto(p))}</span>
        </div>
        <h1 class="proyecto-title">${esc(p.titulo)}</h1>
        <p class="lead">${esc(p.lugar || p.subtitulo)}</p>
      </div>
    </header>
    <div class="wrap">
      <div class="proyecto-portada">${img(p.portada, { alt: `Portada del proyecto ${p.titulo}`, sizes: '100vw', eager: true })}</div>
      <dl class="ficha" aria-label="Ficha del proyecto">
        ${ficha}
      </dl>
    </div>
    ${bloques}
    <section class="bloque bloque--media" aria-label="Imágenes del proyecto">
      <div class="wrap">
        ${videos}
        ${galeria}
      </div>
    </section>
    <div class="wrap">
      <div class="behance-cta">
        <p class="behance-title">¿Querés ver todas las imágenes?</p>
        <a class="btn btn-accent btn-lg" href="${esc(p.behance || SITIO.behance)}" target="_blank" rel="noopener noreferrer">Ver en Behance ↗</a>
      </div>
      <a class="siguiente" href="/proyectos/${sig.slug}/">
        <span class="kicker mono">Siguiente proyecto</span>
        <span class="siguiente-title">${esc(sig.titulo)} →</span>
      </a>
    </div>
  </article>
`,
  });
}

function sobreMi() {
  const disciplinas = ['Identidad & branding', 'Diseño gráfico', 'Comunicación digital', 'Gráfica musical', 'Fotografía analógica', 'Arte urbano']
    .map((d, i) => `<li><span class="mono num">${num(i)}</span><span>${d}</span></li>`)
    .join('');
  const marcas = ['GSP Seguridad', 'FOX Sports', 'Eleven Games', 'Ju Base Plant Food', 'Blend David', 'Flexy', 'Trust Fund']
    .map((m) => `<li>${m}</li>`)
    .join('');
  return pagina({
    titulo: 'Sobre mí',
    activo: 'sobre',
    descripcion: 'AIRON Studio: estudio de diseño multimedial fundado en 2015 en Buenos Aires.',
    cuerpo: `
  <section class="seccion seccion--top">
    <div class="wrap sobre-grid">
      <div class="sobre-visual" aria-hidden="true"><span>AIRON</span><span>STUDIO</span><span class="mono">Est. 2015</span></div>
      <div class="sobre-texto">
        <span class="kicker mono">Sobre mí</span>
        <h1 class="page-title page-title--md">Diseño con mirada integral</h1>
        <p class="texto-destacado">Estudio de diseño multimedial fundado en 2015, con base en Buenos Aires y liderado por Matías Gonzalez, Diseñador en Comunicación Visual recibido en la Universidad Nacional de La Plata.</p>
        <p>Desarrollamos proyectos que combinan estrategia, diseño y comunicación, creando identidades y experiencias visuales capaces de conectar marcas con sus públicos.</p>
        <p>Trabajamos en la intersección entre branding, diseño gráfico, comunicación digital, fotografía analógica y arte urbano, con una mirada integral, contemporánea y experimental.</p>
      </div>
    </div>
  </section>
  <section class="datos" aria-label="Datos">
    <div class="wrap datos-in">
      <div><span class="dato">2015</span><span class="mono">Fundación del estudio</span></div>
      <div><span class="dato">UNLP</span><span class="mono">Diseño en Comunicación Visual</span></div>
      <div><span class="dato">6</span><span class="mono">Disciplinas creativas</span></div>
    </div>
  </section>
  <section class="seccion">
    <div class="wrap">
      <h2 class="h2">Disciplinas</h2>
      <ul class="disciplinas">${disciplinas}</ul>
    </div>
  </section>
  <section class="seccion seccion--borde">
    <div class="wrap">
      <span class="kicker mono">Marcas y medios con los que trabajé</span>
      <ul class="marcas">${marcas}</ul>
    </div>
  </section>
  ${ctaBloque('Trabajemos juntos')}
`,
  });
}

function contacto() {
  const opciones = ['Branding e identidad', 'Gráfica aplicada', 'Gráfica musical', 'Motion', 'Mural / arte urbano', 'Otro']
    .map((o) => `<option>${o}</option>`)
    .join('');
  return pagina({
    titulo: 'Contacto',
    activo: 'contacto',
    descripcion: 'Contame tu proyecto: marca, piezas gráficas, motion, mural o lo que tengas en mente.',
    cuerpo: `
  <section class="seccion seccion--top">
    <div class="wrap contacto-grid">
      <div class="contacto-info">
        <span class="kicker mono">Contacto</span>
        <h1 class="page-title">Hablemos.</h1>
        <p class="lead">Contame tu proyecto: una marca, piezas gráficas, motion, un mural o lo que tengas en mente.</p>
        <nav class="redes-lista" aria-label="Redes">
          <a href="${SITIO.behance}" target="_blank" rel="noopener noreferrer"><span>Behance</span><span class="mono">/AIRONSTUDIO ↗</span></a>
          <a href="${SITIO.linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><span class="mono">/in/aironstudio ↗</span></a>
          <a href="${SITIO.instagram}" target="_blank" rel="noopener noreferrer"><span>Instagram</span><span class="mono">@_aironstudio ↗</span></a>
        </nav>
      </div>
      <form class="form" name="contacto" method="POST" ${
        SITIO.formspree ? `action="https://formspree.io/f/${esc(SITIO.formspree)}"` : 'data-pendiente'
      }>
        <input type="hidden" name="_subject" value="Nuevo mensaje desde la web de AIRON Studio">
        <p class="oculto"><label>No completar este campo <input name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
        <div class="campo">
          <label for="nombre" class="mono">Nombre</label>
          <input id="nombre" name="nombre" type="text" autocomplete="name" required maxlength="120">
        </div>
        <div class="campo">
          <label for="email" class="mono">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required maxlength="160">
        </div>
        <div class="campo">
          <label for="tipo" class="mono">Tipo de proyecto</label>
          <select id="tipo" name="tipo">${opciones}</select>
        </div>
        <div class="campo">
          <label for="mensaje" class="mono">Mensaje</label>
          <textarea id="mensaje" name="mensaje" rows="6" required maxlength="4000"></textarea>
        </div>
        <button class="btn btn-accent btn-lg btn-block" type="submit">Enviar mensaje →</button>
        <p class="nota" data-estado role="status">Tus datos solo se usan para responderte.</p>
      </form>
    </div>
  </section>
`,
  });
}

function simple({ titulo, h1, texto, archivo }) {
  return [
    archivo,
    pagina({
      titulo,
      cuerpo: `
  <section class="seccion seccion--top simple">
    <div class="wrap">
      <h1 class="page-title">${h1}</h1>
      <p class="lead">${texto}</p>
      <div class="btn-row"><a class="btn btn-dark btn-lg" href="/">Volver al inicio</a><a class="btn btn-outline btn-lg" href="/proyectos/">Ver proyectos</a></div>
    </div>
  </section>
`,
    }),
  ];
}

// ---------- escritura ----------
function escribir(ruta, contenido) {
  const destino = join(OUT, ruta);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, contenido);
}

rmSync(OUT, { recursive: true, force: true });
cpSync('src/static', OUT, { recursive: true });
escribir('index.html', inicio());
escribir('proyectos/index.html', listado());
proyectos.forEach((p, i) => escribir(`proyectos/${p.slug}/index.html`, detalle(p, i)));
escribir('sobre-mi/index.html', sobreMi());
escribir('contacto/index.html', contacto());
for (const [archivo, html] of [
  simple({ titulo: 'Mensaje enviado', h1: '¡Gracias!', texto: 'Recibí tu mensaje. Te voy a responder a la brevedad.', archivo: 'gracias/index.html' }),
  simple({ titulo: 'Página no encontrada', h1: 'Ups.', texto: 'Esta página no existe o cambió de lugar.', archivo: '404.html' }),
]) {
  escribir(archivo, html);
}

console.log(`Listo: ${proyectos.length + 6} páginas generadas en ${OUT}/`);
