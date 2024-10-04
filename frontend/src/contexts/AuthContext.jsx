import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import props from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("authToken");
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      login(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: props.node.isRequired,
};
