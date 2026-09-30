import { useBackgroundProvider } from "./cast.js";

const backgroundUrls = import.meta.glob("./backgrounds/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

export function installBackgrounds() {
  useBackgroundProvider((id) => backgroundUrls[`./backgrounds/${id}.webp`] || "");
}
