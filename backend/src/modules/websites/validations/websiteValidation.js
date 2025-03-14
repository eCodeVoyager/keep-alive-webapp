/**
 * Website validation schemas using Joi
 * Defines validation rules for website-related API endpoints
 */
const Joi = require("joi");

/**
 * Validation schema for adding a new website
 */
const addWebsite = {
  body: Joi.object().keys({
    url: Joi.string()
      .required()
      .uri({
        scheme: ["http", "https"],
      })
      .message({
        "string.uri": "URL must be a valid HTTP or HTTPS URL",
        "string.empty": "URL is required",
        "any.required": "URL is required",
      }),
    ping_time: Joi.string()
      .required()
      .pattern(/^[0-9]+[smhd]$/)
      .message({
        "string.pattern.base":
          "Ping time must be in format like 5m, 1h, 2d (s: seconds, m: minutes, h: hours, d: days)",
        "string.empty": "Ping time is required",
        "any.required": "Ping time is required",
      }),
    status: Joi.string().valid("online", "offline").default("online"),
    notify_offline: Joi.boolean().default(true),
  }),
};

/**
 * Validation schema for updating an existing website
 */
const updateWebsite = {
  params: Joi.object().keys({
    id: Joi.string().required().length(24).message({
      "string.length": "Website ID must be a valid MongoDB ObjectId",
      "string.empty": "Website ID is required",
    }),
  }),
  body: Joi.object().keys({
    url: Joi.string()
      .uri({
        scheme: ["http", "https"],
      })
      .message({
        "string.uri": "URL must be a valid HTTP or HTTPS URL",
      }),
    ping_time: Joi.string()
      .pattern(/^[0-9]+[smhd]$/)
      .message({
        "string.pattern.base":
          "Ping time must be in format like 5m, 1h, 2d (s: seconds, m: minutes, h: hours, d: days)",
      }),
    status: Joi.string().valid("online", "offline"),
    notify_offline: Joi.boolean(),
  }),
};

/**
 * Validation schema for testing a website without adding it
 */
const testWebsite = {
  query: Joi.object().keys({
    url: Joi.string()
      .required()
      .uri({
        scheme: ["http", "https"],
      })
      .message({
        "string.uri": "URL must be a valid HTTP or HTTPS URL",
        "string.empty": "URL is required",
        "any.required": "URL is required",
      }),
  }),
};

/**
 * Validation schema for website history request
 */
const websiteHistory = {
  params: Joi.object().keys({
    id: Joi.string().required().length(24).message({
      "string.length": "Website ID must be a valid MongoDB ObjectId",
    }),
  }),
  query: Joi.object().keys({
    days: Joi.number().integer().min(1).max(30).default(7),
    interval: Joi.string().valid("hour", "day").default("hour"),
  }),
};

/**
 * Validation schema for website statistics request
 */
const websiteStats = {
  params: Joi.object().keys({
    id: Joi.string().required().length(24).message({
      "string.length": "Website ID must be a valid MongoDB ObjectId",
    }),
  }),
  query: Joi.object().keys({
    period: Joi.string().valid("1h", "12h", "24h", "7d", "30d").default("24h"),
  }),
};

/**
 * Validation schema for user websites query
 */
const getUserWebsites = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    status: Joi.string().valid("online", "offline"),
  }),
};

module.exports = {
  addWebsite,
  updateWebsite,
  testWebsite,
  websiteHistory,
  websiteStats,
  getUserWebsites,
};
