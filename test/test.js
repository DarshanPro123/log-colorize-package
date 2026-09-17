#!/usr/bin/env node
/**
 * test/test.js
 *
 * Runs every feature of the rewritten log() API.
 * Build first:  npm run build
 * Then:         node test/test.js
 */
"use strict";

const pkg       = require("../dist/cjs/index.js");
const log       = pkg.log       ?? pkg.default?.log;
const configure = pkg.configure ?? pkg.default?.configure;

// ── 1. All four types ─────────────────────────────────────────────────────────
console.log("\n=== 1. All four types ===\n");

log("User account created",              "success");
log("DB connection refused",             "error");
log("Deprecated endpoint /v1/users",     "warning");
log("HTTP server listening on :3000",    "info");
log("This is the default (info)");                   // no type → info

// ── 2. Error object support ───────────────────────────────────────────────────
console.log("\n=== 2. Error object ===\n");

log(new Error("ECONNREFUSED 127.0.0.1:5432"), "error");

const customErr = new TypeError("Cannot read properties of undefined");
log(customErr, "warning");

// ── 3. configure({ showPath: false }) ────────────────────────────────────────
console.log("\n=== 3. showPath: false ===\n");

configure({ showPath: false });
log("No file path here", "info");
log("Also no path",      "error");
configure({ showPath: true }); // restore

// ── 4. configure({ colorsEnabled: false }) ────────────────────────────────────
console.log("\n=== 4. colorsEnabled: false ===\n");

configure({ colorsEnabled: false });
log("Plain text — no ANSI colors", "success");
log("Plain error — no ANSI colors", "error");
configure({ colorsEnabled: true }); // restore

// ── 5. Level filter ───────────────────────────────────────────────────────────
console.log("\n=== 5. Level filter: configure({ level: 'warning' }) ===\n");
console.log("(success + info should NOT print)\n");

configure({ level: "warning" });
log("This success is MUTED",     "success");   // muted — below threshold
log("This info is MUTED",        "info");      // muted — below threshold
log("This warning PRINTS",       "warning");   // ✓ at threshold
log("This error PRINTS",         "error");     // ✓ above threshold
configure({ level: "success" }); // restore to show-all

// ── 6. Level filter: errors only ─────────────────────────────────────────────
console.log("\n=== 6. Level filter: configure({ level: 'error' }) ===\n");
console.log("(only errors should print)\n");

configure({ level: "error" });
log("Muted success",  "success");
log("Muted info",     "info");
log("Muted warning",  "warning");
log("This error prints!", "error");
configure({ level: "success" }); // restore

// ── 7. Clickable path — check your terminal ───────────────────────────────────
console.log("\n=== 7. Clickable path (path:line:col format) ===\n");
console.log("↓ Ctrl+click the path below in VS Code terminal:\n");
log("Hover over the path — VS Code makes it a link", "info");

// ── Done ─────────────────────────────────────────────────────────────────────
console.log("\n✅  All tests passed.\n");
