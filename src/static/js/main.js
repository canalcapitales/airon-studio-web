// AIRON Studio — menú de celular, filtros, visor de imágenes, formulario y animaciones
document.documentElement.classList.add('js');

const EN = document.documentElement.lang.startsWith('en');
const MSG = EN
  ? { abrir: 'Open menu', cerrar: 'Close menu', temaOscuro: 'Switch to dark mode', temaClaro: 'Switch to light mode', pausa: 'The form will be available very soon. In the meantime, reach us on Instagram or LinkedIn.', enviando: 'Sending…', error: "Couldn't send. Please try again or reach us on Instagram or LinkedIn." }
  : { abrir: 'Abrir menú', cerrar: 'Cerrar menú', temaOscuro: 'Cambiar a modo oscuro', temaClaro: 'Cambiar a modo claro', pausa: 'El formulario se activa muy pronto. Mientras tanto, escribinos por Instagram o LinkedIn.', enviando: 'Enviando…', error: 'No se pudo enviar. Probá de nuevo o escribinos por Instagram o LinkedIn.' };

document.addEventListener('DOMContentLoaded', () => {
  menu();
  tema();
  apariciones();
  contadores();
  textosQueSeArman();
  cursorEstrella();
  calculadora();
  tarifarioDiseno();
  visor();
  formulario();
  filtros();
});

// ----- Modo claro / oscuro -----
// Si el visitante nunca tocó el botón, la web sigue el modo de su compu o celular.
function tema() {
  const html = document.documentElement;
  const boton = document.querySelector('.tema-btn');
  if (!boton) return;
  const sistema = matchMedia('(prefers-color-scheme: dark)');
  const meta = document.querySelector('meta[name="theme-color"]');
  const oscuro = () => (html.dataset.tema ? html.dataset.tema === 'oscuro' : sistema.matches);
  const pintar = () => {
    const texto = oscuro() ? MSG.temaClaro : MSG.temaOscuro;
    boton.setAttribute('aria-label', texto);
    boton.title = texto;
    if (meta) meta.content = getComputedStyle(html).getPropertyValue('--bg').trim();
  };
  boton.addEventListener('click', () => {
    const nuevo = oscuro() ? 'claro' : 'oscuro';
    html.dataset.tema = nuevo;
    try {
      localStorage.setItem('tema', nuevo);
    } catch (e) {}
    pintar();
  });
  sistema.addEventListener('change', pintar);
  pintar();
}

// ----- Menú de celular -----
function menu() {
  const html = document.documentElement;
  const boton = document.querySelector('.menu-btn');
  const nav = document.getElementById('menu');
  if (!boton || !nav) return;

  const cambiar = (abierto) => {
    html.classList.toggle('menu-open', abierto);
    boton.setAttribute('aria-expanded', String(abierto));
    boton.setAttribute('aria-label', abierto ? MSG.cerrar : MSG.abrir);
    if (abierto) nav.querySelector('a')?.focus();
  };

  boton.addEventListener('click', () => cambiar(!html.classList.contains('menu-open')));
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) cambiar(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && html.classList.contains('menu-open')) {
      cambiar(false);
      boton.focus();
    }
  });
  matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && cambiar(false));
}

// ----- Aparición suave de los elementos al bajar -----
function apariciones() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach((el) => obs.observe(el));
}

// ----- Números que cuentan hacia arriba al aparecer -----
function contadores() {
  const nums = document.querySelectorAll('[data-contar]');
  if (!nums.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const animar = (el) => {
    const fin = Number(el.dataset.contar);
    const inicio = performance.now();
    const paso = (t) => {
      const p = Math.min((t - inicio) / 1400, 1);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  const obs = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          animar(en.target);
          obs.unobserve(en.target);
        }
      }),
    { threshold: 0.6 }
  );
  nums.forEach((el) => obs.observe(el));
}

// ----- Textos chicos que se "arman" como un código al aparecer -----
function textosQueSeArman() {
  const items = document.querySelectorAll('.kicker');
  if (!items.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const signos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+<>';
  const armar = (el) => {
    const final = el.textContent;
    const inicio = performance.now();
    el.classList.add('armando');
    // Los lectores de pantalla leen el texto real; las letras al azar son solo visuales
    el.textContent = '';
    const real = document.createElement('span');
    real.className = 'oculto';
    real.textContent = final;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    el.append(real, visual);
    const paso = (t) => {
      const p = Math.min((t - inicio) / 700, 1);
      const fijos = Math.floor(final.length * p);
      visual.textContent = [...final]
        .map((c, i) => (i < fijos || c === ' ' || c === '·' ? c : signos[Math.floor(Math.random() * signos.length)]))
        .join('');
      if (p < 1) requestAnimationFrame(paso);
      else {
        el.textContent = final;
        el.classList.remove('armando');
      }
    };
    requestAnimationFrame(paso);
  };
  const obs = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          armar(en.target);
          obs.unobserve(en.target);
        }
      }),
    { threshold: 1 }
  );
  items.forEach((el) => obs.observe(el));
}

// ----- Cursor con la estrella del logo (solo en computadora) -----
function cursorEstrella() {
  if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const html = document.documentElement;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML =
    '<svg viewBox="731.8 70.7 352.3 352.3" fill="currentColor"><path d="M1084.08,246.8c-158.73,9.62-166.53,17.42-176.15,176.15-9.62-158.73-17.42-166.53-176.15-176.15,158.73-9.62,166.53-17.42,176.15-176.15,9.62,158.73,17.42,166.53,176.15,176.15Z"/></svg><span></span>';
  document.body.appendChild(cursor);
  const etiqueta = cursor.querySelector('span');
  html.classList.add('cursor-activo');

  let x = -100, y = -100, sobreUltimo = null, pendiente = false;
  const actualizar = (sobre) => {
    if (!sobre || !sobre.closest) return;
    const tarjeta = sobre.closest('[data-cursor]');
    const enlace = sobre.closest('a, button, [role="button"], label, summary');
    cursor.classList.toggle('ver', !!tarjeta);
    cursor.classList.toggle('enlace', !tarjeta && !!enlace);
    // Sobre fondos negros o rojos la estrella se pone clara para que no se pierda
    cursor.classList.toggle('oscuro', !!sobre.closest('.site-footer, .numeros, .franja, .menu-open .nav, .cta, .btn-accent'));
    if (tarjeta) etiqueta.textContent = tarjeta.dataset.cursor;
  };
  // La estrella va pegada al mouse y solo se redibuja cuando el mouse se mueve (una vez por cuadro)
  const dibujar = () => {
    pendiente = false;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    actualizar(sobreUltimo);
  };
  addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    sobreUltimo = e.target;
    cursor.classList.add('visible');
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(dibujar);
    }
  }, { passive: true });
  // Al bajar con la rueda, el contenido se mueve debajo del mouse: se vuelve a revisar qué hay debajo
  addEventListener('scroll', () => actualizar(document.elementFromPoint(x, y)), { passive: true });
  document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
  // Dentro del visor de imágenes se usa el cursor normal
  const visor = document.querySelector('.visor');
  if (visor) {
    new MutationObserver(() => html.classList.toggle('cursor-activo', !visor.open)).observe(visor, { attributes: true, attributeFilter: ['open'] });
  }
}

