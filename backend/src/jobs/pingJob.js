/**
 * Ping Job Module
 * Handles scheduling and processing of website monitoring pings
 */
require("dotenv").config();
const Queue = require("bull");
const axios = require("axios");
const ms = require("ms");
const logService = require("../modules/logs/services/logService");
const convertToCron = require("../utils/convertToCorn");
const websiteService = require("../modules/websites/services/websiteService");
const userService = require("../modules/users/services/userService");
const notificationService = require("../modules/notification/services/notificationService");
const redisConfig = require("../config/redis");

// Queue instance
let pingQueue = null;

/**
 * Initialize queue with proper Redis configuration
 * @returns {Queue} Bull queue instance
 */
const initPingQueue = () => {
  // Get Redis client
  const redisClient = redisConfig.getClient();

  // Configure queue options
  const queueOptions = {};

  // If Redis is available, use it
  if (redisClient) {
    // Use exact same configuration as in redisConfig module
    queueOptions.redis = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      username: process.env.REDIS_USERNAME || undefined,
      db: parseInt(process.env.REDIS_DB, 10) || 0,
      tls: process.env.REDIS_USE_TLS === "true" ? {} : undefined,
    };

    // If using self-signed certificates
    if (
      process.env.REDIS_USE_TLS === "true" &&
      process.env.REDIS_REJECT_UNAUTHORIZED === "false"
    ) {
      queueOptions.redis.tls = { rejectUnauthorized: false };
    }
  } else {
    console.warn(
      "⚠️ Redis not available, ping queue will use in-memory processing"
    );
  }

  // Create queue
  const queue = new Queue("pingQueue", queueOptions);

  // Set up error handler
  queue.on("error", (error) => {
    console.error(`Ping queue error: ${error.message}`);
  });

  return queue;
};

/**
 * Schedule a periodic ping job
 * @param {string} userId - User ID
 * @param {string} userEmail - User email
 * @param {string} url - URL to ping
 * @param {string} interval - Interval (e.g. '5m', '1h')
 * @returns {Promise<Object>} Job details
 */
const schedulePing = async (userId, userEmail, url, interval) => {
  try {
    // Initialize queue if not done already
    if (!pingQueue) {
      pingQueue = initPingQueue();
    }

    // Validate interval
    const validatedInterval = validateInterval(interval);

    // Convert interval to cron expression
    const cronInterval = convertToCron(validatedInterval);

    // Encode URL to use as job ID
    const encodedUrl = encodeURIComponent(url);

    // Add job to queue
    const job = await pingQueue.add(
      { url, userId, userEmail },
      {
        repeat: { cron: cronInterval },
        jobId: encodedUrl,
        attempts: parseInt(process.env.PING_RETRY_COUNT, 10) || 3,
        backoff: {
          type: "exponential",
          delay: 5000, // 5 seconds
        },
        removeOnComplete: true,
        removeOnFail: 100, // Keep last 100 failed jobs
      }
    );

    console.log(`Scheduled ping for ${url} with interval ${validatedInterval}`);
    return job;
  } catch (error) {
    console.error(`Error scheduling ping for ${url}: ${error.message}`);
    throw error;
  }
};

/**
 * Validate and normalize interval
 * @param {string} interval - Time interval
 * @returns {string} Validated interval
 */
const validateInterval = (interval) => {
  // Default interval
  const defaultInterval = process.env.DEFAULT_PING_INTERVAL || "5m";

  if (!interval) {
    return defaultInterval;
  }

  try {
    // Parse interval using ms package
    const msValue = ms(interval);

    if (!msValue) {
      throw new Error(`Invalid interval format: ${interval}`);
    }

    // Check if interval is too short
    const minMs = ms(process.env.MIN_PING_INTERVAL || "30s");
    if (msValue < minMs) {
      console.warn(
        `Interval ${interval} is too short, using minimum ${process.env.MIN_PING_INTERVAL}`
      );
      return process.env.MIN_PING_INTERVAL;
    }

    // Check if interval is too long
    const maxMs = ms(process.env.MAX_PING_INTERVAL || "1h");
    if (msValue > maxMs) {
      console.warn(
        `Interval ${interval} is too long, using maximum ${process.env.MAX_PING_INTERVAL}`
      );
      return process.env.MAX_PING_INTERVAL;
    }

    return interval;
  } catch (error) {
    console.warn(
      `Invalid interval format: ${interval}, using default ${defaultInterval}`
    );
    return defaultInterval;
  }
};

