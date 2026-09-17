/**
 * log-colorize
 *
 * Single log() function with colored output for Node.js terminal (ANSI)
 * and browser DevTools (%c CSS). Auto-detects environment.
 *
 * Usage:
 *   import { log, configure } from "log-colorize";
 *   log("User saved");              // info (default)
 *   log("Payment failed", "error");
 *   log(new Error("Oops"), "error"); // Error objects handled
 *   configure({ level: "warning" }); // mute info + success
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** The four log types, from lowest to highest severity. */
export type LogType = "success" | "info" | "warning" | "error";

export interface LogConfig {
  /**
   * Minimum severity level to print.
   * Logs below this level are silently discarded.
   *
   * Severity order (lowest → highest): success < info < warning < error
   *
   * Examples:
   *   configure({ level: "warning" }) → prints warning + error only
   *   configure({ level: "error" })   → prints error only
   *   configure({ level: "success" }) → prints everything (default)
   */
  level?: LogType;

  /**
   * Show the caller's file path + line number as a clickable link.
   * VS Code terminal auto-detects "path:line:col" and makes it clickable.
   * Default: true
   */
  showPath?: boolean;

  /**
   * Enable ANSI escape codes (terminal) or %c CSS (browser).
   * Set false for CI pipelines or log files that don't support color.
   * Default: true
   */
  colorsEnabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Severity map  (higher number = more severe)
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY: Record<LogType, number> = {
  success: 1,
  info:    2,
  warning: 3,
  error:   4,
};

// ─────────────────────────────────────────────────────────────────────────────
// Global config
// ─────────────────────────────────────────────────────────────────────────────

let _config: Required<LogConfig> = {
  level:         "success",  // show everything by default
  showPath:      true,
  colorsEnabled: true,
};

/**
 * Set global defaults that apply to every log() call.
 *
 * @example
 * // Hide paths in production
 * if (process.env.NODE_ENV === "production") configure({ showPath: false });
 *
 * // Mute info + success in staging — only show warnings and errors
 * configure({ level: "warning" });
 *
 * // Plain text output for CI pipelines
 * configure({ colorsEnabled: false });
 */
export function configure(options: LogConfig): void {
  _config = { ..._config, ...options };
}

// ─────────────────────────────────────────────────────────────────────────────
// Environment detection
// ─────────────────────────────────────────────────────────────────────────────

/** True only in a real browser — not in Next.js SSR (which stubs process). */
const IS_BROWSER: boolean =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  !(typeof process !== "undefined" && process.versions?.node);

// ─────────────────────────────────────────────────────────────────────────────
// ANSI codes  (Node.js / terminal)
// ─────────────────────────────────────────────────────────────────────────────

const A = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  yellow: "\x1b[33m",
  blue:   "\x1b[34m",
  cyan:   "\x1b[36m",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CSS styles  (browser DevTools)
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  success: "color:#22c55e;font-weight:700;",
  info:    "color:#3b82f6;font-weight:700;",
  warning: "color:#f59e0b;font-weight:700;",
  error:   "color:#ef4444;font-weight:700;",
  path:    "color:#71717a;font-size:0.82em;",
  reset:   "color:inherit;font-weight:normal;",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Level config table
// ─────────────────────────────────────────────────────────────────────────────

type LevelDef = {
  ansi:   string;
  cssKey: keyof typeof C;
  method: "log" | "error" | "warn" | "info";
  label:  string;
};

const LEVELS: Record<LogType, LevelDef> = {
  success: { ansi: A.green,  cssKey: "success", method: "log",   label: "✔ SUCCESS" },
  info:    { ansi: A.blue,   cssKey: "info",    method: "info",  label: "ℹ INFO"    },
  warning: { ansi: A.yellow, cssKey: "warning", method: "warn",  label: "⚠ WARNING" },
  error:   { ansi: A.red,    cssKey: "error",   method: "error", label: "✖ ERROR"   },
};

// ─────────────────────────────────────────────────────────────────────────────
// Stack-trace caller detection
// ─────────────────────────────────────────────────────────────────────────────

interface CallerInfo {
  file: string;
  line: string;
  col:  string;
}

/** Absolute path of this compiled bundle — used to skip our own stack frames. */
function getBundlePath(): string {
  try {
    if (typeof __filename === "string") return __filename.replace(/\\/g, "/");
  } catch { /* ESM */ }
  try {
    // @ts-ignore  — import.meta.url available at ESM runtime
    const u: string = import.meta.url;
    if (u) return u.replace(/^file:\/\//, "").replace(/\\/g, "/");
  } catch { /* ignore */ }
  return "";
}
const _bundlePath = getBundlePath();

const _skipPatterns = [
  /getBundlePath/,
  /getCallerInfo/,
  /\blog\b.*(colory-logger|log-colorize)/,
  /(colory-logger|log-colorize)[/\\]src[/\\]index/,
];

/**
 * Walk the Error stack and return the first frame that does NOT belong to
 * this library. Returns null if detection fails.
 */
function getCallerInfo(): CallerInfo | null {
  try {
    const raw = new Error().stack;
    if (!raw) return null;

    for (const frame of raw.split("\n")) {
      if (!frame.trimStart().startsWith("at ")) continue;

      // Skip frames from our own bundle file
      if (_bundlePath && frame.replace(/\\/g, "/").includes(_bundlePath)) continue;

      // Skip internal helper frames by name
      if (_skipPatterns.some((r) => r.test(frame))) continue;

      // Node.js:  "    at fn (path/file.ts:line:col)"
      //       or  "    at path/file.ts:line:col"
      const m =
        frame.match(/\((.+):(\d+):(\d+)\)$/) ||
        frame.match(/at (.+):(\d+):(\d+)$/);

      if (m) {
        return { file: cleanPath(m[1]), line: m[2], col: m[3] };
      }
    }
  } catch { /* swallow */ }
  return null;
}

/** Strip CWD / browser origin so the path shown is project-relative. */
function cleanPath(raw: string): string {
  let p = raw
    .replace(/^(file:\/\/|webpack-internal:\/\/\/|webpack:\/\/\/?)/, "")
    .replace(/\\/g, "/")
    .replace(/^\?\(project\)\//, ""); // Next.js internal decoration

  const root = (
    typeof process !== "undefined"
      ? process.cwd()
      : typeof window !== "undefined"
        ? window.location.origin
        : ""
  ).replace(/\\/g, "/");

  if (root && p.startsWith(root)) p = p.slice(root.length);
  return p.replace(/^\//, "") || raw;
}

// ─────────────────────────────────────────────────────────────────────────────
// util.inspect  (Node only — pretty-prints objects/arrays in terminal)
// ─────────────────────────────────────────────────────────────────────────────

let _inspect: ((v: unknown, o: { colors: boolean; depth: number }) => string) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _inspect = (require("util") as typeof import("util")).inspect;
} catch { /* browser / edge */ }

// ─────────────────────────────────────────────────────────────────────────────
// Message serialisation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Serialise the log message to a plain string.
 *
 * - string   → as-is
 * - Error    → message  +  stack (full trace, nicely indented)
 * - anything else → util.inspect (Node) or String() (browser)
 */
function serialise(msg: unknown, useColor: boolean): string {
  if (typeof msg === "string") return msg;

  if (msg instanceof Error) {
    // Print the Error message prominently, then the stack below
    const stack = (msg.stack ?? `${msg.name}: ${msg.message}`)
      .split("\n")
      .map((l, i) => (i === 0 ? l : `    ${l}`))
      .join("\n");
    return stack;
  }

  if (_inspect) return _inspect(msg, { colors: useColor, depth: 4 });
  return String(msg);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public log() function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Log a message to the console with color + file:line location.
 *
 * @param message  Text string, Error object, or any value.
 * @param type     Log type: "success" | "info" | "warning" | "error".
 *                 Defaults to "info".
 *
 * @example
 * log("Server started on :3000");           // info (default)
 * log("User created", "success");
 * log("API rate limit at 90%", "warning");
 * log("DB connection refused", "error");
 * log(new Error("Something broke"), "error"); // Error object → message + stack
 */
export function log(message: unknown, type: LogType = "info"): void {
  // ── Level filter ──────────────────────────────────────────────────────────
  if (SEVERITY[type] < SEVERITY[_config.level]) return;

  const def        = LEVELS[type];
  const useColor   = _config.colorsEnabled;
  const text       = serialise(message, useColor && !IS_BROWSER);

  // ── Build location string ─────────────────────────────────────────────────
  //
  // Format: "path/to/file.ts:line:col"
  // → VS Code terminal auto-detects this pattern as a clickable hyperlink.
  //   No brackets needed — the "file:line:col" pattern is enough.
  //
  let loc = "";
  if (_config.showPath) {
    const caller = getCallerInfo();
    if (caller) loc = `${caller.file}:${caller.line}:${caller.col}`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  if (IS_BROWSER) {
    // ── Browser (Chrome DevTools — %c CSS) ───────────────────────────────────
    if (!useColor) {
      // Plain text for environments without DevTools CSS support
      console[def.method]([def.label, loc, text].filter(Boolean).join("  "));
      return;
    }

    if (loc) {
      console[def.method](
        `%c${def.label}  %c${loc}%c\n${text}`,
        C[def.cssKey],
        C.path,
        C.reset,
      );
    } else {
      console[def.method](
        `%c${def.label}%c  ${text}`,
        C[def.cssKey],
        C.reset,
      );
    }

  } else {
    // ── Node.js terminal (ANSI escape codes) ─────────────────────────────────
    const label = useColor
      ? `${def.ansi}${A.bold}${def.label}${A.reset}`
      : def.label;

    // The clickable path: "src/app.ts:12:5"
    // Wrap in dim ANSI so it's less prominent but still readable and clickable.
    const locStr = loc
      ? (useColor ? `  ${A.dim}${loc}${A.reset}` : `  ${loc}`)
      : "";

    const output = `${label}${locStr}\n  ${text}`;

    switch (def.method) {
      case "error": console.error(output); break;
      case "warn":  console.warn(output);  break;
      case "info":  console.info(output);  break;
      default:      console.log(output);   break;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export (namespace)
// ─────────────────────────────────────────────────────────────────────────────

export default { log, configure };
