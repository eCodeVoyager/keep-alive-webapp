import React, { useContext, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, Eye, EyeOff, Edit2, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "../components/Shared/Button";
import { UserContext } from "../contexts/UserContext";
import UserService from "../services/userService";
import DashboardLayout from "../components/Layouts/DashboardLayout";

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
  const [isEditingName, setIsEditingName] = useState(false);
  const { user, updateUser } = useContext(UserContext);

  const handleNameSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedUser = await UserService.updateName(values.name);
      updateUser(updatedUser);
      setIsEditingName(false);
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
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">User Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <Formik
                initialValues={{ name: user?.name || "" }}
                validationSchema={nameValidationSchema}
                onSubmit={handleNameSubmit}
              >
                {({ errors, touched, isSubmitting, values, handleSubmit }) => (
                  <Form>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      {isEditingName ? (
                        <div className="flex-1 flex items-center">
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            className="flex-1 bg-gray-700 text-white px-2 py-1 rounded"
                          />
                          <button
                            type="submit"
                            className="ml-2 text-green-500 hover:text-green-400 focus:outline-none"
                            disabled={isSubmitting}
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-white">
                            {values.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingName(true)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.name}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>

              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-white">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">
              Change Password
            </h3>
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
                <Form className="space-y-4">
                  <div className="relative">
                    <Field
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                      placeholder="Current Password"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.currentPassword && touched.currentPassword && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.currentPassword}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                      placeholder="New Password"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.newPassword && touched.newPassword && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                      placeholder="Confirm New Password"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <Button type="submit" isLoading={isSubmitting} fullWidth>
                    Change Password
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default UserSettings;
