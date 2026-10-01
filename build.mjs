// Genera el sitio estático de AIRON Studio en la carpeta dist/, en español (/) e inglés (/en/).
// Uso: node build.mjs   (no necesita instalar nada)

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { LEGALES, FAQ_HERRAMIENTAS, ACTUALIZADO } from './src/data/legales.mjs';
import { LAION, LAION_OBRAS, LAION_PORTADA } from './src/data/laion.mjs';

const OUT = 'dist';
const SITIO = {
  // Dirección pública de la web. Cambiarla cuando se conecte el dominio propio.
  url: 'https://aironstudio.com.ar',
  behance: 'https://www.behance.net/AIRONSTUDIO',
  linkedin: 'https://www.linkedin.com/in/aironstudio/',
  instagram: 'https://www.instagram.com/_aironstudio/',
  // Código del formulario en Formspree (ej: 'xyzabcde'). Vacío = formulario en pausa.
  formspree: 'maenlpzn',
};

const IDIOMAS = ['es', 'en'];
const FUNDACION = 2015;
const anio = new Date().getFullYear();
const OPCIONES_CLAVE = ['branding', 'grafica', 'web', 'sistemas', 'musical', 'motion', 'mural', 'foto', 'publicidad', 'otro'];
const MARCAS = ['GSP Seguridad', 'FOX Sports', 'Eleven Games', 'Ju Base Plant Food', 'Blend David', 'Flexy', 'Trust Fund'];

// Direcciones de cada página en cada idioma
const RUTAS = {
  es: { inicio: '/', proyectos: '/proyectos/', murales: '/murales/', tarifarios: '/herramientas/', calculadora: '/calculadora-murales/', tarifarioDiseno: '/tarifario-diseno/', unicode: '/herramientas/textos-unicode/', mayusculas: '/herramientas/mayusculas-minusculas/', png: '/herramientas/convertir-a-png/', estudio: '/nosotros/', contacto: '/contacto/', gracias: '/gracias/', legales: '/legales/', laion: '/laion/' },
  en: { inicio: '/en/', proyectos: '/en/projects/', murales: '/en/murals/', tarifarios: '/en/tools/', calculadora: '/en/mural-calculator/', tarifarioDiseno: '/en/design-rates/', unicode: '/en/tools/unicode-text/', mayusculas: '/en/tools/case-converter/', png: '/en/tools/png-converter/', estudio: '/en/about/', contacto: '/en/contact/', gracias: '/en/thanks/', legales: '/en/legal/', laion: '/en/laion/' },
};
const rutaDe = (l, clave, slug) => (clave === 'proyecto' ? `${RUTAS[l].proyectos}${slug}/` : RUTAS[l][clave]);

