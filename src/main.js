import "./style.css";
import { mountLedger } from "./ledgerView.js";
import { mountVn } from "./vn.js";
import { renderPage } from "./pages.js";

const NAV = [
  [
    "阅读",
    [
      ["home", "标题画面"],
      ["pillars", "设计支柱"],
      ["story", "故事设定"],
      ["cast", "角色"],
      ["plot", "剧情大纲"],
    ],
  ],
  [
    "结构",
    [
      ["flow", "分支结局"],
      ["ledger", "清醒账本"],
      ["systems", "系统界面"],
    ],
  ],
  [
    "制作",
    [
      ["craft", "内容规格"],
      ["tech", "技术方案"],
      ["plan", "排期预算"],
      ["check", "验证附录"],
    ],
  ],
];

const TITLES = Object.fromEntries(NAV.flatMap(([, items]) => items));
const ORDER = NAV.flatMap(([, items]) => items.map(([id]) => id));

function parseHash() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { id: parts[0] || "home", extra: parts[1] || "" };
}

function navHtml(active) {
  return NAV.map(
    ([label, items]) => `<div class="nav-group">
      <p>${label}</p>
      ${items
        .map(
          ([id, name]) =>
            `<a href="#/${id}" data-route="${id}" ${id === active ? 'aria-current="page"' : ""}>${name}</a>`,
        )
        .join("")}
    </div>`,
  ).join("");
}

function pager(id) {
  const index = ORDER.indexOf(id);
  if (index < 0) return "";
  const prev = ORDER[index - 1];
  const next = ORDER[index + 1];
  return `<nav class="pager">
    ${prev ? `<a href="#/${prev}" data-route="${prev}">上一节 · ${TITLES[prev]}</a>` : "<span></span>"}
    ${next ? `<a href="#/${next}" data-route="${next}">下一节 · ${TITLES[next]}</a>` : "<span></span>"}
  </nav>`;
}

function shell() {
  return `<a class="skip" href="#page">跳到正文</a>
  <div class="shell">
    <aside class="side">
      <a class="brand" href="#/home" data-route="home">
        <span class="brand-hotel">眠夏酒店</span>
        <span class="brand-room">301</span>
        <span class="brand-miss">此房不存在</span>
        <strong>黍琊</strong>
        <em>醒梦之间 · GDD</em>
      </a>
      <nav class="nav" id="nav">${navHtml("home")}</nav>
    </aside>
    <div class="main">
      <header class="topbar">
        <p>设计文档 V1.0</p>
        <div class="top-actions">
          <p class="date-pill">6 月 9 日</p>
          <div class="theme-switch" role="group" aria-label="现实或梦境">
            <button type="button" data-theme-set="reality">现实</button>
            <button type="button" data-theme-set="dream">梦境</button>
          </div>
        </div>
      </header>
      <article id="page" tabindex="-1"></article>
      <p id="live" class="sr-only" aria-live="polite"></p>
    </div>
  </div>`;
}

function syncTheme() {
  const theme = document.documentElement.dataset.theme || "reality";
  document.querySelectorAll("[data-theme-set]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.themeSet === theme ? "true" : "false");
  });
}

function render() {
  const { id, extra } = parseHash();
  const page = document.querySelector("#page");
  const known = ORDER.includes(id);
  page.innerHTML = `${renderPage(id)}${pager(known ? id : "")}`;
  document.querySelector("#nav").innerHTML = navHtml(known ? id : "");
  document.title = `${known ? TITLES[id] : "未找到"} · 黍琊：醒梦之间`;
  const live = document.querySelector("#live");
  live.textContent = known ? `打开${TITLES[id]}` : "没有这一节";
  const vn = document.querySelector("#vn-root");
  if (vn) mountVn(vn);
  const ledger = document.querySelector("#ledger-root");
  if (ledger) mountLedger(ledger, extra);
  window.scrollTo(0, 0);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("suya-theme", theme);
  } catch {
    /* ignore private mode */
  }
  syncTheme();
}

document.querySelector("#app").innerHTML = shell();
syncTheme();

document.body.addEventListener("click", (event) => {
  const themeButton = event.target.closest("[data-theme-set]");
  if (themeButton) {
    setTheme(themeButton.dataset.themeSet);
    return;
  }
  const link = event.target.closest("[data-route]");
  if (!link) return;
  event.preventDefault();
  const id = link.dataset.route;
  const extra = link.dataset.extra || "";
  const next = extra ? `#/${id}/${extra}` : `#/${id}`;
  if (location.hash === next) {
    render();
    return;
  }
  location.hash = next;
});

window.addEventListener("hashchange", render);
if (!location.hash) location.hash = "#/home";
else render();
