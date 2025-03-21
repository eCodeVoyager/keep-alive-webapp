import requests from "./httpRequest";

const ServerService = {
  // Create a new server monitoring entry
  createServer: async (body) => requests.post("/websites", body),

  // Get all servers for the current user
  getAllServers: async () => requests.get("/websites/me"),

  // Get a specific server by ID
  getServer: async (id) => requests.get(`/websites/${id}`),

  // Update a server monitoring config
  updateServer: async (id, body) => requests.put(`/websites/${id}`, body),

  // Delete a server monitoring entry
  deleteServer: async (id) => requests.delete(`/websites/${id}`),

  // Manually ping a website
  pingWebsite: async (id) => requests.get(`/websites/${id}/ping`),

  // Test a website connection without adding it
  testWebsite: async (url) =>
    requests.get(`/websites/test?url=${encodeURIComponent(url)}`),

  // Get server status counts for dashboard
  getServerStatusCounts: async () => {
    const { data } = await requests.get("/websites/me");
    const counts = {
      total: data.length,
      online: data.filter((site) => site.status === "online").length,
      offline: data.filter((site) => site.status === "offline").length,
    };
    counts.uptime = counts.total > 0 ? (counts.online / counts.total) * 100 : 0;
    return counts;
  },
};

export default ServerService;