// ---------- textos de la interfaz ----------
const TXT = {
  es: {
    htmlLang: 'es-AR', ogLocale: 'es_AR', nombreIdioma: 'Español',
    lema: 'Diseño que construye marcas, ideas y experiencias',
    descripcion: 'Estudio de diseño multimedial en Buenos Aires desde 2015. Branding, diseño gráfico, diseño web, gráfica musical, motion, arte urbano y fotografía analógica.',
    saltar: 'Saltar al contenido', inicioAria: 'AIRON Studio — Inicio', abrirMenu: 'Abrir menú', navPrincipal: 'Principal', redes: 'Redes',
    nav: { inicio: 'Inicio', proyectos: 'Proyectos', estudio: 'Nosotros', contacto: 'Contacto' },
    idiomaAria: 'Idioma', temaOscuro: 'Cambiar a modo oscuro',
    // ---------- herramientas (página que las reúne), tarifario de diseño, textos Unicode y PNG ----------
    tarifarios: {
      nav: 'Herramientas',
      titulo: 'Herramientas gratuitas para creativos',
      desc: 'Herramientas gratuitas para creativos: tarifario mural, tarifario de diseño, generador de letras Unicode, convertidor de mayúsculas y minúsculas y convertidor de imágenes a PNG.',
      kicker: 'Gratis · Sin registrarse',
      h1: 'Herramientas',
      lead: 'Herramientas gratuitas para diseñadores, muralistas y marcas: calculá y presupuestá trabajos, generá letras especiales para redes y convertí imágenes a PNG. Todo funciona en tu navegador.',
      herramientas: [
        ['calculadora', 'Tarifario mural', 'Calculá el costo de un mural por m² según el Tarifario Mural 2026 de la comunidad de muralistas: medidas, tipo de cliente, diseño, evento y viáticos.', 'Calcular un mural →'],
        ['tarifarioDiseno', 'Tarifario de diseño', '118 servicios de diseño en 15 rubros —identidad, web, redes, editorial, audiovisual y más— con valores por tipo de cliente. Armá el presupuesto sumando servicios.', 'Armar un presupuesto →'],
        ['unicode', 'Letras Unicode', 'Escribí un texto y copialo en negrita, cursiva, gótica, burbujas y más de 20 estilos para bios, posteos y nombres de Instagram, TikTok o WhatsApp.', 'Crear textos →'],
        ['mayusculas', 'Mayúsculas y minúsculas', 'Pegá un texto y pasalo a MAYÚSCULAS, minúsculas, tipo oración, tipo título o Cada Palabra, y copialo con un toque. También quita tildes para archivos y usuarios.', 'Convertir texto →'],
        ['png', 'Convertir a PNG', 'Pasá tus imágenes JPG, WEBP, GIF o SVG a PNG, cambiá el tamaño, quitá un fondo de color para dejarlo transparente y recortá los bordes. Sin subir nada.', 'Convertir imágenes →'],
      ],
    },
    unicode: {
      titulo: 'Letras Unicode: generador de textos para Instagram y redes',
      desc: 'Generador gratuito de letras Unicode: escribí tu texto y copialo en negrita, cursiva, gótica, burbujas y más estilos para Instagram, TikTok y WhatsApp.',
      kicker: 'Herramienta gratuita',
      h1: 'Letras Unicode',
      lead: 'Escribí un texto y copialo en el estilo que quieras. Funciona en bios, posteos, nombres de perfil y mensajes de Instagram, TikTok, WhatsApp, X y más, porque no son tipografías: son caracteres especiales.',
      campo: 'Tu texto',
      ejemplo: 'Escribí acá tu texto',
      inicial: 'AIRON Studio',
      copiar: 'Copiar',
      copiado: 'Copiado ✓',
      limpiar: 'Borrar',
      estilos: 'estilos',
      consejoTitulo: 'Tené en cuenta',
      consejos: [
        'Los lectores de pantalla (que usan las personas ciegas) pueden leer estos caracteres de forma rara: usalos para destacar, no para textos largos.',
        'Los buscadores de Instagram y Google no siempre los encuentran: dejá tu nombre en letras comunes en algún lado.',
        'Algunos estilos no tienen tildes ni números propios: se muestran lo más parecido posible.',
      ],
      nombres: {
        negrita: 'Negrita', cursiva: 'Cursiva', negritaCursiva: 'Negrita cursiva', sans: 'Sans', sansNegrita: 'Sans negrita', sansCursiva: 'Sans cursiva', sansNegritaCursiva: 'Sans negrita cursiva', escritura: 'Escritura', escrituraNegrita: 'Escritura negrita', gotica: 'Gótica', goticaNegrita: 'Gótica negrita', doble: 'Doble trazo', mono: 'Monoespaciada', ancha: 'Ancha', circulos: 'Círculos', circulosNegros: 'Círculos negros', cuadros: 'Cuadrados', cuadrosNegros: 'Cuadrados negros', versalitas: 'Versalitas', superindice: 'Superíndice', invertida: 'Al revés', tachada: 'Tachada', subrayada: 'Subrayada', dobleSubrayado: 'Doble subrayado', barrada: 'Con barra',
      },
    },
    mayusculas: {
      titulo: 'Convertir mayúsculas a minúsculas online — y al revés',
      desc: 'Convertidor gratuito de mayúsculas y minúsculas: pasá tu texto a MAYÚSCULAS, minúsculas, tipo oración, tipo título o Cada Palabra, quitá tildes y copialo con un toque.',
      kicker: 'Herramienta gratuita',
      h1: 'Mayúsculas y minúsculas',
      lead: 'Pegá o escribí un texto y copialo en el formato que necesites: todo en mayúsculas, todo en minúsculas, con mayúscula después de cada punto o con mayúscula en cada palabra. Funciona en tu navegador: el texto no se envía a ningún lado.',
      campo: 'Tu texto',
      ejemplo: 'Pegá o escribí acá tu texto',
      inicial: 'hola. ESTE ES UN TEXTO de ejemplo para AIRON studio.\n¿querés probar con el tuyo?',
      copiar: 'Copiar',
      copiado: 'Copiado ✓',
      limpiar: 'Borrar',
      cuenta: { caracteres: 'caracteres', palabras: 'palabras', lineas: 'líneas' },
      consejoTitulo: 'Cuándo usar cada una',
      consejos: [
        'Tipo oración: para textos corridos, descripciones y posteos. Revisá después los nombres propios, que quedan en minúscula.',
        'Tipo título: para títulos de notas, libros o canciones. Deja en minúscula palabras cortas como “de”, “la” o “y”.',
        'Sin tildes: para nombres de archivos, carpetas, usuarios o mails, donde las tildes y la ñ suelen dar problemas.',
      ],
      modos: {
        oracion: 'Tipo oración',
        minusculas: 'minúsculas',
        mayusculas: 'MAYÚSCULAS',
        palabras: 'Cada Palabra',
        titulo: 'Tipo Título',
        invertir: 'iNVERTIR',
        alternar: 'aLtErNaDo',
        sinTildes: 'Sin tildes',
      },
    },
    png: {
      titulo: 'Convertir imagen a PNG online gratis — quitar fondo con IA',
      desc: 'Convertí imágenes JPG, WEBP, GIF o SVG a PNG gratis, quitá el fondo con IA o un fondo de color para dejarlo transparente, cambiá el tamaño y recortá bordes. Sin subir tus archivos.',
      kicker: 'Herramienta gratuita',
      h1: 'Convertir a PNG',
      lead: 'Pasá tus imágenes a PNG, con fondo transparente si lo necesitás. Todo se procesa en tu navegador: tus archivos no se suben a ningún servidor.',
      soltar: 'Arrastrá tus imágenes acá',
      o: 'o',
      elegir: 'Elegí archivos',
      formatos: 'JPG, WEBP, GIF, BMP, SVG o PNG · Podés subir varias a la vez.',
      ajustes: 'Ajustes',
      tamano: 'Tamaño',
      tamanos: [['original', 'Original'], ['ancho', 'Ancho máximo']],
      anchoMax: 'Ancho máximo (px)',
      ia: 'Quitar fondo con IA',
      iaAyuda: 'Para fotos de personas, animales u objetos. La IA funciona en tu navegador: la primera vez descarga unos 19 MB y después queda guardada.',
      iaDescargando: 'Descargando la IA (unos 19 MB, solo la primera vez)…',
      iaTrabajando: 'La IA está quitando el fondo…',
      iaLista: 'IA lista. Si el borde queda con restos, sumá “Quitar fondo de color”.',
      iaError: 'No se pudo usar la IA en este navegador. Probá con Chrome, Edge, Firefox o Safari actualizados.',
      fondo: 'Quitar fondo de color',
      fondoAyuda: 'Ideal para logos, firmas o dibujos sobre fondo blanco o liso. Tocá la imagen para elegir el color a quitar.',
      color: 'Color a quitar',
      tolerancia: 'Tolerancia',
      suavizado: 'Bordes suaves',
      recortar: 'Recortar bordes transparentes',
      vista: 'Vista previa',
      cuadros: 'Los cuadros grises son la parte transparente.',
      descargar: 'Descargar PNG',
      descargarTodo: 'Descargar todas',
      quitar: 'Quitar',
      vaciar: 'Quitar todas',
      procesando: 'Procesando…',
      original: 'Original',
      resultado: 'PNG',
      error: 'No se pudo abrir este archivo. Probá con JPG, PNG, WEBP, GIF, BMP o SVG.',
      privacidad: 'Privado: las imágenes se procesan en tu dispositivo y nunca salen de él.',
      limite: 'La IA trabaja mejor cuando el sujeto se distingue bien del fondo. En fotos con muchos elementos puede dejar restos o borrar de más: revisá la vista previa antes de descargar.',
    },
    diseno: {
      titulo: 'Tarifario de diseño 2026 — Aranceles de servicios creativos',
      desc: 'Tarifario de diseño 2026: 118 servicios creativos y digitales con valores por tipo de cliente. Armá tu presupuesto y descargalo en PDF.',
      kicker: 'Herramienta gratuita · Tarifario 2026',
      h1: 'Tarifario de diseño',
      lead: 'Aranceles de servicios creativos y digitales para Argentina. Elegí el tipo de cliente, sumá servicios al presupuesto y descargalo en PDF o imagen.',
      cliente: 'Tipo de cliente',
      clientes: [['0', 'A', 'Empresa'], ['1', 'B', 'PyME'], ['2', 'C', 'Particular']],
      moneda: 'Moneda',
      monedas: [['ARS', '$ ARS'], ['USD', 'US$ USD']],
      dolar: '1 USD = {v}',
      referencias: [
        ['hora', 'Hora de trabajo', 'Diseño, asesoramiento, consultoría o supervisión.'],
        ['adaptacion', 'Adaptaciones', 'Del valor de la pieza original.'],
        ['gremio', 'Gremio', 'Bonificación sugerida para colegas y agencias.'],
        ['anticipo', 'Anticipo', 'Mínimo sugerido para confirmar el trabajo.'],
      ],
      buscar: 'Buscar servicio',
      buscarEjemplo: 'Ej.: logotipo, flyer, web…',
      todos: 'Todos',
      servicios: 'servicios',
      agregar: '+ Agregar',
      agregado: 'Agregado',
      adicional: '{p} % adicional',
      adicionalAyuda: 'Se calcula sobre los servicios web del presupuesto.',
      sinResultados: 'No hay servicios con esa búsqueda.',
      unidades: { Proyecto: 'Proyecto', Pieza: 'Pieza', Unidad: 'Unidad', Mes: 'Mes', 'Página': 'Página', 'Sesión': 'Sesión', Hora: 'Hora' },
      presupuesto: 'Presupuesto',
      vacio: 'Agregá servicios desde el tarifario con "+ Agregar".',
      cantidad: 'Cantidad',
      quitar: 'Quitar',
      adaptacion: 'Adaptación (50 %)',
      gremioCheck: 'Precio de gremio (−20 %)',
      descuento: 'Descuento (%)',
      subtotal: 'Subtotal',
      gremioFila: 'Gremio (−20 %)',
      descuentoFila: 'Descuento ({p} %)',
      total: 'Total',
      anticipoFila: 'Anticipo sugerido (30 %)',
      tituloCampo: 'Título del presupuesto',
      tituloEjemplo: 'Ej.: Identidad y web para Kaizen',
      clienteCampo: 'Cliente',
      notasCampo: 'Notas',
      descripciones: 'Incluir las descripciones de los servicios en el PDF',
      vaciar: 'Vaciar presupuesto',
      sinJs: 'Para armar el presupuesto, activá JavaScript en tu navegador.',
      doc: {
        titulo: 'Presupuesto',
        numero: 'N.º',
        fecha: 'Fecha',
        para: 'Para',
        servicio: 'Servicio',
        importe: 'Importe',
        notas: 'Notas',
        pagina: 'Página {n} de {t}',
        validez: 'Validez: 30 días desde la fecha de emisión.',
        archivo: 'presupuesto-diseno-AIRON',
        fuente: 'Valores de referencia del Tarifario de la Cámara de Diseñadores (septiembre 2026).',
      },
      nota: 'Precios de referencia, estimados y con margen de negociación. No incluyen gastos de materialización (impresión, corte, bordado, colocación, etc.) ni la entrega de archivos editables u originales.',
      idiomaNota: '',
    },
    murales: {
      titulo: 'Murales para marcas y locales',
      desc: 'Murales para locales, oficinas y marcas en Buenos Aires y La Plata: fachadas, interiores, persianas y pintura en vivo, diseñados desde la identidad de cada cliente.',
      kicker: 'Arte urbano · Murales',
      h1: 'Murales con identidad',
      lead: 'Diseñamos y pintamos murales para locales, oficinas y marcas. Cada pieza parte de la identidad de quien la encarga —su logo, sus colores, su historia— para convertir una pared en el mejor cartel del lugar.',
      calcular: 'Calculá el costo ↓',
      verTrabajos: 'Ver trabajos ↓',
      serviciosKicker: 'Qué pintamos',
      serviciosTitulo: 'Del frente al salón',
      servicios: [
        ['Fachadas y exteriores', 'Frentes de locales, medianeras y paredes que se ven desde la calle, de día y de noche.'],
        ['Interiores', 'Salones, barras, oficinas, estudios y habitaciones: el mural como parte de la experiencia del lugar.'],
        ['Persianas y vidrieras', 'Persianas metálicas, vidrieras y carteles pintados a mano que comunican incluso con el local cerrado.'],
        ['Pintura en vivo', 'Live painting en lanzamientos, fiestas, ferias y activaciones de marca.'],
      ],
      laionKicker: 'Dirección artística',
      laionTexto: 'Detrás de las paredes del estudio está LAION, graffiti writer argentino que pinta desde 2008. Su obra personal tiene su propio espacio.',
      laionBoton: 'Conocé a LAION →',
      esteticasKicker: 'Estéticas',
      esteticasTitulo: 'Un lenguaje para cada marca',
      esteticasLead: 'Cada marca pide un lenguaje distinto. Estas son algunas de las estéticas que trabajamos; todas se adaptan al logo, los colores y el espacio de cada cliente.',
      procesoKicker: 'Método',
      procesoTitulo: 'Cómo trabajamos',
      proceso: [
        ['Relevamiento', 'Visitamos el lugar, medimos, sacamos fotos y escuchamos qué querés transmitir.'],
        ['Boceto', 'Diseñamos desde tu identidad y te mostramos el boceto sobre una foto de tu pared. Pintamos recién cuando lo aprobás.'],
        ['Pintura', 'Coordinamos los días de obra con tu horario, con materiales para exterior o interior y una capa final de protección.'],
        ['Registro', 'Te entregamos fotos y video del proceso y del resultado, listos para tus redes.'],
      ],
      casoKicker: 'Caso · La Plata',
      casoDatos: [['≈47 m²', 'de fachada'], ['7', 'jornadas de obra'], ['3', 'colores sobre negro']],
      etapas: ['Antes', 'Proceso', 'Después'],
      verProyecto: 'Ver el proyecto completo →',
      faqKicker: 'Preguntas frecuentes',
      faqTitulo: 'Lo que suelen preguntarnos',
      faq: [
        ['¿Cuánto cuesta un mural?', 'Cada mural se presupuesta a medida: depende de la superficie, la altura, el estado de la pared y el nivel de detalle del diseño. Mandanos medidas aproximadas y una foto, y te pasamos un presupuesto sin compromiso.'],
        ['¿Cuánto tarda?', 'Depende del tamaño y de la complejidad. Como referencia, la fachada de Blend David —casi 47 m²— se pintó en 7 jornadas. El diseño y la aprobación del boceto se hacen antes.'],
        ['¿Tengo que cerrar el local?', 'No necesariamente. Coordinamos los días y horarios de obra con el funcionamiento del lugar.'],
        ['¿Puedo ver el diseño antes?', 'Sí. Siempre te mostramos un boceto sobre una foto de tu pared, y empezamos a pintar cuando lo aprobás.'],
        ['¿Qué materiales usan?', 'Pinturas para exterior o interior según el espacio —látex, aerosol, rodillo y pincel— y una capa final de protección para que el color resista mejor el sol y la lluvia. Los materiales están incluidos en el presupuesto.'],
        ['¿Hacen graffiti?', 'Sí, como una estética más: letras con carácter, color y energía urbana, diseñadas a medida para tu marca y siempre en paredes con autorización de sus dueños.'],
        ['¿En qué zonas trabajan?', 'Tenemos base en Buenos Aires y pintamos en CABA, La Plata y alrededores. Para otras ciudades, escribinos y lo vemos.'],
      ],
      calc: {
        kicker: 'Calculadora',
        titulo: '¿Cuánto cuesta tu mural?',
        lead: 'Una estimación orientativa según el Tarifario Mural 2026 de la comunidad de muralistas de Argentina. Cargá las medidas, elegí las opciones y mirá el resultado al instante.',
        medidas: '1. Medidas de la pared',
        ancho: 'Ancho (m)',
        alto: 'Alto (m)',
        superficie: 'Superficie',
        cliente: '2. Tipo de cliente',
        clientes: [
          ['A', 'Grandes empresas', 'Más de 20 empleados, agencias publicitarias, instituciones o espacios de mayor impacto.'],
          ['B', 'Pymes y comercios', 'Pymes y pequeños comercios, particulares de medianos y grandes ingresos, ONG, instituciones de mediano impacto.'],
          ['C', 'Organizaciones y particulares', 'Organizaciones barriales sin fines de lucro, particulares de pocos y medianos ingresos, espacios de gestión independiente.'],
        ],
        diseno: '3. Tipo de diseño',
        disenos: [
          ['simple', 'Simple', 'Formas planas, pocos colores, letras o fondos.'],
          ['complejo', 'Complejo', 'Figuras, volumen, degradés, mucho detalle.'],
        ],
        boceto: '4. Diseño del mural',
        bocetos: [
          ['propio', 'Boceto propio del artista', 'El diseño se crea desde la identidad del cliente (+10 % a 15 %).'],
          ['adaptar', 'Adaptar un diseño que ya tengo', 'Ajustamos tu diseño al espacio (+3 %).'],
          ['listo', 'Pintar un diseño final que ya tengo', 'Sin costo de diseño.'],
        ],
        extras: '5. Extras',
        evento: 'Es para un evento o una acción publicitaria (+20 %)',
        viaticos: 'Viáticos',
        viaticosAyuda: 'Traslado y comida de quienes pintan. Valor sugerido: viático diario oficial para CABA y GBA (Decreto 208/2026). Podés cambiarlo.',
        jornadasObra: 'Jornadas de obra',
        personas: 'Personas en obra',
        porJornada: 'Viático por persona y jornada ($)',
        resultado: 'Estimación',
        filas: {
          tramo: 'Tramo',
          categoria: 'Categoría aplicada',
          valorM2: 'Valor por m²',
          pintura: 'Honorarios de pintura',
          minimo: 'Se aplica el mínimo del tramo anterior: una pared más grande no puede costar menos que la más grande del tramo previo.',
          evento: 'Evento (+20 %)',
          boceto: 'Boceto (10 % a 15 %)',
          adaptacion: 'Adaptación del diseño (3 %)',
          viaticos: 'Viáticos',
          total: 'Total estimado',
          pago: 'Forma de pago sugerida: 50 % de adelanto y 50 % al terminar.',
        },
        // {de}, {a}, {d}, {h} y {n} se reemplazan en el navegador
        pasaA: 'Para esta superficie, la categoría {de} se cotiza como {a}.',
        tramoDesde: 'de {d} a {h} m²',
        tramoHasta: 'hasta {h} m²',
        jornada: '{n} jornada',
        jornadas: '{n} jornadas',
        vacio: 'Cargá el ancho y el alto de la pared para ver la estimación.',
        mega: 'Más de 500 m² es un megamural: se presupuesta con equipo de producción (honorarios del artista 20 %, producción 15 % y boceto 10 % sobre el costo total de la obra). Escribinos y lo armamos juntos.',
        noIncluye: 'No incluye materiales, elevación (andamio o plataforma), viáticos ni seguros: se suman en el presupuesto final, después del relevamiento.',
        noIncluyeConViaticos: 'No incluye materiales, elevación (andamio o plataforma) ni seguros: se suman en el presupuesto final, después del relevamiento.',
        viaticoDetalle: '{j} × {p} × {m}',
        delTotal: '{p} % del total',
        personaUna: '{n} persona',
        personaVarias: '{n} personas',
        fuente: 'Valores orientativos del Tarifario Mural 2026 de la comunidad de muralistas de Argentina, en pesos argentinos.',
        pedir: 'Pedir presupuesto con estos datos →',
        sinJs: 'Para ver la estimación, activá JavaScript en tu navegador.',
        mensaje: 'Hola, quiero un presupuesto para un mural.',
        proyecto: 'Cliente o proyecto (opcional)',
        proyectoEjemplo: 'Ej.: Blend David — fachada',
        descargarPdf: 'Descargar PDF',
        descargarImagen: 'Descargar imagen',
        generando: 'Generando…',
        doc: {
          titulo: 'Presupuesto orientativo',
          mural: 'Mural',
          fecha: 'Fecha',
          numero: 'N.º',
          para: 'Para',
          datos: 'Datos del mural',
          detalle: 'Detalle de honorarios',
          medidas: 'Medidas',
          superficie: 'Superficie',
          cliente: 'Tipo de cliente',
          diseno: 'Tipo de diseño',
          boceto: 'Diseño',
          extras: 'Extras',
          ninguno: 'Ninguno',
          validez: 'Validez: 30 días desde la fecha de emisión.',
          archivo: 'presupuesto-mural-AIRON',
        },
      },
      pagina: {
        titulo: 'Calculadora de murales 2026 — Tarifario Mural Argentina',
        desc: 'Calculadora gratuita del costo de un mural según el Tarifario Mural 2026 de Argentina. Cargá medidas y opciones, y descargá el presupuesto en PDF.',
        kicker: 'Herramienta gratuita · Tarifario Mural 2026',
        h1: 'Calculadora de murales',
        lead: 'Calculá cuánto cobrar (o cuánto cuesta) un mural según el Tarifario Mural 2026 de la comunidad de muralistas de Argentina. Cargá las medidas, elegí las opciones y descargá el presupuesto en PDF o imagen.',
        compartir: 'Link directo para compartir la calculadora',
        muralesKicker: 'AIRON Studio',
        muralesTitulo: '¿Buscás quién pinte tu mural?',
        muralesTexto: 'Diseñamos y pintamos murales para locales, oficinas y marcas, desde la identidad de cada cliente.',
        muralesBoton: 'Conocé nuestros murales →',
      },
      nav: 'Murales',
      ctaProyecto: '¿Querés un mural así para tu marca?',
      botonProyecto: 'Pedí tu mural',
    },
    pie: ['Buenos Aires, Argentina', 'Diseño multimedial desde 2015'],
    publicidad: {
      aria: 'Publicidad',
      kicker: 'Publicidad',
      titulo: 'Marcas que acompañan',
      cta: 'Anunciá tu marca acá',
      ejemplo: 'Espacio disponible para tu marca',
      abre: 'se abre en otra pestaña',
      mensaje: 'Hola, me interesa anunciar mi marca en la marquesina de aironstudio.com.ar. ¿Me pasan información?',
    },
    heroKicker: ['Estudio de diseño multimedial', 'Buenos Aires · desde 2015'],
    heroLead: 'Branding, diseño gráfico, diseño web, sistemas de gestión, gráfica musical, motion, arte urbano y fotografía analógica.',
    verProyectos: 'Ver proyectos →', hablemos: 'Contacto', disciplinasAria: 'Disciplinas',
    indice: 'Índice', verGrilla: 'Ver con imágenes y filtros →',
    serviciosKicker: 'Servicios', queHacemos: 'Qué hacemos', ctaInicio: '¿Tenés un proyecto en mente?', escribinos: 'Escribinos →',
    numerosTitulo: 'El estudio en números',
    numeros: ['Años de estudio', 'Proyectos en el portafolio', 'Identidades de marca', 'Marcas y medios', 'Nuestro mural más grande', 'Disciplinas creativas'],
    portafolio: 'Portafolio', proyectos: 'Proyectos', todos: 'Todos', filtrarAria: 'Filtrar por categoría', proyectosCont: 'proyectos', sinProyectos: 'Estamos preparando los proyectos de esta categoría.', sinProyectosCta: 'Contanos qué necesitás →',
    listadoLead: 'Identidad, gráfica, diseño web, sistemas de gestión, motion, arte urbano y fotografía. Filtrá por categoría para ver cada disciplina.',
    listadoDesc: 'Portafolio de AIRON Studio: identidad de marca, gráfica, diseño web, sistemas de gestión, gráfica musical, motion, arte urbano y fotografía.',
    portadaDe: (t) => `Portada del proyecto ${t}`, imagenDe: (t, k, n) => `${t} — imagen ${k} de ${n}`, ampliar: 'Ampliar', muro: { titulo: 'Muro de marcas', texto: 'Logos diseñados para artistas, comercios, empresas e instituciones. Filtrá por rubro y tocá cada marca para verla en grande.', todas: 'Todas', marcas: 'marcas', rubros: 'rubros', verCaso: 'Ver caso', filtrar: 'Filtrar marcas por rubro' },
    videoDe: (t) => `Video del proyecto ${t}`, volver: '← Volver a proyectos', fichaAria: 'Ficha del proyecto', imagenesAria: 'Imágenes del proyecto',
    ctaProyecto: '¿Querés ver todas las imágenes?', verBehance: 'Ver en Behance', ctaSinBehance: '¿Tu marca es la próxima?', botonSinBehance: 'Pedí tu marca →', otros: 'Otros proyectos', anterior: '← Anterior', siguiente: 'Siguiente →',
    proyectoDe: 'Proyecto de AIRON Studio.',
    descProyecto: (cats) => `${cats} por AIRON Studio, estudio de diseño multimedial en Buenos Aires.`,
    visor: { aria: 'Visor de imágenes', cerrar: 'Cerrar', ant: 'Imagen anterior', sig: 'Imagen siguiente' },
    estudioTitulo: 'Nosotros', elEstudio: 'El estudio', estudioH1: 'Diseño con mirada integral',
    estudioDesc: 'AIRON Studio: estudio de diseño multimedial fundado en 2015 en Buenos Aires, liderado por Matías Gonzalez, con un equipo de diseñadores, ilustradores, programadores, muralistas y más.',
    cargoEstudio: 'Fundador y director del estudio',
    equipoKicker: 'Equipo',
    equipoTitulo: 'Un equipo para cada proyecto',
    equipoTexto: 'AIRON Studio reúne profesionales de distintas disciplinas. Según lo que necesita cada marca armamos el equipo justo, y Matías Gonzalez coordina el proyecto de principio a fin: es tu contacto directo en cada etapa.',
    equipo: [
      ['Dirección creativa', 'Matías Gonzalez, fundador del estudio. Define el concepto, coordina al equipo y cuida que cada pieza cumpla su objetivo.'],
      ['Diseño gráfico y de marca', 'Identidades, logos, manuales de marca, packaging y piezas gráficas.'],
      ['Ilustración', 'Personajes, ilustraciones editoriales y para redes, y bocetos para murales.'],
      ['Muralismo y arte urbano', 'Artistas que pintan fachadas, interiores y persianas, en cualquier escala.'],
      ['Desarrollo web', 'Programadores que construyen sitios rápidos, seguros y fáciles de mantener.'],
      ['Diseño UX/UI', 'Interfaces claras para webs y aplicaciones, pensadas para quien las usa.'],
      ['Community management', 'Planificación de contenidos, gestión de redes y comunicación con tu comunidad.'],
      ['Motion y video', 'Animación, edición y piezas audiovisuales para redes, TV y eventos.'],
      ['Fotografía', 'Producto, retrato y fotografía analógica para marcas y artistas.'],
      ['Redacción y contenidos', 'Textos para webs, redes y campañas, con el tono de cada marca.'],
      ['Producción gráfica', 'Coordinación de imprenta, ploteo y cartelería para que todo salga igual que en pantalla.'],
    ],
    estudioTextos: [
      `Estudio de diseño multimedial fundado en ${FUNDACION}, con base en Buenos Aires y liderado por Matías Gonzalez, Diseñador en Comunicación Visual recibido en la Universidad Nacional de La Plata.`,
      'Desarrollamos proyectos que combinan estrategia, diseño y comunicación, creando identidades y experiencias visuales capaces de conectar marcas con sus públicos.',
      'Trabajamos en la intersección entre branding, diseño gráfico, diseño web, comunicación digital, arte urbano y fotografía analógica, con una mirada integral, contemporánea y experimental.',
    ],
    retrato: 'Retrato de Matías Gonzalez, fundador de AIRON Studio', cargo: 'Diseñador en Comunicación Visual',
    disciplinas: 'Disciplinas', marcasTitulo: 'Marcas y medios con los que trabajamos', ctaEstudio: 'Trabajemos juntos',
    procesoKicker: 'Método', procesoTitulo: 'Cómo trabajamos',
    proceso: [
      ['Brief', 'Escuchamos: objetivos, público, plazos y presupuesto. Todo arranca con una buena pregunta.'],
      ['Concepto', 'Investigamos y definimos la idea y la dirección visual del proyecto.'],
      ['Diseño', 'Desarrollamos, ajustamos con tu devolución y refinamos cada detalle.'],
      ['Entrega', 'Archivos finales listos para usar y acompañamiento en la implementación.'],
    ],
    clientesKicker: 'Confiaron en nosotros', verCursor: 'Ver',
    contactoTitulo: 'Contacto', contactoKicker: 'Contanos tu idea', contactoH1: 'Contacto.',
    contactoLead: 'Una marca, piezas gráficas, una web, motion, un mural o lo que tengas en mente: escribinos y te respondemos a la brevedad.',
    contactoDesc: 'Contanos tu proyecto: marca, piezas gráficas, web, motion, mural o lo que tengas en mente.',
    asunto: 'Nuevo mensaje desde la web de AIRON Studio', noCompletar: 'No completar este campo',
    campos: { nombre: 'Nombre', email: 'Email', tipo: 'Tipo de proyecto', mensaje: 'Mensaje' },
    opciones: ['Branding e identidad', 'Diseño gráfico', 'Diseño web', 'Sistema de gestión', 'Gráfica musical', 'Motion', 'Mural / arte urbano', 'Fotografía', 'Publicidad en la web', 'Otro'],
    enviar: 'Enviar mensaje →', privacidad: 'Tus datos solo se usan para responderte.',
    gracias: { titulo: 'Mensaje enviado', h1: '¡Gracias!', texto: 'Recibimos tu mensaje. Te vamos a responder a la brevedad.' },
    volverInicio: 'Volver al inicio',
    categorias: { branding: 'Branding', aplicada: 'Gráfica aplicada', web: 'Diseño web', sistemas: 'Sistemas de gestión', musical: 'Gráfica musical', motion: 'Motion', urbano: 'Arte urbano', foto: 'Fotografía' },
    servicios: [
      ['branding', 'Identidad & branding', 'Logos, sistemas visuales y manuales de marca.'],
      ['aplicada', 'Diseño gráfico', 'Catálogos, flyers, piezas impresas y ploteo vehicular.'],
      ['web', 'Diseño web', 'Sitios a medida: rápidos, seguros y pensados para el celular.'],
      ['sistemas', 'Sistemas de gestión', 'Plataformas a medida para administrar clientes, turnos, stock y ventas.'],
      ['', 'Comunicación digital', 'Redes sociales y campañas.'],
      ['musical', 'Gráfica musical', 'Portadas, banners y covers para Spotify.'],
      ['motion', 'Motion graphics', 'Animación para TV y redes.'],
      ['urbano', 'Arte urbano', 'Murales y graffiti que transforman espacios.'],
      ['foto', 'Fotografía analógica', 'Fotografía en película, con mirada de autor.'],
    ],
  },
  en: {
    htmlLang: 'en', ogLocale: 'en_US', nombreIdioma: 'English',
    lema: 'Design that builds brands, ideas and experiences',
    descripcion: 'Multimedia design studio based in Buenos Aires since 2015. Branding, graphic design, web design, music artwork, motion, street art and analog photography.',
    saltar: 'Skip to content', inicioAria: 'AIRON Studio — Home', abrirMenu: 'Open menu', navPrincipal: 'Main', redes: 'Social media',
    nav: { inicio: 'Home', proyectos: 'Work', estudio: 'About us', contacto: 'Contact' },
    idiomaAria: 'Language', temaOscuro: 'Switch to dark mode',
    // ---------- rates hub and design rate guide ----------
    tarifarios: {
      nav: 'Tools',
      titulo: 'Free tools for creatives',
      desc: 'Free tools for creatives: mural rates, design rates, Unicode text generator, case converter and image to PNG converter.',
      kicker: 'Free · No sign-up',
      h1: 'Tools',
      lead: 'Free tools for designers, muralists and brands: estimate and quote jobs, generate special fonts for social media and convert images to PNG. Everything runs in your browser.',
      herramientas: [
        ['calculadora', 'Mural rates', 'Estimate the cost of a mural per m² based on the 2026 Mural Rate Guide by Argentina’s muralist community: measurements, client type, design, events and travel.', 'Estimate a mural →'],
        ['tarifarioDiseno', 'Design rates', '118 design services in 15 areas —identity, web, social media, editorial, motion and more— with rates by client type. Build an estimate by adding services.', 'Build an estimate →'],
        ['unicode', 'Unicode fonts', 'Type any text and copy it in bold, italic, gothic, bubbles and 20+ styles for Instagram, TikTok or WhatsApp bios, posts and names.', 'Create text →'],
        ['mayusculas', 'Case converter', 'Paste any text and switch it to UPPERCASE, lowercase, sentence case, title case or Each Word, then copy it in one tap. It also strips accents for file names and usernames.', 'Convert text →'],
        ['png', 'Convert to PNG', 'Turn JPG, WEBP, GIF or SVG images into PNG, resize them, remove a solid background to make it transparent and trim the edges. Nothing gets uploaded.', 'Convert images →'],
      ],
    },
    unicode: {
      titulo: 'Unicode fonts: text generator for Instagram and social media',
      desc: 'Free Unicode text generator: type your text and copy it in bold, italic, gothic, bubbles and more styles for Instagram, TikTok and WhatsApp.',
      kicker: 'Free tool',
      h1: 'Unicode fonts',
      lead: 'Type some text and copy it in the style you like. It works in bios, posts, profile names and messages on Instagram, TikTok, WhatsApp, X and more, because they aren’t fonts: they’re special characters.',
      campo: 'Your text',
      ejemplo: 'Type your text here',
      inicial: 'AIRON Studio',
      copiar: 'Copy',
      copiado: 'Copied ✓',
      limpiar: 'Clear',
      estilos: 'styles',
      consejoTitulo: 'Keep in mind',
      consejos: [
        'Screen readers (used by blind people) may read these characters oddly: use them to highlight, not for long texts.',
        'Instagram and Google search don’t always find them: keep your name in regular letters somewhere.',
        'Some styles have no accents or numbers of their own: they’re shown as close as possible.',
      ],
      nombres: {
        negrita: 'Bold', cursiva: 'Italic', negritaCursiva: 'Bold italic', sans: 'Sans', sansNegrita: 'Sans bold', sansCursiva: 'Sans italic', sansNegritaCursiva: 'Sans bold italic', escritura: 'Script', escrituraNegrita: 'Bold script', gotica: 'Gothic', goticaNegrita: 'Bold gothic', doble: 'Double-struck', mono: 'Monospace', ancha: 'Wide', circulos: 'Circles', circulosNegros: 'Black circles', cuadros: 'Squares', cuadrosNegros: 'Black squares', versalitas: 'Small caps', superindice: 'Superscript', invertida: 'Upside down', tachada: 'Strikethrough', subrayada: 'Underline', dobleSubrayado: 'Double underline', barrada: 'Slashed',
      },
    },
    mayusculas: {
      titulo: 'Case converter: uppercase, lowercase, sentence and title case',
      desc: 'Free online case converter: switch your text to UPPERCASE, lowercase, sentence case, title case or Each Word, remove accents and copy it in one tap.',
      kicker: 'Free tool',
      h1: 'Case converter',
      lead: 'Paste or type any text and copy it in the format you need: all caps, all lowercase, a capital after every full stop or a capital on every word. It runs in your browser: your text is not sent anywhere.',
      campo: 'Your text',
      ejemplo: 'Paste or type your text here',
      inicial: 'hello. THIS IS A SAMPLE text for AIRON studio.\nwant to try yours?',
      copiar: 'Copy',
      copiado: 'Copied ✓',
      limpiar: 'Clear',
      cuenta: { caracteres: 'characters', palabras: 'words', lineas: 'lines' },
      consejoTitulo: 'When to use each one',
      consejos: [
        'Sentence case: for running text, descriptions and posts. Check proper names afterwards, as they end up in lowercase.',
        'Title case: for headlines, books or song titles. Short words like “of”, “the” or “and” stay in lowercase.',
        'No accents: for file and folder names, usernames or emails, where accents often cause trouble.',
      ],
      modos: {
        oracion: 'Sentence case',
        minusculas: 'lowercase',
        mayusculas: 'UPPERCASE',
        palabras: 'Each Word',
        titulo: 'Title Case',
        invertir: 'iNVERSE',
        alternar: 'aLtErNaTe',
        sinTildes: 'No accents',
      },
    },
    png: {
      titulo: 'Convert image to PNG online for free — AI background remover',
      desc: 'Convert JPG, WEBP, GIF or SVG images to PNG for free, remove the background with AI or a solid color to make it transparent, resize them and trim edges. No uploads.',
      kicker: 'Free tool',
      h1: 'Convert to PNG',
      lead: 'Turn your images into PNG, with a transparent background if you need it. Everything is processed in your browser: your files are never uploaded to any server.',
      soltar: 'Drop your images here',
      o: 'or',
      elegir: 'Choose files',
      formatos: 'JPG, WEBP, GIF, BMP, SVG or PNG · You can add several at once.',
      ajustes: 'Settings',
      tamano: 'Size',
      tamanos: [['original', 'Original'], ['ancho', 'Max width']],
      anchoMax: 'Max width (px)',
      ia: 'Remove background with AI',
      iaAyuda: 'For photos of people, animals or objects. The AI runs in your browser: the first time it downloads about 19 MB and then stays cached.',
      iaDescargando: 'Downloading the AI (about 19 MB, first time only)…',
      iaTrabajando: 'The AI is removing the background…',
      iaLista: 'AI ready. If some background is left around the edges, add “Remove solid background”.',
      iaError: 'The AI couldn’t run in this browser. Try an up-to-date Chrome, Edge, Firefox or Safari.',
      fondo: 'Remove solid background',
      fondoAyuda: 'Great for logos, signatures or drawings on a white or plain background. Tap the image to pick the color to remove.',
      color: 'Color to remove',
      tolerancia: 'Tolerance',
      suavizado: 'Soft edges',
      recortar: 'Trim transparent edges',
      vista: 'Preview',
      cuadros: 'The grey checkerboard is the transparent area.',
      descargar: 'Download PNG',
      descargarTodo: 'Download all',
      quitar: 'Remove',
      vaciar: 'Remove all',
      procesando: 'Processing…',
      original: 'Original',
      resultado: 'PNG',
      error: 'This file couldn’t be opened. Try JPG, PNG, WEBP, GIF, BMP or SVG.',
      privacidad: 'Private: images are processed on your device and never leave it.',
      limite: 'The AI works best when the subject stands out clearly from the background. In busy photos it may leave bits behind or remove too much: check the preview before downloading.',
    },
    diseno: {
      titulo: 'Design rate guide 2026 — Creative services fees in Argentina',
      desc: '2026 design rate guide: 118 creative and digital services with fees by client type. Build your estimate and download it as a PDF.',
      kicker: 'Free tool · 2026 rate guide',
      h1: 'Design rates',
      lead: 'Fees for creative and digital services in Argentina. Pick the client type, add services to the estimate and download it as a PDF or image.',
      cliente: 'Client type',
      clientes: [['0', 'A', 'Company'], ['1', 'B', 'SME'], ['2', 'C', 'Individual']],
      moneda: 'Currency',
      monedas: [['ARS', '$ ARS'], ['USD', 'US$ USD']],
      dolar: '1 USD = {v}',
      referencias: [
        ['hora', 'Working hour', 'Design, advice, consulting or supervision.'],
        ['adaptacion', 'Adaptations', 'Of the original piece’s fee.'],
        ['gremio', 'Trade', 'Suggested discount for fellow designers and agencies.'],
        ['anticipo', 'Deposit', 'Suggested minimum to confirm the job.'],
      ],
      buscar: 'Search services',
      buscarEjemplo: 'E.g.: logotipo, flyer, web…',
      todos: 'All',
      servicios: 'services',
      agregar: '+ Add',
      agregado: 'Added',
      adicional: '{p}% extra',
      adicionalAyuda: 'Calculated on the web services in the estimate.',
      sinResultados: 'No services match your search.',
      unidades: { Proyecto: 'Project', Pieza: 'Piece', Unidad: 'Unit', Mes: 'Month', 'Página': 'Page', 'Sesión': 'Session', Hora: 'Hour' },
      presupuesto: 'Estimate',
      vacio: 'Add services from the rate guide with "+ Add".',
      cantidad: 'Quantity',
      quitar: 'Remove',
      adaptacion: 'Adaptation (50%)',
      gremioCheck: 'Trade price (−20%)',
      descuento: 'Discount (%)',
      subtotal: 'Subtotal',
      gremioFila: 'Trade (−20%)',
      descuentoFila: 'Discount ({p}%)',
      total: 'Total',
      anticipoFila: 'Suggested deposit (30%)',
      tituloCampo: 'Estimate title',
      tituloEjemplo: 'E.g.: Identity and website for Kaizen',
      clienteCampo: 'Client',
      notasCampo: 'Notes',
      descripciones: 'Include service descriptions in the PDF',
      vaciar: 'Clear estimate',
      sinJs: 'To build the estimate, please enable JavaScript in your browser.',
      doc: {
        titulo: 'Estimate',
        numero: 'No.',
        fecha: 'Date',
        para: 'For',
        servicio: 'Service',
        importe: 'Amount',
        notas: 'Notes',
        pagina: 'Page {n} of {t}',
        validez: 'Valid for 30 days from the issue date.',
        archivo: 'design-estimate-AIRON',
        fuente: 'Reference rates from the Designers’ Chamber Rate Guide (September 2026).',
      },
      nota: 'Reference prices, estimated and open to negotiation. They don’t include production costs (printing, cutting, embroidery, installation, etc.) or delivery of editable/original files.',
      idiomaNota: 'Service names and descriptions are shown in Spanish, as in the original rate guide.',
    },
    murales: {
      titulo: 'Murals for brands and venues',
      desc: 'Murals for stores, offices and brands in Buenos Aires and La Plata: façades, interiors, shutters and live painting, designed from each client’s identity.',
      kicker: 'Street art · Murals',
      h1: 'Murals with identity',
      lead: 'We design and paint murals for stores, offices and brands. Every piece starts from the identity of whoever commissions it —their logo, their colors, their story— to turn a wall into the best sign in the place.',
      calcular: 'Estimate the cost ↓',
      verTrabajos: 'See our work ↓',
      serviciosKicker: 'What we paint',
      serviciosTitulo: 'From the street to the room',
      servicios: [
        ['Façades and exteriors', 'Store fronts, side walls and walls seen from the street, by day and by night.'],
        ['Interiors', 'Dining rooms, bars, offices, studios and bedrooms: the mural as part of the experience of the place.'],
        ['Shutters and windows', 'Metal shutters, shop windows and hand-painted signs that keep talking even when the store is closed.'],
        ['Live painting', 'Live painting at launches, parties, fairs and brand activations.'],
      ],
      laionKicker: 'Art direction',
      laionTexto: 'Behind the studio’s walls is LAION, an Argentine graffiti writer painting since 2008. His personal work has a space of its own.',
      laionBoton: 'Meet LAION →',
      esteticasKicker: 'Styles',
      esteticasTitulo: 'A language for every brand',
      esteticasLead: 'Every brand calls for a different language. These are some of the styles we work in; all of them adapt to each client’s logo, colors and space.',
      procesoKicker: 'Method',
      procesoTitulo: 'How we work',
      proceso: [
        ['Site visit', 'We visit the place, measure, take photos and listen to what you want to say.'],
        ['Sketch', 'We design from your identity and show you the sketch on a photo of your wall. We only start painting once you approve it.'],
        ['Painting', 'We schedule the work around your opening hours, with interior or exterior materials and a final protective coat.'],
        ['Record', 'You get photos and video of the process and the result, ready for your social media.'],
      ],
      casoKicker: 'Case study · La Plata',
      casoDatos: [['≈47 m²', 'of façade'], ['7', 'working days'], ['3', 'colors on black']],
      etapas: ['Before', 'In progress', 'After'],
      verProyecto: 'See the full project →',
      faqKicker: 'FAQ',
      faqTitulo: 'What people usually ask',
      faq: [
        ['How much does a mural cost?', 'Every mural is quoted individually: it depends on the surface, the height, the state of the wall and the level of detail of the design. Send us approximate measurements and a photo and we’ll get back to you with a no-obligation quote.'],
        ['How long does it take?', 'It depends on size and complexity. For reference, the Blend David façade —almost 47 m²— was painted in 7 working days. Design and sketch approval happen beforehand.'],
        ['Do I have to close my store?', 'Not necessarily. We schedule working days and hours around how the place runs.'],
        ['Can I see the design first?', 'Yes. We always show you a sketch on a photo of your wall, and we start painting once you approve it.'],
        ['What materials do you use?', 'Interior or exterior paints depending on the space —latex, spray paint, roller and brush— and a final protective coat so the colors hold up better against sun and rain. Materials are included in the quote.'],
        ['Do you do graffiti?', 'Yes, as one more style: lettering with character, color and urban energy, designed for your brand and always on walls authorized by their owners.'],
        ['Where do you work?', 'We are based in Buenos Aires and paint in the city, La Plata and the surrounding area. For other cities, get in touch and we’ll figure it out.'],
      ],
      calc: {
        kicker: 'Calculator',
        titulo: 'How much does your mural cost?',
        lead: 'An approximate estimate based on the 2026 Mural Rate Guide by Argentina’s muralist community. Enter the measurements, pick the options and see the result instantly.',
        medidas: '1. Wall measurements',
        ancho: 'Width (m)',
        alto: 'Height (m)',
        superficie: 'Surface',
        cliente: '2. Client type',
        clientes: [
          ['A', 'Large companies', 'More than 20 employees, advertising agencies, high-impact institutions or spaces.'],
          ['B', 'SMEs and stores', 'SMEs and small stores, middle- and high-income individuals, NGOs, medium-impact institutions.'],
          ['C', 'Organizations and individuals', 'Non-profit community organizations, low- and middle-income individuals, independent spaces.'],
        ],
        diseno: '3. Design type',
        disenos: [
          ['simple', 'Simple', 'Flat shapes, few colors, lettering or backgrounds.'],
          ['complejo', 'Complex', 'Figures, volume, gradients, lots of detail.'],
        ],
        boceto: '4. Mural design',
        bocetos: [
          ['propio', 'Original sketch by the artist', 'The design is created from the client’s identity (+10% to 15%).'],
          ['adaptar', 'Adapt a design I already have', 'We fit your design to the space (+3%).'],
          ['listo', 'Paint a final design I already have', 'No design fee.'],
        ],
        extras: '5. Extras',
        evento: 'It’s for an event or an advertising action (+20%)',
        viaticos: 'Travel and meals',
        viaticosAyuda: 'Transport and meals for the painting crew. Suggested value: official daily allowance for Buenos Aires metro area (Decree 208/2026). You can change it.',
        jornadasObra: 'Working days',
        personas: 'People on site',
        porJornada: 'Allowance per person per day (ARS)',
        resultado: 'Estimate',
        filas: {
          tramo: 'Size range',
          categoria: 'Category applied',
          valorM2: 'Rate per m²',
          pintura: 'Painting fees',
          minimo: 'The previous range’s minimum applies: a larger wall can’t cost less than the largest wall of the previous range.',
          evento: 'Event (+20%)',
          boceto: 'Sketch (10% to 15%)',
          adaptacion: 'Design adaptation (3%)',
          viaticos: 'Travel and meals',
          total: 'Estimated total',
          pago: 'Suggested payment: 50% upfront and 50% on completion.',
        },
        // {de}, {a}, {d}, {h} and {n} are replaced in the browser
        pasaA: 'For this surface, category {de} is quoted as {a}.',
        tramoDesde: '{d} to {h} m²',
        tramoHasta: 'up to {h} m²',
        jornada: '{n} day',
        jornadas: '{n} days',
        vacio: 'Enter the width and height of the wall to see the estimate.',
        mega: 'Over 500 m² is a mega-mural: it’s quoted with a production team (artist fees 20%, production 15% and sketch 10% of the total cost of the work). Get in touch and we’ll put it together.',
        noIncluye: 'Materials, lifting equipment (scaffolding or platform), travel and insurance are not included: they’re added to the final quote after the site visit.',
        noIncluyeConViaticos: 'Materials, lifting equipment (scaffolding or platform) and insurance are not included: they’re added to the final quote after the site visit.',
        viaticoDetalle: '{j} × {p} × {m}',
        delTotal: '{p}% of the total',
        personaUna: '{n} person',
        personaVarias: '{n} people',
        fuente: 'Approximate values from the 2026 Mural Rate Guide by Argentina’s muralist community, in Argentine pesos.',
        pedir: 'Request a quote with these details →',
        sinJs: 'To see the estimate, please enable JavaScript in your browser.',
        mensaje: 'Hi, I’d like a quote for a mural.',
        proyecto: 'Client or project (optional)',
        proyectoEjemplo: 'E.g.: Blend David — façade',
        descargarPdf: 'Download PDF',
        descargarImagen: 'Download image',
        generando: 'Generating…',
        doc: {
          titulo: 'Estimate',
          mural: 'Mural',
          fecha: 'Date',
          numero: 'No.',
          para: 'For',
          datos: 'Mural details',
          detalle: 'Fee breakdown',
          medidas: 'Measurements',
          superficie: 'Surface',
          cliente: 'Client type',
          diseno: 'Design type',
          boceto: 'Design',
          extras: 'Extras',
          ninguno: 'None',
          validez: 'Valid for 30 days from the issue date.',
          archivo: 'mural-estimate-AIRON',
        },
      },
      pagina: {
        titulo: 'Mural cost calculator 2026 — Argentina Mural Rate Guide',
        desc: 'Free mural cost calculator based on Argentina’s 2026 Mural Rate Guide. Enter measurements and options, and download the estimate as a PDF.',
        kicker: 'Free tool · 2026 Mural Rate Guide',
        h1: 'Mural calculator',
        lead: 'Work out how much to charge for (or how much it costs to commission) a mural, based on the 2026 Mural Rate Guide by Argentina’s muralist community. Enter the measurements, pick the options and download the estimate as a PDF or image.',
        compartir: 'Direct link to share the calculator',
        muralesKicker: 'AIRON Studio',
        muralesTitulo: 'Looking for someone to paint your mural?',
        muralesTexto: 'We design and paint murals for stores, offices and brands, starting from each client’s identity.',
        muralesBoton: 'See our murals →',
      },
      nav: 'Murals',
      ctaProyecto: 'Want a mural like this for your brand?',
      botonProyecto: 'Get your mural',
    },
    pie: ['Buenos Aires, Argentina', 'Multimedia design since 2015'],
    publicidad: {
      aria: 'Advertising',
      kicker: 'Advertising',
      titulo: 'Brands that support us',
      cta: 'Advertise your brand here',
      ejemplo: 'Space available for your brand',
      abre: 'opens in a new tab',
      mensaje: 'Hi, I’m interested in advertising my brand on the aironstudio.com.ar banner. Could you send me more information?',
    },
    heroKicker: ['Multimedia design studio', 'Buenos Aires · since 2015'],
    heroLead: 'Branding, graphic design, web design, management systems, music artwork, motion, street art and analog photography.',
    verProyectos: 'See our work →', hablemos: 'Contact', disciplinasAria: 'Disciplines',
    indice: 'Index', verGrilla: 'Browse with images and filters →',
    serviciosKicker: 'Services', queHacemos: 'What we do', ctaInicio: 'Have a project in mind?', escribinos: 'Get in touch →',
    numerosTitulo: 'The studio in numbers',
    numeros: ['Years as a studio', 'Projects in the portfolio', 'Brand identities', 'Brands and media', 'Our largest mural', 'Creative disciplines'],
    portafolio: 'Portfolio', proyectos: 'Work', todos: 'All', filtrarAria: 'Filter by category', proyectosCont: 'projects', sinProyectos: 'We are preparing the projects in this category.', sinProyectosCta: 'Tell us what you need →',
    listadoLead: 'Identity, graphic design, web, management systems, motion, street art and photography. Filter by category to explore each discipline.',
    listadoDesc: 'AIRON Studio portfolio: brand identity, graphic design, web design, management systems, music artwork, motion, street art and photography.',
    portadaDe: (t) => `Cover of the project ${t}`, imagenDe: (t, k, n) => `${t} — image ${k} of ${n}`, ampliar: 'Enlarge', muro: { titulo: 'Brand wall', texto: 'Logos designed for artists, shops, companies and institutions. Filter by industry and tap any brand to see it large.', todas: 'All', marcas: 'brands', rubros: 'industries', verCaso: 'View case', filtrar: 'Filter brands by industry' },
    videoDe: (t) => `Video of the project ${t}`, volver: '← Back to work', fichaAria: 'Project details', imagenesAria: 'Project images',
    ctaProyecto: 'Want to see every image?', verBehance: 'View on Behance', ctaSinBehance: 'Is your brand next?', botonSinBehance: 'Get your brand →', otros: 'More projects', anterior: '← Previous', siguiente: 'Next →',
    proyectoDe: 'A project by AIRON Studio.',
    descProyecto: (cats) => `${cats} by AIRON Studio, a multimedia design studio based in Buenos Aires.`,
    visor: { aria: 'Image viewer', cerrar: 'Close', ant: 'Previous image', sig: 'Next image' },
    estudioTitulo: 'About us', elEstudio: 'The studio', estudioH1: 'Design with an all-round vision',
    estudioDesc: 'AIRON Studio: a multimedia design studio founded in 2015 in Buenos Aires, led by Matías Gonzalez, with a team of designers, illustrators, developers, muralists and more.',
    cargoEstudio: 'Founder and studio director',
    equipoKicker: 'Team',
    equipoTitulo: 'A team for every project',
    equipoTexto: 'AIRON Studio brings together professionals from different disciplines. We build the right team for what each brand needs, and Matías Gonzalez leads the project from start to finish: he is your direct contact at every stage.',
    equipo: [
      ['Creative direction', 'Matías Gonzalez, founder of the studio. He defines the concept, leads the team and makes sure every piece meets its goal.'],
      ['Graphic and brand design', 'Identities, logos, brand guidelines, packaging and graphic pieces.'],
      ['Illustration', 'Characters, editorial and social media illustrations, and mural sketches.'],
      ['Murals and street art', 'Artists who paint façades, interiors and shutters, at any scale.'],
      ['Web development', 'Developers who build fast, secure and easy-to-maintain websites.'],
      ['UX/UI design', 'Clear interfaces for websites and apps, designed for the people who use them.'],
      ['Community management', 'Content planning, social media management and communication with your community.'],
      ['Motion and video', 'Animation, editing and audiovisual pieces for social media, TV and events.'],
      ['Photography', 'Product, portrait and analog photography for brands and artists.'],
      ['Copywriting and content', 'Copy for websites, social media and campaigns, in each brand’s voice.'],
      ['Print production', 'We coordinate printing, vinyl and signage so everything turns out just like on screen.'],
    ],
    estudioTextos: [
      `A multimedia design studio founded in ${FUNDACION}, based in Buenos Aires and led by Matías Gonzalez, a Visual Communication Designer graduated from the National University of La Plata.`,
      'We develop projects that combine strategy, design and communication, creating identities and visual experiences that connect brands with their audiences.',
      'We work where branding, graphic design, web design, digital communication, street art and analog photography meet, with an all-round, contemporary and experimental approach.',
    ],
    retrato: 'Portrait of Matías Gonzalez, founder of AIRON Studio', cargo: 'Visual Communication Designer',
    disciplinas: 'Disciplines', marcasTitulo: 'Brands and media we have worked with', ctaEstudio: "Let's work together",
    procesoKicker: 'Method', procesoTitulo: 'How we work',
    proceso: [
      ['Brief', 'We listen: goals, audience, timeline and budget. Everything starts with a good question.'],
      ['Concept', 'We research and define the idea and the visual direction of the project.'],
      ['Design', 'We develop, refine with your feedback and polish every detail.'],
      ['Delivery', 'Final files ready to use, and support during implementation.'],
    ],
    clientesKicker: 'They trusted us', verCursor: 'View',
    contactoTitulo: 'Contact', contactoKicker: 'Tell us your idea', contactoH1: 'Contact.',
    contactoLead: "A brand, graphic pieces, a website, motion, a mural or whatever you have in mind: write to us and we'll get back to you shortly.",
    contactoDesc: 'Tell us about your project: a brand, graphic pieces, a website, motion, a mural or whatever you have in mind.',
    asunto: 'New message from the AIRON Studio website (EN)', noCompletar: 'Do not fill in this field',
    campos: { nombre: 'Name', email: 'Email', tipo: 'Project type', mensaje: 'Message' },
    opciones: ['Branding and identity', 'Graphic design', 'Web design', 'Management system', 'Music artwork', 'Motion', 'Mural / street art', 'Photography', 'Advertising on the site', 'Other'],
    enviar: 'Send message →', privacidad: 'Your details are only used to reply to you.',
    gracias: { titulo: 'Message sent', h1: 'Thank you!', texto: "We received your message. We'll get back to you shortly." },
    volverInicio: 'Back to home',
    categorias: { branding: 'Branding', aplicada: 'Graphic design', web: 'Web design', sistemas: 'Management systems', musical: 'Music artwork', motion: 'Motion', urbano: 'Street art', foto: 'Photography' },
    servicios: [
      ['branding', 'Identity & branding', 'Logos, visual systems and brand manuals.'],
      ['aplicada', 'Graphic design', 'Catalogs, flyers, print pieces and vehicle wraps.'],
      ['web', 'Web design', 'Custom websites: fast, secure and mobile-first.'],
      ['sistemas', 'Management systems', 'Custom platforms to manage clients, bookings, stock and sales.'],
      ['', 'Digital communication', 'Social media and campaigns.'],
      ['musical', 'Music artwork', 'Album art, banners and Spotify covers.'],
      ['motion', 'Motion graphics', 'Animation for TV and social media.'],
      ['urbano', 'Street art', 'Murals and graffiti that transform spaces.'],
      ['foto', 'Analog photography', 'Film photography with an author’s eye.'],
    ],
  },
};
const CAT_IDS = Object.keys(TXT.es.categorias);

