import requests from "./httpRequest";

const ServerService = {
  createServer: async (body) => requests.post("/websites", body),
  getAllServers: async () => requests.get("/websites/me"),
  deleteServer: async (id) => requests.delete(`/websites/${id}`),
};

export default ServerService;
