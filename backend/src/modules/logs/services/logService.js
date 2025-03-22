const logModel = require("../models/logModel");

const getLogs = async (url, limit) => {
  try {
    const query = { url };
    const options = {
      sort: { pingAt: -1 }, // Sort by most recent first
    };

    if (limit) {
      return await logModel.find(query, null, options).limit(limit);
    }

    return await logModel.find(query, null, options);
  } catch (error) {
    throw error;
  }
};

const createLog = async (log) => {
  try {
    return await logModel.create(log);
  } catch (error) {
    throw error;
  }
};

const deleteLogs = async (url) => {
  try {
    return await logModel.deleteMany({ url });
  } catch (error) {
    throw error;
  }
};

/**
 * Get logs for a URL within a specific time period
 * @param {string} url - The URL to get logs for
 * @param {Date} startDate - The start date for the time range
 * @param {Object} options - Additional options like limit, sort
 * @returns {Promise<Array>} - Array of log entries
 */
const getLogsWithinPeriod = async (url, startDate, options = {}) => {
  try {
    const query = {
      url,
      pingAt: { $gte: startDate },
    };

    const queryOptions = {
      sort: options.sort || { pingAt: -1 },
    };

    if (options.limit) {
      return await logModel
        .find(query, null, queryOptions)
        .limit(options.limit);
    }

    return await logModel.find(query, null, queryOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getLogs,
  createLog,
  deleteLogs,
  getLogsWithinPeriod,
};
