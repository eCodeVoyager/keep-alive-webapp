import { useContext, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { User, Lock, Eye, EyeOff, Save, LucideLoader } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "../components/Shared/Button";
import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";
import UserService from "../services/userService";

const nameValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const UserSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { user, updateUser } = useContext(UserContext);
  const { logout } = useContext(AuthContext);

  const handleNameSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedUser = await UserService.updateName(values.name);
      updateUser(updatedUser);
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Error updating name");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await UserService.changePassword(
        values.currentPassword,
        values.newPassword
      );
      resetForm();
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Error changing password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white text-center mb-6"
        >
          User Settings
        </motion.h2>

        <Formik
          initialValues={{ name: user.name }}
          validationSchema={nameValidationSchema}
          onSubmit={handleNameSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6 mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 placeholder-gray-500"
                  placeholder="Name"
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                {errors.name && touched.name ? (
                  <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                ) : null}
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button type="submit" isLoading={isSubmitting} fullWidth>
                  Update Name
                </Button>
              </motion.div>
            </Form>
          )}
        </Formik>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={passwordValidationSchema}
          onSubmit={handlePasswordSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <Field
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 pr-10 placeholder-gray-500"
                  placeholder="Current Password"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.button>
                {errors.currentPassword && touched.currentPassword ? (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.currentPassword}
                  </div>
                ) : null}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative"
              >
                <Field
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 pr-10 placeholder-gray-500"
                  placeholder="New Password"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.button>
                {errors.newPassword && touched.newPassword ? (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.newPassword}
                  </div>
                ) : null}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
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

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Button type="submit" isLoading={isSubmitting} fullWidth>
                  Change Password
                </Button>
              </motion.div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default UserSettings;
