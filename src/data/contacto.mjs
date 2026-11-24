// Áreas de contacto de AIRON Studio (2026-11-23). UNA sola lista: de acá salen las tarjetas
// de /contacto/, las opciones del desplegable y el asunto de cada correo (worker/contacto.mjs).
// - id: lo que manda el formulario (campo «area").
// - correo: la dirección del área (creada en Email Routing de aironstudio.com.ar, reenvía a la casilla del studio).
//   Es la que abre la tarjeta sin JavaScript.
// - asunto: cómo empieza el asunto del correo (siempre en español: lo lee el studio).
// - tipos: los ?tipo=… de los enlaces viejos de la web que caen en esta área.
// - es / en: el nombre visible en cada idioma.
// La última («Otra consulta») es la que se usa si llega un id que no existe.
// Íconos de cada área: ICONOS_CONTACTO en build.mjs.

export const AREAS_CONTACTO = [
  {
    id: 'proyecto',
    correo: 'proyectos@aironstudio.com.ar',
    asunto: 'Proyecto de diseño',
    es: 'Proyecto de diseño',
    en: 'Design project',
    tipos: ['integral', 'logos', 'branding', 'grafica', 'aplicada', 'redes', 'ploteo', 'flyers', 'musical', 'motion', 'foto', 'ilustracion'],
  },
  { id: 'web', correo: 'web@aironstudio.com.ar', asunto: 'Diseño web', es: 'Diseño web y sistemas', en: 'Web design & systems', tipos: ['web', 'sistemas'] },
  { id: 'mural', correo: 'murales@aironstudio.com.ar', asunto: 'Murales', es: 'Murales', en: 'Murals', tipos: ['mural', 'urbano'] },
  { id: 'publicidad', correo: 'publicidad@aironstudio.com.ar', asunto: 'Publicidad', es: 'Publicidad en la web', en: 'Advertising on the site', tipos: ['publicidad'] },
  { id: 'equipo', correo: 'equipo@aironstudio.com.ar', asunto: 'Equipo', es: 'Sumate al equipo', en: 'Join the team', tipos: ['equipo'] },
  { id: 'prensa', correo: 'prensa@aironstudio.com.ar', asunto: 'Prensa y alianzas', es: 'Prensa y alianzas', en: 'Press & partnerships', tipos: ['prensa'] },
  { id: 'consulta', correo: 'contacto@aironstudio.com.ar', asunto: 'Consulta', es: 'Otra consulta', en: 'Other question', tipos: ['otro'] },
];
