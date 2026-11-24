// Worker de AIRON Studio (2026-11-23): la web son archivos (dist/), y este programa solo atiende
// el formulario de contacto (POST /api/contacto). Todo lo demás lo sirve Cloudflare tal cual.
// El correo sale por el «send_email» de Cloudflare desde aironstudio.com.ar (ver wrangler.jsonc)
// y llega a la dirección guardada en el secreto DESTINO (verificada en Email Routing).
import { EmailMessage } from 'cloudflare:email';
import { DE, revisar, responder, textos } from './contacto.mjs';

export default {
  async fetch(pedido, env) {
    const url = new URL(pedido.url);
    if (url.pathname !== '/api/contacto') return env.ASSETS.fetch(pedido);
    if (pedido.method !== 'POST') return new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
    // Solo desde la propia web
    const origen = pedido.headers.get('Origin');
    if (origen && origen !== url.origin) return new Response('Origen no permitido', { status: 403 });

    const pideJson = (pedido.headers.get('Accept') || '').includes('application/json');
    let datos;
    try {
      datos = await pedido.formData();
    } catch {
      return new Response('Formulario inválido', { status: 400 });
    }
    const r = revisar(datos, env.DESTINO);
    if (r.ok && r.raw) {
      try {
        if (!env.DESTINO) throw new Error('Falta el secreto DESTINO');
        await env.CORREO.send(new EmailMessage(DE, env.DESTINO, r.raw));
      } catch (e) {
        console.error('No se pudo enviar el correo:', e && e.message);
        return responder({ ok: false, estado: 502, texto: textos(r.lang).fallo, lang: r.lang }, pideJson, datos.get('volver'));
      }
    }
    return responder(r, pideJson, datos.get('volver'));
  },
};
