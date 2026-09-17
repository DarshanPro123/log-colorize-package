# @darshanpro123/log-colorize

<p align="center">
  <img src="./docs/banner.png" alt="log-colorize banner" width="100%" />
</p>

<p align="center">
  <strong>Fast, colorful console logging for Node.js, React, and Next.js projects.</strong><br />
  Automatically prints caller file paths with clickable line numbers, ANSI colors in terminal, and CSS styling in browser DevTools.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@darshanpro123/log-colorize"><img src="https://img.shields.io/npm/v/@darshanpro123/log-colorize.svg" alt="npm version" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@darshanpro123/log-colorize.svg" alt="license" /></a>
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen.svg" alt="zero dependencies" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript" />
</p>

---

## ✨ Features

- 🎨 **Cross-Environment**: ANSI colors in Node.js terminals & `%c` CSS colors in Browser DevTools.
- 📍 **Clickable File Paths**: Automatically detects caller `file:line:col` for instant Ctrl+Click jumping in VS Code.
- ⚡ **Single Clean API**: Simple `log(message, type)` design.
- 🚨 **First-Class Error Support**: Pass Error objects directly (`log(err, "error")`) to log stack traces cleanly.
- 🎛️ **Severity Level Filtering**: Mute lower-severity logs globally (e.g. `configure({ level: "warning" })`).
- ⚡ **Zero Dependencies**: Lightweight, fast, and tree-shakeable.
- 🌐 **Next.js & React Ready**: Works seamlessly in both Server Components (SSR) and Client Components.

---

## 📦 Installation

```bash
npm install @darshanpro123/log-colorize
```

or with yarn / pnpm / bun:

```bash
yarn add @darshanpro123/log-colorize
pnpm add @darshanpro123/log-colorize
bun add @darshanpro123/log-colorize
```

---

## 🚀 Quick Start

```typescript
import { log } from "@darshanpro123/log-colorize";

// Log with different severities (default is "info")
log("User registered successfully", "success");  // ✔ SUCCESS  src/auth.ts:14:1  User registered successfully
log("DB connection timeout", "error");           // ✖ ERROR    src/db.ts:42:1    DB connection timeout
log("API response time > 500ms", "warning");     // ⚠ WARNING  src/api.ts:8:1    API response time > 500ms
log("Server running on port 3000", "info");      // ℹ INFO     src/index.ts:2:1  Server running on port 3000
log("Starting background worker");               // ℹ INFO     src/index.ts:5:1  Starting background worker
```

### CommonJS (Node.js)

```javascript
const { log } = require("@darshanpro123/log-colorize");

log("Server started", "success");
```

---

## 🛠️ Features & Usage

### 1. Passing Error Objects

Pass `Error` instances directly to print formatted error messages and stack traces:

```typescript
try {
  JSON.parse("invalid json");
} catch (err) {
  log(err, "error");
}
// Output:
// ✖ ERROR  src/parser.ts:5:1
//   SyntaxError: Unexpected token 'i', "invalid json" is not valid JSON
//       at JSON.parse (<anonymous>)
//       at parseData (src/parser.ts:3:8)
```

---

### 2. Global Configuration `configure()`

Call `configure()` once at the entry point of your app to customize logging behavior:

```typescript
import { configure } from "@darshanpro123/log-colorize";

configure({
  showPath: false,      // Hide caller file path (useful in production)
  colorsEnabled: false, // Strip ANSI/CSS colors (useful in plain text CI logs)
  level: "warning",     // Severity filter: only logs >= warning will print
});
```

#### Severity Hierarchy (`level` option):

| Level | Printable Types |
| :--- | :--- |
| `"success"` | `success`, `info`, `warning`, `error` (All logs) |
| `"info"` | `info`, `warning`, `error` |
| `"warning"` | `warning`, `error` |
| `"error"` | `error` only |

---

## ⚛️ React & Next.js Examples

### React Component

```tsx
import React from "react";
import { log } from "@darshanpro123/log-colorize";

export function SaveButton() {
  const handleSave = async () => {
    try {
      await api.saveData();
      log("Data saved successfully!", "success");
    } catch (err) {
      log(err, "error");
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Next.js (Server & Client Components)

```tsx
// Server Component / API Route (Node.js ANSI Terminal)
import { log } from "@darshanpro123/log-colorize";

export async function GET() {
  log("Fetching user profile", "info");
  return Response.json({ status: "ok" });
}
```

```tsx
// Client Component (Browser %c CSS DevTools)
"use client";
import { log } from "@darshanpro123/log-colorize";
import { useEffect } from "react";

export default function UserProfile() {
  useEffect(() => {
    log("Component mounted", "info");
  }, []);

  return <div>Profile Page</div>;
}
```

---

## 🛠️ Development & Testing

Run local tests:

```bash
npm run build
node test/test.js
```

Run the React demo:

```bash
cd react-demo
npm run dev
```

---

## 📄 License

[MIT](./LICENSE)
