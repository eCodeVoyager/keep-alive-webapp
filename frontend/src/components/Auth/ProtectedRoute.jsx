import { Navigate, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import { routes } from "../../router/routes.data";
import { UserContext } from "../../contexts/UserContext";
import AuthService from "../../services/authService";
import { useContext, useEffect, useState } from "react";
import Loader from "../Shared/Loader";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = Cookie.get("authToken");
      if (!token) {
        setLoading(false);
        navigate(routes.login);
        return;
      }

      try {
        const user = await AuthService.me();
        setUser(user.data[0]);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        Cookie.remove("authToken");
        setIsAuthenticated(false);
        navigate(routes.login);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
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
