import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { configure } from "log-colorize";

// Hide file paths in production — show them in development
if (import.meta.env.PROD) {
  configure({ showPath: false });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
