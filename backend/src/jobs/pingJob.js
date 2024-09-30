require("dotenv").config();
const Queue = require("bull");
const axios = require("axios");
const admin = require("../database/firebase");
const convertToCron = require("../utils/convertToCorn");

const pingQueue = new Queue("pingQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

// Function to add periodic jobs to Bull Queue
const schedulePing = (userId, url, interval) => {
  const cronInterval = convertToCron(interval);
  pingQueue.add(
    { userId, url },
    {
      repeat: { cron: cronInterval }, //
    }
  );
};

const processPingJobs = () => {
  // Processing the ping jobs in Bull queue
  pingQueue.process(async (job, done) => {
    const { userId, url } = job.data;
    try {
      const start = Date.now();
      const response = await axios.get(url);
      const elapsedTime = Date.now() - start;

      logPingResult(userId, url, "success", elapsedTime);
      done(null, response);
    } catch (error) {
      logPingResult(userId, url, "failure", 0);
      throw error;
    }
  });
  console.log("🚀 Ping worker started");
};

// Log the ping result to Firebase
const logPingResult = (userId, url, status, responseTime) => {
  const filteredUrl = url.replace(/https?:\/\//, "").replace(/\./g, "_");
  const timestamp = Date.now();
  const logRef = admin.database().ref(`users/${userId}/logs/${filteredUrl}`);
  logRef.push({
    timestamp,
    status,
    responseTime,
  });
};

module.exports = { schedulePing, processPingJobs };
