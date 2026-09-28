// Kit de estética AIRON — modo claro / oscuro guardado. Cargar en el <head> SIN defer, antes del CSS, para que no parpadee.
// Este archivo se carga antes de mostrar la página para que no aparezca un instante con el color equivocado.
(function () {
  var html = document.documentElement;
  var guardado = null;
  try {
    guardado = localStorage.getItem('tema');
  } catch (e) {}
  if (guardado === 'claro' || guardado === 'oscuro') html.setAttribute('data-tema', guardado);
  html.classList.add('con-tema');
})();
