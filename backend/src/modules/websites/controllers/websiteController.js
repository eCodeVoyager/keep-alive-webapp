const websiteService = require("../services/websiteService");
const ApiResponse = require("../../../utils/apiResponse");
const ApiError = require("../../../utils/apiError");
const httpStatus = require("http-status");
const {
  schedulePing,
  deleteScheduledJob,
  updatePingInterval,
} = require("../../../jobs/pingJob");
const logService = require("../../logs/services/logService");
const axios = require("axios");
const { isValidURL } = require("../../../utils/validators");

/**
 * Add a new website to monitor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addWebsite = async (req, res, next) => {
  try {
    // Check website limit for user
    const canAddWebsite = await websiteService.checkWebsiteLimit(
      req.user.id,
      req.user.accountType
    );
    if (!canAddWebsite) {
      const limit = req.user.accountType === "premium" ? 100 : 5;
      return next(
        ApiError.forbidden(
          `You have reached the limit of ${limit} websites. Please upgrade to premium to monitor more websites.`
        )
      );
    }

    // Validate URL format
    if (!isValidURL(req.body.url)) {
      return next(
        ApiError.validation("Invalid URL format", [
          {
            field: "url",
            message: "Please provide a valid URL with http:// or https://",
          },
        ])
      );
    }

    // Make URL consistent: always store origin URL (no paths)
    const parsedUrl = new URL(req.body.url);
    const requestUrlOrigin = parsedUrl.origin;

    // Check if URL already exists for this user
    let existingWebsite = await websiteService.getWebsites({
      url: requestUrlOrigin,
      owner: req.user.id,
    });

    if (existingWebsite && existingWebsite.length > 0) {
      return next(
        ApiError.conflict("URL already exists in your monitoring list")
      );
    }

    // Validate interval
    if (!req.body.ping_time) {
      req.body.ping_time = process.env.DEFAULT_PING_INTERVAL || "5m";
    }

    // Validate that the URL is reachable
    try {
      // Set a timeout for the request
      const timeout = parseInt(process.env.PING_TIMEOUT, 10) || 10000; // Default 10s
      await axios.get(requestUrlOrigin, { timeout });
    } catch (error) {
      return next(
        ApiError.badRequest(`Error connecting to website: ${error.message}`)
      );
    }

    // Create website in database
    const website = await websiteService.addWebsite({
      url: requestUrlOrigin,
      owner: req.user.id,
      owner_email: req.user.email,
      ping_time: req.body.ping_time,
      status: "online",
      notify_offline: true,
      offline_ping_count: 0,
    });

    // Schedule the ping job
    await schedulePing(
      req.user.id,
      req.user.email,
      requestUrlOrigin,
      req.body.ping_time
    );

    // Return success response
    return res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          website,
          "Website added to monitoring successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all websites (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getWebsites = async (req, res, next) => {
  try {
    // Check for admin role
    if (req.user.role !== "admin") {
      return next(
        ApiError.forbidden("Only administrators can access all websites")
      );
    }

    // Get query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Get websites with pagination
    const websites = await websiteService.getWebsitesWithPagination(
      {},
      page,
      limit
    );

    if (!websites || websites.totalDocs === 0) {
      return next(ApiError.notFound("No websites found"));
    }

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          websites,
          "Websites retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific website by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getWebsite = async (req, res, next) => {
  try {
    const website = await websiteService.getWebsite(req.params.id);

    if (!website) {
      return next(ApiError.notFound("Website not found"));
    }

    // Verify ownership or admin role
    if (website.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        ApiError.forbidden("You do not have permission to access this website")
      );
    }

    // Get the latest 10 logs for this website
    const logs = await logService.getLogs(website.url, 10);

    // Calculate uptime percentage based on logs
    const uptimePercentage = calculateUptimePercentage(logs);

    // Combine website data with stats
    const websiteWithStats = {
      ...website.toObject(),
      stats: {
        uptime: uptimePercentage,
        logs: logs.length,
        avgResponseTime: calculateAverageResponseTime(logs),
      },
    };

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          websiteWithStats,
          "Website retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a website
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateWebsite = async (req, res, next) => {
  try {
    // Get the website
    const website = await websiteService.getWebsite(req.params.id);

    if (!website) {
      return next(ApiError.notFound("Website not found"));
    }

    // Verify ownership or admin role
    if (website.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        ApiError.forbidden("You do not have permission to update this website")
      );
    }

    // Check if ping_time is being updated
    const pingTimeChanged =
      req.body.ping_time && req.body.ping_time !== website.ping_time;

    // Update website in database
    const updatedWebsite = await websiteService.updateWebsite(
      req.params.id,
      req.body
    );

    // If ping interval changed, update the scheduled job
    if (pingTimeChanged) {
      await updatePingInterval(
        website.url,
        req.body.ping_time,
        req.user.id,
        req.user.email
      );
    }

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedWebsite,
          "Website updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a website
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteWebsite = async (req, res, next) => {
  try {
    // Get the website
    const website = await websiteService.getWebsite(req.params.id);

    if (!website) {
      return next(ApiError.notFound("Website not found"));
    }

    // Verify ownership or admin role
    if (website.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        ApiError.forbidden("You do not have permission to delete this website")
      );
    }

    try {
      // Delete the scheduled ping job
      await deleteScheduledJob(website.url);
    } catch (error) {
      console.warn(
        `Failed to delete scheduled job for ${website.url}: ${error.message}`
      );
      // Continue with deletion even if job deletion fails
    }

    // Delete the website from database
    const result = await websiteService.deleteWebsite(req.params.id);

    // Delete all associated logs
    try {
      await logService.deleteLogs({ url: website.url });
    } catch (error) {
      console.warn(
        `Failed to delete logs for ${website.url}: ${error.message}`
      );
      // Continue even if log deletion fails
    }

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, result, "Website deleted successfully")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get websites for logged in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getLoggedInUserWebsites = async (req, res, next) => {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // optional filter by status

    // Build query
    const query = { owner: req.user.id };
    if (status && ["online", "offline"].includes(status)) {
      query.status = status;
    }

    // Get websites with pagination
    const websites = await websiteService.getWebsitesWithPagination(
      query,
      page,
      limit
    );

    if (!websites || websites.totalDocs === 0) {
      return next(ApiError.notFound("No websites found"));
    }

    // Get stats for each website
    const websitesWithStats = await Promise.all(
      websites.docs.map(async (website) => {
        // Get the latest 100 logs for this website
        const logs = await logService.getLogs(website.url, 100);

        // Calculate stats
        return {
          ...website.toObject(),
          stats: {
            uptime: calculateUptimePercentage(logs),
            logs: logs.length,
            avgResponseTime: calculateAverageResponseTime(logs),
          },
        };
      })
    );

    // Replace docs with enhanced website data
    websites.docs = websitesWithStats;

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          websites,
          "User websites retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Test a website without adding it to monitoring
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const testWebsite = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return next(ApiError.badRequest("URL is required"));
    }

    if (!isValidURL(url)) {
      return next(ApiError.validation("Invalid URL format"));
    }

    try {
      // Set timeout for request
      const timeout = parseInt(process.env.PING_TIMEOUT, 10) || 10000;

      // Perform the ping with timeout
      const start = Date.now();
      const response = await axios.get(url, { timeout });
      const elapsedTime = Date.now() - start;

      return res.status(httpStatus.OK).json(
        new ApiResponse(
          httpStatus.OK,
          {
            url,
            status: "online",
            statusCode: response.status,
            responseTime: elapsedTime,
            headers: response.headers,
            serverInfo: {
              server: response.headers["server"],
              contentType: response.headers["content-type"],
            },
          },
          "Website test successful"
        )
      );
    } catch (error) {
      return res.status(httpStatus.OK).json(
        new ApiResponse(
          httpStatus.OK,
          {
            url,
            status: "offline",
            statusCode: error.response?.status || 0,
            error: error.message,
            isConnectionError:
              error.code === "ECONNABORTED" || error.code === "ECONNREFUSED",
          },
          "Website test failed"
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get website statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getWebsiteStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const period = req.query.period || "24h"; // Default to last 24 hours

    // Get the website
    const website = await websiteService.getWebsite(id);

    if (!website) {
      return next(new ApiError(httpStatus.NOT_FOUND, "Website not found"));
    }

    // Verify ownership or admin role
    if (website.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this website"
        )
      );
    }

    // Convert period to milliseconds
    let timeRange;
    switch (period) {
      case "1h":
        timeRange = 60 * 60 * 1000;
        break;
      case "12h":
        timeRange = 12 * 60 * 60 * 1000;
        break;
      case "24h":
        timeRange = 24 * 60 * 60 * 1000;
        break;
      case "7d":
        timeRange = 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        timeRange = 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        timeRange = 24 * 60 * 60 * 1000; // Default to 24 hours
    }

    // Calculate time threshold
    const timeThreshold = new Date(Date.now() - timeRange);

    // Get logs within the specified period
    const logs = await logService.getLogsWithinPeriod(
      website.url,
      timeThreshold,
      { sort: { pingAt: -1 } }
    );

    // Calculate statistics
    const stats = {
      url: website.url,
      status: website.status,
      totalChecks: logs.length,
      uptime: calculateUptimePercentage(logs),
      avgResponseTime: calculateAverageResponseTime(logs),
      minResponseTime: calculateMinResponseTime(logs),
      maxResponseTime: calculateMaxResponseTime(logs),
      responseTimeTrend: calculateResponseTimeTrend(logs),
      lastChecked: logs.length > 0 ? logs[0].pingAt : null,
      period,
      checksPerHour: calculateChecksPerHour(logs, timeRange),
      availabilityPercentage: calculateAvailabilityPercentage(
        logs,
        timeRange,
        website.ping_time
      ),
    };

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          stats,
          "Website statistics retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate checks per hour
 * @param {Array} logs - Array of log entries
 * @param {number} timeRange - Time range in milliseconds
 * @returns {number} - Average checks per hour
 */
