import React, { useEffect, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Loader } from "lucide-react";
import AuthService from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import { routes } from "../../router/routes.data";
import Cookies from "js-cookie";

const OAuthCallback = () => {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract tokens from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const accessToken =
          searchParams.get("token") || searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const error = searchParams.get("error");

        // Check for error parameter
        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        // Determine provider from pathname
        const pathname = location.pathname;
        const provider = pathname.includes("github") ? "github" : "google";

        if (!accessToken) {
          throw new Error("Authentication tokens not found in the URL");
        }

        // Store tokens
        Cookies.set("authToken", accessToken, { expires: 1 }); // 1 day
        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, { expires: 30 }); // 30 days
        }

        // Set authentication state
        login(accessToken);

        // Get user data using the access token
        const userResponse = await AuthService.me();

        if (userResponse?.data && userResponse.data.length > 0) {
          setUser(userResponse.data[0]);
          setStatus("success");

          // Authentication successful, continue to redirect

          // Redirect after a short delay to show success message
          setTimeout(() => {
            // Check if there was a return_to URL stored
            const returnTo =
              localStorage.getItem("oauth_return_to") || routes.dashboard;
            localStorage.removeItem("oauth_return_to"); // Clean up
            navigate(returnTo);
          }, 1500);
        } else {
          throw new Error("Failed to retrieve user data");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setErrorMessage(error.message || "Authentication failed");
        setStatus("error");

        // Authentication failed, will redirect to login

        // Redirect to login after a delay
        setTimeout(() => {
          navigate(routes.login);
        }, 3000);
      }
    };

    handleCallback();
  }, [location, login, navigate, setUser]);

  return (
    <div className="flex bg-gray-900 justify-center p-4 items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md"
      >
        {status === "loading" && (
          <>
            <h2 className="text-2xl text-white font-bold mb-4">
              Authenticating...
            </h2>
            <div className="flex justify-center">
              <Loader className="h-12 text-green-500 w-12 animate-spin" />
            </div>
            <p className="text-gray-400 mt-4">
              Please wait while we complete your authentication
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle className="h-16 text-green-500 w-16" />
            </motion.div>
            <h2 className="text-2xl text-white font-bold mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-400 mb-4">
              You have successfully signed in.
            </p>
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex justify-center mb-4"
            >
              <XCircle className="h-16 text-red-500 w-16" />
            </motion.div>
            <h2 className="text-2xl text-white font-bold mb-2">
              Authentication Failed
            </h2>
            <div className="flex justify-center items-start mb-6 mt-4">
              <AlertTriangle className="flex-shrink-0 h-5 text-yellow-500 w-5 mr-2 mt-0.5" />
              <p className="text-gray-400 text-left">{errorMessage}</p>
            </div>
            <p className="text-gray-400">Redirecting to login page...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OAuthCallback;
