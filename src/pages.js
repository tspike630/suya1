import {
  ANCHORS,
  AUTO_CRACKS,
  BACKGROUNDS,
  BUDGET,
  CGS,
  CHAPTERS,
  CHARACTERS,
  ENDINGS,
  ENGINES,
  FACTS,
  FILES,
  FINALE_BEATS,
  FLOW_NODES,
  GLOSSARY,
  GENRE_MAP,
  HYPOTHESES,
  LAYERS,
  LOOPS,
  MILESTONES,
  NG_PLUS,
  OUT_OF_SCOPE,
  P0,
  P1,
  PAIRS,
  PILLARS,
  REFERENCES,
  RISKS,
  RULINGS,
  SAMPLE_BED,
  SAMPLE_DOOR,
  SFX,
  SOURCES,
  SPRITES,
  SYSTEMS,
  TEAM,
  THEME_ROWS,
  TIMELINE,
  TRACKS,
  VARIABLES,
  VOICE,
} from "./content.js";
import { esc, paragraphs, table } from "./ui.js";

function head(kicker, title, lede) {
  return `<header class="page-head">
    <p class="kicker">${esc(kicker)}</p>
    <h1>${esc(title)}</h1>
    ${lede ? `<p class="lede">${esc(lede)}</p>` : ""}
  </header>`;
}

function home() {
  const facts = FACTS.map(
    ([label, value]) =>
      `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`,
  ).join("");
  const pillars = PILLARS.map(
    (pillar) => `<article>
      <span>${esc(pillar.no)}</span>
      <h3>${esc(pillar.title)}</h3>
      <p>${esc(pillar.body)}</p>
    </article>`,
  ).join("");

  return `<section class="title-screen">
      <div>
        <p class="kicker">Galgame 设计文档 · V1.0</p>
        <h1><span class="title-main">黍琊</span><span class="title-sub">醒梦之间</span></h1>
        <p class="theme-line">你不需要重写昨天，你只需要重写明天。</p>
        <p class="lede">玩家扮演一模全市第二、却在高考考点因宿舍床失眠而落榜的少年黍琊，在「再来一次的完美人生」与「回到现实的复读之路」之间反复抉择。梦越美，裂缝越多。真正的好结局不是考上的那一次，而是你愿意醒来的那一次。</p>
        <div class="menu-row">
          <a href="#/story" data-route="story"><b>新游戏</b><small>从故事读起</small></a>
          <a href="#/ledger" data-route="ledger"><b>继续</b><small>打开清醒账本</small></a>
          <a href="#/flow" data-route="flow"><b>流程图</b><small>五结局怎么分</small></a>
          <a href="#/craft" data-route="craft"><b>图鉴</b><small>字、图、声音</small></a>
        </div>
      </div>
      <aside class="ticket">
        <p class="ticket-top"><span>眠夏酒店</span><span>设计摘录</span></p>
        <p class="ticket-room">301</p>
        <p class="ticket-miss">八楼没有这个房间</p>
        <dl>${facts}</dl>
      </aside>
    </section>

    <section class="block">
      <div class="section-title">
        <h2>三根不让步的柱子</h2>
        <a href="#/pillars" data-route="pillars">读完设计承诺</a>
      </div>
      <div class="pillar-row">${pillars}</div>
    </section>

    <section class="block">
      <div class="section-title">
        <h2>九十秒，走一遍核心循环</h2>
        <p>原文在设计首页的玩法走读。这里只保留那两处选择。</p>
      </div>
      <div id="vn-root" class="vn"></div>
    </section>

    <section class="block count-row">
      <div><b>15 万</b><span>字，含差分</span></div>
      <div><b>5</b><span>个结局</span></div>
      <div><b>6</b><span>个角色</span></div>
      <div><b>12</b><span>张 CG</span></div>
      <div><b>3–4 小时</b><span>单周目</span></div>
      <div><b>12 个月</b><span>4–6 人</span></div>
    </section>`;
}

