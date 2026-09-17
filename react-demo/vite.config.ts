import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point directly at the compiled ESM bundle in the parent package.
      // This lets Vite resolve "colory-logger" without needing it published to npm.
      "colory-logger": path.resolve(import.meta.dirname, "../dist/esm/index.mjs"),
    },
  },
});
