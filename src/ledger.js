/** Choice ledger for 《黍琊：醒梦之间》.
 *  Numbers follow GDD chapters 5 and 6, the only authoritative config.
 *  Nine binary dissonance choices: 512 combinations.
 *  Auto cracks always add 12. All-ask = 78, all-avoid = 12.
 *  Points that can be refused are three +10 and six +6.
 *  Waking needs >= 60, so at most 18 points can be skipped:
 *  C(6,0)+C(6,1)+C(6,2)+C(6,3) + C(3,1)*C(6,0) + C(3,1)*C(6,1) = 63.
 */

export const WAKE_AT = 60;
export const HIDDEN_DISSONANCE = 75;
export const HIDDEN_LU = 50;
export const EPILOGUE_AT = 20;
export const ACADEMIC_SPLIT = 60;
export const AUTO_DISSONANCE = 12;

export const BOND_CAPS = {
  lu: 60,
  shen: 30,
  yu: 26,
};

export const CRACKS = [
  {
    id: "D1",
    scene: "高考出考场",
    a: "回头看前台那个女孩",
    b: "直接离开",
    d: 6,
    bond: { who: "lu", n: 10 },
  },
  {
    id: "D2",
    scene: "秦华校门匾额",
    a: "总觉得校名哪里不对，再看一眼",
    b: "拍照发朋友圈",
    d: 6,
  },
  {
    id: "D3",
    scene: "食堂菜谱",
    a: "问阿姨：今天是不是又是红烧肉",
    b: "换窗口",
    d: 10,
  },
  {
    id: "D4",
    scene: "郁明生日会",
    a: "追问：你生日到底是哪天",
    b: "打趣带过",
    d: 6,
    bond: { who: "yu", n: 6 },
  },
  {
    id: "D5",
    scene: "沈知夏学姐",
    a: "问：你右眼角是不是有颗痣",
    b: "归因于光线",
    d: 10,
    bond: { who: "shen", n: 10 },
  },
  {
    id: "D6",
    scene: "母亲的电话",
    a: "问：妈，你现在在做什么",
    b: "报喜不报忧",
    d: 6,
  },
  {
    id: "D7",
    scene: "301 房卡",
    a: "回前台找鹿眠问清楚",
    b: "换一间，别再想",
    d: 10,
    bond: { who: "lu", n: 10 },
  },
  {
    id: "D8",
    scene: "颁奖典礼",
    a: "会后找裴教授核对年份",
    b: "和大家一起鼓掌",
    d: 6,
  },
  {
    id: "D9",
    scene: "深夜实验室",
    a: "听鹿眠把话说完",
    b: "打断她，回去改论文",
    d: 6,
    bond: { who: "lu", n: 10 },
  },
];

export const ACADEMIC_CHOICES = [
  {
    id: "S1",
    scene: "空闲的下午",
    a: "泡图书馆",
    aN: 10,
    b: "去社团",
    bN: -10,
  },
  {
    id: "S2",
    scene: "裴教授的课题",
    a: "接下来",
    aN: 15,
    b: "缓一缓",
    bN: -5,
  },
  {
    id: "S3",
    scene: "实验夜",
    a: "通宵实验",
    aN: 10,
    b: "早睡",
    bN: 0,
  },
  {
    id: "S4",
    scene: "学术会议",
    a: "参加会议",
    aN: 10,
    b: "陪沈知夏",
    bN: -10,
    bondOnB: { who: "shen", n: 10 },
  },
  {
    id: "S5",
    scene: "一作署名",
    a: "坚持自己",
    aN: 10,
    b: "让给郁明",
    bN: 0,
    bondOnB: { who: "yu", n: 10 },
  },
  {
    id: "S6",
    scene: "毕业去向",
    a: "留校深造",
    aN: 10,
    b: "去创业",
    bN: -5,
  },
];

export const DAILY_COUNT = 4;