// ---------- datos de proyectos por idioma ----------
const BASE = JSON.parse(readFileSync('src/data/proyectos.json', 'utf8'));
const EN = JSON.parse(readFileSync('src/data/proyectos.en.json', 'utf8'));
// Valores del Tarifario Mural (se actualizan en este archivo)
const TARIFARIO = JSON.parse(readFileSync('src/data/tarifario-murales.json', 'utf8'));
const PUBLICIDAD = JSON.parse(readFileSync('src/data/publicidad.json', 'utf8'));
const LOGOS = JSON.parse(readFileSync('src/data/logos.json', 'utf8'));
// Muros con filtro: "muroLogos": true usa logos.json; "muro": "portadas" usa src/data/portadas.json
const MUROS = { logos: LOGOS, portadas: JSON.parse(readFileSync('src/data/portadas.json', 'utf8')), flyers: JSON.parse(readFileSync('src/data/flyers.json', 'utf8')) };
// Tarifario de diseño (Cámara de Diseñadores de Rafaela, adaptado con permiso)
const TARIFARIO_DISENO = JSON.parse(readFileSync('src/data/tarifario-diseno.json', 'utf8'));

function proyectosEn(l) {
  if (l === 'es') return BASE;
  return BASE.map((p) => {
    const o = EN[p.slug] || {};
    const galerias = (p.galerias || []).map((g, i) => {
      const t = (o.galerias || [])[i] || {};
      return {
        ...g,
        titulo: t.titulo ?? g.titulo,
        texto: t.texto ?? g.texto,
        nota: t.nota ?? g.nota,
        imagenes: g.imagenes.map((im, k) => ({ ...im, alt: (t.alts || [])[k] ?? im.alt })),
      };
    });
    const behance = Array.isArray(p.behance)
      ? p.behance.map((b, k) => ({ ...b, texto: (o.botones || [])[k] ?? b.texto }))
      : p.behance;
    return {
      ...p,
      titulo: o.titulo ?? p.titulo,
      subtitulo: o.subtitulo ?? p.subtitulo,
      estetica: o.estetica ?? p.estetica,
      lugar: o.lugar ?? p.lugar,
      cta: o.cta ?? p.cta,
      ficha: o.ficha ?? p.ficha,
      bloques: o.bloques ?? p.bloques,
      galerias,
      behance,
    };
  });
}

