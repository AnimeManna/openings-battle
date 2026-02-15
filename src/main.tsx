import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./shared/styles/scss/_main.scss";
import { AppInit } from "./app/init";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppInit />
  </StrictMode>,
);
