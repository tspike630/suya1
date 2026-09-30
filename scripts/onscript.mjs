import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CGS, CHAPTERS, FRAGMENTS, TRACKS, resolveFace, spriteKey } from "../src/cast.js";
import { EFFECT_IDS, SCENE_BEDS } from "../src/audio.js";
import {
  ACADEMIC_SPLIT,
  BOND_CAPS,
  ENDING_COPY,
  EPILOGUE_AT,
  HIDDEN_DISSONANCE,
  HIDDEN_LU,
  WAKE_AT,
} from "../src/ledger.js";
import manifest from "../src/voice/manifest.json" with { type: "json" };
import { NODES } from "../src/script.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gameDir = join(root, "game");

const SCREEN_W = 1280;
const SCREEN_H = 720;
const SPRITE_SCALE = 70;
const SPRITE_X = 860;
const SPRITE_Y = 470;

const NAME_COLOR = {
  鹿眠: "1d4e6f",
  沈知夏: "8f3d48",
  郁明: "8a6230",
  裴望: "3e382f",
  黍母: "8d4b32",
  黍琊: "2a211c",
  阿姨: "6a5b4a",
};

const REAL_SCENES = ["classroom", "dorm", "exam", "home", "corridor", "roof", "rain", "schoolgate", "repeat", "examout"];
const DREAM_SCENES = ["lobby", "guest", "gate", "library", "lab", "cafeteria", "award", "white"];
const ANOMALY_SCENES = ["calendar", "pork", "no301", "plaque", "faceless", "diary"];

const lines = [];
const once = new Map();
let onceCursor = 40;
let unlockSeq = 0;
const slot = { chapter: 200, ending: 210, cg: 220, music: 240, fragment: 260, ng: 219 };

function emit(text = "") {
  lines.push(text);
}

function choiceLabel(label) {
  const width = 30;
  const extra = Math.max(0, width - Array.from(label).length);
  return `${label}${"　".repeat(extra)}`;
}

function emitSelect(pairs) {
  emit(`select ${pairs.map(([label, target]) => `"${choiceLabel(label)}",${target}`).join(",")}`);
}

function onceVar(key) {
  if (!once.has(key)) {
    once.set(key, onceCursor);
    onceCursor += 1;
  }
  return once.get(key);
}

function spriteFile(who, face, pose, layer) {
  if (who === "阿姨") return "sprites/aunt/stand.png";
  const key = spriteKey(who, resolveFace(who, face), pose || "stand", layer);
  if (!key) return "";
  return `sprites/${key.replace(/\.webp$/, ".png")}`;
}

function voiceFile(who, face, text) {
  if (!who || !text) return "";
  return manifest[`${who}\u0000${face || ""}\u0000${text}`] || "";
}

function sayLine(line, node) {
  const who = line.who || "";
  const face = line.face || node.face || "";
  const pose = line.pose || node.pose || "stand";
  return { who, face, pose, text: line.text, se: line.se || "", voice: line.voice, kind: line.kind || "" };
}

function nodeLines(id) {
  const node = NODES[id];
  if (typeof node.lines !== "function") return (node.lines || []).map((line) => sayLine(line, node));
  return null;
}

function prefixOf(option) {
  const rows = [];
  if (option.say) rows.push(option.say);
  if (typeof option.thought === "string") rows.push({ text: option.thought, kind: "thought" });
  else if (option.thought) rows.push(option.thought);
  return rows;
}

function unlock(flagKey, saveNo, label) {
  const flag = onceVar(flagKey);
  const skip = `unlock_${unlockSeq}`;
  unlockSeq += 1;
  emit(`if %${flag}==1 goto *${skip}`);
  emit(`mov %${flag},1`);
  emit(`savegame2 ${saveNo},"${label}"`);
  emit(`*${skip}`);
}