// ---------- utilidades ----------
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (i) => String(i + 1).padStart(2, '0');
const absoluta = (u) => (u && u.startsWith('/') ? SITIO.url + u : u);
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

// Portada del proyecto. Con "portadaPagina" ({ ancha: 16:9, movil: 4:5 }) cada pantalla usa
// una versión armada para ese formato y no se recorta; si no, se usa la portada común.
function portadaPagina(p, T) {
  const alt = T.portadaDe(p.titulo);
  const base = img(p.portada, { alt, sizes: '(min-width: 1584px) 1440px, 100vw', eager: true, dims: [1280, 1001] });
  const v = p.portadaPagina;
  if (!v) return base;
  const set = (t) => anchos(t).map((w) => `${esc(t[w])} ${w}w`).join(', ');
  return `<picture><source media="(max-width: 699px)" srcset="${set(v.movil)}" sizes="100vw"><source srcset="${set(v.ancha)}" sizes="(min-width: 1584px) 1440px, 100vw">${base}</picture>`;
}

// Logo en línea: las letras toman el color del texto y la estrella usa el color de acento.
const LOGO_SVG = readFileSync('src/static/img/logo-airon.svg', 'utf8')
  .replace(' role="img" aria-label="AIRON Studio"', ' aria-hidden="true" focusable="false"')
  .replace(/ xmlns="[^"]+"/, '')
  .replace(/\n/g, '');
const logo = (clase) => LOGO_SVG.replace('<svg', `<svg class="logo-svg ${clase}"`);

const ICONOS_MENU =
  '<svg class="i-abrir" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><line x1="3" y1="7" x2="17" y2="7"/><line x1="3" y1="13" x2="17" y2="13"/></svg>' +
  '<svg class="i-cerrar" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg>';

// Luna (se ve en modo claro) y sol (se ve en modo oscuro)
const ICONOS_TEMA =
  '<svg class="i-luna" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z"/></svg>' +
  '<svg class="i-sol" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="3.6"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4"/></svg>';

function redes() {
  return `<a href="${SITIO.behance}" target="_blank" rel="noopener noreferrer">Behance ↗</a>
      <a href="${SITIO.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      <a href="${SITIO.instagram}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>`;
}

const organizacion = (l) => ({
  '@type': 'Organization',
  '@id': `${SITIO.url}/#estudio`,
  name: 'AIRON Studio',
  url: `${SITIO.url}${RUTAS[l].inicio}`,
  description: TXT[l].descripcion,
  foundingDate: String(FUNDACION),
  logo: `${SITIO.url}/img/logo-airon.svg`,
  founder: { '@type': 'Person', name: 'Matías Gonzalez', jobTitle: TXT[l].cargo, image: `${SITIO.url}/img/foto-perfil-1080.webp` },
  address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressCountry: 'AR' },
  sameAs: [SITIO.behance, SITIO.linkedin, SITIO.instagram],
});

// Archivos con "huella" en el nombre: el navegador los guarda y solo los vuelve a bajar si cambian.
const ASSETS = {};