// ----- Calculadora de murales (Tarifario Mural) -----
function calculadora() {
  const form = document.querySelector('form.calc');
  if (!form) return;
  const T = JSON.parse(form.dataset.tarifario);
  const X = JSON.parse(form.dataset.textos);
  const idioma = EN ? 'en-US' : 'es-AR';
  const pesos = (v) => new Intl.NumberFormat(idioma, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Math.round(v));
  const numero = (v) => new Intl.NumberFormat(idioma, { maximumFractionDigits: 2 }).format(v);
  const plantilla = (t, datos) => t.replace(/\{(\w+)\}/g, (_, k) => datos[k]);
  const salida = form.querySelector('.calc-salida');
  const superficie = form.querySelector('output[name="m2"]');
  const pedir = form.querySelector('.calc-pedir');
  const base = pedir.getAttribute('href');
  // Valor por m² de un tramo; si la tabla dice "B" o "A", esa categoría se cotiza como la indicada
  const valor = (tramo, diseno, cat) => {
    let c = cat;
    while (typeof tramo[diseno][c] === 'string') c = tramo[diseno][c];
    return { valor: tramo[diseno][c], cat: c };
  };
  const fila = (nombre, monto, extra = '') => `<div class="calc-fila${extra}"><dt>${nombre}</dt><dd>${monto}</dd></div>`;
  const descarga = form.querySelector('.calc-descarga');
  // Último resultado calculado: es lo que va al PDF o a la imagen
  let estado = null;

  const calcular = () => {
    const f = new FormData(form);
    const ancho = parseFloat(f.get('ancho'));
    const alto = parseFloat(f.get('alto'));
    const m2 = ancho > 0 && alto > 0 ? Math.round(ancho * alto * 100) / 100 : 0;
    superficie.textContent = m2 ? `${numero(m2)} m²` : '—';
    if (!m2) {
      salida.innerHTML = `<p class="calc-vacio">${X.vacio}</p>`;
      pedir.href = base;
      estado = null;
      descarga.hidden = true;
      return;
    }
    const cliente = f.get('cliente');
    const diseno = f.get('diseno');
    const boceto = f.get('boceto');
    const evento = f.get('evento') === 'on';
    // Viáticos: jornadas de obra × personas × monto por persona y jornada
    const diasObra = Math.max(0, parseInt(f.get('jornadasObra'), 10) || 0);
    const personas = Math.max(1, parseInt(f.get('personas'), 10) || 1);
    const porDia = Math.max(0, parseFloat(f.get('viatico')) || 0);
    const viaticos = diasObra * personas * porDia;
    const detalleViaticos = plantilla(X.viaticoDetalle, { j: plantilla(diasObra === 1 ? X.jornada : X.jornadas, { n: diasObra }), p: plantilla(personas === 1 ? X.personaUna : X.personaVarias, { n: personas }), m: pesos(porDia) });
    form.querySelector('.calc-noincluye').textContent = viaticos ? X.noIncluyeConViaticos : X.noIncluye;
    const datos = [`${X.superficie}: ${numero(ancho)} × ${numero(alto)} m = ${numero(m2)} m²`, `${X.clientes[cliente]} (${cliente})`, X.disenos[diseno], X.bocetos[boceto]];
    if (evento) datos.push(X.eventoCheck);
    if (viaticos) datos.push(`${X.viaticosTitulo}: ${detalleViaticos}`);

    let html;
    let resumen;
    if (m2 > T.megamural.desde) {
      html = `<p class="calc-mega">${X.mega}</p>`;
      resumen = '';
      estado = null;
    } else {
      const i = T.tramos.findIndex((t) => m2 <= t.hasta);
      const tramo = T.tramos[i];
      const { valor: porM2, cat } = valor(tramo, diseno, cliente);
      let pintura = m2 * porM2;
      // Una pared más grande nunca cuesta menos que la más grande del tramo anterior
      let minimo = false;
      if (i > 0) {
        const anterior = T.tramos[i - 1];
        const piso = anterior.hasta * valor(anterior, diseno, cliente).valor;
        if (pintura < piso) {
          pintura = piso;
          minimo = true;
        }
      }
      const recargo = evento ? pintura * T.evento : 0;
      const honorarios = pintura + recargo;
      const disenoMin = boceto === 'propio' ? honorarios * T.boceto.min : boceto === 'adaptar' ? honorarios * T.adaptacion : 0;
      const disenoMax = boceto === 'propio' ? honorarios * T.boceto.max : disenoMin;
      const min = honorarios + disenoMin + viaticos;
      const max = honorarios + disenoMax + viaticos;
      const desde = i > 0 ? T.tramos[i - 1].hasta : 0;
      const total = min === max ? pesos(min) : `${pesos(min)} – ${pesos(max)}`;
      const extras = [evento ? X.evento : '', viaticos ? `${X.viaticosTitulo}: ${detalleViaticos}` : ''].filter(Boolean);
      estado = {
        medidas: `${numero(ancho)} × ${numero(alto)} m`,
        superficie: `${numero(m2)} m²`,
        cliente: `${cat} · ${X.clientes[cat]}`,
        diseno: X.disenos[diseno],
        boceto: X.bocetos[boceto],
        extras,
        filas: [],
        total,
        avisos: [],
        noIncluye: viaticos ? X.noIncluyeConViaticos : X.noIncluye,
      };
      html = '<dl class="calc-filas">';
      html += fila(X.tramo, desde ? plantilla(X.tramoDesde, { d: desde, h: tramo.hasta }) : plantilla(X.tramoHasta, { h: tramo.hasta }));
      html += fila(X.categoria, cat);
      html += fila(X.valorM2, pesos(porM2));
      html += fila(X.pintura, pesos(pintura));
      if (recargo) html += fila(X.evento, pesos(recargo));
      if (boceto === 'propio') html += fila(X.boceto, `${pesos(disenoMin)} – ${pesos(disenoMax)}`);
      if (boceto === 'adaptar') html += fila(X.adaptacion, pesos(disenoMin));
      // Cuánto pesan los viáticos en el total (sobre el total mínimo si hay rango)
      if (viaticos) html += fila(`${X.viaticos} (${detalleViaticos} · ${plantilla(X.delTotal, { p: numero(Math.round((viaticos / min) * 1000) / 10) })})`, pesos(viaticos));
      html += fila(X.total, total, ' calc-total');
      html += '</dl>';
      // Las mismas filas (sin el total) para el documento descargable
      estado.filas = [...html.matchAll(/<div class="calc-fila"><dt>(.*?)<\/dt><dd>(.*?)<\/dd><\/div>/g)].map((m) => [m[1], m[2]]);
      const avisos = [];
      if (cat !== cliente) avisos.push(plantilla(X.pasaA, { de: cliente, a: cat }));
      if (minimo) avisos.push(X.minimo);
      avisos.push(X.pago);
      html += avisos.map((a) => `<p class="calc-aviso">${a}</p>`).join('');
      estado.avisos = avisos;
      resumen = `${X.total}: ${total}`;
    }
    salida.innerHTML = html;
    descarga.hidden = !estado;
    // El botón lleva los datos al formulario de contacto
    const mensaje = [X.mensaje, '', ...datos, resumen].filter((l, k) => l || k === 1).join('\n');
    pedir.href = `${base}&mensaje=${encodeURIComponent(mensaje)}`;
  };
  form.addEventListener('input', (e) => e.target.name !== 'proyecto' && calcular());
  form.addEventListener('change', (e) => e.target.name !== 'proyecto' && calcular());
  form.addEventListener('submit', (e) => e.preventDefault());
  calcular();

  // Descargar el presupuesto como PDF o como imagen
  form.querySelectorAll('.calc-bajar').forEach((boton) =>
    boton.addEventListener('click', async () => {
      if (!estado) return;
      const texto = boton.textContent;
      boton.disabled = true;
      boton.textContent = X.generando;
      try {
        const ahora = new Date();
        const dos = (n) => String(n).padStart(2, '0');
        const dia = `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`;
        const datos = {
          ...estado,
          proyecto: form.querySelector('#calc-proyecto').value.trim(),
          fecha: new Intl.DateTimeFormat(idioma, { day: 'numeric', month: 'long', year: 'numeric' }).format(ahora),
          numero: `AIRON-${dia.replace(/-/g, '')}-${dos(ahora.getHours())}${dos(ahora.getMinutes())}`,
        };
        const lienzo = await dibujarPresupuesto(datos, X);
        const nombre = `${X.doc.archivo}-${dia}`;
        if (boton.dataset.formato === 'pdf') {
          const jpeg = await new Promise((r) => lienzo.toBlob(r, 'image/jpeg', 0.92));
          bajarArchivo(pdfConImagen(new Uint8Array(await jpeg.arrayBuffer()), lienzo.width, lienzo.height, datos.numero), `${nombre}.pdf`);
        } else {
          bajarArchivo(await new Promise((r) => lienzo.toBlob(r, 'image/png')), `${nombre}.png`);
        }
      } finally {
        boton.disabled = false;
        boton.textContent = texto;
      }
    })
  );
}

