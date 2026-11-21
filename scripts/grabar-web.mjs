// Graba un video fluido de una web mientras se la recorre de arriba a abajo (para la vitrina de Diseño web).
// Cuadro por cuadro: baja un paso, espera que la página se dibuje y saca la foto. Como cada foto tarda más
// que 1/30 de segundo, las animaciones de la web se frenan al mismo ritmo (CSS con Animation.setPlaybackRate
// y el reloj de JavaScript escalado): en el video van a su velocidad real y no se saltea ningún cuadro. Después Chrome codifica los cuadros (H.264)
// y este script arma el MP4 con la duración ya escrita (no hace falta duracion-mp4.mjs).
// Solo usa el Chrome instalado; no descarga nada.
// Uso: node scripts/grabar-web.mjs <url> <salida.mp4> [segundos bajando=16] [px máximos a bajar=4800]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [, , url, salida, seg = '16', maxPx = '4800'] = process.argv;
if (!url || !salida) { console.log('Uso: node scripts/grabar-web.mjs <url> <salida.mp4> [segundos] [px máximos]'); process.exit(1); }
const W = 1280, H = 800, FPS = 30;
const INTRO = 3.2, FINAL = 1.5; // segundos quieto al principio (entrada de la portada) y al final
const perfil = mkdtempSync(join(tmpdir(), 'rec-'));
const PUERTO = 9337;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--hide-scrollbars', `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${perfil}`, `--window-size=${W},${H}`, 'about:blank',
]);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function conectar(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pend = new Map(); const oyentes = [];
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } else if (m.method) oyentes.forEach((f) => f(m));
  });
  const cmd = (method, params = {}) => new Promise((r) => { const n = ++id; pend.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async (expr) => {
    const r = await cmd('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.error) throw new Error(r.error.message);
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 600));
    return r.result?.result?.value;
  };
  const una = (metodo) => new Promise((r) => oyentes.push(function f(m) { if (m.method === metodo) { oyentes.splice(oyentes.indexOf(f), 1); r(m); } }));
  return { ws, cmd, ev, una };
}