// ---------- estructura común de cada página ----------
function pagina(l, { clave, slug, titulo, descripcion, activo = '', imagen = `/img/og/inicio-${l}.jpg`, datos, cuerpo, publicidadEnPie = true }) {
  const T = TXT[l];
  const R = RUTAS[l];
  const actual = (id) => (activo === id ? ' aria-current="page"' : '');
  const tituloCompleto = titulo ? `${titulo} — AIRON Studio` : `AIRON Studio — ${T.lema}`;
  const url = SITIO.url + rutaDe(l, clave, slug);
  const alternas = IDIOMAS.map((x) => `<link rel="alternate" hreflang="${TXT[x].htmlLang}" href="${SITIO.url}${rutaDe(x, clave, slug)}">`).join('\n  ');
  const selector = IDIOMAS.map(
    (x) =>
      `<a href="${rutaDe(x, clave, slug)}" hreflang="${TXT[x].htmlLang}" lang="${TXT[x].htmlLang}" title="${TXT[x].nombreIdioma}"${x === l ? ' aria-current="true"' : ''}>${x.toUpperCase()}</a>`
  ).join('<span aria-hidden="true">/</span>');
  imagen = absoluta(imagen);
  descripcion = descripcion || T.descripcion;
  const jsonld = datos ? `\n  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...datos })}</script>` : '';
  return `<!doctype html>
<html lang="${T.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(tituloCompleto)}</title>
  <meta name="description" content="${esc(descripcion)}">
  <link rel="canonical" href="${url}">
  ${alternas}
  <link rel="alternate" hreflang="x-default" href="${SITIO.url}${rutaDe('es', clave, slug)}">
  <meta name="theme-color" content="#F2F0EB">
  <meta name="color-scheme" content="light dark">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${T.ogLocale}">
  <meta property="og:site_name" content="AIRON Studio">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(tituloCompleto)}">
  <meta property="og:description" content="${esc(descripcion)}">
  <meta property="og:image" content="${esc(imagen)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(tituloCompleto)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/fonts/anton-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/instrumentsans-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${ASSETS.css}">
  <script src="${ASSETS.tema}"></script>
  <script src="${ASSETS.vt}"></script>
  <script src="${ASSETS.js}" defer></script>${jsonld}
</head>
<body>
  <a class="skip" href="#contenido">${T.saltar}</a>
  <header class="site-header">
    <div class="wrap header-in">
      <a class="logo" href="${R.inicio}" aria-label="${T.inicioAria}">${logo('logo-header')}</a>
      <nav id="menu" class="nav" aria-label="${T.navPrincipal}">
        <a class="nav-link only-menu" href="${R.inicio}"${actual('inicio')}>${T.nav.inicio}</a>
        <a class="nav-link" href="${R.proyectos}"${actual('proyectos')}>${T.nav.proyectos}</a>
        <a class="nav-link" href="${R.murales}"${actual('murales')}>${T.murales.nav}</a>
        <a class="nav-link" href="${R.estudio}"${actual('estudio')}>${T.nav.estudio}</a>
        <a class="nav-link nav-tarifario" href="${R.tarifarios}"${actual('tarifario')}>${T.tarifarios.nav}</a>
        <a class="nav-link nav-cta" href="${R.contacto}"${actual('contacto')}>${T.nav.contacto}</a>
        <div class="nav-redes only-menu">${redes()}</div>
      </nav>
      <nav class="idioma mono" aria-label="${T.idiomaAria}">${selector}</nav>
      <button class="tema-btn" type="button" aria-label="${T.temaOscuro}" title="${T.temaOscuro}">${ICONOS_TEMA}</button>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="${T.abrirMenu}">${ICONOS_MENU}</button>
    </div>
  </header>
  <main id="contenido">
${cuerpo}
  </main>
${publicidadEnPie ? marquesinaPublicidad(l) : ''}
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <a class="footer-logo" href="${R.inicio}" aria-label="${T.inicioAria}">${logo('logo-footer')}</a>
        <nav class="footer-redes" aria-label="${T.redes}">${redes()}</nav>
      </div>
      <div class="footer-bottom mono">
        <span>© ${anio} AIRON Studio · ${T.pie[0]}</span>
        <span class="footer-legal"><a href="${R.legales}"${actual('legales')}>${LEGALES[l].nav}</a><span aria-hidden="true">·</span><span>${T.pie[1]}</span></span>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

// ---------- piezas reutilizables ----------
// Marquesina de publicidad: logos de anunciantes con enlace directo (datos en src/data/publicidad.json).
// Mientras no haya anunciantes vigentes, muestra espacios de ejemplo que llevan a Contacto.
// Ubicación: arriba del pie en la mayoría de las páginas; en el inicio, después de la lista de proyectos;
// en las herramientas, versión compacta debajo del título (ahí no se repite en el pie).
function marquesinaPublicidad(l, variante = '') {
  if (!PUBLICIDAD.activa) return '';
  const T = TXT[l];
  const A = T.publicidad;
  const hoyTexto = new Date().toISOString().slice(0, 10);
  const contactoPub = `${RUTAS[l].contacto}?tipo=publicidad&mensaje=${encodeURIComponent(A.mensaje)}`;
  // Se suma una marca de origen al enlace, así cada anunciante ve en sus estadísticas las visitas que le llegan desde acá
  const conOrigen = (url) => {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'aironstudio.com.ar');
      u.searchParams.set('utm_medium', 'marquesina');
    }
    return u.toString();
  };
  const vigentes = PUBLICIDAD.anunciantes.filter((a) => a.url && a.logo && (!a.hasta || a.hasta >= hoyTexto));
  const items = vigentes.length
    ? vigentes.map((a) => ({ nombre: a.nombre, logo: a.logo, href: conOrigen(a.url), externo: true }))
    : PUBLICIDAD.ejemplos[l].map((logo) => ({ nombre: A.ejemplo, logo, href: contactoPub, externo: false }));
  // Se repiten los logos hasta llenar bien el ancho de una pantalla grande
  const vueltas = Math.max(1, Math.ceil(8 / items.length));
  const logo = (it, oculto) =>
    `<li${oculto ? ' class="eco" aria-hidden="true"' : ''}><a class="anuncio" href="${esc(it.href)}"${it.externo ? ' target="_blank" rel="sponsored noopener noreferrer"' : ''}${oculto ? ' tabindex="-1"' : ''} title="${esc(it.nombre)}${it.externo ? ` (${A.abre})` : ''}"><img src="${esc(it.logo)}" alt="${oculto ? '' : esc(it.nombre)}" width="200" height="80" loading="lazy" decoding="async"></a></li>`;
  const mitad = (primera) =>
    Array.from({ length: vueltas }, (_, v) => items.map((it) => logo(it, !primera || v > 0)).join('')).join('');
  return `  <aside class="anuncios${variante ? ` anuncios--${variante}` : ''}" aria-label="${A.aria}">
    <div class="wrap anuncios-head">
      <span class="kicker mono anuncios-largo">${A.kicker} · ${A.titulo}</span>${variante === 'compacta' ? `<span class="kicker mono anuncios-corto">${A.kicker}</span>` : ''}
      <a class="link-arrow anuncios-cta" href="${esc(contactoPub)}">${A.cta} →</a>
    </div>
    <div class="anuncios-cinta">
      <ul class="anuncios-pista">${mitad(true)}${mitad(false)}</ul>
    </div>
  </aside>`;
}

const nombreCat = (l, id) => TXT[l].categorias[id] ?? id;
const catsTexto = (l, p) => p.categorias.map((c) => nombreCat(l, c)).join(' / ');
const enlaceCat = (l, cat) => `${RUTAS[l].proyectos}?categoria=${cat}`;
// Los servicios llevan a su categoría; arte urbano tiene su propia página
const enlaceServicio = (l, cat) => (cat === 'urbano' ? RUTAS[l].murales : enlaceCat(l, cat));

// Imagen que aparece al pasar el mouse por una tarjeta.
// Por defecto es la primera de la galería; con "previa" en el proyecto se elige otra (1 = la primera).
const vistaPrevia = (p) => {
  const todas = [...p.galeria, ...(p.galerias || []).flatMap((g) => g.imagenes)];
  return todas[(p.previa || 1) - 1] || todas[0];
};

function tarjeta(l, p, i, { sizes, etiqueta }) {
  const previa = vistaPrevia(p);
  return `<a class="card reveal" href="${rutaDe(l, 'proyecto', p.slug)}" data-cats="${p.categorias.join(' ')}" data-cursor="${TXT[l].verCursor}">
        <div class="card-img" data-vt="p-${p.slug}">${img(p.portada, { alt: TXT[l].portadaDe(p.titulo), sizes, dims: [640, 501] })}${
    previa ? img(previa, { alt: '', sizes, clase: 'card-previa' }) : ''
  }</div>
        <div class="card-meta">
          <div class="card-text">
            <span class="card-title">${esc(p.titulo)}</span>
            <span class="card-sub">${esc(p.subtitulo)}</span>
          </div>
          <span class="card-cat mono">${num(i)} · ${esc(etiqueta || catsTexto(l, p))}</span>
        </div>
      </a>`;
}

function ctaBloque(l, titulo, href = RUTAS[l].contacto, boton = TXT[l].escribinos) {
  return `<section class="cta">
    <div class="wrap cta-in">
      <h2 class="cta-title">${titulo}</h2>
      <a class="btn btn-dark btn-lg" href="${href}">${boton}</a>
    </div>
  </section>`;
}

function numeros(l, proyectos) {
  const T = TXT[l];
  // Solo datos reales. Si `valor` está vacío (null), no se muestra.
  const datos = [
    { valor: anio - FUNDACION },
    { valor: proyectos.length },
    { valor: LOGOS.logos.length }, // identidades de marca (el muro de logos, src/data/logos.json)
    { valor: MARCAS.length },
    { valor: 47, sufijo: ' m²' },
    { valor: T.servicios.length },
  ];
  const items = datos
    .map((n, i) => ({ ...n, texto: T.numeros[i] }))
    .filter((n) => n.valor !== null && n.valor !== undefined)
    .map(
      (n) => `<div class="numero reveal"><span class="numero-valor"><span data-contar="${n.valor}">${n.valor}</span>${n.sufijo || ''}</span><span class="mono">${n.texto}</span></div>`
    )
    .join('\n        ');
  return `<section class="numeros" aria-label="${T.numerosTitulo}">
    <div class="wrap">
      <span class="kicker mono">${T.numerosTitulo}</span>
      <div class="numeros-grid">
        ${items}
      </div>
    </div>
  </section>`;
}

function proceso(l) {
  const T = TXT[l];
  const pasos = T.proceso
    .map(([t, d], i) => `<li class="paso reveal"><span class="paso-num">${num(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)
    .join('\n        ');
  return `<section class="seccion seccion--borde">
    <div class="wrap">
      <span class="kicker mono">${T.procesoKicker}</span>
      <h2 class="h2">${T.procesoTitulo}</h2>
      <ol class="proceso">
        ${pasos}
      </ol>
    </div>
  </section>`;
}

function clientes(l) {
  return `<section class="clientes" aria-label="${TXT[l].clientesKicker}">
    <div class="wrap">
      <span class="kicker mono">${TXT[l].clientesKicker}</span>
      <ul class="clientes-lista">${MARCAS.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
    </div>
  </section>`;
}

// ---------- páginas ----------
function inicio(l, proyectos) {
  const T = TXT[l];
  const R = RUTAS[l];
  // Índice con todos los proyectos: cada fila con su portada a la derecha
  const filas = proyectos
    .map(
      (p, i) => `<li><a class="indice-link reveal" href="${rutaDe(l, 'proyecto', p.slug)}">
          <span class="indice-num mono">${num(i)}</span>
          <span class="indice-texto"><span class="indice-titulo">${esc(p.titulo)}</span><span class="indice-sub">${esc(p.subtitulo)}</span></span>
          <span class="indice-cat mono">${esc(catsTexto(l, p))}</span>
          <span class="indice-mini" data-vt="p-${p.slug}"><img src="${esc(p.portada['640'])}" alt="" width="640" height="501" loading="lazy" decoding="async"></span>
        </a></li>`
    )
    .join('\n        ');
  const conCat = T.servicios.filter(([cat]) => cat);
  const lista = (oculta) =>
    `<ul class="franja-lista"${oculta ? ' aria-hidden="true"' : ''}>${conCat
      .map(([cat, nombre]) => `<li><a href="${enlaceServicio(l, cat)}"${oculta ? ' tabindex="-1"' : ''}>${esc(nombre)}</a></li><li class="franja-sep" aria-hidden="true"></li>`)
      .join('')}</ul>`;
  const servicios = T.servicios
    .map(([cat, nombre, texto], i) => {
      const titulo = cat ? `<a href="${enlaceServicio(l, cat)}">${esc(nombre)} <span aria-hidden="true">→</span></a>` : esc(nombre);
      return `<li class="servicio reveal"><span class="mono num">${num(i)}</span><div><h3>${titulo}</h3><p>${esc(texto)}</p></div></li>`;
    })
    .join('\n        ');
  return pagina(l, {
    clave: 'inicio',
    publicidadEnPie: false,
    activo: 'inicio',
    imagen: `/img/og/inicio-${l}.jpg`,
    datos: { '@graph': [organizacion(l), { '@type': 'WebSite', name: 'AIRON Studio', url: `${SITIO.url}${R.inicio}`, inLanguage: T.htmlLang, publisher: { '@id': `${SITIO.url}/#estudio` } }] },
    cuerpo: `
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-kicker mono"><span>${T.heroKicker[0]}</span><span>${T.heroKicker[1]}</span></div>
      <h1 class="hero-title">${T.lema.split(' ').map((w) => `<span class="palabra">${esc(w)}</span>`).join(' ')}</h1>
      <div class="hero-bottom">
        <p class="lead">${T.heroLead}</p>
        <div class="btn-row">
          <a class="btn btn-accent btn-lg" href="${R.proyectos}">${T.verProyectos}</a>
          <a class="btn btn-outline btn-lg" href="${R.contacto}">${T.hablemos}</a>
        </div>
      </div>
    </div>
  </section>

  <nav class="franja" aria-label="${T.disciplinasAria}"><div class="franja-pista">${lista(false)}${lista(true)}</div></nav>

  <section class="seccion">
    <div class="wrap">
      <div class="seccion-head">
        <div>
          <span class="kicker mono">${T.indice} · 01—${num(proyectos.length - 1)}</span>
          <h2 class="h2">${T.nav.proyectos}</h2>
        </div>
        <a class="link-arrow" href="${R.proyectos}">${T.verGrilla}</a>
      </div>
      <ol class="indice">
        ${filas}
      </ol>
    </div>
  </section>

${marquesinaPublicidad(l, 'inicio')}

  ${numeros(l, proyectos)}

  ${clientes(l)}

  <section class="seccion">
    <div class="wrap servicios-grid">
      <div>
        <span class="kicker mono">${T.serviciosKicker}</span>
        <h2 class="h2">${T.queHacemos}</h2>
      </div>
      <ul class="servicios">
        ${servicios}
      </ul>
    </div>
  </section>

  ${proceso(l)}

  ${ctaBloque(l, T.ctaInicio)}
`,
  });
}

function listado(l, proyectos) {
  const T = TXT[l];
  const filtros = [{ id: 'todos', nombre: T.todos, n: proyectos.length }]
    .concat(CAT_IDS.map((id) => ({ id, nombre: nombreCat(l, id), n: proyectos.filter((p) => p.categorias.includes(id)).length })))
    .map((c) => `<button type="button" class="pill" data-filter="${c.id}" aria-pressed="${c.id === 'todos'}">${esc(c.nombre)}<span class="mono">${c.n}</span></button>`)
    .join('\n        ');
  const cards = proyectos.map((p, i) => tarjeta(l, p, i, { sizes: '(min-width: 900px) 30vw, 50vw' })).join('\n      ');
  return pagina(l, {
    clave: 'proyectos',
    titulo: T.proyectos,
    activo: 'proyectos',
    imagen: `/img/og/inicio-${l}.jpg`,
    descripcion: T.listadoDesc,
    datos: {
      '@type': 'CollectionPage',
      name: `AIRON Studio — ${T.proyectos}`,
      url: `${SITIO.url}${RUTAS[l].proyectos}`,
      inLanguage: T.htmlLang,
      hasPart: proyectos.map((p) => ({ '@type': 'CreativeWork', name: p.titulo, url: `${SITIO.url}${rutaDe(l, 'proyecto', p.slug)}` })),
    },
    cuerpo: `
  <section class="page-head">
    <div class="wrap page-head-in">
      <div>
        <span class="kicker mono">${T.portafolio}</span>
        <h1 class="page-title">${T.proyectos}</h1>
      </div>
      <p class="lead">${T.listadoLead}</p>
    </div>
  </section>
  <div class="filtros" hidden>
    <div class="wrap filtros-in">
      <div class="filtros-pills" role="group" aria-label="${T.filtrarAria}">
        ${filtros}
      </div>
      <span class="mono contador" aria-live="polite"><span data-count>${proyectos.length}</span> ${T.proyectosCont}</span>
    </div>
  </div>
  <section class="seccion seccion--top">
    <div class="wrap">
      <div class="grid-proyectos">
      ${cards}
      </div>
      <div class="sin-proyectos" hidden>
        <p class="lead">${T.sinProyectos}</p>
        <a class="link-arrow" data-contacto="${RUTAS[l].contacto}" href="${RUTAS[l].contacto}">${T.sinProyectosCta}</a>
      </div>
    </div>
  </section>
`,
  });
}

function detalle(l, proyectos, p, i) {
  const T = TXT[l];
  const ant = proyectos[(i - 1 + proyectos.length) % proyectos.length];
  const sig = proyectos[(i + 1) % proyectos.length];
  const ficha = p.ficha.map(([k, v]) => `<div class="ficha-item"><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n        ');
  const bloques = p.bloques
    .map((b, j) => {
      const destacado = b.destacado ? `<p class="texto-destacado">${esc(b.destacado)}</p>` : '';
      const parrafos = (b.parrafos || []).map((t) => `<p>${esc(t)}</p>`).join('');
      const lista = b.lista ? `<ul class="lista-marcas">${b.lista.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul>` : '';
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
            `<div class="video"><iframe src="https://www-ccv.adobe.io/v1/player/ccv/${esc(id)}/embed?bgcolor=%23111111&lazyLoading=true&api_key=BehancePro2View" title="${esc(T.videoDe(p.titulo))}" loading="lazy" allow="fullscreen" allowfullscreen></iframe></div>`
        )
        .join('')}</div>`
    : '';
  const figura = (g, k, total, { full = false, grilla = false, columnas = 4 } = {}) => {
    const alt = g.alt || T.imagenDe(p.titulo, k + 1, total);
    const clase = full ? 'galeria-full' : '';
    const sizes = grilla ? (columnas === 7 ? '(min-width: 1100px) 14vw, 34vw' : '(min-width: 900px) 25vw, 50vw') : full ? '(min-width: 1584px) 1440px, 100vw' : '(min-width: 900px) 50vw, 100vw';
    return `<figure class="${clase} reveal"><a class="zoom" href="${esc(paraVisor(g))}" aria-label="${T.ampliar}: ${esc(alt)}">${img(g, { alt, sizes, dims: g._wh })}</a></figure>`;
  };
  const esAncha = (g) => g._wh && g._wh[0] / g._wh[1] > 1.6;
  const galeria = p.galeria.length
    ? `<div class="galeria">${p.galeria.map((g, k) => figura(g, k, p.galeria.length, { full: k === 0 || esAncha(g) })).join('')}</div>`
    : '';
  const galerias = (p.galerias || [])
    .map((grupo) => {
      const grilla = grupo.estilo === 'grilla';
      const figs = grupo.imagenes.map((g, k) => figura(g, k, grupo.imagenes.length, { grilla, columnas: grupo.columnas, full: !grilla && (k === 0 || esAncha(g)) })).join('');
      return `<div class="galeria-grupo">
          <div class="galeria-grupo-head reveal"><h3 class="galeria-titulo">${esc(grupo.titulo)}</h3>${grupo.texto ? `<p>${esc(grupo.texto)}</p>` : ''}${
        grupo.nota ? `<span class="mono">${esc(grupo.nota)}</span>` : ''
      }</div>
          <div class="galeria${grilla ? ' galeria--grilla' : ''}${grupo.columnas === 7 ? ' galeria--7' : ''}">${figs}</div>
        </div>`;
    })
    .join('');
  // Muro interactivo (logos.json o portadas.json): filtro por grupo, visor y enlace a los casos completos
  let muro = '';
  const datosMuro = p.muroLogos ? MUROS.logos : MUROS[p.muro];
  if (datosMuro) {
    const D = datosMuro;
    const M = { ...T.muro, ...(D.textos ? D.textos[l] : { items: T.muro.marcas, grupos: T.muro.rubros }) };
    const conteo = (g) => D.logos.filter((x) => x.grupo === g).length;
    const grupos = Object.keys(D.grupos).filter(conteo);
    const pills = [`<button type="button" class="pill" data-grupo="todas" aria-pressed="true">${M.todas}<span class="mono">${D.logos.length}</span></button>`]
      .concat(grupos.map((g) => `<button type="button" class="pill" data-grupo="${g}" aria-pressed="false">${esc(D.grupos[g][l])}<span class="mono">${conteo(g)}</span></button>`))
      .join('');
    const items = D.logos
      .map((x) => {
        const nombre = typeof x.nombre === 'string' ? x.nombre : x.nombre[l];
        const rubro = x.rubro[l];
        const alt = `${nombre} — ${rubro}`;
        const imagen = `<img src="${esc(x.archivo)}" alt="${esc(alt)}" ${D.formato === 'historia' ? 'width="1080" height="1920"' : 'width="1080" height="1080"'} loading="lazy" decoding="async">`;
        const info = `<span class="logo-info"><span class="logo-nombre">${esc(nombre)}</span><span class="mono">${esc(rubro)}</span></span>`;
        const fondo = x.fondo ? ` data-fondo="${x.fondo}"` : '';
        return x.caso
          ? `<li class="logo-item reveal" data-grupo="${x.grupo}"${fondo}><a class="logo-tile logo-tile--caso" href="${rutaDe(l, 'proyecto', x.caso)}" data-cursor="${esc(M.verCaso)}">${imagen}<span class="logo-caso mono">${M.verCaso} →</span>${info}</a></li>`
          : `<li class="logo-item reveal" data-grupo="${x.grupo}"${fondo}><a class="logo-tile zoom" href="${esc(x.grande || x.archivo)}" aria-label="${T.ampliar}: ${esc(alt)}">${imagen}${info}</a></li>`;
      })
      .join('');
    muro = `<div class="galeria-grupo muro-logos">
          <div class="galeria-grupo-head reveal"><h3 class="galeria-titulo">${M.titulo}</h3><p>${M.texto}</p><span class="mono">${D.logos.length} ${M.items} · ${grupos.length} ${M.grupos}</span></div>
          <div class="muro-filtros" role="group" aria-label="${M.filtrar}">${pills}</div>
          <ul class="logos-grid${D.formato === 'historia' ? ' logos-grid--historia' : ''}">${items}</ul>
        </div>`;
  }
  const hayImagenes = p.galeria.length || (p.galerias || []).length || datosMuro;
  const visor = hayImagenes
    ? `
  <dialog class="visor" aria-label="${T.visor.aria}">
    <button class="visor-btn visor-cerrar" type="button" aria-label="${T.visor.cerrar}">✕</button>
    <button class="visor-btn visor-ant" type="button" aria-label="${T.visor.ant}">←</button>
    <img class="visor-img" alt="">
    <button class="visor-btn visor-sig" type="button" aria-label="${T.visor.sig}">→</button>
    <span class="visor-contador mono" aria-live="polite"></span>
  </dialog>`
    : '';
  // Descripción para Google: se suman los primeros textos del proyecto hasta tener un largo útil
  let texto = '';
  for (const t of p.bloques.flatMap((b) => [b.destacado, ...(b.parrafos || [])]).filter(Boolean)) {
    if (texto.length >= 120) break;
    texto += (texto ? ' ' : '') + t;
  }
  if (texto.length < 120) {
    const datosFicha = p.ficha.map(([k, v]) => `${k}: ${v}`).join(' · ');
    texto = `${p.titulo} — ${p.subtitulo}. ${texto || T.descProyecto(catsTexto(l, p))}${datosFicha ? ' ' + datosFicha + '.' : ''}`;
  }
  const descripcion = recortar(texto);
  // behance: false → sin link a Behance; el cierre invita a pedir una marca
  const sinBehance = p.behance === false;
  const botones = sinBehance
    ? `<a class="btn btn-accent btn-lg" href="${RUTAS[l].contacto}?tipo=${esc(p.categorias[0])}">${T.botonSinBehance}</a>`
    : (Array.isArray(p.behance) ? p.behance : [{ texto: T.verBehance, url: p.behance || SITIO.behance }])
      .map((b) => `<a class="btn btn-accent btn-lg" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">${esc(b.texto)} ↗</a>`)
      .join('');
  // En arte urbano, el cierre invita a pedir un mural
  const urbano = p.categorias.includes('urbano');
  const cierre = urbano ? T.murales.ctaProyecto : p.cta || (sinBehance ? T.ctaSinBehance : T.ctaProyecto);
  const botonMural = urbano ? `<a class="btn btn-dark btn-lg" href="${RUTAS[l].murales}">${T.murales.botonProyecto}</a>` : '';
  return pagina(l, {
    clave: 'proyecto',
    slug: p.slug,
    titulo: `${p.titulo} — ${p.subtitulo}`,
    activo: 'proyectos',
    descripcion,
    imagen: `/img/og/${p.slug}-${l}.jpg`,
    datos: {
      '@graph': [
        {
          '@type': 'CreativeWork',
          name: p.titulo,
          headline: `${p.titulo} — ${p.subtitulo}`,
          description: descripcion,
          url: `${SITIO.url}${rutaDe(l, 'proyecto', p.slug)}`,
          image: absoluta(p.portada['1280']),
          genre: catsTexto(l, p),
          inLanguage: T.htmlLang,
          creator: { '@type': 'Organization', name: 'AIRON Studio', url: `${SITIO.url}${RUTAS[l].inicio}` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: T.nav.inicio, item: `${SITIO.url}${RUTAS[l].inicio}` },
            { '@type': 'ListItem', position: 2, name: T.nav.proyectos, item: `${SITIO.url}${RUTAS[l].proyectos}` },
            { '@type': 'ListItem', position: 3, name: p.titulo, item: `${SITIO.url}${rutaDe(l, 'proyecto', p.slug)}` },
          ],
        },
      ],
    },
    cuerpo: `
  <article>
    <header class="proyecto-head">
      <div class="wrap">
        <div class="proyecto-crumbs mono">
          <a href="${RUTAS[l].proyectos}">${T.volver}</a>
          <span>${T.proyectos} / ${esc(catsTexto(l, p))}</span>
        </div>
        <h1 class="proyecto-title">${esc(p.titulo)}</h1>
        <p class="lead">${esc(p.lugar || p.subtitulo)}</p>
      </div>
    </header>
    <div class="wrap">
      <div class="proyecto-portada" data-vt="p-${p.slug}">${portadaPagina(p, T)}</div>
      <dl class="ficha" aria-label="${T.fichaAria}">
        ${ficha}
      </dl>
    </div>
    ${bloques}
    <section class="bloque bloque--media" aria-label="${T.imagenesAria}">
      <div class="wrap">
        ${videos}
        ${galeria}
        ${muro}
        ${galerias}
      </div>
    </section>
    <div class="wrap">
      <div class="behance-cta">
        <p class="behance-title">${esc(cierre)}</p>
        <div class="btn-row">${botonMural}${botones}</div>
      </div>
      <nav class="navegacion-proyectos" aria-label="${T.otros}">
        <a class="otro otro--ant" href="${rutaDe(l, 'proyecto', ant.slug)}">
          <span class="kicker mono">${T.anterior}</span>
          <span class="otro-title">${esc(ant.titulo)}</span>
        </a>
        <a class="otro otro--sig" href="${rutaDe(l, 'proyecto', sig.slug)}">
          <span class="kicker mono">${T.siguiente}</span>
          <span class="otro-title">${esc(sig.titulo)}</span>
        </a>
      </nav>
    </div>
  </article>${visor}
`,
  });
}

// Calculadora de murales: el formulario se arma acá y el cálculo lo hace main.js con los valores del tarifario
function calculadora(l, { compartir = false, titulo = true } = {}) {
  const C = TXT[l].murales.calc;
  const P = TXT[l].murales.pagina;
  const enlace = `${SITIO.url}${RUTAS[l].calculadora}`;
  const radios = (nombre, opciones, marcada) =>
    opciones
      .map(
        ([valor, titulo, texto]) => `<label class="calc-opcion">
            <input type="radio" name="${nombre}" value="${valor}"${valor === marcada ? ' checked' : ''}>
            <span class="calc-opcion-titulo">${nombre === 'cliente' ? `<span class="calc-letra">${valor}</span> ` : ''}${esc(titulo)}</span>
            <span class="calc-opcion-texto">${esc(texto)}</span>
          </label>`
      )
      .join('\n          ');
  // Textos que usa el navegador para escribir el resultado
  const textos = { ...C.filas, pasaA: C.pasaA, tramoDesde: C.tramoDesde, tramoHasta: C.tramoHasta, jornada: C.jornada, jornadas: C.jornadas, vacio: C.vacio, mega: C.mega, mensaje: C.mensaje, superficie: C.superficie, clientes: Object.fromEntries(C.clientes.map(([k, t]) => [k, t])), disenos: Object.fromEntries(C.disenos.map(([k, t]) => [k, t])), bocetos: Object.fromEntries(C.bocetos.map(([k, t]) => [k, t])), eventoCheck: C.evento, doc: C.doc, generando: C.generando, noIncluye: C.noIncluye, noIncluyeConViaticos: C.noIncluyeConViaticos, fuente: C.fuente, viaticosTitulo: C.viaticos, jornadasObra: C.jornadasObra, viaticoDetalle: C.viaticoDetalle, delTotal: C.delTotal, personaUna: C.personaUna, personaVarias: C.personaVarias };
  // En la página propia el título ya está arriba; en murales se muestra con el link para compartir
  const cabecera = titulo
    ? `<div class="seccion-head">
        <div>
          <span class="kicker mono">${C.kicker}</span>
          <h2 class="h2">${C.titulo}</h2>
        </div>
        <div class="calc-intro">
          <p class="lead">${C.lead}</p>
          ${compartir ? `<p class="calc-compartir mono">${P.compartir}: <a href="${RUTAS[l].calculadora}">${enlace.replace('https://', '')}</a></p>` : ''}
        </div>
      </div>`
    : '';
  return `<section class="seccion ${titulo ? 'seccion--borde' : 'seccion--top'}" id="calculadora">
    <div class="wrap">
      ${cabecera}
      <form class="calc" data-tarifario="${esc(JSON.stringify(TARIFARIO))}" data-textos="${esc(JSON.stringify(textos))}" data-contacto="${RUTAS[l].contacto}">
        <div class="calc-campos">
          <fieldset class="calc-grupo">
            <legend class="calc-legend">${C.medidas}</legend>
            <div class="calc-medidas">
              <div class="campo"><label for="calc-ancho" class="mono">${C.ancho}</label><input id="calc-ancho" name="ancho" type="number" inputmode="decimal" min="0.5" max="200" step="0.1" placeholder="8.5"></div>
              <span class="calc-por" aria-hidden="true">×</span>
              <div class="campo"><label for="calc-alto" class="mono">${C.alto}</label><input id="calc-alto" name="alto" type="number" inputmode="decimal" min="0.5" max="100" step="0.1" placeholder="5.5"></div>
            </div>
            <p class="calc-superficie mono">${C.superficie}: <output name="m2" for="calc-ancho calc-alto">—</output></p>
          </fieldset>
          <fieldset class="calc-grupo">
            <legend class="calc-legend">${C.cliente}</legend>
            <div class="calc-opciones calc-opciones--3">
          ${radios('cliente', C.clientes, 'B')}
            </div>
          </fieldset>
          <fieldset class="calc-grupo">
            <legend class="calc-legend">${C.diseno}</legend>
            <div class="calc-opciones">
          ${radios('diseno', C.disenos, 'simple')}
            </div>
          </fieldset>
          <fieldset class="calc-grupo">
            <legend class="calc-legend">${C.boceto}</legend>
            <div class="calc-opciones calc-opciones--3">
          ${radios('boceto', C.bocetos, 'propio')}
            </div>
          </fieldset>
          <fieldset class="calc-grupo">
            <legend class="calc-legend">${C.extras}</legend>
            <label class="calc-check"><input type="checkbox" name="evento"> <span>${C.evento}</span></label>
            <div class="calc-viaticos">
              <span class="calc-sublegend">${C.viaticos}</span>
              <div class="calc-viaticos-campos">
                <div class="campo"><label for="calc-jornadas" class="mono">${C.jornadasObra}</label><input id="calc-jornadas" name="jornadasObra" type="number" inputmode="numeric" min="0" max="120" step="1" value="0"></div>
                <div class="campo"><label for="calc-personas" class="mono">${C.personas}</label><input id="calc-personas" name="personas" type="number" inputmode="numeric" min="1" max="20" step="1" value="1"></div>
                <div class="campo"><label for="calc-viatico" class="mono">${C.porJornada}</label><input id="calc-viatico" name="viatico" type="number" inputmode="numeric" min="0" step="500" value="${TARIFARIO.viatico.porJornada}"></div>
              </div>
              <span class="nota">${C.viaticosAyuda}</span>
            </div>
          </fieldset>
        </div>
        <aside class="calc-resultado" aria-labelledby="calc-titulo-resultado">
          <span class="kicker mono" id="calc-titulo-resultado">${C.resultado}</span>
          <div class="calc-salida" aria-live="polite"><p class="calc-vacio">${C.vacio}</p></div>
          <p class="nota calc-noincluye">${C.noIncluye}</p>
          <div class="calc-descarga" hidden>
            <div class="campo"><label for="calc-proyecto" class="mono">${C.proyecto}</label><input id="calc-proyecto" name="proyecto" type="text" maxlength="80" autocomplete="off" placeholder="${esc(C.proyectoEjemplo)}"></div>
            <div class="calc-botones">
              <button type="button" class="btn btn-outline calc-bajar" data-formato="pdf">${C.descargarPdf}</button>
              <button type="button" class="btn btn-outline calc-bajar" data-formato="png">${C.descargarImagen}</button>
            </div>
          </div>
          <a class="btn btn-accent btn-lg btn-block calc-pedir" href="${RUTAS[l].contacto}?tipo=mural">${C.pedir}</a>
          <p class="nota calc-fuente">${C.fuente}</p>
          <p class="nota calc-sinjs">${C.sinJs}</p>
        </aside>
      </form>
    </div>
  </section>`;
}

// Página propia de la calculadora, para compartirla con clientes y colegas
function paginaCalculadora(l) {
  const T = TXT[l];
  const P = T.murales.pagina;
  const R = RUTAS[l];
  return pagina(l, {
    clave: 'calculadora',
    publicidadEnPie: false,
    titulo: P.titulo,
    activo: 'tarifario',
    descripcion: P.desc,
    imagen: `/img/og/blend-david-${l}.jpg`,
    datos: {
      '@type': 'WebApplication',
      name: P.h1,
      description: P.desc,
      url: `${SITIO.url}${R.calculadora}`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: T.htmlLang,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
      provider: { '@id': `${SITIO.url}/#estudio` },
    },
    cuerpo: `
  <section class="page-head">
    <div class="wrap page-head-in">
      <div>
        <span class="kicker mono">${P.kicker}</span>
        <h1 class="page-title page-title--md">${P.h1}</h1>
      </div>
      <p class="lead">${P.lead}</p>
    </div>
  </section>

  ${marquesinaPublicidad(l, 'compacta')}

  ${calculadora(l, { titulo: false })}

  <section class="seccion seccion--borde">
    <div class="wrap calc-murales">
      <div>
        <span class="kicker mono">${P.muralesKicker}</span>
        <h2 class="h2">${P.muralesTitulo}</h2>
      </div>
      <div class="calc-murales-texto">
        <p class="lead">${P.muralesTexto}</p>
        <a class="btn btn-dark btn-lg" href="${R.murales}">${P.muralesBoton}</a>
      </div>
    </div>
  </section>
`,
  });
}

// Página que reúne las herramientas
function paginaTarifarios(l) {
  const T = TXT[l];
  const P = T.tarifarios;
  const R = RUTAS[l];
  const F = FAQ_HERRAMIENTAS[l];
  const preguntas = F.faq.map(([q, a]) => `<details class="faq-item reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n        ');
  const tarjetas = P.herramientas
    .map(
      ([ruta, titulo, texto, boton], i) => `<a class="tar-hub-card reveal" href="${R[ruta]}">
          <span class="mono num">${num(i)}</span>
          <span class="tar-hub-titulo">${esc(titulo)}</span>
          <span class="tar-hub-texto">${esc(texto)}</span>
          <span class="link-arrow">${esc(boton)}</span>
        </a>`
    )
    .join('\n        ');
  return pagina(l, {
    clave: 'tarifarios',
    publicidadEnPie: false,
    titulo: P.titulo,
    activo: 'tarifario',
    descripcion: P.desc,
    imagen: `/img/og/blend-david-${l}.jpg`,
    datos: {
      '@graph': [
        { '@type': 'CollectionPage', name: P.titulo, description: P.desc, url: `${SITIO.url}${R.tarifarios}`, inLanguage: T.htmlLang },
        { '@type': 'FAQPage', mainEntity: F.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      ],
    },
    cuerpo: `
  <section class="page-head">
    <div class="wrap page-head-in">
      <div>
        <span class="kicker mono">${P.kicker}</span>
        <h1 class="page-title page-title--md">${P.h1}</h1>
      </div>
      <p class="lead">${P.lead}</p>
    </div>
  </section>
  ${marquesinaPublicidad(l, 'compacta')}
  <section class="seccion seccion--top">
    <div class="wrap tar-hub">
        ${tarjetas}
    </div>
  </section>
  <section class="seccion">
    <div class="wrap faq-grid">
      <div>
        <span class="kicker mono">${F.kicker}</span>
        <h2 class="h2">${F.titulo}</h2>
      </div>
      <div class="faq">
        ${preguntas}
      </div>
    </div>
  </section>
`,
  });
}

// Tarifario de diseño: lista de servicios con precios por tipo de cliente y generador de presupuesto (main.js)
function paginaTarifarioDiseno(l) {
  const T = TXT[l];
  const D = T.diseno;
  const R = RUTAS[l];
  const TD = TARIFARIO_DISENO;
  const idioma = l === 'en' ? 'en-US' : 'es-AR';
  const pesos = (v) => new Intl.NumberFormat(idioma, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);
  const inicial = 1; // PyME
  const radios = (nombre, opciones, marcada) =>
    opciones
      .map(([valor, letra, texto]) => `<label class="tar-pill"><input type="radio" name="${nombre}" value="${valor}"${valor === marcada ? ' checked' : ''}><span>${texto ? `<b>${letra}</b> ${esc(texto)}` : esc(letra)}</span></label>`)
      .join('');
  const refValor = { hora: pesos(TD.horaTrabajo), adaptacion: `${TD.adaptacion * 100} %`, gremio: `${TD.gremio * 100} %`, anticipo: `${TD.anticipo * 100} %` };
  const referencias = D.referencias
    .map(([id, titulo, texto]) => `<div class="tar-ref"><dt class="mono">${esc(titulo)}</dt><dd><span class="tar-ref-valor" data-ref="${id}">${refValor[id].replace(' %', l === 'en' ? '%' : ' %')}</span><span class="tar-ref-texto">${esc(texto)}</span></dd></div>`)
    .join('');
  const filtros = [`<button type="button" class="pill" data-rubro="todos" aria-pressed="true">${D.todos}<span class="mono">${TD.categorias.reduce((n, c) => n + c.servicios.length, 0)}</span></button>`]
    .concat(TD.categorias.map((c) => `<button type="button" class="pill" data-rubro="${c.id}" aria-pressed="false">${esc(c.nombre)}<span class="mono">${c.servicios.length}</span></button>`))
    .join('\n          ');
  const unidad = (u) => D.unidades[u] || u;
  const rubros = TD.categorias
    .map(
      (c) => `<section class="tar-rubro" data-rubro="${c.id}">
          <h2 class="tar-rubro-titulo">${esc(c.nombre)} <span class="mono">${c.servicios.length} ${D.servicios}</span></h2>
          <ul class="tar-servicios">
            ${c.servicios
              .map((s) => {
                const precio = s.porcentaje
                  ? `<span class="tar-precio" data-pct="${s.porcentaje}" title="${esc(D.adicionalAyuda)}">${D.adicional.replace('{p}', s.porcentaje * 100)}</span>`
                  : `<span class="tar-precio" data-precios="${s.precios.join(',')}">${pesos(s.precios[inicial])}</span>`;
                return `<li class="tar-servicio" data-id="${s.id}" data-texto="${esc(`${s.nombre} ${s.desc} ${c.nombre}`.toLowerCase())}">
              <div class="tar-servicio-texto"><span class="tar-nombre">${esc(s.nombre)}</span>${s.desc ? `<span class="tar-desc">${esc(s.desc)}</span>` : ''}</div>
              <span class="tar-unidad mono">${esc(unidad(s.unidad))}</span>
              ${precio}
              <button type="button" class="tar-agregar" data-id="${s.id}">${D.agregar}</button>
            </li>`;
              })
              .join('\n            ')}
          </ul>
        </section>`
    )
    .join('\n        ');
  // Textos que usa el navegador
  const textos = { ...D, referencias: undefined, clientes: D.clientes.map(([, l2, t]) => `${l2} · ${t}`), unidades: D.unidades, generando: T.murales.calc.generando };
  return pagina(l, {
    clave: 'tarifarioDiseno',
    publicidadEnPie: false,
    titulo: D.titulo,
    activo: 'tarifario',
    descripcion: D.desc,
    imagen: `/img/og/inicio-${l}.jpg`,
    datos: {
      '@type': 'WebApplication',
      name: D.h1,
      description: D.desc,
      url: `${SITIO.url}${R.tarifarioDiseno}`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: T.htmlLang,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
      provider: { '@id': `${SITIO.url}/#estudio` },
    },
    cuerpo: `
  <section class="page-head">
    <div class="wrap page-head-in">
      <div>
        <span class="kicker mono">${D.kicker}</span>
        <h1 class="page-title page-title--md">${D.h1}</h1>
      </div>
      <div class="calc-intro">
        <p class="lead">${D.lead}</p>
        ${D.idiomaNota ? `<p class="tar-credito">${D.idiomaNota}</p>` : ''}
      </div>
    </div>
  </section>

  ${marquesinaPublicidad(l, 'compacta')}
  <section class="seccion seccion--top" id="tarifario">
    <div class="wrap tar" data-tarifario="${esc(JSON.stringify({ ...TD, categorias: undefined, fuente: undefined, url: undefined, desarrollo: undefined, permiso: undefined }))}" data-textos="${esc(JSON.stringify(textos))}">
      <div class="tar-main">
        <div class="tar-controles">
          <fieldset class="tar-grupo"><legend class="mono">${D.cliente}</legend><div class="tar-pills">${radios('cliente', D.clientes, String(inicial))}</div></fieldset>
          <fieldset class="tar-grupo"><legend class="mono">${D.moneda}</legend><div class="tar-pills">${radios('moneda', D.monedas.map(([v, t]) => [v, t]), 'ARS')}</div><span class="nota">${D.dolar.replace('{v}', pesos(TD.dolar))}</span></fieldset>
        </div>
        <dl class="tar-refs">${referencias}</dl>
        <div class="tar-filtros">
          <div class="campo tar-buscar"><label for="tar-buscar" class="mono">${D.buscar}</label><input id="tar-buscar" type="search" autocomplete="off" placeholder="${esc(D.buscarEjemplo)}"></div>
          <div class="filtros-pills tar-rubros">
          ${filtros}
          </div>
        </div>
        <div class="tar-lista">
        ${rubros}
          <p class="tar-sin" hidden>${D.sinResultados}</p>
        </div>
      </div>
      <aside class="tar-presupuesto" aria-labelledby="tar-pres-titulo">
        <div class="tar-pres-cabeza"><span class="kicker mono" id="tar-pres-titulo">${D.presupuesto}</span><span class="tar-contador mono" aria-live="polite">0</span></div>
        <div class="tar-items" aria-live="polite"><p class="tar-vacio">${D.vacio}</p></div>
        <div class="tar-opciones">
          <label class="calc-check"><input type="checkbox" name="gremio"> <span>${D.gremioCheck}</span></label>
          <div class="campo"><label for="tar-descuento" class="mono">${D.descuento}</label><input id="tar-descuento" name="descuento" type="number" inputmode="numeric" min="0" max="100" step="1" value="0"></div>
        </div>
        <dl class="tar-totales"></dl>
        <div class="tar-datos">
          <div class="campo"><label for="tar-titulo" class="mono">${D.tituloCampo}</label><input id="tar-titulo" name="titulo" type="text" maxlength="90" autocomplete="off" placeholder="${esc(D.tituloEjemplo)}"></div>
          <div class="campo"><label for="tar-cliente" class="mono">${D.clienteCampo}</label><input id="tar-cliente" name="clienteNombre" type="text" maxlength="80" autocomplete="off"></div>
          <div class="campo"><label for="tar-notas" class="mono">${D.notasCampo}</label><textarea id="tar-notas" name="notas" rows="3" maxlength="600"></textarea></div>
          <label class="calc-check"><input type="checkbox" name="descripciones" checked> <span>${D.descripciones}</span></label>
        </div>
        <div class="calc-botones">
          <button type="button" class="btn btn-outline tar-bajar" data-formato="pdf" disabled>${T.murales.calc.descargarPdf}</button>
          <button type="button" class="btn btn-outline tar-bajar" data-formato="png" disabled>${T.murales.calc.descargarImagen}</button>
        </div>
        <button type="button" class="tar-vaciar" disabled>${D.vaciar}</button>
        <p class="nota">${D.nota}</p>
        <p class="nota calc-sinjs">${D.sinJs}</p>
      </aside>
    </div>
  </section>
`,
  });
}

