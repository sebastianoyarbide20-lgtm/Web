// Renderiza audio-src/score.js offline (OfflineAudioContext en Chromium) a un WAV estéreo de 48 kHz.
// Uso: node audio-src/render-score.cjs assets/audio/musica.wav
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const out = process.argv[2] || "assets/audio/musica.wav";
  const score = fs.readFileSync(path.join(__dirname, "score.js"), "utf8");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ content: score });
  const b64 = await page.evaluate(async () => {
    const SR = 48000, dur = window.SCORE_DUR;
    const ac = new OfflineAudioContext(2, Math.round(SR * dur), SR);
    window.SCORE(ac);
    const buf = await ac.startRendering();
    const L = buf.getChannelData(0), R = buf.getChannelData(1), n = L.length;
    const pcm = new Int16Array(n * 2);
    for (let i = 0; i < n; i++) {
      pcm[2 * i] = Math.max(-1, Math.min(1, L[i])) * 32767;
      pcm[2 * i + 1] = Math.max(-1, Math.min(1, R[i])) * 32767;
    }
    const bytes = new Uint8Array(pcm.buffer);
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  });
  await browser.close();
  const data = Buffer.from(b64, "base64");
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(48000, 24);
  h.writeUInt32LE(48000 * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.concat([h, data]));
  console.log("wrote", out, (data.length / 192000).toFixed(2), "s");
})();
