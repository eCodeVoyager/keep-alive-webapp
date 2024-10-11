import { createRoot } from "react-dom/client";
import RouterApp from "./router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { WebsiteProvider } from "./contexts/WebsiteContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <UserProvider>
      <WebsiteProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterApp />
      </WebsiteProvider>
    </UserProvider>
  </AuthProvider>
);