function pillars() {
  const items = PILLARS.map(
    (pillar) => `<article class="manifesto">
      <span>${esc(pillar.no)}</span>
      <div>
        <h2>${esc(pillar.title)}</h2>
        <p>${esc(pillar.body)}</p>
        <p class="contra"><b>不要做成这样。</b>${esc(pillar.contra)}</p>
      </div>
    </article>`,
  ).join("");
  const loops = LOOPS.map(
    (loop) => `<article>
      <h3>${esc(loop.level)}</h3>
      <p>${esc(loop.does)}</p>
      <p class="fine">${esc(loop.carries)}</p>
    </article>`,
  ).join("");

  return `${head(
    "第一章 · 设计首页",
    "先把承诺说死",
    "你握着「重来」的钥匙：学校出钱订了酒店，你睡得很好，考上了秦华，学术有成。一切完美，除了那些越来越刺眼的裂缝。每一次选择都在「舒服」和「真相」之间选边。第四章的门由你自己前几章的账本决定。没有人替你醒来，也没有人替你留下。",
  )}
  <div class="verb-row">
    <span>追问 / 接受</span>
    <span>留下 / 醒来</span>
    <span>读 / 考 / 逃</span>
  </div>
  <p class="lede">单局就一句话：读场景，在甜蜜的梦和扎眼的裂缝之间选边。违和、羁绊、学术一起变。第四章的【醒来】由前面的账决定。结局之后，流程图点亮新的分支。二周目能看见第一周目看不见的鹿眠。</p>
  <div class="manifesto-list">${items}</div>
  <h2>三层循环</h2>
  <div class="loop-grid">${loops}</div>
  <h2>这次不做什么</h2>
  <ul class="plain">${OUT_OF_SCOPE.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
  <p>单周目就要把情感走完。梦结局是警示性的留白，不是可攻略的隐藏福利。角色的「可攻略」收成羁绊差分和终章后日谈，不为每个人单开一条全流程。</p>
  <h2>已经拍板的事</h2>
  <ul class="plain">${RULINGS.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function story() {
  return `${head(
    "第二章",
    "梦是遗憾的排练",
    "落榜之夜，黍琊在懊悔里睡去，梦见学校出钱订了酒店、高考顺利、考上秦华、学术有成的另一段人生。裂缝越来越多之后，他必须在留下和醒来之间选。复读，才是真正的再来一次。",
  )}
  <div class="worlds">
    <article>
      <p class="kicker">现实 · 2024 年 6 月 · 暖</p>
      <h2>普通小城的重点高中</h2>
      <p>黍琊一模全市第二，和第一名郁明差 3 分。高考前夜他住进考点宿舍：90 厘米的铁架上下铺，空调对着脸吹，邻床打鼾。他彻夜未眠，两天发挥失常，和秦华大学错过。</p>
      <p>落榜之后，母亲失望，班主任老裴来安慰，郁明来问成绩。6 月 9 日凌晨，他在那张失眠的床上睡去。</p>
    </article>
    <article class="is-dream">
      <p class="kicker">梦境 · 冷 · 阈限</p>
      <h2>时间倒回 6 月 5 日</h2>
      <p>班主任通知：学校出钱订了酒店。眠夏酒店。他睡得好，发挥超常，考入秦华，二十岁发表顶刊。</p>
      <p>梦里的素材全是现实记忆改写的。前台鹿眠、室友郁明、学姐沈知夏、导师裴教授，都是真实面孔的梦版。日历停在 6 月 9 日，食堂永远同一道菜，八楼没有 301，没人在意他是应届还是复读。</p>
    </article>
  </div>
  <h2>主题怎么落到机制上</h2>
  ${table(["判断", "机制", "内容", "禁止"], THEME_ROWS)}
  <h2>时间线</h2>
  <ol class="timeline">${TIMELINE.map(
    ([when, layer, event]) =>
      `<li><span>${esc(when)}</span><em>${esc(layer)}</em><p>${esc(event)}</p></li>`,
  ).join("")}</ol>`;
}

function cast() {
  const cards = CHARACTERS.map((person, index) => {
    const id = `cast-${index}`;
    return `<article class="cast-card">
      <input class="sr-only real" type="radio" name="${id}" id="${id}-r" checked />
      <input class="sr-only dream" type="radio" name="${id}" id="${id}-d" />
      <header>
        <span class="seal">${esc(person.seal)}</span>
        <div>
          <h2>${esc(person.name)}</h2>
          <p>${esc(person.age)} 岁 · ${esc(person.role)}</p>
        </div>
      </header>
      <div class="cast-switch">
        <label for="${id}-r">现实</label>
        <label for="${id}-d">梦里</label>
      </div>
      <p>${esc(person.temper)}</p>
      <p class="fine">${esc(person.arc)}</p>
      <div class="face real"><h3>现实里</h3><p>${esc(person.reality)}</p></div>
      <div class="face dream"><h3>梦里</h3><p>${esc(person.dream)}</p></div>
      <blockquote><p>${esc(person.line)}</p><cite>${esc(person.lineBy)}</cite></blockquote>
      <p class="voice">${esc(person.voice)}</p>
    </article>`;
  }).join("");

  return `${head(
    "第三章",
    "六张脸，两套用法",
    "梦不发明陌生人。它借用醒着时见过的人，把他们改到刚好让你愿意留下。",
  )}
  <div class="cast-grid">${cards}</div>
  <h2>借脸对照</h2>
  ${table(["谁", "现实里做了什么", "梦把他们改成"], PAIRS)}`;
}

function plot() {
  const chapters = CHAPTERS.map(
    (chapter) => `<article>
      <header>
        <h2>${esc(chapter.id)}</h2>
        <span>${esc(chapter.words)} · ${esc(chapter.choices)} 个选择</span>
      </header>
      <h3>${esc(chapter.name)}</h3>
      <p>${esc(chapter.event)}</p>
      <p class="fine">接着去：${esc(chapter.to)}</p>
    </article>`,
  ).join("");
  const anchors = ANCHORS.map(
    (anchor) => `<li><b>${esc(anchor.where)}</b><span>${esc(anchor.text)}</span></li>`,
  ).join("");

  return `${head("第四章", "六章，加一个终章", "文本集中在第三章的梦里。两头的现实要短，短到能感到那张床有多窄。")}
  <div class="chapter-list">${chapters}</div>
  <h2>必须站住的场面</h2>
  <ul class="anchors">${anchors}</ul>
  <h2>试写 · 第一章</h2>
  <div class="reading">${paragraphs(SAMPLE_BED)}</div>
  <h2>试写 · 第四章</h2>
  <div class="reading">${paragraphs(SAMPLE_DOOR)}</div>
  <div class="float-choice">
    <p>选项浮在白光里。</p>
    <a href="#/ledger/B" data-route="ledger" data-extra="B"><b>留在这里</b><small>继续这场人生</small></a>
    <a href="#/ledger/TRUE" data-route="ledger" data-extra="TRUE"><b>醒来</b><small>回到那晚</small></a>
  </div>`;
}

function flow() {
  const endings = ENDINGS.map(
    (ending) => `<article class="ending-card" data-code="${esc(ending.code)}">
      <p class="kicker">${esc(ending.type)}</p>
      <h2><span>${esc(ending.code)}</span>${esc(ending.title)}</h2>
      <p class="tone">${esc(ending.tone)}</p>
      <p>${esc(ending.text)}</p>
      <p class="fine">${esc(ending.when)}</p>
    </article>`,
  ).join("");
  const nodes = FLOW_NODES.map(
    (node) => `<li data-layer="${esc(node.layer)}">
      <h3>${esc(node.title)}</h3>
      <p>${esc(node.text)}</p>
    </li>`,
  ).join("");
  const src = `${import.meta.env.BASE_URL}game-flow.jpg`;

  return `${head(
    "第五章",
    "五扇门",
    "所有路径都要落到这五个结局之一。醒来不是隐藏奖励，留下也不是失败标签。",
  )}
  <div class="ending-grid">${endings}</div>
  <h2>状态机</h2>
  <ol class="flow">${nodes}</ol>
  <figure class="plate">
    <img src="${src}" alt="《黍琊：醒梦之间》剧情状态机原稿：现实层经过白光进入梦境，再按醒来或留下分成五个结局。" />
    <figcaption>设计文档附的画板。阅读版在上面，原稿留在这里对照。</figcaption>
  </figure>
  <p><a href="#/ledger" data-route="ledger">用账本把一条路走通</a></p>`;
}

function ledgerPage() {
  return `${head(
    "第五、六章",
    "清醒的账",
    "违和感决定你能不能看见【醒来】。羁绊决定终章后日谈，以及藏起来的那一句。学术值只在你选择留下之后，决定梦有多空。",
  )}
  <div id="ledger-root"></div>
  <h2>自动就会发生的三处</h2>
  ${table(["裂缝", "玩家看见什么", "违和"], AUTO_CRACKS)}
  <h2>终章三拍</h2>
  ${table(["编号", "场面", "作用"], FINALE_BEATS)}
  <h2>显示给玩家的方式</h2>
  <ul class="plain">
    <li>违和感从第三章起先藏着。每涨 10，BGM 掉一拍，对话框的边闪一下。第四章把数字直接亮出来。</li>
    <li>读档、或者在流程图里重选，数值可以回滚。</li>
    <li>不到 60，第四章没有醒来。结局后提示玩家回看第三章，找出没追问的那件事。</li>
    <li>鹿眠、沈知夏、郁明三条羁绊的上限分别是 60、30、26。真结局后日谈看谁先到 20。</li>
  </ul>`;
}

function systems() {
  const layers = LAYERS.map(
    (layer) => `<article><h3>${esc(layer.name)}</h3><p>${esc(layer.look)}</p></article>`,
  ).join("");
  return `${head("第七章", "玩家手里的界面", "系统保持视觉小说该有的那些。本作真正要自己做的，是流程图，以及梦和现实看起来不一样。")}
  ${table(["功能", "说明", "做法"], SYSTEMS)}
  <h2>三层画面</h2>
  <div class="layer-grid">${layers}</div>
  <h2>二周目才看得见</h2>
  <ul class="plain">${NG_PLUS.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function craft() {
  const cgs = CGS.map(
    (title, index) =>
      `<li><span>${String(index + 1).padStart(2, "0")}</span><b>${esc(title)}</b><small>1920×1080</small></li>`,
  ).join("");
  const tracks = TRACKS.map(
    ([role, title], index) =>
      `<li><span>${String(index + 1).padStart(2, "0")}</span><b>${esc(title)}</b><small>${esc(role)}</small></li>`,
  ).join("");
  const glossary = GLOSSARY.map(
    ([term, text]) =>
      `<article><h3>${esc(term)}</h3><p>${esc(text)}</p></article>`,
  ).join("");

  return `${head(
    "第八章",
    "做出来要有多少",
    "阅读速度按每分钟 350 字。单周目 3–4 小时，全收集 7–9 小时。每章一个 .rpy，场景用 label 切开，变量集中在 init。",
  )}
  <div class="count-row tight">
    <div><b>13 万</b><span>正文</span></div>
    <div><b>2 万</b><span>差分</span></div>
    <div><b>24</b><span>背景</span></div>
    <div><b>16</b><span>曲</span></div>
    <div><b>30</b><span>条音效</span></div>
    <div><b>6</b><span>套立绘</span></div>
  </div>
  <h2>章节字数</h2>
  ${table(
    ["章节", "字数", "选择点"],
    CHAPTERS.map((chapter) => [chapter.id + " · " + chapter.name, chapter.words, chapter.choices]),
  )}
  <h2>立绘</h2>
  <p>半身，1920×1080 竖版透明 PNG。</p>
  ${table(["角色", "表情与姿势"], SPRITES)}
  <h2>十二张 CG</h2>
  <ol class="plates">${cgs}</ol>
  <h2>背景</h2>
  <div class="worlds compact">
    <article>
      <h3>现实，共 10 张</h3>
      <p>${esc(BACKGROUNDS.real.join("、"))}</p>
    </article>
    <article class="is-dream">
      <h3>梦境，8 张</h3>
      <p>${esc(BACKGROUNDS.dream.join("、"))}</p>
    </article>
  </div>
  <p>${esc(BACKGROUNDS.note)}</p>
  <p>现实用现代校园的写实淡彩，偏暖。梦用冷调柔焦，对称稍微破掉，让空间有阈限感。</p>
  <h2>已经点名的曲子</h2>
  <p>OST 15 首，加片尾主题曲 1 首。下面五首是叙事上不能换掉的。其余曲名留给作曲。</p>
  <ol class="plates tracks">${tracks}</ol>
  <h2>音效</h2>
  <p class="chip-line">${SFX.map((item) => `<span>${esc(item)}</span>`).join("")}<span>另留 BGM 掉拍</span></p>
  <h2>配音</h2>
  ${table(["谁", "范围"], VOICE)}
  <p>中文配音优先。预算按句计价，见排期页。鹿眠全程配，是因为她要承担「这是梦」这句话。</p>
  <h2>词条 · 梦之碎片</h2>
  <div class="glossary">${glossary}</div>`;
}

function tech() {
  return `${head("第九章", "Ren'Py 8", "流程图和图鉴用自定义 overlay。引擎负责存档、回顾和跳过。")}
  ${table(["引擎", "理由", "取舍"], ENGINES)}
  <h2>脚本文件</h2>
  <p class="chip-line">${FILES.map((file) => `<span>${esc(file)}</span>`).join("")}</p>
  <h2>变量</h2>
  ${table(["名字", "含义"], VARIABLES)}
  <p>每个选项用唯一 label，例如 D3_choice、D10_choice，和选项表一一对应，方便 QA 回查。玩家能看见的字全部走 translate，首发只填简体中文。</p>`;
}

function plan() {
  return `${head(
    "第十章",
    "十二个月，两档预算",
    "日本商业全价 Galgame 大约 3000–5000 万日元。海外独立视觉小说大约 1.1–5.6 万美元。国内同人可以低到一两万。本作按国产独立、标准美术外包价估两档，不含人力工资。",
  )}
  ${table(["角色", "职责", "投入"], TEAM)}
  <h2>里程碑</h2>
  ${table(["阶段", "交付"], MILESTONES)}
  <h2>预算（人民币）</h2>
  ${table(["项", "标准档", "全外包档", "说明"], BUDGET)}
  <div class="callout">
    <p>Steam 国区定价建议 32–38 元，首周九折。按 36 元、平台分成后约七成估算，回本大约要 4000–6000 份。这是设计期的数字，立项后按实际报价改。</p>
  </div>
  <h2>会在哪里裂开</h2>
  ${table(["风险", "表现", "对策"], RISKS)}`;
}

function check() {
  return `${head(
    "第十一、十二章",
    "怎么知道它成立",
    "P0 是能发售的最小一套。P1 把隐藏结局、后日谈和二周目补上。验收看四条可以推翻的假设。",
  )}
  <div class="worlds compact">
    <article>
      <h2>P0</h2>
      <ul class="plain">${P0.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    </article>
    <article>
      <h2>P1</h2>
      <ul class="plain">${P1.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    </article>
  </div>
  <h2>验收</h2>
  ${table(["假设", "怎样算通过"], HYPOTHESES)}
  <h2>一款 Galgame 这里怎么对应</h2>
  ${table(["要素", "通常", "本作"], GENRE_MAP)}
  <h2>参考作品</h2>
  ${table(["作品", "借什么"], REFERENCES)}
  <h2>调研出处</h2>
  <ul class="plain">${SOURCES.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
  <h2>文档里两处口径还没对齐</h2>
  <div class="callout">
    <p>章节字数 2.2、2.3、0.8、6.5、1.8、3.4 万加在一起是 17.0 万。总述写的是约 15 万字、正文 13 万加差分 2 万。立项时要统一按哪一份计数。</p>
    <p>立绘规格是鹿眠 8×2、沈知夏 6×2、郁明 5×2、裴望 4、黍母 3、黍琊 2，合计 47。调研附录写 34 个差分。制作以第八章的规格表为准。</p>
  </div>
  <p class="colophon">来源是《黍琊：醒梦之间》Galgame 设计文档 V1.0。附录注明部分调研由生成式工具整理，商业全价作的日元口径需要在立项时核对原始出处。</p>`;
}

const PAGES = {
  home,
  pillars,
  story,
  cast,
  plot,
  flow,
  ledger: ledgerPage,
  systems,
  craft,
  tech,
  plan,
  check,
};

export function renderPage(id) {
  const page = PAGES[id];
  if (!page) return head("找不到", "这一页不在文档里", "从标题画面重新进去。");
  return page();
}

export const PAGE_IDS = Object.keys(PAGES);
