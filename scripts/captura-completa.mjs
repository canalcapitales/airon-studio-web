// Captura de página completa con Chrome (CDP): viewport 1440x900, recorre la página para disparar animaciones.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [, , url, salida, maxAlto = '5200'] = process.argv;
const perfil = mkdtempSync(join(tmpdir(), 'cdp-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9333', `--user-data-dir=${perfil}`, 'about:blank',
]);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 40; i++) {
  try {
    const lista = await (await fetch('http://127.0.0.1:9333/json')).json();
    const pag = lista.find((x) => x.type === 'page');
    if (pag) { ws = new WebSocket(pag.webSocketDebuggerUrl); break; }
  } catch {}
  await espera(250);
}
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pend = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
const cmd = (method, params = {}) => new Promise((r) => { const n = ++id; pend.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const ev = async (expr) => (await cmd('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await cmd('Page.enable');
await cmd('Page.navigate', { url });
await espera(5000);
// Recorre la página de a poco para que aparezcan las animaciones al bajar
const alto = await ev('document.documentElement.scrollHeight');
for (let y = 0; y < alto; y += 450) { await ev(`window.scrollTo(0, ${y})`); await espera(220); }
await espera(1500);
await ev('window.scrollTo(0, 0)');
await espera(1500);
const total = Math.min(await ev('document.documentElement.scrollHeight'), Number(maxAlto));
const shot = await cmd('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1440, height: total, scale: 1 } });
writeFileSync(salida, Buffer.from(shot.result.data, 'base64'));
console.log(url, total);
ws.close(); chrome.kill();
process.exit(0);
