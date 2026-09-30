import {
  ACADEMIC_CHOICES,
  AUTO_DISSONANCE,
  BOND_CAPS,
  CRACKS,
  DAILY_COUNT,
  ENDING_COPY,
  HIDDEN_DISSONANCE,
  HIDDEN_LU,
  WAKE_AT,
  bondName,
  defaultState,
  evaluate,
  preset,
} from "./ledger.js";
import { esc } from "./ui.js";

function pair(name, legend, options, current) {
  const labels = options
    .map((option) => {
      const checked = option.value === current ? "checked" : "";
      return `<label>
        <input type="radio" name="${name}" value="${esc(option.value)}" ${checked} />
        <span>${esc(option.label)}</span>
        ${option.note ? `<small>${esc(option.note)}</small>` : ""}
      </label>`;
    })
    .join("");
  return `<fieldset class="pair">
    <legend>${esc(legend)}</legend>
    ${labels}
  </fieldset>`;
}

function formHtml(state) {
  const cracks = CRACKS.map((crack, index) => {
    const bond = crack.bond
      ? `${bondName(crack.bond.who)} +${crack.bond.n}`
      : "";
    return pair(
      `crack-${index}`,
      `${crack.id} · ${crack.scene}`,
      [
        {
          value: "ask",
          label: crack.a,
          note: `追问 · 违和 +${crack.d}${bond ? ` · ${bond}` : ""}`,
        },
        { value: "skip", label: crack.b, note: "享受眼前 · 违和不加" },
      ],
      state.cracks[index] ? "ask" : "skip",
    );
  }).join("");

  const dailies = Array.from({ length: DAILY_COUNT }, (_, index) =>
    pair(
      `daily-${index}`,
      `日常 ${index + 1}`,
      [
        { value: "lu", label: "找鹿眠", note: "+5" },
        { value: "shen", label: "找沈知夏", note: "+5" },
        { value: "yu", label: "找郁明", note: "+5" },
      ],
      state.dailies[index],
    ),
  ).join("");

  const academic = ACADEMIC_CHOICES.map((choice, index) =>
    pair(
      `acad-${index}`,
      `${choice.id} · ${choice.scene}`,
      [
        { value: "a", label: choice.a, note: `学术 ${choice.aN >= 0 ? "+" : ""}${choice.aN}` },
        {
          value: "b",
          label: choice.b,
          note: `学术 ${choice.bN >= 0 ? "+" : ""}${choice.bN}${
            choice.bondOnB ? ` · ${bondName(choice.bondOnB.who)} +${choice.bondOnB.n}` : ""
          }`,
        },
      ],
      state.academic[index] ? "a" : "b",
    ),
  ).join("");

  return `<form id="ledger-form">
    <div class="preset-row">
      <button type="button" data-preset="TRUE">醒来</button>
      <button type="button" data-preset="edge">刚好 60</button>
      <button type="button" data-preset="E">隐藏 E</button>
      <button type="button" data-preset="B">学术之巅</button>
      <button type="button" data-preset="C">完美人生</button>
      <button type="button" data-preset="A">早醒</button>
    </div>

    <section class="ledger-block">
      <h3>进梦之前</h3>
      <label class="check"><input type="checkbox" name="ngPlus" ${state.ngPlus ? "checked" : ""} /> 这是二周目</label>
      ${pair(
        "chapter2",
        "第二章 · 白光",
        [
          { value: "again", label: "再来一次，开启新的人生", note: "进入梦境" },
          { value: "accept", label: "认命，接受成绩单", note: "结局 A" },
        ],
        state.chapter2,
      )}
    </section>

    <div class="dream-only">
      <section class="ledger-block">
        <h3>第三章 · 九处裂缝</h3>
        <p class="fine">选项 A 是追问，选项 B 是把刺按下去。三处自动裂缝不经选择，合计 +${AUTO_DISSONANCE}：日历、身份、没有 301 的八楼。</p>
        ${cracks}
      </section>
      <section class="ledger-block">
        <h3>四段日常</h3>
        <p class="fine">每段只能结算一次，+5 给一个人。</p>
        ${dailies}
      </section>
      <section class="ledger-block">
        <h3>学术线</h3>
        <p class="fine">只在梦里有效。六项全部偏向学术是 65，也是唯一能到 60 的走法。少任何一项，留下之后都会掉进结局 C。</p>
        ${academic}
      </section>
      <section class="ledger-block">
        <h3>第四章与终章</h3>
        ${pair(
          "d10",
          "D10 · 鹿眠递来的房卡",
          [
            { value: "take", label: "接过", note: "鹿眠 +10" },
            { value: "push", label: "推开", note: "不加" },
          ],
          state.d10 ? "take" : "push",
        )}
        ${pair(
          "chapter4",
          "最终抉择",
          [
            { value: "wake", label: "醒来", note: `需要违和 ≥ ${WAKE_AT}` },
            { value: "stay", label: "留在这里", note: "按学术值去 B 或 C" },
          ],
          state.chapter4,
        )}
        ${pair(
          "finaleHotel",
          "终章 · 住在哪里",
          [
            { value: "hotel", label: "去眠夏酒店住一晚", note: "鹿眠 +10，并重逢" },
            { value: "home", label: "住家里", note: "母亲线，不加鹿眠" },
          ],
          state.finaleHotel ? "hotel" : "home",
        )}
        <label class="check"><input type="checkbox" name="hidden" ${state.hidden ? "checked" : ""} /> 终章选择【我们是不是见过】</label>
        <p class="fine">这一句要二周目、违和 ≥ ${HIDDEN_DISSONANCE}、鹿眠 ≥ ${HIDDEN_LU}，而且人已经醒来。</p>
      </section>
    </div>
  </form>`;
}

