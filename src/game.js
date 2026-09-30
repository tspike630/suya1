import { ENDING_COPY } from "./ledger.js";
import { advance, choose, getLines, lineKey, newSession, optionsFor } from "./engine.js";
import { NODES } from "./script.js";
import {
  CHAPTERS,
  CGS,
  DREAM_END_HINT,
  ENDING_GATES,
  FRAGMENTS,
  SCENE_NAMES,
  TRACKS,
  cgMarkup,
  nameColor,
  resolveFace,
  sceneMarkup,
  spriteMarkup,
  trackTitle,
} from "./cast.js";
import { createScore } from "./audio.js";

const META_KEY = "suya-meta-v2";
const SPEEDS = [0, 18, 42, 80];
const SLOT_COUNT = 12;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function loadMeta() {
  try {
    const parsed = JSON.parse(localStorage.getItem(META_KEY) || "");
    if (parsed && typeof parsed === "object") {
      parsed.read ??= {};
      parsed.endings ??= [];
      parsed.cgs ??= [];
      parsed.music ??= [];
      parsed.fragments ??= [];
      parsed.chapters ??= [];
      parsed.slots ??= Array(SLOT_COUNT).fill(null);
      parsed.autos ??= [];
      parsed.settings ??= { speed: 2, auto: 1, bgm: 0.6, se: 0.45, size: 1 };
      return parsed;
    }
  } catch {
    /* fresh profile */
  }
  return {
    read: {},
    endings: [],
    cgs: [],
    music: [],
    fragments: [],
    chapters: [],
    slots: Array(SLOT_COUNT).fill(null),
    autos: [],
    quick: null,
    resume: null,
    settings: { speed: 2, auto: 1, bgm: 0.6, se: 0.45, size: 1 },
  };
}

function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function hydrate(session) {
  session.fragments ??= [];
  session.heard ??= [];
  session.choices ??= [];
  session.flags ??= {};
  session.log ??= [];
  session.seenTitles ??= [];
  session.feedback = null;
  session.glitch = false;
  return session;
}

function stamp(session) {
  const line = getLines(session)[session.line];
  const node = NODES[session.nodeId];
  return {
    session: JSON.parse(JSON.stringify(session)),
    at: new Date().toISOString(),
    place: SCENE_NAMES[node?.bg] || "",
    text: line?.text || node?.title || "存档",
  };
}

function voiced(line) {
  if (!line?.who || line.voice === false) return false;
  if (line.voice === true) return true;
  return line.who === "鹿眠";
}

function presenceOf(session) {
  const node = NODES[session.nodeId];
  if (!node || node.layer === "limen" || session.phase === "ending") return null;
  const lines = getLines(session).slice(0, session.line + 1);
  let who = node.who || null;
  let face = node.face || null;
  let pose = node.pose || "stand";
  for (const line of lines) {
    if (line.who) {
      who = line.who;
      face = line.face || null;
      pose = line.pose || node.pose || "stand";
    } else if (line.face) {
      face = line.face;
    }
  }
  if (!who) return null;
  return { who, face: resolveFace(who, face), pose };
}

