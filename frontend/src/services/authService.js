
import requests from "./httpRequest";

const AuthService = {
  register: async (body) => requests.post("/auth/register", body),
  login: async (body) => requests.post("/auth/login", body),
  me: async () => requests.get("/auth/me"),
  send_verification_email: async (body) =>
    requests.post("/auth/verify-email", body),
  verify_email: async (body) => requests.post("/auth/verify-email-otp", body),
  send_forgot_password_otp: async (body) =>
    requests.post("/auth/forgot-password", body),
};

export default AuthService;
