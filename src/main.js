import "./style.css";
import { mountGame } from "./game.js";

const root = document.querySelector("#app");
try {
  mountGame(root);
} catch (error) {
  root.textContent = `页面没有启动：${error instanceof Error ? error.message : "未知错误"}`;
}
