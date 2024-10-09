import requests from "./httpRequest";

const UserService = {
  updateName: async (name) => requests.put("/users/name", { name }),
  changePassword: async (currentPassword, newPassword) =>
    requests.put("/users/password", { currentPassword, newPassword }),
};

export default UserService;