export const ENDING_COPY = {
  A: {
    code: "A",
    title: "早醒的雨",
    tone: "平淡释然",
    text: "接受成绩单，上普通一本。多年后回望那晚的床，雨还在下，人已经往前走了。",
  },
  TRUE: {
    code: "TRUE",
    title: "醒来之后",
    tone: "温暖",
    text: "复读一年，重考秦华。在眠夏酒店再次遇见鹿眠，学会与不完美的自己和解。",
  },
  B: {
    code: "B",
    title: "学术之巅",
    tone: "恐怖余韵",
    text: "颁奖台下的人群没有脸。留下不是失败，但「完美」在这里显出空洞。",
  },
  C: {
    code: "C",
    title: "完美人生",
    tone: "细思恐极",
    text: "结婚、生子、事业圆满。晚年翻开日记，上面写着：这不是我的人生。",
  },
  E: {
    code: "E",
    title: "我也在梦里",
    tone: "元叙事留白",
    text: "黍琊问：如果这也是梦呢。鹿眠笑：那我们一起醒。",
  },
};

const BOND_LABEL = {
  lu: "鹿眠",
  shen: "沈知夏",
  yu: "郁明",
};

function blankBonds() {
  return { lu: 0, shen: 0, yu: 0 };
}

function addBond(bonds, bond) {
  if (!bond) return;
  bonds[bond.who] += bond.n;
}

function clampBonds(bonds) {
  return {
    lu: Math.min(BOND_CAPS.lu, Math.max(0, bonds.lu)),
    shen: Math.min(BOND_CAPS.shen, Math.max(0, bonds.shen)),
    yu: Math.min(BOND_CAPS.yu, Math.max(0, bonds.yu)),
  };
}

export function defaultState() {
  return {
    ngPlus: false,
    chapter2: "again",
    cracks: CRACKS.map(() => true),
    dailies: ["lu", "shen", "yu", "lu"],
    academic: ACADEMIC_CHOICES.map(() => true),
    d10: true,
    chapter4: "wake",
    finaleHotel: true,
    hidden: false,
  };
}

export function preset(name) {
  const base = defaultState();
  if (name === "A") {
    return { ...base, chapter2: "accept", chapter4: "stay", hidden: false };
  }
  if (name === "TRUE") {
    return { ...base, ngPlus: false, hidden: false, chapter4: "wake" };
  }
  if (name === "edge") {
    const cracks = CRACKS.map(() => true);
    cracks[0] = false;
    cracks[1] = false;
    cracks[3] = false;
    return {
      ...base,
      cracks,
      d10: false,
      finaleHotel: false,
      academic: ACADEMIC_CHOICES.map(() => false),
      chapter4: "wake",
      hidden: false,
      ngPlus: false,
    };
  }
  if (name === "E") {
    return {
      ...base,
      ngPlus: true,
      cracks: CRACKS.map(() => true),
      dailies: ["lu", "lu", "lu", "lu"],
      d10: true,
      chapter4: "wake",
      finaleHotel: true,
      hidden: true,
    };
  }
  if (name === "B") {
    return {
      ...base,
      cracks: CRACKS.map(() => false),
      academic: ACADEMIC_CHOICES.map(() => true),
      chapter4: "stay",
      d10: false,
      finaleHotel: false,
      hidden: false,
    };
  }
  if (name === "C") {
    return {
      ...base,
      cracks: CRACKS.map(() => false),
      academic: ACADEMIC_CHOICES.map(() => false),
      dailies: ["lu", "shen", "yu", "lu"],
      chapter4: "stay",
      d10: false,
      finaleHotel: false,
      hidden: false,
    };
  }
  return base;
}

function epilogueOf(bonds) {
  const ranked = [
    ["鹿眠", bonds.lu],
    ["沈知夏", bonds.shen],
    ["郁明", bonds.yu],
  ].filter((entry) => entry[1] >= EPILOGUE_AT);
  if (ranked.length === 0) {
    return { kind: "default", names: [], value: 0 };
  }
  const top = Math.max(...ranked.map((entry) => entry[1]));
  const names = ranked.filter((entry) => entry[1] === top).map((entry) => entry[0]);
  return {
    kind: names.length === 1 ? "single" : "tie",
    names,
    value: top,
  };
}

