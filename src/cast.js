export const CAST = {
  鹿眠: { hair: "#163044", cloth: "#d7e6f0", skin: "#f6e7df", accent: "#1d4e6f" },
  沈知夏: { hair: "#3a2428", cloth: "#f4d5d0", skin: "#f8e6df", accent: "#8f3d48" },
  郁明: { hair: "#2a241c", cloth: "#f3e6c8", skin: "#f3dcc8", accent: "#8a6230" },
  裴望: { hair: "#3a342c", cloth: "#e7e1d8", skin: "#efd8c8", accent: "#3e382f" },
  黍母: { hair: "#4a3030", cloth: "#f6d7c4", skin: "#f3d5c6", accent: "#8d4b32" },
  黍琊: { hair: "#1c140f", cloth: "#f7f1e6", skin: "#f0d8c8", accent: "#2a211c" },
  阿姨: { hair: "#4a4038", cloth: "#efe6d6", skin: "#edd5c4", accent: "#6a5b4a" },
};

const FACES = {
  calm: { eye: 0.5, mouth: "soft", brow: 0, look: 0 },
  soft: { eye: 0.65, mouth: "soft", brow: -1, look: 0 },
  knowing: { eye: 0.35, mouth: "soft", brow: 1, look: 0 },
  distant: { eye: 0.4, mouth: "flat", brow: 0, look: 1 },
  smile: { eye: 0.55, mouth: "smile", brow: -1, look: 0 },
  sting: { eye: 0.85, mouth: "flat", brow: 2, look: 0 },
  serious: { eye: 0.5, mouth: "flat", brow: 2, look: 0 },
  whisper: { eye: 0.28, mouth: "soft", brow: 0, look: -1 },
  quiet: { eye: 0.48, mouth: "flat", brow: 0, look: 0 },
  pause: { eye: 0.95, mouth: "open", brow: 1, look: 0 },
  shy: { eye: 0.32, mouth: "soft", brow: -1, look: -1 },
  hurt: { eye: 0.4, mouth: "down", brow: 2, look: 0 },
  look: { eye: 0.55, mouth: "flat", brow: 0, look: 1 },
  bright: { eye: 0.75, mouth: "smile", brow: -1, look: 0 },
  rival: { eye: 0.55, mouth: "flat", brow: 1, look: 0 },
  blank: { eye: 0.2, mouth: "flat", brow: 0, look: 0, empty: true },
  laugh: { eye: 0.25, mouth: "smile", brow: -2, look: 0 },
  still: { eye: 0.5, mouth: "flat", brow: 0, look: 0 },
  awake: { eye: 0.9, mouth: "flat", brow: 1, look: 0 },
  expect: { eye: 0.6, mouth: "flat", brow: 1, look: 0 },
  gentle: { eye: 0.4, mouth: "smile", brow: -2, look: 0 },
  warm: { eye: 0.6, mouth: "soft", brow: -1, look: 0 },
  stern: { eye: 0.4, mouth: "flat", brow: 2, look: 0 },
  professor: { eye: 0.42, mouth: "flat", brow: 1, look: 0 },
  overlap: { eye: 0.5, mouth: "soft", brow: 0, look: 0, ghost: true },
  disappointed: { eye: 0.35, mouth: "down", brow: 2, look: 0 },
};

const DEFAULT_FACE = {
  鹿眠: "calm",
  沈知夏: "quiet",
  郁明: "bright",
  裴望: "stern",
  黍母: "expect",
  黍琊: "still",
  阿姨: "calm",
};

export const SPRITE_SHEET = {
  鹿眠: {
    id: "lumian",
    poses: ["stand", "lean"],
    faces: ["calm", "soft", "knowing", "distant", "smile", "serious", "whisper", "sting"],
    defaultFace: "calm",
    defaultPose: "stand",
  },
  沈知夏: {
    id: "shen",
    poses: ["stand", "turn"],
    faces: ["quiet", "shy", "hurt", "pause", "smile", "look"],
    defaultFace: "quiet",
    defaultPose: "stand",
  },
  郁明: {
    id: "yu",
    poses: ["stand", "sit"],
    faces: ["bright", "rival", "blank", "sting", "soft"],
    defaultFace: "bright",
    defaultPose: "stand",
  },
  裴望: {
    id: "pei",
    poses: ["stand"],
    faces: ["stern", "soft", "professor", "overlap"],
    defaultFace: "stern",
    defaultPose: "stand",
  },
  黍母: {
    id: "mother",
    poses: ["stand"],
    faces: ["expect", "gentle", "warm"],
    defaultFace: "expect",
    defaultPose: "stand",
  },
  黍琊: {
    id: "suya",
    poses: ["stand"],
    faces: ["still", "awake"],
    defaultFace: "still",
    defaultPose: "stand",
  },
};

