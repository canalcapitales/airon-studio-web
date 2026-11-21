// Graba una web mientras se la recorre.
// 1) Chrome manda cada cuadro de la pantalla (Page.startScreencast) mientras bajamos de a poco.
// 2) Otra pestaña arma el video: dibuja los cuadros en un canvas al ritmo real y lo graba con MediaRecorder (MP4).
// Uso: node grabar2.mjs <url> <salida.mp4> [segundos de recorrido] [px máximos a bajar]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [, , url, salida, seg = '16', maxPx = '4800'] = process.argv;
const W = 1280, H = 800;
const perfil = mkdtempSync(join(tmpdir(), 'rec-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--hide-scrollbars', '--remote-debugging-port=9335', `--user-data-dir=${perfil}`, `--window-size=${W},${H}`, 'about:blank',
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
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 600));
    return r.result?.result?.value;
  };
  return { ws, cmd, ev, on: (f) => oyentes.push(f) };
}

let lista;
for (let i = 0; i < 40; i++) { try { lista = await (await fetch('http://127.0.0.1:9335/json')).json(); if (lista.length) break; } catch {} await espera(250); }
const A = await conectar(lista.find((x) => x.type === 'page').webSocketDebuggerUrl);

// ---- 1) captura ----
await A.cmd('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await A.cmd('Page.enable');
const cuadros = [];
let grabando = false;
A.on((m) => {
  if (m.method !== 'Page.screencastFrame') return;
  A.cmd('Page.screencastFrameAck', { sessionId: m.params.sessionId });
  if (grabando) cuadros.push({ t: m.params.metadata.timestamp, d: m.params.data });
});
await A.cmd('Page.navigate', { url });
await espera(400);
await A.cmd('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
grabando = true;
await espera(3200); // entrada de la portada
await A.ev(`new Promise((fin) => {
  const total = Math.min(document.documentElement.scrollHeight - innerHeight, ${Number(maxPx)});
  const dur = ${Number(seg) * 1000};
  const t0 = performance.now();
  const curva = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const paso = (t) => {
    const x = Math.min((t - t0) / dur, 1);
    const n = 5, k = x * n, base = Math.floor(k), dentro = k - base;
    const y = Math.min((base + curva(Math.min(dentro * 1.3, 1))) / n, 1);
    window.scrollTo(0, total * (x >= 1 ? 1 : y));
    x < 1 ? requestAnimationFrame(paso) : setTimeout(fin, 1500);
  };
  requestAnimationFrame(paso);
})`);
grabando = false;
await A.cmd('Page.stopScreencast');
const dur = cuadros.at(-1).t - cuadros[0].t;
console.log('cuadros', cuadros.length, 'duración', dur.toFixed(1), 's', '≈', (cuadros.length / dur).toFixed(1), 'fps');

// ---- 2) armado del video en otra pestaña ----
await A.cmd('Page.navigate', { url: 'about:blank' });
await espera(500);
await A.ev(`window.__c = []; 'ok'`);
// mandamos los cuadros en tandas
for (let i = 0; i < cuadros.length; i += 40) {
  const tanda = cuadros.slice(i, i + 40).map((c) => [c.t - cuadros[0].t, c.d]);
  await A.ev(`window.__c.push(...${JSON.stringify(tanda)}); window.__c.length`);
}
const b64 = await A.ev(`(async () => {
  const lista = window.__c;
  const cv = document.createElement('canvas'); cv.width = ${W}; cv.height = ${H};
  const g = cv.getContext('2d');
  const tipo = ['video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1', 'video/mp4'].find((t) => MediaRecorder.isTypeSupported(t));
  if (!tipo) throw new Error('sin mp4');
  const bmp = async (d) => createImageBitmap(await (await fetch('data:image/jpeg;base64,' + d)).blob());
  // el primer cuadro dibujado antes de empezar
  g.drawImage(await bmp(lista[0][1]), 0, 0);
  const stream = cv.captureStream(0);
  const pista = stream.getVideoTracks()[0];
  const partes = [];
  const rec = new MediaRecorder(stream, { mimeType: tipo, videoBitsPerSecond: 2500000 });
  rec.ondataavailable = (e) => e.data.size && partes.push(e.data);
  rec.start(1000);
  const t0 = performance.now();
  // se decodifican varios cuadros por adelantado para no perder ninguno
  const cola = [];
  const ADEL = 12;
  for (let k = 1; k <= ADEL && k < lista.length; k++) cola.push(bmp(lista[k][1]));
  pista.requestFrame();
  for (let i = 1; i < lista.length; i++) {
    const img = await cola.shift();
    if (i + ADEL < lista.length) cola.push(bmp(lista[i + ADEL][1]));
    const falta = lista[i][0] * 1000 - (performance.now() - t0);
    if (falta > 1) await new Promise((r) => setTimeout(r, falta));
    g.drawImage(img, 0, 0); img.close();
    pista.requestFrame();
  }
  await new Promise((r) => setTimeout(r, 400));
  await new Promise((r) => { rec.onstop = r; rec.stop(); });
  const buf = new Uint8Array(await new Blob(partes, { type: tipo }).arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
})()`);
writeFileSync(salida, Buffer.from(b64, 'base64'));
console.log(salida, Math.round(Buffer.byteLength(b64, 'base64') / 1024), 'KB');
A.ws.close(); chrome.kill(); process.exit(0);
