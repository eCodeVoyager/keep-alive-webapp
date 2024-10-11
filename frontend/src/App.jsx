import { Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { routes } from "./router/routes.data";
import ForgotPassword from "./pages/ForgotPassword";
import NotFoundPage from "./components/ErrorPages/NotFoundPage";
import UserSettings from "./pages/UserSettings";
import Feedback from "./pages/Feedback";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route path={routes.hero} element={<Hero />} />
          <Route path={routes.login} element={<Login />} />
          <Route path={routes.register} element={<Register />} />
          <Route path={routes.forgotPassword} element={<ForgotPassword />} />
          <Route
            path={routes.dashboard}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.settings}
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.feedback}
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