export function showMole(who, layer) {
  return who === "沈知夏" && layer !== "dream";
}

export function resolveFace(who, face) {
  const name = face || DEFAULT_FACE[who] || "calm";
  return FACES[name] ? name : "calm";
}

export function nameColor(who) {
  return CAST[who]?.accent || "#f4efe6";
}

export function spriteKey(who, face, pose) {
  const sheet = SPRITE_SHEET[who];
  if (!sheet) return null;
  const faceName = sheet.faces.includes(face) ? face : sheet.defaultFace;
  const poseName = sheet.poses.includes(pose) ? pose : sheet.defaultPose;
  return `${sheet.id}/${poseName}-${faceName}.svg`;
}

export function prepareSprite(svg, who, layer, slot = "live") {
  let out = String(svg).replace(/^\uFEFF?/, "").replace(/<\?xml[\s\S]*?\?>/, "");
  if (!showMole(who, layer)) out = out.replace(/<g id="mole">[\s\S]*?<\/g>/, "");
  const sheet = SPRITE_SHEET[who];
  const prefix = `${slot === "cg" ? "cg" : "sp"}-${sheet?.id || "x"}-${layer === "dream" ? "d" : "r"}`;
  out = out.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`);
  out = out.replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}-${id})`);
  return out;
}

let spriteProvider = () => "";

export function useSpriteProvider(fn) {
  spriteProvider = fn;
}

function auntieMarkup(face) {
  const cast = CAST["阿姨"];
  const mouth =
    face === "pause"
      ? `<ellipse cx="380" cy="500" rx="18" ry="14" fill="#7a4544"/>`
      : `<path d="M330 492 Q380 518 430 492" fill="none" stroke="#7a4544" stroke-width="4" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 760 1200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M250 340 Q380 160 510 340 L540 720 Q380 790 220 720 Z" fill="${cast.hair}"/>
    <ellipse cx="380" cy="250" rx="78" ry="30" fill="#6d5c4c"/>
    <path d="M190 700 L150 1220 H610 L570 700 Q380 620 190 700 Z" fill="${cast.cloth}"/>
    <ellipse cx="380" cy="430" rx="128" ry="150" fill="${cast.skin}"/>
    <path d="M300 400 H348" stroke="#3a2a24" stroke-width="5" stroke-linecap="round"/>
    <path d="M412 400 H460" stroke="#3a2a24" stroke-width="5" stroke-linecap="round"/>
    ${mouth}
  </svg>`;
}

export function spriteMarkup(who, face, pose, layer, slot = "live") {
  if (!CAST[who]) return "";
  const faceName = resolveFace(who, face);
  if (who === "阿姨") return auntieMarkup(faceName);
  const painted = spriteProvider(who, faceName, pose || "stand", layer, slot);
  if (painted) return painted;
  const key = spriteKey(who, faceName, pose || "stand");
  if (!key) return auntieMarkup(faceName);
  return "";
}

function sky(id, top, bottom) {
  return `<defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${top}"/><stop offset="100%" stop-color="${bottom}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky-${id})"/>`;
}

function rect(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

function ell(cx, cy, rx, ry, fill) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
}

