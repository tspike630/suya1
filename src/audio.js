const SHAPES = {
  M: [0, 4, 7],
  m: [0, 3, 7],
  M7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  sus: [0, 5, 7],
};

function piece(bpm, chords, melody) {
  const events = [];
  let bars = 4;
  for (const [b, root, kind, len, vel] of chords) {
    bars = Math.max(bars, Math.ceil((b + len) / 4));
    events.push({ b, n: SHAPES[kind].map((interval) => root + interval), v: vel ?? 0.24, l: len });
  }
  for (const [b, note, len, vel] of melody) {
    bars = Math.max(bars, Math.ceil((b + len) / 4));
    events.push({ b, n: [note], v: vel ?? 0.38, l: len });
  }
  return { bpm, bars, events };
}

const PIECES = {
  june: piece(68, [
    [0, 48, "M", 4], [4, 45, "m", 4], [8, 41, "M", 4], [12, 43, "M", 4],
    [16, 48, "M", 4], [20, 45, "m", 4], [24, 41, "M", 4], [28, 43, "M", 4],
  ], [
    [0, 76, 2], [2, 79, 2], [4, 81, 2], [6, 79, 2],
    [8, 77, 2], [10, 74, 2], [12, 79, 4],
    [16, 81, 2], [18, 84, 2], [20, 81, 2], [22, 79, 2],
    [24, 77, 2], [26, 76, 2], [28, 72, 4],
  ]),
  bed: piece(52, [
    [0, 45, "m", 8], [8, 40, "m", 8], [16, 45, "m", 8], [24, 38, "M", 8],
  ], [
    [0, 69, 4], [4, 72, 4], [8, 68, 4], [12, 64, 4],
    [16, 69, 4], [20, 67, 4], [24, 65, 8],
  ]),
  exam: piece(56, [
    [0, 38, "m", 8, 0.16], [8, 41, "M", 8, 0.16], [16, 36, "m", 8, 0.16], [24, 43, "m", 8, 0.16],
  ], [
    [2, 65, 4, 0.28], [10, 69, 4, 0.26], [18, 67, 6, 0.24],
  ]),
  rain: piece(62, [
    [0, 41, "M", 4], [4, 48, "M", 4], [8, 38, "m", 4], [12, 46, "M", 4],
    [16, 41, "M", 4], [20, 48, "M", 4], [24, 43, "m", 4], [28, 41, "M", 4],
  ], [
    [0, 69, 2], [2, 72, 2], [4, 74, 2], [6, 72, 2],
    [8, 70, 4], [12, 69, 4], [16, 74, 2], [18, 77, 2], [20, 74, 4], [24, 72, 4], [28, 69, 4],
  ]),
  white: piece(46, [
    [0, 60, "M", 16, 0.1], [16, 64, "M", 16, 0.1],
  ], [
    [4, 84, 6, 0.22], [14, 88, 4, 0.18], [24, 86, 8, 0.16],
  ]),
  cradle: piece(60, [
    [0, 48, "M7", 8], [8, 45, "m7", 8], [16, 41, "M7", 8], [24, 43, "M", 8],
  ], [
    [0, 72, 4], [4, 76, 4], [8, 79, 4], [12, 76, 4],
    [16, 74, 4], [20, 72, 4], [24, 71, 4], [28, 72, 4],
  ]),
  qinhua: piece(74, [
    [0, 43, "M", 4], [4, 38, "M", 4], [8, 40, "m", 4], [12, 48, "M", 4],
    [16, 43, "M", 4], [20, 38, "M", 4], [24, 41, "M", 4], [28, 43, "M", 4],
  ], [
    [0, 79, 2], [2, 83, 2], [4, 81, 2], [6, 79, 2],
    [8, 76, 2], [10, 79, 2], [12, 83, 4],
    [16, 86, 2], [18, 83, 2], [20, 81, 2], [22, 79, 2], [24, 78, 4], [28, 79, 4],
  ]),
  lamp: piece(56, [
    [0, 40, "m", 8], [8, 36, "M", 8], [16, 43, "M", 8], [24, 38, "M", 8],
  ], [
    [1, 67, 3], [4, 71, 4], [8, 72, 4], [12, 69, 4],
    [16, 67, 4], [20, 64, 4], [24, 62, 8],
  ]),
  pork: piece(66, [
    [0, 48, "M", 4], [4, 43, "M", 4], [8, 45, "m", 4], [12, 41, "M", 4],
    [16, 48, "M", 4], [20, 43, "M", 4], [24, 45, "m", 4], [28, 48, "M", 4],
  ], [
    [0, 72, 1], [1, 76, 1], [2, 79, 2], [4, 76, 2], [6, 74, 2],
    [8, 72, 2], [10, 69, 2], [12, 71, 4], [16, 76, 2], [18, 79, 2], [20, 77, 4], [24, 74, 4], [28, 72, 4],
  ]),
  crack: piece(50, [
    [0, 38, "m", 8, 0.18], [8, 41, "m", 8, 0.18], [16, 34, "M", 8, 0.16], [24, 36, "m", 8, 0.16],
  ], [
    [0, 65, 3, 0.26], [3, 66, 1, 0.18], [4, 65, 4, 0.24],
    [8, 68, 4, 0.22], [12, 63, 4, 0.2], [16, 61, 8, 0.22], [24, 62, 8, 0.18],
  ]),
  lab: piece(62, [
    [0, 45, "m", 4], [4, 41, "M", 4], [8, 48, "M", 4], [12, 43, "M", 4],
    [16, 45, "m", 4], [20, 40, "m", 4], [24, 36, "M", 4], [28, 43, "M", 4],
  ], [
    [0, 69, 2], [2, 72, 2], [4, 76, 4], [8, 74, 2], [10, 72, 2], [12, 69, 4],
    [16, 72, 4], [20, 76, 4], [24, 74, 4], [28, 69, 4],
  ]),
  applause: piece(66, [
    [0, 48, "M", 4], [4, 41, "M", 4], [8, 43, "M", 4], [12, 48, "M", 4],
    [16, 45, "m", 4], [20, 41, "M", 4], [24, 43, "M", 4], [28, 48, "M", 4],
  ], [
    [0, 76, 2], [2, 79, 2], [4, 72, 2], [6, 76, 2],
    [8, 79, 4], [12, 84, 4], [16, 81, 4], [20, 79, 4], [24, 76, 4], [28, 72, 4],
  ]),
  home: piece(64, [
    [0, 41, "M", 4], [4, 48, "M", 4], [8, 38, "m", 4], [12, 46, "M", 4],
    [16, 41, "M", 4], [20, 36, "M", 4], [24, 43, "M", 4], [28, 41, "M", 4],
  ], [
    [0, 65, 2], [2, 69, 2], [4, 72, 2], [6, 69, 2],
    [8, 70, 4], [12, 67, 4], [16, 69, 2], [18, 72, 2], [20, 74, 4], [24, 72, 4], [28, 65, 4],
  ]),
  heart: piece(48, [
    [0, 45, "m", 8, 0.2], [8, 41, "m", 8, 0.18], [16, 40, "m", 8, 0.18], [24, 36, "M", 8, 0.16],
  ], [
    [0, 48, 1, 0.22], [2, 48, 1, 0.16], [4, 48, 1, 0.22], [6, 48, 1, 0.16],
    [8, 69, 6, 0.3], [16, 67, 6, 0.26], [24, 64, 8, 0.24],
  ]),
  awake: piece(72, [
    [0, 48, "M", 4], [4, 43, "M", 4], [8, 45, "m", 4], [12, 41, "M", 4],
    [16, 48, "M", 4], [20, 43, "M", 4], [24, 45, "m", 4], [28, 48, "M", 4],
  ], [
    [0, 72, 2], [2, 76, 2], [4, 79, 2], [6, 76, 2],
    [8, 74, 2], [10, 72, 2], [12, 71, 2], [14, 72, 2],
    [16, 76, 2], [18, 79, 2], [20, 84, 4], [24, 81, 2], [26, 79, 2], [28, 76, 4],
  ]),
  together: piece(70, [
    [0, 48, "M", 4], [4, 45, "m", 4], [8, 41, "M", 4], [12, 43, "M", 4],
    [16, 48, "M", 4], [20, 45, "m7", 4], [24, 41, "M", 4], [28, 48, "M", 4],
  ], [
    [0, 76, 2], [2, 79, 2], [4, 81, 2], [6, 84, 2],
    [8, 83, 4], [12, 79, 4], [16, 81, 2], [18, 84, 2], [20, 86, 4], [24, 84, 2], [26, 81, 2], [28, 84, 4],
  ]),
};

