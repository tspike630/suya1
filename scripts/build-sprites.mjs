import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("src/sprites");
const EYE_L = 304;
const EYE_R = 456;
const EYE_Y = 352;

const EXPR = {
  calm: { eye: "open", look: 0, brow: "soft", mouth: "soft", blush: 0.28 },
  soft: { eye: "soft", look: 0, brow: "lift", mouth: "small-smile", blush: 0.42 },
  knowing: { eye: "narrow", look: 0, brow: "asym", mouth: "smirk", blush: 0.16 },
  distant: { eye: "open", look: 1, brow: "flat", mouth: "flat", blush: 0.1 },
  smile: { eye: "crescent", look: 0, brow: "lift", mouth: "smile", blush: 0.5 },
  serious: { eye: "focus", look: 0, brow: "down", mouth: "line", blush: 0.06 },
  whisper: { eye: "heavy", look: -0.6, brow: "soft", mouth: "whisper", blush: 0.22 },
  sting: { eye: "tight", look: 0, brow: "angry", mouth: "down", blush: 0.08 },
  quiet: { eye: "open", look: 0, brow: "flat", mouth: "flat", blush: 0.34 },
  shy: { eye: "down", look: -1, brow: "shy", mouth: "tiny", blush: 0.9 },
  hurt: { eye: "wet", look: 0, brow: "sad", mouth: "down", blush: 0.18 },
  pause: { eye: "wide", look: 0, brow: "up", mouth: "open", blush: 0.22 },
  look: { eye: "open", look: 1, brow: "flat", mouth: "flat", blush: 0.28 },
  bright: { eye: "bright", look: 0, brow: "up", mouth: "grin", blush: 0.36 },
  rival: { eye: "sharp", look: 0, brow: "asym", mouth: "smirk", blush: 0.12 },
  blank: { eye: "empty", look: 0, brow: "flat", mouth: "flat", blush: 0 },
  stern: { eye: "stern", look: 0, brow: "stern", mouth: "line", blush: 0 },
  professor: { eye: "steady", look: 0, brow: "level", mouth: "soft", blush: 0.08 },
  overlap: { eye: "soft", look: 0, brow: "soft", mouth: "soft", blush: 0.12, ghost: true },
  expect: { eye: "open", look: 0, brow: "expect", mouth: "closed", blush: 0.2 },
  gentle: { eye: "crescent", look: 0, brow: "lift", mouth: "big-smile", blush: 0.48 },
  warm: { eye: "tired", look: 0, brow: "soft", mouth: "warm", blush: 0.32, lines: true },
  still: { eye: "heavy", look: 0, brow: "low", mouth: "flat", blush: 0.08 },
  awake: { eye: "wide", look: 0, brow: "alert", mouth: "part", blush: 0.14 },
};

