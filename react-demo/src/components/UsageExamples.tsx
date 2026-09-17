import styles from "./UsageExamples.module.css";

const SNIPPETS = [
  {
    title: "Basic usage — log(message, type)",
    code: `import { log } from "colory-logger";

log("User created", "success");        // ✔ green
log("DB connection lost", "error");    // ✖ red
log("Rate limit at 80%", "warning");   // ⚠ yellow
log("Server started on 3000", "info");  // ℹ blue
log("Processing payment...");          // ℹ defaults to info`,
  },
  {
    title: "Passing Error Objects",
    code: `import { log } from "colory-logger";

try {
  throw new Error("ECONNREFUSED 127.0.0.1:5432");
} catch (err) {
  log(err, "error");   // ✖ prints error.message + full stack trace!
}`,
  },
  {
    title: "Global Configuration",
    code: `import { configure } from "colory-logger";

// Hide file path prefix everywhere (useful in production)
configure({ showPath: false });

// Mute lower-severity logs globally
configure({ level: "warning" }); // only warning + error will print!`,
  },
  {
    title: "Next.js & React Integration",
    code: `// Works in both Next.js Server Components (ANSI) & Client Components (%c CSS)
import { log, configure } from "colory-logger";

if (process.env.NODE_ENV === "production") {
  configure({ showPath: false });
}

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
