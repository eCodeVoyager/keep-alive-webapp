import { useState } from "react";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Shared/Button";
import { toast } from "react-hot-toast";

const EmailVerificationRequired = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    try {
      setIsLoading(true);
      // Simulated API call - replace with your actual service call
      await AuthService.send_verification_email({ email: "user@example.com" });
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

  const handleVerifyOTP = async (otp) => {
    try {
      setIsLoading(true);
      // Simulated API call - replace with your actual service call
      await AuthService.verify_email({ email: "user@example.com", otp });
      toast.success("Email verified successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
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
              We've sent a verification link to your email.
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Resend Verification Email
              </Button>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                I Have a Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Enter Verification Code
            </h2>
            <p className="text-gray-400 mb-8">
              Enter the 6-digit code we sent to your email
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {[...Array(6)].map((_, index) => (
                <motion.input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onChange={(e) => {
                    if (e.target.value && e.target.nextSibling) {
                      e.target.nextSibling.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !e.target.value &&
                      e.target.previousSibling
                    ) {
                      e.target.previousSibling.focus();
                    }
                  }}
                />
              ))}
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleVerifyOTP("123456")} // Replace with actual OTP collection logic
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={isLoading}
              >
                Verify Email
              </Button>

              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Back to Previous Step
              </Button>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendEmail}
                className="text-green-400 hover:text-green-300 font-medium"
                disabled={isLoading}
              >
                Resend
              </button>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EmailVerificationRequired;