export function evaluate(state) {
  const notes = [];
  if (state.chapter2 === "accept") {
    return {
      enteredDream: false,
      dissonance: 0,
      lu: 0,
      shen: 0,
      yu: 0,
      academic: 0,
      wakeAvailable: false,
      hiddenAvailable: false,
      resolvedChapter4: "none",
      ending: "A",
      epilogue: null,
      asked: 0,
      notes: ["第二章选了【认命，接受成绩单】。梦没有开始，结局停在 A。"],
    };
  }

  let dissonance = AUTO_DISSONANCE;
  const raw = blankBonds();
  let asked = 0;
  state.cracks.forEach((ask, index) => {
    if (!ask) return;
    const crack = CRACKS[index];
    dissonance += crack.d;
    asked += 1;
    addBond(raw, crack.bond);
  });

  const dailies = state.dailies.slice(0, DAILY_COUNT);
  dailies.forEach((who) => {
    if (who === "lu" || who === "shen" || who === "yu") raw[who] += 5;
  });

  let academic = 0;
  state.academic.forEach((takeA, index) => {
    const choice = ACADEMIC_CHOICES[index];
    if (takeA) {
      academic += choice.aN;
    } else {
      academic += choice.bN;
      addBond(raw, choice.bondOnB);
    }
  });

  if (state.d10) raw.lu += 10;

  dissonance = Math.max(0, Math.min(100, dissonance));
  academic = Math.max(0, Math.min(100, academic));

  const wakeAvailable = dissonance >= WAKE_AT;
  let resolvedChapter4 = state.chapter4 === "wake" ? "wake" : "stay";
  if (resolvedChapter4 === "wake" && !wakeAvailable) {
    resolvedChapter4 = "stay";
    notes.push(
      `违和感 ${dissonance}，还没到 ${WAKE_AT}。第四章不出现【醒来】，只能留下。`,
    );
  }

  if (resolvedChapter4 === "wake" && state.finaleHotel) raw.lu += 10;

  const bonds = clampBonds(raw);
  const hiddenAvailable =
    resolvedChapter4 === "wake" &&
    state.ngPlus &&
    dissonance >= HIDDEN_DISSONANCE &&
    bonds.lu >= HIDDEN_LU;

  let ending = "C";
  if (resolvedChapter4 === "stay") {
    ending = academic >= ACADEMIC_SPLIT ? "B" : "C";
  } else if (state.hidden && hiddenAvailable) {
    ending = "E";
  } else {
    ending = "TRUE";
    if (state.hidden && !hiddenAvailable) {
      const missing = [];
      if (!state.ngPlus) missing.push("二周目");
      if (dissonance < HIDDEN_DISSONANCE) {
        missing.push(`违和感还差 ${HIDDEN_DISSONANCE - dissonance}`);
      }
      if (bonds.lu < HIDDEN_LU) missing.push(`鹿眠还差 ${HIDDEN_LU - bonds.lu}`);
      notes.push(`隐藏选项还没打开：${missing.join("，")}。`);
    }
  }

  const epilogue = ending === "TRUE" ? epilogueOf(bonds) : null;

  if (ending === "B") {
    notes.push("学术值走到 60 以上，只有六项全部偏向学术这一条路（合计 65）。");
  }

  return {
    enteredDream: true,
    dissonance,
    lu: bonds.lu,
    shen: bonds.shen,
    yu: bonds.yu,
    academic,
    wakeAvailable,
    hiddenAvailable,
    resolvedChapter4,
    ending,
    epilogue,
    asked,
    notes,
  };
}

export function enumerateDissonance() {
  let wake = 0;
  let max = 0;
  let min = 100;
  for (let mask = 0; mask < 512; mask += 1) {
    const cracks = CRACKS.map((_, index) => (mask & (1 << index)) !== 0);
    const result = evaluate({
      ...defaultState(),
      cracks,
      dailies: ["lu", "lu", "lu", "lu"],
      academic: ACADEMIC_CHOICES.map(() => false),
      d10: false,
      finaleHotel: false,
      chapter4: "wake",
      ngPlus: false,
      hidden: false,
    });
    if (result.dissonance > max) max = result.dissonance;
    if (result.dissonance < min) min = result.dissonance;
    if (result.wakeAvailable) wake += 1;
  }
  return { total: 512, wake, max, min };
}

export function bondName(who) {
  return BOND_LABEL[who];
}
