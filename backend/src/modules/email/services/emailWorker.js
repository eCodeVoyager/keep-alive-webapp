const emailQueue = require("../../../config/emailQueue");
const transporter = require("../../../config/email");

/**
 * Processes email jobs from the Bull queue.
 */
const processEmailJobs = () => {
  emailQueue.process(async (job, done) => {
    const { mailOptions } = job.data;
    try {
      let info = await transporter.sendMail(mailOptions);
      done(null, info);
    } catch (error) {
      console.error("Error sending email: ", error);
      done(error);
    }
  });

  emailQueue.on("completed", async (job) => {
    try {
      await job.remove({ timeout: 5000 });
    } catch (error) {
      console.error("Error removing completed job:", error);
    }
  });

  console.log("🚀 Email worker started");
};

module.exports = processEmailJobs;