// Cabecera común de las herramientas nuevas
function cabeceraHerramienta(H) {
  return `<section class="page-head">
    <div class="wrap page-head-in">
      <div>
        <span class="kicker mono">${H.kicker}</span>
        <h1 class="page-title page-title--md">${H.h1}</h1>
      </div>
      <p class="lead">${H.lead}</p>
    </div>
  </section>`;
}
const datosHerramienta = (l, H, ruta) => ({
  '@type': 'WebApplication',
  name: H.h1,
  description: H.desc,
  url: `${SITIO.url}${ruta}`,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web',
  inLanguage: TXT[l].htmlLang,
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
  provider: { '@id': `${SITIO.url}/#estudio` },
});

// Letras Unicode: los estilos se calculan en el navegador (main.js)
const ESTILOS_UNICODE = ['negrita', 'cursiva', 'negritaCursiva', 'sans', 'sansNegrita', 'sansCursiva', 'sansNegritaCursiva', 'escritura', 'escrituraNegrita', 'gotica', 'goticaNegrita', 'doble', 'mono', 'ancha', 'circulos', 'circulosNegros', 'cuadros', 'cuadrosNegros', 'versalitas', 'superindice', 'invertida', 'tachada', 'subrayada', 'dobleSubrayado', 'barrada'];
function paginaUnicode(l) {
  const U = TXT[l].unicode;
  const R = RUTAS[l];
  const estilos = ESTILOS_UNICODE.map(
    (id) => `<li class="uni-estilo" data-estilo="${id}">
          <span class="uni-nombre mono">${esc(U.nombres[id])}</span>
          <output class="uni-resultado" for="uni-texto"></output>
          <button type="button" class="uni-copiar">${U.copiar}</button>
        </li>`
  ).join('\n        ');
  return pagina(l, {
    clave: 'unicode',
    publicidadEnPie: false,
    titulo: U.titulo,
    activo: 'tarifario',
    descripcion: U.desc,
    imagen: `/img/og/inicio-${l}.jpg`,
    datos: datosHerramienta(l, U, R.unicode),
    cuerpo: `
  ${cabeceraHerramienta(U)}
  ${marquesinaPublicidad(l, 'compacta')}
  <section class="seccion seccion--top">
    <div class="wrap uni" data-copiado="${esc(U.copiado)}" data-copiar="${esc(U.copiar)}">
      <div class="uni-entrada">
        <div class="campo">
          <label for="uni-texto" class="mono">${U.campo}</label>
          <textarea id="uni-texto" rows="2" maxlength="500" placeholder="${esc(U.ejemplo)}" spellcheck="false">${esc(U.inicial)}</textarea>
        </div>
        <div class="uni-barra"><span class="mono uni-cuenta">${ESTILOS_UNICODE.length} ${U.estilos}</span><button type="button" class="uni-limpiar">${U.limpiar}</button></div>
      </div>
      <ul class="uni-lista">
        ${estilos}
      </ul>
      <p class="nota calc-sinjs">${TXT[l].murales.calc.sinJs}</p>
      <aside class="uni-consejos">
        <span class="kicker mono">${U.consejoTitulo}</span>
        <ul>${U.consejos.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      </aside>
    </div>
  </section>
`,
  });
}

