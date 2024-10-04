import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../Shared/Button";
import props from "prop-types";

const ForgotPasswordEmail = ({ onSubmit }) => {
  const EmailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // TODO: Implement API call to send reset email
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      onSubmit(values.email);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={EmailSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Field
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 placeholder-gray-500"
              placeholder="Email"
            />
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            {errors.email && touched.email ? (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            ) : null}
          </motion.div>
          <Button type="submit" isLoading={isSubmitting} fullWidth>
            Send Reset Link
          </Button>
        </Form>
      )}
    </Formik>
  );
};

ForgotPasswordEmail.propTypes = {
  onSubmit: props.func.isRequired,
};
export default ForgotPasswordEmail;
