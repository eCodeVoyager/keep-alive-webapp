import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "../Shared/Button";
import props from "prop-types";

const ForgotPasswordOTP = ({ email, onVerified }) => {
  const OTPSchema = Yup.object().shape({
    otp: Yup.string().length(6, "OTP must be 6 digits").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      onVerified();
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={OTPSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          <p className="text-gray-400 text-center mb-4">
            Enter the 6-digit code sent to {email}
          </p>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Field
              id="otp"
              name="otp"
              type="text"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500"
              placeholder="6-digit OTP"
            />
            {errors.otp && touched.otp ? (
              <div className="text-red-500 text-xs mt-1">{errors.otp}</div>
            ) : null}
          </motion.div>
          <Button type="submit" isLoading={isSubmitting} fullWidth>
            Verify OTP
          </Button>
        </Form>
      )}
    </Formik>
  );
};

ForgotPasswordOTP.propTypes = {
  email: props.string.isRequired,
  onVerified: props.func.isRequired,
};

export default ForgotPasswordOTP;
