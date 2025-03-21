import { createContext, useState, useEffect } from "react";
import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { routes } from "../router/routes.data";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = () => {
      const token = AuthService.getToken();
      if (token) {
        setAuthToken(token);
        setIsAuthenticated(true);
      }
      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function - sets auth state
  const login = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  // Logout function - clears auth state and redirects to login
  const logout = (redirectTo = routes.login) => {
    AuthService.logout();
    setAuthToken(null);
    setIsAuthenticated(false);

    // Navigate to login page (or specified redirect)
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  // Check if the current user has a specific role
  const hasRole = async (role) => {
    try {
      const response = await AuthService.me();
      if (response?.data && response.data.length > 0) {
        return response.data[0].role === role;
      }
      return false;
    } catch (error) {
      console.error("Error checking role:", error);
      return false;
    }
  };

  // Refresh the access token
  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await AuthService.refreshToken(refreshToken);

      if (response?.data?.accessToken) {
        // Update auth state with new token
        setAuthToken(response.data.accessToken);
        setIsAuthenticated(true);

        // Update cookies with new tokens
        Cookies.set("authToken", response.data.accessToken, { expires: 1 });
        if (response.data.refreshToken) {
          Cookies.set("refreshToken", response.data.refreshToken, {
            expires: 30,
          });
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      return false;
    }
  };

  // Listen for auth:logout events (from token refresh failures)
  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  // Context value
  const contextValue = {
    authToken,
    isAuthenticated,
    authLoading,
    login,
    logout,
    hasRole,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