function bajarArchivo(blob, nombre) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

// Dibuja el presupuesto en una hoja A4 (1240 × 1754 px, 150 ppp) con la identidad de AIRON.
// Si el contenido no entra, se vuelve a dibujar un poco más chico.
async function dibujarPresupuesto(d, X) {
  await Promise.all(['400 40px Anton', '400 20px "Instrument Sans"', '600 20px "Instrument Sans"', '400 20px "IBM Plex Mono"', '500 20px "IBM Plex Mono"'].map((f) => document.fonts.load(f)));
  const svgLogo = document.querySelector('.site-header .logo-svg');
  const [, , vw, vh] = svgLogo.getAttribute('viewBox').split(' ').map(Number);
  const logo = new Image();
  logo.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgLogo.outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(/currentColor/g, '#111111'));
  await logo.decode();
  for (let escala = 1; ; escala -= 0.05) {
    const { lienzo, fin, limite } = hojaPresupuesto(d, X, logo, vw, vh, escala);
    if (fin <= limite || escala <= 0.7) return lienzo;
  }
}

function hojaPresupuesto(d, X, logo, vw, vh, e) {
  const W = 1240, H = 1754, M = 96, PIE = 110;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d');
  const TINTA = '#111111', FONDO = '#F2F0EB', GRIS = '#5A5750', ROJO = '#FF0000';
  const px = (n) => Math.round(n * e);
  const letra = (peso, tam, familia, color = TINTA, espacio = 0) => {
    x.font = `${peso} ${px(tam)}px ${familia}`;
    x.fillStyle = color;
    if ('letterSpacing' in x) x.letterSpacing = `${espacio}px`;
  };
  const MONO = '"IBM Plex Mono"', SANS = '"Instrument Sans"';
  const envolver = (t, ancho) => {
    const lineas = [];
    let l = '';
    for (const p of t.split(' ')) {
      const prueba = l ? `${l} ${p}` : p;
      if (x.measureText(prueba).width > ancho && l) {
        lineas.push(l);
        l = p;
      } else l = prueba;
    }
    if (l) lineas.push(l);
    return lineas;
  };
  const raya = (y, color = TINTA, grosor = 2) => {
    x.fillStyle = color;
    x.fillRect(M, y, W - M * 2, grosor);
  };
  x.fillStyle = FONDO;
  x.fillRect(0, 0, W, H);

  // Logo y, a la derecha, tipo de documento, fecha y número
  x.drawImage(logo, M, M, 380, (380 * vh) / vw);
  x.textAlign = 'right';
  letra(500, 22, MONO, ROJO, 2);
  x.fillText(X.doc.titulo.toUpperCase(), W - M, M + 22);
  letra(400, 22, MONO, GRIS, 1);
  x.fillText(`${X.doc.fecha}: ${d.fecha}`, W - M, M + 56);
  x.fillText(`${X.doc.numero} ${d.numero}`, W - M, M + 88);
  x.textAlign = 'left';
  raya(M + 124);

  // Título
  let y = M + 124 + px(140);
  letra(400, 120, 'Anton');
  x.fillText(X.doc.mural.toUpperCase(), M - 3, y);
  if (d.proyecto) {
    letra(600, 34, SANS);
    for (const l of envolver(`${X.doc.para}: ${d.proyecto}`, W - M * 2)) {
      y += px(46);
      x.fillText(l, M, y);
    }
  }

  // Datos del mural en dos columnas
  y += px(64);
  letra(500, 19, MONO, GRIS, 2);
  x.fillText(X.doc.datos.toUpperCase(), M, y);
  y += px(18);
  raya(y);
  const datos = [
    [X.doc.medidas, d.medidas],
    [X.doc.superficie, d.superficie],
    [X.doc.cliente, d.cliente],
    [X.doc.diseno, d.diseno],
    [X.doc.boceto, d.boceto],
    [X.doc.extras, d.extras.length ? d.extras.join(' · ') : X.doc.ninguno],
  ];
  const col = (W - M * 2 - 48) / 2;
  y += px(42);
  for (let i = 0; i < datos.length; i += 2) {
    let alto = 0;
    for (const k of [0, 1]) {
      const [nombre, valor] = datos[i + k];
      const cx = M + k * (col + 48);
      letra(400, 18, MONO, GRIS, 1);
      x.fillText(nombre.toUpperCase(), cx, y);
      letra(400, 26, SANS);
      const lineas = envolver(valor, col);
      lineas.forEach((l, j) => x.fillText(l, cx, y + px(36) + j * px(33)));
      alto = Math.max(alto, px(36) + lineas.length * px(33));
    }
    y += alto + px(24);
  }

  // Detalle de honorarios (sin tramo ni categoría, que ya están en los datos)
  y += px(16);
  letra(500, 19, MONO, GRIS, 2);
  x.fillText(X.doc.detalle.toUpperCase(), M, y);
  y += px(18);
  raya(y);
  for (const [nombre, monto] of d.filas.filter(([n]) => n !== X.tramo && n !== X.categoria)) {
    y += px(48);
    letra(400, 26, SANS, GRIS);
    x.fillText(nombre, M, y);
    x.textAlign = 'right';
    letra(600, 26, SANS);
    x.fillText(monto, W - M, y);
    x.textAlign = 'left';
    raya(y + px(19), '#D5D1C8', 1);
  }

  // Total
  y += px(84);
  letra(500, 22, MONO, TINTA, 2);
  x.fillText(X.total.toUpperCase(), M, y);
  let tamano = 96;
  letra(400, tamano, 'Anton', ROJO);
  while (x.measureText(d.total).width > W - M * 2 && tamano > 44) {
    tamano -= 4;
    letra(400, tamano, 'Anton', ROJO);
  }
  y += px(tamano) + 4;
  x.fillText(d.total, M - 2, y);

  // Avisos (forma de pago, categoría, mínimo) y aclaraciones
  y += px(48);
  for (const aviso of [...d.avisos, d.noIncluye, X.doc.validez]) {
    letra(400, 22, SANS);
    const lineas = envolver(aviso, W - M * 2 - 28);
    x.fillStyle = ROJO;
    x.fillRect(M, y - px(12), 9, 9);
    letra(400, 22, SANS);
    lineas.forEach((l, j) => x.fillText(l, M + 28, y + j * px(29)));
    y += lineas.length * px(29) + px(12);
  }
  letra(400, 17, MONO, GRIS, 0.5);
  for (const l of envolver(X.fuente, W - M * 2)) {
    y += px(26);
    x.fillText(l, M, y);
  }

  // Pie negro con los datos de contacto
  x.fillStyle = TINTA;
  x.fillRect(0, H - PIE, W, PIE);
  x.fillStyle = ROJO;
  x.fillRect(M, H - PIE / 2 - 7, 14, 14);
  x.font = '500 24px "IBM Plex Mono"';
  if ('letterSpacing' in x) x.letterSpacing = '2px';
  x.fillStyle = FONDO;
  x.fillText('AIRONSTUDIO.COM.AR', M + 34, H - PIE / 2 + 8);
  x.textAlign = 'right';
  x.fillText('@_AIRONSTUDIO', W - M, H - PIE / 2 + 8);
  return { lienzo: c, fin: y, limite: H - PIE - 40 };
}

