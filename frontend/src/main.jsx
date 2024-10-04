import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouterApp from "./router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/userContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterApp />
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
