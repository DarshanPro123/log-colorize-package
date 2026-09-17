import { log, configure } from "log-colorize";
import type { LogEntry, LogType } from "../types";
import styles from "./LogButtons.module.css";

interface Props {
  onAdd: (entry: LogEntry) => void;
}

let _id = 0;
const nextId = () => ++_id;

/* ── Button definitions ────────────────────────────────────────────────── */
const BUTTONS: Array<{
  type:    LogType;
  icon:    string;
  color:   string;
  desc:    string;
  example: string;
}> = [
  {
    type:    "success",
    icon:    "✅",
    color:   "green",
    desc:    "Use after completing an action",
    example: `log("User saved!", "success")`,
  },
  {
    type:    "error",
    icon:    "❌",
    color:   "red",
    desc:    "Use when something fails",
    example: `log("Payment failed", "error")`,
  },
  {
    type:    "warning",
    icon:    "⚠️",
    color:   "yellow",
    desc:    "Use for deprecations or cautions",
    example: `log("Rate limit at 90%", "warning")`,
  },
  {
    type:    "info",
    icon:    "ℹ️",
    color:   "blue",
    desc:    "Use for general status messages",
    example: `log("Server started", "info")`,
  },
];

/* ── Cycling messages per type ──────────────────────────────────────────── */
const MESSAGES: Record<LogType, string[]> = {
  success: [
    "User registered successfully",
    "Payment of $49.99 processed",
    "Email sent to user@example.com",
    "Settings saved",
  ],
  error: [
    "Database connection refused",
    "Auth token expired — please login",
    "Network request timed out after 5s",
    "Invalid form data submitted",
  ],
  warning: [
    "API rate limit at 90% — slow down",
    "Deprecated endpoint /v1/users — use /v2",
    "Cache is 80% full",
    "Large payload detected: 2.4 MB",
  ],
  info: [
    "React app mounted successfully",
    "WebSocket connected to :3001",
    "User navigated to /dashboard",
    "Session refreshed — expires in 1h",
  ],
};

const counters: Record<LogType, number> = {
  success: 0, error: 0, warning: 0, info: 0,
};

/* ── Configure button options ───────────────────────────────────────────── */
const CONFIG_BTNS: Array<{
  id:    string;
  label: string;
  code:  string;
  fire:  () => void;
}> = [
  {
    id:    "btn-error-obj",
    label: "Error object",
    code:  `log(new Error("Oops"), "error")`,
    fire:  () => log(new Error("ECONNREFUSED 127.0.0.1:5432"), "error"),
  },
  {
    id:    "btn-no-path",
    label: "showPath: false",
    code:  `configure({ showPath: false })`,
    fire:  () => {
      configure({ showPath: false });
      log("No file path on this log", "info");
      configure({ showPath: true });
    },
  },
  {
    id:    "btn-level-filter",
    label: "level: 'warning'",
    code:  `configure({ level: "warning" })`,
    fire:  () => {
      configure({ level: "warning" });
      log("This success is MUTED", "success");
      log("This info is MUTED", "info");
      log("This warning PRINTS", "warning");
      log("This error PRINTS", "error");
      configure({ level: "success" });
    },
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */
export default function LogButtons({ onAdd }: Props) {

  function fire(type: LogType) {
    const msg = MESSAGES[type][counters[type] % MESSAGES[type].length];
    counters[type]++;

    // ← real log-colorize call → appears in Chrome DevTools console
    log(msg, type);

    onAdd({
      id:        nextId(),
      type,
      message:   msg,
      file:      "src/components/LogButtons.tsx",
      line:      162,
      col:       5,
      timestamp: new Date(),
    });
  }

  function fireAll() {
    BUTTONS.forEach((b) => fire(b.type));
  }

  function fireConfig(btn: typeof CONFIG_BTNS[number]) {
    btn.fire();
    onAdd({
      id:        nextId(),
      type:      "info",
      message:   `Demo: ${btn.code}`,
      file:      "src/components/LogButtons.tsx",
      line:      170,
      col:       5,
      timestamp: new Date(),
    });
  }

  return (
    <section className={styles.section}>
      {/* ── Section 01 — Log types ─────────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionNum}>01</span>
        log(message, type) — click to fire
      </h2>

      <div className={styles.grid}>
        {BUTTONS.map((b) => (
          <button
            key={b.type}
            id={`btn-${b.type}`}
            className={`${styles.btn} ${styles[`btn_${b.color}`]}`}
            onClick={() => fire(b.type)}
          >
            <span className={styles.btnIcon}>{b.icon}</span>
            <span className={styles.btnLabel}>"{b.type}"</span>
            <span className={styles.btnDesc}>{b.desc}</span>
            <code className={styles.btnCode}>{b.example}</code>
          </button>
        ))}
      </div>

      <button id="btn-fire-all" className={styles.fireAll} onClick={fireAll}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        Fire All 4 Types
      </button>

      {/* ── Section 02 — configure() options ──────────────────────────── */}
      <h2 className={styles.sectionTitle} style={{ marginTop: 32 }}>
        <span className={styles.sectionNum}>02</span>
        configure() options
      </h2>

      <div className={styles.optGrid}>
        {CONFIG_BTNS.map((b) => (
          <button
            key={b.id}
            id={b.id}
            className={styles.optBtn}
            onClick={() => fireConfig(b)}
          >
            <span className={styles.optLabel}>{b.label}</span>
            <code className={styles.optCode}>{b.code}</code>
          </button>
        ))}
      </div>
    </section>
  );
}
