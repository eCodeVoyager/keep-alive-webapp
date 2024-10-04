import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterApp from "./router";
import { Toaster } from "react-hot-toast";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-center" reverseOrder={false} />
    <RouterApp />
  </StrictMode>
);
