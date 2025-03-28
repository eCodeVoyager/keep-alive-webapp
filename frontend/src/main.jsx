import { createRoot } from "react-dom/client";
import RouterApp from "./router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { WebsiteProvider } from "./contexts/WebsiteContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <UserProvider>
          <WebsiteProvider>
            <SidebarProvider>
              <Toaster position="top-center" reverseOrder={false} />
              <RouterApp />
            </SidebarProvider>
          </WebsiteProvider>
        </UserProvider>
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>
);
