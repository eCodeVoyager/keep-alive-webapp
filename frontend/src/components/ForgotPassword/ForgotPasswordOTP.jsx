import React, { useRef, useState, useEffect } from "react";
import { Button } from "../Shared/Button";
import { toast } from "react-hot-toast";
import AuthService from "../../services/authService";

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 30;

const ForgotPasswordOTP = ({ email, onVerified }) => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef(new Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateOTP = (otpArray) => {
    if (otpArray.some((digit) => digit === "")) {
      setError("Please fill all digits");
      return false;
    }
    if (otpArray.some((digit) => isNaN(digit))) {
      setError("Must be numbers only");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e, index) => {
    if (isNaN(e.target.value)) return;

    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    validateOTP(newOtp);

    // Focus next input
    if (e.target.value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = "";
      } else {
        newOtp[index] = "";
      }
      setOtp(newOtp);
      validateOTP(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, OTP_LENGTH)
      .split("");

    if (pasteData.some((x) => isNaN(x))) {
      toast.error("Please paste numbers only");
      return;
    }

    const newOtp = new Array(OTP_LENGTH).fill("");
    pasteData.forEach((value, index) => {
      if (index < OTP_LENGTH) {
        newOtp[index] = value;
      }
    });
    setOtp(newOtp);
    validateOTP(newOtp);

    // Focus last filled input or first empty one
    const focusIndex = Math.min(pasteData.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex].focus();
  };

  const handleResendOTP = async () => {
    try {
      await AuthService.send_forgot_password_otp({ email });
      setResendTimer(RESEND_TIMEOUT);
      toast.success("OTP resent successfully");
      // Focus first input after resend
      inputRefs.current[0].focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateOTP(otp)) return;

    setIsSubmitting(true);
    try {
      await AuthService.verify_forgot_password_otp({
        email,
        otp: otp.join(""),
      });
      onVerified();
      toast.success("OTP verified successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-xl ">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-gray-400 text-center mb-4">
          Enter the 6-digit code sent to {email}
        </p>

        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <div key={index}>
              <input
                type="text"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-xl font-semibold 
                          bg-gray-700 border-2 rounded-lg focus:outline-none text-white
                          border-gray-600 
                          focus:ring-green-500 focus:ring-2 focus:border-transparent
                          transition-colors duration-200`}
                autoFocus={index === 0}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isSubmitting || Boolean(error)}
        >
          Verify OTP
        </Button>

        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-gray-400">Resend OTP in {resendTimer}s</p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-green-500 hover:text-green-400 text-sm font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordOTP;
