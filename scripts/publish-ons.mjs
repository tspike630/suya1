import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { writeOnsScript } from "./onscript.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gameDir = join(root, "game");
const dist = join(root, "dist");

function filesIn(dir, base, found) {
  return readdir(dir, { withFileTypes: true }).then(async (entries) => {
    for (const entry of entries) {
      if (entry.name === "manifest.json") continue;
      const rel = base ? `${base}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await filesIn(join(dir, entry.name), rel, found);
      else found.push({ path: rel, url: `game/${rel}` });
    }
  });
}

async function writePage(dir, copyGame) {
  await mkdir(dir, { recursive: true });
  let html = await readFile(join(root, "vendor/onsyuri/onsyuri.html"), "utf8");
  html = html.replace("<title>Onscripter Yuri v0.7.7</title>", "<title>黍琊：醒梦之间</title>");
  html = html.replace("https://unpkg.com/jszip@3.10.1/dist/jszip.min.js", "jszip.min.js");
  await writeFile(join(dir, "index.html"), html);
  await cp(join(root, "vendor/onsyuri/onsyuri.js"), join(dir, "onsyuri.js"));
  await cp(join(root, "vendor/onsyuri/onsyuri.wasm"), join(dir, "onsyuri.wasm"));
  await cp(join(root, "vendor/jszip.min.js"), join(dir, "jszip.min.js"));
  await cp(join(root, "vendor/ONSYURI-GPL-2.0.txt"), join(dir, "ONSYURI-GPL-2.0.txt"));
  await cp(join(root, "vendor/wqy-microhei.copyright"), join(dir, "wqy-microhei.copyright"));
  await cp(join(root, "public/favicon.svg"), join(dir, "favicon.svg"));
  if (copyGame) {
    await rm(join(dir, "game"), { recursive: true, force: true });
    await cp(gameDir, join(dir, "game"), { recursive: true });
  }
  const files = [];
  await filesIn(join(dir, "game"), "", files);
  const index = {
    title: "黍琊：醒梦之间",
    gamedir: "/onsyuri/suya",
    savedir: "/onsyuri_save/suya",
    args: ["--enc:utf8", "--width", "1280", "--height", "720"],
    lazyload: true,
    files,
  };
  await writeFile(join(dir, "onsyuri_index.json"), JSON.stringify(index, null, 2));
  return files.length;
}

await writeOnsScript();
const count = await writePage(root, false);
await writePage(dist, true);
console.log(`onscripter page ready, ${count} game files`);
