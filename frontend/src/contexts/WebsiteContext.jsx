import { createContext } from "react";
import { useState } from "react";

export const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [websites, setWebsites] = useState([]);
  const [isApiCalled, setIsApiCalled] = useState(false);
  return (
    <WebsiteContext.Provider
      value={{
        websites,
        setWebsites,
        isApiCalled,
        setIsApiCalled,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};
