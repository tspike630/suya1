const NODES = {
  lib: {
    layer: "dream",
    place: "秦华大学图书馆",
    clock: "深夜十一点",
    lines: [
      {
        text: "你刚写完论文初稿，抬头看见鹿眠站在玻璃门外。她今天第三次出现在你恰好抬头的位置。",
      },
    ],
    choice: [
      {
        label: "听她把话说完",
        hint: "违和 +6 · 鹿眠 +10",
        d: 6,
        lu: 10,
        next: "libYes",
      },
      {
        label: "打断她，回去改论文",
        hint: "D9 的另一边 · 不加违和",
        d: 0,
        lu: 0,
        next: "libNo",
      },
    ],
  },
  libYes: {
    layer: "dream",
    place: "秦华大学图书馆",
    clock: "深夜十一点",
    lines: [
      {
        name: "鹿眠",
        text: "你记得酒店八楼没有 301 房吧？你昨晚又拿房卡去刷了。",
      },
      { system: true, text: "心里那根刺动了一下。" },
    ],
    next: "cafe",
  },
  libNo: {
    layer: "dream",
    place: "秦华大学图书馆",
    clock: "深夜十一点",
    lines: [
      {
        system: true,
        text: "你把话打断了。设计表把这一问记成 D9 的 B：违和感不变。她的后半句没有落地。",
      },
    ],
    next: "cafe",
  },
  cafe: {
    layer: "dream",
    place: "秦华大学食堂",
    clock: "第二天",
    lines: [
      {
        text: "打菜阿姨端出红烧肉。这已经是第四天同一道菜。排队的人里，没有谁觉得奇怪。",
      },
    ],
    choice: [
      {
        label: "问阿姨：今天是不是又是红烧肉",
        hint: "违和 +10",
        d: 10,
        lu: 0,
        next: "cafeYes",
      },
      {
        label: "换窗口，眼不见为净",
        hint: "D3 的另一边 · 无变化",
        d: 0,
        lu: 0,
        next: "cafeNo",
      },
    ],
  },
  cafeYes: {
    layer: "dream",
    place: "秦华大学食堂",
    clock: "第二天",
    lines: [
      { name: "阿姨", text: "同学，食堂哪来的红烧肉？" },
      {
        glitch: true,
        text: "你低头看餐盘。上面分明是红烧肉。BGM 在那一瞬掉了拍子。",
      },
    ],
    next: "hotel",
  },
  cafeNo: {
    layer: "dream",
    place: "秦华大学食堂",
    clock: "第二天",
    lines: [
      {
        system: true,
        text: "你换了窗口。这一问记为 D3 的 B，违和感不动。红烧肉还是第四天了。",
      },
    ],
    next: "hotel",
  },
  hotel: {
    layer: "limen",
    place: "眠夏酒店 · 走廊",
    clock: "第三章末",
    lines: [
      { text: "你第三次刷不开 301 的门。走廊尽头，鹿眠靠在墙边等你。" },
      { name: "鹿眠", text: "睡够了，就回家。" },
    ],
    next: "end",
  },
  end: {
    layer: "limen",
    place: "账本",
    clock: "这一段结束",
    lines: [],
    ending: true,
  },
};

function endText(dissonance) {
  if (dissonance >= 16) {
    return "这一段里你两次都追问了，违和感 +16。走读原稿把整章账本停在 58：还差 2 点，第四章的门才肯出现。这两问只是第三章里的 D9 和 D3。";
  }
  if (dissonance > 0) {
    return `这一段的刺动了 ${dissonance} 点。门看的是整章的账，不是单独这一问。只把「舒服」选到底的人，醒不来。`;
  }
  return "两处你都绕开了。按选项表，这两问不加违和。梦会继续显得完美。";
}

function lineHtml(line) {
  if (!line) return "";
  if (line.system) {
    return `<p class="vn-system">${line.text}</p>`;
  }
  const name = line.name
    ? `<span class="vn-name">${line.name}</span>`
    : `<span class="vn-name is-narration">旁白</span>`;
  return `${name}<p class="vn-text ${line.glitch ? "is-glitch" : ""}">${line.text}</p>`;
}

function view(state) {
  const node = NODES[state.id];
  if (node.ending) {
    return `<section class="vn-stage" data-layer="limen">
      <header class="vn-hud"><span>走读结束</span><span>违和 +${state.d} · 鹿眠 +${state.lu}</span></header>
      <div class="vn-end">
        <p class="kicker">1.7 的切片</p>
        <h3>还差 2 点的那种感觉</h3>
        <p>${endText(state.d)}</p>
        <div class="vn-end-actions">
          <button type="button" data-vn="reset">再走一次</button>
          <a data-route="ledger">去整章账本</a>
        </div>
      </div>
    </section>`;
  }

  const current = node.lines[state.line];
  const showChoice = state.phase === "choice";
  const choices = showChoice
    ? `<div class="vn-choices">${node.choice
        .map(
          (option, index) =>
            `<button type="button" data-vn="pick" data-index="${index}"><b>${option.label}</b><small>${option.hint}</small></button>`,
        )
        .join("")}</div>`
    : `<button type="button" class="vn-next" data-vn="next">点击继续</button>`;

  return `<section class="vn-stage ${current && current.glitch ? "is-hit" : ""}" data-layer="${node.layer}">
    <header class="vn-hud">
      <span>${node.place}</span>
      <span>${node.clock}</span>
    </header>
    <div class="vn-dialogue">${lineHtml(current)}</div>
    ${choices}
    <footer class="vn-foot">这一段违和 +${state.d}${state.lu ? ` · 鹿眠 +${state.lu}` : ""}</footer>
  </section>`;
}

export function mountVn(root) {
  const state = { id: "lib", line: 0, phase: "line", d: 0, lu: 0 };

  function draw() {
    root.innerHTML = view(state);
  }

  root.addEventListener("click", (event) => {
    const reset = event.target.closest("[data-vn='reset']");
    if (reset) {
      state.id = "lib";
      state.line = 0;
      state.phase = "line";
      state.d = 0;
      state.lu = 0;
      draw();
      return;
    }
    const pick = event.target.closest("[data-vn='pick']");
    if (pick) {
      const node = NODES[state.id];
      const option = node.choice[Number(pick.dataset.index)];
      state.d += option.d;
      state.lu += option.lu;
      state.id = option.next;
      state.line = 0;
      state.phase = "line";
      draw();
      return;
    }
    if (event.target.closest("[data-vn='next']") || event.target.closest(".vn-dialogue")) {
      const node = NODES[state.id];
      if (node.ending || state.phase === "choice") return;
      if (state.line < node.lines.length - 1) {
        state.line += 1;
        draw();
        return;
      }
      if (node.choice) {
        state.phase = "choice";
        draw();
        return;
      }
      if (node.next) {
        state.id = node.next;
        state.line = 0;
        state.phase = node.next === "end" ? "end" : "line";
        draw();
      }
    }
  });

  draw();
}
