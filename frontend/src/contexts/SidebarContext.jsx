import { createContext, useState } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <SidebarContext.Provider value={{ sidebar, toggleSidebar, setSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
