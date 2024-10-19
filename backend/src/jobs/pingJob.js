require("dotenv").config();
const Queue = require("bull");
const axios = require("axios");
const logService = require("../modules/logs/services/logService");
const convertToCron = require("../utils/convertToCorn");
const sendEmail = require("../modules/email/services/emailService");
const websiteService = require("../modules/websites/services/websiteService");

const pingQueue = new Queue("pingQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: process.env.REDIS_USE_TLS === "true" ? {} : false,
    password: process.env.REDIS_PASSWORD,
  },
});

// Function to add periodic jobs to Bull Queue
const schedulePing = (user_email, url, interval) => {
  const cronInterval = convertToCron(interval);
  const encodedUrl = encodeURIComponent(url);
  pingQueue.add(
    { user_email, url },
    {
      repeat: { cron: cronInterval },
      jobId: encodedUrl,
    }
  );
};

const processPingJobs = () => {
  // Processing the ping jobs in Bull queue
  pingQueue.process(async (job, done) => {
    const { url, user_email } = job.data;
    try {
      const start = Date.now();
      const response = await axios.get(url);
      const elapsedTime = Date.now() - start;

      await logService.createLog({
        url,
        status: response.status,
        responseTime: elapsedTime,
      });
      done(null, response);
    } catch (error) {
      if (error.isAxiosError) {
        let website = await websiteService.getWebsites({ url });
        website = website[0];
        await websiteService.updateWebsite(website._id, { status: "offline" });
        await sendEmail(user_email, "Server Down", "serverDown", {
          url,
          status: error.response?.status || 0,
        });
        await logService.createLog({
          url,
          status: error.response?.status || 0,
          responseTime: 0,
        });
      }
      done(error);
      throw error;
    }
  });
  console.log("🚀 Ping worker started");

  // Removing the completed job from the queue
  pingQueue.on("completed", async (job) => {
    try {
      await job.remove();
    } catch (error) {
      console.error("Error removing completed job:", error);
    }
  });
};

/// Function to delete a scheduled job by URL
const deleteScheduledJob = async (url) => {
  const encodedUrl = encodeURIComponent(url);
  const jobs = await pingQueue.getRepeatableJobs();

  const job = jobs.find((job) => job.id === encodedUrl);

  await pingQueue.removeRepeatableByKey(job.key);
};
module.exports = { schedulePing, processPingJobs, deleteScheduledJob };