let lista;
for (let i = 0; i < 40; i++) { try { lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json`)).json(); if (lista.length) break; } catch {} await espera(250); }
const A = await conectar(lista.find((x) => x.type === 'page').webSocketDebuggerUrl);

// ---- 1) captura cuadro por cuadro ----
await A.cmd('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await A.cmd('Page.enable');
await A.cmd('Animation.enable');
// reloj de JavaScript escalable (window.__k): lo animado con requestAnimationFrame se frena igual que lo CSS
await A.cmd('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  const real = performance.now.bind(performance); let antes = real(), v = antes;
  const ahora = () => { const r = real(); v += (r - antes) * (window.__k ?? 1); antes = r; return v; };
  performance.now = ahora;
  const d0 = Date.now(), p0 = real(); Date.now = () => d0 + (ahora() - p0);
  const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => raf(() => cb(ahora()));
})();` });
let ritmo = 0.25;
const frenar = async (k) => { ritmo = k; await A.cmd('Animation.setPlaybackRate', { playbackRate: k }); await A.ev(`window.__k = ${k}; 0`).catch(() => {}); };
await A.cmd('Animation.setPlaybackRate', { playbackRate: ritmo });
const cargada = A.una('Page.loadEventFired');
await A.cmd('Page.navigate', { url });
await cargada;
await frenar(ritmo);
const total = await A.ev(`Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, ${Number(maxPx)}))`);
const curva = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
// baja en 5 tramos con una pausa corta en cada uno, para que se vean los efectos de cada parte
const posicion = (t) => {
  if (t <= INTRO) return 0;
  const x = Math.min((t - INTRO) / Number(seg), 1);
  if (x >= 1) return total;
  const n = 5, k = x * n, base = Math.floor(k), dentro = k - base;
  return Math.round(total * Math.min((base + curva(Math.min(dentro * 1.3, 1))) / n, 1));
};
const cantidad = Math.round((INTRO + Number(seg) + FINAL) * FPS);
const cuadros = [];
const t0 = Date.now();
let tTanda = Date.now();
for (let f = 0; f < cantidad; f++) {
  await A.ev(`window.scrollTo({ top: ${posicion(f / FPS)}, behavior: "instant" }); new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))`);
  const s = await A.cmd('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  cuadros.push(s.result.data);
  if (process.env.CUADROS && f % 100 === 0) writeFileSync(`${process.env.CUADROS}/c${f}.jpg`, Buffer.from(s.result.data, "base64"));
  // cada 15 cuadros se ajusta el freno según lo que tarda de verdad cada foto
  if (f % 15 === 14) { const ms = (Date.now() - tTanda) / 15; tTanda = Date.now(); await frenar(Math.min(1, (1000 / FPS) / ms)); }
  if (f % 60 === 0) process.stdout.write(`\r  cuadro ${f}/${cantidad}`);
}
console.log(`\r  ${cantidad} cuadros en ${((Date.now() - t0) / 1000).toFixed(0)} s (bajó ${total}px)`);

// ---- 2) codificación H.264 en otra pestaña nueva (WebCodecs) ----
// WebCodecs solo funciona en una página "segura": se abre una página vacía servida en localhost
const { createServer } = await import('node:http');
const servidor = createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end('<!doctype html><title>codificando</title>'); });
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const nueva = await (await fetch(`http://127.0.0.1:${PUERTO}/json/new?http://localhost:${servidor.address().port}/`, { method: 'PUT' })).json();
await espera(800);
const B = await conectar(nueva.webSocketDebuggerUrl);
await B.ev(`window.__trozos = []; window.__enc = new VideoEncoder({
  output: (c, meta) => { const d = new Uint8Array(c.byteLength); c.copyTo(d); if (meta?.decoderConfig?.description) window.__desc = new Uint8Array(meta.decoderConfig.description); window.__trozos.push({ k: c.type === 'key', d }); },
  error: (e) => { window.__err = String(e); },
});
window.__enc.configure({ codec: 'avc1.640028', width: ${W}, height: ${H}, bitrate: 2400000, framerate: ${FPS}, avc: { format: 'avc' }, latencyMode: 'quality' });
window.__n = 0; 'ok'`);
for (let i = 0; i < cuadros.length; i += 30) {
  const tanda = cuadros.slice(i, i + 30);
  await B.ev(`(async () => {
    for (const d of ${JSON.stringify(tanda)}) {
      const bmp = await createImageBitmap(await (await fetch('data:image/jpeg;base64,' + d)).blob());
      const fr = new VideoFrame(bmp, { timestamp: Math.round(window.__n * 1e6 / ${FPS}), duration: Math.round(1e6 / ${FPS}) });
      window.__enc.encode(fr, { keyFrame: window.__n % ${FPS * 2} === 0 });
      fr.close(); bmp.close(); window.__n++;
      while (window.__enc.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
    if (window.__err) throw new Error(window.__err);
  })()`);
}
await B.ev(`window.__enc.flush()`);
const err = await B.ev(`window.__err || ''`);
if (err) throw new Error(err);
const desc = Buffer.from(await B.ev(`btoa(String.fromCharCode(...window.__desc))`), 'base64');
const nTrozos = await B.ev(`window.__trozos.length`);
const muestras = [];
for (let i = 0; i < nTrozos; i += 40) {
  const parte = await B.ev(`window.__trozos.slice(${i}, ${i + 40}).map((t) => { let s = ''; for (let j = 0; j < t.d.length; j += 0x8000) s += String.fromCharCode(...t.d.subarray(j, j + 0x8000)); return [t.k, btoa(s)]; })`);
  for (const [k, d] of parte) muestras.push({ k, d: Buffer.from(d, 'base64') });
}

