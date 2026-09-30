import { ENDING_COPY } from "./ledger.js";
import { advance, choose, getLines, lineKey, newSession, optionsFor, snapshot } from "./engine.js";
import { GALLERY, NODES } from "./script.js";

const META_KEY = "suya-meta-v1";
const SPEEDS = [0, 18, 42, 80];

const PLACE = {
  classroom: "教室",
  corridor: "走廊",
  dorm: "考点宿舍",
  exam: "考场",
  home: "家里",
  rain: "雨天",
  white: "白光",
  hotel: "眠夏酒店",
  gate: "秦华校门",
  library: "图书馆",
  cafeteria: "食堂",
  lab: "实验室",
  award: "颁奖台",
  room: "宿舍",
  roof: "天台",
};

const ENDING_NOTE = {
  A: "你接受了成绩单。",
  TRUE: "你醒了，并且把明天重考了一次。",
  B: "你留在颁奖台上。台下没有脸。",
  C: "日记的最后一页写着：这不是我的人生。",
  E: "如果这也是梦，就一起醒。",
};

function loadMeta() {
  try {
    const parsed = JSON.parse(localStorage.getItem(META_KEY) || "");
    if (parsed && typeof parsed === "object") {
      parsed.read ??= {};
      parsed.endings ??= [];
      parsed.gallery ??= [];
      parsed.slots ??= Array(8).fill(null);
      parsed.settings ??= { speed: 2, auto: 1 };
      parsed.chapters ??= [];
      return parsed;
    }
  } catch {
    /* fresh profile */
  }
  return {
    read: {},
    endings: [],
    gallery: [],
    chapters: [],
    slots: Array(8).fill(null),
    settings: { speed: 2, auto: 1 },
    autosave: null,
  };
}

function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function stamp(session) {
  const line = getLines(session)[session.line];
  return {
    session: snapshot(session),
    at: new Date().toISOString(),
    place: PLACE[NODES[session.nodeId]?.bg] || "",
    text: line?.text || NODES[session.nodeId]?.title || "存档",
  };
}

