// Genera el sitio estático de AIRON Studio en la carpeta dist/.
// Uso: node build.mjs   (no necesita instalar nada)

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const OUT = 'dist';
const SITIO = {
  // Dirección pública de la web. Cambiarla cuando se conecte el dominio propio.
  url: 'https://airon-studio-web.laionbeats.workers.dev',
  nombre: 'AIRON STUDIO',
  lema: 'Diseño que construye marcas, ideas y experiencias',
  descripcion: 'Estudio de diseño multimedial en Buenos Aires desde 2015. Branding, diseño gráfico, gráfica musical, motion, fotografía analógica y arte urbano.',
  behance: 'https://www.behance.net/AIRONSTUDIO',
  linkedin: 'https://www.linkedin.com/in/aironstudio/',
  instagram: 'https://www.instagram.com/_aironstudio/',
  // Código del formulario en Formspree (ej: 'xyzabcde'). Vacío = formulario en pausa.
  formspree: 'maenlpzn',
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
  ['Gráfica musical', 'Portadas, banners y covers para Spotify.'],
  ['Motion graphics', 'Animación para TV y redes.'],
  ['Arte urbano & foto', 'Murales, graffiti y fotografía analógica.'],
];

const proyectos = JSON.parse(readFileSync('src/data/proyectos.json', 'utf8'));

// Logo en línea: las letras toman el color del texto y la estrella usa el color de acento.
const LOGO_SVG = readFileSync('src/static/img/logo-airon.svg', 'utf8')
  .replace(' role="img" aria-label="AIRON Studio"', ' aria-hidden="true" focusable="false"')
  .replace(/ xmlns="[^"]+"/, '')
  .replace(/\n/g, '');
const logo = (clase) => LOGO_SVG.replace('<svg', `<svg class="logo-svg ${clase}"`);
const anio = new Date().getFullYear();

const FUNDACION = 2015;
const MARCAS = ['GSP Seguridad', 'FOX Sports', 'Eleven Games', 'Ju Base Plant Food', 'Blend David', 'Flexy', 'Trust Fund'];

// Números del estudio. Solo datos reales. Si `valor` está vacío (null), no se muestra.
const NUMEROS = [
  { valor: anio - FUNDACION, texto: 'Años de estudio' },
  { valor: proyectos.length, texto: 'Proyectos en el portafolio' },
  { valor: 27, texto: 'Identidades de marca' },
  { valor: MARCAS.length, texto: 'Marcas y medios' },
  { valor: 47, sufijo: ' m²', texto: 'Nuestro mural más grande' },
  { valor: 6, texto: 'Disciplinas creativas' },
];

function numeros(titulo = 'El estudio en números') {
  const items = NUMEROS.filter((n) => n.valor !== null && n.valor !== undefined)
    .map(
      (n) => `<div class="numero reveal"><span class="numero-valor">${n.prefijo || ''}<span data-contar="${n.valor}">${n.valor}</span>${n.sufijo || ''}</span><span class="mono">${n.texto}</span></div>`
    )
    .join('\n        ');
  return `<section class="numeros" aria-label="${titulo}">
    <div class="wrap">
      <span class="kicker mono">${titulo}</span>
      <div class="numeros-grid">
        ${items}
      </div>
    </div>
  </section>`;
}

// ---------- utilidades ----------
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (i) => String(i + 1).padStart(2, '0');
const nombreCat = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;
const catsTexto = (p) => p.categorias.map(nombreCat).join(' / ');
const recortar = (t, n = 155) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)) + '…');
const anchos = (t) => Object.keys(t).filter((k) => /^\d+$/.test(k)).map(Number).sort((a, b) => a - b);
const paraVisor = (t) => t[anchos(t).filter((w) => w <= 1920).at(-1) ?? anchos(t)[0]];

function img(tamanos, { alt, sizes, clase = '', eager = false, dims }) {
  const ws = anchos(tamanos);
  const srcset = ws.map((w) => `${esc(tamanos[w])} ${w}w`).join(', ');
  const base = tamanos[ws.find((w) => w >= 1200) ?? ws.at(-1)];
  const carga = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  const medidas = dims ? ` width="${dims[0]}" height="${dims[1]}"` : '';
  const cls = clase ? ` class="${clase}"` : '';
  return `<img${cls} src="${esc(base)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}"${medidas} ${carga} decoding="async">`;
}

