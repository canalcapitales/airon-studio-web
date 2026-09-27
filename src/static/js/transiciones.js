// Transiciones entre páginas: la portada de un proyecto "viaja" desde la tarjeta hasta la página del proyecto.
// Este archivo se carga antes de mostrar la página para poder preparar la animación a tiempo.
(function () {
  function nombrar() {
    document.querySelectorAll('[data-vt]').forEach(function (el) {
      el.style.viewTransitionName = el.dataset.vt;
    });
  }
  window.addEventListener('pageswap', nombrar);
  window.addEventListener('pagereveal', nombrar);
})();
