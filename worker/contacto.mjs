// El formulario de contacto de AIRON Studio: revisa lo que llega y arma el correo (2026-11-23).
// Lo usan el Worker de Cloudflare (worker/index.mjs, que lo envía de verdad)
// y el servidor local (scripts/servidor-local.mjs, que solo lo muestra en la consola).
// Sin dependencias: el correo se arma a mano (texto plano, UTF-8). Misma lógica que el de Laionbeats.
import { AREAS_CONTACTO } from '../src/data/contacto.mjs';

// Remitente: aironstudio.com.ar tiene Email Routing de Cloudflare activo.
export const DE = 'web@aironstudio.com.ar';
// El destino NO está acá (el repositorio es público): es el secreto DESTINO del Worker en Cloudflare,
// una dirección verificada en Email Routing.

const AREAS = Object.fromEntries(AREAS_CONTACTO.map((a) => [a.id, a]));
const AREA_POR_DEFECTO = AREAS_CONTACTO[AREAS_CONTACTO.length - 1].id; // «Otra consulta»

const TEXTOS = {
  es: {
    faltan: 'Completá tu nombre, tu correo y el mensaje.',
    correo: 'Revisá tu correo: parece que no está bien escrito.',
    largo: 'El mensaje es demasiado largo.',
    fallo: 'No se pudo enviar. Probá de nuevo en un rato o escribinos por Instagram.',
    ok: '¡Listo! Tu mensaje llegó. Te respondemos pronto.',
    volver: 'Volver a la web',
  },
  en: {
    faltan: 'Please fill in your name, your email and the message.',
    correo: 'Please check your email address.',
    largo: 'The message is too long.',
    fallo: 'It could not be sent. Please try again later or reach us on Instagram.',
    ok: "Done! Your message arrived. We'll get back to you soon.",
    volver: 'Back to the website',
  },
};
export const textos = (lang) => TEXTOS[lang === 'en' ? 'en' : 'es'];

const linea = (s, max) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
const b64 = (s) => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};
const enc = (s) => `=?UTF-8?B?${b64(s)}?=`; // cabeceras con tildes
const cortar76 = (s) => s.replace(/.{1,76}/g, '$&\r\n');

// Devuelve { ok, estado, texto, lang, raw? }. raw es el correo listo para enviar (falta solo el destino).
export function revisar(datos, para) {
  const lang = datos.get('lang') === 'en' ? 'en' : 'es';
  const T = TEXTOS[lang];
  // Trampas para robots: el campo «web» está escondido (una persona no lo llena)
  // y, con JavaScript, el formulario dice cuánto tardó en completarse (menos de 3 s es un robot).
  const tardo = Number(datos.get('d'));
  if (linea(datos.get('web'), 200) || (datos.has('d') && !(tardo >= 3000))) {
    return { ok: true, estado: 200, texto: T.ok, lang }; // se descarta en silencio
  }
  const nombre = linea(datos.get('nombre'), 100);
  const correo = linea(datos.get('correo'), 200);
  const area = AREAS[datos.get('area')] || AREAS[AREA_POR_DEFECTO];
  const mensaje = String(datos.get('mensaje') ?? '').replace(/\r\n?/g, '\n').trim();
  if (!nombre || !correo || !mensaje) return { ok: false, estado: 400, texto: T.faltan, lang };
  if (!/^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[a-z]{2,}$/i.test(correo)) return { ok: false, estado: 400, texto: T.correo, lang };
  if (mensaje.length > 5000) return { ok: false, estado: 400, texto: T.largo, lang };

  const asunto = `${area.asunto} · AIRON Studio · ${nombre}`;
  const cuerpo = `${mensaje}\n\n—\nNombre: ${nombre}\nCorreo: ${correo}\nÁrea: ${area.asunto} (${area.correo})\nIdioma de la web: ${lang}\nEnviado desde el formulario de aironstudio.com.ar.\n`;
  const id = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}@aironstudio.com.ar`;
  const raw = [
    `From: ${enc('Web de AIRON Studio')} <${DE}>`,
    `To: <${para}>`,
    `Reply-To: ${enc(nombre)} <${correo}>`,
    `Subject: ${enc(asunto)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${id}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    cortar76(b64(cuerpo)),
  ].join('\r\n');
  return { ok: true, estado: 200, texto: T.ok, lang, raw };
}

// Solo rutas internas: empiezan con "/" pero no con "//".
const destinoSeguro = (v) => (/^\/(?!\/)[\w\-/]*$/.test(v || '') ? v : '/');

// Respuesta: JSON si la pidió el JavaScript de la página; si no (sin JavaScript), una página mínima.
export function responder(r, pideJson, volver) {
  if (pideJson) {
    return new Response(JSON.stringify({ ok: r.ok, texto: r.texto }), {
      status: r.estado,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  const T = TEXTOS[r.lang] || TEXTOS.es;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const html = `<!doctype html><html lang="${r.lang || 'es'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>AIRON Studio</title><p>${esc(r.texto)}</p><p><a href="${esc(destinoSeguro(volver))}">${esc(T.volver)}</a></p></html>`;
  return new Response(html, { status: r.estado, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
