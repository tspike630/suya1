import manifest from "./voice/manifest.json";
import { useVoiceProvider } from "./audio.js";

const urls = import.meta.glob("./voice/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
});

export function installVoices() {
  const clips = {};
  for (const [key, file] of Object.entries(manifest)) {
    clips[key] = urls[`./voice/${file}`] || "";
  }
  useVoiceProvider(clips);
}