function emitFx(fx) {
  if (!fx) return;
  if (fx.d) {
    emit(`mov %6,${fx.d}`);
    emit("gosub *add_d");
  }
  if (fx.lu) {
    emit(`mov %6,${fx.lu}`);
    emit("gosub *add_lu");
  }
  if (fx.shen) {
    emit(`mov %6,${fx.shen}`);
    emit("gosub *add_shen");
  }
  if (fx.yu) {
    emit(`mov %6,${fx.yu}`);
    emit("gosub *add_yu");
  }
  if (typeof fx.academic === "number" && fx.academic !== 0) {
    emit(`mov %6,${fx.academic}`);
    emit("gosub *add_ac");
  }
}

function emitDialogue(line, node, spriteState) {
  if (line.se) emit(`dwave 2,"se/${line.se}.wav"`);
  if (line.who) {
    spriteState.who = line.who;
    spriteState.face = line.face || node.face || "";
    spriteState.pose = line.pose || node.pose || "stand";
  } else if (line.face) {
    spriteState.face = line.face;
  }
  if (node.layer === "limen") {
    if (spriteState.current) {
      emit("csp 10");
      emit("print 1");
      spriteState.current = "";
    }
  } else if (spriteState.who) {
    const file = spriteFile(spriteState.who, spriteState.face, spriteState.pose, node.layer);
    if (file && file !== spriteState.current) {
      emit(`lsp2 10,"${file}",${SPRITE_X},${SPRITE_Y},${SPRITE_SCALE},${SPRITE_SCALE},0`);
      emit("print 1");
      spriteState.current = file;
    }
  }
  emit("dwavestop 0");
  if (line.voice !== false && line.who) {
    const clip = voiceFile(line.who, line.face || "", line.text);
    if (clip) emit(`dwave 0,"voice/${clip}"`);
  }
  if (line.who && NAME_COLOR[line.who]) emit(`#${NAME_COLOR[line.who]}${line.who}#f7f3ea　${line.text}@`);
  else emit(`#f7f3ea${line.text}@`);
}

function emitScene(id) {
  const node = NODES[id];
  emit(`*scene_${id}`);
  if (node.onEnter?.d) {
    const flag = id === "crack_cal" ? 30 : id === "crack_id" ? 31 : 32;
    emit(`if %${flag}==1 goto *enter_${id}_skip`);
    emit(`mov %${flag},1`);
    emit(`mov %6,${node.onEnter.d}`);
    emit("gosub *add_d");
    emit(`*enter_${id}_skip`);
  }
  if (node.title) {
    const index = CHAPTERS.indexOf(node.title);
    unlock(`chap_${index}`, slot.chapter + index, node.title);
    const shown = onceVar(`chap_shown_${index}`);
    emit(`if %${shown}==1 goto *chap_${id}_skip`);
    emit(`mov %${shown},1`);
    emit("bg black,1");
    emit("csp 10");
    emit("print 1");
    emit(`#f7f3ea${node.title}\\`);
    emit(`*chap_${id}_skip`);
  }
  if (node.cg) {
    const index = CGS.findIndex((cg) => cg.id === node.cg);
    const cg = CGS[index];
    unlock(`cg_${node.cg}`, slot.cg + index, node.cg);
    emit(`if %${onceVar(`cg_shown_${id}`)}==1 goto *cg_${id}_skip`);
    emit(`mov %${onceVar(`cg_shown_${id}`)},1`);
    emit(`bg "cg/${node.cg}.jpg",1`);
    emit("csp 10");
    emit("print 1");
    emit(`#f7f3ea${cg.title}`);
    emit(`#d7e6f0${cg.caption}\\`);
    emit(`*cg_${id}_skip`);
  }
  if (node.fragment) {
    const index = FRAGMENTS.findIndex((item) => item.id === node.fragment);
    unlock(`frag_${node.fragment}`, slot.fragment + index, node.fragment);
  }
  const bgmIndex = TRACKS.findIndex((track) => track.id === node.bgm);
  if (bgmIndex >= 0) emit(`gosub *bgm_${bgmIndex}`);
  const bed = SCENE_BEDS[node.bg] || "home";
  const bedIndex = [...new Set(Object.values(SCENE_BEDS))].indexOf(bed);
  emit(`gosub *bed_${bedIndex}`);
  emit(`bg "bg/${node.bg}.jpg",1`);
  emit("csp 10");
  emit("print 1");
  emit("return");
}