// Mayúsculas y minúsculas: las conversiones se hacen en el navegador (main.js)
const MODOS_MAYUSCULAS = ['oracion', 'minusculas', 'mayusculas', 'palabras', 'titulo', 'invertir', 'alternar', 'sinTildes'];
function paginaMayusculas(l) {
  const M = TXT[l].mayusculas;
  const R = RUTAS[l];
  const modos = MODOS_MAYUSCULAS.map(
    (id) => `<li class="uni-estilo" data-modo="${id}">
          <span class="uni-nombre mono">${esc(M.modos[id])}</span>
          <output class="uni-resultado may-resultado" for="may-texto"></output>
          <button type="button" class="uni-copiar">${M.copiar}</button>
        </li>`
  ).join('\n        ');
  return pagina(l, {
    clave: 'mayusculas',
    publicidadEnPie: false,
    titulo: M.titulo,
    activo: 'tarifario',
    descripcion: M.desc,
    imagen: `/img/og/inicio-${l}.jpg`,
    datos: datosHerramienta(l, M, R.mayusculas),
    cuerpo: `
  ${cabeceraHerramienta(M)}
  ${marquesinaPublicidad(l, 'compacta')}
  <section class="seccion seccion--top">
    <div class="wrap uni may" lang="${TXT[l].htmlLang}" data-copiado="${esc(M.copiado)}" data-copiar="${esc(M.copiar)}" data-cuenta="${esc(JSON.stringify(M.cuenta))}">
      <div class="uni-entrada">
        <div class="campo">
          <label for="may-texto" class="mono">${M.campo}</label>
          <textarea id="may-texto" rows="3" maxlength="20000" placeholder="${esc(M.ejemplo)}" spellcheck="false">${esc(M.inicial)}</textarea>
        </div>
        <div class="uni-barra"><span class="mono uni-cuenta may-cuenta" aria-live="polite"></span><button type="button" class="uni-limpiar">${M.limpiar}</button></div>
      </div>
      <ul class="uni-lista">
        ${modos}
      </ul>
      <p class="nota calc-sinjs">${TXT[l].murales.calc.sinJs}</p>
      <aside class="uni-consejos">
        <span class="kicker mono">${M.consejoTitulo}</span>
        <ul>${M.consejos.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      </aside>
    </div>
  </section>
`,
  });
}

// ---------- LAION: página de artista dentro de la web (identidad propia: negro, rojo, Michroma y Oswald) ----------
const ESTRELLA_LAION = '<svg class="laion-estrella" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M50 0C53 38 62 47 100 50 62 53 53 62 50 100 47 62 38 53 0 50 38 47 47 38 50 0Z"/></svg>';
const conDestacados = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
function paginaLaion(l) {
  const T = TXT[l];
  const X = LAION[l];
  const R = RUTAS[l];
  const datos = X.datos.map(([v, t]) => `<div class="laion-dato reveal"><dt>${esc(v)}</dt><dd>${esc(t)}</dd></div>`).join('');
  const parrafos = (lista) => lista.map((p) => `<p>${conDestacados(p)}</p>`).join('\n          ');
  const obras = LAION_OBRAS.map(
    (id, i) => `<li class="reveal"><a class="laion-obra zoom" href="/img/laion/${id}-1600.webp" aria-label="${T.ampliar}: ${esc(X.pieza(num(i)))}"><img src="/img/laion/${id}-700.webp" alt="${esc(X.pieza(num(i)))}" width="700" height="933" loading="lazy" decoding="async"><span class="laion-obra-num">${num(i)}</span></a></li>`
  ).join('\n        ');
  const hitos = X.hitos.map(([a, lugar, d]) => `<li class="laion-hito reveal"><span class="laion-hito-anio">${esc(a)}</span><h3>${esc(lugar)}</h3><p>${esc(d)}</p></li>`).join('');
  const mensaje = encodeURIComponent(X.contactoMensaje);
  return pagina(l, {
    clave: 'laion',
    publicidadEnPie: false,
    titulo: X.titulo,
    activo: 'murales',
    descripcion: X.desc,
    imagen: `/img/og/laion-${l}.jpg`,
    datos: {
      '@graph': [
        { '@type': 'ProfilePage', name: X.titulo, description: X.desc, url: `${SITIO.url}${R.laion}`, inLanguage: T.htmlLang, mainEntity: { '@id': `${SITIO.url}/laion/#artista` } },
        { '@type': 'Person', '@id': `${SITIO.url}/laion/#artista`, name: 'LAION', jobTitle: X.kicker, description: X.desc, image: `${SITIO.url}/img/laion/firma-900.webp`, worksFor: { '@id': `${SITIO.url}/#estudio` }, homeLocation: { '@type': 'Place', name: 'Buenos Aires, Argentina' } },
      ],
    },
    cuerpo: `
  <div class="laion">
    <section class="laion-hero">
      <img class="laion-hero-fondo" src="/img/laion/${LAION_PORTADA}-1600.webp" alt="" width="1200" height="1600" fetchpriority="high" decoding="async">
      <div class="wrap laion-hero-in">
        <div class="laion-marco">
          <div class="laion-hero-top"><span>${X.kicker}</span><span>${X.desde}</span></div>
          <h1 class="laion-wordmark"><span class="laion-wordmark-texto">LAION</span>${ESTRELLA_LAION}</h1>
          <p class="laion-bajada">${X.bajada}</p>
          <div class="btn-row"><a class="btn btn-accent btn-lg" href="#obra">${X.verObra}</a><a class="btn laion-btn-borde btn-lg" href="#contacto-laion">${X.contacto}</a></div>
        </div>
      </div>
    </section>

    <section class="wrap laion-datos-wrap" aria-label="LAION">
      <dl class="laion-datos">${datos}</dl>
    </section>

    <section class="wrap laion-seccion" id="biografia">
      <div class="laion-caja reveal">
        <h2 class="laion-h2"><span>${X.biografia}</span></h2>
        <div class="laion-columnas">
          <div class="laion-texto">
          ${parrafos(X.bio)}
          </div>
          <img class="laion-firma" src="/img/laion/firma-900.webp" alt="${esc(X.firmaAlt)}" width="900" height="900" loading="lazy" decoding="async">
        </div>
      </div>
    </section>

    <section class="wrap laion-seccion" id="obra">
      <div class="laion-seccion-head reveal">
        <h2 class="laion-h2"><span>${X.obra}</span></h2>
        <p>${esc(X.obraTexto)}</p>
      </div>
      <ul class="laion-obras">
        ${obras}
      </ul>
    </section>

    <section class="wrap laion-seccion" id="vision">
      <div class="laion-caja reveal">
        <h2 class="laion-h2"><span>${X.vision}</span></h2>
        <div class="laion-texto laion-texto--ancho">
          ${parrafos(X.visionTexto)}
        </div>
      </div>
      <p class="laion-cierre reveal"><span>${esc(X.cierre[0])}</span><span>${esc(X.cierre[1])}</span></p>
    </section>

    <section class="wrap laion-seccion" id="recorrido">
      <div class="laion-seccion-head reveal"><h2 class="laion-h2"><span>${X.ruta}</span></h2></div>
      <ol class="laion-hitos">${hitos}</ol>
    </section>

    <section class="wrap laion-seccion" id="contacto-laion">
      <div class="laion-caja laion-contacto reveal">
        <h2 class="laion-contacto-titulo">${X.contactoTitulo}</h2>
        <p>${esc(X.contactoTexto)}</p>
        <a class="btn btn-accent btn-lg" href="${R.contacto}?tipo=mural&amp;mensaje=${mensaje}">${X.contactoBoton}</a>
      </div>
      <p class="laion-estudio">${esc(X.estudio)} <a href="${R.estudio}">${X.estudioLink}</a></p>
    </section>
  </div>
  <dialog class="visor" aria-label="${T.visor.aria}">
    <button class="visor-btn visor-cerrar" type="button" aria-label="${T.visor.cerrar}">✕</button>
    <button class="visor-btn visor-ant" type="button" aria-label="${T.visor.ant}">←</button>
    <img class="visor-img" alt="">
    <button class="visor-btn visor-sig" type="button" aria-label="${T.visor.sig}">→</button>
    <span class="visor-contador mono" aria-live="polite"></span>
  </dialog>
`,
  });
}

