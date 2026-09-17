/**
 * examples/basic-usage.ts
 *
 * Demonstrates all log-colorize features.
 * Run from the project root after building:
 *   npx ts-node examples/basic-usage.ts
 *   -- or --
 *   node -r ts-node/register examples/basic-usage.ts
 */

import log, { success, error, warning, info, configure } from "../src/index";

// ── Named exports ─────────────────────────────────────────────────────────────
success("User signed up", { id: 7, name: "Alice" });
error("Payment failed", new Error("Card declined"));
warning("Rate limit approaching", { used: 95, limit: 100 });
info("Server started", { port: 3000, env: "development" });

// ── Default export ────────────────────────────────────────────────────────────
log.success("Order shipped");
log.error("Webhook timed out");
log.warning("Config value missing, using default");
log.info("Cache miss — fetching from DB");

// ── configure() ───────────────────────────────────────────────────────────────
configure({ showLocation: false }); // Disable file path prefix
log.info("Location prefix is now hidden");

configure({ showLocation: true });  // Re-enable
log.info("Location prefix is back");