function emitBody(id, rows) {
  const node = NODES[id];
  const spriteState = {
    current: "",
    who: node.who || "",
    face: node.face || "",
    pose: node.pose || "stand",
  };
  for (const line of rows) emitDialogue(line, node, spriteState);
}

function emitEnding(id) {
  const ending = ENDING_COPY[id];
  const index = ["A", "TRUE", "B", "C", "E"].indexOf(id);
  emit(`*card_${id}`);
  emit(`#d7e6f0${ending.rank} · ${ending.code}`);
  emit(`#f7f3ea${ending.title}`);
  emit(`#d7e6f0${ending.tone}`);
  emit(`#f7f3ea${ending.text}@`);
  if (id === "B" || id === "C") {
    emit(`if %0>=${WAKE_AT} goto *card_${id}_done`);
    emit("#d7e6f0回看第三章，找出你没有追问的那件事。@");
    emit(`*card_${id}_done`);
  }
  emit(`savegame2 ${slot.ending + index},"${id}"`);
  emit(`savegame2 ${slot.ng},"ng"`);
  emit("return");
}

function emitStaticChoices(id) {
  const node = NODES[id];
  if (typeof node.options === "function" || !node.options?.length) return;
  emitSelect(node.options.map((option) => [option.label, `*pick_${id}_${option.id}`]));
  for (const option of node.options) {
    emit(`*pick_${id}_${option.id}`);
    emitFx(option.fx);
    if (option.set?.ngSpoke) emit("mov %20,1");
    if (option.fragment) {
      const index = FRAGMENTS.findIndex((item) => item.id === option.fragment);
      unlock(`frag_${option.fragment}`, slot.fragment + index, option.fragment);
    }
    const prefix = prefixOf(option);
    const next = option.next;
    if (!prefix.length) {
      emit(`goto *${next}`);
      continue;
    }
    emit(`goto *${next}__from_${id}_${option.id}`);
    emit(`*${next}__from_${id}_${option.id}`);
    emit(`gosub *scene_${next}`);
    emitBody(next, prefix);
    emit(`goto *${next}_body`);
  }
}

