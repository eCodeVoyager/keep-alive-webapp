import requests from "./httpRequest";

const statsService = {
  // Get website stats
  getWebsiteStats: async (id, period = "24h") => {
    return requests.get(`/websites/${id}/stats?period=${period}`);
  },

  // Get website history data for charts
  getWebsiteHistory: async (id, days = 7, interval = "hour") => {
    return requests.get(
      `/websites/${id}/history?days=${days}&interval=${interval}`
    );
  },

  // Get dashboard stats summary
  getDashboardStats: async () => {
    return requests.get("/websites/dashboard");
  },
};

export default statsService;
