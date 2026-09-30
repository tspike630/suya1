import { spriteKey, useSpriteProvider } from "./cast.js";

const spriteUrls = import.meta.glob("./sprites/**/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

export function installSprites() {
  useSpriteProvider((who, face, pose, layer) => {
    const key = spriteKey(who, face, pose, layer);
    const url = key ? spriteUrls[`./sprites/${key}`] : "";
    if (!url) return "";
    const ghost =
      who === "裴望" && face === "overlap"
        ? `<img class="tachie ghost" src="${url}" alt="" />`
        : "";
    return `<img class="tachie" src="${url}" alt="" />${ghost}`;
  });
}
