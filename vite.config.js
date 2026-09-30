import { defineConfig } from "vite";

export default defineConfig({
  // Relative URLs so the site works at https://<user>.github.io/<repo>/.
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.dev.html",
      output: {
        entryFileNames: "assets/game.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames(assetInfo) {
          const name = assetInfo.names?.[0] || assetInfo.name || "";
          if (name.endsWith(".css")) return "assets/game.css";
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  plugins: [
    {
      name: "dev-index",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === "/" || req.url === "/index.html") req.url = "/index.dev.html";
          next();
        });
      },
    },
  ],
});
