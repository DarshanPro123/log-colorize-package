import type { LogEntry, LogType } from "../types";
import styles from "./ConsolePanel.module.css";

interface Props {
  entries: LogEntry[];
  onClear: () => void;
}

const ICONS: Record<LogType, string> = {
  success: "✔",
  error:   "✖",
  warning: "⚠",
  info:    "ℹ",
};

const LABELS: Record<LogType, string> = {
  success: "SUCCESS",
  error:   "ERROR",
  warning: "WARNING",
  info:    "INFO",
};

export default function ConsolePanel({ entries, onClear }: Props) {
  const time = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionNum}>02</span>
        On-page log panel &nbsp;
        <span className={styles.hint}>(mirror of what appears in DevTools Console)</span>
      </h2>

      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <span className={styles.liveDot} />
            Console Output
            {entries.length > 0 && (
              <span className={styles.count}>{entries.length}</span>
            )}
          </span>
          <button className={styles.clearBtn} onClick={onClear}>
            Clear
          </button>
        </div>

        {/* Entries */}
        <div className={styles.entries}>
          {entries.length === 0 ? (
            <div className={styles.empty}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              No logs yet — click a button above
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.id} className={`${styles.entry} ${styles[`entry_${e.type}`]}`}>
                {/* Icon */}
                <span className={styles.eIcon}>{ICONS[e.type]}</span>

                {/* Body */}
                <span className={styles.eBody}>
                  <span className={styles.eHead}>
                    <span className={styles.eLabel}>{LABELS[e.type]}</span>
                    <span className={styles.eLoc}>{e.file}:{e.line}:{e.col}</span>
                  </span>
                  <span className={styles.eMsg}>{e.message}</span>
                </span>

                {/* Time */}
                <span className={styles.eTime}>{time(e.timestamp)}</span>
              </div>
            ))
          )}
        </div>

        {/* DevTools hint */}
        <div className={styles.devHint}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          The <strong>real</strong> colored output (with ANSI / CSS styles) is in your browser's
          <kbd className={styles.kbd}>F12 → Console</kbd>
        </div>
      </div>
    </section>
  );
}
