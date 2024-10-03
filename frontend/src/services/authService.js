import requests from "./httpRequest";

const AuthService = {
  register: async (body) => requests.post("/auth/register", body),
  login: async (body) => requests.post("/auth/login", body),
  me: async () => requests.get("/auth/me"),
};

export default AuthService;
