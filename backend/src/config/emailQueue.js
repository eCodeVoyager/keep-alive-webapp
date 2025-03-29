const Queue = require("bull");

require("dotenv").config();

/**
 * Creates a new Bull queue for handling email jobs with improved error handling and retry logic
 */
const emailQueue = new Queue("emailQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_USE_TLS === "true" ? {} : false,
  },
  defaultJobOptions: {
    attempts: parseInt(process.env.EMAIL_QUEUE_RETRIES, 10) || 3,
    backoff: {
      type: "exponential",
      delay: parseInt(process.env.EMAIL_QUEUE_RETRY_DELAY, 10) || 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
  limiter: {
    max: parseInt(process.env.EMAIL_QUEUE_MAX_RATE, 10) || 10, // Maximum number of jobs processed per time window
    duration: parseInt(process.env.EMAIL_QUEUE_RATE_WINDOW, 10) || 1000, // Time window in milliseconds
  },
});

// Handle failed jobs
emailQueue.on("failed", (job, error) => {
  console.error(`Email job ${job.id} failed:`, error);
  // You could add additional error handling here, like sending to error monitoring service
});

// Handle completed jobs
emailQueue.on("completed", (job) => {
  console.log(`Email job ${job.id} completed successfully`);
});

// Handle stalled jobs
emailQueue.on("stalled", (job) => {
  console.warn(`Email job ${job.id} stalled`);
});

// Handle error events
emailQueue.on("error", (error) => {
  console.error("Email queue error:", error);
});

module.exports = emailQueue;