// Arma un PDF de una página A4 con la imagen (JPEG) del presupuesto, sin librerías
function pdfConImagen(jpeg, ancho, alto, titulo) {
  return pdfConImagenes([{ jpeg, ancho, alto }], titulo);
}

// Arma un PDF A4 con una imagen JPEG por página
function pdfConImagenes(paginas, titulo) {
  const cod = new TextEncoder();
  const partes = [];
  const pos = [];
  let largo = 0;
  const sumar = (d) => {
    const b = typeof d === 'string' ? cod.encode(d) : d;
    partes.push(b);
    largo += b.length;
  };
  const objeto = (n, cuerpo) => {
    pos[n] = largo;
    sumar(`${n} 0 obj\n${cuerpo}\nendobj\n`);
  };
  const PW = 595.28, PH = 841.89;
  // Objetos: 1 catálogo, 2 lista de páginas, y por cada página: hoja, imagen y dibujo; al final, los datos del documento
  const n = paginas.length;
  const hoja = (i) => 3 + i * 3;
  const info = 3 + n * 3;
  sumar('%PDF-1.4\n%âãÏÓ\n');
  objeto(1, '<< /Type /Catalog /Pages 2 0 R >>');
  objeto(2, `<< /Type /Pages /Kids [${paginas.map((_, i) => `${hoja(i)} 0 R`).join(' ')}] /Count ${n} >>`);
  paginas.forEach(({ jpeg, ancho, alto }, i) => {
    const h = hoja(i);
    objeto(h, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 ${h + 1} 0 R >> >> /Contents ${h + 2} 0 R >>`);
    pos[h + 1] = largo;
    sumar(`${h + 1} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${ancho} /Height ${alto} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    sumar(jpeg);
    sumar('\nendstream\nendobj\n');
    const dibujo = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;
    objeto(h + 2, `<< /Length ${dibujo.length} >>\nstream\n${dibujo}\nendstream`);
  });
  objeto(info, `<< /Title (${titulo}) /Producer (AIRON Studio) >>`);
  const xref = largo;
  let fin = `xref\n0 ${info + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= info; i++) fin += `${String(pos[i]).padStart(10, '0')} 00000 n \n`;
  fin += `trailer\n<< /Size ${info + 1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  sumar(fin);
  return new Blob(partes, { type: 'application/pdf' });
}

// ----- Tarifario de diseño: precios por tipo de cliente y generador de presupuesto -----
function tarifarioDiseno() {
  const raiz = document.querySelector('.tar');
  if (!raiz) return;
  const C = JSON.parse(raiz.dataset.tarifario);
  const X = JSON.parse(raiz.dataset.textos);
  const idioma = EN ? 'en-US' : 'es-AR';
  const plantilla = (t, datos) => t.replace(/\{(\w+)\}/g, (_, k) => datos[k]);
  const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Los servicios se leen de la lista de la página
  const catalogo = {};
  raiz.querySelectorAll('.tar-servicio').forEach((li) => {
    const precio = li.querySelector('.tar-precio');
    catalogo[li.dataset.id] = {
      id: li.dataset.id,
      nombre: li.querySelector('.tar-nombre').textContent,
      desc: li.querySelector('.tar-desc')?.textContent || '',
      unidad: li.querySelector('.tar-unidad').textContent,
      rubro: li.closest('.tar-rubro').dataset.rubro,
      precios: precio.dataset.precios ? precio.dataset.precios.split(',').map(Number) : null,
      pct: precio.dataset.pct ? Number(precio.dataset.pct) : 0,
      li,
    };
  });

  // Estado del presupuesto (se guarda en este navegador)
  const CLAVE = 'airon-presupuesto-diseno';
  const estado = { cliente: 1, moneda: 'ARS', items: [], gremio: false, descuento: 0, titulo: '', clienteNombre: '', notas: '', descripciones: true };
  try {
    Object.assign(estado, JSON.parse(localStorage.getItem(CLAVE)) || {});
  } catch (e) {}
  estado.items = (estado.items || []).filter((it) => catalogo[it.id]);
  const guardar = () => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (e) {}
  };

  const redondear = (v) => Math.ceil(v / C.redondeo) * C.redondeo;
  const dinero = (v) =>
    estado.moneda === 'USD'
      ? new Intl.NumberFormat(idioma, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(v / C.dolar))
      : new Intl.NumberFormat(idioma, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);
  const fijo = (it) => redondear(catalogo[it.id].precios[estado.cliente] * (it.adaptacion ? C.adaptacion : 1)) * it.cantidad;
  // Los servicios en porcentaje (desarrollo a medida, multi lenguaje) se calculan sobre los servicios web del presupuesto
  const baseWeb = () => estado.items.filter((it) => !catalogo[it.id].pct && catalogo[it.id].rubro === 'web').reduce((s, it) => s + fijo(it), 0);
  const monto = (it) => (catalogo[it.id].pct ? redondear(baseWeb() * catalogo[it.id].pct) * it.cantidad : fijo(it));
  const cuentas = () => {
    const lineas = estado.items.map((it) => ({ it, s: catalogo[it.id], monto: monto(it) }));
    const subtotal = lineas.reduce((s, l) => s + l.monto, 0);
    const gremio = estado.gremio ? Math.round((subtotal * C.gremio) / C.redondeo) * C.redondeo : 0;
    const descuento = estado.descuento ? Math.round(((subtotal - gremio) * estado.descuento) / 100 / C.redondeo) * C.redondeo : 0;
    const total = subtotal - gremio - descuento;
    return { lineas, subtotal, gremio, descuento, total, anticipo: redondear(total * C.anticipo) };
  };

  const lista = raiz.querySelector('.tar-items');
  const totales = raiz.querySelector('.tar-totales');
  const contador = raiz.querySelector('.tar-contador');
  const botones = raiz.querySelectorAll('.tar-bajar, .tar-vaciar');

  const pintar = () => {
    // Precios de la lista y hora de trabajo según cliente y moneda
    raiz.querySelectorAll('.tar-precio[data-precios]').forEach((p) => {
      p.textContent = dinero(Number(p.dataset.precios.split(',')[estado.cliente]));
    });
    raiz.querySelector('[data-ref="hora"]').textContent = dinero(C.horaTrabajo);
    // Marcar en la lista lo que ya está en el presupuesto
    const cantidades = Object.fromEntries(estado.items.map((it) => [it.id, it.cantidad]));
    Object.values(catalogo).forEach((s) => {
      const n = cantidades[s.id];
      s.li.classList.toggle('en-presupuesto', !!n);
      const b = s.li.querySelector('.tar-agregar');
      b.textContent = n ? `${X.agregado} · ${n}` : X.agregar;
    });
    const c = cuentas();
    contador.textContent = estado.items.length;
    lista.innerHTML = c.lineas.length
      ? `<ul class="tar-lineas">${c.lineas
          .map(
            ({ it, s, monto: m }) => `<li class="tar-linea" data-id="${s.id}">
            <div class="tar-linea-cabeza"><span class="tar-linea-nombre">${escapar(s.nombre)}</span><span class="tar-linea-monto">${dinero(m)}</span><button type="button" class="tar-quitar" data-accion="quitar" aria-label="${X.quitar}: ${escapar(s.nombre)}">×</button></div>
            <div class="tar-linea-controles">
              <span class="tar-cantidad" role="group" aria-label="${X.cantidad}"><button type="button" data-accion="menos" aria-label="−1">−</button><span>${it.cantidad}</span><button type="button" data-accion="mas" aria-label="+1">+</button></span>
              <span class="mono tar-linea-unidad">${escapar(s.unidad)}</span>
              ${s.pct ? '' : `<label class="tar-adapt"><input type="checkbox" data-accion="adaptacion"${it.adaptacion ? ' checked' : ''}> ${X.adaptacion}</label>`}
            </div>
          </li>`
          )
          .join('')}</ul>`
      : `<p class="tar-vacio">${X.vacio}</p>`;
    const fila = (t, v, clase = '') => `<div class="calc-fila${clase}"><dt>${t}</dt><dd>${v}</dd></div>`;
    totales.innerHTML = c.lineas.length
      ? fila(X.subtotal, dinero(c.subtotal)) +
        (c.gremio ? fila(X.gremioFila, `− ${dinero(c.gremio)}`) : '') +
        (c.descuento ? fila(plantilla(X.descuentoFila, { p: estado.descuento }), `− ${dinero(c.descuento)}`) : '') +
        fila(X.total, dinero(c.total), ' calc-total') +
        fila(X.anticipoFila, dinero(c.anticipo))
      : '';
    botones.forEach((b) => (b.disabled = !c.lineas.length));
    guardar();
  };

  // Cargar en los campos lo que estaba guardado
  const campo = (n) => raiz.querySelector(`[name="${n}"]`);
  raiz.querySelector(`input[name="cliente"][value="${estado.cliente}"]`).checked = true;
  raiz.querySelector(`input[name="moneda"][value="${estado.moneda}"]`).checked = true;
  campo('gremio').checked = estado.gremio;
  campo('descuento').value = estado.descuento;
  campo('titulo').value = estado.titulo;
  campo('clienteNombre').value = estado.clienteNombre;
  campo('notas').value = estado.notas;
  campo('descripciones').checked = estado.descripciones;

  raiz.addEventListener('click', (e) => {
    const agregar = e.target.closest('.tar-agregar');
    if (agregar) {
      const it = estado.items.find((i) => i.id === agregar.dataset.id);
      if (it) it.cantidad += 1;
      else estado.items.push({ id: agregar.dataset.id, cantidad: 1, adaptacion: false });
      pintar();
      return;
    }
    const accion = e.target.closest('[data-accion]');
    const linea = e.target.closest('.tar-linea');
    if (accion && linea && accion.dataset.accion !== 'adaptacion') {
      const i = estado.items.findIndex((it) => it.id === linea.dataset.id);
      if (accion.dataset.accion === 'mas') estado.items[i].cantidad += 1;
      if (accion.dataset.accion === 'menos') estado.items[i].cantidad = Math.max(1, estado.items[i].cantidad - 1);
      if (accion.dataset.accion === 'quitar') estado.items.splice(i, 1);
      pintar();
    }
    if (e.target.closest('.tar-vaciar')) {
      estado.items = [];
      pintar();
    }
  });
  raiz.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.accion === 'adaptacion') {
      estado.items.find((it) => it.id === t.closest('.tar-linea').dataset.id).adaptacion = t.checked;
    } else if (t.name === 'cliente') estado.cliente = Number(t.value);
    else if (t.name === 'moneda') estado.moneda = t.value;
    else if (t.name === 'gremio') estado.gremio = t.checked;
    else if (t.name === 'descripciones') estado.descripciones = t.checked;
    else return;
    pintar();
  });
  raiz.addEventListener('input', (e) => {
    const t = e.target;
    if (t.name === 'descuento') {
      estado.descuento = Math.min(100, Math.max(0, parseFloat(t.value) || 0));
      pintar();
    } else if (['titulo', 'clienteNombre', 'notas'].includes(t.name)) {
      estado[t.name] = t.value;
      guardar();
    }
  });

  // Filtro por rubro y buscador
  let rubro = 'todos';
  const buscador = raiz.querySelector('#tar-buscar');
  const filtrar = () => {
    const q = buscador.value.trim().toLowerCase();
    let visibles = 0;
    raiz.querySelectorAll('.tar-rubro').forEach((sec) => {
      let n = 0;
      sec.querySelectorAll('.tar-servicio').forEach((li) => {
        const ok = (rubro === 'todos' || sec.dataset.rubro === rubro) && (!q || li.dataset.texto.includes(q));
        li.hidden = !ok;
        if (ok) n++;
      });
      sec.hidden = !n;
      visibles += n;
    });
    raiz.querySelector('.tar-sin').hidden = visibles > 0;
  };
  raiz.querySelectorAll('.tar-rubros .pill').forEach((b) =>
    b.addEventListener('click', () => {
      rubro = b.dataset.rubro;
      raiz.querySelectorAll('.tar-rubros .pill').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      filtrar();
    })
  );
  buscador.addEventListener('input', filtrar);

  // Descargas
  raiz.querySelectorAll('.tar-bajar').forEach((boton) =>
    boton.addEventListener('click', async () => {
      const c = cuentas();
      if (!c.lineas.length) return;
      const texto = boton.textContent;
      boton.disabled = true;
      boton.textContent = X.generando || '…';
      try {
        const ahora = new Date();
        const dos = (n) => String(n).padStart(2, '0');
        const dia = `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`;
        const datos = {
          ...c,
          dinero,
          titulo: estado.titulo.trim(),
          cliente: estado.clienteNombre.trim(),
          notas: estado.notas.trim(),
          descripciones: estado.descripciones,
          tipo: X.clientes[estado.cliente],
          moneda: estado.moneda,
          gremioAplicado: estado.gremio,
          descuentoPct: estado.descuento,
          fecha: new Intl.DateTimeFormat(idioma, { day: 'numeric', month: 'long', year: 'numeric' }).format(ahora),
          numero: `AIRON-D-${dia.replace(/-/g, '')}-${dos(ahora.getHours())}${dos(ahora.getMinutes())}`,
          fuente: plantilla(X.doc.fuente, { version: C.version }),
        };
        const hojas = await hojasPresupuestoDiseno(datos, X, C);
        const nombre = `${X.doc.archivo}-${dia}`;
        if (boton.dataset.formato === 'pdf') {
          const paginas = [];
          for (const h of hojas) paginas.push({ jpeg: new Uint8Array(await (await new Promise((r) => h.toBlob(r, 'image/jpeg', 0.92))).arrayBuffer()), ancho: h.width, alto: h.height });
          bajarArchivo(pdfConImagenes(paginas, datos.numero), `${nombre}.pdf`);
        } else {
          // Una sola imagen con todas las hojas una debajo de la otra
          const junta = document.createElement('canvas');
          junta.width = hojas[0].width;
          junta.height = hojas.reduce((s, h) => s + h.height, 0);
          let y = 0;
          for (const h of hojas) {
            junta.getContext('2d').drawImage(h, 0, y);
            y += h.height;
          }
          bajarArchivo(await new Promise((r) => junta.toBlob(r, 'image/png')), `${nombre}.png`);
        }
      } finally {
        boton.disabled = false;
        boton.textContent = texto;
      }
    })
  );

  pintar();
}

