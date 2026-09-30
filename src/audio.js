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

export const EFFECTS = {
  creak: ({ blip, noiseHit }) => {
    blip(180, 0.22, "sawtooth", 0.05);
    noiseHit(0.18, 0.08, 700);
  },
  snore: ({ blip, noiseHit }) => {
    noiseHit(0.38, 0.1, 240);
    blip(92, 0.38, "sine", 0.045);
    setTimeout(() => {
      noiseHit(0.62, 0.08, 150);
      blip(68, 0.62, "sine", 0.035);
    }, 480);
  },
  ac: ({ noiseHit, blip }) => {
    noiseHit(0.7, 0.04, 280);
    blip(96, 0.7, "sine", 0.02);
  },
  rain: ({ noiseHit }) => {
    noiseHit(0.9, 0.07, 1400);
    noiseHit(0.9, 0.04, 700);
  },
  heart: ({ blip }) => {
    blip(78, 0.09, "sine", 0.11);
    setTimeout(() => blip(54, 0.16, "sine", 0.08), 150);
  },
  alarm: ({ blip }) => {
    blip(880, 0.12, "square", 0.04);
    setTimeout(() => blip(880, 0.12, "square", 0.04), 180);
  },
  card: ({ blip, noiseHit }) => {
    noiseHit(0.08, 0.1, 1800);
    blip(1400, 0.06, "square", 0.03);
  },
  chime: ({ blip }) => blip(1320, 0.4, "sine", 0.04),
  page: ({ noiseHit }) => noiseHit(0.1, 0.06, 2200),
  pen: ({ noiseHit }) => noiseHit(0.16, 0.04, 3000),
  drop: ({ drop }) => drop(),
  phone: ({ blip }) => blip(740, 0.18, "sine", 0.04),
  clock: ({ blip }) => {
    blip(1800, 0.03, "square", 0.03);
    setTimeout(() => blip(900, 0.05, "sine", 0.02), 70);
  },
  door: ({ noiseHit }) => noiseHit(0.2, 0.08, 280),
  elevator: ({ blip }) => blip(420, 0.3, "triangle", 0.03),
  applause: ({ noiseHit }) => {
    noiseHit(0.35, 0.06, 1800);
    setTimeout(() => noiseHit(0.4, 0.05, 900), 120);
  },
  wind: ({ noiseHit }) => {
    noiseHit(0.8, 0.05, 420);
    noiseHit(0.8, 0.03, 180);
  },
  water: ({ noiseHit }) => noiseHit(0.25, 0.05, 900),
  paper: ({ noiseHit }) => noiseHit(0.12, 0.05, 2500),
  click: ({ blip }) => blip(240, 0.04, "square", 0.04),
  step: ({ noiseHit }) => noiseHit(0.08, 0.06, 180),
  bell: ({ blip }) => blip(660, 0.35, "sine", 0.04),
  crowd: ({ noiseHit }) => noiseHit(0.4, 0.05, 800),
  cup: ({ blip }) => blip(520, 0.08, "triangle", 0.04),
  key: ({ noiseHit }) => noiseHit(0.1, 0.07, 1400),
  notice: ({ blip }) => blip(1170, 0.08, "sine", 0.03),
  chair: ({ noiseHit }) => noiseHit(0.12, 0.06, 240),
  breath: ({ noiseHit }) => noiseHit(0.3, 0.03, 500),
  knock: ({ noiseHit }) => noiseHit(0.06, 0.08, 320),
  static: ({ noiseHit }) => noiseHit(0.2, 0.04, 2000),
};

export const EFFECT_IDS = Object.keys(EFFECTS);

const VOICE = {
  鹿眠: 520,
  沈知夏: 440,
  郁明: 330,
  裴望: 180,
  黍母: 240,
  阿姨: 300,
};

export const SCENE_BEDS = {
  classroom: "class",
  dorm: "dorm",
  exam: "exam",
  home: "home",
  corridor: "corridor",
  roof: "wind",
  rain: "rain",
  schoolgate: "outdoor",
  repeat: "class",
  examout: "outdoor",
  lobby: "hotel",
  guest: "hotel",
  gate: "outdoor",
  library: "library",
  lab: "lab",
  cafeteria: "canteen",
  award: "award",
  white: "void",
  calendar: "uneasy",
  pork: "canteen",
  no301: "uneasy",
  plaque: "outdoor",
  faceless: "award",
  diary: "home",
};

