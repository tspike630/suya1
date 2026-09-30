import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths so the built site works at https://<user>.github.io/<repo>/.
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