function eye(type, cx, look) {
  const x = cx + look * 18;
  const y = EYE_Y;
  const iris = "url(#irisG)";
  const white = (rx, ry) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fffdfb"/>`;
  const ball = (rx, ry, dy = 1) =>
    `<ellipse cx="${x}" cy="${y + dy}" rx="${rx}" ry="${ry}" fill="${iris}"/><ellipse cx="${x}" cy="${y + dy + 1}" rx="${rx * 0.42}" ry="${ry * 0.48}" fill="#140e0c"/><circle cx="${x - rx * 0.35}" cy="${y - ry * 0.28}" r="${Math.max(2.2, rx * 0.22)}" fill="#fff"/>`;
  const lash = (d, width) =>
    `<path d="${d}" fill="none" stroke="#241810" stroke-width="${width}" stroke-linecap="round"/>`;
  if (type === "crescent") {
    return lash(`M ${x - 26} ${y + 6} Q ${x} ${y - 18} ${x + 26} ${y + 6}`, 4.2);
  }
  if (type === "empty") {
    return lash(`M ${x - 16} ${y} H ${x + 16}`, 4);
  }
  if (type === "tight") {
    return `${lash(`M ${x - 22} ${y + 2} Q ${x} ${y - 4} ${x + 20} ${y + 6}`, 4.4)}${lash(`M ${x - 18} ${y + 8} Q ${x} ${y + 12} ${x + 16} ${y + 8}`, 2)}`;
  }
  if (type === "wide") {
    return `${white(26, 20)}${ball(12, 13, 2)}${lash(`M ${x - 28} ${y - 2} Q ${x} ${y - 24} ${x + 28} ${y - 2}`, 3)}`;
  }
  if (type === "bright") {
    return `${white(24, 18)}${ball(13, 14)}${circle(x - 6, y - 5, 3.4, "#fff")}${circle(x + 4, y + 2, 1.6, "#fff")}${lash(`M ${x - 26} ${y} Q ${x} ${y - 22} ${x + 26} ${y}`, 2.6)}`;
  }
  if (type === "narrow" || type === "stern") {
    return `${white(22, 7)}${ball(9, 6.5)}${lash(`M ${x - 24} ${y - 1} Q ${x} ${y - 8} ${x + 24} ${y - 1}`, 3.4)}`;
  }
  if (type === "heavy") {
    return `${white(22, 14)}${ball(10, 11)}${drawPath(`M ${x - 24} ${y - 2} Q ${x} ${y + 6} ${x + 24} ${y - 2} L ${x + 22} ${y - 16} Q ${x} ${y - 22} ${x - 22} ${y - 16} Z`, "url(#skin)")}${lash(`M ${x - 24} ${y} Q ${x} ${y + 2} ${x + 24} ${y}`, 2.4)}`;
  }
  if (type === "down") {
    const py = y + 6;
    return `${white(20, 12)}${`<ellipse cx="${x - 2}" cy="${py}" rx="9" ry="10" fill="${iris}"/><ellipse cx="${x - 2}" cy="${py + 2}" rx="4" ry="5" fill="#140e0c"/>`}${drawPath(`M ${x - 22} ${y - 4} Q ${x} ${y + 4} ${x + 22} ${y - 2} L ${x + 20} ${y - 14} Q ${x} ${y - 8} ${x - 20} ${y - 14} Z`, "url(#skin)")}`;
  }
  if (type === "wet") {
    return `${white(23, 16)}${ball(11, 12)}${lash(`M ${x - 24} ${y} Q ${x} ${y - 18} ${x + 24} ${y}`, 2.4)}${drawPath(`M ${x + 16} ${y + 16} Q ${x + 22} ${y + 36} ${x + 12} ${y + 34} Q ${x + 8} ${y + 22} ${x + 16} ${y + 16} Z`, "rgba(190,220,230,0.85)")}`;
  }
  if (type === "sharp") {
    return `${drawPath(`M ${x - 24} ${y} L ${x + 18} ${y - 8} L ${x + 26} ${y + 2} L ${x + 8} ${y + 12} L ${x - 22} ${y + 6} Z`, "#fffdfb")}${ball(10, 9)}${lash(`M ${x - 26} ${y - 2} L ${x + 20} ${y - 12}`, 3)}`;
  }
  if (type === "focus") {
    return `${white(21, 11)}${ball(9, 10)}${lash(`M ${x - 24} ${y - 2} L ${x + 24} ${y - 6}`, 3.2)}`;
  }
  if (type === "soft") {
    return `${white(22, 13)}${ball(10, 11)}${lash(`M ${x - 24} ${y} Q ${x} ${y - 16} ${x + 24} ${y - 2}`, 2.5)}`;
  }
  if (type === "steady") {
    return `${white(21, 12)}${ball(10, 11)}${lash(`M ${x - 22} ${y - 1} Q ${x} ${y - 12} ${x + 22} ${y - 1}`, 2.8)}`;
  }
  if (type === "tired") {
    return `${white(22, 11)}${ball(9, 8, 2)}${drawPath(`M ${x - 22} ${y + 6} Q ${x} ${y + 14} ${x + 22} ${y + 6}`, "none", "#c9a090", 2.2)}${lash(`M ${x - 23} ${y - 1} Q ${x} ${y - 8} ${x + 23} ${y + 1}`, 2.6)}`;
  }
  return `${white(22, 15)}${ball(11, 12)}${lash(`M ${x - 24} ${y} Q ${x} ${y - 18} ${x + 24} ${y}`, 2.6)}`;
}

