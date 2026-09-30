import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { advance, choose, newSession, optionsFor } from "../src/engine.js";
import { NODES } from "../src/script.js";
import { CGS, FRAGMENTS, SPRITE_SHEET, TRACKS, sceneIds, showMole, spriteKey } from "../src/cast.js";
import { EFFECT_IDS } from "../src/audio.js";

function decide(goal, options) {
  const pick = (...ids) => options.findIndex((option) => ids.includes(option.id));
  if (goal === "A") {
    const accept = pick("accept");
    return accept >= 0 ? accept : 0;
  }
  if (goal === "C") {
    const stay = pick("stay");
    if (stay >= 0) return stay;
    const bad = pick("b");
    if (bad >= 0) return bad;
    const skip = pick("skip");
    if (skip >= 0) return skip;
    const again = pick("again");
    if (again >= 0) return again;
    return 0;
  }
  if (goal === "B") {
    const stay = pick("stay");
    if (stay >= 0) return stay;
    const ask = pick("ask");
    if (ask >= 0) return ask;
    const academic = pick("a");
    if (academic >= 0) return academic;
    const again = pick("again");
    if (again >= 0) return again;
    const take = pick("take");
    if (take >= 0) return take;
    const lu = pick("lu");
    if (lu >= 0) return lu;
    return 0;
  }
  if (goal === "E") {
    const hidden = pick("hidden");
    if (hidden >= 0) return hidden;
    const seen = pick("seen");
    if (seen >= 0) return seen;
  }
  const wake = pick("wake");
  if (wake >= 0) return wake;
  const ask = pick("ask");
  if (ask >= 0) return ask;
  const academic = pick("a");
  if (academic >= 0) return academic;
  const again = pick("again");
  if (again >= 0) return again;
  const take = pick("take");
  if (take >= 0) return take;
  const hotel = pick("hotel");
  if (hotel >= 0) return hotel;
  const lu = pick("lu");
  if (lu >= 0) return lu;
  return 0;
}

function play(goal, ngPlus = false) {
  const session = newSession(ngPlus);
  for (let guard = 0; guard < 4000 && session.phase !== "ending"; guard += 1) {
    if (session.phase === "choice") {
      const options = optionsFor(session);
      const index = decide(goal, options);
      if (index < 0) throw new Error(`no choice for ${goal} at ${session.nodeId}`);
      choose(session, index);
    } else {
      advance(session);
    }
  }
  if (session.phase !== "ending") throw new Error(`${goal} stalled at ${session.nodeId} ${session.phase}`);
  return session;
}

const early = play("A");
if (early.endingId !== "A" || early.dissonance !== 0) {
  throw new Error(`A route ${early.endingId} d=${early.dissonance}`);
}
const truth = play("TRUE");
if (truth.endingId !== "TRUE" || truth.dissonance !== 78 || truth.academic !== 65 || truth.lu < 20) {
  throw new Error(`TRUE d=${truth.dissonance} ac=${truth.academic} lu=${truth.lu} end=${truth.endingId}`);
}
const peak = play("B");
if (peak.endingId !== "B" || peak.academic !== 65) {
  throw new Error(`B ac=${peak.academic} end=${peak.endingId}`);
}
const perfect = play("C");
if (perfect.endingId !== "C" || perfect.dissonance !== 12 || perfect.academic !== 0) {
  throw new Error(`C d=${perfect.dissonance} ac=${perfect.academic} end=${perfect.endingId}`);
}
const hidden = play("E", true);
if (hidden.endingId !== "E" || hidden.dissonance !== 78 || hidden.lu < 50) {
  throw new Error(`E d=${hidden.dissonance} lu=${hidden.lu} end=${hidden.endingId}`);
}

function joined(session) {
  return session.log.map((entry) => entry.text).join("\n");
}

const truthText = joined(truth);
for (const phrase of ["九十厘米", "红烧肉", "301", "睡够了，就回家", "六月九日"]) {
  if (!truthText.includes(phrase)) throw new Error(`TRUE missing ${phrase}`);
}
if (!truth.meter) throw new Error("meter should be open by the finale");
if (truth.fragments.includes("pork") === false) throw new Error("TRUE should unlock 红烧肉");
if (truth.choices.some((choice) => choice.label.includes("红烧肉") && choice.d === 10) === false) {
  throw new Error("D3 ask was not recorded");
}

const earlyText = joined(early);
if (!earlyText.includes("雨")) throw new Error("A missing rain");
if (earlyText.includes("红烧肉")) throw new Error("A entered the dream");
if (early.meter) throw new Error("A should not reveal dissonance");

const hiddenText = joined(hidden);
if (!hiddenText.includes("白衬衫")) throw new Error("NG+ flashback missing");
if (!hiddenText.includes("如果这也是梦呢")) throw new Error("E line missing");

if (sceneIds().length !== 24) throw new Error(`scenes ${sceneIds().length}`);
if (CGS.length !== 12) throw new Error("cg count");
if (TRACKS.length !== 16) throw new Error("track count");
if (FRAGMENTS.length !== 16) throw new Error("fragment count");
const titles = Object.fromEntries(TRACKS.map((track) => [track.id, track.title]));
for (const [id, title] of [
  ["june", "六月"],
  ["cradle", "梦的温床"],
  ["crack", "裂缝"],
  ["home", "睡够了，就回家"],
  ["awake", "醒来之后"],
]) {
  if (titles[id] !== title) throw new Error(`track ${id}`);
}