// Dibuja el presupuesto de diseño en hojas A4; si no entra, sigue en otra hoja
async function hojasPresupuestoDiseno(d, X, C) {
  const plantilla = (t, datos) => t.replace(/\{(\w+)\}/g, (_, k) => datos[k]);
  await Promise.all(['400 40px Anton', '400 20px "Instrument Sans"', '600 20px "Instrument Sans"', '400 20px "IBM Plex Mono"', '500 20px "IBM Plex Mono"'].map((f) => document.fonts.load(f)));
  const svgLogo = document.querySelector('.site-header .logo-svg');
  const [, , vw, vh] = svgLogo.getAttribute('viewBox').split(' ').map(Number);
  const logo = new Image();
  logo.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgLogo.outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(/currentColor/g, '#111111'));
  await logo.decode();

  const W = 1240, H = 1754, M = 96, PIE = 110, LIMITE = H - PIE - 50;
  const TINTA = '#111111', FONDO = '#F2F0EB', GRIS = '#5A5750', ROJO = '#FF0000', LINEA = '#D5D1C8';
  const MONO = '"IBM Plex Mono"', SANS = '"Instrument Sans"';
  const hojas = [];
  let x, y;
  let enTabla = false; // si la tabla sigue en la hoja nueva, se repite su encabezado
  const letra = (peso, tam, familia, color = TINTA, espacio = 0) => {
    x.font = `${peso} ${tam}px ${familia}`;
    x.fillStyle = color;
    if ('letterSpacing' in x) x.letterSpacing = `${espacio}px`;
  };
  const envolver = (t, ancho) => {
    const lineas = [];
    let l = '';
    for (const p of String(t).split(' ')) {
      const prueba = l ? `${l} ${p}` : p;
      if (x.measureText(prueba).width > ancho && l) {
        lineas.push(l);
        l = p;
      } else l = prueba;
    }
    if (l) lineas.push(l);
    return lineas;
  };
  const raya = (yy, color = TINTA, grosor = 2) => {
    x.fillStyle = color;
    x.fillRect(M, yy, W - M * 2, grosor);
  };
  const nuevaHoja = () => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    hojas.push(c);
    x = c.getContext('2d');
    x.fillStyle = FONDO;
    x.fillRect(0, 0, W, H);
    const primera = hojas.length === 1;
    const ancho = primera ? 380 : 260;
    x.drawImage(logo, M, M, ancho, (ancho * vh) / vw);
    x.textAlign = 'right';
    letra(500, 22, MONO, ROJO, 2);
    x.fillText(X.doc.titulo.toUpperCase(), W - M, M + 22);
    letra(400, 22, MONO, GRIS, 1);
    x.fillText(`${X.doc.fecha}: ${d.fecha}`, W - M, M + 56);
    x.fillText(`${X.doc.numero} ${d.numero}`, W - M, M + 88);
    x.textAlign = 'left';
    raya(M + 124);
    y = M + 124;
  };
  const espacio = (alto) => {
    if (y + alto > LIMITE) {
      nuevaHoja();
      y += 40;
      if (enTabla) encabezadoTabla();
    }
  };
  const encabezadoTabla = () => {
    letra(500, 19, MONO, GRIS, 2);
    x.fillText(X.doc.servicio.toUpperCase(), M, y + 30);
    x.textAlign = 'right';
    x.fillText(X.doc.importe.toUpperCase(), W - M, y + 30);
    x.textAlign = 'left';
    y += 44;
    raya(y);
  };

  nuevaHoja();
  // Título, cliente y datos generales
  y += 130;
  letra(400, 104, 'Anton');
  const titulo = (d.titulo || X.doc.titulo).toUpperCase();
  let tam = 104;
  while (x.measureText(titulo).width > W - M * 2 && tam > 56) {
    tam -= 4;
    letra(400, tam, 'Anton');
  }
  for (const l of envolver(titulo, W - M * 2).slice(0, 2)) {
    x.fillText(l, M - 3, y);
    y += tam * 0.95;
  }
  y += 6;
  if (d.cliente) {
    letra(600, 32, SANS);
    for (const l of envolver(`${X.doc.para}: ${d.cliente}`, W - M * 2)) {
      x.fillText(l, M, y);
      y += 42;
    }
  }
  letra(400, 20, MONO, GRIS, 1);
  x.fillText(`${X.cliente.toUpperCase()}: ${d.tipo.toUpperCase()}   ·   ${X.moneda.toUpperCase()}: ${d.moneda}`, M, y + 4);
  y += 36;

  // Tabla de servicios
  encabezadoTabla();
  enTabla = true;
  for (const { it, s, monto } of d.lineas) {
    letra(600, 26, SANS);
    const nombre = envolver(s.nombre, W - M * 2 - 260);
    letra(400, 18, MONO, GRIS, 0.5);
    const meta = `${s.unidad.toUpperCase()} × ${it.cantidad}${it.adaptacion ? ` · ${X.adaptacion.toUpperCase()}` : ''}${s.pct ? ` · ${plantilla(X.adicional, { p: Math.round(s.pct * 100) }).toUpperCase()}` : ''}`;
    letra(400, 20, SANS, GRIS);
    const desc = d.descripciones && s.desc ? envolver(s.desc, W - M * 2 - 260) : [];
    const alto = 24 + nombre.length * 34 + 30 + desc.length * 27 + 22;
    espacio(alto);
    y += 24;
    letra(600, 26, SANS);
    nombre.forEach((l, j) => x.fillText(l, M, y + 26 + j * 34));
    x.textAlign = 'right';
    x.fillText(d.dinero(monto), W - M, y + 26);
    x.textAlign = 'left';
    y += nombre.length * 34;
    letra(400, 18, MONO, GRIS, 0.5);
    x.fillText(meta, M, y + 22);
    y += 30;
    letra(400, 20, SANS, GRIS);
    desc.forEach((l, j) => x.fillText(l, M, y + 22 + j * 27));
    y += desc.length * 27 + 22;
    raya(y, LINEA, 1);
  }

  enTabla = false;
  // Totales
  const filaTotal = (t, v) => {
    espacio(46);
    y += 42;
    letra(400, 24, SANS, GRIS);
    x.fillText(t, M, y);
    x.textAlign = 'right';
    letra(600, 24, SANS);
    x.fillText(v, W - M, y);
    x.textAlign = 'left';
  };
  filaTotal(X.subtotal, d.dinero(d.subtotal));
  if (d.gremio) filaTotal(X.gremioFila, `− ${d.dinero(d.gremio)}`);
  if (d.descuento) filaTotal(plantilla(X.descuentoFila, { p: d.descuentoPct }), `− ${d.dinero(d.descuento)}`);
  espacio(150);
  y += 70;
  letra(500, 22, MONO, TINTA, 2);
  x.fillText(X.total.toUpperCase(), M, y);
  tam = 96;
  letra(400, tam, 'Anton', ROJO);
  while (x.measureText(d.dinero(d.total)).width > W - M * 2 && tam > 44) {
    tam -= 4;
    letra(400, tam, 'Anton', ROJO);
  }
  y += tam + 4;
  x.fillText(d.dinero(d.total), M - 2, y);
  filaTotal(X.anticipoFila, d.dinero(d.anticipo));

  // Notas, aclaraciones y fuente
  y += 30;
  const parrafo = (t, cuadro = true) => {
    letra(400, 22, SANS);
    const lineas = envolver(t, W - M * 2 - 28);
    espacio(lineas.length * 29 + 14);
    y += 14;
    if (cuadro) {
      x.fillStyle = ROJO;
      x.fillRect(M, y + 10, 9, 9);
    }
    letra(400, 22, SANS);
    lineas.forEach((l, j) => x.fillText(l, M + 28, y + 22 + j * 29));
    y += lineas.length * 29;
  };
  if (d.notas) parrafo(`${X.doc.notas}: ${d.notas}`);
  parrafo(X.nota);
  parrafo(X.doc.validez);
  letra(400, 17, MONO, GRIS, 0.5);
  for (const l of envolver(d.fuente, W - M * 2)) {
    espacio(26);
    y += 26;
    x.fillText(l, M, y + 8);
  }

  // Pie con contacto y número de página en cada hoja
  hojas.forEach((h, i) => {
    const c = h.getContext('2d');
    c.fillStyle = TINTA;
    c.fillRect(0, H - PIE, W, PIE);
    c.fillStyle = ROJO;
    c.fillRect(M, H - PIE / 2 - 7, 14, 14);
    c.font = '500 22px "IBM Plex Mono"';
    if ('letterSpacing' in c) c.letterSpacing = '2px';
    c.fillStyle = FONDO;
    c.textAlign = 'left';
    c.fillText('AIRONSTUDIO.COM.AR', M + 34, H - PIE / 2 + 8);
    c.textAlign = 'right';
    c.fillText(hojas.length > 1 ? `${plantilla(X.doc.pagina, { n: i + 1, t: hojas.length }).toUpperCase()}   ·   @_AIRONSTUDIO` : '@_AIRONSTUDIO', W - M, H - PIE / 2 + 8);
  });
  return hojas;
}

