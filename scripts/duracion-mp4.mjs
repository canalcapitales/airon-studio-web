// Escribe la duración real en un MP4 fragmentado de MediaRecorder (mvhd, tkhd, mdhd y agrega mehd).
// MediaRecorder deja la duración en 0 y el navegador la va adivinando mientras carga.
import { readFileSync, writeFileSync } from 'node:fs';
for (const ruta of process.argv.slice(2)) {
  let b = readFileSync(ruta);
  const cajas = (s, e) => { const o = []; let i = s; while (i < e - 8) { const sz = b.readUInt32BE(i); const t = b.toString('latin1', i + 4, i + 8); o.push({ t, i, sz }); if (['moov', 'trak', 'mdia', 'mvex', 'moof', 'traf'].includes(t)) o.push(...cajas(i + 8, i + sz)); if (!sz) break; i += sz; } return o; };
  let todas = cajas(0, b.length);
  const una = (t) => todas.find((x) => x.t === t);
  const mdhd = una('mdhd');
  const tsMedia = b[mdhd.i + 8] === 1 ? b.readUInt32BE(mdhd.i + 28) : b.readUInt32BE(mdhd.i + 20);
  // duración = tfdt del último fragmento + duraciones de sus muestras
  const trafs = todas.filter((x) => x.t === 'traf');
  const ult = trafs.at(-1);
  const dentro = todas.filter((x) => x.i > ult.i && x.i < ult.i + ult.sz);
  const tfdt = dentro.find((x) => x.t === 'tfdt');
  const base = b[tfdt.i + 8] === 1 ? Number(b.readBigUInt64BE(tfdt.i + 12)) : b.readUInt32BE(tfdt.i + 12);
  const trun = dentro.find((x) => x.t === 'trun');
  const fl = b.readUInt32BE(trun.i + 8) & 0xffffff;
  const n = b.readUInt32BE(trun.i + 12);
  let p = trun.i + 16; if (fl & 1) p += 4; if (fl & 4) p += 4;
  const por = (fl & 0x100 ? 4 : 0) + (fl & 0x200 ? 4 : 0) + (fl & 0x400 ? 4 : 0) + (fl & 0x800 ? 4 : 0);
  let suma = 0;
  if (!(fl & 0x100)) throw new Error('trun sin duraciones');
  for (let k = 0; k < n; k++) suma += b.readUInt32BE(p + k * por);
  const durMedia = base + suma;
  const mvhd = una('mvhd');
  const v1 = b[mvhd.i + 8] === 1;
  const tsMovie = v1 ? b.readUInt32BE(mvhd.i + 28) : b.readUInt32BE(mvhd.i + 20);
  const durMovie = Math.round((durMedia / tsMedia) * tsMovie);
  const pon = (caja, offV1, offV0, valor) => { const v = b[caja.i + 8] === 1; if (v) b.writeBigUInt64BE(BigInt(valor), caja.i + offV1); else b.writeUInt32BE(valor, caja.i + offV0); };
  pon(mvhd, 32, 24, durMovie);
  pon(una('tkhd'), 36, 28, durMovie);
  pon(mdhd, 32, 24, durMedia);
  // mehd (duración total de los fragmentos) dentro de mvex, si no está
  if (!una('mehd')) {
    const mvex = una('mvex'); const moov = una('moov');
    const mehd = Buffer.alloc(16); mehd.writeUInt32BE(16, 0); mehd.write('mehd', 4, 'latin1'); mehd.writeUInt32BE(0, 8); mehd.writeUInt32BE(durMovie, 12);
    b = Buffer.concat([b.subarray(0, mvex.i + 8), mehd, b.subarray(mvex.i + 8)]);
    b.writeUInt32BE(mvex.sz + 16, mvex.i);
    b.writeUInt32BE(moov.sz + 16, moov.i);
    // los moof van después del moov: sus offsets de datos son relativos al moof (tfhd 0x20000 default-base-is-moof), no cambian
  }
  writeFileSync(ruta, b);
  console.log(ruta.split('/').pop(), (durMedia / tsMedia).toFixed(2), 's');
}
