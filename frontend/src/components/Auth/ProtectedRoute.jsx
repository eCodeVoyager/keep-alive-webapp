import { Navigate, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import { routes } from "../../router/routes.data";
import { UserContext } from "../../contexts/UserContext";
import AuthService from "../../services/authService";
import { useContext, useEffect, useState } from "react";
import Loader from "../Shared/Loader";

const ProtectedRoute = ({ children }) => {
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true); // State to track loading
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = Cookie.get("authToken");
      if (!token) {
        setLoading(false);
        return; // No token, skip further processing
      }

      try {
        const user = await AuthService.me();
        setUser(user.data[0]);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after checking
      }
    };

    checkAuthentication(); // Call the async function in useEffect
  }, [setUser]);

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={routes.login} replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
