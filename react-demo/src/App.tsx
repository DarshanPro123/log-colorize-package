import { useState } from "react";
import Header from "./components/Header";
import LogButtons from "./components/LogButtons";
import ConsolePanel from "./components/ConsolePanel";
import UsageExamples from "./components/UsageExamples";
import type { LogEntry } from "./types";

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  function addEntry(entry: LogEntry) {
    setEntries((prev) => [entry, ...prev].slice(0, 50)); // keep last 50
  }

  function clearEntries() {
    setEntries([]);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>
      <Header />
      <LogButtons onAdd={addEntry} />
      <ConsolePanel entries={entries} onClear={clearEntries} />
      <UsageExamples />
    </div>
  );
}
