// Movimiento de la propuesta Casaca: progreso de scroll, línea de tiempo, parallax suave,
// apariciones escalonadas y contadores. Si la persona pidió reducir movimiento, no anima nada.
(() => {
  const raiz = document.documentElement;
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escritorio = matchMedia('(min-width: 861px) and (pointer: fine)');
  const barra = document.querySelector('.progreso span');
  const linea = document.querySelector('.linea-tiempo');
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  let pendiente = false;

  function pintar() {
    pendiente = false;
    const max = raiz.scrollHeight - innerHeight;
    if (barra) barra.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    if (linea) {
      const r = linea.getBoundingClientRect();
      const p = reducir ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.72 - r.top) / r.height));
      linea.style.setProperty('--p', p.toFixed(3));
    }
    const mover = !reducir && escritorio.matches;
    for (const el of parallax) {
      if (!mover) { el.style.translate = ''; continue; }
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const centro = r.top + r.height / 2 - innerHeight / 2;
      const y = Math.max(-40, Math.min(40, -centro * parseFloat(el.dataset.parallax || 0)));
      el.style.translate = `0 ${y.toFixed(1)}px`;
    }
  }
  const alMover = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } };
  addEventListener('scroll', alMover, { passive: true });
  addEventListener('resize', alMover);
  pintar();

  if (reducir || !('IntersectionObserver' in window)) return;
  raiz.classList.add('anim');

  // escalonado: cada hijo de un grupo espera un poco más que el anterior
  document.querySelectorAll('[data-stagger]').forEach(grupo => {
    [...grupo.querySelectorAll(':scope > [data-reveal]')].forEach((el, i) => el.style.setProperty('--i', Math.min(i, 8)));
  });

  const contar = el => {
    const fin = Number(el.dataset.contar);
    const dur = fin > 9 ? 1300 : 800;
    const t0 = performance.now();
    const paso = t => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(paso);
    };
    el.textContent = '0';
    requestAnimationFrame(paso);
  };

  const observador = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      e.target.querySelectorAll('[data-contar]').forEach(contar);
      observador.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  document.querySelectorAll('[data-reveal], [data-linea]').forEach(el => observador.observe(el));
})();