// ----- Visor de imágenes a pantalla completa -----
function visor() {
  const dialogo = document.querySelector('.visor');
  const enlaces = [...document.querySelectorAll('.zoom')];
  if (!dialogo || !enlaces.length || typeof dialogo.showModal !== 'function') return;

  const imagen = dialogo.querySelector('.visor-img');
  const contador = dialogo.querySelector('.visor-contador');
  let actual = 0;
  let origen = null;

  const mostrar = (i) => {
    actual = (i + enlaces.length) % enlaces.length;
    const miniatura = enlaces[actual].querySelector('img');
    imagen.src = enlaces[actual].href;
    imagen.alt = miniatura?.alt || '';
    contador.textContent = `${actual + 1} / ${enlaces.length}`;
  };

  enlaces.forEach((a, i) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      origen = a;
      mostrar(i);
      dialogo.showModal();
    })
  );
  dialogo.querySelector('.visor-cerrar').addEventListener('click', () => dialogo.close());
  dialogo.querySelector('.visor-ant').addEventListener('click', () => mostrar(actual - 1));
  dialogo.querySelector('.visor-sig').addEventListener('click', () => mostrar(actual + 1));
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) dialogo.close();
  });
  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
  });
  dialogo.addEventListener('close', () => {
    imagen.removeAttribute('src');
    origen?.focus();
  });

  // Deslizar con el dedo en el celular
  let inicioX = null;
  dialogo.addEventListener('touchstart', (e) => (inicioX = e.touches[0].clientX), { passive: true });
  dialogo.addEventListener('touchend', (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });
}

