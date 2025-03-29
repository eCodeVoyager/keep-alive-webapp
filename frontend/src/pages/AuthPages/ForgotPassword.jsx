import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../../components/Shared/Logo";
import ForgotPasswordEmail from "../../components/ForgotPassword/ForgotPasswordEmail";
import ForgotPasswordOTP from "../../components/ForgotPassword/ForgotPasswordOTP";
import ForgotPasswordReset from "../../components/ForgotPassword/ForgotPasswordReset";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/Shared/SEO";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (submittedEmail) => {
    setEmail(submittedEmail);
    setStep(2);
  };

  const handleOTPVerified = () => {
    setStep(3);
  };

  const handlePasswordReset = () => {
    navigate("/login");
  };

  return (
    <>
      <SEO
        title="Reset Your Password"
        description="Forgot your Server password? Reset it securely with our step-by-step process. We'll help you regain access to your account."
        keywords="forgot password, reset password, password recovery, Server password reset, account recovery"
      />
      <motion.div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center justify-center mb-8"
          >
            <Logo />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white text-center mb-2"
          >
            Forgot Password
          </motion.h2>

          {step === 1 && <ForgotPasswordEmail onSubmit={handleEmailSubmit} />}
          {step === 2 && (
            <ForgotPasswordOTP email={email} onVerified={handleOTPVerified} />
          )}
          {step === 3 && (
            <ForgotPasswordReset email={email} onReset={handlePasswordReset} />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ForgotPassword;
