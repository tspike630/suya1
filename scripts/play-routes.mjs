import { advance, choose, newSession, optionsFor } from "../src/engine.js";

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
  for (let guard = 0; guard < 500 && session.phase !== "ending"; guard += 1) {
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
console.log("routes ok: A, TRUE, B, C, E");