function emitScript() {
  lines.length = 0;
  once.clear();
  onceCursor = 40;
  unlockSeq = 0;

  emit(";s1280,720");
  emit("*define");
  emit("globalon");
  emit("savenumber 18");
  emit('rmenu "保存",save,"读取",load,"跳过",skip,"自动",automode,"回顾",lookback,"消去",windowerase,"标题",reset');
  emit('caption "黍琊：醒梦之间"');
  emit("game");

  emit("*start");
  emit("gosub *boot");
  emit('bg "bg/schoolgate.jpg",1');
  emit("csp 10");
  emit("print 1");
  emit("#f7f3ea《黍琊：醒梦之间》");
  emit("#d7e6f0点击画面，开始。右键可以读取。@");
  emit("gosub *bgm_0");
  emit(`savefileexist %199,${slot.ng}`);
  emit("if %199==1 goto *menu_ng");
  emit("goto *begin0");
  emit("*menu_ng");
  emitSelect([
    ["从头开始", "*begin0"],
    ["二周目", "*begin1"],
    ["回想", "*gallery"],
    ["音乐", "*musicbox"],
  ]);

  emit("*do_load");
  emit("systemcall load");
  emit("goto *start");

  emit("*begin0");
  emit("gosub *wipe");
  emit("mov %5,0");
  emit("goto *pro_rank");
  emit("*begin1");
  emit("gosub *wipe");
  emit("mov %5,1");
  emit("goto *ng_gate");

  emit("*boot");
  emit("humanz 15");
  emit("setwindow 48,560,34,3,34,38,2,6,6,0,1,#c8c8c8,24,540,1256,708");
  emit("textspeed 28");
  emit("return");

  emit("*wipe");
  for (const variable of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 30, 31, 32]) emit(`mov %${variable},0`);
  emit("return");

  emit("*add_d");
  emit("add %0,%6");
  emit("if %0>100 mov %0,100");
  emit("if %6<6 return");
  emit('dwave 2,"se/drop.wav"');
  emit("return");
  emit("*add_lu");
  emit("add %1,%6");
  emit("if %1<0 mov %1,0");
  emit(`if %1>${BOND_CAPS.lu} mov %1,${BOND_CAPS.lu}`);
  emit("return");
  emit("*add_shen");
  emit("add %2,%6");
  emit("if %2<0 mov %2,0");
  emit(`if %2>${BOND_CAPS.shen} mov %2,${BOND_CAPS.shen}`);
  emit("return");
  emit("*add_yu");
  emit("add %3,%6");
  emit("if %3<0 mov %3,0");
  emit(`if %3>${BOND_CAPS.yu} mov %3,${BOND_CAPS.yu}`);
  emit("return");
  emit("*add_ac");
  emit("add %4,%6");
  emit("if %4<0 mov %4,0");
  emit("if %4>100 mov %4,100");
  emit("return");

  const beds = [...new Set(Object.values(SCENE_BEDS))];
  TRACKS.forEach((track, index) => {
    emit(`*bgm_${index}`);
    unlock(`music_${track.id}`, slot.music + index, track.id);
    emit(`if %8==${index + 1} return`);
    emit("mp3stop");
    emit(`mp3loop "bgm/${track.id}.mp3"`);
    emit(`mov %8,${index + 1}`);
    emit("return");
  });
  beds.forEach((bed, index) => {
    emit(`*bed_${index}`);
    emit(`if %9==${index + 1} return`);
    emit("dwavestop 1");
    emit(`dwaveloop 1,"bed/${bed}.wav"`);
    emit(`mov %9,${index + 1}`);
    emit("return");
  });

  for (const id of Object.keys(NODES)) emitScene(id);

  for (const id of Object.keys(NODES)) {
    const node = NODES[id];
    emit(`*${id}`);
    emit(`gosub *scene_${id}`);
    emit(`*${id}_body`);
    if (id === "ch4_door") {
      emitDoor();
    } else {
      const rows = nodeLines(id);
      if (rows) emitBody(id, rows);
      if (node.ending) {
        emit(`gosub *card_${node.ending}`);
        emit("reset");
      } else if (id === "ch2_white") {
        emitChoicesWhite();
      } else if (id === "fin_hotel") {
        emitChoicesHotel();
      } else if (id === "second_exam") {
        emit("goto *epi_pick");
      } else if (typeof node.options === "function") {
        throw new Error(`unhandled options at ${id}`);
      } else if (node.options?.length) {
        emitStaticChoices(id);
      } else if (typeof node.next === "function") {
        throw new Error(`unhandled next at ${id}`);
      } else if (node.next) {
        emit(`goto *${node.next}`);
      } else if (!node.ending) {
        throw new Error(`scene ${id} has nowhere to go`);
      }
    }
  }

  for (const id of ["A", "TRUE", "B", "C", "E"]) emitEnding(id);

  emit("*epi_pick");
  emit("mov %15,0");
  emit("mov %16,0");
  emit("mov %17,0");
  emit(`if %1<${EPILOGUE_AT} goto *epi_s1`);
  emit("mov %15,%1");
  emit("mov %16,1");
  emit("mov %17,1");
  emit("*epi_s1");
  emit(`if %2<${EPILOGUE_AT} goto *epi_s2`);
  emit("if %2<%15 goto *epi_s2");
  emit("if %2>%15 goto *epi_s2w");
  emit("add %16,1");
  emit("goto *epi_s2");
  emit("*epi_s2w");
  emit("mov %15,%2");
  emit("mov %16,1");
  emit("mov %17,2");
  emit("*epi_s2");
  emit(`if %3<${EPILOGUE_AT} goto *epi_s3`);
  emit("if %3<%15 goto *epi_s3");
  emit("if %3>%15 goto *epi_s3w");
  emit("add %16,1");
  emit("goto *epi_s3");
  emit("*epi_s3w");
  emit("mov %15,%3");
  emit("mov %16,1");
  emit("mov %17,3");
  emit("*epi_s3");
  emit("if %16==0 goto *epi_default");
  emit("if %16>1 goto *epi_tie");
  emit("if %17==1 goto *epi_lu");
  emit("if %17==2 goto *epi_shen");
  emit("goto *epi_yu");

  emitGallery();
  emitWipeTail();

  return lines.join("\n") + "\n";
}

