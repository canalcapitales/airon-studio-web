// Genera el sitio estático de AIRON Studio en la carpeta dist/, en español (/) e inglés (/en/).
// Uso: node build.mjs   (no necesita instalar nada)

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

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
const OPCIONES_CLAVE = ['branding', 'grafica', 'web', 'musical', 'motion', 'mural', 'foto', 'otro'];
const MARCAS = ['GSP Seguridad', 'FOX Sports', 'Eleven Games', 'Ju Base Plant Food', 'Blend David', 'Flexy', 'Trust Fund'];

// Direcciones de cada página en cada idioma
const RUTAS = {
  es: { inicio: '/', proyectos: '/proyectos/', murales: '/murales/', calculadora: '/calculadora-murales/', estudio: '/estudio/', contacto: '/contacto/', gracias: '/gracias/' },
  en: { inicio: '/en/', proyectos: '/en/projects/', murales: '/en/murals/', calculadora: '/en/mural-calculator/', estudio: '/en/studio/', contacto: '/en/contact/', gracias: '/en/thanks/' },
};
const rutaDe = (l, clave, slug) => (clave === 'proyecto' ? `${RUTAS[l].proyectos}${slug}/` : RUTAS[l][clave]);

// ---------- textos de la interfaz ----------
const TXT = {
  es: {
    htmlLang: 'es-AR', ogLocale: 'es_AR', nombreIdioma: 'Español',
    lema: 'Diseño que construye marcas, ideas y experiencias',
    descripcion: 'Estudio de diseño multimedial en Buenos Aires desde 2015. Branding, diseño gráfico, diseño web, gráfica musical, motion, arte urbano y fotografía analógica.',
    saltar: 'Saltar al contenido', inicioAria: 'AIRON Studio — Inicio', abrirMenu: 'Abrir menú', navPrincipal: 'Principal', redes: 'Redes',
    nav: { inicio: 'Inicio', proyectos: 'Proyectos', estudio: 'Estudio', contacto: 'Hablemos' },
    idiomaAria: 'Idioma', temaOscuro: 'Cambiar a modo oscuro',
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
      navTarifario: 'Tarifario mural',
      ctaProyecto: '¿Querés un mural así para tu marca?',
      botonProyecto: 'Pedí tu mural',
    },
    pie: ['Buenos Aires, Argentina', 'Diseño multimedial desde 2015'],
    heroKicker: ['Estudio de diseño multimedial', 'Buenos Aires · desde 2015'],
    heroLead: 'Branding, diseño gráfico, diseño web, gráfica musical, motion, arte urbano y fotografía analógica.',
    verProyectos: 'Ver proyectos →', hablemos: 'Hablemos', disciplinasAria: 'Disciplinas',
    indice: 'Índice', verGrilla: 'Ver con imágenes y filtros →',
    serviciosKicker: 'Servicios', queHacemos: 'Qué hacemos', ctaInicio: '¿Tenés un proyecto en mente?', escribinos: 'Escribinos →',
    numerosTitulo: 'El estudio en números',
    numeros: ['Años de estudio', 'Proyectos en el portafolio', 'Identidades de marca', 'Marcas y medios', 'Nuestro mural más grande', 'Disciplinas creativas'],
    portafolio: 'Portafolio', proyectos: 'Proyectos', todos: 'Todos', filtrarAria: 'Filtrar por categoría', proyectosCont: 'proyectos',
    listadoLead: 'Identidad, gráfica, diseño web, motion, arte urbano y fotografía. Filtrá por categoría para ver cada disciplina.',
    listadoDesc: 'Portafolio de AIRON Studio: identidad de marca, gráfica, diseño web, gráfica musical, motion, arte urbano y fotografía.',
    portadaDe: (t) => `Portada del proyecto ${t}`, imagenDe: (t, k, n) => `${t} — imagen ${k} de ${n}`, ampliar: 'Ampliar',
    videoDe: (t) => `Video del proyecto ${t}`, volver: '← Volver a proyectos', fichaAria: 'Ficha del proyecto', imagenesAria: 'Imágenes del proyecto',
    ctaProyecto: '¿Querés ver todas las imágenes?', verBehance: 'Ver en Behance', otros: 'Otros proyectos', anterior: '← Anterior', siguiente: 'Siguiente →',
    proyectoDe: 'Proyecto de AIRON Studio.',
    descProyecto: (cats) => `${cats} por AIRON Studio, estudio de diseño multimedial en Buenos Aires.`,
    visor: { aria: 'Visor de imágenes', cerrar: 'Cerrar', ant: 'Imagen anterior', sig: 'Imagen siguiente' },
    estudioTitulo: 'Estudio', elEstudio: 'El estudio', estudioH1: 'Diseño con mirada integral',
    estudioDesc: 'AIRON Studio: estudio de diseño multimedial fundado en 2015 en Buenos Aires, liderado por Matías Gonzalez.',
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
    contactoTitulo: 'Contacto', contactoH1: 'Hablemos.',
    contactoLead: 'Contanos tu proyecto: una marca, piezas gráficas, una web, motion, un mural o lo que tengas en mente.',
    contactoDesc: 'Contanos tu proyecto: marca, piezas gráficas, web, motion, mural o lo que tengas en mente.',
    asunto: 'Nuevo mensaje desde la web de AIRON Studio', noCompletar: 'No completar este campo',
    campos: { nombre: 'Nombre', email: 'Email', tipo: 'Tipo de proyecto', mensaje: 'Mensaje' },
    opciones: ['Branding e identidad', 'Diseño gráfico', 'Diseño web', 'Gráfica musical', 'Motion', 'Mural / arte urbano', 'Fotografía', 'Otro'],
    enviar: 'Enviar mensaje →', privacidad: 'Tus datos solo se usan para responderte.',
    gracias: { titulo: 'Mensaje enviado', h1: '¡Gracias!', texto: 'Recibimos tu mensaje. Te vamos a responder a la brevedad.' },
    volverInicio: 'Volver al inicio',
    categorias: { branding: 'Branding', aplicada: 'Gráfica aplicada', web: 'Diseño web', musical: 'Gráfica musical', motion: 'Motion', urbano: 'Arte urbano', foto: 'Fotografía' },
    servicios: [
      ['branding', 'Identidad & branding', 'Logos, sistemas visuales y manuales de marca.'],
      ['aplicada', 'Diseño gráfico', 'Catálogos, flyers, piezas impresas y ploteo vehicular.'],
      ['web', 'Diseño web', 'Sitios a medida: rápidos, seguros y pensados para el celular.'],
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
    nav: { inicio: 'Home', proyectos: 'Work', estudio: 'Studio', contacto: "Let's talk" },
    idiomaAria: 'Language', temaOscuro: 'Switch to dark mode',
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
      navTarifario: 'Mural rates',
      ctaProyecto: 'Want a mural like this for your brand?',
      botonProyecto: 'Get your mural',
    },
    pie: ['Buenos Aires, Argentina', 'Multimedia design since 2015'],
    heroKicker: ['Multimedia design studio', 'Buenos Aires · since 2015'],
    heroLead: 'Branding, graphic design, web design, music artwork, motion, street art and analog photography.',
    verProyectos: 'See our work →', hablemos: "Let's talk", disciplinasAria: 'Disciplines',
    indice: 'Index', verGrilla: 'Browse with images and filters →',
    serviciosKicker: 'Services', queHacemos: 'What we do', ctaInicio: 'Have a project in mind?', escribinos: 'Get in touch →',
    numerosTitulo: 'The studio in numbers',
    numeros: ['Years as a studio', 'Projects in the portfolio', 'Brand identities', 'Brands and media', 'Our largest mural', 'Creative disciplines'],
    portafolio: 'Portfolio', proyectos: 'Work', todos: 'All', filtrarAria: 'Filter by category', proyectosCont: 'projects',
    listadoLead: 'Identity, graphic design, web, motion, street art and photography. Filter by category to explore each discipline.',
    listadoDesc: 'AIRON Studio portfolio: brand identity, graphic design, web design, music artwork, motion, street art and photography.',
    portadaDe: (t) => `Cover of the project ${t}`, imagenDe: (t, k, n) => `${t} — image ${k} of ${n}`, ampliar: 'Enlarge',
    videoDe: (t) => `Video of the project ${t}`, volver: '← Back to work', fichaAria: 'Project details', imagenesAria: 'Project images',
    ctaProyecto: 'Want to see every image?', verBehance: 'View on Behance', otros: 'More projects', anterior: '← Previous', siguiente: 'Next →',
    proyectoDe: 'A project by AIRON Studio.',
    descProyecto: (cats) => `${cats} by AIRON Studio, a multimedia design studio based in Buenos Aires.`,
    visor: { aria: 'Image viewer', cerrar: 'Close', ant: 'Previous image', sig: 'Next image' },
    estudioTitulo: 'Studio', elEstudio: 'The studio', estudioH1: 'Design with an all-round vision',
    estudioDesc: 'AIRON Studio: a multimedia design studio founded in 2015 in Buenos Aires, led by Matías Gonzalez.',
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
    contactoTitulo: 'Contact', contactoH1: "Let's talk.",
    contactoLead: 'Tell us about your project: a brand, graphic pieces, a website, motion, a mural or whatever you have in mind.',
    contactoDesc: 'Tell us about your project: a brand, graphic pieces, a website, motion, a mural or whatever you have in mind.',
    asunto: 'New message from the AIRON Studio website (EN)', noCompletar: 'Do not fill in this field',
    campos: { nombre: 'Name', email: 'Email', tipo: 'Project type', mensaje: 'Message' },
    opciones: ['Branding and identity', 'Graphic design', 'Web design', 'Music artwork', 'Motion', 'Mural / street art', 'Photography', 'Other'],
    enviar: 'Send message →', privacidad: 'Your details are only used to reply to you.',
    gracias: { titulo: 'Message sent', h1: 'Thank you!', texto: "We received your message. We'll get back to you shortly." },
    volverInicio: 'Back to home',
    categorias: { branding: 'Branding', aplicada: 'Graphic design', web: 'Web design', musical: 'Music artwork', motion: 'Motion', urbano: 'Street art', foto: 'Photography' },
    servicios: [
      ['branding', 'Identity & branding', 'Logos, visual systems and brand manuals.'],
      ['aplicada', 'Graphic design', 'Catalogs, flyers, print pieces and vehicle wraps.'],
      ['web', 'Web design', 'Custom websites: fast, secure and mobile-first.'],
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
function pagina(l, { clave, slug, titulo, descripcion, activo = '', imagen = `/img/og/inicio-${l}.jpg`, datos, cuerpo }) {
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
        <a class="nav-link nav-tarifario" href="${R.calculadora}"${actual('tarifario')}>${T.murales.navTarifario}</a>
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
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <a class="footer-logo" href="${R.inicio}" aria-label="${T.inicioAria}">${logo('logo-footer')}</a>
        <nav class="footer-redes" aria-label="${T.redes}">${redes()}</nav>
      </div>
      <div class="footer-bottom mono">
        <span>© ${anio} AIRON Studio · ${T.pie[0]}</span>
        <span>${T.pie[1]}</span>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

// ---------- piezas reutilizables ----------
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
    { valor: 21 }, // identidades de marca (el muro de Branding x AIRON Studio)
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
  const hayImagenes = p.galeria.length || (p.galerias || []).length;
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
  const botones = (Array.isArray(p.behance) ? p.behance : [{ texto: T.verBehance, url: p.behance || SITIO.behance }])
    .map((b) => `<a class="btn btn-accent btn-lg" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">${esc(b.texto)} ↗</a>`)
    .join('');
  // En arte urbano, el cierre invita a pedir un mural
  const urbano = p.categorias.includes('urbano');
  const cierre = urbano ? T.murales.ctaProyecto : p.cta || T.ctaProyecto;
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
      <div class="proyecto-portada" data-vt="p-${p.slug}">${img(p.portada, { alt: T.portadaDe(p.titulo), sizes: '(min-width: 1584px) 1440px, 100vw', eager: true, dims: [1280, 1001] })}</div>
      <dl class="ficha" aria-label="${T.fichaAria}">
        ${ficha}
      </dl>
    </div>
    ${bloques}
    <section class="bloque bloque--media" aria-label="${T.imagenesAria}">
      <div class="wrap">
        ${videos}
        ${galeria}
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
      <img class="sobre-foto" src="/img/foto-perfil-1080.webp" srcset="/img/foto-perfil-640.webp 640w, /img/foto-perfil-1080.webp 1080w" sizes="(min-width: 900px) 40vw, 100vw" width="1080" height="1080" alt="${T.retrato}" fetchpriority="high">
      <div class="sobre-texto">
        <span class="kicker mono">${T.elEstudio}</span>
        <h1 class="page-title page-title--md">${T.estudioH1}</h1>
        <p class="texto-destacado">${T.estudioTextos[0]}</p>
        <p>${T.estudioTextos[1]}</p>
        <p>${T.estudioTextos[2]}</p>
      </div>
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
        <span class="kicker mono">${T.contactoTitulo}</span>
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
      </form>
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
    [R.calculadora, paginaCalculadora(l)],
    [R.estudio, estudio(l, proyectos)],
    [R.contacto, contacto(l)],
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