/**
 * Delete a scheduled ping job
 * @param {string} url - URL to stop pinging
 * @returns {Promise<boolean>} Success status
 */
const deleteScheduledJob = async (url) => {
  try {
    // Initialize queue if not done already
    if (!pingQueue) {
      pingQueue = initPingQueue();
    }

    // Get all repeatable jobs
    const encodedUrl = encodeURIComponent(url);
    const jobs = await pingQueue.getRepeatableJobs();

    // Find the job for this URL
    const job = jobs.find((job) => job.id === encodedUrl);

    if (!job) {
      console.warn(`No scheduled job found for URL: ${url}`);
      return false;
    }

    // Remove the repeatable job
    await pingQueue.removeRepeatableByKey(job.key);
    console.log(`Removed scheduled ping for ${url}`);
    return true;
  } catch (error) {
    console.error(`Error removing scheduled job for ${url}: ${error.message}`);
    throw error;
  }
};

/**
 * Update ping interval for a website
 * @param {string} url - Website URL
 * @param {string} newInterval - New interval
 * @param {string} userId - User ID
 * @param {string} userEmail - User email
 * @returns {Promise<boolean>} Success status
 */
const updatePingInterval = async (url, newInterval, userId, userEmail) => {
  try {
    // Delete existing schedule
    await deleteScheduledJob(url);

    // Create new schedule with updated interval
    await schedulePing(userId, userEmail, url, newInterval);

    return true;
  } catch (error) {
    console.error(`Error updating ping interval for ${url}: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate downtime duration
 * @param {Object} website - Website object
 * @returns {string} Human-readable downtime duration
 */
const calculateDowntime = (website) => {
  const lastUpdated = website.updatedAt;
  const now = new Date();
  const diffMs = now - lastUpdated;

  // Format downtime
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Start processing ping jobs
 */
const processPingJobs = () => {
  // Initialize queue if not done already
  if (!pingQueue) {
    pingQueue = initPingQueue();
  }

  // Set up concurrency - how many jobs to process at once
  pingQueue.process(10, async (job, done) => {
    const { url, userId, userEmail } = job.data;

    console.log(`Processing ping for ${url}`);

    try {
      // Get website info
      let website = await websiteService.getWebsites({ url });

      // Check if website exists
      if (!website || website.length === 0) {
        console.error(`Website not found in database: ${url}`);
        return done(new Error(`Website not found: ${url}`));
      }

      website = website[0];

      // Set timeout for request
      const timeout = parseInt(process.env.PING_TIMEOUT, 10) || 10000; // Default 10s

      // Perform the ping with timeout
      const start = Date.now();
      const response = await axios.get(url, { timeout });
      const elapsedTime = Date.now() - start;

      // Log the successful ping
      await logService.createLog({
        url,
        status: response.status,
        responseTime: elapsedTime,
      });

      // Check if website was previously offline
      if (website.status === "offline") {
        // Update website status to online
        await websiteService.updateWebsite(website._id, {
          status: "online",
          notify_offline: true,
          offline_ping_count: 0,
        });

        // Send recovery notification if notification service exists
        if (typeof notificationService?.sendNotification === "function") {
          await notificationService.sendNotification(
            website.owner,
            "serverRecovery",
            {
              url,
              status: "online",
              downtime: calculateDowntime(website),
              responseTime: elapsedTime,
            },
            {
              subject: `✅ Website Recovered: ${url}`,
              sendToDiscord: true,
              sendToTeams: true,
            }
          );
        }

        console.log(`Website ${url} is back online`);
      }

      // Job completed successfully
      done(null, {
        status: response.status,
        responseTime: elapsedTime,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Handle failed ping
      try {
        if (error.code === "ECONNABORTED") {
          console.warn(`Timeout reaching ${url}`);
        }

        // Get website and user info
        let website = await websiteService.getWebsites({ url });

        // Check if website exists
        if (!website || website.length === 0) {
          return done(new Error(`Website not found: ${url}`));
        }

        website = website[0];

        let user = await userService.getUsers({ _id: userId });

        // Check if user exists
        if (!user || user.length === 0) {
          return done(new Error(`User not found: ${userId}`));
        }

        user = user[0];

        // Increment offline count
        website.offline_ping_count = (website.offline_ping_count || 0) + 1;

        // Update website status to offline
        await websiteService.updateWebsite(website._id, {
          status: "offline",
          offline_ping_count: website.offline_ping_count,
        });

        // Log the failed ping
        await logService.createLog({
          url,
          status: error.response?.status || 0,
          responseTime: 0,
        });

        // Send notification if this is the first failure (notify_offline flag is true)
        if (
          website.notify_offline &&
          typeof notificationService?.sendNotification === "function"
        ) {
          await notificationService.sendNotification(
            user._id,
            "serverDown",
            {
              url,
              status: "offline",
              statusCode: error.response?.status || "Connection Error",
              errorMessage: error.message,
            },
            {
              subject: `🔴 ALERT: Website Down - ${url}`,
              sendToDiscord: true,
              sendToTeams: true,
            }
          );

          // Set notify_offline to false to prevent duplicate alerts
          await websiteService.updateWebsite(website._id, {
            notify_offline: false,
          });

          console.log(`Alert sent for ${url} being down`);
        }

        // Delete website if it's been offline for too long
        const maxOfflinePings =
          parseInt(process.env.MAX_PINGS_BEFORE_DELETION, 10) || 864;
        if (website.offline_ping_count >= maxOfflinePings) {
          console.log(
            `Website ${url} has been offline for ${website.offline_ping_count} pings, deleting...`
          );

          // Send notification about deletion if notification service exists
          if (typeof notificationService?.sendNotification === "function") {
            await notificationService.sendNotification(
              user._id,
              "websiteDeleted",
              {
                url,
                reason: "Extended downtime",
                offlineDuration: `${maxOfflinePings} checks`,
              },
              {
                subject: `Website Deleted Due to Extended Downtime: ${url}`,
                force: true, // Force notification even if disabled
              }
            );
          }

          // Delete website and related data
          await websiteService.deleteWebsite(website._id);
          await deleteScheduledJob(url);
          await logService.deleteLogs({ url });
        }

        // Job failed but handled
        done({
          status: error.response?.status || "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      } catch (internalError) {
        console.error(`Error handling failed ping: ${internalError.message}`);
        done(internalError);
      }
    }
  });

  // Handle completed jobs
  pingQueue.on("completed", async (job) => {
    try {
      // Remove completed job to save memory
      await job.remove();
    } catch (error) {
      console.error(`Error removing completed job: ${error.message}`);
    }
  });

  // Handle failed jobs
  pingQueue.on("failed", (job, error) => {
    console.error(`Ping job failed for ${job.data.url}: ${error.message}`);
  });

  console.log("🚀 Ping worker started");
};

/**
 * Gracefully shut down the ping queue
 */
const shutdown = async () => {
  if (pingQueue) {
    try {
      await pingQueue.close();
      console.log("Ping queue gracefully closed");
    } catch (error) {
      console.error(`Error closing ping queue: ${error.message}`);
    }
  }
};

module.exports = {
  schedulePing,
  processPingJobs,
  deleteScheduledJob,
  updatePingInterval,
  shutdown,
};