const calculateChecksPerHour = (logs, timeRange) => {
  if (!logs || logs.length === 0) return 0;

  const hours = timeRange / (60 * 60 * 1000);
  return +(logs.length / hours).toFixed(2);
};

/**
 * Calculate availability percentage considering expected checks
 * @param {Array} logs - Array of log entries
 * @param {number} timeRange - Time range in milliseconds
 * @param {string} pingInterval - Ping interval (e.g., "5m", "1h")
 * @returns {number} - Availability percentage
 */
const calculateAvailabilityPercentage = (logs, timeRange, pingInterval) => {
  if (!logs || logs.length === 0) return 0;

  // Parse ping interval to milliseconds
  let intervalMs;
  const intervalValue = parseInt(pingInterval.slice(0, -1));
  const intervalUnit = pingInterval.slice(-1);

  switch (intervalUnit) {
    case "s":
      intervalMs = intervalValue * 1000;
      break;
    case "m":
      intervalMs = intervalValue * 60 * 1000;
      break;
    case "h":
      intervalMs = intervalValue * 60 * 60 * 1000;
      break;
    case "d":
      intervalMs = intervalValue * 24 * 60 * 60 * 1000;
      break;
    default:
      intervalMs = 5 * 60 * 1000; // Default to 5 minutes
  }

  // Calculate expected number of checks
  const expectedChecks = Math.floor(timeRange / intervalMs);

  // Count successful checks
  const successfulChecks = logs.filter((log) => {
    const status = parseInt(log.status, 10);
    return status >= 200 && status < 400;
  }).length;

  // Calculate availability percentage
  return Math.round((successfulChecks / expectedChecks) * 100);
};