function emitDoor() {
  const node = NODES.ch4_door;
  const low = node.lines({ dissonance: 0, academic: 0, lu: 0, shen: 0, yu: 0, ngPlus: false, flags: {} });
  const high = node.lines({ dissonance: WAKE_AT, academic: 0, lu: 0, shen: 0, yu: 0, ngPlus: false, flags: {} });
  let shared = 0;
  while (shared < low.length && shared < high.length && low[shared].text === high[shared].text) shared += 1;
  emitBody("ch4_door", low.slice(0, shared));
  emit(`if %0<${WAKE_AT} goto *ch4_door_low`);
  emitBody("ch4_door", high.slice(shared));
  emit("goto *ch4_door_opts");
  emit("*ch4_door_low");
  emitBody("ch4_door", low.slice(shared));
  emit("*ch4_door_opts");
  emit(`if %0<${WAKE_AT} goto *ch4_door_stayonly`);
  emitSelect([
    ["醒来——回到那晚", "*ch4_door_wake"],
    ["留在这里——继续这场人生", "*ch4_door_stay"],
  ]);
  emit("*ch4_door_stayonly");
  emitSelect([["留在这里——继续这场人生", "*ch4_door_stay"]]);
  emit("*ch4_door_wake");
  emit("goto *finale");
  emit("*ch4_door_stay");
  emit(`if %4>=${ACADEMIC_SPLIT} goto *end_b`);
  emit("goto *end_c");
}

function emitChoicesWhite() {
  emit("*ch2_white_opts");
  emit("if %5==0 goto *ch2_white_base");
  emit("if %20==1 goto *ch2_white_base");
  emitSelect([
    ["认命，接受成绩单", "*pick_ch2_accept"],
    ["再来一次，开启新的人生", "*pick_ch2_again"],
    ["你好像在哪里见过她", "*pick_ch2_seen"],
  ]);
  emit("*ch2_white_base");
  emitSelect([
    ["认命，接受成绩单", "*pick_ch2_accept"],
    ["再来一次，开启新的人生", "*pick_ch2_again"],
  ]);
  emit("*pick_ch2_accept");
  emit("goto *end_a");
  emit("*pick_ch2_again");
  emit("goto *ch3_hotel");
  emit("*pick_ch2_seen");
  emit("mov %20,1");
  emit("goto *ch2_ng");
}

function emitChoicesHotel() {
  emit("*fin_hotel_opts");
  emit("if %5==0 goto *second_exam");
  emit(`if %0<${HIDDEN_DISSONANCE} goto *second_exam`);
  emit(`if %1<${HIDDEN_LU} goto *second_exam`);
  emitSelect([
    ["我们是不是见过", "*end_e"],
    ["我是来住一晚的", "*second_exam"],
  ]);
}