const usedCg = new Set(Object.values(NODES).map((node) => node.cg).filter(Boolean));
for (const cg of CGS) {
  if (!usedCg.has(cg.id)) throw new Error(`cg not staged ${cg.id}`);
}
const usedBgm = new Set(Object.values(NODES).map((node) => node.bgm).filter(Boolean));
for (const track of TRACKS) {
  if (!usedBgm.has(track.id)) throw new Error(`bgm not staged ${track.id}`);
}
for (const node of Object.values(NODES)) {
  if (!sceneIds().includes(node.bg)) throw new Error(`unknown bg ${node.bg}`);
}
const faces = new Set();
const sounds = new Set();
for (const node of Object.values(NODES)) {
  const lines = typeof node.lines === "function" ? [] : node.lines || [];
  for (const line of lines) {
    if (line.face) faces.add(line.face);
    if (line.se) sounds.add(line.se);
  }
  const options = typeof node.options === "function" ? [] : node.options || [];
  for (const option of options) {
    for (const line of [option.say, option.thought].filter(Boolean)) {
      if (typeof line === "object" && line.face) faces.add(line.face);
      if (typeof line === "object" && line.se) sounds.add(line.se);
    }
  }
}
if (faces.size < 8) throw new Error(`faces ${[...faces].join(",")}`);
for (const sound of sounds) {
  if (!EFFECT_IDS.includes(sound)) throw new Error(`unknown se ${sound}`);
}
if (!showMole("沈知夏", "real") || showMole("沈知夏", "dream")) {
  throw new Error("mole should exist only outside the dream");
}
if (NODES.ch1_dorm.layer !== "real" || NODES.d3.layer !== "dream" || NODES.ch4_door.layer !== "limen") {
  throw new Error("layer presentation drifted");
}
if (NODES.ch4.meter !== true || NODES.d3.meter) throw new Error("dissonance should stay hidden until chapter 4");

const probe = newSession(false);
for (let guard = 0; guard < 2000 && !(probe.nodeId === "d1" && probe.phase === "choice"); guard += 1) {
  if (probe.phase === "choice") choose(probe, decide("TRUE", optionsFor(probe)));
  else advance(probe);
}
if (probe.nodeId !== "d1") throw new Error(`did not reach D1, at ${probe.nodeId}`);
choose(probe, optionsFor(probe).findIndex((option) => option.id === "ask"));
if (probe.feedback !== "drop") throw new Error(`D1 plus calendar should cross 10, got ${probe.feedback}`);
if (probe.meter) throw new Error("meter opened before chapter 4");
probe.feedback = null;
for (let guard = 0; guard < 2000 && !(probe.nodeId === "d3" && probe.phase === "choice"); guard += 1) {
  if (probe.phase === "choice") choose(probe, decide("TRUE", optionsFor(probe)));
  else advance(probe);
}
choose(probe, optionsFor(probe).findIndex((option) => option.id === "ask"));
if (probe.nodeId !== "d3_plate") throw new Error(`D3 ask landed on ${probe.nodeId}`);
if (!probe.glitch) throw new Error("D3 should freeze the frame");
if (probe.fragments.includes("pork") === false) throw new Error("pork fragment missing");

const scriptText = JSON.stringify(NODES);
if (scriptText.includes("秦琊")) throw new Error("protagonist name drifted");

const spriteRoot = path.resolve("src/sprites");
const bodies = new Set();
let spriteCount = 0;

function readSprite(rel) {
  const file = path.join(spriteRoot, rel);
  if (!fs.existsSync(file)) throw new Error(`missing sprite ${rel}`);
  const buf = fs.readFileSync(file);
  if (!rel.endsWith(".webp") || buf.length < 8000) throw new Error(`sprite file ${rel}`);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  if (bodies.has(hash)) throw new Error(`duplicate sprite ${rel}`);
  bodies.add(hash);
  spriteCount += 1;
}

for (const [who, sheet] of Object.entries(SPRITE_SHEET)) {
  if (who === "沈知夏") {
    for (const set of ["real", "dream"]) {
      for (const face of sheet.faces) readSprite(spriteKey(who, face, "stand", set));
    }
    continue;
  }
  for (const pose of sheet.poses) {
    for (const face of sheet.faces) readSprite(spriteKey(who, face, pose));
  }
}
if (spriteCount !== 47) throw new Error(`sprite count ${spriteCount}`);
if (spriteKey("沈知夏", "quiet", "turn", "dream") !== "shen/dream-quiet.webp") throw new Error("dream key");
if (spriteKey("沈知夏", "quiet", "stand", "real") !== "shen/real-quiet.webp") throw new Error("real key");
if (spriteKey("鹿眠", "missing", "missing") !== "lumian/stand-calm.webp") throw new Error("sprite fallback");
if (spriteKey("郁明", "blank", "sit") !== "yu/sit-blank.webp") throw new Error("sit key");

console.log("routes ok: A, TRUE, B, C, E");