/**
 * Immediately ping a website
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const pingWebsiteNow = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get the website
    const website = await websiteService.getWebsite(id);

    if (!website) {
      return next(ApiError.notFound("Website not found"));
    }

    // Verify ownership or admin role
    if (website.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        ApiError.forbidden("You do not have permission to ping this website")
      );
    }

    try {
      // Set timeout for request
      const timeout = parseInt(process.env.PING_TIMEOUT, 10) || 10000;

      // Perform the ping with timeout
      const start = Date.now();
      const response = await axios.get(website.url, { timeout });
      const elapsedTime = Date.now() - start;

      // Log the successful ping
      await logService.createLog({
        url: website.url,
        status: response.status,
        responseTime: elapsedTime,
      });

      // Update website status if it was offline
      if (website.status === "offline") {
        await websiteService.updateWebsite(website._id, {
          status: "online",
          notify_offline: true,
          offline_ping_count: 0,
        });
      }

      return res.status(httpStatus.OK).json(
        new ApiResponse(
          httpStatus.OK,
          {
            url: website.url,
            status: "online",
            statusCode: response.status,
            responseTime: elapsedTime,
          },
          "Website ping successful"
        )
      );
    } catch (error) {
      // Log the failed ping
      await logService.createLog({
        url: website.url,
        status: error.response?.status || 0,
        responseTime: 0,
      });

      // Update website status if it was online
      if (website.status === "online") {
        await websiteService.updateWebsite(website._id, {
          status: "offline",
          offline_ping_count: website.offline_ping_count + 1,
        });
      }

      return res.status(httpStatus.OK).json(
        new ApiResponse(
          httpStatus.OK,
          {
            url: website.url,
            status: "offline",
            statusCode: error.response?.status || 0,
            error: error.message,
          },
          "Website ping failed"
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get website history for chart visualization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getWebsiteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days) || 7; // Default to 7 days
    const interval = req.query.interval || "hour"; // Default to hourly intervals

    // Get the website
    const website = await websiteService.getWebsite(id);

    if (!website) {
      return next(new ApiError(httpStatus.NOT_FOUND, "Website not found"));
    }

    // Verify ownership or admin role
    if (website.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this website"
        )
      );
    }

    // Calculate time threshold
    const timeThreshold = new Date();
    timeThreshold.setDate(timeThreshold.getDate() - days);

    // Get all logs within the specified period
    const logs = await logService.getLogsWithinPeriod(
      website.url,
      timeThreshold,
      { sort: { pingAt: 1 } } // Sort by oldest first for chronological order
    );

    // Group logs by time interval
    const groupedLogs = groupLogsByTimeInterval(logs, interval);

    // Format data for charts
    const labels = Object.keys(groupedLogs);
    const chartData = {
      labels: labels,
      datasets: {
        responseTime: labels.map((key) => groupedLogs[key].avgResponseTime),
        uptime: labels.map((key) => groupedLogs[key].uptime),
        status: labels.map((key) => groupedLogs[key].onlinePercentage),
      },
      rawData: groupedLogs,
      summary: {
        totalChecks: logs.length,
        avgResponseTime: calculateAverageResponseTime(logs),
        uptime: calculateUptimePercentage(logs),
        downtime: 100 - calculateUptimePercentage(logs),
        maxResponseTime: calculateMaxResponseTime(logs),
        minResponseTime: calculateMinResponseTime(logs),
      },
    };

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          chartData,
          "Website history retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Helper functions for statistics

/**
 * Calculate uptime percentage
 * @param {Array} logs - Array of log entries
 * @returns {number} Uptime percentage
 */
