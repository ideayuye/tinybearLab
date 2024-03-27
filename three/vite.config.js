import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  server: {
    port: 3001,
    host: "0.0.0.0",
  },
});
