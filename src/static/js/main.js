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