const calculateUptimePercentage = (logs) => {
  if (!logs || logs.length === 0) return 100;

  // Count successful pings (HTTP 2xx or 3xx)
  const successfulPings = logs.filter((log) => {
    const status = parseInt(log.status, 10);
    return status >= 200 && status < 400;
  }).length;

  return Math.round((successfulPings / logs.length) * 100);
};

/**
 * Calculate average response time
 * @param {Array} logs - Array of log entries
 * @returns {number} Average response time in ms
 */
const calculateAverageResponseTime = (logs) => {
  if (!logs || logs.length === 0) return 0;

  // Filter out failed pings (response time of 0)
  const successfulLogs = logs.filter((log) => log.responseTime > 0);

  if (successfulLogs.length === 0) return 0;

  // Calculate average
  const totalResponseTime = successfulLogs.reduce(
    (sum, log) => sum + log.responseTime,
    0
  );
  return Math.round(totalResponseTime / successfulLogs.length);
};

/**
 * Calculate minimum response time
 * @param {Array} logs - Array of log entries
 * @returns {number} Minimum response time in ms
 */
const calculateMinResponseTime = (logs) => {
  if (!logs || logs.length === 0) return 0;

  // Filter out failed pings (response time of 0)
  const successfulLogs = logs.filter((log) => log.responseTime > 0);

  if (successfulLogs.length === 0) return 0;

  // Find minimum
  return Math.min(...successfulLogs.map((log) => log.responseTime));
};

