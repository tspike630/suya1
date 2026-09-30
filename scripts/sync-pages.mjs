import { cp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const builtHtmlPath = join(dist, "index.dev.html");
let html = await readFile(builtHtmlPath, "utf8");
if (!html.includes("./assets/game.js")) {
  throw new Error("built page is missing ./assets/game.js");
}
if (!html.includes("./assets/game.css")) {
  throw new Error("built page is missing ./assets/game.css");
}
await writeFile(join(dist, "index.html"), html);
await rm(join(root, "assets"), { recursive: true, force: true });
await cp(join(dist, "assets"), join(root, "assets"), { recursive: true });
await writeFile(join(root, "index.html"), html);
await cp(join(root, "public", "favicon.svg"), join(root, "favicon.svg"));
console.log("pages assets synced");
