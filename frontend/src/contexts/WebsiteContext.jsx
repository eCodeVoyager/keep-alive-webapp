import { createContext } from "react";
import { useState } from "react";

const WebsiteContext = createContext();

const WebsiteProvider = ({ children }) => {
  const [websites, setWebsites] = useState([]);
  return (
    <WebsiteContext.Provider
      value={{
        websites,
        setWebsites,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export { WebsiteContext, WebsiteProvider };