function descripcionDe(p) {
  const texto = p.bloques.flatMap((b) => [b.destacado, ...(b.parrafos || [])]).find(Boolean);
  return recortar(texto || `${p.titulo} — ${p.subtitulo}. Proyecto de AIRON Studio.`);
}

const ICONOS_MENU =
  '<svg class="i-abrir" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><line x1="3" y1="7" x2="17" y2="7"/><line x1="3" y1="13" x2="17" y2="13"/></svg>' +
  '<svg class="i-cerrar" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg>';

function redes() {
  return `<a href="${SITIO.behance}" target="_blank" rel="noopener noreferrer">Behance ↗</a>
      <a href="${SITIO.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      <a href="${SITIO.instagram}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>`;
}

const ORGANIZACION = {
  '@type': 'Organization',
  '@id': `${SITIO.url}/#estudio`,
  name: 'AIRON Studio',
  url: `${SITIO.url}/`,
  description: SITIO.descripcion,
  foundingDate: '2015',
  logo: `${SITIO.url}/img/logo-airon.svg`,
  founder: { '@type': 'Person', name: 'Matías Gonzalez', jobTitle: 'Diseñador en Comunicación Visual', image: `${SITIO.url}/img/foto-perfil-1080.webp` },
  address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressCountry: 'AR' },
  sameAs: [SITIO.behance, SITIO.linkedin, SITIO.instagram],
};

// Archivos con "huella" en el nombre: el navegador los guarda y solo los vuelve a bajar si cambian.
const ASSETS = {};

function pagina({ ruta, titulo, descripcion = SITIO.descripcion, activo = '', imagen = '', datos, cuerpo }) {
  const actual = (id) => (activo === id ? ' aria-current="page"' : '');
  const tituloCompleto = titulo ? `${titulo} — AIRON Studio` : `AIRON Studio — ${SITIO.lema}`;
  const url = SITIO.url + ruta;
  const jsonld = datos ? `\n  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...datos })}</script>` : '';
  return `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(tituloCompleto)}</title>
  <meta name="description" content="${esc(descripcion)}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#F2F0EB">
  <meta name="color-scheme" content="light">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_AR">
  <meta property="og:site_name" content="AIRON Studio">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(tituloCompleto)}">
  <meta property="og:description" content="${esc(descripcion)}">
  ${imagen ? `<meta property="og:image" content="${esc(imagen)}">\n  <meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/fonts/anton-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://cdn.myportfolio.com">
  <link rel="stylesheet" href="${ASSETS.css}">
  <script src="${ASSETS.js}" defer></script>${jsonld}
</head>
<body>
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <header class="site-header">
    <div class="wrap header-in">
      <a class="logo" href="/" aria-label="AIRON Studio — Inicio">${logo('logo-header')}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú">${ICONOS_MENU}</button>
      <nav id="menu" class="nav" aria-label="Principal">
        <a class="nav-link only-menu" href="/"${actual('inicio')}>Inicio</a>
        <a class="nav-link" href="/proyectos/"${actual('proyectos')}>Proyectos</a>
        <a class="nav-link" href="/estudio/"${actual('sobre')}>Estudio</a>
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
        <a class="footer-logo" href="/" aria-label="AIRON Studio — Inicio">${logo('logo-footer')}</a>
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
  return `<a class="card reveal${destacado ? ' card--destacado' : ''}" href="/proyectos/${p.slug}/" data-cats="${p.categorias.join(' ')}">
        <div class="card-img">${img(p.portada, { alt: `Portada del proyecto ${p.titulo}`, sizes, dims: [640, 501] })}</div>
        <div class="card-meta">
          <div class="card-text">
            <span class="card-title">${esc(p.titulo)}</span>
            <span class="card-sub">${esc(p.subtitulo)}</span>
          </div>
          <span class="card-cat mono">${num(i)} · ${esc(catsTexto(p))}</span>
        </div>
      </a>`;
}

