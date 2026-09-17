export type LogType = "success" | "info" | "warning" | "error";

export interface LogEntry {
  id: number;
  type: LogType;
  message: string;
  file: string;
  line: number;
  col: number;
  timestamp: Date;
}
