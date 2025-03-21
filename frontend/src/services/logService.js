import requests from "./httpRequest";

const LogService = {
  /**
   * Get logs for a specific website URL
   * @param {string} url - Website URL to fetch logs for
   * @param {Object} params - Optional query parameters
   * @param {number} params.limit - Number of logs to return
   * @param {number} params.page - Page number for pagination
   * @param {string} params.status - Filter by status (success/error)
   * @param {string} params.startDate - Filter logs after this date
   * @param {string} params.endDate - Filter logs before this date
   */
  getLogs: async (url, params = {}) => {
    const queryParams = new URLSearchParams();

    // Always include URL
    queryParams.append("url", url);

    // Add optional filters
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.page) queryParams.append("page", params.page);
    if (params.status) queryParams.append("status", params.status);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const queryString = queryParams.toString();
    return requests.get(`/logs?${queryString}`);
  },

  /**
   * Get logs summary statistics for a website
   * @param {string} url - Website URL to get stats for
   * @param {string} period - Time period (24h, 7d, 30d, etc.)
   */
  getLogStats: async (url, period = "24h") => {
    return requests.get(
      `/logs/stats?url=${encodeURIComponent(url)}&period=${period}`
    );
  },

  /**
   * Delete logs for a specific website
   * @param {string} url - Website URL to delete logs for
   */
  deleteLogs: async (url) => {
    return requests.delete(`/logs?url=${encodeURIComponent(url)}`);
  },

  /**
   * Export logs for a specific website
   * @param {string} url - Website URL to export logs for
   * @param {string} format - Export format (json, csv)
   */
  exportLogs: async (url, format = "json") => {
    const response = await requests.get(
      `/logs/export?url=${encodeURIComponent(url)}&format=${format}`,
      {},
      { responseType: "blob" }
    );

    // Create a download link for the exported file
    const downloadUrl = window.URL.createObjectURL(new Blob([response]));
    const filename = `logs-${url.replace(/[^a-z0-9]/gi, "-")}-${new Date()
      .toISOString()
      .slice(0, 10)}.${format}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true, filename };
  },

  /**
   * Get real-time log updates for a website
   * Sets up an EventSource connection for real-time updates
   * @param {string} url - Website URL to get updates for
   * @param {function} onLogReceived - Callback function when new log is received
   * @param {function} onError - Callback function for connection errors
   * @returns {object} - Control object with close() method to close connection
   */
  subscribeToLogs: (url, onLogReceived, onError) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      if (onError) onError(new Error("Authentication token not found"));
      return { close: () => {} };
    }

    const eventSource = new EventSource(
      `${
        import.meta.env.VITE_BACKEND_API_URL
      }/api/v1/logs/subscribe?url=${encodeURIComponent(url)}&token=${token}`
    );

    eventSource.onmessage = (event) => {
      try {
        const logData = JSON.parse(event.data);
        if (onLogReceived) onLogReceived(logData);
      } catch (error) {
        console.error("Error parsing log data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      if (onError) onError(error);
      eventSource.close();
    };

    return {
      close: () => {
        eventSource.close();
      },
    };
  },
};

export default LogService;