// Convertir a PNG: todo se procesa en el navegador (main.js)
function paginaPng(l) {
  const P = TXT[l].png;
  const R = RUTAS[l];
  const tamanos = P.tamanos.map(([v, t]) => `<label class="tar-pill"><input type="radio" name="tamano" value="${v}"${v === 'original' ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('');
  const textos = { descargar: P.descargar, quitar: P.quitar, procesando: P.procesando, original: P.original, resultado: P.resultado, error: P.error, iaDescargando: P.iaDescargando, iaTrabajando: P.iaTrabajando, iaLista: P.iaLista, iaError: P.iaError };
  return pagina(l, {
    clave: 'png',
    publicidadEnPie: false,
    titulo: P.titulo,
    activo: 'tarifario',
    descripcion: P.desc,
    imagen: `/img/og/inicio-${l}.jpg`,
    datos: datosHerramienta(l, P, R.png),
    cuerpo: `
  ${cabeceraHerramienta(P)}
  ${marquesinaPublicidad(l, 'compacta')}
  <section class="seccion seccion--top">
    <div class="wrap png" data-textos="${esc(JSON.stringify(textos))}">
      <div class="png-panel">
        <label class="png-zona" for="png-archivos">
          <span class="png-zona-titulo">${P.soltar}</span>
          <span class="png-zona-o mono">${P.o}</span>
          <span class="btn btn-dark">${P.elegir}</span>
          <span class="nota">${P.formatos}</span>
          <input id="png-archivos" class="oculto" type="file" accept="image/*,.svg" multiple>
        </label>
        <fieldset class="png-ajustes">
          <legend class="calc-legend">${P.ajustes}</legend>
          <div class="tar-grupo"><span class="mono png-etiqueta">${P.tamano}</span><div class="tar-pills">${tamanos}</div></div>
          <div class="campo png-ancho"><label for="png-ancho" class="mono">${P.anchoMax}</label><input id="png-ancho" name="ancho" type="number" inputmode="numeric" min="16" max="8000" step="1" value="1080" disabled></div>
          <label class="calc-check"><input type="checkbox" name="ia"> <span>${P.ia}</span></label>
          <p class="nota png-ia-ayuda">${P.iaAyuda}</p>
          <p class="nota png-ia-estado" role="status" hidden></p>
          <label class="calc-check"><input type="checkbox" name="fondo"> <span>${P.fondo}</span></label>
          <div class="png-fondo" hidden>
            <p class="nota">${P.fondoAyuda}</p>
            <div class="png-fondo-campos">
              <div class="campo"><label for="png-color" class="mono">${P.color}</label><input id="png-color" name="color" type="color" value="#ffffff"></div>
              <div class="campo"><label for="png-tolerancia" class="mono">${P.tolerancia} <output for="png-tolerancia">12</output></label><input id="png-tolerancia" name="tolerancia" type="range" min="0" max="60" step="1" value="12"></div>
              <div class="campo"><label for="png-suavizado" class="mono">${P.suavizado} <output for="png-suavizado">10</output></label><input id="png-suavizado" name="suavizado" type="range" min="0" max="40" step="1" value="10"></div>
            </div>
          </div>
          <label class="calc-check"><input type="checkbox" name="recortar"> <span>${P.recortar}</span></label>
        </fieldset>
        <p class="nota png-privado">${P.privacidad}</p>
        <p class="nota">${P.limite}</p>
      </div>
      <div class="png-resultados">
        <div class="png-barra" hidden>
          <span class="kicker mono">${P.vista}</span>
          <div class="png-barra-botones"><button type="button" class="btn btn-accent png-todas">${P.descargarTodo}</button><button type="button" class="tar-vaciar png-vaciar">${P.vaciar}</button></div>
        </div>
        <p class="nota png-cuadros" hidden>${P.cuadros}</p>
        <ul class="png-lista" aria-live="polite"></ul>
        <p class="nota calc-sinjs">${TXT[l].murales.calc.sinJs}</p>
      </div>
    </div>
  </section>
`,
  });
}

function murales(l, proyectos) {
  const T = TXT[l];
  const M = T.murales;
  const R = RUTAS[l];
  const urbanos = proyectos.filter((p) => p.categorias.includes('urbano'));
  const caso = proyectos.find((p) => p.slug === 'blend-david');
  const servicios = M.servicios
    .map(([t, d], i) => `<li class="servicio reveal"><span class="mono num">${num(i)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`)
    .join('\n        ');
  const esteticas = urbanos
    .map((p, i) => tarjeta(l, p, i, { sizes: '(min-width: 900px) 45vw, 100vw', etiqueta: p.estetica }))
    .join('\n      ');
  const pasos = M.proceso
    .map(([t, d], i) => `<li class="paso reveal"><span class="paso-num">${num(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)
    .join('\n        ');
  const datosCaso = M.casoDatos
    .map(([v, t]) => `<div class="caso-dato"><dt class="caso-valor">${esc(v)}</dt><dd class="mono">${esc(t)}</dd></div>`)
    .join('');
  // Antes / proceso / después de Blend David (imágenes 2, 4 y 1 de su galería)
  const etapas = [1, 3, 0]
    .map((k, i) => `<figure class="etapa"><div class="etapa-img">${img(caso.galeria[k], { alt: `${caso.titulo} — ${M.etapas[i]}`, sizes: '(min-width: 900px) 18vw, 33vw', dims: caso.galeria[k]._wh })}</div><figcaption class="mono">${M.etapas[i]}</figcaption></figure>`)
    .join('');
  const faq = M.faq
    .map(([q, a]) => `<details class="faq-item reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`)
    .join('\n        ');
  const url = `${SITIO.url}${R.murales}`;
  return pagina(l, {
    clave: 'murales',
    titulo: M.titulo,
    activo: 'murales',
    descripcion: M.desc,
    imagen: `/img/og/blend-david-${l}.jpg`,
    datos: {
      '@graph': [
        {
          '@type': 'Service',
          name: M.titulo,
          serviceType: M.titulo,
          description: M.desc,
          url,
          inLanguage: T.htmlLang,
          provider: { '@id': `${SITIO.url}/#estudio` },
          areaServed: ['Buenos Aires', 'La Plata'],
        },
        {
          '@type': 'FAQPage',
          mainEntity: M.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        },
      ],
    },
    cuerpo: `
  <section class="page-head">
    <div class="wrap murales-head">
      <div class="murales-head-texto">
        <span class="kicker mono">${M.kicker}</span>
        <h1 class="page-title page-title--md">${M.h1}</h1>
        <p class="lead">${M.lead}</p>
        <div class="btn-row">
          <a class="btn btn-accent btn-lg" href="#calculadora">${M.calcular}</a>
          <a class="btn btn-outline btn-lg" href="#trabajos">${M.verTrabajos}</a>
        </div>
      </div>
      <div class="murales-head-img" data-vt="p-${caso.slug}">${img(caso.portada, { alt: T.portadaDe(caso.titulo), sizes: '(min-width: 900px) 45vw, 100vw', eager: true, dims: [1280, 1001] })}</div>
    </div>
  </section>

  ${calculadora(l, { compartir: true })}

  <section class="seccion seccion--borde">
    <div class="wrap servicios-grid">
      <div>
        <span class="kicker mono">${M.serviciosKicker}</span>
        <h2 class="h2">${M.serviciosTitulo}</h2>
      </div>
      <ul class="servicios">
        ${servicios}
      </ul>
    </div>
  </section>

  <section class="seccion seccion--borde" id="trabajos">
    <div class="wrap">
      <div class="seccion-head">
        <div>
          <span class="kicker mono">${M.esteticasKicker}</span>
          <h2 class="h2">${M.esteticasTitulo}</h2>
        </div>
        <p class="lead">${M.esteticasLead}</p>
      </div>
      <div class="grid-esteticas">
      ${esteticas}
      </div>
      <a class="laion-promo reveal" href="${R.laion}">
        <img src="/img/laion/firma-900.webp" alt="" width="900" height="900" loading="lazy" decoding="async">
        <span class="laion-promo-texto"><span class="mono">${M.laionKicker}</span><strong>LAION</strong><span>${M.laionTexto}</span><span class="laion-promo-boton">${M.laionBoton}</span></span>
      </a>
    </div>
  </section>

  <section class="seccion seccion--borde">
    <div class="wrap">
      <span class="kicker mono">${M.procesoKicker}</span>
      <h2 class="h2">${M.procesoTitulo}</h2>
      <ol class="proceso">
        ${pasos}
      </ol>
    </div>
  </section>

  <section class="numeros caso">
    <div class="wrap caso-in">
      <div class="caso-texto">
        <span class="kicker mono">${M.casoKicker}</span>
        <h2 class="h2">${esc(caso.titulo)}</h2>
        <p class="caso-lead">${esc(caso.bloques[0].destacado)}</p>
        <dl class="caso-datos">${datosCaso}</dl>
        <a class="link-arrow" href="${rutaDe(l, 'proyecto', caso.slug)}">${M.verProyecto}</a>
      </div>
      <div class="caso-etapas">${etapas}</div>
    </div>
  </section>

  <section class="seccion seccion--borde">
    <div class="wrap faq-grid">
      <div>
        <span class="kicker mono">${M.faqKicker}</span>
        <h2 class="h2">${M.faqTitulo}</h2>
      </div>
      <div class="faq">
        ${faq}
      </div>
    </div>
  </section>

`,
  });
}

function estudio(l, proyectos) {
  const T = TXT[l];
  const disciplinas = T.servicios
    .map(([cat, nombre], i) => `<li class="reveal"><span class="mono num">${num(i)}</span>${cat ? `<a href="${enlaceServicio(l, cat)}">${esc(nombre)}</a>` : `<span>${esc(nombre)}</span>`}</li>`)
    .join('');
  const marcas = MARCAS.map((m) => `<li>${m}</li>`).join('');
  const equipo = T.equipo
    .map(([rol, texto], i) => `<li class="servicio reveal${i === 0 ? ' servicio--destacado' : ''}"><span class="mono num">${num(i)}</span><div><h3>${esc(rol)}</h3><p>${esc(texto)}</p></div></li>`)
    .join('\n        ');
  return pagina(l, {
    clave: 'estudio',
    titulo: T.estudioTitulo,
    activo: 'estudio',
    imagen: `/img/og/inicio-${l}.jpg`,
    descripcion: T.estudioDesc,
    datos: { '@type': 'AboutPage', name: `AIRON Studio — ${T.estudioTitulo}`, url: `${SITIO.url}${RUTAS[l].estudio}`, inLanguage: T.htmlLang, about: organizacion(l) },
    cuerpo: `
  <section class="seccion seccion--top">
    <div class="wrap sobre-grid">
      <figure class="sobre-figura">
        <img class="sobre-foto" src="/img/foto-perfil-1080.webp" srcset="/img/foto-perfil-640.webp 640w, /img/foto-perfil-1080.webp 1080w" sizes="(min-width: 900px) 360px, 220px" width="1080" height="1080" alt="${T.retrato}" fetchpriority="high">
        <figcaption><span class="sobre-nombre">Matías Gonzalez</span><span class="mono">${T.cargoEstudio}</span><span class="sobre-cargo">${T.cargo} · UNLP</span></figcaption>
      </figure>
      <div class="sobre-texto">
        <span class="kicker mono">${T.elEstudio}</span>
        <h1 class="page-title page-title--md">${T.estudioH1}</h1>
        <p class="texto-destacado">${T.estudioTextos[0]}</p>
        <p>${T.estudioTextos[1]}</p>
        <p>${T.estudioTextos[2]}</p>
      </div>
    </div>
  </section>
  <section class="seccion seccion--borde" id="equipo">
    <div class="wrap servicios-grid">
      <div class="equipo-intro">
        <span class="kicker mono">${T.equipoKicker}</span>
        <h2 class="h2">${T.equipoTitulo}</h2>
        <p>${T.equipoTexto}</p>
      </div>
      <ul class="servicios">
        ${equipo}
      </ul>
    </div>
  </section>
  ${numeros(l, proyectos)}
  <section class="seccion">
    <div class="wrap">
      <h2 class="h2">${T.disciplinas}</h2>
      <ul class="disciplinas">${disciplinas}</ul>
    </div>
  </section>
  <section class="seccion seccion--borde">
    <div class="wrap">
      <span class="kicker mono">${T.marcasTitulo}</span>
      <ul class="marcas">${marcas}</ul>
    </div>
  </section>
  ${proceso(l)}
  ${ctaBloque(l, T.ctaEstudio)}
`,
  });
}

function contacto(l) {
  const T = TXT[l];
  // data-clave permite elegir la opción desde el enlace (por ejemplo, /contacto/?tipo=mural)
  const opciones = T.opciones.map((o, i) => `<option data-clave="${OPCIONES_CLAVE[i]}">${o}</option>`).join('');
  return pagina(l, {
    clave: 'contacto',
    titulo: T.contactoTitulo,
    activo: 'contacto',
    descripcion: T.contactoDesc,
    datos: { '@type': 'ContactPage', name: `${T.contactoTitulo} — AIRON Studio`, url: `${SITIO.url}${RUTAS[l].contacto}`, inLanguage: T.htmlLang },
    cuerpo: `
  <section class="seccion seccion--top">
    <div class="wrap contacto-grid">
      <div class="contacto-info">
        <span class="kicker mono">${T.contactoKicker}</span>
        <h1 class="page-title">${T.contactoH1}</h1>
        <p class="lead">${T.contactoLead}</p>
        <nav class="redes-lista" aria-label="${T.redes}">
          <a href="${SITIO.behance}" target="_blank" rel="noopener noreferrer"><span>Behance</span><span class="mono">/AIRONSTUDIO ↗</span></a>
          <a href="${SITIO.linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><span class="mono">/in/aironstudio ↗</span></a>
          <a href="${SITIO.instagram}" target="_blank" rel="noopener noreferrer"><span>Instagram</span><span class="mono">@_aironstudio ↗</span></a>
        </nav>
      </div>
      <form class="form" name="contacto" method="POST" data-gracias="${RUTAS[l].gracias}" ${
        SITIO.formspree ? `action="https://formspree.io/f/${esc(SITIO.formspree)}"` : 'data-pendiente'
      }>
        <input type="hidden" name="_subject" value="${esc(T.asunto)}">
        <input type="hidden" name="idioma" value="${l}">
        <p class="oculto"><label>${T.noCompletar} <input name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
        <div class="campo">
          <label for="nombre" class="mono">${T.campos.nombre}</label>
          <input id="nombre" name="nombre" type="text" autocomplete="name" required maxlength="120">
        </div>
        <div class="campo">
          <label for="email" class="mono">${T.campos.email}</label>
          <input id="email" name="email" type="email" autocomplete="email" required maxlength="160">
        </div>
        <div class="campo">
          <label for="tipo" class="mono">${T.campos.tipo}</label>
          <select id="tipo" name="tipo">${opciones}</select>
        </div>
        <div class="campo">
          <label for="mensaje" class="mono">${T.campos.mensaje}</label>
          <textarea id="mensaje" name="mensaje" rows="6" required maxlength="4000"></textarea>
        </div>
        <button class="btn btn-accent btn-lg btn-block" type="submit">${T.enviar}</button>
        <p class="nota" data-estado role="status">${T.privacidad}</p>
        <p class="nota form-legal"><a href="${RUTAS[l].legales}#privacidad">${LEGALES[l].verPrivacidad}</a></p>
      </form>
    </div>
  </section>
`,
  });
}

// Legales: privacidad, herramientas y derechos de autor (textos en src/data/legales.mjs)
function paginaLegales(l) {
  const L = LEGALES[l];
  const R = RUTAS[l];
  const atajos = (t) =>
    t.replace('{contacto}', `<a href="${R.contacto}">${L.contacto}</a>`).replace('{licencias}', `<a href="/ia/LICENCIAS.txt">${L.licencias}</a>`);
  const bloque = (b) => (Array.isArray(b) ? `<ul>${b.map((x) => `<li>${atajos(x)}</li>`).join('')}</ul>` : `<p>${atajos(b)}</p>`);
  const indice = L.secciones.map((s) => `<li><a href="#${s.id}">${esc(s.titulo)}</a></li>`).join('');
  const secciones = L.secciones
    .map((s, i) => `<section class="legal-seccion" id="${s.id}" aria-labelledby="${s.id}-t">
        <h2 class="legal-titulo" id="${s.id}-t"><span class="mono num">${num(i)}</span> ${esc(s.titulo)}</h2>
        ${s.bloques.map(bloque).join('\n        ')}
      </section>`)
    .join('\n      ');
  return pagina(l, {
    clave: 'legales',
    titulo: L.titulo,
    activo: 'legales',
    descripcion: L.desc,
    datos: { '@type': 'WebPage', name: L.titulo, description: L.desc, url: `${SITIO.url}${R.legales}`, inLanguage: TXT[l].htmlLang, dateModified: '2026-09-28' },
    cuerpo: `
  <section class="page-head">
    <div class="wrap page-head-in">
      <div>
        <span class="kicker mono">${L.kicker}</span>
        <h1 class="page-title page-title--md">${L.h1}</h1>
      </div>
      <p class="lead">${L.lead}<br><span class="nota mono">${L.actualizado}: ${ACTUALIZADO[l]}</span></p>
    </div>
  </section>
  <section class="seccion seccion--top">
    <div class="wrap legal">
      <nav class="legal-indice" aria-label="${L.indice}">
        <span class="kicker mono">${L.indice}</span>
        <ol>${indice}</ol>
      </nav>
      <div class="legal-texto">
      ${secciones}
      </div>
    </div>
  </section>
`,
  });
}

function gracias(l) {
  const T = TXT[l];
  return pagina(l, {
    clave: 'gracias',
    titulo: T.gracias.titulo,
    cuerpo: `
  <section class="seccion seccion--top simple">
    <div class="wrap">
      <h1 class="page-title">${T.gracias.h1}</h1>
      <p class="lead">${T.gracias.texto}</p>
      <div class="btn-row"><a class="btn btn-dark btn-lg" href="${RUTAS[l].inicio}">${T.volverInicio}</a><a class="btn btn-outline btn-lg" href="${RUTAS[l].proyectos}">${T.verProyectos}</a></div>
    </div>
  </section>
`,
  });
}

// Página de error: una sola para los dos idiomas.
function noEncontrada() {
  return pagina('es', {
    clave: 'inicio',
    titulo: 'Página no encontrada · Page not found',
    cuerpo: `
  <section class="seccion seccion--top simple">
    <div class="wrap">
      <h1 class="page-title">Ups.</h1>
      <p class="lead">Esta página no existe o cambió de lugar.<br><span lang="en">This page doesn’t exist or has moved.</span></p>
      <div class="btn-row"><a class="btn btn-dark btn-lg" href="/">Volver al inicio</a><a class="btn btn-outline btn-lg" href="/en/" lang="en">Back to home</a></div>
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
ASSETS.vt = conHuella('js/transiciones.js');
ASSETS.tema = conHuella('js/tema.js');

const archivo = (ruta) => `${ruta.replace(/^\//, '')}index.html`;
const paraMapa = [];
for (const l of IDIOMAS) {
  const proyectos = proyectosEn(l);
  const R = RUTAS[l];
  const paginas = [
    [R.inicio, inicio(l, proyectos)],
    [R.proyectos, listado(l, proyectos)],
    ...proyectos.map((p, i) => [rutaDe(l, 'proyecto', p.slug), detalle(l, proyectos, p, i)]),
    [R.murales, murales(l, proyectos)],
    [R.tarifarios, paginaTarifarios(l)],
    [R.calculadora, paginaCalculadora(l)],
    [R.tarifarioDiseno, paginaTarifarioDiseno(l)],
    [R.unicode, paginaUnicode(l)],
    [R.mayusculas, paginaMayusculas(l)],
    [R.png, paginaPng(l)],
    [R.estudio, estudio(l, proyectos)],
    [R.contacto, contacto(l)],
    [R.legales, paginaLegales(l)],
    [R.laion, paginaLaion(l)],
  ];
  for (const [ruta, html] of paginas) {
    escribir(archivo(ruta), html);
    paraMapa.push(ruta);
  }
  escribir(archivo(R.gracias), gracias(l));
}
escribir('404.html', noEncontrada());

const hoy = new Date().toISOString().slice(0, 10);
escribir(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paraMapa.map((ruta) => `  <url><loc>${SITIO.url}${ruta}</loc><lastmod>${hoy}</lastmod></url>`).join('\n')}
</urlset>
`
);
escribir('robots.txt', `User-agent: *\nAllow: /\nDisallow: /gracias/\nDisallow: /en/thanks/\n\nSitemap: ${SITIO.url}/sitemap.xml\n`);

console.log(`Listo: ${paraMapa.length + 3} páginas generadas en ${OUT}/ (español e inglés)`);
