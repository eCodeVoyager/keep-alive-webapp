import { useState, useEffect, useContext } from "react";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Shared/Button";
import { toast } from "react-hot-toast";
import AuthService from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";
import { routes } from "../../router/routes.data";
import VerifyEmailOTP from "../../components/VerifyEmail/VerifyEmailOTP";

const EmailVerificationRequired = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      navigate(routes.login);
    }
    if (user && user.isVerified === true) {
      navigate(routes.dashboard);
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    try {
      setIsLoading(true);
      await AuthService.send_verification_email({ email: user.email });
      toast.success("Verification email sent successfully!");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessVerify = () => {
    navigate(routes.dashboard);
  };
  return (
    <motion.div
      className="min-h-screen bg-gray-900 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-400" />
          </div>
        </motion.div>

        {step === 1 ? (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Verify Your Email
            </h2>
            <p className="text-gray-400 mb-8">
              To continue using Keep-Alive, please verify your email address.
              We've sent a verification code to your email.
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                disabled={isLoading}
                icon={
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                }
              >
                Resend Verification Email
              </Button>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                I Have a Code
              </Button>
            </div>
          </motion.div>
        ) : (
          <VerifyEmailOTP email={user.email} onVerified={handleSuccessVerify} />
        )}
      </div>
    </motion.div>
  );
};

export default EmailVerificationRequired;
