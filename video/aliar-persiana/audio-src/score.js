// Banda sonora del reel «Cuando bajás la persiana» · ALIAR ROSARIO
// 150 BPM (negra = 0,4 s = 12 cuadros, compás = 1,6 s), La menor. 24 s = 15 compases.
// Noche (0–4,8 s): medio tiempo, hi-hats de reloj, sub grave.
// Subida (4,8–6,4 s): redoble que acelera + barrido; corte de 1/8 antes del drop.
// Drop (6,4–19,2 s): bombo en negras, clap 2 y 4, bajo en corcheas con bombeo, acordes de supersierra, gancho.
// Frase (19,2–20,8 s): break filtrado. Cierre (20,8–24 s): groove final y acorde de remate en 23,2 s.
window.SCORE_DUR = 24;
window.SCORE = (ac) => {
  const B = 0.4, BAR = 1.6;
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // ---- salida: limitador suave + reverb sembrada
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -10; comp.knee.value = 6; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.12;
  comp.connect(ac.destination);
  const master = ac.createGain(); master.gain.value = 0.62; master.connect(comp);
  master.gain.setValueAtTime(0.62, 23.55); master.gain.linearRampToValueAtTime(0.0001, 23.98);
  const rev = ac.createConvolver(), wet = ac.createGain(); wet.gain.value = 0.14; rev.connect(wet); wet.connect(master);
  {
    const n = Math.round(ac.sampleRate * 1.1), ir = ac.createBuffer(2, n, ac.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let s = 9001 + c * 31; for (let i = 0; i < n; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = (s / 0x7fffffff * 2 - 1) * Math.pow(1 - i / n, 3); } }
    rev.buffer = ir;
  }
  // bus de batería (seco) y bus musical (con bombeo de sidechain)
  const drums = ac.createGain(); drums.gain.value = 1; drums.connect(master);
  const music = ac.createGain(); music.gain.value = 1; music.connect(master); music.connect(rev);
  const duck = (t, depth = 0.55) => { music.gain.setValueAtTime(1 - depth, t); music.gain.linearRampToValueAtTime(1, t + 0.17); };

  const noiseBuf = (() => { const n = ac.sampleRate * 2, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0); let s = 77; for (let i = 0; i < n; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = s / 0x7fffffff * 2 - 1; } return b; })();
  const env = (g, t, a, peak, tau) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + a, tau); };
  function osc(bus, t, type, f, peak, a, tau, pan = 0, f2 = null, glide = 0.05, detune = 0) {
    const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + glide); o.detune.value = detune;
    p.pan.value = pan; env(g, t, a, peak, tau); o.connect(g); g.connect(p); p.connect(bus); o.start(t); o.stop(t + a + tau * 8);
  }
  function noise(bus, t, type, f, q, peak, a, tau, pan = 0, f2 = null, glide = 0.1) {
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    s.buffer = noiseBuf; fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + glide); fl.Q.value = q; p.pan.value = pan;
    env(g, t, a, peak, tau); s.connect(fl); fl.connect(g); g.connect(p); p.connect(bus); s.start(t, (t * 3.17) % 1.5); s.stop(t + a + tau * 8);
  }

  // ---- batería
  const kick = (t, v = 1) => { osc(drums, t, "sine", 165, 0.95 * v, 0.001, 0.13, 0, 46, 0.08); noise(drums, t, "highpass", 3000, 0.7, 0.12 * v, 0.001, 0.008); duck(t); };
  const clap = (t, v = 1) => { for (const [d, k] of [[0, 1], [0.009, 0.8], [0.019, 0.9]]) noise(drums, t + d, "bandpass", 1500, 1.2, 0.42 * v * k, 0.001, 0.03); noise(drums, t + 0.025, "bandpass", 1300, 0.9, 0.25 * v, 0.002, 0.11); };
  const snare = (t, v = 1) => { noise(drums, t, "bandpass", 2200, 0.8, 0.38 * v, 0.001, 0.07); osc(drums, t, "triangle", 220, 0.22 * v, 0.001, 0.05, 0, 160, 0.05); };
  const hat = (t, v = 1, pan = 0.25) => noise(drums, t, "highpass", 8500, 0.9, 0.11 * v, 0.001, 0.018, pan);
  const ohat = (t, v = 1) => noise(drums, t, "highpass", 7200, 0.7, 0.13 * v, 0.004, 0.09, -0.2);
  const tick = (t, v = 1) => { noise(drums, t, "bandpass", 5200, 9, 0.5 * v, 0.0005, 0.006, 0.4); }; // tic de reloj
  const crash = (t, v = 1) => noise(drums, t, "highpass", 4500, 0.5, 0.3 * v, 0.002, 0.7);

  // ---- graves y armonía
  const sub = (t, m, len, v = 1) => { // 808 con caída
    const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.setValueAtTime(hz(m + 12), t); o.frequency.exponentialRampToValueAtTime(hz(m), t + 0.06);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16 * v, t + 0.005); g.gain.setTargetAtTime(0, t + len * 0.8, 0.08);
    const sat = ac.createWaveShaper(); const cv = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; cv[i] = Math.tanh(2.2 * x); } sat.curve = cv;
    o.connect(g); g.connect(sat); sat.connect(music); o.start(t); o.stop(t + len + 0.5);
  };
  const bass = (t, m, len = 0.18, v = 1) => { // bajo de sierra filtrado (audible en celular)
    const o = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = "sawtooth"; o2.type = "square"; o.frequency.value = hz(m); o2.frequency.value = hz(m - 12); o.detune.value = 6;
    f.type = "lowpass"; f.Q.value = 6; f.frequency.setValueAtTime(1600, t); f.frequency.exponentialRampToValueAtTime(260, t + len);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16 * v, t + 0.006); g.gain.setTargetAtTime(0, t + len * 0.8, 0.03);
    const g2 = ac.createGain(); g2.gain.value = 0.6; o.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(music);
    o.start(t); o2.start(t); o.stop(t + len + 0.3); o2.stop(t + len + 0.3);
  };
  const stab = (t, notes, len = 0.16, v = 1, cutoff = 4200) => notes.forEach((m, i) => {
    for (const dt of [-14, -6, 0, 7, 15]) {
      const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
      o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = dt; p.pan.value = dt / 30;
      f.type = "lowpass"; f.frequency.setValueAtTime(cutoff, t); f.frequency.exponentialRampToValueAtTime(cutoff * 0.25, t + len + 0.1);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.022 * v, t + 0.004); g.gain.setTargetAtTime(0, t + len, 0.05);
      o.connect(f); f.connect(g); g.connect(p); p.connect(music); o.start(t); o.stop(t + len + 0.4);
    }
  });
  const pad = (t, notes, len, v = 1) => notes.forEach((m, i) => {
    const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = (i - 1) * 9; f.type = "lowpass"; f.frequency.value = 900;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.02 * v, t + 0.4); g.gain.setValueAtTime(0.02 * v, t + len - 0.2); g.gain.linearRampToValueAtTime(0, t + len + 0.1);
    o.connect(f); f.connect(g); g.connect(music); o.start(t); o.stop(t + len + 0.2);
  });
  const pluck = (t, m, v = 1) => { osc(music, t, "square", hz(m), 0.05 * v, 0.002, 0.07, 0.2); osc(music, t, "triangle", hz(m + 12), 0.04 * v, 0.002, 0.05, -0.2); };
  const riser = (t0, t1) => { // barrido de ruido + sierra que sube
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = noiseBuf; s.loop = true;
    fl.type = "bandpass"; fl.Q.value = 1.4; fl.frequency.setValueAtTime(400, t0); fl.frequency.exponentialRampToValueAtTime(9000, t1);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.28, t1 - 0.02); g.gain.linearRampToValueAtTime(0, t1);
    s.connect(fl); fl.connect(g); g.connect(drums); s.start(t0); s.stop(t1 + 0.05);
    const o = ac.createOscillator(), go = ac.createGain(); o.type = "sawtooth"; o.frequency.setValueAtTime(hz(45), t0); o.frequency.exponentialRampToValueAtTime(hz(69), t1);
    go.gain.setValueAtTime(0.0001, t0); go.gain.exponentialRampToValueAtTime(0.05, t1 - 0.02); go.gain.linearRampToValueAtTime(0, t1);
    const fo = ac.createBiquadFilter(); fo.type = "lowpass"; fo.frequency.value = 2500; o.connect(fo); fo.connect(go); go.connect(music); o.start(t0); o.stop(t1 + 0.05);
  };
  const shutter = (t, dur, up = false) => { // traqueteo metálico de persiana
    const n = Math.round(dur / 0.022);
    for (let i = 0; i < n; i++) {
      const ti = t + i * 0.022 * (up ? 1 - i / (n * 2.2) : 1), v = up ? 0.4 + 0.6 * i / n : 1 - 0.5 * i / n;
      noise(drums, ti, "bandpass", 2600 + ((i * 937) % 1800), 6, 0.16 * v, 0.0008, 0.012, ((i % 3) - 1) * 0.3);
    }
  };

  // ---- armonía (La menor): Am F C G
  const CH = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]];
  const ROOT = [45, 41, 48, 43];
  const HOOK = [76, 0, 72, 74, 0, 76, 79, 0, 76, 0, 72, 0, 74, 72, 69, 0]; // gancho en semicorcheas por compás (0 = silencio)

  // ===== NOCHE (compases 0–2, 0–4,8 s)
  pad(0, [57, 60, 64].map((m) => m - 12), 4.8, 0.9);
  for (let bar = 0; bar < 3; bar++) {
    const t0 = bar * BAR;
    sub(t0, 33, 1.0, 1); sub(t0 + 2.5 * B, 33, 0.35, 0.8);
    kick(t0, 0.9); kick(t0 + 2.5 * B, 0.7);
    snare(t0 + 2 * B, bar === 0 ? 0.6 : 0.9);
    for (let s = 0; s < 16; s++) { const ts = t0 + s * B / 4; if (bar === 0) { if (s % 2 === 0) tick(ts, s % 4 === 0 ? 1 : 0.6); } else hat(ts, s % 4 === 2 ? 1 : 0.55); }
    if (bar === 2) ohat(t0 + 3.5 * B);
  }
  shutter(0.95, 0.27); // la persiana baja (aterriza 1,2 s)

  // ===== SUBIDA (compás 3, 4,8–6,4 s): redoble que acelera, corte de 1/8 al final
  riser(4.8, 6.2);
  for (const [a, b, step] of [[4.8, 5.6, B / 2], [5.6, 6.0, B / 4], [6.0, 6.2, B / 8]]) for (let t = a; t < b - 1e-6; t += step) snare(t, 0.35 + 0.65 * (t - 4.8) / 1.4);
  pad(4.8, [57, 60, 64, 69].map((m) => m - 12), 1.35, 1.4);
  shutter(6.18, 0.24, true); // la persiana sube

  // ===== DROP (compases 4–11, 6,4–19,2 s)
  crash(6.4, 1.2);
  for (let bar = 4; bar < 12; bar++) {
    const t0 = bar * BAR, ci = (bar - 4) % 4, ch = CH[ci], r = ROOT[ci];
    for (let b = 0; b < 4; b++) {
      const tb = t0 + b * B;
      kick(tb); if (b === 1 || b === 3) clap(tb);
      ohat(tb + B / 2, 0.9);
      for (let s = 0; s < 4; s++) hat(tb + s * B / 4, s === 2 ? 0.3 : 0.65, s % 2 ? 0.3 : -0.1);
      bass(tb + B / 2, r + 12, 0.17); bass(tb + B * 0.75, r + (b % 2 ? 19 : 12), 0.1, 0.8);
      if (b !== 0) stab(tb + B / 2, ch, 0.12, 0.9);
    }
    stab(t0, ch.map((m) => m + 12), 0.22, 1.1);
    if (bar >= 6) HOOK.forEach((m, s) => { if (m) pluck(t0 + s * B / 4, m, bar % 2 ? 0.9 : 1); });
  }
  // relleno antes de la frase
  for (let t = 18.8; t < 19.2 - 1e-6; t += B / 4) snare(t, 0.5 + (t - 18.8));

  // ===== FRASE (compás 12, 19,2–20,8 s): break filtrado + persiana que baja
  shutter(19.18, 0.24);
  sub(19.2, 33, 1.4, 1);
  stab(19.2, [57, 60, 64].map((m) => m + 12), 0.5, 1.2, 1600);
  stab(20.0, [53, 57, 60].map((m) => m + 12), 0.4, 1, 1400);
  for (let t = 20.0; t < 20.8 - 1e-6; t += B / 2) { snare(t, 0.4 + 0.6 * (t - 20.0) / 0.8); }
  riser(19.8, 20.78);

  // ===== CIERRE (compases 13–14, 20,8–24 s)
  crash(20.8, 1);
  for (let bar = 13; bar < 15; bar++) {
    const t0 = bar * BAR, ci = (bar - 13) % 4, ch = CH[ci], r = ROOT[ci];
    for (let b = 0; b < 4; b++) {
      const tb = t0 + b * B; if (tb >= 23.2) break;
      kick(tb); if (b === 1 || b === 3) clap(tb, 0.9);
      ohat(tb + B / 2, 0.7);
      bass(tb + B / 2, r + 12, 0.17, 0.9);
      if (b !== 0) stab(tb + B / 2, ch, 0.12, 0.8);
    }
    stab(t0, ch.map((m) => m + 12), 0.22, 1);
  }
  // remate: acorde de La menor con sub y platillo en 23,2 s
  kick(23.2, 1.1); crash(23.2, 1.2); sub(23.2, 33, 0.7, 1.1);
  stab(23.2, [57, 60, 64, 69, 72], 0.5, 1.4, 5000);
};
