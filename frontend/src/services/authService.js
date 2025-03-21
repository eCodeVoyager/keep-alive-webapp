import requests from "./httpRequest";
import Cookies from "js-cookie";

const AuthService = {
  // Regular authentication
  register: async (body) => requests.post("/auth/register", body),

  login: async (body) => requests.post("/auth/login", body),

  // Fetch current user data
  me: async () => requests.get("/auth/me"),

  // Email verification
  send_verification_email: async (body) =>
    requests.post("/auth/verify-email", body),

  verify_email: async (body) => requests.post("/auth/verify-email-otp", body),

  // Password management
  send_forgot_password_otp: async (body) =>
    requests.post("/auth/forgot-password", body),

  verify_forgot_password_otp: async (body) =>
    requests.post("/auth/forgot-password-verify-otp", body),

  forgot_password_set: async (body) =>
    requests.post("/auth/forgot-password-set", body),

  change_password: async (body) => requests.post("/auth/change-password", body),

  // Token management
  refreshToken: async (refreshToken) =>
    requests.post("/auth/refresh-token", { refreshToken }),

  // OAuth methods - redirect to backend auth endpoints
  googleLogin: () => {
    // Store the return_to URL in localStorage to restore after OAuth
    localStorage.setItem("oauth_return_to", window.location.href);
    // Redirect to Google OAuth endpoint
    window.location.href = `${
      import.meta.env.VITE_BACKEND_API_URL
    }/api/v1/auth/google`;
  },

  githubLogin: () => {
    // Store the return_to URL in localStorage to restore after OAuth
    localStorage.setItem("oauth_return_to", window.location.href);
    // Redirect to GitHub OAuth endpoint
    window.location.href = `${
      import.meta.env.VITE_BACKEND_API_URL
    }/api/v1/auth/github`;
  },

  // Process OAuth callback
  processOAuthCallback: async (code, provider) => {
    try {
      // For our implementation, we don't need to call this endpoint
      // as the backend sets cookies directly during the OAuth redirect
      const user = await requests.get("/auth/me");

      if (user?.data) {
        return {
          success: true,
          data: user.data,
        };
      }

      return {
        success: false,
        error: "Failed to retrieve user data",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "OAuth authentication failed",
      };
    }
  },

  // Logout - clear all auth tokens
  logout: async () => {
    try {
      // Call logout endpoint to clear server-side tokens/cookies
      await requests.get("/auth/logout", { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Also clear client-side cookies
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    Cookies.remove("token");

    // Clear any other auth-related data in localStorage
    localStorage.removeItem("oauth_return_to");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!(Cookies.get("authToken") || Cookies.get("token"));
  },

  // Get stored auth token
  getToken: () => {
    return Cookies.get("authToken") || Cookies.get("token");
  },

  // Get refresh token
  getRefreshToken: () => {
    return Cookies.get("refreshToken");
  },
};

export default AuthService;
