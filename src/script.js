import {
  ACADEMIC_SPLIT,
  EPILOGUE_AT,
  HIDDEN_DISSONANCE,
  HIDDEN_LU,
  WAKE_AT,
} from "./ledger.js";

const sting = { text: "心里那根刺动了一下。", kind: "thought" };

export function epilogueId(state) {
  const rows = [
    ["epi_lu", state.lu],
    ["epi_shen", state.shen],
    ["epi_yu", state.yu],
  ].filter(([, value]) => value >= EPILOGUE_AT);
  if (rows.length === 0) return "epi_default";
  const top = Math.max(...rows.map(([, value]) => value));
  const best = rows.filter(([, value]) => value === top);
  if (best.length > 1) return "epi_tie";
  return best[0][0];
}

export function hiddenReady(state) {
  return state.ngPlus && state.dissonance >= HIDDEN_DISSONANCE && state.lu >= HIDDEN_LU;
}

export const NODES = {
  ng_gate: {
    title: "序章 · 一模之后",
    bg: "schoolgate",
    layer: "real",
    bgm: "june",
    who: "鹿眠",
    face: "distant",
    lines: [{ text: "校门口掠过一个穿白衬衫的人。我没看清她的脸。", kind: "thought" }],
    next: "pro_rank",
  },
  pro_rank: {
    title: "序章 · 一模之后",
    bg: "classroom",
    layer: "real",
    bgm: "june",
    cg: "cg_rank",
    fragment: "second",
    who: "郁明",
    face: "bright",
    lines: [
      { text: "一模成绩贴在一楼。全市第二。第一名是郁明，差我三分。" },
      { text: "三分不多。我站在榜前面，把那三分看成一条缝。" },
    ],
    options: [
      { id: "yu", label: "去找郁明", next: "pro_yu" },
      { id: "leave", label: "先离开榜单", next: "pro_leave" },
    ],
  },
  pro_yu: {
    bg: "classroom",
    layer: "real",
    bgm: "june",
    who: "郁明",
    face: "bright",
    lines: [
      { who: "郁明", face: "bright", voice: true, text: "第二也很好。秦华的线，我们都够得到。" },
      { text: "他笑起来没有刺。我却觉得那三分长在自己身上。" },
    ],
    next: "pro_shen",
  },
  pro_leave: {
    bg: "corridor",
    layer: "real",
    bgm: "june",
    lines: [{ text: "我把榜单留在身后。走廊里有人喊我，我没应。" }],
    next: "pro_shen",
  },
  pro_shen: {
    bg: "classroom",
    layer: "real",
    bgm: "june",
    who: "沈知夏",
    face: "shy",
    lines: [
      { text: "沈知夏把一张折好的纸放在我桌上。" },
      { text: "右眼角那颗痣，我看了三年。" },
    ],
    options: [
      { id: "open", label: "现在拆开", next: "pro_open" },
      { id: "pocket", label: "放进口袋", next: "pro_pocket" },
    ],
  },
  pro_open: {
    bg: "classroom",
    layer: "real",
    bgm: "june",
    who: "沈知夏",
    face: "quiet",
    lines: [
      { text: "纸上只有一句：别只看着名次。" },
      { who: "沈知夏", face: "shy", voice: true, text: "你要是想假装没看见，也行。" },
    ],
    next: "pro_pei",
  },
  pro_pocket: {
    bg: "classroom",
    layer: "real",
    bgm: "june",
    who: "沈知夏",
    face: "hurt",
    lines: [{ text: "我把纸按进口袋。她的目光在我肩上停了一下，就移开了。" }],
    next: "pro_pei",
  },
  pro_pei: {
    bg: "corridor",
    layer: "real",
    bgm: "june",
    who: "裴望",
    face: "stern",
    lines: [{ who: "裴望", face: "stern", voice: true, text: "学校可以订酒店。考点旁边那家，眠夏。你那个失眠，我知道。" }],
    options: [
      { id: "pride", label: "不想被单独对待", next: "pro_pride" },
      { id: "money", label: "家里不该花这笔钱", next: "pro_money" },
    ],
  },
  pro_pride: {
    bg: "corridor",
    layer: "real",
    bgm: "june",
    who: "裴望",
    face: "stern",
    lines: [
      { text: "我说不用。被特殊照顾，我会更睡不着。" },
      { who: "裴望", face: "soft", text: "随你。考场见。" },
    ],
    next: "ch1_dorm",
  },
  pro_money: {
    bg: "corridor",
    layer: "real",
    bgm: "june",
    who: "裴望",
    face: "stern",
    lines: [
      { text: "我说家里的钱不该花在一张床上。" },
      { who: "裴望", face: "soft", text: "嘴硬。考场见。" },
    ],
    next: "ch1_dorm",
  },
  ch1_dorm: {
    title: "第一章 · 考点之夜",
    bg: "dorm",
    layer: "real",
    bgm: "bed",
    cg: "cg_bed",
    fragment: "bed",
    lines: [
      { text: "床是铁架的，九十厘米宽。翻个身，整栋楼都听得见。", se: "creak" },
      { text: "我把翻身拆成六步：抬腰，挪肩，脚踝压住床沿。像拆炸弹。没用。" },
      { text: "上铺鼾声如雷。空调正对着脸，风像砂纸擦眼皮。", se: "snore" },
      { text: "羊数到三百七十四。母亲的话插进来：这次要是考不好，我们家的脸往哪搁。羊全散了。", se: "ac" },
      { text: "凌晨三点十七分。我想打电话给老裴，问酒店还订不订得到。" },
    ],
    options: [
      { id: "down", label: "把手机扣过去", next: "ch1_down" },
      { id: "call", label: "拨给老裴", next: "ch1_call" },
    ],
  },
  ch1_down: {
    bg: "dorm",
    layer: "real",
    bgm: "bed",
    lines: [{ text: "太晚了。明天是第一场语文。屏幕暗下去的时候，我松了口气，又恨这口气。" }],
    next: "ch1_exam",
  },
  ch1_call: {
    bg: "dorm",
    layer: "real",
    bgm: "bed",
    who: "裴望",
    face: "soft",
    lines: [
      { who: "裴望", face: "soft", voice: true, text: "喂？黍琊？这会儿订不到了。你先把手机放下，把眼睛闭上。" },
      { text: "我闭上了。眼睛还是干的。" },
    ],
    next: "ch1_exam",
  },
  ch1_exam: {
    bg: "exam",
    layer: "real",
    bgm: "exam",
    lines: [
      { text: "六月七日，七点四十分。我坐在考场里，像一块泡过水的饼干。", se: "pen" },
      { text: "字在纸上发虚。第一题我读了三遍。" },
    ],
    options: [
      { id: "read", label: "把题再读一遍", next: "ch1_read" },
      { id: "clock", label: "看了一眼时钟", next: "ch1_clock" },
    ],
  },
  ch1_read: {
    bg: "exam",
    layer: "real",
    bgm: "exam",
    lines: [{ text: "第四遍，句子终于站住。我写下去。字还是飘。", se: "pen" }],
    next: "ch1_score",
  },
  ch1_clock: {
    bg: "exam",
    layer: "real",
    bgm: "exam",
    lines: [{ text: "时针走得很响。我听钟，不听题。" }],
    next: "ch1_score",
  },
  ch1_score: {
    bg: "home",
    layer: "real",
    bgm: "june",
    who: "裴望",
    face: "soft",
    lines: [
      { text: "出分那天，家里没有开灯。母亲把成绩单折好，折痕很深。" },
      { text: "她没说话。折痕比字更深。" },
      { text: "老裴来了。他没有说还有机会。他倒了杯水，放在我手边。" },
      { who: "裴望", face: "soft", voice: true, text: "先喝水。" },
      { text: "郁明的消息亮了一下，我没点开。沈知夏的信在门口，我让它待着。" },
      { text: "六月九日凌晨。我躺回那张让我落榜的床，终于睡着了。" },
    ],
    next: "ch2_white",
  },
  ch2_white: {
    title: "第二章 · 白光的选项",
    bg: "white",
    layer: "limen",
    bgm: "white",
    cg: "cg_white",
    fragment: "white",
    lines: [
      { text: "光没有来处。像候考室的灯，又像什么都不是。" },
      { text: "有个人影站在光的另一头。我看不清她的脸。" },
    ],
    options(state) {
      const options = [
        { id: "accept", label: "认命，接受成绩单", next: "end_a" },
        { id: "again", label: "再来一次，开启新的人生", next: "ch3_hotel" },
      ];
      if (state.ngPlus && !state.flags.ngSpoke) {
        options.push({
          id: "seen",
          label: "你好像在哪里见过她",
          next: "ch2_ng",
          set: { ngSpoke: true },
        });
      }
      return options;
    },
  },
  ch2_ng: {
    bg: "white",
    layer: "limen",
    bgm: "white",
    lines: [
      { text: "那人影侧了一下头。白衬衫。校门口的那一下，忽然对上了。" },
      { text: "光没有回答。选项还在。" },
    ],
    next: "ch2_white",
  },
  end_a: {
    bg: "rain",
    layer: "real",
    bgm: "rain",
    ending: "A",
    lines: [
      { text: "我接过成绩单。雨从楼道尽头淌进来。", se: "rain" },
      { text: "后来我上了一所普通的一本。床还是窄，觉却慢慢能睡了。" },
      { text: "多年以后我路过那所高中。铁架床的声音没有再响起。雨还在。" },
      { text: "那一晚的光，我没有再走进去。" },
    ],
  },
  ch3_hotel: {
    title: "第三章 · 重来之日",
    bg: "lobby",
    layer: "dream",
    bgm: "cradle",
    who: "裴望",
    face: "professor",
    lines: [
      { text: "白光一收，日历翻回六月五日。" },
      { who: "裴望", face: "professor", voice: true, text: "学校把酒店订了。眠夏，八楼。你好好睡。" },
    ],
    next: "ch3_sleep",
  },
  ch3_sleep: {
    bg: "guest",
    layer: "dream",
    bgm: "cradle",
    lines: [
      { text: "我没记得自己答应过。床很软。我一觉睡到自然醒。" },
      { text: "梦里的床没有铁。翻身也没有声音。" },
    ],
    next: "ch3_out",
  },
  ch3_out: {
    bg: "examout",
    layer: "dream",
    bgm: "cradle",
    cg: "cg_exam_ok",
    lines: [
      { text: "六月七日。笔是稳的。题是清楚的。", se: "pen" },
      { text: "出考场时，太阳白得不真实。" },
    ],
    next: "d1",
  },
  d1: {
    bg: "lobby",
    layer: "dream",
    bgm: "cradle",
    cg: "cg_desk",
    who: "鹿眠",
    face: "knowing",
    lines: [
      { text: "前台的玻璃后面站着一个女孩。她看着我，像已经等了一会儿。" },
      { who: "鹿眠", face: "knowing", text: "考完了？" },
    ],
    options: [
      {
        id: "ask",
        label: "回头看前台那个女孩",
        next: "crack_cal",
        fx: { d: 6, lu: 10 },
        say: { who: "鹿眠", face: "soft", text: "你看起来，像是终于睡过一觉的人。" },
        thought: sting,
      },
      { id: "skip", label: "直接离开", next: "crack_cal", thought: "我走出旋转门。玻璃上有她的影子，我没回头。" },
    ],
  },
  crack_cal: {
    bg: "calendar",
    layer: "dream",
    bgm: "crack",
    onEnter: { d: 4 },
    fragment: "june9",
    lines: [
      { text: "大堂的日历停在六月九日。我按了一下，纸页不动。" },
      { text: "没有人觉得这有什么奇怪。" },
    ],
    next: "d2",
  },
  d2: {
    bg: "gate",
    layer: "dream",
    bgm: "qinhua",
    cg: "cg_gate",
    lines: [
      { text: "录取来得太顺。秦华的校门立在眼前，匾额像是新的。" },
      { text: "我盯着那几个字。笔画好像多了一笔，又好像没有。" },
    ],
    options: [
      {
        id: "ask",
        label: "总觉得校名哪里不对，再看一眼",
        next: "d2_plaque",
        fx: { d: 6 },
        thought: sting,
      },
      { id: "skip", label: "拍照，发一条朋友圈", next: "daily1", thought: "照片里的校门很完美。评论区全是恭喜。我把手机扣上。" },
    ],
  },
  d2_plaque: {
    bg: "plaque",
    layer: "dream",
    bgm: "crack",
    fragment: "plaque",
    lines: [{ text: "我走近。匾额上的字忽然正了。多出来的那一笔却还在眼睛里。", kind: "glitch" }],
    next: "daily1",
  },
  daily1: {
    bg: "gate",
    layer: "dream",
    bgm: "qinhua",
    lines: [{ text: "入学第一周，下午空出一截。我不知道该把这段时间交给谁。" }],
    options: [
      { id: "lu", label: "去前台找鹿眠", next: "acad1", fx: { lu: 5 }, say: { who: "鹿眠", face: "soft", text: "你又来。咖啡是热的。你却总看着电梯。" } },
      { id: "shen", label: "去找沈知夏", next: "acad1", fx: { shen: 5 }, say: { who: "沈知夏", face: "shy", text: "学姐？……你这么叫我，我会不习惯。" } },
      { id: "yu", label: "去找郁明", next: "acad1", fx: { yu: 5 }, say: { who: "郁明", face: "rival", text: "来得正好。这道题我跟你争。" } },
    ],
  },
  acad1: {
    bg: "library",
    layer: "dream",
    bgm: "lamp",
    lines: [{ text: "社团招新和图书馆的灯撞在同一个下午。", se: "page" }],
    options: [
      { id: "a", label: "泡进图书馆", next: "d3", fx: { academic: 10 }, thought: "灯一直亮到闭馆。名字在借书条上写得很直。" },
      { id: "b", label: "去社团看看", next: "d3", fx: { academic: -10 }, thought: "我在人群里站了一小时。什么也没留下。" },
    ],
  },
  d3: {
    bg: "cafeteria",
    layer: "dream",
    bgm: "pork",
    lines: [
      { text: "食堂。红烧肉。这是第四天同一道菜。" },
      { text: "排队的人里，没有谁皱眉。" },
    ],
    options: [
      { id: "ask", label: "问阿姨：今天是不是又是红烧肉", next: "d3_plate", fx: { d: 10 } },
      { id: "skip", label: "换个窗口，眼不见为净", next: "crack_id", thought: "我换了窗口。味道还是从背后飘过来。" },
    ],
  },
  d3_plate: {
    bg: "pork",
    layer: "dream",
    bgm: "crack",
    fragment: "pork",
    who: "阿姨",
    face: "pause",
    lines: [
      { who: "阿姨", face: "pause", text: "同学，食堂哪来的红烧肉？" },
      { text: "我低头。盘子里分明是。广播里的歌走了一拍。", kind: "glitch" },
    ],
    next: "crack_id",
  },
  crack_id: {
    bg: "classroom",
    layer: "dream",
    bgm: "crack",
    onEnter: { d: 4 },
    fragment: "status",
    lines: [
      { text: "导师点名，问我应届还是复读。我答完，他已经在叫下一个人。" },
      { text: "全班没有人记得我的答案。" },
    ],
    next: "d4",
  },
  d4: {
    bg: "dorm",
    layer: "dream",
    bgm: "cradle",
    who: "郁明",
    face: "blank",
    pose: "sit",
    lines: [
      { who: "郁明", face: "blank", pose: "sit", voice: true, text: "今天我生日。大概。" },
      { text: "蛋糕上的日期被奶油糊住了。" },
    ],
    options: [
      {
        id: "ask",
        label: "追问：你生日到底是哪天",
        next: "acad2",
        fx: { d: 6, yu: 6 },
        say: { who: "郁明", face: "sting", pose: "sit", text: "我……想不起来。奇怪。我以前记得很清楚。" },
        thought: sting,
      },
      { id: "skip", label: "打趣带过", next: "acad2", thought: "我们碰了杯。他笑着，眼睛是空的。" },
    ],
  },
  acad2: {
    bg: "lab",
    layer: "dream",
    bgm: "lab",
    who: "裴望",
    face: "professor",
    lines: [{ who: "裴望", face: "professor", voice: true, text: "我这里有个课题。你要不要接下来。" }],
    options: [
      { id: "a", label: "接下来", next: "d5", fx: { academic: 15 }, thought: "课题本上写下我的名字。笔顺很熟，像老裴批改作文的那支。" },
      { id: "b", label: "缓一缓", next: "d5", fx: { academic: -5 }, thought: "我说再看看。他点头，好像早知我会这样。" },
    ],
  },
  d5: {
    bg: "library",
    layer: "dream",
    bgm: "lamp",
    who: "沈知夏",
    face: "quiet",
    lines: [{ text: "沈知夏站在书架尽头。在这里她是学姐。右眼角干干净净。" }],
    options: [
      {
        id: "ask",
        label: "问：你右眼角是不是有颗痣",
        next: "daily2",
        fx: { d: 10, shen: 10 },
        fragment: "mole",
        say: { who: "沈知夏", face: "pause", voice: true, text: "痣？我没有吧。你记错人了。" },
        thought: { text: "她的笑停了零点三秒。", kind: "glitch" },
      },
      { id: "skip", label: "归给光线", next: "daily2", thought: "我把那一下归给日光灯。书页恢复了平整。" },
    ],
  },
  daily2: {
    bg: "library",
    layer: "dream",
    bgm: "lamp",
    lines: [{ text: "闭馆铃响了。还可以再陪一个人走一段。", se: "chime" }],
    options: [
      { id: "lu", label: "绕去酒店前台", next: "d6", fx: { lu: 5 }, say: { who: "鹿眠", face: "knowing", text: "这么晚。电梯还是不停八楼。" } },
      { id: "shen", label: "送沈知夏到路口", next: "d6", fx: { shen: 5 }, say: { who: "沈知夏", face: "smile", text: "你走路的样子，和那年一样。" } },
      { id: "yu", label: "回宿舍找郁明", next: "d6", fx: { yu: 5 }, say: { who: "郁明", face: "bright", text: "你回来了。灯我给你留着。" } },
    ],
  },
  d6: {
    bg: "guest",
    layer: "dream",
    bgm: "cradle",
    who: "黍母",
    face: "gentle",
    lines: [{ text: "母亲来电话。她的声音轻得不像她。" }],
    options: [
      {
        id: "ask",
        label: "问：妈，你现在在做什么",
        next: "acad3",
        fx: { d: 6 },
        fragment: "mother",
        say: { who: "黍母", face: "gentle", voice: true, text: "我在做饭呀。你想吃什么，妈都给你做。" },
        thought: sting,
      },
      { id: "skip", label: "报喜，不报忧", next: "acad3", thought: "我说我很好。她说她知道。电话像一句录好的台词。" },
    ],
  },
  acad3: {
    bg: "lab",
    layer: "dream",
    bgm: "lab",
    lines: [{ text: "实验做到后半夜。数据还差最后一组。" }],
    options: [
      { id: "a", label: "通宵做完", next: "d7", fx: { academic: 10 }, thought: "天亮的时候，曲线终于闭合。我没有困。" },
      { id: "b", label: "回去睡", next: "d7", thought: "我躺下。梦里的床太软，软得像没有重量。" },
    ],
  },
  d7: {
    bg: "no301",
    layer: "dream",
    bgm: "crack",
    who: "鹿眠",
    face: "serious",
    lines: [{ text: "房卡上印着 301。我在八楼走了一圈。没有这个门。", se: "card" }],
    options: [
      {
        id: "ask",
        label: "回前台，找鹿眠问清楚",
        next: "crack_301",
        fx: { d: 10, lu: 10 },
        say: { who: "鹿眠", face: "serious", text: "你终于来问了。八楼没有 301。你的卡却每天都在刷它。" },
        thought: { text: "卡是凉的。凉得不像塑料。", kind: "glitch" },
      },
      { id: "skip", label: "换一间，别再想", next: "crack_301", thought: "我换了朝南的一间。夜里还是会走到走廊尽头。" },
    ],
  },
  crack_301: {
    bg: "no301",
    layer: "dream",
    bgm: "crack",
    onEnter: { d: 4 },
    fragment: "room301",
    lines: [{ text: "电梯的楼层灯跳过了八。没有人按。" }],
    next: "acad4",
  },
  acad4: {
    bg: "lab",
    layer: "dream",
    bgm: "lab",
    who: "沈知夏",
    face: "quiet",
    lines: [{ text: "学术会议和沈知夏的消息来自同一个傍晚。" }],
    options: [
      { id: "a", label: "去参加会议", next: "d8", fx: { academic: 10 }, thought: "会场的灯很冷。我的名字被念到，掌声整齐。" },
      {
        id: "b",
        label: "留下来陪沈知夏",
        next: "d8",
        fx: { academic: -10, shen: 10 },
        say: { who: "沈知夏", face: "smile", voice: true, text: "你居然没去。那我请你喝热的。" },
      },
    ],
  },
  d8: {
    bg: "award",
    layer: "dream",
    bgm: "applause",
    who: "裴望",
    face: "professor",
    lines: [
      { who: "裴望", face: "professor", voice: true, text: "年度最年轻学者。" },
      { text: "颁奖词下面，年份是去年。掌声很齐。没有人看那一行小字。" },
    ],
    options: [
      {
        id: "ask",
        label: "会后找裴教授核对年份",
        next: "daily3",
        fx: { d: 6 },
        fragment: "lastyear",
        say: { who: "裴望", face: "overlap", text: "年份？印刷的问题。你去准备下一场。" },
        thought: sting,
      },
      { id: "skip", label: "和大家一起鼓掌", next: "daily3", thought: "我跟着鼓掌。手心是热的，像别人的。" },
    ],
  },
  daily3: {
    bg: "roof",
    layer: "dream",
    bgm: "cradle",
    lines: [{ text: "颁奖结束，天台的风是冷的。还可以把今晚交给一个人。", se: "chime" }],
    options: [
      { id: "lu", label: "给鹿眠打电话", next: "acad5", fx: { lu: 5 }, say: { who: "鹿眠", face: "whisper", text: "别在梦里站太高。风大。" } },
      { id: "shen", label: "把沈知夏叫上来", next: "acad5", fx: { shen: 5 }, say: { who: "沈知夏", face: "look", text: "奖杯沉吗。你的手在抖。" } },
      { id: "yu", label: "跟郁明分一瓶汽水", next: "acad5", fx: { yu: 5 }, say: { who: "郁明", face: "rival", text: "下一篇，我们还是对手。" } },
    ],
  },
  acad5: {
    bg: "lab",
    layer: "dream",
    bgm: "lab",
    who: "郁明",
    face: "rival",
    lines: [{ who: "郁明", face: "rival", text: "一作写谁。编辑催了。" }],
    options: [
      { id: "a", label: "坚持写自己", next: "ch3_paper", fx: { academic: 10 }, thought: "我把名字放在第一个。他看着我，没有争。" },
      { id: "b", label: "让给郁明", next: "d9", fx: { yu: 10 }, say: { who: "郁明", face: "soft", text: "……谢了。可这该是你的。" } },
    ],
  },
  ch3_paper: {
    bg: "lab",
    layer: "dream",
    bgm: "lab",
    cg: "cg_journal",
    who: "裴望",
    face: "professor",
    lines: [
      { text: "顶刊的清样摊在实验台上。我的名字印在第一行。二十岁。" },
      { who: "裴望", face: "professor", text: "去准备颁奖。词我写好了。" },
    ],
    next: "d9",
  },
  d9: {
    bg: "library",
    layer: "dream",
    bgm: "lamp",
    who: "鹿眠",
    face: "knowing",
    pose: "lean",
    lines: [
      { text: "深夜十一点。论文初稿刚写完。玻璃门外站着鹿眠。" },
      { text: "她今天第三次出现在我恰好抬头的位置。" },
    ],
    options: [
      {
        id: "ask",
        label: "听她把话说完",
        next: "acad6",
        fx: { d: 6, lu: 10 },
        say: { who: "鹿眠", face: "whisper", pose: "lean", text: "你记得酒店八楼没有 301 房吧？你昨晚又拿房卡去刷了。" },
        thought: sting,
      },
      { id: "skip", label: "打断她，回去改论文", next: "acad6", thought: "我低下头。门外的人影等了一会儿，走了。" },
    ],
  },
  acad6: {
    bg: "lab",
    layer: "dream",
    bgm: "lab",
    who: "裴望",
    face: "professor",
    lines: [{ who: "裴望", face: "professor", text: "留下读博，或者现在就出去。你自己定。" }],
    options: [
      { id: "a", label: "留校深造", next: "daily4", fx: { academic: 10 }, thought: "我点了头。未来被排成一张很干净的表。" },
      { id: "b", label: "出去创业", next: "daily4", fx: { academic: -5 }, thought: "我说想试试别的。表格上的路暗了一格。" },
    ],
  },
  daily4: {
    bg: "lobby",
    layer: "dream",
    bgm: "cradle",
    lines: [{ text: "梦里的最后几个傍晚，长得几乎一样。我还是想见一个人。" }],
    options: [
      { id: "lu", label: "在前台坐到打烊", next: "ch4", fx: { lu: 5 }, say: { who: "鹿眠", face: "knowing", text: "你坐了很久。时钟没有往前走。" } },
      { id: "shen", label: "把旧信又读一遍", next: "ch4", fx: { shen: 5 }, thought: "信上的字会动。痣那一句，时有时无。" },
      { id: "yu", label: "跟郁明下完最后一盘棋", next: "ch4", fx: { yu: 5 }, say: { who: "郁明", face: "blank", text: "这盘我认输。下一盘，等你醒了再说。" } },
    ],
  },
  ch4: {
    title: "第四章 · 梦的裂缝",
    bg: "lobby",
    layer: "dream",
    bgm: "home",
    meter: true,
    fragment: "gohome",
    who: "鹿眠",
    face: "soft",
    lines: [
      { text: "鹿眠把一张房卡推过大理石台面。卡上印着 301。", se: "card" },
      { text: "八楼没有 301。这件事我早就知道了。" },
      { who: "鹿眠", face: "soft", text: "睡够了，就回家。" },
      { text: "她的语气像在提醒一个忘记退房的客人。" },
    ],
    options: [
      { id: "take", label: "接过房卡", next: "ch4_door", fx: { lu: 10 }, thought: "卡是凉的。凉得像真的。" },
      { id: "push", label: "推开", next: "ch4_door", thought: "我把手收回来。她没有再推第二次。" },
    ],
  },
  ch4_door: {
    bg: "white",
    layer: "limen",
    bgm: "white",
    meter: true,
    fragment: "heart",
    lines(state) {
      const base = [
        { text: "大厅的钟停在六月九日，六点。我听见心跳。", se: "heart" },
        { text: "梦里的我，从来不会有心跳。" },
      ];
      if (state.dissonance < WAKE_AT) {
        base.push({ text: "我去找醒来的那一项。光很平。那里没有门。", kind: "thought" });
      } else {
        base.push({ text: "选项浮在白光里。门在。要不要推，是我的事。" });
      }
      return base;
    },
    options(state) {
      const stay = {
        id: "stay",
        label: "留在这里——继续这场人生",
        next: state.academic >= ACADEMIC_SPLIT ? "end_b" : "end_c",
      };
      if (state.dissonance >= WAKE_AT) {
        return [{ id: "wake", label: "醒来——回到那晚", next: "finale" }, stay];
      }
      return [stay];
    },
  },
  end_b: {
    bg: "faceless",
    layer: "dream",
    bgm: "applause",
    cg: "cg_faceless",
    fragment: "faceless",
    ending: "B",
    lines: [
      { text: "颁奖台很高。台下的人没有脸。他们鼓掌，嘴巴的位置是平的。" },
      { text: "我笑着鞠躬。奖杯很沉，沉得像一口井。" },
      { text: "完美停在这一步。我没有再醒来，也没有真正活过。" },
    ],
  },
  end_c: {
    bg: "diary",
    layer: "dream",
    bgm: "crack",
    ending: "C",
    lines: [
      { text: "后来我结了婚，有了孩子，日子一天不落地圆满。" },
      { text: "很老的那个晚上，我翻开日记的最后一页。字是我的。" },
      { text: "上面写着：这不是我的人生。" },
    ],
  },
  finale: {
    title: "终章 · 醒来之后",
    bg: "dorm",
    layer: "real",
    bgm: "heart",
    cg: "cg_wake",
    meter: true,
    lines: [
      { text: "心跳还在。床是铁的。九十厘米。", se: "heart" },
      { text: "六月九日，凌晨。成绩单还在桌上。梦里的奖杯不在。" },
      { text: "我坐起来。手心全是汗。这次是真的醒了。" },
    ],
    next: "f1",
  },
  f1: {
    bg: "home",
    layer: "real",
    bgm: "awake",
    meter: true,
    who: "裴望",
    face: "soft",
    lines: [{ who: "裴望", face: "soft", voice: true, text: "复读的表在这儿。报名费我可以先垫。" }],
    options: [
      { id: "self", label: "自己交报名费", next: "repeat_room", thought: "我把积下来的钱数了一遍。够。这是我自己的一年。" },
      { id: "pei", label: "接受老裴的安排", next: "repeat_room", say: { who: "裴望", face: "soft", text: "行。你只管把觉睡回来。" } },
    ],
  },
  repeat_room: {
    bg: "repeat",
    layer: "real",
    bgm: "awake",
    cg: "cg_repeat",
    meter: true,
    who: "裴望",
    face: "stern",
    lines: [
      { text: "复读班的教室比去年更挤。黑板上的倒计时从三百多天开始。" },
      { text: "我把铁架床的声音留在去年。这张桌子是醒着的。" },
    ],
    next: "f2",
  },
  f2: {
    bg: "dorm",
    layer: "real",
    bgm: "awake",
    meter: true,
    lines: [{ text: "复读第一夜。我看着闹钟，不知道该把它定在哪一刻。" }],
    options: [
      {
        id: "alarm",
        label: "设成六月九日，六点",
        next: "f3",
        fragment: "alarm",
        thought: { text: "梦醒的那一天，我把它改成出发的那一天。", se: "alarm" },
      },
      { id: "morning", label: "设成明天早上六点", next: "f3", thought: "明天先到。六月九日，会自己来。" },
    ],
  },
  f3: {
    bg: "corridor",
    layer: "real",
    bgm: "awake",
    meter: true,
    who: "裴望",
    face: "soft",
    lines: [{ who: "裴望", face: "soft", voice: true, text: "二考前夜，学校还是订了酒店。去不去，你定。" }],
    options: [
      { id: "hotel", label: "去眠夏酒店住一晚", next: "fin_hotel", fx: { lu: 10 } },
      { id: "home", label: "住在家里", next: "fin_home" },
    ],
  },
  fin_hotel: {
    bg: "lobby",
    layer: "real",
    bgm: "awake",
    meter: true,
    fragment: "milk",
    who: "鹿眠",
    face: "smile",
    lines: [
      { text: "前台抬起头。是她。这次我记住了。" },
      { who: "鹿眠", face: "smile", text: "热牛奶。高考那两天我也递过。你没接住。" },
    ],
    options(state) {
      if (!hiddenReady(state)) return [];
      return [
        { id: "hidden", label: "我们是不是见过", next: "end_e" },
        { id: "staynight", label: "我是来住一晚的", next: "second_exam" },
      ];
    },
    next(state) {
      return hiddenReady(state) ? null : "second_exam";
    },
  },
  fin_home: {
    bg: "home",
    layer: "real",
    bgm: "awake",
    meter: true,
    who: "黍母",
    face: "warm",
    lines: [
      { text: "我住在家里。母亲把切好的水果推过来，没再提名次。" },
      { who: "黍母", face: "warm", voice: true, text: "早点睡。明天我叫你。" },
      { text: "她的声音有一点哑。不再温柔得像一句录音。" },
    ],
    next: "second_exam",
  },
  second_exam: {
    bg: "examout",
    layer: "real",
    bgm: "awake",
    cg: "cg_outside",
    meter: true,
    lines: [
      { text: "二考那天，考场外的风是热的。我睡过了。" },
      { text: "门开着。这次不是梦里的白光。" },
    ],
    next: epilogueId,
  },
  epi_lu: {
    bg: "gate",
    layer: "real",
    bgm: "awake",
    cg: "cg_reunion",
    ending: "TRUE",
    who: "鹿眠",
    face: "smile",
    lines: [
      { text: "复读的一年很长。我自己交了报名费，自己走进考场。" },
      { who: "鹿眠", face: "smile", text: "这次醒着考。我在门口。" },
      { text: "一年后，秦华的校门没有多出来的笔画。她把热牛奶放进我手里。" },
      { text: "我没有重写昨天。我只是来到了明天。" },
    ],
  },
  epi_shen: {
    bg: "classroom",
    layer: "real",
    bgm: "awake",
    cg: "cg_reunion",
    ending: "TRUE",
    who: "沈知夏",
    face: "smile",
    lines: [
      { text: "复读的一年里，我把那张折着的纸读了很多遍。" },
      { who: "沈知夏", face: "smile", voice: true, text: "通知书到了？右眼角……你还在看。" },
      { text: "痣还在。没有被改写。这就够了。" },
      { text: "我没有重写昨天。我把明天写成了自己的。" },
    ],
  },
  epi_yu: {
    bg: "home",
    layer: "real",
    bgm: "awake",
    cg: "cg_reunion",
    ending: "TRUE",
    who: "郁明",
    face: "bright",
    lines: [
      { who: "郁明", face: "bright", voice: true, text: "笔记我寄来了。生日我也想起来了。是三月。" },
      { text: "我笑了一下。梦里的他记不住的东西，醒着的他都在。" },
      { text: "秦华的通知书很薄。我把它和那叠笔记放在一起。" },
      { text: "明天从这里开始。" },
    ],
  },
  epi_default: {
    bg: "exam",
    layer: "real",
    bgm: "awake",
    cg: "cg_reunion",
    ending: "TRUE",
    lines: [
      { text: "复读的一年很长。没有人替我醒来。是我自己按掉闹钟，走进考场。" },
      { text: "秦华的通知书很薄。够用了。" },
      { text: "我没有重写昨天。我只是愿意醒来，然后重考一次。" },
    ],
  },
  epi_tie: {
    bg: "gate",
    layer: "real",
    bgm: "awake",
    cg: "cg_reunion",
    ending: "TRUE",
    lines: [
      { text: "考完那天，不止一个人在校门口等我。" },
      { text: "热牛奶、一封旧信、一叠笔记，叠在一起。我谁也没有放下。" },
      { text: "明天不只有一条路。可它是醒着的。" },
    ],
  },
  end_e: {
    bg: "white",
    layer: "limen",
    bgm: "together",
    ending: "E",
    who: "鹿眠",
    face: "smile",
    lines: [
      { text: "我看着她。牛奶还是热的。" },
      { who: "黍琊", face: "awake", voice: false, text: "如果这也是梦呢。" },
      { who: "鹿眠", face: "smile", text: "那我们一起醒。" },
      { text: "钟终于走到了六月十日。" },
    ],
  },
};
