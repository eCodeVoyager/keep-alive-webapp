import { createContext, useState, useEffect, useCallback } from "react";
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
  // Using useCallback to ensure the function reference remains stable
  const logout = useCallback(
    async (redirectTo = routes.login) => {
      try {
        // First clear all auth cookies and local state
        Cookies.remove("authToken");
        Cookies.remove("refreshToken");
        Cookies.remove("token");

        // Then clear state
        setAuthToken(null);
        setIsAuthenticated(false);

        // Clear any other auth-related data in localStorage
        localStorage.removeItem("oauth_return_to");

        // Navigate AFTER everything else is done
        if (redirectTo) {
          navigate(redirectTo);
        }
      } catch (error) {
        console.error("Logout error:", error);
        // Clear state even if API call fails
        setAuthToken(null);
        setIsAuthenticated(false);

        // Navigate anyway
        if (redirectTo) {
          navigate(redirectTo);
        }
      }
    },
    [navigate]
  );

  // Check if the current user has a specific account type
  const hasAccountType = async (accountType) => {
    try {
      const response = await AuthService.me();
      if (response?.data && response.data.length > 0) {
        return response.data[0].accountType === accountType;
      }
      return false;
    } catch (error) {
      console.error("Error checking account type:", error);
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
  }, [logout]);

  // Context value
  const contextValue = {
    authToken,
    isAuthenticated,
    authLoading,
    login,
    logout,
    hasAccountType,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
