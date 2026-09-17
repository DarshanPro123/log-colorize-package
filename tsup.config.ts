import { defineConfig } from "tsup";

export default defineConfig([
  // ── CommonJS build ──────────────────────────────────────────────────────────
  {
    entry: { index: "src/index.ts" },
    format: ["cjs"],
    outDir: "dist/cjs",
    dts: false,             // types emitted separately below
    sourcemap: true,
    clean: true,
    shims: true,            // adds __dirname / __filename shims for ESM<>CJS
    // Keep util lazy-require working — don't bundle Node built-ins
    platform: "neutral",
    target: "es2017",
    treeshake: true,
    minify: false,
    outExtension: () => ({ js: ".js" }),
    esbuildOptions(options) {
      options.footer = {};
    },
  },
  // ── ESM build ───────────────────────────────────────────────────────────────
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    outDir: "dist/esm",
    dts: false,
    sourcemap: true,
    clean: false,
    shims: true,
    platform: "neutral",
    target: "es2017",
    treeshake: true,
    minify: false,
  },
  // ── Type declarations only ──────────────────────────────────────────────────
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    outDir: "dist/types",
    dts: { only: true },
    clean: false,
    async onSuccess() {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const mtsPath = path.resolve("dist/types/index.d.mts");
      const dtsPath = path.resolve("dist/types/index.d.ts");
      if (fs.existsSync(mtsPath)) {
        fs.copyFileSync(mtsPath, dtsPath);
      }
    },
  },
]);

