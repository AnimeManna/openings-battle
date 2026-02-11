import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./shared/styles/scss/_main.scss";
import { RouterProvider } from "react-router";
import { router } from "./routes/routes.tsx";
import "./shared/firebase.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