const MOOD = {
  calm: { gain: 1, rate: 1, cutoff: 1 },
  hurt: { gain: 0.7, rate: 1.28, cutoff: 0.68 },
  sting: { gain: 0.66, rate: 1.34, cutoff: 0.6 },
  distant: { gain: 0.52, rate: 1.4, cutoff: 0.52 },
  blank: { gain: 0.48, rate: 1.45, cutoff: 0.48 },
  whisper: { gain: 0.58, rate: 1.18, cutoff: 0.74 },
  serious: { gain: 0.8, rate: 1.12, cutoff: 0.8 },
  stern: { gain: 0.78, rate: 1.08, cutoff: 0.76 },
  smile: { gain: 1.06, rate: 0.9, cutoff: 1.16 },
  soft: { gain: 0.94, rate: 1, cutoff: 1.05 },
  warm: { gain: 1, rate: 0.94, cutoff: 1.1 },
  shy: { gain: 0.84, rate: 1.1, cutoff: 0.88 },
  quiet: { gain: 0.8, rate: 1.14, cutoff: 0.84 },
  knowing: { gain: 0.9, rate: 1, cutoff: 0.94 },
  pause: { gain: 0.58, rate: 1.22, cutoff: 0.66 },
  bright: { gain: 1.06, rate: 0.88, cutoff: 1.18 },
  rival: { gain: 0.96, rate: 0.94, cutoff: 1 },
  gentle: { gain: 0.92, rate: 1.04, cutoff: 1.02 },
  expect: { gain: 0.9, rate: 1.06, cutoff: 0.96 },
  look: { gain: 0.88, rate: 1.04, cutoff: 0.98 },
  professor: { gain: 0.76, rate: 1.1, cutoff: 0.78 },
  overlap: { gain: 0.6, rate: 1.3, cutoff: 0.58 },
};

const HEART_MOODS = new Set(["sting", "hurt", "pause"]);

let voiceProvider = () => ({});

