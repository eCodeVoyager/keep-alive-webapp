import requests from "./httpRequest";

const UserService = {
  updateName: async (id, name) => requests.put(`/users/${id}`, { name }),
};

export default UserService;
