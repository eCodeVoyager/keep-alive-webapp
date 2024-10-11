import requests from "./httpRequest";

const UserService = {
  updateName: async (name) => requests.put("/users/name", { name }),
};

export default UserService;