function circle(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

function drawPath(d, fill, stroke, width) {
  const strokeAttr = stroke ? ` stroke="${stroke}" stroke-width="${width}"` : "";
  return `<path d="${d}" fill="${fill}"${strokeAttr}/>`;
}

function eyes(type, look) {
  return `<g id="features-eyes">${eye(type, EYE_L, look)}${eye(type, EYE_R, look)}</g>`;
}

function brow(kind) {
  const y = 312;
  const pairs = {
    soft: [`M ${EYE_L - 26} ${y + 2} Q ${EYE_L} ${y - 6} ${EYE_L + 26} ${y}`, `M ${EYE_R - 26} ${y} Q ${EYE_R} ${y - 6} ${EYE_R + 26} ${y + 2}`],
    lift: [`M ${EYE_L - 26} ${y + 6} Q ${EYE_L} ${y - 10} ${EYE_L + 26} ${y - 2}`, `M ${EYE_R - 26} ${y - 2} Q ${EYE_R} ${y - 10} ${EYE_R + 26} ${y + 6}`],
    flat: [`M ${EYE_L - 24} ${y + 4} H ${EYE_L + 24}`, `M ${EYE_R - 24} ${y + 4} H ${EYE_R + 24}`],
    down: [`M ${EYE_L - 26} ${y - 4} Q ${EYE_L} ${y + 8} ${EYE_L + 24} ${y + 6}`, `M ${EYE_R - 24} ${y + 6} Q ${EYE_R} ${y + 8} ${EYE_R + 26} ${y - 4}`],
    angry: [`M ${EYE_L - 28} ${y - 10} L ${EYE_L + 24} ${y + 8}`, `M ${EYE_R - 24} ${y + 8} L ${EYE_R + 28} ${y - 10}`],
    asym: [`M ${EYE_L - 26} ${y + 6} Q ${EYE_L} ${y - 2} ${EYE_L + 24} ${y + 4}`, `M ${EYE_R - 24} ${y + 8} Q ${EYE_R} ${y - 12} ${EYE_R + 26} ${y - 6}`],
    sad: [`M ${EYE_L - 26} ${y + 10} Q ${EYE_L} ${y - 8} ${EYE_L + 22} ${y - 2}`, `M ${EYE_R - 22} ${y - 2} Q ${EYE_R} ${y - 8} ${EYE_R + 26} ${y + 10}`],
    shy: [`M ${EYE_L - 24} ${y + 8} Q ${EYE_L} ${y} ${EYE_L + 22} ${y + 6}`, `M ${EYE_R - 22} ${y + 6} Q ${EYE_R} ${y} ${EYE_R + 24} ${y + 8}`],
    up: [`M ${EYE_L - 26} ${y + 8} Q ${EYE_L} ${y - 14} ${EYE_L + 26} ${y - 4}`, `M ${EYE_R - 26} ${y - 4} Q ${EYE_R} ${y - 14} ${EYE_R + 26} ${y + 8}`],
    stern: [`M ${EYE_L - 28} ${y - 6} L ${EYE_L + 26} ${y + 4}`, `M ${EYE_R - 26} ${y + 4} L ${EYE_R + 28} ${y - 6}`],
    level: [`M ${EYE_L - 26} ${y + 2} Q ${EYE_L} ${y - 2} ${EYE_L + 26} ${y + 2}`, `M ${EYE_R - 26} ${y + 2} Q ${EYE_R} ${y - 2} ${EYE_R + 26} ${y + 2}`],
    expect: [`M ${EYE_L - 26} ${y + 8} Q ${EYE_L - 4} ${y - 8} ${EYE_L + 24} ${y + 2}`, `M ${EYE_R - 24} ${y + 2} Q ${EYE_R + 4} ${y - 8} ${EYE_R + 26} ${y + 8}`],
    low: [`M ${EYE_L - 24} ${y + 8} Q ${EYE_L} ${y + 4} ${EYE_L + 24} ${y + 8}`, `M ${EYE_R - 24} ${y + 8} Q ${EYE_R} ${y + 4} ${EYE_R + 24} ${y + 8}`],
    alert: [`M ${EYE_L - 26} ${y + 4} Q ${EYE_L} ${y - 12} ${EYE_L + 26} ${y}`, `M ${EYE_R - 26} ${y} Q ${EYE_R} ${y - 12} ${EYE_R + 26} ${y + 4}`],
  };
  const [left, right] = pairs[kind] || pairs.flat;
  return `<g id="features-brow" fill="none" stroke="#2a1c16" stroke-width="3.4" stroke-linecap="round"><path d="${left}"/><path d="${right}"/></g>`;
}

function mouth(kind, lip) {
  const y = 468;
  const shapes = {
    flat: `<path d="M 332 ${y} H 428" fill="none" stroke="${lip}" stroke-width="3.5" stroke-linecap="round"/>`,
    line: `<path d="M 324 ${y + 2} H 436" fill="none" stroke="#6d403c" stroke-width="4" stroke-linecap="round"/>`,
    closed: `<path d="M 336 ${y - 2} H 424" fill="none" stroke="#6a4038" stroke-width="5" stroke-linecap="round"/>`,
    soft: `<path d="M 338 ${y} Q 380 ${y + 12} 422 ${y}" fill="none" stroke="${lip}" stroke-width="3.6" stroke-linecap="round"/>`,
    "small-smile": `<path d="M 334 ${y - 2} Q 380 ${y + 18} 426 ${y - 2}" fill="${lip}"/><path d="M 346 ${y + 2} Q 380 ${y + 12} 414 ${y + 2}" fill="#fff6f2" opacity="0.35"/>`,
    smile: `<path d="M 312 ${y - 4} Q 380 ${y + 36} 448 ${y - 4} Q 380 ${y + 16} 312 ${y - 4} Z" fill="${lip}"/><path d="M 332 ${y + 2} Q 380 ${y + 18} 428 ${y + 2}" fill="#fff" opacity="0.55"/>`,
    "big-smile": `<path d="M 300 ${y - 6} Q 380 ${y + 48} 460 ${y - 6} Q 380 ${y + 18} 300 ${y - 6} Z" fill="${lip}"/><path d="M 324 ${y + 4} H 436 Q 380 ${y + 22} 324 ${y + 4} Z" fill="#fffaf6"/>`,
    smirk: `<path d="M 336 ${y + 2} Q 390 ${y + 6} 430 ${y - 14}" fill="none" stroke="${lip}" stroke-width="4" stroke-linecap="round"/>`,
    down: `<path d="M 322 ${y - 8} Q 380 ${y + 18} 438 ${y - 8} Q 380 ${y + 4} 322 ${y - 8} Z" fill="${lip}"/>`,
    open: `<ellipse cx="380" cy="${y + 6}" rx="18" ry="14" fill="#6a3030"/><path d="M 360 ${y - 6} Q 380 ${y - 16} 400 ${y - 6}" fill="${lip}"/><path d="M 358 ${y + 16} Q 380 ${y + 26} 402 ${y + 16}" fill="${lip}"/>`,
    whisper: `<ellipse cx="380" cy="${y + 2}" rx="8" ry="6" fill="#6a3030"/>`,
    tiny: `<path d="M 360 ${y + 2} Q 380 ${y + 8} 400 ${y + 2}" fill="none" stroke="${lip}" stroke-width="3" stroke-linecap="round"/>`,
    grin: `<path d="M 308 ${y - 2} Q 380 ${y + 40} 452 ${y - 2} Q 380 ${y + 14} 308 ${y - 2} Z" fill="${lip}"/><path d="M 328 ${y + 6} H 432 Q 380 ${y + 20} 328 ${y + 6} Z" fill="#fff"/>`,
    warm: `<path d="M 340 ${y + 2} Q 372 ${y + 14} 408 ${y - 2}" fill="none" stroke="${lip}" stroke-width="4.2" stroke-linecap="round"/><path d="M 392 ${y + 2} Q 404 ${y + 8} 414 ${y + 1}" fill="none" stroke="#6a3030" stroke-width="2"/>`,
    part: `<path d="M 340 ${y} Q 380 ${y + 10} 420 ${y}" fill="${lip}"/><path d="M 358 ${y + 4} H 402" stroke="#6a3030" stroke-width="2.4"/>`,
  };
  return `<g id="features-mouth">${shapes[kind] || shapes.flat}</g>`;
}

function faceOutline(kind) {
  if (kind === "mature-m") {
    return "M 268 348 C 258 214 312 168 380 164 C 452 168 508 220 496 352 C 488 470 452 560 380 574 C 308 560 274 472 268 348 Z";
  }
  if (kind === "mature-f") {
    return "M 250 352 C 242 214 304 162 380 158 C 462 162 524 220 512 356 C 504 478 458 552 380 562 C 298 552 256 478 250 352 Z";
  }
  if (kind === "young-m") {
    return "M 262 336 C 254 206 308 162 380 158 C 456 162 510 212 500 340 C 492 452 456 528 380 536 C 306 528 270 454 262 336 Z";
  }
  return "M 252 334 C 244 198 304 150 380 146 C 460 150 520 204 510 338 C 502 458 456 536 380 548 C 300 536 258 460 252 334 Z";
}

function defs(p) {
  return `<defs>
    <radialGradient id="skin" cx="36%" cy="30%" r="72%">
      <stop offset="0%" stop-color="${p.skin[0]}"/>
      <stop offset="58%" stop-color="${p.skin[1]}"/>
      <stop offset="100%" stop-color="${p.skin[2]}"/>
    </radialGradient>
    <linearGradient id="cloth" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${p.cloth[0]}"/>
      <stop offset="48%" stop-color="${p.cloth[1]}"/>
      <stop offset="100%" stop-color="${p.cloth[2]}"/>
    </linearGradient>
    <linearGradient id="hairG" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="${p.hair[1]}"/>
      <stop offset="42%" stop-color="${p.hair[0]}"/>
      <stop offset="100%" stop-color="${p.hair[2]}"/>
    </linearGradient>
    <radialGradient id="irisG" cx="35%" cy="32%" r="70%">
      <stop offset="0%" stop-color="${p.iris[0]}"/>
      <stop offset="62%" stop-color="${p.iris[1]}"/>
      <stop offset="100%" stop-color="#120c0a"/>
    </radialGradient>
    <filter id="air" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
  </defs>`;
}

function neck(shade) {
  return `<path d="M 332 520 C 340 590 336 640 352 690 L 408 690 C 424 640 420 590 428 520 Z" fill="url(#skin)"/>
    <path d="M 348 560 C 360 620 356 660 380 688 C 360 650 352 600 348 560 Z" fill="${shade}" opacity="0.35"/>`;
}

function ears() {
  return `<ellipse cx="236" cy="378" rx="24" ry="34" fill="url(#skin)"/>
    <ellipse cx="524" cy="378" rx="24" ry="34" fill="url(#skin)"/>
    <path d="M 236 362 C 226 380 228 400 240 408" fill="none" stroke="#c8a498" stroke-width="2" opacity="0.7"/>
    <path d="M 524 362 C 534 380 532 400 520 408" fill="none" stroke="#c8a498" stroke-width="2" opacity="0.7"/>`;
}

function nose() {
  return `<path d="M 380 392 C 372 418 370 436 366 452" fill="none" stroke="#d7b2a8" stroke-width="3.2" stroke-linecap="round" opacity="0.8"/>
    <ellipse cx="362" cy="456" rx="8" ry="4.5" fill="#e7b8ae" opacity="0.35"/>`;
}

function blush(amount, color) {
  if (!amount) return "";
  return `<g filter="url(#air)">
    <ellipse cx="286" cy="430" rx="46" ry="28" fill="${color}" opacity="${amount * 0.7}"/>
    <ellipse cx="474" cy="430" rx="46" ry="28" fill="${color}" opacity="${amount * 0.7}"/>
    <ellipse cx="380" cy="250" rx="120" ry="28" fill="#c9a498" opacity="0.22"/>
    <path d="M 310 530 Q 380 560 450 530 Q 380 544 310 530 Z" fill="#d7aea4" opacity="0.45"/>
  </g>`;
}

function ageLines(on) {
  if (!on) return "";
  return `<path d="M 268 400 Q 286 406 300 398" fill="none" stroke="#c49a90" stroke-width="1.6" opacity="0.8"/>
    <path d="M 460 398 Q 478 406 494 400" fill="none" stroke="#c49a90" stroke-width="1.6" opacity="0.8"/>`;
}

function underEyes() {
  return `<path d="M 286 376 Q 304 386 324 376" fill="none" stroke="#d7b0a6" stroke-width="1.5" opacity="0.75"/>
    <path d="M 438 376 Q 456 386 476 376" fill="none" stroke="#d7b0a6" stroke-width="1.5" opacity="0.75"/>`;
}

function arms(pose, accent) {
  const sleeve = (d) => `<path d="${d}" fill="url(#cloth)" stroke="${accent}" stroke-width="2" stroke-opacity="0.25"/>`;
  const hand = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="22" ry="16" fill="url(#skin)"/>`;
  if (pose === "sit") {
    return `${sleeve("M 170 980 L 250 900 L 370 940 L 360 1000 L 190 1040 Z")}
      ${sleeve("M 590 980 L 510 900 L 390 940 L 400 1000 L 570 1040 Z")}`;
  }
  if (pose === "lean") {
    return `${sleeve("M 150 720 C 120 860 140 1000 190 1120 L 246 1100 C 220 940 214 820 240 720 Z")}
      ${sleeve("M 530 760 C 430 860 300 900 230 860 C 270 930 420 940 540 860 Z")}
      ${hand(214, 860)}`;
  }
  if (pose === "turn") {
    return `${sleeve("M 150 730 C 126 880 150 1040 196 1140 L 250 1120 C 224 960 220 820 246 730 Z")}
      ${sleeve("M 560 700 C 610 760 590 860 540 900 L 500 860 C 540 820 548 760 530 710 Z")}
      ${hand(548, 640)}
      <path d="M 520 620 C 548 600 570 630 556 670" fill="none" stroke="#e7c4b8" stroke-width="8" stroke-linecap="round"/>`;
  }
  return `${sleeve("M 156 710 C 124 860 146 1020 198 1160 L 252 1140 C 220 980 214 820 246 710 Z")}
    ${sleeve("M 604 710 C 636 860 614 1020 562 1160 L 508 1140 C 540 980 546 820 514 710 Z")}`;
}

function torso(p, pose) {
  const y = pose === "sit" ? 760 : 690;
  return `<path d="M 168 ${y} C 190 ${y - 90} 280 ${y - 130} 340 ${y - 100} L 420 ${y - 100} C 490 ${y - 130} 570 ${y - 90} 592 ${y} L 640 1220 L 120 1220 Z" fill="url(#cloth)"/>
    <path d="M 300 ${y - 40} C 340 ${y + 80} 340 ${y + 220} 320 ${y + 360}" fill="none" stroke="${p.cloth[2]}" stroke-width="10" stroke-linecap="round" opacity="0.35"/>
    <path d="M 470 ${y - 20} C 500 ${y + 120} 490 ${y + 260} 520 ${y + 380}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.18"/>
    ${p.outfit(y)}`;
}

function hairLong() {
  return `<path d="M 210 300 C 170 140 250 40 380 34 C 530 28 610 150 560 310 C 640 520 670 860 600 1120 C 540 1180 470 1040 450 900 C 430 760 400 740 380 900 C 350 1100 250 1160 190 1040 C 120 820 140 480 210 300 Z" fill="url(#hairG)"/>
    <path d="M 300 70 C 340 36 450 40 490 96" fill="none" stroke="#8eb4c8" stroke-width="10" stroke-linecap="round" opacity="0.45"/>
    <path d="M 230 460 C 200 640 210 860 250 1040" fill="none" stroke="#0c1c2a" stroke-width="16" stroke-linecap="round" opacity="0.35"/>`;
}

function bangsLong() {
  return `<path d="M 250 250 C 270 150 330 120 380 124 C 450 118 520 160 524 260 C 470 210 430 230 380 214 C 320 230 280 210 250 250 Z" fill="url(#hairG)"/>
    <path d="M 248 280 C 236 420 250 560 286 640 C 300 520 292 400 286 300 Z" fill="url(#hairG)"/>
    <path d="M 520 280 C 534 430 520 560 486 650 C 470 520 478 400 486 300 Z" fill="url(#hairG)"/>
    <path d="M 300 150 C 330 180 350 170 370 190" fill="none" stroke="#9ec0d2" stroke-width="4" opacity="0.5"/>`;
}

function hairShoulder() {
  return `<path d="M 230 280 C 200 150 270 70 380 62 C 500 54 570 160 540 290 C 590 420 560 560 500 640 C 460 590 420 570 380 590 C 330 570 280 600 250 660 C 200 540 190 400 230 280 Z" fill="url(#hairG)"/>
    <path d="M 300 90 C 350 60 450 64 490 110" fill="none" stroke="#c09090" stroke-width="8" stroke-linecap="round" opacity="0.4"/>`;
}

function bangsShoulder() {
  return `<path d="M 258 240 C 280 150 340 128 390 140 C 450 128 510 170 516 250 C 470 200 420 230 370 200 C 320 230 280 200 258 240 Z" fill="url(#hairG)"/>
    <path d="M 470 150 C 500 170 508 150 520 168" fill="none" stroke="#8f3d48" stroke-width="8" stroke-linecap="round"/>
    <circle cx="508" cy="148" r="7" fill="#f4d5d0"/>`;
}

function hairShort(part) {
  const partPath = part === "side"
    ? `<path d="M 330 150 C 360 190 390 170 420 200" fill="none" stroke="#1a1612" stroke-width="3" opacity="0.45"/>`
    : "";
  return `<path d="M 250 300 C 246 180 300 120 380 116 C 470 112 530 180 520 310 C 500 250 450 230 380 236 C 310 230 270 260 250 300 Z" fill="url(#hairG)"/>
    <path d="M 268 250 C 300 200 460 190 510 260 C 470 220 400 214 340 230 C 300 220 280 236 268 250 Z" fill="${part === "gray" ? "#6e6860" : "url(#hairG)"}" opacity="${part === "gray" ? 0.9 : 1}"/>
    ${partPath}`;
}

function bangsShort(style) {
  if (style === "teacher") {
    return `<path d="M 286 210 C 320 168 450 164 490 214 C 450 196 400 206 360 198 C 320 208 300 200 286 210 Z" fill="url(#hairG)"/>
      <path d="M 300 180 C 340 160 400 158 430 176" fill="none" stroke="#b7b1a8" stroke-width="6" stroke-linecap="round" opacity="0.7"/>`;
  }
  if (style === "hero") {
    return `<path d="M 270 250 C 290 160 350 130 400 150 C 450 128 520 180 500 270 C 460 210 400 240 340 200 C 300 230 280 220 270 250 Z" fill="url(#hairG)"/>
      <path d="M 300 190 C 330 230 360 200 390 240" fill="none" stroke="#3a3028" stroke-width="3" opacity="0.35"/>`;
  }
  return `<path d="M 286 230 C 310 170 360 150 410 168 C 460 150 510 190 500 246 C 460 200 400 220 350 196 C 310 214 292 210 286 230 Z" fill="url(#hairG)"/>`;
}

function hairBun() {
  return `<path d="M 236 300 C 210 170 280 80 380 74 C 490 68 560 180 530 310 C 500 250 440 230 380 240 C 310 230 270 260 236 300 Z" fill="url(#hairG)"/>
    <ellipse cx="380" cy="118" rx="54" ry="36" fill="url(#hairG)"/>
    <ellipse cx="392" cy="108" rx="16" ry="8" fill="#e7b8b0" opacity="0.35"/>
    <path d="M 250 340 C 230 460 250 560 300 620" fill="none" stroke="#3a2424" stroke-width="18" stroke-linecap="round"/>
    <path d="M 520 340 C 546 470 530 570 470 630" fill="none" stroke="#3a2424" stroke-width="18" stroke-linecap="round"/>`;
}

function bangsBun() {
  return `<path d="M 268 240 C 300 160 350 150 390 176 C 430 150 500 176 508 250 C 450 210 390 240 330 200 C 300 220 280 214 268 240 Z" fill="url(#hairG)"/>`;
}

const PEOPLE = [
  {
    id: "lumian",
    who: "鹿眠",
    poses: ["stand", "lean"],
    faces: ["calm", "soft", "knowing", "distant", "smile", "serious", "whisper", "sting"],
    skin: ["#fff8f4", "#f4e0d8", "#e3c9c4"],
    hair: ["#163044", "#24506c", "#0d2233"],
    cloth: ["#f4f8fb", "#d5e4ee", "#8eafc4"],
    accent: "#1d4e6f",
    lip: "#c48986",
    blush: "#e7a8aa",
    iris: ["#8aa4b4", "#243848"],
    face: "young-f",
    hairBack: hairLong,
    hairFront: bangsLong,
    outfit(y) {
      return `<path d="M 318 ${y - 108} C 340 ${y - 70} 360 ${y - 78} 380 ${y - 36} C 400 ${y - 78} 420 ${y - 70} 442 ${y - 108}" fill="#f7fbfe"/>
        <path d="M 352 ${y - 78} Q 380 ${y - 28} 408 ${y - 78} Q 380 ${y - 58} 352 ${y - 78} Z" fill="#1d4e6f"/>
        <path d="M 368 ${y - 62} Q 380 ${y - 78} 392 ${y - 62} Q 380 ${y - 48} 368 ${y - 62} Z" fill="#d5e4ee"/>
        <path d="M 250 ${y + 20} Q 380 ${y + 70} 510 ${y + 20}" fill="none" stroke="#9bb8ca" stroke-width="3" opacity="0.7"/>`;
    },
  },
  {
    id: "shen",
    who: "沈知夏",
    poses: ["stand", "turn"],
    faces: ["quiet", "shy", "hurt", "pause", "smile", "look"],
    skin: ["#fff6f1", "#f8e0d6", "#efcbbf"],
    hair: ["#3a2428", "#6a4044", "#241418"],
    cloth: ["#fde8e4", "#f4d5d0", "#e0b0aa"],
    accent: "#8f3d48",
    lip: "#c45a64",
    blush: "#f09aa4",
    iris: ["#c49898", "#5a3034"],
    face: "young-f",
    mole: true,
    hairBack: hairShoulder,
    hairFront: bangsShoulder,
    outfit(y) {
      return `<path d="M 332 ${y - 96} C 350 ${y - 40} 370 ${y - 70} 380 ${y - 24} C 392 ${y - 70} 410 ${y - 40} 430 ${y - 96} C 400 ${y - 70} 360 ${y - 70} 332 ${y - 96} Z" fill="#fff8f4"/>
        <path d="M 300 ${y - 60} C 250 ${y + 30} 236 ${y + 180} 250 ${y + 320}" fill="none" stroke="#8f3d48" stroke-width="14" stroke-linecap="round" opacity="0.55"/>
        <path d="M 460 ${y - 60} C 510 ${y + 30} 524 ${y + 180} 510 ${y + 320}" fill="none" stroke="#8f3d48" stroke-width="14" stroke-linecap="round" opacity="0.55"/>`;
    },
  },
  {
    id: "yu",
    who: "郁明",
    poses: ["stand", "sit"],
    faces: ["bright", "rival", "blank", "sting", "soft"],
    skin: ["#fff3ea", "#f3dcc8", "#e6c4ae"],
    hair: ["#2a241c", "#4a4034", "#14110e"],
    cloth: ["#fbf6ea", "#f3e6c8", "#ddc89a"],
    accent: "#8a6230",
    lip: "#c48a78",
    blush: "#e8b09a",
    iris: ["#a08060", "#3a2c22"],
    face: "young-m",
    hairBack: () => hairShort("side"),
    hairFront: () => bangsShort("student"),
    outfit(y) {
      return `<path d="M 248 ${y - 36} L 332 ${y - 108} L 380 ${y - 64} L 428 ${y - 108} L 512 ${y - 36} L 496 ${y + 340} L 264 ${y + 340} Z" fill="#e6cf9a"/>
        <path d="M 346 ${y - 96} L 368 ${y - 28} L 392 ${y - 28} L 414 ${y - 96} Z" fill="#fffaf2"/>
        <path d="M 380 ${y - 20} V ${y + 300}" stroke="#8a6230" stroke-width="3" opacity="0.55"/>`;
    },
  },
  {
    id: "pei",
    who: "裴望",
    poses: ["stand"],
    faces: ["stern", "soft", "professor", "overlap"],
    skin: ["#f8ebdf", "#efd4c4", "#e0bba8"],
    hair: ["#3a342c", "#5c564e", "#1c1916"],
    cloth: ["#4a443c", "#3e382f", "#241f1b"],
    accent: "#2a241c",
    lip: "#b88880",
    blush: "#e0b0a4",
    iris: ["#8a8078", "#2c2824"],
    face: "mature-m",
    mature: true,
    hairBack: () => hairShort("gray"),
    hairFront: () => bangsShort("teacher"),
    glasses: true,
    outfit(y) {
      return `<path d="M 332 ${y - 112} L 356 ${y - 28} L 380 ${y - 78} L 404 ${y - 28} L 428 ${y - 112} L 404 ${y - 96} L 380 ${y - 130} L 356 ${y - 96} Z" fill="#e7e1d8"/>
        <circle cx="380" cy="${y + 24}" r="3.5" fill="#c4b49a"/>
        <circle cx="380" cy="${y + 78}" r="3.5" fill="#c4b49a"/>
        <circle cx="380" cy="${y + 132}" r="3.5" fill="#c4b49a"/>`;
    },
  },
  {
    id: "mother",
    who: "黍母",
    poses: ["stand"],
    faces: ["expect", "gentle", "warm"],
    skin: ["#fff1e8", "#f3d5c6", "#e4bba8"],
    hair: ["#4a3030", "#8a5854", "#2a1818"],
    cloth: ["#ffe8d8", "#f6d7c4", "#e2b89a"],
    accent: "#8d4b32",
    lip: "#c47a6a",
    blush: "#eeaa98",
    iris: ["#c49888", "#5a382e"],
    face: "mature-f",
    hairBack: hairBun,
    hairFront: bangsBun,
    outfit(y) {
      return `<path d="M 318 ${y - 90} Q 380 ${y - 20} 442 ${y - 90}" fill="none" stroke="#fffaf6" stroke-width="14" stroke-linecap="round"/>
        <path d="M 300 ${y - 10} C 250 ${y + 40} 236 ${y + 180} 270 ${y + 340} L 490 ${y + 340} C 524 ${y + 180} 510 ${y + 40} 460 ${y - 10} C 430 ${y + 30} 330 ${y + 30} 300 ${y - 10} Z" fill="#fff8f2" opacity="0.78"/>
        <path d="M 372 ${y + 20} C 368 ${y + 120} 390 ${y + 200} 386 ${y + 320}" fill="none" stroke="#8d4b32" stroke-width="5" opacity="0.4"/>`;
    },
  },
  {
    id: "suya",
    who: "黍琊",
    poses: ["stand"],
    faces: ["still", "awake"],
    skin: ["#f8ece3", "#f0d8c8", "#e2c0ae"],
    hair: ["#1c140f", "#3a3028", "#0c0908"],
    cloth: ["#fbf7f0", "#f7f1e6", "#e4d8c6"],
    accent: "#2a211c",
    lip: "#c09080",
    blush: "#e2b0a0",
    iris: ["#8a7060", "#241810"],
    face: "young-m",
    hairBack: () => hairShort("plain"),
    hairFront: () => bangsShort("hero"),
    outfit(y) {
      return `<path d="M 210 ${y - 40} L 330 ${y - 120} L 348 ${y + 360} L 214 ${y + 380} Z" fill="#2a211c"/>
        <path d="M 550 ${y - 40} L 430 ${y - 120} L 412 ${y + 360} L 546 ${y + 380} Z" fill="#1c1612"/>
        <path d="M 338 ${y - 108} L 362 ${y - 24} L 398 ${y - 24} L 422 ${y - 108} L 404 ${y + 220} L 356 ${y + 220} Z" fill="#f7f1e6"/>`;
    },
  },
];

function glasses() {
  return `<g fill="none" stroke="#241c16" stroke-width="3.2">
    <rect x="262" y="322" width="86" height="62" rx="10"/>
    <rect x="412" y="322" width="86" height="62" rx="10"/>
    <path d="M 348 350 H 412"/>
    <path d="M 262 344 L 236 332"/>
    <path d="M 498 344 L 524 332"/>
  </g>
  <path d="M 278 336 H 330" stroke="#fff" stroke-width="2" opacity="0.35"/>`;
}

function mole() {
  return `<g id="mole"><circle cx="${EYE_L - 46}" cy="${EYE_Y + 22}" r="5.2" fill="#6a3834"/><circle cx="${EYE_L - 48}" cy="${EYE_Y + 20}" r="1.5" fill="#c48880"/></g>`;
}

function ghost(outline) {
  return `<g opacity="0.55" transform="translate(-36 6)">
    <path d="${outline}" fill="#d7e4ee" opacity="0.28"/>
    <path d="${outline}" fill="none" stroke="#9eb4c6" stroke-width="8"/>
  </g>`;
}

function headTransform(pose) {
  const scale = "translate(380 390) scale(1.16) translate(-380 -390)";
  if (pose === "lean") return `${scale} rotate(6 380 420)`;
  if (pose === "turn") return `${scale} rotate(-12 380 400)`;
  if (pose === "sit") return `${scale} translate(0 24)`;
  return scale;
}

function figureTransform(pose) {
  if (pose === "lean") return "rotate(-9 380 1180)";
  if (pose === "sit") return "translate(0 78)";
  if (pose === "turn") return "translate(20 4)";
  return "";
}

function render(person, pose, faceName) {
  const expr = EXPR[faceName];
  const asset = `${person.id}/${pose}-${faceName}`;
  const outline = faceOutline(person.face);
  const head = `<g id="head" transform="${headTransform(pose)}">
    ${expr.ghost ? ghost(outline) : ""}
    ${ears()}
    <path d="${outline}" fill="url(#skin)"/>
    <path d="M 300 520 Q 380 500 460 520" fill="${person.skin[2]}" opacity="0.18"/>
    ${blush(expr.blush, person.blush)}
    ${person.mature && faceName !== "soft" ? underEyes() : ""}
    ${ageLines(expr.lines)}
    <g id="features" transform="translate(380 410) scale(1.28) translate(-380 -410)">
      ${brow(expr.brow)}
      ${eyes(expr.eye, expr.look)}
      ${nose()}
      ${mouth(expr.mouth, person.lip)}
    </g>
    ${person.mole ? mole() : ""}
    ${person.hairFront()}
    ${person.glasses ? glasses() : ""}
  </g>`;
  const body = `<g id="figure" transform="${figureTransform(pose)}">
    ${person.hairBack()}
    ${neck(person.skin[2])}
    ${torso(person, pose)}
    ${arms(pose, person.accent)}
    ${head}
  </g>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 1200" data-asset="${asset}" aria-hidden="true">
${defs(person)}
${body}
</svg>
`;
}

fs.rmSync(OUT, { recursive: true, force: true });
const seen = new Set();
const featureSeen = new Map();
let count = 0;
for (const person of PEOPLE) {
  for (const pose of person.poses) {
    for (const face of person.faces) {
      const svg = render(person, pose, face);
      if (seen.has(svg)) throw new Error(`duplicate file ${person.id} ${pose} ${face}`);
      seen.add(svg);
      if (pose === person.poses[0]) {
        const features = svg.match(/<g id="features">[\s\S]*?<\/g>\s*(<g id="features-mouth">[\s\S]*?<\/g>)?/);
        const block = `${EXPR[face].eye}|${EXPR[face].brow}|${EXPR[face].mouth}|${EXPR[face].look}|${svg.includes('id="features"')}`;
        const signature = svg.slice(svg.indexOf('id="features"'), svg.indexOf('id="features"') + 1800);
        const prev = featureSeen.get(person.id) || new Set();
        if (prev.has(signature)) throw new Error(`same features ${person.who} ${face}`);
        prev.add(signature);
        featureSeen.set(person.id, prev);
        if (!block) throw new Error("empty features");
      }
      const file = path.join(OUT, person.id, `${pose}-${face}.svg`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, svg);
      count += 1;
    }
  }
}
if (count !== 47) throw new Error(`count ${count}`);
console.log(`wrote ${count} sprites`);
