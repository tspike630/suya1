import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { writeOnsScript } from "./onscript.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
await writeOnsScript();
const result = spawnSync("python3", [join(root, "scripts/build-ons-assets.py")], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status || 1);