function emitGallery() {
  emit("*gallery");
  emit("bg black,1");
  emit("csp 10");
  emit("print 1");
  emit("#f7f3ea回想@");
  emitSelect([...CGS.map((cg, index) => [cg.title, `*cgview_${index}`]), ["返回", "*start"]]);
  CGS.forEach((cg, index) => {
    emit(`*cgview_${index}`);
    emit(`savefileexist %199,${slot.cg + index}`);
    emit(`if %199==0 goto *cgmiss_${index}`);
    emit(`bg "cg/${cg.id}.jpg",1`);
    emit("print 1");
    emit(`#f7f3ea${cg.title}`);
    emit(`#d7e6f0${cg.caption}@`);
    emit("goto *gallery");
    emit(`*cgmiss_${index}`);
    emit(`#d7e6f0${cg.title}　尚未收录@`);
    emit("goto *gallery");
  });

  emit("*musicbox");
  emit("bg black,1");
  emit("print 1");
  emit("#f7f3ea音乐@");
  emitSelect([...TRACKS.map((track, index) => [track.title, `*music_${index}`]), ["返回", "*start"]]);
  TRACKS.forEach((track, index) => {
    emit(`*music_${index}`);
    emit(`savefileexist %199,${slot.music + index}`);
    emit(`if %199==0 goto *musicmiss_${index}`);
    emit(`mp3stop`);
    emit(`mov %8,0`);
    emit(`mp3loop "bgm/${track.id}.mp3"`);
    emit(`#f7f3ea${track.title}@`);
    emit("goto *musicbox");
    emit(`*musicmiss_${index}`);
    emit(`#d7e6f0${track.title}　尚未收录@`);
    emit("goto *musicbox");
  });

  emit("*glossary");
  emit("bg black,1");
  emit("print 1");
  emit("#f7f3ea用语@");
  emitSelect([...FRAGMENTS.map((item, index) => [item.title, `*word_${index}`]), ["返回", "*start"]]);
  FRAGMENTS.forEach((item, index) => {
    emit(`*word_${index}`);
    emit(`savefileexist %199,${slot.fragment + index}`);
    emit(`if %199==0 goto *wordmiss_${index}`);
    emit(`#f7f3ea${item.title}`);
    emit(`#d7e6f0${item.text}@`);
    emit("goto *glossary");
    emit(`*wordmiss_${index}`);
    emit(`#d7e6f0${item.title}　尚未收录@`);
    emit("goto *glossary");
  });

  emit("*flow");
  emit("bg black,1");
  emit("print 1");
  emit("#f7f3ea流程@");
  CHAPTERS.forEach((title, index) => {
    emit(`savefileexist %199,${slot.chapter + index}`);
    emit(`if %199==0 goto *flowmiss_${index}`);
    emit(`#f7f3ea${title}`);
    emit(`goto *flownext_${index}`);
    emit(`*flowmiss_${index}`);
    emit(`#d7e6f0${title}`);
    emit(`*flownext_${index}`);
  });
  emit("#d7e6f0现实十景　教室、宿舍、考场、家、走廊、天台、雨、校门、复读、出考场");
  emit("#d7e6f0梦八景　大堂、客房、校门、图书馆、实验室、食堂、颁奖、白光");
  emit("#d7e6f0异常六景　日历、红烧肉、301、匾额、无脸、日记@");
  const endingNames = [
    ["A", "NE 早醒的雨"],
    ["TRUE", "真结局 醒来之后"],
    ["B", "BE 学术之巅"],
    ["C", "BE 完美人生"],
    ["E", "GE 我也在梦里"],
  ];
  endingNames.forEach(([id, label], index) => {
    emit(`savefileexist %199,${slot.ending + index}`);
    emit(`if %199==0 goto *flowendmiss_${index}`);
    emit(`#f7f3ea${label}`);
    emit(`goto *flowendnext_${index}`);
    emit(`*flowendmiss_${index}`);
    emit(`#d7e6f0${label}`);
    emit(`*flowendnext_${index}`);
  });
  emit("#d7e6f0二周目在通关后出现。隐藏结局要违和够高，鹿眠也够。@");
  emitSelect([["返回", "*start"]]);

  emit("*config");
  emit("bg black,1");
  emit("print 1");
  emit("#f7f3ea设定@");
  emitSelect([
    ["文字慢", "*speed_slow"],
    ["文字中", "*speed_mid"],
    ["文字快", "*speed_fast"],
    ["返回", "*start"],
  ]);
  emit("*speed_slow");
  emit("textspeed 60");
  emit("goto *config");
  emit("*speed_mid");
  emit("textspeed 28");
  emit("goto *config");
  emit("*speed_fast");
  emit("textspeed 8");
  emit("goto *config");
}

