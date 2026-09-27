// AIRON Studio — menú de celular y filtros de proyectos
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // ----- Menú de celular -----
  const html = document.documentElement;
  const boton = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');

  function cerrarMenu() {
    html.classList.remove('menu-open');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
  }

  if (boton && menu) {
    boton.addEventListener('click', () => {
      const abierto = html.classList.toggle('menu-open');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) cerrarMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && html.classList.contains('menu-open')) {
        cerrarMenu();
        boton.focus();
      }
    });
  }

  // ----- Formulario de contacto (Formspree) -----
  const form = document.querySelector('form.form');
  if (form) {
    const estado = form.querySelector('[data-estado]');
    const enviar = form.querySelector('[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.hasAttribute('data-pendiente')) {
        estado.textContent = 'El formulario se activa muy pronto. Mientras tanto, escribime por Instagram o LinkedIn.';
        return;
      }
      enviar.disabled = true;
      estado.textContent = 'Enviando…';
      try {
        const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(r.status);
        location.href = '/gracias/';
      } catch {
        estado.textContent = 'No se pudo enviar. Probá de nuevo o escribime por Instagram o LinkedIn.';
        enviar.disabled = false;
      }
    });
  }

  // ----- Filtros de proyectos -----
  const barra = document.querySelector('.filtros');
  if (!barra) return;
  barra.hidden = false;

  const pills = [...barra.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.grid-proyectos .card')];
  const contador = barra.querySelector('[data-count]');

  function filtrar(cat) {
    if (!pills.some((p) => p.dataset.filter === cat)) cat = 'todos';
    let visibles = 0;
    cards.forEach((card) => {
      const mostrar = cat === 'todos' || card.dataset.cats.split(' ').includes(cat);
      card.hidden = !mostrar;
      if (mostrar) visibles++;
    });
    pills.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.filter === cat)));
    contador.textContent = visibles;
    const url = new URL(location.href);
    if (cat === 'todos') url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', cat);
    history.replaceState(null, '', url);
  }

  pills.forEach((p) => p.addEventListener('click', () => filtrar(p.dataset.filter)));
  filtrar(new URLSearchParams(location.search).get('categoria') || 'todos');
});
