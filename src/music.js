import { useMusicProvider } from "./audio.js";

const urls = import.meta.glob("./music/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
});

export function installMusic() {
  const clips = {};
  for (const [path, url] of Object.entries(urls)) {
    const id = path.split("/").pop().replace(/\.mp3$/, "");
    clips[id] = url;
  }
  useMusicProvider(clips);
}
