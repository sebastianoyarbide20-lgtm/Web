// Banda sonora del reel ALIAR ROSARIO · «Barrio pop»
// 120 BPM (negra = 0,5 s, compás = 2 s), Fa mayor. 26 s.
// Se renderiza offline con OfflineAudioContext (render-score.cjs) a assets/audio/musica.wav.
// Cada corte de escena cae en un cambio de acorde; el cierre (21 s) llega a la tónica tras un corte.
window.SCORE_DUR = 26;
window.SCORE = (ac) => {
  const BEAT = 0.5;
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // ---- cadena de salida: compresor suave + reverb de sala sembrada (idéntica en cada render)
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 3; comp.attack.value = 0.005; comp.release.value = 0.15;
  comp.connect(ac.destination);
  const master = ac.createGain(); master.gain.value = 0.8; master.connect(comp);
  // fade-out final 24,7 → 26
  master.gain.setValueAtTime(0.8, 24.7); master.gain.linearRampToValueAtTime(0.0001, 25.95);
  const rev = ac.createConvolver(), wet = ac.createGain(); wet.gain.value = 0.16; rev.connect(wet); wet.connect(master);
  {
    const n = Math.round(ac.sampleRate * 1.3), ir = ac.createBuffer(2, n, ac.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let s = 1234 + c * 77; for (let i = 0; i < n; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = (s / 0x7fffffff * 2 - 1) * Math.pow(1 - i / n, 3.2); } }
    rev.buffer = ir;
  }
  const bus = ac.createGain(); bus.connect(master); bus.connect(rev);
  const noiseBuf = (() => { const n = ac.sampleRate, b = ac.createBuffer(1, n, n), d = b.getChannelData(0); let s = 4242; for (let i = 0; i < n; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = s / 0x7fffffff * 2 - 1; } return b; })();

  const env = (g, t, a, peak, tau) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + a, tau); };
  function tone(t, type, f, peak, a, tau, pan = 0, f2 = null, glide = 0.05) {
    const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + glide);
    p.pan.value = pan; env(g, t, a, peak, tau); o.connect(g); g.connect(p); p.connect(bus); o.start(t); o.stop(t + a + tau * 8);
  }
  function noise(t, type, f, q, peak, a, tau, pan = 0) {
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    s.buffer = noiseBuf; fl.type = type; fl.frequency.value = f; fl.Q.value = q; p.pan.value = pan;
    env(g, t, a, peak, tau); s.connect(fl); fl.connect(g); g.connect(p); p.connect(bus); s.start(t, (t * 7.31) % 0.5); s.stop(t + a + tau * 8);
  }

  // ---- instrumentos
  const marimba = (t, m, v = 1, pan = 0) => {
    tone(t, "sine", hz(m), 0.16 * v, 0.002, 0.16, pan);
    tone(t, "sine", hz(m) * 3.93, 0.045 * v, 0.001, 0.025, pan);
    tone(t, "triangle", hz(m) * 2, 0.03 * v, 0.002, 0.05, pan);
  };
  const bell = (t, m, v = 1) => { // glockenspiel suave para la melodía
    tone(t, "sine", hz(m), 0.07 * v, 0.002, 0.35, 0.15);
    tone(t, "sine", hz(m) * 2.76, 0.02 * v, 0.001, 0.12, 0.15);
  };
  const bass = (t, m, len, v = 1) => {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = "triangle"; o.frequency.value = hz(m); o2.type = "sawtooth"; o2.frequency.value = hz(m); o2.detune.value = 4;
    f.type = "lowpass"; f.frequency.value = 760; f.Q.value = 0.8; // armónicos audibles en un parlante de celular
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2 * v, t + 0.012); g.gain.setTargetAtTime(0, t + len * 0.75, 0.05);
    const g2 = ac.createGain(); g2.gain.value = 0.35; o.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(bus);
    o.start(t); o2.start(t); o.stop(t + len + 0.4); o2.stop(t + len + 0.4);
  };
  const kick = (t, v = 1) => tone(t, "sine", 140, 0.55 * v, 0.002, 0.11, 0, 48, 0.09);
  const snap = (t, v = 1) => { noise(t, "bandpass", 1900, 1.1, 0.32 * v, 0.001, 0.045, -0.1); noise(t + 0.011, "bandpass", 2400, 1.3, 0.18 * v, 0.001, 0.05, 0.1); };
  const shaker = (t, v = 1, pan = 0.35) => noise(t, "highpass", 6800, 0.8, 0.07 * v, 0.008, 0.028, pan);
  const pad = (t, notes, len, v = 1) => notes.forEach((m, i) => {
    const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = "triangle"; o.frequency.value = hz(m); o.detune.value = (i - 1) * 7; f.type = "lowpass"; f.frequency.value = 1800;
    const pk = 0.028 * v; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pk, t + 0.35); g.gain.setValueAtTime(pk, t + len - 0.25); g.gain.linearRampToValueAtTime(0, t + len + 0.15);
    o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(t + len + 0.25);
  });
  const shimmer = (t) => { noise(t, "highpass", 5200, 0.6, 0.12, 0.004, 0.5, 0); };

  // ---- armonía (Fa mayor). [inicio en negras, acorde (MIDI), bajo]
  const F = [65, 69, 72], C = [64, 67, 72], Dm = [62, 65, 69], Bb = [62, 65, 70];
  const CH = [
    [0, F, 41], [4, C, 36], [8, Dm, 38], [12, Bb, 34], [16, F, 41], [20, C, 36], [24, Dm, 38], [28, Bb, 34],
    [32, F, 41], [36, Bb, 34], [40, C, 36], [42, F, 41], [46, Bb, 34], [48, F, 41],
  ];
  const chordAt = (b) => { let c = CH[0]; for (const x of CH) if (x[0] <= b) c = x; return c; };

  // ---- secciones (en negras): qué capas suenan
  // 0–8 gancho · 8–12 sola · 12–16 llegan · 16–20 isotipo · 20–40 beneficios/promesa · 40–41 dominante · 41–42 corte · 42–52 cierre
  const layers = (b) => {
    if (b < 8) return ["kick2", "marimba", "shaker8", "bass", "snap"];
    if (b < 12) return ["lonely", "pad"];
    if (b < 16) return ["kick2", "marimba", "bass", "pad"];
    if (b < 20) return ["kick2", "marimba", "bass", "snap", "shaker8"];
    if (b < 40) return ["kick4", "marimba", "bass8", "snap", "shaker16", b >= 20 && b < 32 ? "bell" : "pad"];
    if (b < 41) return ["kick4", "marimba", "bass8", "snap", "shaker16"];
    if (b < 42) return []; // corte: medio compás de silencio antes del logo
    return ["kick2", "marimba", "bass", "snap", "shaker8", "pad"];
  };

  const MELODY = { 20: 77, 21: 76, 22: 72, 23.5: 74, 24: 74, 25: 72, 26: 69, 27.5: 72, 28: 70, 29: 69, 30: 65, 31.5: 67 };
  const ARP = [0, 1, 2, 1, 0, 2, 1, 2]; // índices del acorde por corchea

  for (let b = 0; b < 52; b++) {
    const t = b * BEAT, L = layers(b), [cs, ch, root] = chordAt(b), beatInBar = b % 4;
    if (L.includes("kick4")) kick(t);
    if (L.includes("kick2") && (beatInBar === 0 || beatInBar === 2)) kick(t, 0.85);
    if (L.includes("snap") && (beatInBar === 1 || beatInBar === 3)) snap(t, b < 20 ? 0.75 : 1);
    if (L.includes("bass") && (beatInBar === 0 || beatInBar === 2 || b === cs)) bass(t, root, 0.9);
    if (L.includes("bass8")) { bass(t, root, 0.22); if (beatInBar === 1 || beatInBar === 3) bass(t + 0.25, root + 12, 0.18, 0.8); else bass(t + 0.25, root, 0.18, 0.7); }
    if (L.includes("pad") && b === cs) { const len = ((CH.find((x) => x[0] > cs) || [52])[0] - cs) * BEAT; pad(t, ch.map((m) => m - 12), Math.min(len, (52 - b) * BEAT)); }
    for (let e = 0; e < 2; e++) {
      const te = t + e * 0.25, idx = ARP[(b * 2 + e) % 8];
      if (L.includes("marimba")) marimba(te, ch[idx] + (e === 1 && beatInBar === 3 ? 12 : 0), e ? 0.75 : 1, e ? 0.25 : -0.15);
      if (L.includes("shaker8")) shaker(te, e ? 1 : 0.6);
      if (L.includes("shaker16")) { shaker(te, e ? 1 : 0.6); shaker(te + 0.125, 0.45, -0.3); }
    }
    if (L.includes("lonely") && (beatInBar === 0 || beatInBar === 3)) marimba(t, beatInBar === 0 ? 65 : 69, 0.8, 0);
    if (L.includes("bell")) { for (const k of [b, b + 0.5]) if (MELODY[k]) bell(k * BEAT, MELODY[k]); }
  }
  // llegada a la tónica en el cierre: acorde lleno + brillo
  [53, 65, 69, 72, 77].forEach((m, i) => marimba(21 + i * 0.012, m, 0.9, (i - 2) * 0.15));
  shimmer(21);
};
