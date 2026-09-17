import styles from "./UsageExamples.module.css";

const SNIPPETS = [
  {
    title: "Basic usage — log(message, type)",
    code: `import { log } from "log-colorize";

log("User created", "success");        // ✔ green
log("DB connection lost", "error");    // ✖ red
log("Rate limit at 90%", "warning");   // ⚠ yellow
log("Server started :3000", "info");   // ℹ blue
log("Default is info");                // ℹ (type optional)`,
  },
  {
    title: "Error object support",
    code: `import { log } from "log-colorize";

// Pass an Error instance directly — message + stack prints
try {
  await db.connect();
} catch (err) {
  log(err, "error");
  // ✖ ERROR  src/db.ts:8:5
  //   Error: ECONNREFUSED 127.0.0.1:5432
  //     at connect (src/db.ts:8:5)
  //     at ...
}`,
  },
  {
    title: "configure() — global options",
    code: `import { configure } from "log-colorize";

// Hide paths in production
if (process.env.NODE_ENV === "production") {
  configure({ showPath: false });
}

// Only print warnings + errors (mute info + success)
configure({ level: "warning" });

// Plain text — no colors (for CI pipelines)
configure({ colorsEnabled: false });`,
  },
  {
    title: "Level filter — mute noisy logs",
    code: `import { log, configure } from "log-colorize";

// In staging: only see warnings and errors
configure({ level: "warning" });

log("Cache hit", "success");           // ← MUTED (success < warning)
log("User loaded", "info");            // ← MUTED (info < warning)
log("Rate limit at 90%", "warning");   // ← PRINTS ✓
log("Payment failed", "error");        // ← PRINTS ✓

// Severity order: error > warning > info > success`,
  },
];

export default function UsageExamples() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionNum}>03</span>
        Usage examples
      </h2>

      <div className={styles.grid}>
        {SNIPPETS.map((s) => (
          <div key={s.title} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardDots}>
                <span style={{ background: "#ef4444" }} />
                <span style={{ background: "#f59e0b" }} />
                <span style={{ background: "#22c55e" }} />
              </span>
              <span className={styles.cardTitle}>{s.title}</span>
            </div>
            <pre className={styles.code}><code>{s.code}</code></pre>
          </div>
        ))}
      </div>
    </section>
  );
}
