import requests from "./httpRequest";

const UserService = {
  // Get user profile
  getProfile: async (id) => requests.get(`/users/${id}`),

  // Update user profile
  updateProfile: async (id, data) => requests.put(`/users/${id}`, data),

  // Update user name
  updateName: async (id, name) => requests.put(`/users/${id}`, { name }),

  // Update email alert preferences
  updateEmailAlerts: async (id, emailAlerts) =>
    requests.put(`/users/${id}`, { website_offline_alert: emailAlerts }),

  // Delete user account
  deleteAccount: async (id) => requests.delete(`/users/${id}`),

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.id) queryParams.append("id", params.id);
    if (params.email) queryParams.append("email", params.email);

    const queryString = queryParams.toString();
    return requests.get(`/users${queryString ? `?${queryString}` : ""}`);
  },
};

export default UserService;
