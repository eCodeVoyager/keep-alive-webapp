import { Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { routes } from "../../router/routes.data";
import { UserContext } from "../../contexts/UserContext";
import { AuthContext } from "../../contexts/AuthContext";
import AuthService from "../../services/authService";
import Loader from "../Shared/Loader";

/**
 * ProtectedRoute - Handles authentication and authorization
 *
 * Features:
 * - Verifies authentication status
 * - Ensures user profile is loaded
 * - Redirects to login if not authenticated
 * - Redirects to email verification if email not verified
 * - Supports role-based access control
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, setUser } = useContext(UserContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // First check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          // Clear any stale user data
          setUser(null);
          setLoading(false);
          return;
        }

        // If we have authentication but no user data, fetch it
        if (!user) {
          try {
            const userData = await AuthService.me();

            if (userData?.data?.length > 0) {
              setUser(userData.data[0]);

              // Check email verification
              if (userData.data[0]?.isVerified === false) {
                toast.error("Please verify your email to access this page");
                setLoading(false);
                return;
              }

              // Check role if required
              if (requiredRole && userData.data[0]?.role !== requiredRole) {
                toast.error("You don't have permission to access this page");
                setLoading(false);
                return;
              }

              // User is authenticated and authorized
              setAuthorized(true);
            } else {
              // Something wrong with user data
              throw new Error("Invalid user data");
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            toast.error("Session expired. Please log in again.");
            logout();
          }
        } else {
          // We already have user data, check verification and role
          if (user.isVerified === false) {
            // User email not verified
            setLoading(false);
            return;
          }

          if (requiredRole && user.role !== requiredRole) {
            // User doesn't have required role
            setLoading(false);
            return;
          }

          // User is authenticated and authorized
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        toast.error("Authentication error. Please log in again.");
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [user, setUser, logout, requiredRole]);

  // Listen for auth:logout events (from token refresh failures)
  useEffect(() => {
    const handleLogout = () => {
      logout();
      toast.error("Your session has expired. Please log in again.");
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [logout]);

  if (loading) {
    return <Loader />;
  }

  // If not authenticated, redirect to login
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  // If email not verified, redirect to verification page
  if (user && user.isVerified === false) {
    return <Navigate to={routes.email_verification_required} replace />;
  }

  // If role check fails, show unauthorized page
  if (requiredRole && user && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