// ---- 3) MP4 normal (no fragmentado) con 30 cuadros por segundo exactos ----
const caja = (tipo, ...partes) => { const cuerpo = Buffer.concat(partes); const c = Buffer.alloc(8); c.writeUInt32BE(8 + cuerpo.length); c.write(tipo, 4, 'latin1'); return Buffer.concat([c, cuerpo]); };
const u32 = (...v) => { const b = Buffer.alloc(4 * v.length); v.forEach((x, i) => b.writeUInt32BE(x >>> 0, 4 * i)); return b; };
const u16 = (...v) => { const b = Buffer.alloc(2 * v.length); v.forEach((x, i) => b.writeUInt16BE(x, 2 * i)); return b; };
const ceros = (n) => Buffer.alloc(n);
const matriz = u32(0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000);
const ESCALA = 15360, PASO = ESCALA / FPS;
const dur = muestras.length * PASO;
const ftyp = caja('ftyp', Buffer.from('isom', 'latin1'), u32(0x200), Buffer.from('isomiso2avc1mp41', 'latin1'));
const datos = Buffer.concat(muestras.map((m) => m.d));
const armarMoov = (inicioDatos) => {
  const offsets = []; let o = inicioDatos; for (const m of muestras) { offsets.push(o); o += m.d.length; }
  const avc1 = caja('avc1', ceros(6), u16(1), ceros(16), u16(W, H), u32(0x480000, 0x480000, 0), u16(1), ceros(32), u16(0x18, 0xffff), caja('avcC', desc));
  const stbl = caja('stbl',
    caja('stsd', u32(0, 1), avc1),
    caja('stts', u32(0, 1, muestras.length, PASO)),
    caja('stss', u32(0, muestras.filter((m) => m.k).length, ...muestras.map((m, i) => (m.k ? i + 1 : 0)).filter(Boolean))),
    caja('stsc', u32(0, 1, 1, 1, 1)),
    caja('stsz', u32(0, 0, muestras.length, ...muestras.map((m) => m.d.length))),
    caja('stco', u32(0, offsets.length, ...offsets)));
  const minf = caja('minf', caja('vmhd', u32(1), ceros(8)), caja('dinf', caja('dref', u32(0, 1), caja('url ', u32(1)))), stbl);
  const mdia = caja('mdia',
    caja('mdhd', u32(0, 0, 0, ESCALA, dur), u16(0x55c4, 0)),
    caja('hdlr', u32(0, 0), Buffer.from('vide', 'latin1'), ceros(12), Buffer.from('Video\0', 'latin1')),
    minf);
  const tkhd = caja('tkhd', u32(3, 0, 0, 1, 0, Math.round(dur / ESCALA * 1000)), ceros(8), u16(0, 0, 0, 0), matriz, u32(W << 16, H << 16));
  const mvhd = caja('mvhd', u32(0, 0, 0, 1000, Math.round(dur / ESCALA * 1000), 0x10000), u16(0x100, 0), ceros(8), matriz, ceros(24), u32(2));
  return caja('moov', mvhd, caja('trak', tkhd, mdia));
};
// el moov va antes de los datos para que el video arranque sin bajarlo entero
const largoMoov = armarMoov(0).length;
const moov = armarMoov(ftyp.length + largoMoov + 8);
const mdatCab = Buffer.alloc(8); mdatCab.writeUInt32BE(8 + datos.length); mdatCab.write('mdat', 4, 'latin1');
writeFileSync(salida, Buffer.concat([ftyp, moov, mdatCab, datos]));
console.log(salida, muestras.length, 'cuadros,', (muestras.length / FPS).toFixed(1), 's,', Math.round((ftyp.length + moov.length + 8 + datos.length) / 1024), 'KB');
A.ws.close(); B.ws.close(); servidor.close(); chrome.kill(); process.exit(0);
