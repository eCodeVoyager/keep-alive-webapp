import { Navigate, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import { routes } from "../../router/routes.data";
import props from "prop-types";
const ProtectedRoute = ({ children }) => {
  const token = Cookie.get("authToken");
  const location = useLocation();
  return token ? (
    children
  ) : (
    <Navigate to={routes.login} replace state={{ from: location }} />
  );
};
ProtectedRoute.propTypes = {
  children: props.node.isRequired,
};

export default ProtectedRoute;