function readForm(form) {
  const base = defaultState();
  base.ngPlus = form.elements.ngPlus.checked;
  base.hidden = form.elements.hidden.checked;
  base.chapter2 = form.elements.chapter2.value;
  base.cracks = CRACKS.map((_, index) => form.elements[`crack-${index}`].value === "ask");
  base.dailies = Array.from(
    { length: DAILY_COUNT },
    (_, index) => form.elements[`daily-${index}`].value,
  );
  base.academic = ACADEMIC_CHOICES.map(
    (_, index) => form.elements[`acad-${index}`].value === "a",
  );
  base.d10 = form.elements.d10.value === "take";
  base.chapter4 = form.elements.chapter4.value;
  base.finaleHotel = form.elements.finaleHotel.value === "hotel";
  return base;
}

function writeForm(form, state) {
  form.elements.ngPlus.checked = state.ngPlus;
  form.elements.hidden.checked = state.hidden;
  form.elements.chapter2.value = state.chapter2;
  state.cracks.forEach((ask, index) => {
    form.elements[`crack-${index}`].value = ask ? "ask" : "skip";
  });
  state.dailies.forEach((who, index) => {
    form.elements[`daily-${index}`].value = who;
  });
  state.academic.forEach((takeA, index) => {
    form.elements[`acad-${index}`].value = takeA ? "a" : "b";
  });
  form.elements.d10.value = state.d10 ? "take" : "push";
  form.elements.chapter4.value = state.chapter4;
  form.elements.finaleHotel.value = state.finaleHotel ? "hotel" : "home";
}

function bar(value, max, marks) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  const ticks = marks
    .map((mark) => `<i style="left:${(mark / max) * 100}%"></i>`)
    .join("");
  return `<div class="bar"><span style="width:${width}%"></span>${ticks}</div>`;
}

function resultHtml(result, state) {
  const ending = ENDING_COPY[result.ending];
  const epilogue = result.epilogue
    ? result.epilogue.kind === "default"
      ? "三条羁绊都低于 20，终章走默认后日谈。"
      : result.epilogue.kind === "tie"
        ? `${result.epilogue.names.join("、")}并列 ${result.epilogue.value}。文档没有写并列时先给谁。`
        : `后日谈偏向${result.epilogue.names[0]}（${result.epilogue.value}）。`
    : "";
  const intent =
    state.chapter4 === "wake" && result.resolvedChapter4 === "stay"
      ? "你选了醒来，可门还锁着。"
      : "";
  const notes = [intent, ...result.notes].filter(Boolean);

  return `<p class="kicker">这一条路</p>
    <p class="ending-code">${esc(ending.code)}</p>
    <h3>${esc(ending.title)}</h3>
    <p class="tone">${esc(ending.tone)}</p>
    <p>${esc(ending.text)}</p>
    <div class="stat">
      <div class="stat-top"><span>违和感</span><b>${result.dissonance}</b></div>
      ${bar(result.dissonance, 100, [WAKE_AT, HIDDEN_DISSONANCE])}
      <p class="fine">60 打开醒来，75 才够到隐藏结局。上限 78，下限 12。</p>
    </div>
    <div class="stat">
      <div class="stat-top"><span>鹿眠</span><b>${result.lu}</b><em>上限 ${BOND_CAPS.lu}</em></div>
      ${bar(result.lu, BOND_CAPS.lu, [HIDDEN_LU])}
    </div>
    <div class="stat">
      <div class="stat-top"><span>沈知夏</span><b>${result.shen}</b><em>上限 ${BOND_CAPS.shen}</em></div>
      ${bar(result.shen, BOND_CAPS.shen, [20])}
    </div>
    <div class="stat">
      <div class="stat-top"><span>郁明</span><b>${result.yu}</b><em>上限 ${BOND_CAPS.yu}</em></div>
      ${bar(result.yu, BOND_CAPS.yu, [20])}
    </div>
    <div class="stat">
      <div class="stat-top"><span>学术值</span><b>${result.academic}</b></div>
      ${bar(result.academic, 100, [60])}
      <p class="fine">留下之后，60 去结局 B，不到就去 C。</p>
    </div>
    ${epilogue ? `<p class="epilogue">${esc(epilogue)}</p>` : ""}
    ${notes.length ? `<ul class="notes">${notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>` : ""}`;
}

export function mountLedger(root, presetName) {
  const known = ["A", "TRUE", "edge", "E", "B", "C"];
  let state = known.includes(presetName) ? preset(presetName) : preset("TRUE");
  root.innerHTML = `<div class="ledger-layout">${formHtml(state)}<aside class="ledger-result"></aside></div>`;
  const form = root.querySelector("#ledger-form");
  const aside = root.querySelector(".ledger-result");

  function paint() {
    const result = evaluate(state);
    form.dataset.asleep = state.chapter2 === "accept" ? "1" : "0";
    aside.innerHTML = resultHtml(result, state);
    aside.dataset.ending = result.ending;
  }

  form.addEventListener("change", () => {
    state = readForm(form);
    paint();
  });
  form.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset]");
    if (!button) return;
    state = preset(button.dataset.preset);
    writeForm(form, state);
    paint();
  });
  paint();
}
