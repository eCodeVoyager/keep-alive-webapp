import React, { useContext, useState, useEffect } from "react";
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
  Calendar,
  Clock,
  ClipboardCopy,
  RefreshCw,
  KeyRound,
  Send,
  AlertCircle,
  Smartphone,
  Globe,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Shared/Button";
import { UserContext } from "../../contexts/UserContext";
import { AuthContext } from "../../contexts/AuthContext";
import { WebsiteContext } from "../../contexts/WebsiteContext";
import UserService from "../../services/userService";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import AuthService from "../../services/authService";
import ServerService from "../../services/serverService";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes.data";
import StatusBadge from "../../components/Dashboard/StatusBadge";

// Add API endpoints available based on the API documentation
const API_FEATURES = {
  GET_PROFILE: true,
  UPDATE_PROFILE: true,
  CHANGE_PASSWORD: true,
  DELETE_ACCOUNT: true,
  UPDATE_EMAIL_PREFERENCES: true,
  EMAIL_VERIFICATION: true,
  REGENERATE_API_KEY: true,
  PER_WEBSITE_NOTIFICATIONS: true,
};

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
  // const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isRegeneratingApiKey, setIsRegeneratingApiKey] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [notificationChannels, setNotificationChannels] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [websiteNotifications, setWebsiteNotifications] = useState([]);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(false);

  const { user, setUser } = useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const { websites, setWebsites } = useContext(WebsiteContext);
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
    if (!API_FEATURES.UPDATE_PROFILE) {
      toast.error("This feature is currently unavailable");
      setSubmitting(false);
      return;
    }

    try {
      const updatedUser = await UserService.updateName(user._id, values.name);
      setUser({ ...user, ...updatedUser.data });
      setIsEditingName(false);
      toast.success("Name updated successfully");
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error(error?.response?.data?.message || "Error updating name");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAlertsToggle = async (emailAlerts) => {
    if (!API_FEATURES.UPDATE_EMAIL_PREFERENCES) {
      toast.error("This feature is currently unavailable");
      return;
    }

    try {
      // Optimistically update UI
      setUser((prevUser) => ({
        ...prevUser,
        website_offline_alert: emailAlerts,
      }));

      const response = await UserService.updateEmailAlerts(
        user._id,
        emailAlerts
      );

      // Confirm with data from server
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
      // Revert on error
      setUser((prevUser) => ({
        ...prevUser,
        website_offline_alert: !emailAlerts,
      }));
      toast.error(
        error?.response?.data?.message || "Error updating email preferences"
      );
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!API_FEATURES.CHANGE_PASSWORD) {
      toast.error("This feature is currently unavailable");
      setSubmitting(false);
      return;
    }

    try {
      await AuthService.change_password({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      resetForm();

      // Reset password strength indicator
      setPasswordStrength({
        score: 0,
        requirements: passwordRequirements.map((req) => ({
          ...req,
          met: false,
        })),
      });

      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!API_FEATURES.DELETE_ACCOUNT) {
      toast.error("This feature is currently unavailable");
      return;
    }

    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm account deletion");
      return;
    }

    try {
      setIsDeleting(true);
      // Call the delete account API
      await UserService.deleteAccount(user._id);

      // Success - show toast before navigation
      toast.success("Your account has been deleted");

      // Log out user and clean up
      setTimeout(() => {
        // Log out user
        logout();
        // Redirect to landing page
        navigate(routes.hero);
      }, 1000); // Small delay to show the toast
    } catch (error) {
      console.error("Error deleting account:", error);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Regenerate API key
  const handleRegenerateApiKey = async () => {
    if (!API_FEATURES.REGENERATE_API_KEY) {
      toast.error("This feature is currently unavailable");
      return;
    }

    try {
      setIsRegeneratingApiKey(true);
      // Call the API to regenerate key
      const response = await UserService.regenerateApiKey(user._id);

      // Update user in context
      setUser({
        ...user,
        apiKey: response.data.apiKey,
      });

      toast.success("API key regenerated successfully");
    } catch (error) {
      console.error("Error regenerating API key:", error);
      toast.error(
        error?.response?.data?.message || "Error regenerating API key"
      );
    } finally {
      setIsRegeneratingApiKey(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!API_FEATURES.EMAIL_VERIFICATION) {
      toast.error("This feature is currently unavailable");
      return;
    }

    try {
      setIsResendingVerification(true);
      await AuthService.send_verification_email({ email: user.email });
      toast.success("Verification email sent successfully");
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error(
        error?.response?.data?.message || "Error sending verification email"
      );
    } finally {
      setIsResendingVerification(false);
    }
  };

  // Update notification channel
  const handleNotificationChannelToggle = async (channel, enabled) => {
    try {
      // Optimistically update UI
      setNotificationChannels((prev) => ({
        ...prev,
        [channel]: enabled,
      }));

      // This would be an API call in production
      // await UserService.updateNotificationChannel(user._id, { channel, enabled });

      toast.success(
        `${channel.charAt(0).toUpperCase() + channel.slice(1)} notifications ${
          enabled ? "enabled" : "disabled"
        }`
      );
    } catch (error) {
      // Revert on error
      setNotificationChannels((prev) => ({
        ...prev,
        [channel]: !enabled,
      }));

      toast.error(`Error updating notification preferences`);
    }
  };

  // Update website notification settings
  const handleWebsiteNotificationToggle = async (websiteId, enabled) => {
    if (!API_FEATURES.PER_WEBSITE_NOTIFICATIONS) {
      toast.error("This feature is currently unavailable");
      return;
    }

    try {
      // Find the website in the list
      const updatedWebsites = websiteNotifications.map((site) =>
        site._id === websiteId ? { ...site, notify_offline: enabled } : site
      );

      // Optimistically update UI
      setWebsiteNotifications(updatedWebsites);

      // Update the website notification setting
      await ServerService.updateServer(websiteId, { notify_offline: enabled });

      toast.success(
        `Notifications ${enabled ? "enabled" : "disabled"} for website`
      );
    } catch (error) {
      // Revert on error
      setWebsiteNotifications(
        websiteNotifications.map((site) =>
          site._id === websiteId ? { ...site, notify_offline: !enabled } : site
        )
      );

      toast.error(`Error updating website notification settings`);
    }
  };

  // Fetch user profile and websites on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);

      try {
        // Fetch user profile if needed
        if (user?._id && API_FEATURES.GET_PROFILE) {
          const userResponse = await UserService.getProfile(user._id);
          if (userResponse?.data) {
            setUser(userResponse.data);
          }
        }

        // Fetch websites for notification settings
        if (API_FEATURES.PER_WEBSITE_NOTIFICATIONS) {
          setIsLoadingWebsites(true);
          try {
            if (!websites || websites.length === 0) {
              const websitesResponse = await ServerService.getAllServers();
              if (websitesResponse?.data?.docs) {
                setWebsites(websitesResponse.data.docs);
                setWebsiteNotifications(websitesResponse.data.docs);
              }
            } else {
              setWebsiteNotifications(websites);
            }
          } catch (error) {
            console.error("Error fetching websites:", error);
          } finally {
            setIsLoadingWebsites(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id, setUser, setWebsites, websites]);

  // Tab items for navigation
  const tabItems = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API", icon: KeyRound, premium: true },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="flex flex-col justify-between items-start mb-6 md:flex-row md:items-center">
          <h2 className="text-2xl text-white font-bold md:text-3xl">
            User Settings
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex text-red-500 hover:text-red-400 items-center md:mt-0 mt-2 transition-colors"
          >
            <Trash2 className="h-5 w-5 mr-1.5" />
            <span>Delete Account</span>
          </motion.button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6">
          <div className="flex flex-wrap border-b border-gray-700 -mb-px">
            {tabItems.map(
              (item) =>
                // Hide premium tabs for non-premium users
                (!item.premium || user?.role === "premium") && (
                  <button
                    key={item.id}
                    className={`inline-flex items-center px-4 py-3 mr-4 text-sm font-medium border-b-2 rounded-t-lg ${
                      activeTab === item.id
                        ? "text-green-400 border-green-400"
                        : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </button>
                )
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <>
              {/* Personal Information */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
              >
                <h3 className="text-white text-xl font-semibold mb-6">
                  Personal Information
                </h3>

                <div className="space-y-6">
                  {/* Name Field */}
                  <Formik
                    initialValues={{ name: user?.name || "" }}
                    validationSchema={nameValidationSchema}
                    onSubmit={handleNameSubmit}
                  >
                    {({
                      errors,
                      touched,
                      isSubmitting,
                      values,
                      // handleSubmit,
                    }) => (
                      <Form>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <User className="h-5 text-gray-400 w-5" />
                            <span className="text-gray-400">Name</span>
                          </div>

                          <div className="flex flex-1 justify-end items-center">
                            {isEditingName ? (
                              <div className="flex w-full items-center max-w-xs">
                                <Field
                                  id="name"
                                  name="name"
                                  type="text"
                                  className="flex-1 bg-gray-700 border border-gray-600 rounded text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 px-3 py-2"
                                />
                                <div className="flex ml-2 space-x-2">
                                  <button
                                    type="submit"
                                    className="text-green-500 focus:outline-none hover:text-green-400"
                                    disabled={isSubmitting}
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsEditingName(false)}
                                    className="text-red-500 focus:outline-none hover:text-red-400"
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
                          <div className="text-red-500 text-right text-xs mt-1">
                            {errors.name}
                          </div>
                        )}
                      </Form>
                    )}
                  </Formik>

                  {/* Email Field - Read-only */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 text-gray-400 w-5" />
                      <span className="text-gray-400">Email</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white mr-2">{user?.email}</span>
                      {user?.isVerified ? (
                        <span className="bg-green-500/20 rounded-full text-green-400 text-xs font-medium inline-flex items-center px-2 py-0.5">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <div className="flex items-center">
                          <span className="bg-yellow-500/20 rounded-full text-xs text-yellow-400 font-medium inline-flex items-center mr-2 px-2 py-0.5">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </span>
                          <button
                            onClick={handleResendVerification}
                            disabled={isResendingVerification}
                            className="flex text-green-400 text-xs hover:text-green-300 items-center"
                          >
                            {isResendingVerification ? (
                              <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <Send className="h-3 w-3 mr-1" />
                            )}
                            Resend
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 text-gray-400 w-5" />
                      <span className="text-gray-400">Account Type</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white capitalize mr-2">
                        {user?.role || "free"}
                      </span>
                      {user?.role === "premium" ? (
                        <span className="bg-gradient-to-r rounded-full text-black text-xs font-semibold from-yellow-300 px-2 py-0.5 to-yellow-500">
                          PREMIUM
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate("/plans")}
                          className="bg-gradient-to-r rounded-full text-white text-xs font-semibold from-green-500 px-2 py-0.5 to-blue-500"
                        >
                          UPGRADE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Account Information */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
              >
                <h3 className="text-white text-xl font-semibold mb-6">
                  Account Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="bg-gray-700 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 text-gray-400 w-5 mr-2" />
                      <div className="text-gray-400 text-sm">
                        Account Created
                      </div>
                    </div>
                    <div className="text-white">
                      {formatDate(user?.createdAt)}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 text-gray-400 w-5 mr-2" />
                      <div className="text-gray-400 text-sm">Last Updated</div>
                    </div>
                    <div className="text-white">
                      {formatDate(user?.updatedAt)}
                    </div>
                  </div>

                  {user?.role === "free" && (
                    <div className="bg-gray-700 p-4 rounded-xl md:col-span-2">
                      <div className="flex items-center mb-3">
                        <Shield className="h-5 text-gray-400 w-5 mr-2" />
                        <div className="text-gray-400 text-sm">
                          Account Limits
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">
                            Websites
                          </div>
                          <div className="text-white font-medium">2 max</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">
                            Ping Interval
                          </div>
                          <div className="text-white font-medium">15 min</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">
                            History
                          </div>
                          <div className="text-white font-medium">24 hours</div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-4">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => navigate("/plans")}
                        >
                          Upgrade to Premium
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
            >
              <h3 className="text-white text-xl font-semibold mb-6">
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
                {({ errors, touched, isSubmitting, values }) => {
                  // Update password strength when newPassword changes
                  React.useEffect(() => {
                    updatePasswordStrength(values.newPassword);
                  }, [values.newPassword]);

                  return (
                    <Form className="space-y-4">
                      <div className="relative">
                        <label
                          htmlFor="currentPassword"
                          className="text-gray-400 block mb-2"
                        >
                          Current Password
                        </label>
                        <div className="relative">
                          <Field
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            className="bg-gray-700 border border-gray-600 rounded text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 px-4 py-2"
                            placeholder="Enter current password"
                          />
                          <Lock className="h-5 text-gray-400 w-5 absolute left-3 top-2.5" />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="text-gray-400 absolute focus:outline-none hover:text-white right-3 top-2.5"
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
                          className="text-gray-400 block mb-2"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <Field
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            className="bg-gray-700 border border-gray-600 rounded text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 px-4 py-2"
                            placeholder="Enter new password"
                          />
                          <Lock className="h-5 text-gray-400 w-5 absolute left-3 top-2.5" />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-gray-400 absolute focus:outline-none hover:text-white right-3 top-2.5"
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
                            <div className="flex mb-2 space-x-1">
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

                            <div className="text-gray-400 text-xs">
                              {passwordStrength.score === 0 && "Very weak"}
                              {passwordStrength.score === 1 && "Weak"}
                              {passwordStrength.score === 2 && "Fair"}
                              {passwordStrength.score === 3 && "Good"}
                              {passwordStrength.score === 4 && "Strong"}
                            </div>

                            <div className="grid grid-cols-1 text-xs gap-1 mt-2 sm:grid-cols-2">
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
                          className="text-gray-400 block mb-2"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="bg-gray-700 border border-gray-600 rounded text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 px-4 py-2"
                            placeholder="Confirm new password"
                          />
                          <Lock className="h-5 text-gray-400 w-5 absolute left-3 top-2.5" />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="text-gray-400 absolute focus:outline-none hover:text-white right-3 top-2.5"
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
                        disabled={isSubmitting || passwordStrength.score < 2}
                      >
                        Change Password
                      </Button>
                    </Form>
                  );
                }}
              </Formik>

              {/* Login Security - Two-factor authentication (future feature) */}
              <div className="border-gray-700 border-t mt-8 pt-8">
                <h3 className="text-white text-xl font-semibold mb-6">
                  Login Security
                </h3>

                <div className="flex justify-between items-center py-3">
                  <div>
                    <h4 className="text-white font-medium">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      toast.success("This feature is coming soon!")
                    }
                  >
                    Configure
                  </Button>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div>
                    <h4 className="text-white font-medium">
                      Recent Login Activity
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Review your recent account access
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      toast.success("This feature is coming soon!")
                    }
                  >
                    View
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <>
              {/* Global Notification Settings */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
              >
                <h3 className="text-white text-xl font-semibold mb-6">
                  Notification Channels
                </h3>

                <div className="space-y-4">
                  {/* Email Alerts */}
                  <div className="flex border-b border-gray-700 justify-between items-center py-2">
                    <div className="flex items-center">
                      <Mail className="h-5 text-gray-400 w-5 mr-3" />
                      <div>
                        <h4 className="text-white font-medium">
                          Email Notifications
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Receive alerts via email
                        </p>
                      </div>
                    </div>
                    <label className="cursor-pointer inline-flex items-center relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={notificationChannels.email}
                        onChange={(e) =>
                          handleNotificationChannelToggle(
                            "email",
                            e.target.checked
                          )
                        }
                      />
                        <div className="bg-gray-700 h-6 rounded-full w-11 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </div>

                  {/* Push Notifications */}
                  <div className="flex border-b border-gray-700 justify-between items-center py-2">
                    <div className="flex items-center">
                      <Bell className="h-5 text-gray-400 w-5 mr-3" />
                      <div>
                        <h4 className="text-white font-medium">
                          Push Notifications
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Receive alerts in your browser
                        </p>
                      </div>
                    </div>
                    <label className="cursor-pointer inline-flex items-center relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={notificationChannels.push}
                        onChange={(e) =>
                          handleNotificationChannelToggle(
                            "push",
                            e.target.checked
                          )
                        }
                      />
                      <div className="bg-gray-700 h-6 rounded-full w-11 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <Smartphone className="h-5 text-gray-400 w-5 mr-3" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-white font-medium">
                            SMS Notifications
                          </h4>
                          {user?.role !== "premium" && (
                            <span className="bg-gradient-to-r rounded-full text-white text-xs font-semibold from-green-500 ml-2 px-2 py-0.5 to-blue-500">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          Receive alerts via text message
                        </p>
                      </div>
                    </div>
                    <label className="cursor-pointer inline-flex items-center relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        disabled={user?.role !== "premium"}
                        checked={notificationChannels.sms}
                        onChange={(e) =>
                          handleNotificationChannelToggle(
                            "sms",
                            e.target.checked
                          )
                        }
                      />
                      <div
                        className={`w-11 h-6 ${
                          user?.role !== "premium"
                            ? "bg-gray-800 cursor-not-allowed"
                            : "bg-gray-700"
                        } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600`}
                      ></div>
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Per-Website Notification Settings */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-semibold">
                    Website Notifications
                  </h3>
                  {websiteNotifications.length > 0 && (
                    <button
                      onClick={() => {
                        // Set all to true
                        const allEnabled = websiteNotifications.every(
                          (site) => site.notify_offline
                        );

                        // Toggle all websites (if all enabled, disable all; otherwise enable all)
                        websiteNotifications.forEach((site) =>
                          handleWebsiteNotificationToggle(site._id, !allEnabled)
                        );
                      }}
                      className="flex text-gray-400 text-sm hover:text-white items-center"
                    >
                      {websiteNotifications.every((site) => site.notify_offline)
                        ? "Disable All"
                        : "Enable All"}
                    </button>
                  )}
                </div>

                {isLoadingWebsites ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 text-green-500 w-8 animate-spin" />
                  </div>
                ) : websiteNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="h-12 text-gray-600 w-12 mb-4 mx-auto" />
                    <p className="text-gray-400">No websites added yet</p>
                    <Button
                      className="mt-4"
                      size="sm"
                      onClick={() => navigate(routes.dashboard)}
                    >
                      Add Website
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {websiteNotifications.map((website) => (
                      <div
                        key={website._id}
                        className="bg-gray-700 p-4 rounded-xl"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Globe className="flex-shrink-0 h-5 text-gray-400 w-5 mr-3" />
                            <div className="overflow-hidden">
                              <div className="flex items-center">
                                <h4 className="text-white font-medium max-w-xs truncate">
                                  {new URL(website.url).hostname}
                                </h4>
                                <StatusBadge
                                  status={website.status}
                                  className="ml-2"
                                  size="sm"
                                />
                              </div>
                              <p className="text-gray-400 text-sm max-w-xs truncate">
                                {website.url}
                              </p>
                            </div>
                          </div>
                          <label className="cursor-pointer inline-flex items-center relative">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={website.notify_offline}
                              onChange={(e) =>
                                handleWebsiteNotificationToggle(
                                  website._id,
                                  e.target.checked
                                )
                              }
                            />
                            <div className="bg-gray-800 h-6 rounded-full w-11 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Notification History */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-semibold">
                    Notification History
                  </h3>
                  <button
                    className="text-gray-400 text-sm hover:text-white"
                    onClick={() => toast.success("History refreshed")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-center py-8">
                  <MessageSquare className="h-12 text-gray-600 w-12 mb-4 mx-auto" />
                  <p className="text-gray-400">No recent notifications</p>
                </div>
              </motion.div>
            </>
          )}

          {/* API Tab (Premium users only) */}
          {activeTab === "api" && user?.role === "premium" && (
            <>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
              >
                <h3 className="text-white text-xl font-semibold mb-6">
                  API Access
                </h3>

                <div className="space-y-6">
                  <div className="bg-gray-700 p-4 rounded-xl">
                    <h4 className="text-white font-medium mb-4">
                      Your API Key
                    </h4>
                    <div className="flex flex-col justify-between gap-4 items-start md:flex-row md:items-center">
                      <div className="bg-gray-800 p-3 rounded text-gray-300 text-sm font-mono max-w-full overflow-x-auto">
                        <code>
                          {user?.apiKey || "X-API-KEY-XXXXX-XXXXX-XXXXX-XXXXX"}
                        </code>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => {
                            if (user?.apiKey) {
                              navigator.clipboard.writeText(user.apiKey);
                              toast.success("API Key copied to clipboard");
                            }
                          }}
                          className="bg-gray-600 p-2 rounded text-white hover:bg-gray-500 transition-colors"
                          title="Copy API Key"
                        >
                          <ClipboardCopy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleRegenerateApiKey}
                          disabled={isRegeneratingApiKey}
                          className="flex bg-gray-600 p-2 rounded text-white hover:bg-gray-500 items-center transition-colors"
                          title="Regenerate API Key"
                        >
                          {isRegeneratingApiKey ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : (
                            <RefreshCw className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-4">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      Keep your API key secret. Regenerating will invalidate
                      your previous key.
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-xl">
                    <h4 className="text-white font-medium mb-4">API Usage</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Monthly Quota</span>
                          <span className="text-white">
                            {user?.apiUsage?.current || 0} /{" "}
                            {user?.apiUsage?.limit || 10000} requests
                          </span>
                        </div>
                        <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-full"
                            style={{
                              width: `${
                                user?.apiUsage?.current
                                  ? (user.apiUsage.current /
                                      user.apiUsage.limit) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">
                          Rate Limit
                        </span>
                        <span className="text-sm text-white">
                          100 requests per minute
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-semibold">
                    API Documentation
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => window.open("/api/docs", "_blank")}
                  >
                    View Full Documentation
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-xl">
                    <h4 className="text-white font-medium mb-2">
                      Authentication
                    </h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Add your API key to all requests using the{" "}
                      <code className="bg-gray-800 rounded text-xs px-1">
                        X-API-KEY
                      </code>{" "}
                      header.
                    </p>
                    <div className="bg-gray-800 p-3 rounded text-gray-300 text-xs font-mono overflow-x-auto">
                      <pre>
                        curl -H "X-API-KEY: your-api-key"
                        https://api.keep-alive.com/api/v2/websites
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-xl">
                    <h4 className="text-white font-medium mb-2">
                      Common Endpoints
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <code className="bg-gray-800 rounded text-green-400 text-xs min-w-[90px] px-2 py-1">
                          GET
                        </code>
                        <div className="ml-2">
                          <div className="text-sm text-white font-mono">
                            /websites/me
                          </div>
                          <p className="text-gray-400 text-xs">
                            Get all your websites
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <code className="bg-gray-800 rounded text-blue-400 text-xs min-w-[90px] px-2 py-1">
                          POST
                        </code>
                        <div className="ml-2">
                          <div className="text-sm text-white font-mono">
                            /websites
                          </div>
                          <p className="text-gray-400 text-xs">
                            Add a new website
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <code className="bg-gray-800 rounded text-xs text-yellow-400 min-w-[90px] px-2 py-1">
                          GET
                        </code>
                        <div className="ml-2">
                          <div className="text-sm text-white font-mono">
                            /websites/{"{id}"}/stats
                          </div>
                          <p className="text-gray-400 text-xs">
                            Get website statistics
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex bg-black/50 justify-center p-4 fixed inset-0 items-center z-50"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-red-500/20 p-3 rounded-full">
                  <UserX className="h-10 text-red-500 w-10" />
                </div>
              </div>

              <h3 className="text-center text-white text-xl font-bold mb-2">
                Delete Account
              </h3>
              <p className="text-center text-gray-400 mb-6">
                This action cannot be undone. All your data, including your
                profile, websites, and logs will be permanently deleted.
              </p>

              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="flex-shrink-0 h-5 text-red-500 w-5 mr-2 mt-0.5" />
                  <p className="text-red-400 text-sm">
                    To confirm deletion, please type <strong>DELETE</strong> in
                    the confirmation field below.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-400 text-sm block mb-2">
                  Confirmation
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="bg-gray-700 border border-gray-600 rounded text-white w-full focus:outline-none focus:ring-2 focus:ring-red-500 px-4 py-2"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 bg-gray-700 rounded-lg text-white hover:bg-gray-600 px-4 py-2 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex flex-1 bg-red-600 justify-center rounded-lg text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-red-700 items-center px-4 py-2 transition-colors"
                  disabled={isDeleting || deleteConfirmation !== "DELETE"}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="h-4 text-white w-4 -ml-1 animate-spin mr-2"
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
