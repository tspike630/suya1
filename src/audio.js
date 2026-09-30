let musicProvider = () => ({});

export function useMusicProvider(clips) {
  musicProvider = () => clips;
}

export const EFFECTS = {
  creak: ({ noiseHit }) => noiseHit(0.14, 0.04, 320),
  snore: ({ noiseHit }) => {
    noiseHit(0.36, 0.05, 180);
    setTimeout(() => noiseHit(0.5, 0.04, 120), 420);
  },
  ac: ({ noiseHit }) => noiseHit(0.45, 0.02, 220),
  rain: ({ noiseHit }) => noiseHit(0.7, 0.035, 900),
  heart: ({ noiseHit }) => {
    noiseHit(0.08, 0.06, 90);
    setTimeout(() => noiseHit(0.12, 0.04, 70), 150);
  },
  alarm: ({ noiseHit }) => {
    noiseHit(0.08, 0.03, 1400);
    setTimeout(() => noiseHit(0.1, 0.025, 1600), 240);
  },
  card: ({ noiseHit }) => noiseHit(0.05, 0.03, 1200),
  chime: ({ noiseHit }) => noiseHit(0.2, 0.02, 1800),
  page: ({ noiseHit }) => noiseHit(0.08, 0.03, 2000),
  pen: ({ noiseHit }) => noiseHit(0.1, 0.02, 2600),
  drop: ({ drop }) => drop(),
  phone: ({ noiseHit }) => {
    noiseHit(0.12, 0.025, 800);
    setTimeout(() => noiseHit(0.12, 0.02, 800), 280);
  },
  clock: ({ noiseHit }) => noiseHit(0.03, 0.025, 1400),
  door: ({ noiseHit }) => noiseHit(0.16, 0.04, 240),
  elevator: ({ noiseHit }) => noiseHit(0.28, 0.02, 300),
  applause: ({ noiseHit }) => noiseHit(0.3, 0.03, 1000),
  wind: ({ noiseHit }) => noiseHit(0.55, 0.03, 360),
  water: ({ noiseHit }) => noiseHit(0.22, 0.025, 700),
  paper: ({ noiseHit }) => noiseHit(0.08, 0.025, 2200),
  click: ({ noiseHit }) => noiseHit(0.03, 0.02, 800),
  step: ({ noiseHit }) => noiseHit(0.06, 0.03, 160),
  bell: ({ noiseHit }) => noiseHit(0.16, 0.02, 900),
  crowd: ({ noiseHit }) => noiseHit(0.28, 0.02, 600),
  cup: ({ noiseHit }) => noiseHit(0.05, 0.025, 1400),
  key: ({ noiseHit }) => noiseHit(0.06, 0.03, 1100),
  notice: ({ noiseHit }) => noiseHit(0.06, 0.02, 1600),
  chair: ({ noiseHit }) => noiseHit(0.08, 0.03, 220),
  breath: ({ noiseHit }) => noiseHit(0.24, 0.015, 400),
  knock: ({ noiseHit }) => noiseHit(0.05, 0.04, 280),
  static: ({ noiseHit }) => noiseHit(0.12, 0.02, 1800),
};

export const EFFECT_IDS = Object.keys(EFFECTS);

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
  let seGain = null;
  let musicAudio = null;
  let current = null;
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
    seGain = ctx.createGain();
    seGain.gain.value = 1;
    seGain.connect(master);
    return true;
  }

  function setAc() {}

  function musicVolume() {
    return Math.min(1, Math.max(0, volumes.bgm * (ducked ? 0.32 : 0.72)));
  }

  function stopMusic() {
    if (musicAudio) {
      musicAudio.pause();
      musicAudio = null;
    }
  }

  function start(id) {
    const url = musicProvider()[id];
    if (!url) return;
    if (current === id && musicAudio && !musicAudio.paused) return;
    stopMusic();
    current = id;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = musicVolume();
    musicAudio = audio;
    audio.play().catch(() => {});
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

  function applyMood() {
    if (!ambientGain || !ctx) return;
    const spec = moodSpec();
    const dream = layer === "dream" ? 0.7 : layer === "limen" ? 0.35 : 1;
    const duck = ducked ? 0.45 : 1;
    const target = 0.14 * volumes.se * spec.gain * dream * duck;
    ambientGain.gain.setTargetAtTime(Math.max(0.0001, target), ctx.currentTime, 0.25);
    for (const node of bedNodes) {
      if (!node.filter) continue;
      const cutoff = (node.baseFreq || 800) * spec.cutoff * (layer === "dream" ? 0.82 : 1);
      node.filter.frequency.setTargetAtTime(Math.max(80, cutoff), ctx.currentTime, 0.25);
    }
  }

  function snoreOnce() {
    noiseHit(0.32, 0.045, 180);
    later(() => noiseHit(0.46, 0.035, 120), 460, bedToken);
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
      loopNoise(180, 0.12, "lowpass");
      schedule(snoreOnce, 4200);
    } else if (name === "exam") {
      loopNoise(420, 0.04, "lowpass");
      schedule(() => effect("clock"), 4000);
    } else if (name === "home") {
      loopNoise(260, 0.05, "lowpass");
    } else if (name === "class") {
      loopNoise(640, 0.05, "bandpass");
      schedule(() => effect("paper"), 5200);
    } else if (name === "corridor") {
      loopNoise(360, 0.04, "lowpass");
      schedule(() => effect("step"), 3600);
    } else if (name === "wind") {
      loopNoise(280, 0.14, "lowpass");
    } else if (name === "rain") {
      loopNoise(1400, 0.12, "highpass");
      loopNoise(520, 0.08, "bandpass");
    } else if (name === "outdoor") {
      loopNoise(420, 0.07, "lowpass");
    } else if (name === "hotel") {
      loopNoise(200, 0.08, "lowpass");
    } else if (name === "library") {
      loopNoise(320, 0.04, "lowpass");
      schedule(() => effect("page"), 6400);
    } else if (name === "lab") {
      loopNoise(700, 0.04, "bandpass");
    } else if (name === "canteen") {
      loopNoise(720, 0.07, "bandpass");
      schedule(() => effect("cup"), 4800);
    } else if (name === "award") {
      loopNoise(1100, 0.05, "bandpass");
    } else if (name === "uneasy") {
      loopNoise(200, 0.06, "lowpass");
    }
    applyMood();
  }

  function duck(on) {
    ducked = on;
    if (musicAudio) musicAudio.volume = musicVolume();
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
    if (!musicAudio || ducked) return;
    musicAudio.volume = musicVolume() * 0.4;
    setTimeout(() => {
      if (musicAudio && !ducked) musicAudio.volume = musicVolume();
    }, 480);
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
      }
    },
    setLayer(next) {
      layer = next || "real";
      setAc();
      applyMood();
    },
    setVolumes(next) {
      volumes = { bgm: next.bgm ?? volumes.bgm, se: next.se ?? volumes.se };
      if (musicAudio) musicAudio.volume = musicVolume();
      setAc();
      applyMood();
      if (volumes.se <= 0) stopVoice();
    },
    currentId() {
      return current;
    },
  };
}