/**
 * Calculate maximum response time
 * @param {Array} logs - Array of log entries
 * @returns {number} Maximum response time in ms
 */
const calculateMaxResponseTime = (logs) => {
  if (!logs || logs.length === 0) return 0;

  // Find maximum
  return Math.max(...logs.map((log) => log.responseTime));
};

/**
 * Calculate response time trend (improved/degraded)
 * @param {Array} logs - Array of log entries
 * @returns {string} Trend direction
 */
const calculateResponseTimeTrend = (logs) => {
  if (!logs || logs.length < 5) return "stable";

  // Filter out failed pings
  const successfulLogs = logs.filter((log) => log.responseTime > 0);

  if (successfulLogs.length < 5) return "stable";

  // Get the 5 most recent logs
  const recentLogs = successfulLogs.slice(0, 5);

  // Get the 5 logs before the recent ones
  const previousLogs = successfulLogs.slice(5, 10);

  if (previousLogs.length === 0) return "stable";

  // Calculate averages
  const recentAvg =
    recentLogs.reduce((sum, log) => sum + log.responseTime, 0) /
    recentLogs.length;
  const previousAvg =
    previousLogs.reduce((sum, log) => sum + log.responseTime, 0) /
    previousLogs.length;

  // Determine trend (10% change threshold)
  const percentChange = ((recentAvg - previousAvg) / previousAvg) * 100;

  if (percentChange < -10) {
    return "improved";
  } else if (percentChange > 10) {
    return "degraded";
  }

  return "stable";
};

/**
 * Group logs by time interval
 * @param {Array} logs - Array of log entries
 * @param {string} interval - Time interval (day, hour)
 * @returns {Object} Grouped logs
 */
const groupLogsByTimeInterval = (logs, interval) => {
  const grouped = {};

  logs.forEach((log) => {
    const date = new Date(log.pingAt);
    let key;

    if (interval === "day") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    } else {
      // hour interval
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:00`;
    }

    if (!grouped[key]) {
      grouped[key] = {
        logs: [],
        avgResponseTime: 0,
        uptime: 0,
        onlineCount: 0,
        totalCount: 0,
      };
    }

    grouped[key].logs.push(log);
    grouped[key].totalCount++;

    // Count successful pings
    const status = parseInt(log.status, 10);
    if (status >= 200 && status < 400) {
      grouped[key].onlineCount++;
    }
  });

  // Calculate statistics for each group
  Object.keys(grouped).forEach((key) => {
    const group = grouped[key];
    group.avgResponseTime = calculateAverageResponseTime(group.logs);
    group.uptime = calculateUptimePercentage(group.logs);
    group.onlinePercentage = Math.round(
      (group.onlineCount / group.totalCount) * 100
    );
  });

  return grouped;
};

module.exports = {
  addWebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
  getLoggedInUserWebsites,
  testWebsite,
  getWebsiteStats,
  pingWebsiteNow,
  getWebsiteHistory,
};
