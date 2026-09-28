// Textos de la página Legales (/legales/ y /en/legal/) y de las preguntas frecuentes de Herramientas.
// Se pueden editar acá sin tocar el resto: cada sección es { id, titulo, bloques }, y cada bloque es
// un párrafo (texto) o una lista (array de textos). Se permite HTML simple (<a>, <strong>).
// Atajos que se reemplazan solos: {contacto} = link a Contacto · {licencias} = link a las licencias de la IA.
// Importante: es un texto orientativo redactado en lenguaje simple; no reemplaza el consejo de un abogado.

export const ACTUALIZADO = { es: '28 de septiembre de 2026', en: 'September 28, 2026' };

export const LEGALES = {
  es: {
    nav: 'Legales',
    verPrivacidad: 'Ver cómo cuidamos tus datos',
    titulo: 'Legales — privacidad, herramientas y derechos de autor',
    desc: 'Cómo AIRON Studio cuida tus datos, las condiciones de uso de las herramientas gratuitas y los derechos de autor de los trabajos publicados.',
    kicker: 'Legales',
    h1: 'Legales',
    lead: 'Privacidad, uso de las herramientas y derechos de autor, explicados en simple.',
    actualizado: 'Última actualización',
    indice: 'En esta página',
    contacto: 'la página de Contacto',
    licencias: 'las licencias de la IA',
    secciones: [
      {
        id: 'responsable',
        titulo: 'Quiénes somos',
        bloques: [
          'Este sitio pertenece a <strong>AIRON Studio</strong>, estudio de diseño multimedial de Buenos Aires, Argentina. Para cualquier consulta sobre estos textos, escribinos desde {contacto}.',
        ],
      },
      {
        id: 'privacidad',
        titulo: 'Privacidad y datos personales',
        bloques: [
          '<strong>Qué datos pedimos.</strong> Solo los que completás en el formulario de contacto: nombre, email, tipo de proyecto y mensaje. No hay registro ni cuentas de usuario.',
          '<strong>Para qué los usamos.</strong> Únicamente para responderte y, si trabajamos juntos, para llevar adelante el proyecto. No los vendemos, no los compartimos con fines publicitarios y no te sumamos a listas de correo sin tu permiso.',
          '<strong>Quién más interviene.</strong>',
          [
            'El formulario lo procesa <strong>Formspree</strong> (Estados Unidos), que nos reenvía tu mensaje por email. Al enviarlo, aceptás que tus datos se transfieran a ese servicio para este único fin.',
            'La web está alojada en <strong>Cloudflare</strong>, que registra datos técnicos (como la dirección IP y el navegador) para proteger el sitio de ataques, y puede medir visitas de forma anónima y sin cookies.',
          ],
          '<strong>Cuánto tiempo los guardamos.</strong> Mientras haga falta para responderte o mientras dure la relación de trabajo.',
          '<strong>Tus derechos.</strong> Podés pedirnos ver, corregir o borrar tus datos cuando quieras, escribiendo desde {contacto}. Te respondemos sin costo.',
          'El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.',
        ],
      },
      {
        id: 'cookies',
        titulo: 'Cookies y datos guardados en tu dispositivo',
        bloques: [
          'No usamos cookies de publicidad ni de seguimiento.',
          'Tu navegador guarda, solo en tu dispositivo, dos cosas para que la web sea más cómoda: si elegiste el modo claro u oscuro, y el presupuesto que estés armando en el tarifario de diseño, para que no lo pierdas al cerrar la página. Nosotros no vemos esa información. Podés borrarla cuando quieras desde la configuración del navegador.',
          'Algunos proyectos muestran videos con el reproductor de Adobe (Behance). Ese reproductor se carga desde los servidores de Adobe y se rige por sus propias políticas.',
        ],
      },
      {
        id: 'herramientas',
        titulo: 'Herramientas gratuitas',
        bloques: [
          'Las herramientas (calculadora de murales, tarifario de diseño, textos Unicode y convertidor a PNG) son gratuitas, no requieren registro y se pueden usar también para trabajos comerciales.',
          [
            '<strong>Montos orientativos.</strong> Los valores de la calculadora y del tarifario son una referencia para ayudarte a presupuestar. No son una oferta de AIRON Studio ni un precio obligatorio: cada profesional define su tarifa. Revisá los montos antes de enviar un presupuesto.',
            '<strong>Tus archivos no salen de tu dispositivo.</strong> Las imágenes y los textos se procesan en tu navegador; no llegan a nuestros servidores ni a los de terceros.',
            '<strong>Lo que generás es tuyo.</strong> Los PNG y los textos que creás te pertenecen. Vos sos responsable de tener derecho a usar las imágenes que subís.',
            '<strong>La IA puede equivocarse.</strong> El quitafondos con IA puede dejar restos o borrar de más. Revisá siempre la vista previa antes de usar el resultado.',
          ],
          'Las herramientas se ofrecen “tal cual”, sin garantías. Hacemos lo posible para que funcionen bien, pero no nos hacemos responsables por errores, pérdidas o daños que resulten de su uso. Podemos modificarlas o darlas de baja en cualquier momento.',
        ],
      },
      {
        id: 'derechos',
        titulo: 'Derechos de autor y marcas',
        bloques: [
          'Los diseños, ilustraciones, murales, fotografías, videos y textos publicados en este sitio son obra de AIRON Studio o de sus clientes y están protegidos por la Ley N° 11.723 de Propiedad Intelectual. Las marcas y logos de clientes pertenecen a sus respectivos dueños y se muestran como parte del portfolio.',
          [
            '<strong>Podés</strong> compartir links a esta web y mencionar los trabajos citando a AIRON Studio.',
            '<strong>Necesitás permiso</strong> para copiar, modificar, vender o usar comercialmente las imágenes o los textos. Pedilo desde {contacto}.',
          ],
          '<strong>Software y recursos de terceros.</strong> El quitafondos con IA usa ONNX Runtime Web (Microsoft, licencia MIT) y el modelo U²-Netp (Xuebin Qin y otros, licencia Apache 2.0); podés ver {licencias}. Las tipografías Anton, Instrument Sans e IBM Plex Mono se usan bajo la licencia SIL Open Font License.',
        ],
      },
      {
        id: 'publicidad',
        titulo: 'Publicidad',
        bloques: [
          'La franja de logos que aparece arriba del pie de página es un espacio publicitario y está identificada como “Publicidad”. Cada logo lleva al sitio de ese anunciante, que se abre en otra pestaña.',
          'Esos sitios son de terceros: no controlamos su contenido ni sus políticas de privacidad, y no somos responsables por los productos o servicios que ofrecen. Que una marca anuncie acá no significa que AIRON Studio la recomiende.',
          'Los enlaces llevan una marca de origen (“utm_source=aironstudio.com.ar”) para que el anunciante sepa que la visita llegó desde esta web. No se usan cookies ni se comparte ningún dato tuyo con los anunciantes.',
        ],
      },
      {
        id: 'cambios',
        titulo: 'Cambios en estos textos',
        bloques: ['Podemos actualizar esta página cuando cambie algo del sitio o de la ley. La fecha de la última actualización figura arriba.'],
      },
    ],
  },
  en: {
    nav: 'Legal',
    verPrivacidad: 'See how we handle your data',
    titulo: 'Legal — privacy, tools and copyright',
    desc: 'How AIRON Studio handles your data, the terms of use for the free tools and the copyright of the published work.',
    kicker: 'Legal',
    h1: 'Legal',
    lead: 'Privacy, tool usage and copyright, explained simply.',
    actualizado: 'Last updated',
    indice: 'On this page',
    contacto: 'the Contact page',
    licencias: 'the AI licenses',
    secciones: [
      {
        id: 'responsable',
        titulo: 'Who we are',
        bloques: [
          'This site belongs to <strong>AIRON Studio</strong>, a multimedia design studio based in Buenos Aires, Argentina. For any question about these terms, write to us through {contacto}.',
        ],
      },
      {
        id: 'privacidad',
        titulo: 'Privacy and personal data',
        bloques: [
          '<strong>What we collect.</strong> Only what you fill in on the contact form: name, email, project type and message. There are no sign-ups or user accounts.',
          '<strong>What we use it for.</strong> Only to reply to you and, if we work together, to carry out the project. We don’t sell it, we don’t share it for advertising and we don’t add you to mailing lists without your permission.',
          '<strong>Who else is involved.</strong>',
          [
            'The form is processed by <strong>Formspree</strong> (United States), which forwards your message to us by email. By sending it, you agree that your data is transferred to that service for this sole purpose.',
            'The site is hosted on <strong>Cloudflare</strong>, which logs technical data (such as IP address and browser) to protect the site from attacks, and may count visits anonymously and without cookies.',
          ],
          '<strong>How long we keep it.</strong> As long as needed to reply to you or for the duration of our working relationship.',
          '<strong>Your rights.</strong> You can ask us to access, correct or delete your data at any time by writing through {contacto}, free of charge. Under Argentine Law 25,326, the Agency for Access to Public Information (AAIP) is the authority that handles complaints about personal data protection.',
        ],
      },
      {
        id: 'cookies',
        titulo: 'Cookies and data stored on your device',
        bloques: [
          'We don’t use advertising or tracking cookies.',
          'Your browser stores two things, only on your device, to make the site more convenient: whether you chose light or dark mode, and the quote you’re building in the design rates tool, so you don’t lose it when you close the page. We never see this information. You can clear it anytime from your browser settings.',
          'Some projects show videos with Adobe’s (Behance) player. That player loads from Adobe’s servers and is governed by its own policies.',
        ],
      },
      {
        id: 'herramientas',
        titulo: 'Free tools',
        bloques: [
          'The tools (mural calculator, design rates, Unicode text and PNG converter) are free, need no sign-up and can also be used for commercial work.',
          [
            '<strong>Reference amounts.</strong> The calculator and rate values are a reference to help you quote. They are not an offer from AIRON Studio or a mandatory price: every professional sets their own rate. Check the amounts before sending a quote.',
            '<strong>Your files never leave your device.</strong> Images and text are processed in your browser; they never reach our servers or anyone else’s.',
            '<strong>What you create is yours.</strong> The PNGs and texts you create belong to you. You are responsible for having the right to use the images you upload.',
            '<strong>The AI can make mistakes.</strong> The AI background remover may leave bits behind or remove too much. Always check the preview before using the result.',
          ],
          'The tools are provided “as is”, without warranties. We do our best to keep them working well, but we are not liable for errors, losses or damages resulting from their use. We may change or discontinue them at any time.',
        ],
      },
      {
        id: 'derechos',
        titulo: 'Copyright and trademarks',
        bloques: [
          'The designs, illustrations, murals, photos, videos and texts published on this site are the work of AIRON Studio or its clients and are protected by Argentine Intellectual Property Law 11,723. Client brands and logos belong to their respective owners and are shown as part of the portfolio.',
          [
            '<strong>You can</strong> share links to this site and mention the work crediting AIRON Studio.',
            '<strong>You need permission</strong> to copy, modify, sell or commercially use the images or texts. Ask through {contacto}.',
          ],
          '<strong>Third-party software and resources.</strong> The AI background remover uses ONNX Runtime Web (Microsoft, MIT license) and the U²-Netp model (Xuebin Qin et al., Apache 2.0 license); see {licencias}. The Anton, Instrument Sans and IBM Plex Mono typefaces are used under the SIL Open Font License.',
        ],
      },
      {
        id: 'publicidad',
        titulo: 'Advertising',
        bloques: [
          'The strip of logos above the footer is an advertising space and is labeled “Advertising”. Each logo links to that advertiser’s website, which opens in a new tab.',
          'Those sites belong to third parties: we don’t control their content or privacy policies, and we are not responsible for the products or services they offer. A brand advertising here doesn’t mean AIRON Studio endorses it.',
          'The links carry a source tag (“utm_source=aironstudio.com.ar”) so the advertiser knows the visit came from this site. No cookies are used and none of your data is shared with advertisers.',
        ],
      },
      {
        id: 'cambios',
        titulo: 'Changes to these terms',
        bloques: ['We may update this page when something about the site or the law changes. The date of the last update is shown above.'],
      },
    ],
  },
};