function ctaBloque(titulo, texto = 'Escribinos →') {
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
    ([t, d], i) => `<li class="servicio reveal"><span class="mono num">${num(i)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`
  ).join('\n        ');
  return pagina({
    ruta: '/',
    activo: 'inicio',
    imagen: dest[0]?.portada['1280'],
    datos: { '@graph': [ORGANIZACION, { '@type': 'WebSite', name: 'AIRON Studio', url: `${SITIO.url}/`, inLanguage: 'es-AR', publisher: { '@id': ORGANIZACION['@id'] } }] },
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

  <div class="franja" role="presentation"><div class="franja-in">${franja}</div></div>

  <section class="seccion">
    <div class="wrap">
      <div class="seccion-head">
        <div>
          <span class="kicker mono">Selección · 01—${num(dest.length - 1)}</span>
          <h2 class="h2">Proyectos destacados</h2>
        </div>
        <a class="link-arrow" href="/proyectos/">Ver los ${proyectos.length} proyectos →</a>
      </div>
      <div class="destacados">
      ${cards}
      </div>
    </div>
  </section>

  ${numeros()}

  <section class="seccion">
    <div class="wrap servicios-grid">
      <div>
        <span class="kicker mono">Servicios</span>
        <h2 class="h2">Qué hacemos</h2>
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
    ruta: '/proyectos/',
    titulo: 'Proyectos',
    activo: 'proyectos',
    imagen: proyectos[0].portada['1280'],
    descripcion: 'Portafolio de AIRON Studio: identidad de marca, gráfica aplicada, gráfica musical, motion y arte urbano.',
    datos: {
      '@type': 'CollectionPage',
      name: 'Proyectos de AIRON Studio',
      url: `${SITIO.url}/proyectos/`,
      hasPart: proyectos.map((p) => ({ '@type': 'CreativeWork', name: p.titulo, url: `${SITIO.url}/proyectos/${p.slug}/` })),
    },
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
  const ant = proyectos[(i - 1 + proyectos.length) % proyectos.length];
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
      <div class="wrap bloque-in reveal">
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
            `<div class="video"><iframe src="https://www-ccv.adobe.io/v1/player/ccv/${esc(id)}/embed?bgcolor=%23111111&lazyLoading=true&api_key=BehancePro2View" title="Video del proyecto ${esc(p.titulo)}" loading="lazy" allow="fullscreen" allowfullscreen></iframe></div>`
        )
        .join('')}</div>`
    : '';
  const figura = (g, k, total, { full = false, grilla = false } = {}) => {
    const alt = g.alt || `${p.titulo} — imagen ${k + 1} de ${total}`;
    const clase = full ? 'galeria-full' : '';
    const sizes = grilla ? '(min-width: 900px) 25vw, 50vw' : full ? '(min-width: 1584px) 1440px, 100vw' : '(min-width: 900px) 50vw, 100vw';
    return `<figure class="${clase} reveal"><a class="zoom" href="${esc(paraVisor(g))}" aria-label="Ampliar: ${esc(alt)}">${img(g, { alt, sizes, dims: g._wh })}</a></figure>`;
  };
  const esAncha = (g) => g._wh && g._wh[0] / g._wh[1] > 1.6;
  const galeria = p.galeria.length
    ? `<div class="galeria">${p.galeria.map((g, k) => figura(g, k, p.galeria.length, { full: k === 0 || esAncha(g) })).join('')}</div>`
    : '';
  const galerias = (p.galerias || [])
    .map((grupo) => {
      const grilla = grupo.estilo === 'grilla';
      const figs = grupo.imagenes
        .map((g, k) => figura(g, k, grupo.imagenes.length, { grilla, full: !grilla && (k === 0 || esAncha(g)) }))
        .join('');
      return `<div class="galeria-grupo">
          <div class="galeria-grupo-head reveal"><h3 class="galeria-titulo">${esc(grupo.titulo)}</h3>${
            grupo.texto ? `<p>${esc(grupo.texto)}</p>` : ''
          }${grupo.nota ? `<span class="mono">${esc(grupo.nota)}</span>` : ''}</div>
          <div class="galeria${grilla ? ' galeria--grilla' : ''}">${figs}</div>
        </div>`;
    })
    .join('');
  const hayImagenes = p.galeria.length || (p.galerias || []).length;
  const visor = hayImagenes
    ? `
  <dialog class="visor" aria-label="Visor de imágenes">
    <button class="visor-btn visor-cerrar" type="button" aria-label="Cerrar">✕</button>
    <button class="visor-btn visor-ant" type="button" aria-label="Imagen anterior">←</button>
    <img class="visor-img" alt="">
    <button class="visor-btn visor-sig" type="button" aria-label="Imagen siguiente">→</button>
    <span class="visor-contador mono" aria-live="polite"></span>
  </dialog>`
    : '';
  const descripcion = descripcionDe(p);
  return pagina({
    ruta: `/proyectos/${p.slug}/`,
    titulo: p.titulo,
    activo: 'proyectos',
    descripcion,
    imagen: p.portada['1280'],
    datos: {
      '@type': 'CreativeWork',
      name: p.titulo,
      headline: `${p.titulo} — ${p.subtitulo}`,
      description: descripcion,
      url: `${SITIO.url}/proyectos/${p.slug}/`,
      image: p.portada['1280'],
      genre: catsTexto(p),
      inLanguage: 'es-AR',
      creator: { '@type': 'Organization', name: 'AIRON Studio', url: `${SITIO.url}/` },
    },
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
      <div class="proyecto-portada">${img(p.portada, { alt: `Portada del proyecto ${p.titulo}`, sizes: '(min-width: 1584px) 1440px, 100vw', eager: true, dims: [1280, 1001] })}</div>
      <dl class="ficha" aria-label="Ficha del proyecto">
        ${ficha}
      </dl>
    </div>
    ${bloques}
    <section class="bloque bloque--media" aria-label="Imágenes del proyecto">
      <div class="wrap">
        ${videos}
        ${galeria}
        ${galerias}
      </div>
    </section>
    <div class="wrap">
      <div class="behance-cta">
        <p class="behance-title">¿Querés ver todas las imágenes?</p>
        <div class="btn-row">${(Array.isArray(p.behance) ? p.behance : [{ texto: 'Ver en Behance', url: p.behance || SITIO.behance }])
          .map((b) => `<a class="btn btn-accent btn-lg" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">${esc(b.texto)} ↗</a>`)
          .join('')}</div>
      </div>
      <nav class="navegacion-proyectos" aria-label="Otros proyectos">
        <a class="otro otro--ant" href="/proyectos/${ant.slug}/">
          <span class="kicker mono">← Anterior</span>
          <span class="otro-title">${esc(ant.titulo)}</span>
        </a>
        <a class="otro otro--sig" href="/proyectos/${sig.slug}/">
          <span class="kicker mono">Siguiente →</span>
          <span class="otro-title">${esc(sig.titulo)}</span>
        </a>
      </nav>
    </div>
  </article>${visor}
