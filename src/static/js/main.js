// AIRON Studio — menú de celular, filtros, visor de imágenes, formulario y animaciones
document.documentElement.classList.add('js');

const EN = document.documentElement.lang.startsWith('en');
const MSG = EN
  ? { abrir: 'Open menu', cerrar: 'Close menu', pausa: 'The form will be available very soon. In the meantime, reach us on Instagram or LinkedIn.', enviando: 'Sending…', error: "Couldn't send. Please try again or reach us on Instagram or LinkedIn." }
  : { abrir: 'Abrir menú', cerrar: 'Cerrar menú', pausa: 'El formulario se activa muy pronto. Mientras tanto, escribinos por Instagram o LinkedIn.', enviando: 'Enviando…', error: 'No se pudo enviar. Probá de nuevo o escribinos por Instagram o LinkedIn.' };

document.addEventListener('DOMContentLoaded', () => {
  menu();
  apariciones();
  contadores();
  visor();
  formulario();
  filtros();
});

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
