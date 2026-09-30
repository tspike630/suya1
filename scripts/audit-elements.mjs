import assert from "node:assert/strict";
import { EFFECTS } from "../src/audio.js";
import { CAST, CGS, FRAGMENTS, TRACKS, sceneIds } from "../src/cast.js";
import { AUTO_COUNT, QUICK_COUNT, SLOT_COUNT } from "../src/game.js";

const EFFECT_NAMES = [
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
  "phone",
  "clock",
  "door",
  "elevator",
  "applause",
  "wind",
  "water",
  "paper",
  "click",
  "step",
  "bell",
  "crowd",
  "cup",
  "key",
  "notice",
  "chair",
  "breath",
  "knock",
  "static",
];

const TRACK_TITLES = ["六月", "梦的温床", "裂缝", "睡够了，就回家", "醒来之后"];
const CANON_FRAGMENTS = ["6月9日", "红烧肉", "301", "胎记", "去年的奖", "热牛奶"];
const CAST_SIX = ["鹿眠", "沈知夏", "郁明", "裴望", "黍母", "黍琊"];

assert.equal(CGS.length, 12);
assert.equal(sceneIds().length, 24);
assert.equal(TRACKS.length, 16);
for (const title of TRACK_TITLES) {
  assert.ok(
    TRACKS.some((track) => track.title === title),
    `missing track ${title}`,
  );
}
assert.equal(FRAGMENTS.length, 16);
const fragmentTitles = FRAGMENTS.map((item) => item.title.replace(/\s/g, ""));
for (const title of CANON_FRAGMENTS) {
  assert.ok(fragmentTitles.includes(title), `missing fragment ${title}`);
}
assert.equal(Object.keys(EFFECTS).length, 30);
assert.deepEqual(Object.keys(EFFECTS), EFFECT_NAMES);
assert.equal(SLOT_COUNT, 90);
assert.equal(AUTO_COUNT, 10);
assert.equal(QUICK_COUNT, 10);
assert.equal(CAST_SIX.length, 6);
for (const name of CAST_SIX) {
  assert.ok(CAST[name], `missing cast ${name}`);
}

console.log("elements ok: cg 12, scenes 24, tracks 16, fragments 16, effects 30, slots 90/10/10, cast 6");