// ----- Formulario de contacto (Formspree) -----
function formulario() {
  const form = document.querySelector('form.form');
  if (!form) return;
  // Si se llega desde un enlace como /contacto/?tipo=mural, se elige ese tipo de proyecto
  const tipo = new URLSearchParams(location.search).get('tipo');
  const opcion = tipo && [...form.querySelectorAll('#tipo option')].find((o) => o.dataset.clave === tipo);
  if (opcion) opcion.selected = true;
  // Y si viene desde la calculadora de murales, el mensaje llega ya escrito
  const mensaje = new URLSearchParams(location.search).get('mensaje');
  const campo = form.querySelector('#mensaje');
  if (mensaje && campo && !campo.value) campo.value = mensaje.slice(0, 4000);
  const estado = form.querySelector('[data-estado]');
  const enviar = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.hasAttribute('data-pendiente')) {
      estado.textContent = MSG.pausa;
      return;
    }
    enviar.disabled = true;
    estado.textContent = MSG.enviando;
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      location.href = form.dataset.gracias || '/gracias/';
    } catch {
      estado.textContent = MSG.error;
      enviar.disabled = false;
    }
  });
}

// ----- Filtros de proyectos -----
function filtros() {
  const barra = document.querySelector('.filtros');
  if (!barra) return;
  barra.hidden = false;

  const pills = [...barra.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.grid-proyectos .card')];
  const contador = barra.querySelector('[data-count]');

  function filtrar(cat, porClic = false) {
    if (!pills.some((p) => p.dataset.filter === cat)) cat = 'todos';
    let visibles = 0;
    cards.forEach((card) => {
      const mostrar = cat === 'todos' || card.dataset.cats.split(' ').includes(cat);
      card.hidden = !mostrar;
      if (mostrar) {
        visibles++;
        if (porClic) card.classList.add('visible');
      }
    });
    pills.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.filter === cat)));
    contador.textContent = visibles;
    const url = new URL(location.href);
    if (cat === 'todos') url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', cat);
    history.replaceState(null, '', url);
  }

  pills.forEach((p) => p.addEventListener('click', () => filtrar(p.dataset.filter, true)));
  filtrar(new URLSearchParams(location.search).get('categoria') || 'todos');
}