export function mountGame(root) {
  const meta = loadMeta();
  const score = createScore();
  score.setVolumes(meta.settings);
  root.innerHTML = `
    <div class="vn" id="vn">
      <div class="bg" id="bg"></div>
      <div class="sprite" id="sprite" hidden></div>
      <p class="place" id="place"></p>
      <p class="meter" id="meter" hidden></p>
      <svg class="thorn" id="thorn" viewBox="0 0 32 32" hidden aria-hidden="true"><path d="M16 2 L19 12 L30 14 L21 20 L24 30 L16 24 L8 30 L11 20 L2 14 L13 12 Z" fill="#e7c27a"/></svg>
      <p class="track" id="track" hidden></p>
      <button class="chapter-card" id="chapter-card" type="button" hidden></button>
      <button class="cg-frame" id="cg-frame" type="button" hidden></button>
      <button class="advance" id="advance" type="button">
        <div class="box" id="box">
          <span class="name" id="name" hidden></span>
          <p id="text"></p>
          <i class="caret" id="caret" hidden></i>
        </div>
      </button>
      <div class="choices" id="choices" hidden></div>
      <div class="ending" id="ending" hidden></div>
      <nav class="dock" id="dock" hidden>
        <button type="button" data-open="save">存档</button>
        <button type="button" data-open="load">读档</button>
        <button type="button" data-act="quick-save">快存</button>
        <button type="button" data-act="quick-load">快读</button>
        <button type="button" data-open="log">回顾</button>
        <button type="button" data-act="auto">自动</button>
        <button type="button" data-act="skip">快进</button>
        <button type="button" data-open="flow">流程</button>
        <button type="button" data-open="gallery">回想</button>
        <button type="button" data-open="config">设置</button>
      </nav>
      <div class="title-screen" id="title-screen"></div>
      <div class="overlay" id="overlay" hidden></div>
    </div>
  `;

  const vn = root.querySelector("#vn");
  const bg = root.querySelector("#bg");
  const sprite = root.querySelector("#sprite");
  const place = root.querySelector("#place");
  const meter = root.querySelector("#meter");
  const thorn = root.querySelector("#thorn");
  const trackEl = root.querySelector("#track");
  const card = root.querySelector("#chapter-card");
  const cgFrame = root.querySelector("#cg-frame");
  const advanceHit = root.querySelector("#advance");
  const nameEl = root.querySelector("#name");
  const textEl = root.querySelector("#text");
  const caret = root.querySelector("#caret");
  const choicesEl = root.querySelector("#choices");
  const endingEl = root.querySelector("#ending");
  const dock = root.querySelector("#dock");
  const titleEl = root.querySelector("#title-screen");
  const overlay = root.querySelector("#overlay");

  let session = null;
  let screen = "title";
  let galleryTab = "cg";
  let shown = 0;
  let full = "";
  let typing = null;
  let autoTimer = null;
  let autoOn = false;
  let skipOn = false;
  let fast = false;
  let hideBox = false;
  let playedKey = "";
  let glitchKey = "";
  let padWas = [false, false];
  let feedbackTimer = null;
  let holdTimer = null;

  function cps() {
    return SPEEDS[meta.settings.speed] ?? 42;
  }

  function stopTimers() {
    clearInterval(typing);
    clearTimeout(autoTimer);
    typing = null;
    autoTimer = null;
  }

  function lineDone() {
    return shown >= full.length;
  }

  function rememberRead() {
    if (!session || session.phase !== "text") return;
    meta.read[lineKey(session)] = true;
  }

  function renderText() {
    const node = session ? NODES[session.nodeId] : null;
    if (!node || node.layer !== "limen") {
      textEl.textContent = full.slice(0, shown);
      return;
    }
    const lines = getLines(session).slice(0, session.line + 1);
    textEl.replaceChildren();
    lines.forEach((item, index) => {
      const span = document.createElement("span");
      const last = index === lines.length - 1;
      if (item.who) {
        const label = document.createElement("b");
        label.textContent = item.who;
        label.style.color = nameColor(item.who);
        span.append(label);
      }
      span.append(last ? full.slice(0, shown) : item.text);
      textEl.append(span);
    });
  }

  function queueAuto() {
    clearTimeout(autoTimer);
    if (!autoOn || !session || screen !== "play" || !overlay.hidden) return;
    if (session.chapterCard || session.cgMoment) {
      autoTimer = setTimeout(() => step(), 1100);
      return;
    }
    if (session.phase !== "text" || !lineDone()) return;
    const wait = [420, 900, 1500][meta.settings.auto] ?? 900;
    autoTimer = setTimeout(() => step(), wait);
  }

  function finishLine() {
    shown = full.length;
    clearInterval(typing);
    typing = null;
    renderText();
    caret.hidden = session?.phase !== "text";
    rememberRead();
    queueAuto();
  }

  function typeLine(line) {
    stopTimers();
    full = line?.text || "";
    const already = !!meta.read[lineKey(session)];
    if (cps() === 0 || already || fast) {
      shown = full.length;
      renderText();
      caret.hidden = false;
      rememberRead();
      if (fast || (skipOn && already)) autoTimer = setTimeout(() => step(), 16);
      else queueAuto();
      return;
    }
    shown = 0;
    renderText();
    caret.hidden = true;
    const interval = Math.max(12, Math.round(1000 / cps()));
    typing = setInterval(() => {
      shown += 1;
      renderText();
      if (lineDone()) finishLine();
    }, interval);
  }

  function playLine(line) {
    if (!line) return;
    const key = `${lineKey(session)}:${line.se || ""}:${line.who || ""}`;
    if (playedKey === key) return;
    playedKey = key;
    if (line.se) score.effect(line.se);
    if (voiced(line)) score.voice(line.who);
    if (line.kind === "glitch" && glitchKey !== lineKey(session)) {
      glitchKey = lineKey(session);
      session.glitch = true;
    }
  }

  function unlockCollections() {
    const node = NODES[session.nodeId];
    if (node?.title && !meta.chapters.includes(node.title)) meta.chapters.push(node.title);
    for (const id of session.fragments || []) {
      if (!meta.fragments.includes(id)) meta.fragments.push(id);
    }
    for (const id of session.heard || []) {
      if (!meta.music.includes(id)) meta.music.push(id);
    }
  }

  function autosave() {
    if (!session || session.phase === "ending") return;
    const shot = stamp(session);
    meta.resume = shot;
    if (!session.flags[`auto:${session.nodeId}`]) {
      session.flags[`auto:${session.nodeId}`] = true;
      meta.autos = [shot, ...(meta.autos || [])].slice(0, 5);
    }
    saveMeta(meta);
  }

  function applySize() {
    const size = ["1rem", "1.12rem", "1.28rem"][meta.settings.size] || "1.12rem";
    vn.style.setProperty("--text", size);
  }

  function paintChrome() {
    const node = session ? NODES[session.nodeId] : null;
    const present = session && screen === "play" && !session.chapterCard && !session.cgMoment ? presenceOf(session) : null;
    vn.dataset.layer = node?.layer || "real";
    vn.dataset.phase = session?.phase || screen;
    if (session?.meter) vn.dataset.meter = "1";
    else delete vn.dataset.meter;
    bg.innerHTML = sceneMarkup(node?.bg || "dorm");
    const cover = !!(session?.chapterCard || session?.cgMoment);
    place.hidden = screen !== "play" || cover;
    place.textContent = SCENE_NAMES[node?.bg] || "";
    sprite.hidden = !present;
    if (present) {
      sprite.dataset.who = present.who;
      sprite.dataset.face = present.face;
      sprite.dataset.pose = present.pose;
      sprite.innerHTML = spriteMarkup(present.who, present.face, present.pose, node.layer);
    }
    meter.hidden = !(session?.meter && screen === "play" && !session.chapterCard);
    meter.textContent = session?.meter ? `违和 ${session.dissonance}` : "";
    const title = trackTitle(node?.bgm || score.currentId());
    trackEl.hidden = screen !== "play" || !title || cover;
    trackEl.textContent = title ? `♪ ${title}` : "";
    dock.hidden = screen !== "play" || !!session?.chapterCard || !!session?.cgMoment;
    dock.querySelector("[data-act='auto']").dataset.on = autoOn ? "1" : "0";
    dock.querySelector("[data-act='skip']").dataset.on = skipOn ? "1" : "0";
    if (node?.bgm) score.play(node.bgm);
    score.setLayer(node?.layer || "real");
    applySize();
  }

  function paintLine() {
    const node = NODES[session.nodeId];
    const limen = node.layer === "limen";
    const showCard = !!session.chapterCard;
    const showCg = !!session.cgMoment && !showCard;
    const blocked = showCard || showCg;
    advanceHit.hidden = blocked || session.phase === "ending";
    choicesEl.hidden = session.phase !== "choice" || blocked;
    endingEl.hidden = session.phase !== "ending";
    card.hidden = !showCard;
    card.textContent = session.chapterCard || "";
    cgFrame.hidden = !showCg;
    if (session.cgMoment) cgFrame.innerHTML = cgMarkup(session.cgMoment);
    advanceHit.dataset.limen = limen ? "1" : "0";
    advanceHit.classList.toggle("is-hidden", hideBox && !limen && session.phase === "text" && !blocked);
    if (blocked) return;

    if (session.phase === "ending") {
      const ending = ENDING_COPY[session.endingId];
      if (!meta.endings.includes(session.endingId)) meta.endings.push(session.endingId);
      saveMeta(meta);
      const hint =
        (session.endingId === "B" || session.endingId === "C") && session.dissonance < 60
          ? `<p class="hint-line">${DREAM_END_HINT}</p>`
          : "";
      const scoreLine = session.meter ? `<p class="hint-line">违和感 ${session.dissonance}</p>` : "";
      endingEl.innerHTML = `
        <p class="kicker">${escapeHtml(ending.code)}</p>
        <h2>${escapeHtml(ending.title)}</h2>
        <p class="tone">${escapeHtml(ending.tone)}</p>
        <p>${escapeHtml(ending.text)}</p>
        ${scoreLine}
        ${hint}
        <button type="button" data-act="title">回到标题</button>
      `;
      return;
    }

    if (session.phase === "choice") {
      const options = optionsFor(session);
      const lines = getLines(session);
      const line = [...lines].reverse().find((item) => item.text) || null;
      choicesEl.innerHTML = options
        .map((option) => `<button type="button" data-choice="${escapeHtml(option.id)}">${escapeHtml(option.label)}</button>`)
        .join("");
      nameEl.hidden = !line?.who;
      nameEl.textContent = line?.who || "";
      nameEl.dataset.who = line?.who || "";
      textEl.textContent = line?.text || "";
      caret.hidden = true;
      return;
    }

    const line = getLines(session)[session.line];
    nameEl.hidden = !line?.who || limen;
    nameEl.textContent = line?.who || "";
    nameEl.dataset.who = line?.who || "";
    if (line?.who && voiced(line)) nameEl.dataset.voice = "1";
    else delete nameEl.dataset.voice;
    playLine(line);
    typeLine(line);
  }

  function consumePulse() {
    if (!session) return;
    if (session.glitch) {
      session.glitch = false;
      vn.dataset.hold = "1";
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => delete vn.dataset.hold, 300);
    }
    if (!session.feedback) return;
    const kind = session.feedback;
    session.feedback = null;
    vn.dataset.feedback = kind;
    if (kind === "drop") score.effect("drop");
    if (!session.meter) {
      thorn.hidden = false;
      thorn.dataset.on = "1";
    }
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      delete vn.dataset.feedback;
      thorn.hidden = true;
      thorn.dataset.on = "0";
    }, 900);
  }

  function paintTitle() {
    titleEl.hidden = screen !== "title";
    if (screen !== "title") return;
    const endings = meta.endings.length ? `<p class="cleared">已抵达 ${meta.endings.map(escapeHtml).join(" · ")}</p>` : "";
    const ng = meta.endings.length ? `<button type="button" data-act="ng">二周目</button>` : "";
    titleEl.innerHTML = `
      <div class="title-copy">
        <p class="kicker">视觉小说</p>
        <h1><span>黍琊</span><small>醒梦之间</small></h1>
        <p class="tag">你不需要重写昨天。</p>
        ${endings}
      </div>
      <div class="title-menu">
        <button type="button" data-act="new">新游戏</button>
        <button type="button" data-act="continue" ${meta.resume ? "" : "disabled"}>继续</button>
        ${ng}
        <button type="button" data-open="load">读取</button>
        <button type="button" data-open="gallery">回想</button>
        <button type="button" data-open="flow">流程</button>
        <button type="button" data-open="config">设置</button>
      </div>
      <p class="hint">点击推进 · Enter · A 自动 · Ctrl 快进</p>
    `;
  }

  function render() {
    if (!session || screen === "title") {
      dock.hidden = true;
      advanceHit.hidden = true;
      choicesEl.hidden = true;
      endingEl.hidden = true;
      card.hidden = true;
      cgFrame.hidden = true;
      sprite.hidden = true;
      meter.hidden = true;
      thorn.hidden = true;
      trackEl.hidden = true;
      place.hidden = true;
      bg.innerHTML = sceneMarkup("dorm");
      vn.dataset.layer = "real";
      paintTitle();
      return;
    }
    titleEl.hidden = true;
    if (session.cgMoment && meta.cgs.includes(session.cgMoment) && (skipOn || fast)) {
      session.cgMoment = null;
    }
    if (session.cgMoment && !meta.cgs.includes(session.cgMoment)) meta.cgs.push(session.cgMoment);
    unlockCollections();
    paintChrome();
    paintLine();
    consumePulse();
    if (session.chapterCard || session.cgMoment) queueAuto();
    autosave();
  }

  function begin(payload) {
    const next = payload?.nodeId ? payload : payload?.session;
    if (!next) return;
    stopTimers();
    autoOn = false;
    skipOn = false;
    playedKey = "";
    session = hydrate(next);
    screen = "play";
    overlay.hidden = true;
    score.unlock();
    score.setVolumes(meta.settings);
    render();
  }

  function step() {
    if (!session || screen !== "play" || !overlay.hidden) return;
    if (session.chapterCard) {
      session.chapterCard = null;
      render();
      return;
    }
    if (session.cgMoment) {
      session.cgMoment = null;
      render();
      return;
    }
    if (session.phase === "text" && !lineDone()) {
      finishLine();
      return;
    }
    if (session.phase === "choice" || session.phase === "ending") return;
    advance(session);
    render();
  }

  function slotButtons(kind) {
    return meta.slots
      .map((slot, index) => {
        const label = slot ? `${slot.place}　${slot.text.slice(0, 18)}` : "空";
        return `<button type="button" data-slot="${index}" data-kind="${kind}"><b>${index + 1}</b><span>${escapeHtml(label)}</span></button>`;
      })
      .join("");
  }

  function slotList(kind) {
    const quick =
      kind === "save"
        ? `<button type="button" data-act="quick-save">快速存档</button>`
        : `<button type="button" data-act="quick-load" ${meta.quick ? "" : "disabled"}>快速读档${meta.quick ? ` · ${escapeHtml(meta.quick.place)}` : ""}</button>`;
    const autos =
      kind === "load"
        ? meta.autos
            .map(
              (slot, index) =>
                `<button type="button" data-autoload="${index}"><b>自动 ${index + 1}</b><span>${escapeHtml(slot.place)}　${escapeHtml(slot.text.slice(0, 16))}</span></button>`,
            )
            .join("")
        : "";
    return `<section class="panel"><header><h2>${kind === "save" ? "存档" : "读档"}</h2><button type="button" data-act="close">关闭</button></header>${quick}<div class="slots">${slotButtons(kind)}</div>${autos}</section>`;
  }

  function logView() {
    const rows = (session?.log || [])
      .slice(-120)
      .map((entry) => {
        const color = nameColor(entry.who);
        const who = entry.who ? `<b style="color:${color}">${escapeHtml(entry.who)}</b>` : "";
        return `<p>${who}${escapeHtml(entry.text)}</p>`;
      })
      .join("");
    return `<section class="panel log"><header><h2>回顾</h2><button type="button" data-act="close">关闭</button></header><div>${rows || "<p>还没有读过的句子。</p>"}</div></section>`;
  }

  function flowView() {
    const chapters = CHAPTERS.map(
      (title) => `<li data-on="${meta.chapters.includes(title) ? "1" : "0"}">${escapeHtml(title)}</li>`,
    ).join("");
    const endings = ["TRUE", "A", "B", "C", "E"]
      .map((id) => {
        const ending = ENDING_COPY[id];
        const on = meta.endings.includes(id);
        const gate = on ? ending.title : ENDING_GATES[id];
        return `<li data-on="${on ? "1" : "0"}"><b>${on ? ending.code : "未达"}</b><span>${escapeHtml(on ? ending.title : gate)}</span></li>`;
      })
      .join("");
    const cracks = (session?.choices || [])
      .filter((choice) => /^d\d+$/.test(choice.nodeId))
      .map((choice) => {
        const mark = choice.d > 0 ? "追问" : "放过";
        const num = session.meter && choice.d > 0 ? ` +${choice.d}` : "";
        return `<li data-on="${choice.d > 0 ? "1" : "0"}">${escapeHtml(choice.label)}<em>${mark}${num}</em></li>`;
      })
      .join("");
    const crackBlock = cracks ? `<h3>第三章里你问过的和放过的</h3><ul class="crack-list">${cracks}</ul>` : "";
    const now =
      session?.meter && screen === "play"
        ? `<p class="hint-line">现在的违和感是 ${session.dissonance}。醒来的门${session.dissonance >= 60 ? "开着" : "还关着"}。</p>`
        : "";
    return `<section class="panel"><header><h2>流程</h2><button type="button" data-act="close">关闭</button></header><ol class="flow-list">${chapters}</ol><ol class="end-list">${endings}</ol>${now}${crackBlock}</section>`;
  }

  function galleryView() {
    const tabs = [
      ["cg", "CG"],
      ["music", "音乐"],
      ["ending", "结局"],
      ["fragment", "词条"],
    ]
      .map(
        ([id, label]) =>
          `<button type="button" data-tab="${id}" data-on="${galleryTab === id ? "1" : "0"}">${label}</button>`,
      )
      .join("");
    let body = "";
    if (galleryTab === "cg") {
      body = `<ul class="gallery">${CGS.map((cg) => {
        const on = meta.cgs.includes(cg.id);
        return `<li data-on="${on ? "1" : "0"}"><button type="button" data-cg="${cg.id}" ${on ? "" : "disabled"}>${on ? escapeHtml(cg.title) : "？"}</button></li>`;
      }).join("")}</ul>`;
    } else if (galleryTab === "music") {
      body = `<ul class="gallery music">${TRACKS.map((track) => {
        const on = meta.music.includes(track.id);
        return `<li data-on="${on ? "1" : "0"}"><button type="button" data-track="${track.id}" ${on ? "" : "disabled"}>${on ? escapeHtml(track.title) : "？"}</button></li>`;
      }).join("")}</ul>`;
    } else if (galleryTab === "ending") {
      body = `<ul class="end-list">${["TRUE", "A", "B", "C", "E"].map((id) => {
        const ending = ENDING_COPY[id];
        const on = meta.endings.includes(id);
        return `<li data-on="${on ? "1" : "0"}"><b>${escapeHtml(ending.code)}</b><span>${on ? `${escapeHtml(ending.title)} · ${escapeHtml(ending.tone)}` : "尚未抵达"}</span></li>`;
      }).join("")}</ul>`;
    } else {
      body = `<ul class="frag-list">${FRAGMENTS.map((item) => {
        const on = meta.fragments.includes(item.id);
        return `<li data-on="${on ? "1" : "0"}"><b>${on ? escapeHtml(item.title) : "？"}</b><span>${on ? escapeHtml(item.text) : ""}</span></li>`;
      }).join("")}</ul>`;
    }
    return `<section class="panel"><header><h2>回想</h2><button type="button" data-act="close">关闭</button></header><div class="seg">${tabs}</div>${body}</section>`;
  }

  function cgViewer(id) {
    return `<section class="panel viewer"><header><h2>CG</h2><button type="button" data-act="back-gallery">返回</button></header>${cgMarkup(id)}</section>`;
  }

  function configView() {
    const speed = ["瞬间", "慢", "中", "快"]
      .map(
        (label, index) =>
          `<button type="button" data-speed="${index}" data-on="${meta.settings.speed === index ? "1" : "0"}">${label}</button>`,
      )
      .join("");
    const auto = ["短", "中", "长"]
      .map(
        (label, index) =>
          `<button type="button" data-auto="${index}" data-on="${meta.settings.auto === index ? "1" : "0"}">${label}</button>`,
      )
      .join("");
    const size = ["小", "中", "大"]
      .map(
        (label, index) =>
          `<button type="button" data-size="${index}" data-on="${meta.settings.size === index ? "1" : "0"}">${label}</button>`,
      )
      .join("");
    return `<section class="panel"><header><h2>设置</h2><button type="button" data-act="close">关闭</button></header>
      <p>文字速度</p><div class="seg">${speed}</div>
      <p>自动等待</p><div class="seg">${auto}</div>
      <p>字号</p><div class="seg">${size}</div>
      <p>音乐 <span id="bgm-read">${Math.round(meta.settings.bgm * 100)}</span></p>
      <input data-vol="bgm" type="range" min="0" max="1" step="0.05" value="${meta.settings.bgm}" />
      <p>音效 <span id="se-read">${Math.round(meta.settings.se * 100)}</span></p>
      <input data-vol="se" type="range" min="0" max="1" step="0.05" value="${meta.settings.se}" />
      <p><button type="button" data-act="full">全屏</button></p>
    </section>`;
  }

  function openScreen(name) {
    stopTimers();
    overlay.hidden = false;
    if (name === "save") overlay.innerHTML = slotList("save");
    else if (name === "load") overlay.innerHTML = slotList("load");
    else if (name === "log") overlay.innerHTML = logView();
    else if (name === "flow") overlay.innerHTML = flowView();
    else if (name === "gallery") overlay.innerHTML = galleryView();
    else if (name === "config") overlay.innerHTML = configView();
  }

  function closeOverlay() {
    overlay.hidden = true;
    overlay.innerHTML = "";
    if (session && screen === "play") render();
    else paintTitle();
  }

  function saveQuick() {
    if (!session || screen !== "play") return;
    meta.quick = stamp(session);
    saveMeta(meta);
  }

  root.addEventListener("click", (event) => {
    const act = event.target.closest("[data-act]");
    const open = event.target.closest("[data-open]");
    const choice = event.target.closest("[data-choice]");
    const slot = event.target.closest("[data-slot]");
    const tab = event.target.closest("[data-tab]");
    const cg = event.target.closest("[data-cg]");
    const track = event.target.closest("[data-track]");
    const autoSlot = event.target.closest("[data-autoload]");
    if (act?.dataset.act === "new") return begin(newSession(false));
    if (act?.dataset.act === "ng") return begin(newSession(true));
    if (act?.dataset.act === "continue" && meta.resume) return begin(meta.resume);
    if (act?.dataset.act === "title") {
      screen = "title";
      session = null;
      stopTimers();
      overlay.hidden = true;
      score.setLayer("real");
      render();
      return;
    }
    if (act?.dataset.act === "close") return closeOverlay();
    if (act?.dataset.act === "back-gallery") return openScreen("gallery");
    if (act?.dataset.act === "full") {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
      return;
    }
    if (act?.dataset.act === "quick-save") {
      saveQuick();
      if (!overlay.hidden) openScreen("save");
      return;
    }
    if (act?.dataset.act === "quick-load" && meta.quick) return begin(meta.quick);
    if (act?.dataset.act === "auto") {
      autoOn = !autoOn;
      if (autoOn) skipOn = false;
      paintChrome();
      queueAuto();
      return;
    }
    if (act?.dataset.act === "skip") {
      skipOn = !skipOn;
      if (skipOn) autoOn = false;
      paintChrome();
      if (skipOn) step();
      return;
    }
    if (tab) {
      galleryTab = tab.dataset.tab;
      openScreen("gallery");
      return;
    }
    if (cg && meta.cgs.includes(cg.dataset.cg)) {
      overlay.innerHTML = cgViewer(cg.dataset.cg);
      return;
    }
    if (track && meta.music.includes(track.dataset.track)) {
      score.unlock();
      score.play(track.dataset.track);
      return;
    }
    if (open) return openScreen(open.dataset.open);
    if (autoSlot && meta.autos[Number(autoSlot.dataset.auto)]) {
      return begin(meta.autos[Number(autoSlot.dataset.auto)]);
    }
    if (slot) {
      const index = Number(slot.dataset.slot);
      if (slot.dataset.kind === "save" && session) {
        meta.slots[index] = stamp(session);
        saveMeta(meta);
        openScreen("save");
      }
      if (slot.dataset.kind === "load" && meta.slots[index]) begin(meta.slots[index]);
      return;
    }
    if (choice && session?.phase === "choice") {
      const options = optionsFor(session);
      const index = options.findIndex((option) => option.id === choice.dataset.choice);
      choose(session, index);
      render();
      return;
    }
    const speed = event.target.closest("[data-speed]");
    if (speed) {
      meta.settings.speed = Number(speed.dataset.speed);
      saveMeta(meta);
      openScreen("config");
      return;
    }
    const auto = event.target.closest("[data-auto]");
    if (auto) {
      meta.settings.auto = Number(auto.dataset.auto);
      saveMeta(meta);
      openScreen("config");
      return;
    }
    const size = event.target.closest("[data-size]");
    if (size) {
      meta.settings.size = Number(size.dataset.size);
      saveMeta(meta);
      applySize();
      openScreen("config");
      return;
    }
    if (event.target.closest("#chapter-card")) {
      session.chapterCard = null;
      render();
      return;
    }
    if (event.target.closest("#cg-frame")) {
      if (session) session.cgMoment = null;
      render();
      return;
    }
    if (event.target.closest("#advance") && screen === "play") step();
  });

  root.addEventListener("input", (event) => {
    const vol = event.target.dataset.vol;
    if (!vol) return;
    meta.settings[vol] = Number(event.target.value);
    score.setVolumes(meta.settings);
    saveMeta(meta);
    const read = root.querySelector(vol === "bgm" ? "#bgm-read" : "#se-read");
    if (read) read.textContent = String(Math.round(meta.settings[vol] * 100));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Control") {
      fast = true;
      if (screen === "play" && overlay.hidden) step();
      return;
    }
    if (event.key === "Escape") {
      if (!overlay.hidden) closeOverlay();
      else if (screen === "play") openScreen("log");
      return;
    }
    if (event.key.toLowerCase() === "a" && screen === "play" && overlay.hidden && !event.ctrlKey && !event.metaKey) {
      autoOn = !autoOn;
      if (autoOn) skipOn = false;
      paintChrome();
      queueAuto();
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && screen === "play" && overlay.hidden) {
      event.preventDefault();
      step();
    }
  });
  window.addEventListener("keyup", (event) => {
    if (event.key === "Control") fast = false;
  });

  function pollPad() {
    const pads = navigator.getGamepads?.() || [];
    const pad = pads[0];
    if (pad && screen === "play") {
      const pressed = [!!pad.buttons[0]?.pressed, !!pad.buttons[1]?.pressed];
      if (pressed[0] && !padWas[0] && overlay.hidden) step();
      if (pressed[1] && !padWas[1]) {
        if (!overlay.hidden) closeOverlay();
        else openScreen("log");
      }
      padWas = pressed;
    }
    requestAnimationFrame(pollPad);
  }
  requestAnimationFrame(pollPad);

  applySize();
  paintTitle();
  render();
}
