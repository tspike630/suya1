import assert from "node:assert/strict";
import {
  ACADEMIC_CHOICES,
  enumerateDissonance,
  evaluate,
  preset,
} from "../src/ledger.js";

const census = enumerateDissonance();
assert.equal(census.total, 512);
assert.equal(census.max, 78, "all-ask dissonance");
assert.equal(census.min, 12, "all-avoid dissonance");
assert.equal(census.wake, 63, "combinations that open 醒来");

assert.equal(evaluate(preset("A")).ending, "A");
assert.equal(evaluate(preset("TRUE")).ending, "TRUE");
assert.equal(evaluate(preset("TRUE")).dissonance, 78);
assert.equal(evaluate(preset("edge")).ending, "TRUE");
assert.equal(evaluate(preset("edge")).dissonance, 60);
assert.equal(evaluate(preset("edge")).wakeAvailable, true);

const hidden = evaluate(preset("E"));
assert.equal(hidden.ending, "E");
assert.equal(hidden.hiddenAvailable, true);
assert.ok(hidden.lu >= 50);

assert.equal(evaluate(preset("B")).ending, "B");
assert.equal(evaluate(preset("B")).academic, 65);
assert.equal(evaluate(preset("C")).ending, "C");
assert.equal(evaluate(preset("C")).academic, 0);

const almostAcademic = preset("B");
almostAcademic.academic = ACADEMIC_CHOICES.map(() => true);
almostAcademic.academic[2] = false;
const dropped = evaluate(almostAcademic);
assert.equal(dropped.academic, 55);
assert.equal(dropped.ending, "C");

const shenRoute = preset("edge");
shenRoute.cracks = [
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
];
shenRoute.dailies = ["shen", "shen", "shen", "shen"];
shenRoute.academic = [true, true, true, true, true, true];
shenRoute.d10 = false;
shenRoute.finaleHotel = false;
shenRoute.chapter4 = "wake";
const shen = evaluate(shenRoute);
assert.equal(shen.ending, "TRUE");
assert.equal(shen.dissonance, 60);
assert.deepEqual(shen.epilogue.names, ["沈知夏"]);

const yuRoute = preset("TRUE");
yuRoute.cracks = [false, false, true, true, true, true, true, true, false];
yuRoute.dailies = ["yu", "yu", "yu", "yu"];
yuRoute.academic = [true, true, true, true, false, true];
yuRoute.d10 = false;
yuRoute.finaleHotel = false;
const yu = evaluate(yuRoute);
assert.equal(yu.ending, "TRUE");
assert.equal(yu.dissonance, 60);
assert.deepEqual(yu.epilogue.names, ["郁明"]);

const quiet = preset("TRUE");
quiet.cracks = [false, true, true, false, true, true, true, true, false];
quiet.dailies = ["lu", "shen", "yu", "yu"];
quiet.academic = [true, true, true, true, true, true];
quiet.d10 = false;
quiet.finaleHotel = false;
const def = evaluate(quiet);
assert.equal(def.ending, "TRUE");
assert.equal(def.lu < 20 && def.shen < 20 && def.yu < 20, true);
assert.equal(def.epilogue.kind, "default");

const locked = preset("C");
locked.chapter4 = "wake";
const forced = evaluate(locked);
assert.equal(forced.wakeAvailable, false);
assert.equal(forced.ending, "C");
assert.equal(forced.resolvedChapter4, "stay");

console.log(
  `ledger ok: ${census.wake}/${census.total} paths open 醒来, range ${census.min}–${census.max}`,
);
