import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Ambient glow blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.badge}>
        <span className={styles.dot} />
        npm package demo
      </div>

      <h1 className={styles.title}>
        log-<span className={styles.accent}>colorize</span>
      </h1>

      <p className={styles.sub}>
        A simple React demo showing every log level in action.
        <br />
        Open <kbd className={styles.kbd}>F12 → Console</kbd> to see styled output.
      </p>

      <div className={styles.install}>
        <span className={styles.installLabel}>Install:</span>
        <code className={styles.installCode}>npm install log-colorize</code>
      </div>
    </header>
  );
}
