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
      await job.remove();
      done(null, info);
    } catch (error) {
      console.error("Error sending email: ", error);
      done(error);
    }
  });

  console.log("🚀 Email worker started");
};

module.exports = processEmailJobs;
