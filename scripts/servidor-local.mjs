// Servidor local para probar dist/ (no necesita instalar nada). Mismo que el de Laionbeats.
// Uso: node build.mjs && node scripts/servidor-local.mjs   → abrir http://localhost:8000
// Aplica la política de seguridad de dist/_headers, así se prueba igual que en Cloudflare.
// El formulario (/api/contacto) NO manda ningún correo: se revisa igual que en Cloudflare
// (worker/contacto.mjs) y el correo armado se muestra en la consola.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { revisar, responder } from '../worker/contacto.mjs';

const RAIZ = fileURLToPath(new URL('../dist', import.meta.url));
const PUERTO = Number(process.argv[2] || process.env.PORT) || 8000; // otro puerto: node scripts/servidor-local.mjs 8020
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm', '.onnx': 'application/octet-stream',
};
const csp = ((existsSync(join(RAIZ, '_headers')) ? readFileSync(join(RAIZ, '_headers'), 'utf8') : '').match(/Content-Security-Policy: (.+)/) || [])[1];

createServer(async (pedido, respuesta) => {
  const url = new URL(pedido.url, `http://localhost:${PUERTO}`);
  if (url.pathname === '/api/contacto') {
    if (pedido.method !== 'POST') { respuesta.writeHead(405, { Allow: 'POST' }); respuesta.end('Método no permitido'); return; }
    const origen = pedido.headers.origin;
    if (origen && origen !== url.origin) { respuesta.writeHead(403); respuesta.end('Origen no permitido'); return; }
    const partes = [];
    for await (const p of pedido) partes.push(p);
    const req = new Request(url, { method: 'POST', headers: { 'Content-Type': pedido.headers['content-type'] || '' }, body: Buffer.concat(partes) });
    let datos;
    try { datos = await req.formData(); } catch { respuesta.writeHead(400); respuesta.end('Formulario inválido'); return; }
    const r = revisar(datos, 'casilla-del-studio@ejemplo.test');
    if (r.raw) {
      const [cab, cuerpo] = r.raw.split('\r\n\r\n');
      console.log('\n--- CORREO (simulado, no se envió) ---\n' + cab + '\n\n' + Buffer.from(cuerpo.replace(/\r\n/g, ''), 'base64').toString('utf8') + '--- fin ---');
    } else console.log('Formulario:', r.texto, r.ok ? '(robot: descartado en silencio)' : '');
    const res = responder(r, (pedido.headers.accept || '').includes('application/json'), datos.get('volver'));
    respuesta.writeHead(res.status, Object.fromEntries(res.headers));
    respuesta.end(await res.text());
    return;
  }
  let ruta = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
  if (ruta.includes('..')) ruta = '';
  let archivo = join(RAIZ, ruta);
  if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, 'index.html');
  let estado = 200;
  if (!existsSync(archivo)) { archivo = join(RAIZ, '404.html'); estado = 404; }
  const cabeceras = { 'Content-Type': TIPOS[extname(archivo)] || 'application/octet-stream' };
  if (csp) cabeceras['Content-Security-Policy'] = csp.replace(' upgrade-insecure-requests', '');
  respuesta.writeHead(estado, cabeceras);
  respuesta.end(readFileSync(archivo));
}).listen(PUERTO, () => console.log(`Probando en http://localhost:${PUERTO}`));