// Preguntas frecuentes de la página Herramientas: [pregunta, respuesta]
export const FAQ_HERRAMIENTAS = {
  es: {
    kicker: 'Preguntas frecuentes',
    titulo: 'Sobre las herramientas',
    faq: [
      ['¿Las herramientas son gratis?', 'Sí, todas. No hace falta registrarse, no tienen límite de uso y podés usarlas también para trabajos comerciales.'],
      ['¿Se suben mis imágenes o textos a algún servidor?', 'No. El convertidor a PNG y los textos Unicode funcionan dentro de tu navegador. Incluso la IA para quitar fondos se descarga una sola vez y trabaja en tu dispositivo: tus archivos nunca salen de él.'],
      ['¿Puedo usar los PNG y los textos en trabajos comerciales?', 'Sí, lo que generás es tuyo. Solo asegurate de tener derecho a usar la imagen original (por ejemplo, que sea tuya o de tu cliente).'],
      ['¿Los precios del tarifario y de la calculadora son oficiales?', 'Son valores de referencia para ayudarte a presupuestar y se actualizan periódicamente. No son precios obligatorios: cada profesional define su tarifa según su experiencia y el proyecto.'],
      ['¿Por qué la IA no recortó bien mi foto?', 'Funciona mejor cuando la persona u objeto se distingue claramente del fondo. Si quedan restos, activá también “Quitar fondo de color” y tocá la imagen sobre el color que sobra.'],
      ['¿Los textos Unicode se ven en todas las redes?', 'Se ven en la mayoría (Instagram, WhatsApp, X, LinkedIn, TikTok). Tené en cuenta que los lectores de pantalla y los buscadores pueden no leerlos bien, así que no los uses para información importante como un teléfono o un precio.'],
    ],
  },
  en: {
    kicker: 'FAQ',
    titulo: 'About the tools',
    faq: [
      ['Are the tools free?', 'Yes, all of them. No sign-up, no usage limits, and you can use them for commercial work too.'],
      ['Are my images or texts uploaded to a server?', 'No. The PNG converter and the Unicode text tool run inside your browser. Even the AI background remover is downloaded once and runs on your device: your files never leave it.'],
      ['Can I use the PNGs and texts in commercial work?', 'Yes, what you create is yours. Just make sure you have the right to use the original image (for example, it’s yours or your client’s).'],
      ['Are the rates and calculator prices official?', 'They are reference values to help you quote, updated periodically. They are not mandatory prices: every professional sets their own rate based on experience and the project.'],
      ['Why didn’t the AI cut out my photo properly?', 'It works best when the person or object stands out clearly from the background. If bits are left, also turn on “Remove solid background” and tap the image on the leftover color.'],
      ['Do Unicode texts show up on every social network?', 'They work on most (Instagram, WhatsApp, X, LinkedIn, TikTok). Keep in mind that screen readers and search engines may not read them properly, so don’t use them for important information like a phone number or a price.'],
    ],
  },
};