function tx(x, y, text, fill, size) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-family="Noto Sans SC, sans-serif" text-anchor="middle">${text}</text>`;
}

const SCENES = {
  classroom: (id) => `
    ${sky(id, "#f0d2b0", "#8a6248")}
    ${rect(0, 620, 1600, 280, "#6b4a38")}
    ${rect(140, 150, 1320, 390, "#214237")}
    ${rect(180, 190, 1240, 300, "#17362d")}
    ${tx(800, 360, "第二", "#d7ece4", 92)}
    ${rect(180, 680, 280, 24, "#c4a07a")}${rect(560, 700, 280, 24, "#c4a07a")}${rect(980, 720, 280, 24, "#c4a07a")}
  `,
  dorm: (id) => `
    ${sky(id, "#241910", "#100c0a")}
    ${rect(0, 640, 1600, 260, "#1a1410")}
    ${rect(220, 250, 760, 420, "#3a2e28")}
    ${rect(250, 280, 700, 18, "#c8b8a4")}${rect(250, 470, 700, 18, "#c8b8a4")}
    ${rect(250, 280, 16, 360, "#c8b8a4")}${rect(934, 280, 16, 360, "#c8b8a4")}
    ${rect(1180, 180, 220, 160, "#1c2830")}
    ${ell(1290, 250, 28, 28, "#f0e2c0")}
    ${rect(80, 220, 70, 40, "#8a9094")}
  `,
  exam: (id) => `
    ${sky(id, "#f7f1e4", "#c3b39a")}
    ${rect(0, 600, 1600, 300, "#d9cbb6")}
    ${rect(200, 80, 120, 70, "#f4efe6")}${tx(260, 124, "7:40", "#3a342c", 28)}
    ${[0, 1, 2, 3, 4].map((col) => [0, 1, 2].map((row) => rect(180 + col * 270, 240 + row * 140, 180, 16, "#8d7b68")).join("")).join("")}
  `,
  home: (id) => `
    ${sky(id, "#4a342c", "#1c1210")}
    ${rect(0, 640, 1600, 260, "#3a2822")}
    ${rect(180, 220, 360, 280, "#142028")}
    ${ell(1180, 520, 90, 28, "#e7c27a")}
    ${rect(980, 540, 400, 24, "#6b4636")}
    ${ell(1180, 430, 16, 70, "#8a6230")}
  `,
  corridor: (id) => `
    ${sky(id, "#6b5144", "#2a211c")}
    ${rect(0, 680, 1600, 220, "#3a2c26")}
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => rect(160 + i * 190, 180, 140, 420, i % 2 ? "#5c463c" : "#4a382f")).join("")}
    ${rect(760, 300, 80, 300, "#1c140f")}
  `,
  roof: (id) => `
    ${sky(id, "#0e1624", "#243044")}
    ${rect(0, 700, 1600, 200, "#1a222c")}
    ${rect(0, 640, 1600, 16, "#d0d6dc")}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => rect(80 + i * 190, 500, 16, 140, "#d0d6dc")).join("")}
    ${[0, 1, 2, 3, 4].map((i) => rect(200 + i * 260, 760, 80, 140, "#121820")).join("")}
    ${ell(240, 120, 2, 2, "#fff")}${ell(480, 80, 2, 2, "#fff")}${ell(900, 140, 2, 2, "#fff")}${ell(1200, 70, 2, 2, "#fff")}
  `,
  rain: (id) => `
    ${sky(id, "#6e7c86", "#2c3840")}
    ${rect(0, 680, 1600, 220, "#1c2830")}
    ${Array.from({ length: 18 }, (_, i) => `<line x1="${40 + i * 90}" y1="0" x2="${20 + i * 90}" y2="900" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>`).join("")}
    ${rect(1080, 360, 220, 340, "#243038")}
  `,
  schoolgate: (id) => `
    ${sky(id, "#f6e2c4", "#87a0b0")}
    ${rect(0, 640, 1600, 260, "#cbb89a")}
    ${rect(460, 260, 40, 400, "#8d5a3c")}${rect(1100, 260, 40, 400, "#8d5a3c")}
    ${rect(460, 220, 680, 50, "#8d5a3c")}
    ${ell(620, 560, 16, 46, "#f7f4ef")}
    ${tx(800, 210, "校门", "#fff8f0", 28)}
  `,
  repeat: (id) => `
    ${sky(id, "#f7e7cf", "#d7b48a")}
    ${rect(0, 630, 1600, 270, "#e6d3b8")}
    ${rect(160, 140, 1280, 360, "#1d3d34")}
    ${tx(800, 340, "312", "#f3f7f4", 120)}
    ${rect(220, 690, 240, 18, "#b08968")}${rect(560, 710, 240, 18, "#b08968")}${rect(900, 690, 240, 18, "#b08968")}
  `,
  examout: (id) => `
    ${sky(id, "#f8e7c8", "#f0f4f2")}
    ${rect(0, 620, 1600, 280, "#d7c4a4")}
    ${rect(180, 300, 36, 340, "#6d5344")}${rect(1380, 300, 36, 340, "#6d5344")}
    ${rect(180, 280, 1236, 28, "#6d5344")}
    ${ell(260, 300, 70, 90, "#6a8f62")}${ell(1340, 320, 80, 100, "#6a8f62")}
    ${tx(800, 250, "考场", "#3a2c24", 36)}
  `,
  lobby: (id) => `
    ${sky(id, "#1c2c3a", "#101820")}
    ${rect(0, 620, 1600, 280, "#243240")}
    ${rect(360, 430, 880, 28, "#d8d2c8")}
    ${rect(420, 458, 760, 180, "#1a242e")}
    ${ell(800, 160, 8, 70, "#e7d7a8")}${ell(760, 180, 6, 6, "#f4e7bf")}${ell(840, 180, 6, 6, "#f4e7bf")}
    ${ell(1180, 360, 46, 46, "#d5e2ea")}${tx(1180, 368, "6/9", "#1c140f", 22)}
  `,
  guest: (id) => `
    ${sky(id, "#243848", "#101820")}
    ${rect(0, 700, 1600, 200, "#1a2834")}
    ${rect(280, 460, 1040, 180, "#f4f7f8")}
    ${rect(280, 420, 1040, 50, "#d5e2ea")}
    ${rect(1180, 180, 240, 200, "#0e1820")}
    ${ell(200, 300, 40, 70, "#8aa4b5")}
  `,
  gate: (id) => `
    ${sky(id, "#9eb4c6", "#182430")}
    ${rect(0, 640, 1600, 260, "#31485a")}
    ${rect(380, 300, 50, 360, "#d5e2ea")}${rect(1170, 300, 50, 360, "#d5e2ea")}
    ${rect(380, 240, 840, 80, "#d5e2ea")}
    ${tx(800, 292, "秦华大学", "#1c2834", 42)}
  `,
  library: (id) => `
    ${sky(id, "#243246", "#101820")}
    ${rect(0, 680, 1600, 220, "#1a2430")}
    ${[0, 1, 2, 3, 4, 5].map((i) => rect(120 + i * 230, 120, 70, 560, "#3d5166")).join("")}
    ${rect(860, 300, 160, 300, "#9eb4c6")}
    ${ell(800, 80, 40, 16, "#f4e7bf")}
  `,
  lab: (id) => `
    ${sky(id, "#152028", "#0e181c")}
    ${rect(0, 660, 1600, 240, "#1a2830")}
    ${rect(160, 500, 1280, 28, "#3a4a52")}
    ${rect(220, 300, 200, 140, "#7eb8c8")}${rect(520, 260, 240, 180, "#9fd0c8")}${rect(860, 320, 180, 120, "#6aa0b0")}
    ${rect(1180, 280, 16, 220, "#c9d6dc")}
  `,
  cafeteria: (id) => `
    ${sky(id, "#c4b49a", "#5c4a3a")}
    ${rect(0, 560, 1600, 340, "#6a5848")}
    ${rect(180, 300, 1240, 36, "#e7d7c4")}
    ${rect(180, 336, 1240, 160, "#8a7260")}
    ${ell(420, 470, 70, 18, "#d8d0c4")}${ell(760, 490, 70, 18, "#d8d0c4")}${ell(1100, 470, 70, 18, "#d8d0c4")}
  `,
  award: (id) => `
    ${sky(id, "#2a241c", "#100e0c")}
    ${rect(0, 620, 1600, 280, "#3a342c")}
    <polygon points="700,80 900,80 1100,620 500,620" fill="rgba(255,244,214,0.28)"/>
    ${rect(700, 460, 200, 160, "#c4b49a")}
    ${ell(800, 200, 40, 16, "#f4e7bf")}
  `,
  white: (id) => `
    <defs><radialGradient id="sky-${id}" cx="50%" cy="42%" r="60%"><stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#e7e2da"/><stop offset="100%" stop-color="#b7b1a8"/></radialGradient></defs>
    <rect width="1600" height="900" fill="url(#sky-${id})"/>
    <ellipse cx="800" cy="460" rx="26" ry="70" fill="rgba(80,80,80,0.18)"/>
  `,
  calendar: (id) => `
    ${sky(id, "#1c2c3a", "#101820")}
    ${rect(0, 640, 1600, 260, "#243240")}
    ${rect(500, 160, 600, 460, "#f4f7f8")}
    ${rect(500, 160, 600, 70, "#8aa4b5")}
    ${tx(800, 430, "6月9日", "#1c2834", 84)}
  `,
  pork: (id) => `
    ${sky(id, "#c4b49a", "#4a3c32")}
    ${rect(0, 560, 1600, 340, "#5c4a3a")}
    ${rect(460, 180, 680, 80, "#f4efe6")}
    ${tx(800, 232, "今日 青菜", "#3a342c", 36)}
    ${ell(800, 560, 160, 36, "#f7f4ef")}
    ${ell(800, 548, 90, 28, "#8f3d32")}
  `,
  no301: (id) => `
    ${sky(id, "#18242e", "#0e1418")}
    ${rect(0, 680, 1600, 220, "#24303a")}
    ${rect(180, 180, 280, 460, "#3a4a56")}${tx(320, 420, "302", "#d5e2ea", 42)}
    ${rect(1140, 180, 280, 460, "#3a4a56")}${tx(1280, 420, "303", "#d5e2ea", 42)}
    ${rect(620, 220, 360, 420, "#141c22")}
  `,
  plaque: (id) => `
    ${sky(id, "#8aa4b5", "#182430")}
    ${rect(360, 220, 880, 360, "#e7eef2")}
    ${tx(800, 400, "秦华大学", "#1c2834", 78)}
    <text x="818" y="418" fill="#7f9aab" font-size="78" opacity="0.55" text-anchor="middle" font-family="Noto Sans SC, sans-serif">秦华大学</text>
  `,
  faceless: (id) => `
    ${sky(id, "#2a241c", "#100e0c")}
    ${rect(0, 600, 1600, 300, "#3a342c")}
    <polygon points="760,40 860,40 980,420 640,420" fill="rgba(255,244,214,0.35)"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => ell(180 + i * 200, 700, 36, 48, "#d9d3c8")).join("")}
  `,
  diary: (id) => `
    ${sky(id, "#3a3028", "#1a1410")}
    ${rect(0, 620, 1600, 280, "#4a3c32")}
    ${rect(460, 300, 680, 360, "#f4efe6")}
    ${rect(790, 300, 8, 360, "#c4b49a")}
    ${tx(800, 470, "这不是我的人生", "#3a2420", 36)}
  `,
};

export const SCENE_NAMES = {
  classroom: "教室",
  dorm: "宿舍",
  exam: "考场",
  home: "家里",
  corridor: "走廊",
  roof: "天台",
  rain: "雨",
  schoolgate: "校门口",
  repeat: "复读教室",
  examout: "考场外",
  lobby: "酒店大堂",
  guest: "客房",
  gate: "秦华校门",
  library: "图书馆",
  lab: "实验室",
  cafeteria: "食堂",
  award: "颁奖台",
  white: "白光",
  calendar: "停摆的日历",
  pork: "红烧肉",
  no301: "没有的门",
  plaque: "匾额",
  faceless: "无脸的掌声",
  diary: "写错的日记",
};

export function sceneMarkup(id) {
  const draw = SCENES[id] || SCENES.dorm;
  return `<svg class="scene" data-scene="${id}" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${draw(id)}</svg>`;
}

export function sceneIds() {
  return Object.keys(SCENES);
}

export const CGS = [
  { id: "cg_rank", title: "一模放榜", scene: "classroom", who: "郁明", face: "bright", layer: "real", caption: "全市第二。和郁明差三分。" },
  { id: "cg_bed", title: "考点之夜失眠", scene: "dorm", who: "黍琊", face: "still", pose: "sit", layer: "real", caption: "九十厘米。翻身要拆成六步。" },
  { id: "cg_white", title: "白光选择", scene: "white", who: "鹿眠", face: "distant", layer: "limen", caption: "有个人影。看不清她的脸。" },
  { id: "cg_desk", title: "酒店前台初遇", scene: "lobby", who: "鹿眠", face: "knowing", layer: "dream", caption: "她看着你，像已经等了一会儿。" },
  { id: "cg_exam_ok", title: "高考顺利出考场", scene: "examout", who: "黍琊", face: "still", layer: "dream", caption: "笔是稳的。太阳白得不真实。" },
  { id: "cg_gate", title: "秦华校门", scene: "gate", who: "黍琊", face: "sting", layer: "dream", caption: "匾额像是新的。笔画好像多了一笔。" },
  { id: "cg_journal", title: "实验室顶刊", scene: "lab", who: "裴望", face: "professor", layer: "dream", caption: "二十岁。名字印在第一行。" },
  { id: "cg_faceless", title: "颁奖台无脸", scene: "faceless", who: "裴望", face: "overlap", layer: "dream", caption: "台下的人在鼓掌。没有脸。" },
  { id: "cg_wake", title: "梦醒", scene: "dorm", who: "黍琊", face: "awake", layer: "real", caption: "心跳还在。床是铁的。" },
  { id: "cg_repeat", title: "复读教室", scene: "repeat", who: "裴望", face: "soft", layer: "real", caption: "倒计时从三百多天开始。" },
  { id: "cg_outside", title: "二考考场外", scene: "examout", who: "黍琊", face: "awake", layer: "real", caption: "这次不是梦里的白光。" },
  { id: "cg_reunion", title: "秦华重逢", scene: "gate", who: "鹿眠", face: "smile", layer: "real", caption: "校门没有多出来的笔画。" },
];

export function cgMarkup(id) {
  const cg = CGS.find((item) => item.id === id);
  if (!cg) return "";
  const cast = cg.who ? spriteMarkup(cg.who, cg.face, cg.pose || "stand", cg.layer, "cg") : "";
  return `<div class="cg cg-${cg.layer} cg-${cg.id}"><div class="cg-scene">${sceneMarkup(cg.scene)}</div><div class="cg-cast">${cast}</div><div class="cg-copy"><p>${cg.title}</p><span>${cg.caption}</span></div></div>`;
}

export const TRACKS = [
  { id: "june", title: "六月" },
  { id: "bed", title: "窄床" },
  { id: "exam", title: "第一场" },
  { id: "rain", title: "早醒的雨" },
  { id: "white", title: "白光" },
  { id: "cradle", title: "梦的温床" },
  { id: "qinhua", title: "校门" },
  { id: "lamp", title: "闭馆" },
  { id: "pork", title: "同一道菜" },
  { id: "crack", title: "裂缝" },
  { id: "lab", title: "灯还亮着" },
  { id: "applause", title: "掌声" },
  { id: "home", title: "睡够了，就回家" },
  { id: "heart", title: "心跳" },
  { id: "awake", title: "醒来之后" },
  { id: "together", title: "一起醒" },
];

export const FRAGMENTS = [
  { id: "second", title: "全市第二", text: "一模差郁明三分。那条缝后来被梦填满了。" },
  { id: "bed", title: "铁架床", text: "九十厘米。翻身要拆成六步，像拆一颗炸弹。" },
  { id: "white", title: "白光", text: "候考室的灯，又像什么都不是。光的另一头站着一个人。" },
  { id: "june9", title: "6 月 9 日", text: "所有日历都停在这一天。你从未见过 6 月 10 日的太阳。" },
  { id: "plaque", title: "匾额", text: "校名好像多了一笔。再看一眼，字又正了。刺还在。" },
  { id: "pork", title: "红烧肉", text: "食堂第四天端出同一道菜。阿姨说食堂没有红烧肉，你低头，盘子里分明是。" },
  { id: "status", title: "应届还是复读", text: "你答过。全班没有人记得你的答案。" },
  { id: "mole", title: "胎记", text: "沈知夏右眼角的痣，在梦里消失了。你问出口的那一刻，她的笑脸停顿了零点三秒。" },
  { id: "mother", title: "太温柔的母亲", text: "梦里的她从不说重话。永远是同一句。" },
  { id: "room301", title: "301", text: "八楼没有这个房号，但你的房卡每天都在刷它。" },
  { id: "lastyear", title: "去年的奖", text: "裴教授宣读年度最年轻学者，年份是去年。全场没有人觉得奇怪。" },
  { id: "gohome", title: "睡够了，就回家", text: "八个字。她的语气像在提醒一个忘记退房的客人。" },
  { id: "heart", title: "心跳", text: "梦里的你从来不会有心跳。大厅的钟停在六月九日六点。" },
  { id: "alarm", title: "六点的闹钟", text: "把梦醒的那一天，改成重新出发的那一天。" },
  { id: "milk", title: "热牛奶", text: "高考那两天，考点门口有人递过一杯热牛奶。你始终想不起她的脸。" },
  { id: "faceless", title: "无脸", text: "颁奖台下的人在鼓掌。嘴巴的位置是平的。" },
];

export const CHAPTERS = [
  "序章 · 一模之后",
  "第一章 · 考点之夜",
  "第二章 · 白光的选项",
  "第三章 · 重来之日",
  "第四章 · 梦的裂缝",
  "终章 · 醒来之后",
];

export const ENDING_GATES = {
  A: "第二章选择【认命，接受成绩单】",
  TRUE: "违和感达到 60，第四章选择【醒来】，终章走完复读",
  B: "第四章选择【留下】，学术值达到 60",
  C: "第四章选择【留下】，学术值不到 60",
  E: "二周目，违和感达到 75，鹿眠达到 50，终章选择【我们是不是见过】",
};

export const DREAM_END_HINT = "回看第三章，找出你没有追问的那件事。";

export function trackTitle(id) {
  return TRACKS.find((item) => item.id === id)?.title || "";
}