function emitWipeTail() {
  const flags = [...once.values()];
  const wipeAt = lines.findIndex((line) => line === "*wipe");
  const extra = flags.map((flag) => `mov %${flag},0`);
  lines.splice(wipeAt + 1, 0, ...extra);
}

function collectQuotedText() {
  const found = [];
  const state = { dissonance: 80, academic: ACADEMIC_SPLIT, lu: 60, shen: 30, yu: 26, ngPlus: true, flags: {} };
  const low = { dissonance: 0, academic: 0, lu: 0, shen: 0, yu: 0, ngPlus: false, flags: {} };
  for (const node of Object.values(NODES)) {
    const rows = typeof node.lines === "function" ? [...node.lines(low), ...node.lines(state)] : node.lines || [];
    for (const line of rows) found.push(line.text);
    const options = typeof node.options === "function" ? [...(node.options(low) || []), ...(node.options(state) || [])] : node.options || [];
    for (const option of options) {
      found.push(option.label);
      if (option.say) found.push(option.say.text);
      if (typeof option.thought === "string") found.push(option.thought);
      else if (option.thought) found.push(option.thought.text);
    }
  }
  for (const ending of Object.values(ENDING_COPY)) {
    found.push(ending.title, ending.text, ending.rank);
  }
  return found;
}

export async function writeOnsScript() {
  const script = emitScript();
  if (script.includes("秦琊")) throw new Error("plot drift: 秦琊");
  const required = ["九十厘米", "红烧肉", "301", "睡够了，就回家", "六月九日", "如果这也是梦呢", "白衬衫"];
  for (const phrase of required) {
    if (!script.includes(phrase)) throw new Error(`missing plot line: ${phrase}`);
  }
  for (const phrase of collectQuotedText()) {
    if (!script.includes(phrase)) throw new Error(`script dropped a line: ${phrase.slice(0, 24)}`);
  }
  const labels = new Map();
  script.split("\n").forEach((line, index) => {
    if (!line.startsWith("*")) return;
    if (labels.has(line)) throw new Error(`duplicate label ${line} at ${labels.get(line)} and ${index}`);
    labels.set(line, index);
  });
  const covered = new Set([...REAL_SCENES, ...DREAM_SCENES, ...ANOMALY_SCENES]);
  if (covered.size !== 24) throw new Error(`scene groups must total 24, got ${covered.size}`);
  for (const id of Object.keys(SCENE_BEDS)) {
    if (!covered.has(id)) throw new Error(`scene ${id} is not classified`);
  }
  await mkdir(gameDir, { recursive: true });
  await writeFile(join(gameDir, "0.txt"), script, "utf8");
  const beds = [...new Set(Object.values(SCENE_BEDS))];
  const assetManifest = {
    se: EFFECT_IDS,
    beds,
    music: TRACKS.map((track) => track.id),
    voices: [...new Set(Object.values(manifest))],
    cgs: CGS.map((cg) => ({
      id: cg.id,
      scene: cg.scene,
      title: cg.title,
      caption: cg.caption,
      sprite: cg.who ? spriteKey(cg.who, resolveFace(cg.who, cg.face), cg.pose || "stand", cg.layer) : "",
    })),
    scenes: { real: REAL_SCENES, dream: DREAM_SCENES, anomaly: ANOMALY_SCENES },
  };
  await writeFile(join(gameDir, "manifest.json"), JSON.stringify(assetManifest, null, 2), "utf8");
  return script;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await writeOnsScript();
  console.log("wrote game/0.txt");
}
