import React, { useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";

const ResponsiveLayout = ({ children, className = "" }) => {
  const { sidebar } = useContext(SidebarContext);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${sidebar ? "md:ml-64" : "md:ml-16"} 
        w-full px-4 sm:px-6 lg:px-8 pb-16
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ResponsiveLayout;
