const pino = require("pino");
const path = require("path");
const fs = require("fs");

// Ensure logs directory exists if logging to file
if (process.env.LOG_TO_FILE === "true") {
  const logDirectory = path.dirname(
    process.env.LOG_FILE_PATH || "logs/app.log"
  );
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }
}

// Configure logger options
const loggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  base: {
    service: process.env.SERVICE_NAME || "keep-alive-v2",
    env: process.env.NODE_ENV || "development",
  },
};

// Add file transport if enabled
if (process.env.LOG_TO_FILE === "true") {
  loggerOptions.transport = {
    target: "pino/file",
    options: { destination: process.env.LOG_FILE_PATH || "logs/app.log" },
  };
}

// Create the logger instance
const logger = pino(loggerOptions);

// Utility methods for common log patterns
const enhancedLogger = {
  ...logger,

  // System startup logs
  startup: (message, details = {}) => {
    logger.info({ event: "system_startup", ...details }, message);
  },

  // API request logs
  request: (req, details = {}) => {
    if (process.env.REQUEST_LOGGING !== "true") return;

    logger.debug(
      {
        event: "api_request",
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        userId: req.user?.id,
        ...details,
      },
      `API Request: ${req.method} ${req.originalUrl}`
    );
  },

  // API response logs
  response: (req, res, responseTime, details = {}) => {
    if (process.env.REQUEST_LOGGING !== "true") return;

    const level = res.statusCode >= 400 ? "warn" : "debug";

    logger[level](
      {
        event: "api_response",
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime,
        userId: req.user?.id,
        ...details,
      },
      `API Response: ${req.method} ${req.originalUrl} - ${res.statusCode} (${responseTime}ms)`
    );
  },

  // Database operation logs
  db: (operation, collection, details = {}) => {
    logger.debug(
      {
        event: "database_operation",
        operation,
        collection,
        ...details,
      },
      `DB Operation: ${operation} on ${collection}`
    );
  },

  // Authentication events
  auth: (event, userId, details = {}) => {
    logger.info(
      {
        event: `auth_${event}`,
        userId,
        ...details,
      },
      `Auth: ${event} for user ${userId}`
    );
  },

  // Monitor events
  monitor: (event, url, details = {}) => {
    logger.info(
      {
        event: `monitor_${event}`,
        url,
        ...details,
      },
      `Monitor: ${event} for ${url}`
    );
  },

  // Error with context
  errorWithContext: (err, context = {}) => {
    if (process.env.ERROR_LOGGING !== "true") return;

    const errorObj = {
      event: "error",
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name,
      ...context,
    };

    logger.error(errorObj, `Error: ${err.message}`);
  },
};

module.exports = enhancedLogger;
