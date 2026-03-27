import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./shared/styles/scss/_main.scss";
import { AppInit } from "./app/init";

import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppInit />
  </StrictMode>,
);
