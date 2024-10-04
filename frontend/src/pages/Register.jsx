import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Mail, Lock, Eye, EyeOff, Activity, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../components/Shared/Button";
import { Link } from "react-router-dom";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const KeepAliveRegisterForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Registration successful!");
      // Handle successful registration here
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Activity className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Join Keep-Alive
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Create your account and start monitoring
        </p>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="relative">
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 placeholder-gray-500"
                  placeholder="Full Name"
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                {errors.name && touched.name ? (
                  <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                ) : null}
              </div>

              <div className="relative">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 placeholder-gray-500"
                  placeholder="Email"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                {errors.email && touched.email ? (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 pr-10 placeholder-gray-500"
                  placeholder="Password"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && touched.password ? (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 pr-10 placeholder-gray-500"
                  placeholder="Confirm Password"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.confirmPassword && touched.confirmPassword ? (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </div>
                ) : null}
              </div>

              <Button type="submit" isLoading={isSubmitting} fullWidth>
                Create Account
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {["Google", "GitHub"].map((provider) => (
            <button
              key={provider}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
            >
              {provider === "Google" ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
              )}
              <span className="ml-2">{provider}</span>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-green-400 hover:text-green-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default KeepAliveRegisterForm;