export const EFFECTS = {
  creak: ({ blip, noiseHit }) => {
    blip(196, 0.16, "triangle", 0.03);
    noiseHit(0.12, 0.035, 480);
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
    blip(784, 0.16, "sine", 0.03);
    setTimeout(() => blip(880, 0.18, "sine", 0.025), 220);
  },
  card: ({ blip, noiseHit }) => {
    noiseHit(0.06, 0.04, 1400);
    blip(988, 0.05, "sine", 0.02);
  },
  chime: ({ blip }) => blip(1320, 0.4, "sine", 0.04),
  page: ({ noiseHit }) => noiseHit(0.1, 0.06, 2200),
  pen: ({ noiseHit }) => noiseHit(0.16, 0.04, 3000),
  drop: ({ drop }) => drop(),
  phone: ({ blip }) => blip(740, 0.18, "sine", 0.04),
  clock: ({ blip }) => {
    blip(1568, 0.025, "sine", 0.018);
    setTimeout(() => blip(1174, 0.04, "sine", 0.012), 80);
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
  click: ({ blip, noiseHit }) => {
    noiseHit(0.04, 0.03, 900);
    blip(520, 0.03, "sine", 0.015);
  },
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
  let musicTimers = [];
  let musicToken = 0;
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
    musicGain = ctx.createGain();
    musicGain.gain.value = volumes.bgm;
    const musicFilter = ctx.createBiquadFilter();
    musicFilter.type = "lowpass";
    musicFilter.frequency.value = 2400;
    musicGain.connect(musicFilter);
    musicFilter.connect(master);
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
    const target = layer === "dream" ? 0.006 * volumes.se : 0;
    acGain.gain.setTargetAtTime(Math.max(0.0001, target), ctx.currentTime, 0.15);
    if (target === 0) acGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
  }

  function pianoNote(midi, velocity, beats, beatSec) {
    const freq = 440 * 2 ** ((midi - 69) / 12);
    const now = ctx.currentTime;
    const dur = Math.max(0.45, beats * beatSec * 0.92);
    const voice = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900 + velocity * 1600, now);
    filter.frequency.exponentialRampToValueAtTime(520, now + dur);
    voice.connect(filter);
    filter.connect(musicGain);
    const peak = 0.16 * velocity;
    voice.gain.setValueAtTime(0.0001, now);
    voice.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + 0.018);
    voice.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * 0.38), now + 0.22);
    voice.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    const partials = [
      [1, 1],
      [2, 0.32],
      [3, 0.14],
      [4, 0.06],
    ];
    for (const [ratio, amp] of partials) {
      const osc = ctx.createOscillator();
      const partial = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * ratio;
      partial.gain.value = amp;
      osc.connect(partial);
      partial.connect(voice);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    }
  }

  function stopMusic() {
    musicToken += 1;
    if (timer) clearTimeout(timer);
    timer = null;
    for (const id of musicTimers) clearTimeout(id);
    musicTimers = [];
  }

  function armPiece(id, origin, loopIndex, token) {
    const score = PIECES[id];
    if (!score || token !== musicToken || !ctx) return;
    const beat = 60 / score.bpm;
    const loopBeats = score.bars * 4;
    const startAt = origin + loopIndex * loopBeats * beat;
    for (const event of score.events) {
      const when = startAt + event.b * beat;
      const wait = (when - ctx.currentTime) * 1000;
      if (wait < -30) continue;
      const timeout = setTimeout(() => {
        if (token !== musicToken || !ctx) return;
        for (const midi of event.n) pianoNote(midi, event.v, event.l, beat);
      }, Math.max(0, wait));
      musicTimers.push(timeout);
    }
    const nextIn = (startAt + loopBeats * beat - ctx.currentTime) * 1000 - 120;
    timer = setTimeout(() => armPiece(id, origin, loopIndex + 1, token), Math.max(40, nextIn));
  }

  function start(id) {
    if (!PIECES[id]) return;
    if (current === id && timer) return;
    stopMusic();
    current = id;
    if (!ctx) return;
    const token = musicToken;
    armPiece(id, ctx.currentTime + 0.06, 0, token);
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
    const target = 0.14 * volumes.se * spec.gain * dream * duck;
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
    } else if (name === "void") {
      tone(740, 0.006);
    } else if (name === "uneasy") {
      loopNoise(200, 0.06, "lowpass");
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
    if (!musicGain || !ctx || ducked) return;
    const now = ctx.currentTime;
    const base = Math.max(0.0001, volumes.bgm);
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(base, now);
    musicGain.gain.linearRampToValueAtTime(base * 0.62, now + 0.12);
    musicGain.gain.linearRampToValueAtTime(base, now + 0.7);
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
