import { NODES } from "./script.js";
import { BOND_CAPS } from "./ledger.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function applyFx(state, fx) {
  if (!fx) return;
  if (fx.d) state.dissonance = clamp(state.dissonance + fx.d, 0, 100);
  if (fx.lu) state.lu = clamp(state.lu + fx.lu, 0, BOND_CAPS.lu);
  if (fx.shen) state.shen = clamp(state.shen + fx.shen, 0, BOND_CAPS.shen);
  if (fx.yu) state.yu = clamp(state.yu + fx.yu, 0, BOND_CAPS.yu);
  if (typeof fx.academic === "number" && fx.academic !== 0) {
    state.academic = clamp(state.academic + fx.academic, 0, 100);
  }
}

export function getLines(session) {
  const node = NODES[session.nodeId];
  const base = typeof node.lines === "function" ? node.lines(session) : node.lines || [];
  const lines = [...base];
  if (session.showNg && node.ng) lines.unshift(node.ng);
  if (session.prefix?.length) lines.unshift(...session.prefix);
  return lines;
}

export function optionsFor(session) {
  const node = NODES[session.nodeId];
  const raw = typeof node.options === "function" ? node.options(session) : node.options || [];
  return raw.filter((option) => !option.when || option.when(session));
}

function resolveNext(node, session) {
  if (!node.next) return null;
  return typeof node.next === "function" ? node.next(session) : node.next;
}

export function goto(session, id, keepPrefix = false) {
  const node = NODES[id];
  if (!node) throw new Error(`missing scene: ${id}`);
  if (!keepPrefix) session.prefix = null;
  session.nodeId = id;
  session.line = 0;
  session.glitch = false;
  if (node.meter) session.meter = true;
  if (node.onEnter && !session.flags[`enter:${id}`]) {
    session.flags[`enter:${id}`] = true;
    applyFx(session, node.onEnter);
    if (node.onEnter.d) session.sting = true;
  }
  if (node.title && !session.seenTitles.includes(node.title)) {
    session.seenTitles.push(node.title);
    session.chapterCard = node.title;
  }
  session.showNg = !!(session.ngPlus && node.ng && !session.flags[`ngshown:${id}`]);
  if (session.showNg) session.flags[`ngshown:${id}`] = true;
  const lines = getLines(session);
  const options = optionsFor(session);
  if (lines.length === 0) {
    if (options.length) session.phase = "choice";
    else if (node.ending) {
      session.phase = "ending";
      session.endingId = node.ending;
    } else {
      const next = resolveNext(node, session);
      if (!next) throw new Error(`scene ${id} has nowhere to go`);
      return goto(session, next, false);
    }
    return session;
  }
  session.phase = "text";
  return session;
}

export function newSession(ngPlus = false) {
  const session = {
    ngPlus: !!ngPlus,
    nodeId: "pro_rank",
    line: 0,
    phase: "text",
    dissonance: 0,
    lu: 0,
    shen: 0,
    yu: 0,
    academic: 0,
    meter: false,
    flags: {},
    log: [],
    prefix: null,
    seenTitles: [],
    showNg: false,
    chapterCard: null,
    sting: false,
    glitch: false,
    endingId: null,
  };
  return goto(session, "pro_rank");
}

function currentLine(session) {
  return getLines(session)[session.line] || null;
}

function remember(session) {
  const line = currentLine(session);
  if (!line) return;
  session.log.push({
    who: line.who || "",
    text: line.text,
    nodeId: session.nodeId,
    line: session.line,
  });
  if (session.log.length > 240) session.log.shift();
}

export function advance(session) {
  if (session.phase === "ending" || session.phase === "choice") return session;
  remember(session);
  const lines = getLines(session);
  if (session.line < lines.length - 1) {
    session.line += 1;
    session.glitch = lines[session.line]?.kind === "glitch";
    return session;
  }
  const options = optionsFor(session);
  if (options.length) {
    session.phase = "choice";
    return session;
  }
  const node = NODES[session.nodeId];
  if (node.ending) {
    session.phase = "ending";
    session.endingId = node.ending;
    return session;
  }
  const next = resolveNext(node, session);
  if (!next) throw new Error(`scene ${session.nodeId} ended without a next`);
  return goto(session, next, false);
}

export function choose(session, index) {
  const options = optionsFor(session);
  const option = options[index];
  if (!option) throw new Error(`missing option ${index} at ${session.nodeId}`);
  applyFx(session, option.fx);
  if (option.fx?.d) session.glitch = option.fx.d >= 10;
  if (option.set) Object.assign(session.flags, option.set);
  const prefix = [];
  if (option.say) prefix.push(option.say);
  if (option.thought) {
    prefix.push(
      typeof option.thought === "string"
        ? { text: option.thought, kind: "thought" }
        : option.thought,
    );
  }
  session.prefix = prefix.length ? prefix : null;
  const next = typeof option.next === "function" ? option.next(session) : option.next;
  return goto(session, next, true);
}

export function lineKey(session) {
  return `${session.nodeId}:${session.line}`;
}

export function snapshot(session) {
  return JSON.parse(JSON.stringify(session));
}
