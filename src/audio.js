export const EFFECT_IDS = [
  "creak",
  "snore",
  "ac",
  "rain",
  "heart",
  "alarm",
  "card",
  "chime",
  "page",
  "pen",
  "drop",
];

const PATTERNS = {
  june: { scale: [0, 2, 4, 7, 9], tempo: 0.62, base: 220, wave: "triangle" },
  bed: { scale: [0, 1, 5, 7], tempo: 0.9, base: 110, wave: "sine" },
  exam: { scale: [0, 2, 3, 7, 8], tempo: 0.48, base: 196, wave: "square" },
  rain: { scale: [0, 3, 5, 10], tempo: 0.7, base: 174, wave: "sine" },
  white: { scale: [0, 7, 12], tempo: 1.1, base: 392, wave: "sine" },
  cradle: { scale: [0, 3, 5, 7, 10], tempo: 0.58, base: 196, wave: "triangle" },
  qinhua: { scale: [0, 4, 7, 11], tempo: 0.52, base: 247, wave: "triangle" },
  lamp: { scale: [0, 2, 5, 9], tempo: 0.74, base: 165, wave: "sine" },
  pork: { scale: [0, 1, 6, 7], tempo: 0.46, base: 233, wave: "square" },
  crack: { scale: [0, 1, 6, 8], tempo: 0.38, base: 185, wave: "sawtooth" },
  lab: { scale: [0, 2, 6, 9, 12], tempo: 0.5, base: 155, wave: "square" },
  applause: { scale: [0, 5, 7, 12], tempo: 0.42, base: 262, wave: "triangle" },
  home: { scale: [0, 5, 7, 12, 16], tempo: 0.8, base: 294, wave: "sine" },
  heart: { scale: [0, 0, 3, 7], tempo: 0.34, base: 98, wave: "sine" },
  awake: { scale: [0, 2, 4, 7, 9, 12], tempo: 0.56, base: 262, wave: "triangle" },
  together: { scale: [0, 4, 7, 12, 16], tempo: 0.66, base: 330, wave: "sine" },
};

const VOICE = {
  鹿眠: 520,
  沈知夏: 440,
  郁明: 330,
  裴望: 180,
  黍母: 240,
  阿姨: 300,
};

export function createScore() {
  let ctx = null;
  let musicGain = null;
  let seGain = null;
  let acGain = null;
  let timer = null;
  let current = null;
  let step = 0;
  let wanted = null;
  let volumes = { bgm: 0.6, se: 0.45 };
  let layer = "real";

  function ensure() {
    if (ctx) return true;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = volumes.bgm;
    musicGain.connect(master);
    seGain = ctx.createGain();
    seGain.gain.value = 1;
    seGain.connect(master);
    acGain = ctx.createGain();
    acGain.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 280;
    const noise = ctx.createBufferSource();
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    noise.loop = true;
    noise.connect(filter);
    filter.connect(acGain);
    acGain.connect(master);
    noise.start();
    return true;
  }

  function setAc() {
    if (!acGain || !ctx) return;
    const target = layer === "dream" ? 0.02 * volumes.se : 0;
    acGain.gain.setTargetAtTime(Math.max(0.0001, target), ctx.currentTime, 0.15);
    if (target === 0) acGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
  }

  function musicNote(freq, pattern) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = pattern.wave;
    osc.frequency.value = freq;
    const peak = 0.07 * volumes.bgm;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + pattern.tempo * 0.9);
    osc.connect(gain);
    gain.connect(musicGain);
    osc.start();
    osc.stop(ctx.currentTime + pattern.tempo);
  }

  function loop() {
    const pattern = PATTERNS[current];
    if (!pattern || !ctx) return;
    const degree = pattern.scale[step % pattern.scale.length];
    musicNote(pattern.base * 2 ** (degree / 12), pattern);
    step += 1;
  }

  function start(id) {
    if (!PATTERNS[id]) return;
    if (current === id && timer) return;
    if (timer) clearInterval(timer);
    current = id;
    step = 0;
    if (!ctx) return;
    loop();
    timer = setInterval(loop, PATTERNS[id].tempo * 1000);
  }

  function blip(freq, dur, type, peak) {
    if (!ctx || volumes.se <= 0) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * volumes.se), ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(seGain);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  }

  function noiseHit(dur, peak, freq) {
    if (!ctx || volumes.se <= 0) return;
    const source = ctx.createBufferSource();
    const length = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peak * volumes.se, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(seGain);
    source.start();
  }

  function effect(name) {
    if (!ensure()) return;
    if (ctx.state === "suspended") return;
    if (name === "creak") {
      blip(180, 0.22, "sawtooth", 0.05);
      noiseHit(0.18, 0.08, 700);
    } else if (name === "snore") {
      blip(90, 0.4, "sine", 0.06);
    } else if (name === "ac") {
      noiseHit(0.35, 0.05, 400);
    } else if (name === "rain") {
      noiseHit(0.5, 0.07, 1200);
    } else if (name === "heart") {
      blip(70, 0.12, "sine", 0.1);
      setTimeout(() => blip(60, 0.16, "sine", 0.08), 160);
    } else if (name === "alarm") {
      blip(880, 0.12, "square", 0.04);
      setTimeout(() => blip(880, 0.12, "square", 0.04), 180);
    } else if (name === "card") {
      noiseHit(0.08, 0.1, 1800);
      blip(1400, 0.06, "square", 0.03);
    } else if (name === "chime") {
      blip(1320, 0.4, "sine", 0.04);
    } else if (name === "page") {
      noiseHit(0.1, 0.06, 2200);
    } else if (name === "pen") {
      noiseHit(0.16, 0.04, 3000);
    } else if (name === "drop") {
      drop();
    }
  }

  function drop() {
    if (!musicGain || !ctx) return;
    const now = ctx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(Math.max(0.0001, volumes.bgm), now);
    musicGain.gain.linearRampToValueAtTime(0.0001, now + 0.04);
    musicGain.gain.linearRampToValueAtTime(Math.max(0.0001, volumes.bgm), now + 0.34);
  }

  return {
    unlock() {
      if (!ensure()) return;
      ctx.resume();
      setAc();
      if (wanted) start(wanted);
    },
    play(id) {
      wanted = id;
      if (!ctx) return;
      start(id);
    },
    drop,
    effect,
    voice(who) {
      const freq = VOICE[who];
      if (!freq) return;
      blip(freq, 0.16, "sine", 0.035);
      blip(freq * 1.5, 0.1, "triangle", 0.015);
    },
    setLayer(next) {
      layer = next || "real";
      setAc();
    },
    setVolumes(next) {
      volumes = { bgm: next.bgm ?? volumes.bgm, se: next.se ?? volumes.se };
      if (musicGain) musicGain.gain.value = Math.max(0.0001, volumes.bgm);
      setAc();
    },
    currentId() {
      return current;
    },
  };
}
