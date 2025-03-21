import React, { useContext, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Edit2,
  Check,
  Bell,
  Shield,
  X,
  Trash2,
  AlertTriangle,
  UserX,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Shared/Button";
import { UserContext } from "../../contexts/UserContext";
import { AuthContext } from "../../contexts/AuthContext";
import UserService from "../../services/userService";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes.data";

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password requirements
  const passwordRequirements = [
    {
      id: "length",
      label: "At least 8 characters",
      validate: (password) => password.length >= 8,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter",
      validate: (password) => /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter",
      validate: (password) => /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number",
      validate: (password) => /[0-9]/.test(password),
    },
  ];

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: passwordRequirements.map((req) => ({ ...req, met: false })),
  });

  const handleNameSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedUser = await UserService.updateName(user._id, values.name);
      setUser({ ...user, ...updatedUser.data });
      setIsEditingName(false);
      toast.success("Name updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error updating name");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAlertsToggle = async (emailAlerts) => {
    try {
      const response = await UserService.updateEmailAlerts(
        user._id,
        emailAlerts
      );
      setUser((prevUser) => ({
        ...prevUser,
        website_offline_alert: response.data.website_offline_alert,
      }));
      if (emailAlerts) {
        toast.success("Email alerts enabled");
      } else {
        toast.success("Email alerts disabled");
      }
    } catch (error) {
      setUser((prevUser) => ({
        ...prevUser,
        website_offline_alert: !prevUser.website_offline_alert,
      }));
      toast.error(
        error?.response?.data?.message || "Error updating email preferences"
      );
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await AuthService.change_password({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      resetForm();
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm account deletion");
      return;
    }

    try {
      setIsDeleting(true);
      await UserService.deleteAccount(user._id);

      // Log out user
      logout();

      // Redirect to landing page
      navigate(routes.hero);

      toast.success("Your account has been deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting account");
      setIsDeleting(false);
    }
  };

  // Update password strength when password changes
  const updatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        requirements: passwordRequirements.map((req) => ({
          ...req,
          met: false,
        })),
      });
      return;
    }

    const metrequirements = passwordRequirements.map((req) => ({
      ...req,
      met: req.validate(password),
    }));

    const score = metrequirements.filter((req) => req.met).length;

    setPasswordStrength({
      score,
      requirements: metrequirements,
    });
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-3xl font-bold text-white">User Settings</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDeleteModalOpen(true)}
            className="mt-2 md:mt-0 text-red-500 hover:text-red-400 flex items-center transition-colors"
          >
            <Trash2 className="h-5 w-5 mr-1.5" />
            <span>Delete Account</span>
          </motion.button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Personal Information & Preferences
            </h3>

            <div className="space-y-6">
              {/* Name Field */}
              <Formik
                initialValues={{ name: user?.name || "" }}
                validationSchema={nameValidationSchema}
                onSubmit={handleNameSubmit}
              >
                {({ errors, touched, isSubmitting, values, handleSubmit }) => (
                  <Form>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-400">Name</span>
                      </div>

                      <div className="flex-1 flex items-center justify-end">
                        {isEditingName ? (
                          <div className="flex items-center w-full max-w-xs">
                            <Field
                              id="name"
                              name="name"
                              type="text"
                              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                            />
                            <div className="flex space-x-2 ml-2">
                              <button
                                type="submit"
                                className="text-green-500 hover:text-green-400 focus:outline-none"
                                disabled={isSubmitting}
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditingName(false)}
                                className="text-red-500 hover:text-red-400 focus:outline-none"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="text-white mr-3">
                              {values.name || "Not set"}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingName(true)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-xs mt-1 text-right">
                        {errors.name}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>

              {/* Email Field - Read-only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">Email</span>
                </div>
                <div>
                  <span className="text-white">{user?.email}</span>
                  {user?.isVerified && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">Email Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.website_offline_alert}
                    onChange={(e) => handleEmailAlertsToggle(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Account Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">Account Type</span>
                </div>
                <span className="text-white capitalize">
                  {user?.role || "user"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
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
              {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                // Update password strength when newPassword changes
                React.useEffect(() => {
                  updatePasswordStrength(values.newPassword);
                }, [values.newPassword]);

                return (
                  <Form className="space-y-4">
                    <div className="relative">
                      <label
                        htmlFor="currentPassword"
                        className="block text-gray-400 mb-2"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <Field
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 border border-gray-600"
                          placeholder="Enter current password"
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
                      </div>
                      {errors.currentPassword && touched.currentPassword && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.currentPassword}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-gray-400 mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <Field
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 border border-gray-600"
                          placeholder="Enter new password"
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
                      </div>
                      {errors.newPassword && touched.newPassword && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.newPassword}
                        </div>
                      )}

                      {/* Password strength indicator */}
                      {values.newPassword && (
                        <div className="mt-3">
                          <div className="flex space-x-1 mb-2">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${
                                  i < passwordStrength.score
                                    ? passwordStrength.score === 1
                                      ? "bg-red-500"
                                      : passwordStrength.score === 2
                                      ? "bg-orange-500"
                                      : passwordStrength.score === 3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    : "bg-gray-600"
                                }`}
                              ></div>
                            ))}
                          </div>

                          <div className="text-xs text-gray-400">
                            {passwordStrength.score === 0 && "Very weak"}
                            {passwordStrength.score === 1 && "Weak"}
                            {passwordStrength.score === 2 && "Fair"}
                            {passwordStrength.score === 3 && "Good"}
                            {passwordStrength.score === 4 && "Strong"}
                          </div>

                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                            {passwordStrength.requirements.map((req) => (
                              <div
                                key={req.id}
                                className={`flex items-center ${
                                  req.met ? "text-green-400" : "text-gray-400"
                                }`}
                              >
                                {req.met ? (
                                  <Check className="h-3 w-3 mr-1" />
                                ) : (
                                  <X className="h-3 w-3 mr-1" />
                                )}
                                {req.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-gray-400 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 border border-gray-600"
                          placeholder="Confirm new password"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-white focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      fullWidth
                      disabled={isSubmitting || passwordStrength.score < 2}
                    >
                      Change Password
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">
                  Account Created
                </div>
                <div className="text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Last Updated</div>
                <div className="text-white">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-red-500/20 p-3 rounded-full">
                  <UserX className="h-10 w-10 text-red-500" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white text-center mb-2">
                Delete Account
              </h3>
              <p className="text-gray-400 text-center mb-6">
                This action cannot be undone. All your data, including your
                profile, websites, and logs will be permanently deleted.
              </p>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">
                    To confirm deletion, please type <strong>DELETE</strong> in
                    the confirmation field below.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">
                  Confirmation
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isDeleting || deleteConfirmation !== "DELETE"}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default UserSettings;
