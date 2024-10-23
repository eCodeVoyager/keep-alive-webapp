import { Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { routes } from "./router/routes.data";
import ForgotPassword from "./pages/ForgotPassword";
import NotFoundPage from "./pages/ErrorPages/NotFoundPage";
import UserSettings from "./pages/UserSettings";
import Feedback from "./pages/Feedback";
import EmailVerificationRequired from "./pages/EmailVerificationRequired";
import LearnMore from "./pages/LearnMore";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsAndConditions";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FaqPage";

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
            path={routes.email_verification_required}
            element={<EmailVerificationRequired />}
          />
          <Route path={routes.contact} element={<ContactPage />} />
          <Route path={routes.faq} element={<FAQPage />} />
          <Route path={routes.learn_more} element={<LearnMore />} />
          <Route path={routes.privacy_policy} element={<PrivacyPolicy />} />

          <Route
            path={routes.tearms_conditions}
            element={<TermsConditions />}
          />
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
