/* ==========================================================================
   Kit de estética AIRON — movimientos
   Sin librerías externas. Uso: <script src="estetica.js" defer></script>
   Todo respeta "reducir movimiento": si la persona lo pidió, no se anima nada.
   ========================================================================== */
(function () {
  document.documentElement.classList.add('js');
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hayObservador = 'IntersectionObserver' in window;

  // Ajustes: se pueden cambiar antes de cargar el archivo con window.ESTETICA = { ... }
  var AJUSTES = Object.assign(
    {
      signos: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+<>', // caracteres del efecto "glitch"
      duracionArmado: 700, // ms que tarda una etiqueta en armarse
      selectorArmado: '.kicker, [data-armar]', // qué textos se arman
      cursor: true, // cursor estrella en computadora
      // Estrella de 4 puntas (la del logo de AIRON). Se puede reemplazar por otro SVG.
      cursorSvg:
        '<svg viewBox="731.8 70.7 352.3 352.3" fill="currentColor"><path d="M1084.08,246.8c-158.73,9.62-166.53,17.42-176.15,176.15-9.62-158.73-17.42-166.53-176.15-176.15,158.73-9.62,166.53-17.42,176.15-176.15,9.62,158.73,17.42,166.53,176.15,176.15Z"/></svg>',
      // Sobre estos fondos oscuros o rojos el cursor se pone claro
      fondosOscuros: '.site-footer, .numeros, .franja, .cta, .btn-accent',
    },
    window.ESTETICA || {}
  );

  // Observa elementos y ejecuta "hacer" una sola vez cuando aparecen en pantalla
  function alAparecer(elementos, hacer, opciones) {
    if (!hayObservador) return elementos.forEach(hacer);
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          hacer(en.target);
          obs.unobserve(en.target);
        }
      });
    }, opciones);
    elementos.forEach(function (el) { obs.observe(el); });
  }

  // 1. Aparición suave al bajar: agregá class="reveal" a lo que quieras que aparezca
  function apariciones() {
    alAparecer(document.querySelectorAll('.reveal'), function (el) { el.classList.add('visible'); }, { rootMargin: '0px 0px -8% 0px' });
  }

  // 2. Etiquetas que se "arman" con caracteres al azar (efecto glitch)
  function textosQueSeArman() {
    if (quieto) return;
    var items = document.querySelectorAll(AJUSTES.selectorArmado);
    alAparecer(items, function (el) {
      var final = el.textContent;
      var inicio = performance.now();
      el.classList.add('armando');
      // Los lectores de pantalla leen el texto real; las letras al azar son solo visuales
      el.textContent = '';
      var real = document.createElement('span');
      real.className = 'oculto';
      real.textContent = final;
      var visual = document.createElement('span');
      visual.setAttribute('aria-hidden', 'true');
      el.append(real, visual);
      var s = AJUSTES.signos;
      function paso(t) {
        var p = Math.min((t - inicio) / AJUSTES.duracionArmado, 1);
        var fijos = Math.floor(final.length * p);
        visual.textContent = Array.from(final).map(function (c, i) {
          return i < fijos || c === ' ' || c === '·' ? c : s[Math.floor(Math.random() * s.length)];
        }).join('');
        if (p < 1) requestAnimationFrame(paso);
        else {
          el.textContent = final;
          el.classList.remove('armando');
        }
      }
      requestAnimationFrame(paso);
    }, { threshold: 1 });
  }

  // 3. Títulos con "ola" roja palabra por palabra: agregá class="titulo-ola"
  function titulosOla() {
    document.querySelectorAll('.titulo-ola').forEach(function (t) {
      if (t.dataset.ola) return;
      t.dataset.ola = '1';
      var palabras = t.textContent.trim().split(/\s+/);
      t.setAttribute('aria-label', t.textContent.trim());
      t.innerHTML = '';
      palabras.forEach(function (w, i) {
        var span = document.createElement('span');
        span.className = 'palabra';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = w;
        span.style.animationDelay = (0.3 + i * 0.15) + 's';
        t.append(span, i < palabras.length - 1 ? ' ' : '');
      });
    });
  }

  // 4. Números que cuentan hacia arriba: <span data-contar="47">47</span>
  function contadores() {
    if (quieto) return;
    alAparecer(document.querySelectorAll('[data-contar]'), function (el) {
      var fin = Number(el.dataset.contar);
      var inicio = performance.now();
      function paso(t) {
        var p = Math.min((t - inicio) / 1400, 1);
        el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    }, { threshold: 0.6 });
  }

  // 5. Cursor estrella (solo con mouse). Sobre links crece y gira; sobre [data-cursor="Ver"] muestra ese texto.
  function cursorEstrella() {
    if (!AJUSTES.cursor || quieto || !matchMedia('(pointer: fine)').matches) return;
    var html = document.documentElement;
    var cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = AJUSTES.cursorSvg + '<span></span>';
    document.body.appendChild(cursor);
    var etiqueta = cursor.querySelector('span');
    html.classList.add('cursor-activo');
    var x = -100, y = -100, sobreUltimo = null, pendiente = false;
    function actualizar(sobre) {
      if (!sobre || !sobre.closest) return;
      var tarjeta = sobre.closest('[data-cursor]');
      var enlace = sobre.closest('a, button, [role="button"], label, summary');
      cursor.classList.toggle('ver', !!tarjeta);
      cursor.classList.toggle('enlace', !tarjeta && !!enlace);
      cursor.classList.toggle('oscuro', !!sobre.closest(AJUSTES.fondosOscuros));
      if (tarjeta) etiqueta.textContent = tarjeta.dataset.cursor;
    }
    function dibujar() {
      pendiente = false;
      cursor.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      actualizar(sobreUltimo);
    }
    addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY; sobreUltimo = e.target;
      cursor.classList.add('visible');
      if (!pendiente) { pendiente = true; requestAnimationFrame(dibujar); }
    }, { passive: true });
    addEventListener('scroll', function () { actualizar(document.elementFromPoint(x, y)); }, { passive: true });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('visible'); });
  }

  // 6. Botón de modo claro / oscuro: <button class="tema-btn">…</button> (guarda la elección)
  function tema() {
    var html = document.documentElement;
    var boton = document.querySelector('.tema-btn');
    if (!boton) return;
    var sistema = matchMedia('(prefers-color-scheme: dark)');
    function oscuro() { return html.dataset.tema ? html.dataset.tema === 'oscuro' : sistema.matches; }
    boton.addEventListener('click', function () {
      var nuevo = oscuro() ? 'claro' : 'oscuro';
      html.dataset.tema = nuevo;
      try { localStorage.setItem('tema', nuevo); } catch (e) {}
    });
  }

  function iniciar() {
    titulosOla();
    apariciones();
    textosQueSeArman();
    contadores();
    cursorEstrella();
    tema();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
