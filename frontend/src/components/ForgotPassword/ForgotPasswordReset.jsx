import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../Shared/Button";
import props from "prop-types";

const ForgotPasswordReset = ({ email, onReset }) => {
  const PasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      console.log(email);
      onReset();
      toast.success("Password reset successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={PasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          <p className="text-gray-400 text-center mb-4">
            Enter your new password to reset your account
          </p>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Field
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 placeholder-gray-500"
              placeholder="New Password"
            />
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            {errors.password && touched.password ? (
              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
            ) : null}
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 placeholder-gray-500"
              placeholder="Confirm New Password"
            />
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            {errors.confirmPassword && touched.confirmPassword ? (
              <div className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </div>
            ) : null}
          </motion.div>
          <Button type="submit" isLoading={isSubmitting} fullWidth>
            Reset Password
          </Button>
        </Form>
      )}
    </Formik>
  );
};

ForgotPasswordReset.propTypes = {
  email: props.string.isRequired,
  onReset: props.func.isRequired,
};

export default ForgotPasswordReset;