`,
  });
}

function sobreMi() {
  const disciplinas = ['Identidad & branding', 'Diseño gráfico', 'Comunicación digital', 'Gráfica musical', 'Fotografía analógica', 'Arte urbano']
    .map((d, i) => `<li class="reveal"><span class="mono num">${num(i)}</span><span>${d}</span></li>`)
    .join('');
  const marcas = MARCAS
    .map((m) => `<li>${m}</li>`)
    .join('');
  return pagina({
    ruta: '/estudio/',
    titulo: 'Estudio',
    activo: 'sobre',
    imagen: `${SITIO.url}/img/foto-perfil-1080.webp`,
    descripcion: 'AIRON Studio: estudio de diseño multimedial fundado en 2015 en Buenos Aires, liderado por Matías Gonzalez.',
    datos: { '@type': 'AboutPage', name: 'Sobre AIRON Studio', url: `${SITIO.url}/estudio/`, about: ORGANIZACION },
    cuerpo: `
  <section class="seccion seccion--top">
    <div class="wrap sobre-grid">
      <img class="sobre-foto" src="/img/foto-perfil-1080.webp" srcset="/img/foto-perfil-640.webp 640w, /img/foto-perfil-1080.webp 1080w" sizes="(min-width: 900px) 40vw, 100vw" width="1080" height="1080" alt="Retrato de Matías Gonzalez, fundador de AIRON Studio" fetchpriority="high">
      <div class="sobre-texto">
        <span class="kicker mono">El estudio</span>
        <h1 class="page-title page-title--md">Diseño con mirada integral</h1>
        <p class="texto-destacado">Estudio de diseño multimedial fundado en ${FUNDACION}, con base en Buenos Aires y liderado por Matías Gonzalez, Diseñador en Comunicación Visual recibido en la Universidad Nacional de La Plata.</p>
        <p>Desarrollamos proyectos que combinan estrategia, diseño y comunicación, creando identidades y experiencias visuales capaces de conectar marcas con sus públicos.</p>
        <p>Trabajamos en la intersección entre branding, diseño gráfico, comunicación digital, fotografía analógica y arte urbano, con una mirada integral, contemporánea y experimental.</p>
      </div>
    </div>
  </section>
  ${numeros()}
  <section class="seccion">
    <div class="wrap">
      <h2 class="h2">Disciplinas</h2>
      <ul class="disciplinas">${disciplinas}</ul>
    </div>
  </section>
  <section class="seccion seccion--borde">
    <div class="wrap">
      <span class="kicker mono">Marcas y medios con los que trabajamos</span>
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
    ruta: '/contacto/',
    titulo: 'Contacto',
    activo: 'contacto',
    descripcion: 'Contanos tu proyecto: marca, piezas gráficas, motion, mural o lo que tengas en mente.',
    datos: { '@type': 'ContactPage', name: 'Contacto — AIRON Studio', url: `${SITIO.url}/contacto/` },
    cuerpo: `
  <section class="seccion seccion--top">
    <div class="wrap contacto-grid">
      <div class="contacto-info">
        <span class="kicker mono">Contacto</span>
        <h1 class="page-title">Hablemos.</h1>
        <p class="lead">Contanos tu proyecto: una marca, piezas gráficas, motion, un mural o lo que tengas en mente.</p>
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

function simple({ ruta, titulo, h1, texto }) {
  return pagina({
    ruta,
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
  });
}

// ---------- escritura ----------
const compactar = (html) => html.replace(/\n\s+/g, '\n');

function escribir(ruta, contenido) {
  const destino = join(OUT, ruta);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, ruta.endsWith('.html') ? compactar(contenido) : contenido);
}

function conHuella(ruta) {
  const archivo = join(OUT, ruta);
  const huella = createHash('sha256').update(readFileSync(archivo)).digest('hex').slice(0, 10);
  const nueva = ruta.replace(/(\.\w+)$/, `.${huella}$1`);
  renameSync(archivo, join(OUT, nueva));
  return '/' + nueva;
}

rmSync(OUT, { recursive: true, force: true });
cpSync('src/static', OUT, { recursive: true });
ASSETS.css = conHuella('css/styles.css');
ASSETS.js = conHuella('js/main.js');

const paginas = [
  ['index.html', '/', inicio()],
  ['proyectos/index.html', '/proyectos/', listado()],
  ...proyectos.map((p, i) => [`proyectos/${p.slug}/index.html`, `/proyectos/${p.slug}/`, detalle(p, i)]),
  ['estudio/index.html', '/estudio/', sobreMi()],
  ['contacto/index.html', '/contacto/', contacto()],
];
for (const [archivo, , html] of paginas) escribir(archivo, html);
escribir('gracias/index.html', simple({ ruta: '/gracias/', titulo: 'Mensaje enviado', h1: '¡Gracias!', texto: 'Recibimos tu mensaje. Te vamos a responder a la brevedad.' }));
escribir('404.html', simple({ ruta: '/404.html', titulo: 'Página no encontrada', h1: 'Ups.', texto: 'Esta página no existe o cambió de lugar.' }));

const hoy = new Date().toISOString().slice(0, 10);
escribir(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map(([, ruta]) => `  <url><loc>${SITIO.url}${ruta}</loc><lastmod>${hoy}</lastmod></url>`).join('\n')}
</urlset>
`
);
escribir('robots.txt', `User-agent: *\nAllow: /\nDisallow: /gracias/\n\nSitemap: ${SITIO.url}/sitemap.xml\n`);

console.log(`Listo: ${paginas.length + 2} páginas generadas en ${OUT}/`);