export function mountGame(root) {
  const meta = loadMeta();
  root.innerHTML = `
    <div class="vn" id="vn">
      <div class="bg" id="bg"></div>
      <div class="sprite" id="sprite" hidden></div>
      <p class="place" id="place"></p>
      <p class="meter" id="meter" hidden></p>
      <p class="toast" id="toast" hidden></p>
      <button class="chapter-card" id="chapter-card" type="button" hidden></button>
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
        <button type="button" data-open="log">记录</button>
        <button type="button" data-act="auto">自动</button>
        <button type="button" data-act="skip">快进</button>
        <button type="button" data-open="flow">流程</button>
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
  const toast = root.querySelector("#toast");
  const card = root.querySelector("#chapter-card");
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
  let shown = 0;
  let full = "";
  let typing = null;
  let autoTimer = null;
  let autoOn = false;
  let skipOn = false;
  let fast = false;
  let hideBox = false;

  function cps() {
    return SPEEDS[meta.settings.speed] ?? 42;
  }

  function stopTimers() {
    clearInterval(typing);
    clearTimeout(autoTimer);
    typing = null;
    autoTimer = null;
  }

  function rememberRead() {
    if (!session || session.phase !== "text") return;
    meta.read[lineKey(session)] = true;
  }

  function lineDone() {
    return shown >= full.length;
  }

  function finishLine() {
    shown = full.length;
    clearInterval(typing);
    typing = null;
    textEl.textContent = full;
    caret.hidden = session?.phase !== "text";
    rememberRead();
    queueAuto();
  }

  function queueAuto() {
    clearTimeout(autoTimer);
    if (!autoOn || !session || screen !== "play" || session.chapterCard) return;
    if (session.phase !== "text" || !lineDone()) return;
    const wait = [500, 900, 1400][meta.settings.auto] ?? 900;
    autoTimer = setTimeout(() => step(), wait + full.length * 18);
  }

  function typeLine(line) {
    stopTimers();
    full = line?.text || "";
    const already = !!meta.read[lineKey(session)];
    if (cps() === 0 || already || fast) {
      shown = full.length;
      textEl.textContent = full;
      caret.hidden = false;
      rememberRead();
      if (fast || (skipOn && already)) autoTimer = setTimeout(() => step(), 16);
      else queueAuto();
      return;
    }
    shown = 0;
    textEl.textContent = "";
    caret.hidden = true;
    const interval = Math.max(12, Math.round(1000 / cps()));
    typing = setInterval(() => {
      shown += 1;
      textEl.textContent = full.slice(0, shown);
      if (lineDone()) finishLine();
    }, interval);
  }

  function showToast(message) {
    toast.hidden = !message;
    toast.textContent = message || "";
    if (message) {
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => {
        toast.hidden = true;
      }, 1600);
    }
  }

  function unlockView() {
    const node = NODES[session.nodeId];
    if (node?.bg && !meta.gallery.includes(node.bg)) meta.gallery.push(node.bg);
    if (node?.title && !meta.chapters.includes(node.title)) meta.chapters.push(node.title);
  }

  function autosave() {
    if (!session || session.phase === "ending") return;
    meta.autosave = stamp(session);
    saveMeta(meta);
  }

  function paintChrome() {
    const node = session ? NODES[session.nodeId] : null;
    const line = session && session.phase === "text" ? getLines(session)[session.line] : null;
    vn.dataset.layer = node?.layer || "real";
    vn.dataset.phase = session?.phase || screen;
    bg.className = `bg bg-${node?.bg || "dorm"}`;
    place.hidden = screen !== "play";
    place.textContent = PLACE[node?.bg] || "";
    const who = line?.who || "";
    sprite.hidden = !who || screen !== "play" || session.chapterCard || session.phase === "ending";
    sprite.dataset.who = who;
    sprite.innerHTML = who ? `<b>${who.slice(0, 1)}</b><span>${who}</span>` : "";
    meter.hidden = !(session?.meter && screen === "play");
    meter.textContent = session?.meter ? `违和 ${session.dissonance}` : "";
    dock.hidden = screen !== "play" || session?.phase === "ending";
    dock.querySelector("[data-act='auto']").dataset.on = autoOn ? "1" : "0";
    dock.querySelector("[data-act='skip']").dataset.on = skipOn ? "1" : "0";
    if (session?.glitch) vn.dataset.glitch = "1";
    else delete vn.dataset.glitch;
  }

  function paintLine() {
    const node = NODES[session.nodeId];
    const limen = node.layer === "limen";
    advanceHit.hidden = !!session.chapterCard || session.phase === "ending";
    choicesEl.hidden = session.phase !== "choice" || !!session.chapterCard;
    if (session.phase !== "choice") choicesEl.innerHTML = "";
    endingEl.hidden = session.phase !== "ending";
    card.hidden = !session.chapterCard;
    card.textContent = session.chapterCard || "";
    advanceHit.dataset.limen = limen ? "1" : "0";
    advanceHit.classList.toggle("is-hidden", hideBox && !limen && session.phase === "text");
    if (session.chapterCard) return;

    if (session.phase === "ending") {
      const ending = ENDING_COPY[session.endingId];
      if (!meta.endings.includes(session.endingId)) meta.endings.push(session.endingId);
      saveMeta(meta);
      endingEl.innerHTML = `
        <p class="kicker">${ending.code}</p>
        <h2>${ending.title}</h2>
        <p class="tone">${ending.tone}</p>
        <p>${ENDING_NOTE[session.endingId] || ending.text}</p>
        <button type="button" data-act="title">回到标题</button>
      `;
      return;
    }

    if (session.phase === "choice") {
      const options = optionsFor(session);
      const lines = getLines(session);
      const line = [...lines].reverse().find((item) => item.text) || null;
      choicesEl.innerHTML = options
        .map((option) => `<button type="button" data-choice="${option.id}">${option.label}</button>`)
        .join("");
      nameEl.hidden = !line?.who;
      nameEl.textContent = line?.who || "";
      textEl.textContent = line?.text || "";
      caret.hidden = true;
      return;
    }

    const line = getLines(session)[session.line];
    nameEl.hidden = !line?.who;
    nameEl.textContent = line?.who || "";
    nameEl.dataset.who = line?.who || "";
    typeLine(line);
  }

  function paintTitle() {
    titleEl.hidden = screen !== "title";
    if (screen !== "title") return;
    const endings = meta.endings.length ? `<p class="cleared">已抵达 ${meta.endings.join(" · ")}</p>` : "";
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
        <button type="button" data-act="continue" ${meta.autosave ? "" : "disabled"}>继续</button>
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
      sprite.hidden = true;
      meter.hidden = true;
      place.hidden = true;
      bg.className = "bg bg-dorm";
      vn.dataset.layer = "real";
      paintTitle();
      return;
    }
    titleEl.hidden = true;
    unlockView();
    paintChrome();
    paintLine();
    if (session.sting) {
      showToast("心里那根刺动了一下。");
      session.sting = false;
    }
    autosave();
  }

  function begin(next) {
    stopTimers();
    autoOn = false;
    skipOn = false;
    session = next;
    screen = "play";
    overlay.hidden = true;
    render();
  }

  function step() {
    if (!session || screen !== "play") return;
    if (session.chapterCard) {
      session.chapterCard = null;
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

  function slotList(kind) {
    const slots = meta.slots
      .map((slot, index) => {
        const label = slot ? `${slot.place}　${slot.text.slice(0, 18)}` : "空";
        return `<button type="button" data-slot="${index}" data-kind="${kind}"><b>${index + 1}</b><span>${label}</span></button>`;
      })
      .join("");
    return `<section class="panel"><header><h2>${kind === "save" ? "存档" : "读档"}</h2><button type="button" data-act="close">关闭</button></header>${slots}</section>`;
  }

  function logView() {
    const rows = (session?.log || [])
      .slice(-80)
      .map((entry) => `<p>${entry.who ? `<b>${entry.who}</b>` : ""}${entry.text}</p>`)
      .join("");
    return `<section class="panel log"><header><h2>记录</h2><button type="button" data-act="close">关闭</button></header><div>${rows || "<p>还没有读过的句子。</p>"}</div></section>`;
  }

  function flowView() {
    const chapters = [
      "序章 · 一模之后",
      "第一章 · 考点之夜",
      "第二章 · 白光的选项",
      "第三章 · 重来之日",
      "第四章 · 梦的裂缝",
      "终章 · 醒来之后",
    ]
      .map((title) => `<li data-on="${meta.chapters.includes(title) ? "1" : "0"}">${title}</li>`)
      .join("");
    const endings = ["TRUE", "A", "B", "C", "E"]
      .map((id) => {
        const ending = ENDING_COPY[id];
        const on = meta.endings.includes(id);
        return `<li data-on="${on ? "1" : "0"}"><b>${on ? ending.code : "？"}</b>${on ? ending.title : "尚未抵达"}</li>`;
      })
      .join("");
    return `<section class="panel"><header><h2>流程</h2><button type="button" data-act="close">关闭</button></header><ol class="flow-list">${chapters}</ol><ol class="end-list">${endings}</ol></section>`;
  }

  function galleryView() {
    const cells = GALLERY.map(([id, label]) => {
      const on = meta.gallery.includes(id);
      return `<li data-on="${on ? "1" : "0"}" class="bg-${on ? id : "locked"}"><span>${on ? label : "？"}</span></li>`;
    }).join("");
    return `<section class="panel"><header><h2>回想</h2><button type="button" data-act="close">关闭</button></header><ul class="gallery">${cells}</ul></section>`;
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
    return `<section class="panel"><header><h2>设置</h2><button type="button" data-act="close">关闭</button></header><p>文字速度</p><div class="seg">${speed}</div><p>自动等待</p><div class="seg">${auto}</div></section>`;
  }

  function closeOverlay() {
    overlay.hidden = true;
    overlay.innerHTML = "";
    if (session && screen === "play") render();
    else paintTitle();
  }

  root.addEventListener("click", (event) => {
    const act = event.target.closest("[data-act]");
    const open = event.target.closest("[data-open]");
    const choice = event.target.closest("[data-choice]");
    const slot = event.target.closest("[data-slot]");
    if (act?.dataset.act === "new") return begin(newSession(false));
    if (act?.dataset.act === "ng") return begin(newSession(true));
    if (act?.dataset.act === "continue" && meta.autosave) return begin(meta.autosave.session);
    if (act?.dataset.act === "title") {
      screen = "title";
      session = null;
      stopTimers();
      overlay.hidden = true;
      render();
      return;
    }
    if (act?.dataset.act === "close") return closeOverlay();
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
    if (open) return openScreen(open.dataset.open);
    if (slot) {
      const index = Number(slot.dataset.slot);
      if (slot.dataset.kind === "save" && session) {
        meta.slots[index] = stamp(session);
        saveMeta(meta);
        openScreen("save");
      }
      if (slot.dataset.kind === "load" && meta.slots[index]) begin(meta.slots[index].session);
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
    if (event.target.closest("#chapter-card")) {
      session.chapterCard = null;
      render();
      return;
    }
    if (event.target.closest("#advance") && screen === "play") step();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Control") {
      fast = true;
      if (screen === "play") step();
      return;
    }
    if (event.key === "Escape") {
      if (!overlay.hidden) closeOverlay();
      else if (screen === "play") openScreen("log");
      return;
    }
    if (event.key.toLowerCase() === "a" && screen === "play" && !event.ctrlKey) {
      autoOn = !autoOn;
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

  paintTitle();
  render();
}
