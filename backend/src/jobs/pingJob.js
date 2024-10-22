require("dotenv").config();
const Queue = require("bull");
const axios = require("axios");
const logService = require("../modules/logs/services/logService");
const convertToCron = require("../utils/convertToCorn");
const sendEmail = require("../modules/email/services/emailService");
const websiteService = require("../modules/websites/services/websiteService");
const userService = require("../modules/users/services/userService");

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
    { url, user_email },
    {
      repeat: { cron: cronInterval },
      jobId: encodedUrl,
    }
  );
};

/// Function to delete a scheduled job by URL
const deleteScheduledJob = async (url) => {
  const encodedUrl = encodeURIComponent(url);
  const jobs = await pingQueue.getRepeatableJobs();

  const job = jobs.find((job) => job.id === encodedUrl);

  await pingQueue.removeRepeatableByKey(job.key);
};

const processPingJobs = () => {
  // Processing the ping jobs in Bull queue
  pingQueue.process(async (job, done) => {
    const { url, user_email } = job.data;

    try {
      let website = await websiteService.getWebsites({ url });
      website = website[0];

      const start = Date.now();
      const response = await axios.get(url);
      const elapsedTime = Date.now() - start;

      await logService.createLog({
        url,
        status: response.status,
        responseTime: elapsedTime,
      });

      if (website.status === "offline") {
        await websiteService.updateWebsite(website._id, {
          status: "online",
        });
        website.notify_offline = true;
        website.offline_ping_count = 0;
        await website.save();
      }

      done(null, {
        status: response.status,
        data: response.data,
        responseTime: elapsedTime,
      });
    } catch (error) {
      try {
        if (error.isAxiosError) {
          let website = await websiteService.getWebsites({ url });
          website = website[0];
          let user = await userService.getUsers({ email: user_email });
          user = user[0];

          website.offline_ping_count += 1;
          await websiteService.updateWebsite(website._id, {
            status: "offline",
          });

          if (website.notify_offline && user.website_offline_alart) {
            await sendEmail(user_email, "Server Down", "serverDown", {
              url,
              status: error.response?.status || 0,
            });
            website.notify_offline = false;
          }

          await logService.createLog({
            url,
            status: error.response?.status || 0,
            responseTime: 0,
          });

          if (
            website.offline_ping_count === 864 &&
            website.status === "offline"
          ) {
            await websiteService.deleteWebsite(website._id);
            await deleteScheduledJob(url);
            await logService.deleteLogs({ url });
          }
          await website.save();
        }

        done({
          message: error.message,
          status: error.response?.status || 0,
          data: error.response?.data || null,
        });
      } catch (internalError) {
        console.error("Error handling failed ping job:", internalError);
        done(internalError);
      }
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

module.exports = { schedulePing, processPingJobs, deleteScheduledJob };
