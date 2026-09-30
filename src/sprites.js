import { prepareSprite, spriteKey, useSpriteProvider } from "./cast.js";

const rawSprites = import.meta.glob("./sprites/**/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
});

export function installSprites() {
  useSpriteProvider((who, face, pose, layer, slot) => {
    const key = spriteKey(who, face, pose);
    if (!key) return "";
    const svg = rawSprites[`./sprites/${key}`];
    if (!svg) return "";
    return prepareSprite(svg, who, layer, slot);
  });
}
