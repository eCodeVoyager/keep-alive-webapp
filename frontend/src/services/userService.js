import requests from "./httpRequest";

const UserService = {
  updateName: async (id, name) => requests.put(`/users/${id}`, { name }),
  updateEmailAlerts: async (id, emailAlerts) =>
    requests.put(`/users/${id}`, { website_offline_alart: emailAlerts }),
};

export default UserService;