export function useVoiceProvider(clips) {
  voiceProvider = () => clips;
}

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

  let voiceAudio = null;
  let mood = "calm";
  let lastMood = "";
  let wantedScene = "";
  let bedName = "";
  let bedToken = 0;
  let bedTimers = [];
  let bedNodes = [];
  let ambientGain = null;
  let ducked = false;

  function moodSpec() {
    return MOOD[mood] || MOOD.calm;
  }

  function effect(name) {
    if (!ensure()) return;
    if (ctx.state === "suspended") return;
    const play = EFFECTS[name];
    if (play) play({ blip, noiseHit, drop });
  }

  function ensureAmbient() {
    if (ambientGain || !ctx) return;
    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.0001;
    ambientGain.connect(seGain);
  }

  function clearBed() {
    bedToken += 1;
    for (const timer of bedTimers) clearTimeout(timer);
    bedTimers = [];
    for (const node of bedNodes) {
      try {
        node.stop?.();
      } catch {
        /* already stopped */
      }
      try {
        node.disconnect?.();
      } catch {
        /* already disconnected */
      }
    }
    bedNodes = [];
  }

  function later(fn, ms, token) {
    const timer = setTimeout(() => {
      bedTimers = bedTimers.filter((item) => item !== timer);
      if (token !== bedToken) return;
      fn();
    }, ms);
    bedTimers.push(timer);
  }

  function loopNoise(freq, peak, type = "lowpass") {
    if (!ctx) return null;
    const source = ctx.createBufferSource();
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = type === "bandpass" ? 0.7 : 0.6;
    const gain = ctx.createGain();
    gain.gain.value = peak;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ambientGain);
    source.start();
    source.baseFreq = freq;
    source.filter = filter;
    bedNodes.push(source);
    return source;
  }

  function tone(freq, peak) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = peak;
    osc.connect(gain);
    gain.connect(ambientGain);
    osc.start();
    bedNodes.push(osc);
  }

  function applyMood() {
    if (!ambientGain || !ctx) return;
    const spec = moodSpec();
    const dream = layer === "dream" ? 0.7 : layer === "limen" ? 0.35 : 1;
    const duck = ducked ? 0.45 : 1;
    const target = 0.9 * volumes.se * spec.gain * dream * duck;
    ambientGain.gain.setTargetAtTime(Math.max(0.0001, target), ctx.currentTime, 0.25);
    for (const node of bedNodes) {
      if (!node.filter) continue;
      const cutoff = (node.baseFreq || 800) * spec.cutoff * (layer === "dream" ? 0.82 : 1);
      node.filter.frequency.setTargetAtTime(Math.max(80, cutoff), ctx.currentTime, 0.25);
    }
  }

  function snoreOnce() {
    noiseHit(0.36, 0.11, 230);
    blip(88, 0.36, "sine", 0.04);
    later(
      () => {
        noiseHit(0.58, 0.08, 140);
        blip(64, 0.55, "sine", 0.03);
      },
      460,
      bedToken,
    );
  }

  function schedule(fn, gap) {
    const token = bedToken;
    later(() => {
      fn();
      schedule(fn, gap);
    }, gap * moodSpec().rate * (layer === "dream" ? 1.18 : 1), token);
  }

  function startBed(name) {
    if (!ctx || ctx.state === "suspended") return;
    if (bedName === name && bedNodes.length) {
      applyMood();
      return;
    }
    clearBed();
    bedName = name;
    ensureAmbient();
    if (name === "dorm") {
      loopNoise(180, 0.35, "lowpass");
      tone(96, 0.04);
      schedule(snoreOnce, 3200);
    } else if (name === "exam") {
      loopNoise(500, 0.08, "highpass");
      schedule(() => effect("clock"), 1000);
      schedule(() => effect("pen"), 2400);
    } else if (name === "home") {
      loopNoise(300, 0.12, "lowpass");
      schedule(() => effect("clock"), 2000);
    } else if (name === "class") {
      loopNoise(700, 0.16, "bandpass");
      schedule(() => effect("paper"), 2800);
      schedule(() => effect("crowd"), 4200);
    } else if (name === "corridor") {
      loopNoise(400, 0.1, "lowpass");
      schedule(() => effect("step"), 1700);
    } else if (name === "wind") {
      loopNoise(320, 0.45, "lowpass");
      loopNoise(140, 0.2, "lowpass");
    } else if (name === "rain") {
      loopNoise(1600, 0.4, "highpass");
      loopNoise(600, 0.28, "bandpass");
    } else if (name === "outdoor") {
      loopNoise(480, 0.22, "lowpass");
      schedule(() => blip(1480 + Math.random() * 400, 0.12, "sine", 0.02), 3600);
    } else if (name === "hotel") {
      loopNoise(220, 0.28, "lowpass");
      tone(110, 0.025);
    } else if (name === "library") {
      loopNoise(350, 0.1, "lowpass");
      schedule(() => effect("page"), 3400);
    } else if (name === "lab") {
      tone(120, 0.03);
      loopNoise(900, 0.08, "bandpass");
    } else if (name === "canteen") {
      loopNoise(800, 0.22, "bandpass");
      schedule(() => effect("cup"), 2200);
      schedule(() => effect("crowd"), 3000);
    } else if (name === "award") {
      loopNoise(1400, 0.18, "bandpass");
      schedule(() => effect("applause"), 1600);
    } else if (name === "void") {
      tone(740, 0.012);
    } else if (name === "uneasy") {
      tone(92, 0.03);
      loopNoise(240, 0.16, "lowpass");
      schedule(() => effect("clock"), 2600);
    }
    applyMood();
  }

  function duck(on) {
    ducked = on;
    if (musicGain && ctx) {
      const target = Math.max(0.0001, volumes.bgm * (on ? 0.38 : 1));
      musicGain.gain.setTargetAtTime(target, ctx.currentTime, 0.12);
    }
    applyMood();
  }

  function stopVoice() {
    if (voiceAudio) {
      voiceAudio.pause();
      voiceAudio = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    duck(false);
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
      if (wantedScene) startBed(SCENE_BEDS[wantedScene] || "");
    },
    play(id) {
      wanted = id;
      if (!ctx) return;
      start(id);
    },
    drop,
    effect,
    setScene(id) {
      const next = id || "";
      if (next !== wantedScene) {
        mood = "calm";
        lastMood = "";
      }
      wantedScene = next;
      if (!ctx || ctx.state === "suspended") return;
      startBed(wantedScene ? SCENE_BEDS[wantedScene] || "" : "");
    },
    setMood(face) {
      const next = face && MOOD[face] ? face : "calm";
      const changed = next !== lastMood;
      mood = next;
      lastMood = next;
      applyMood();
      if (changed && HEART_MOODS.has(next)) effect("heart");
    },
    voice(who, text, face) {
      if (!who || volumes.se <= 0) return;
      stopVoice();
      const clips = voiceProvider();
      const clip = text ? clips[`${who}\u0000${face || ""}\u0000${text}`] : "";
      if (clip && typeof Audio !== "undefined") {
        const audio = new Audio(clip);
        audio.volume = Math.min(1, 0.95 * Math.max(0.2, volumes.se));
        voiceAudio = audio;
        duck(true);
        audio.addEventListener("ended", () => {
          if (voiceAudio === audio) duck(false);
        });
        audio.play().catch(() => duck(false));
        return;
      }
      if (typeof window !== "undefined" && window.speechSynthesis && text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "zh-CN";
        const men = who === "郁明" || who === "裴望";
        utterance.pitch = men ? 0.8 : 1.15;
        utterance.rate = moodSpec().rate > 1.15 ? 0.86 : 0.94;
        const voices = window.speechSynthesis.getVoices().filter((item) => item.lang.toLowerCase().startsWith("zh"));
        if (voices.length) utterance.voice = voices[men ? Math.min(1, voices.length - 1) : 0];
        duck(true);
        utterance.onend = () => duck(false);
        window.speechSynthesis.speak(utterance);
        return;
      }
      const freq = VOICE[who];
      if (!freq) return;
      blip(freq, 0.18, "sine", 0.04);
      blip(freq * 1.25, 0.12, "triangle", 0.02);
    },
    setLayer(next) {
      layer = next || "real";
      setAc();
      applyMood();
    },
    setVolumes(next) {
      volumes = { bgm: next.bgm ?? volumes.bgm, se: next.se ?? volumes.se };
      if (musicGain && !ducked) musicGain.gain.value = Math.max(0.0001, volumes.bgm);
      setAc();
      applyMood();
      if (volumes.se <= 0) stopVoice();
    },
    currentId() {
      return current;
    },
  };
}
