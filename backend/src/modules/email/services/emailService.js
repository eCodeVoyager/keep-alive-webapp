const path = require("path");
const handlebars = require("handlebars");
const fs = require("fs");
const emailQueue = require("../../../config/emailQueue");
const transporter = require("../../../config/email");

/**
 * Sends an email by adding it to the Bull queue or directly using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} templateName - The name of the template file (without extension).
 * @param {Object} context - The context to be used in the email template.
 * @returns {Promise<Object>} The result of the email sending operation.
 */
const sendEmail = async (to, subject, templateName, context) => {
  try {
    // Read and compile template
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.html`
    );
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const html = template(context);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    let info;
    if (process.env.REDIS_HOST) {
      // Use queue if Redis is available
      info = await emailQueue.add({ mailOptions });
      console.log("Email queued for sending:", info.id);
      return { success: true, messageId: info.id, queued: true };
    } else {
      // Direct sending if Redis is not available
      info = await transporter.sendMail(mailOptions);
      console.log("Email sent directly:", info.messageId);
      return { success: true, messageId: info.messageId, queued: false };
    }
  } catch (error) {
    console.error("Error in sendEmail:", error);

    // Handle specific error types
    if (error.code === "ETIMEDOUT") {
      console.warn("Email connection timed out, will retry if queued");
      // If using queue, the job will be retried automatically
      return {
        success: false,
        error: "Connection timeout",
        retryable: true,
        queued: !!process.env.REDIS_HOST,
      };
    }

    if (error.code === "ECONNREFUSED") {
      console.warn("Email connection refused, will retry if queued");
      return {
        success: false,
        error: "Connection refused",
        retryable: true,
        queued: !!process.env.REDIS_HOST,
      };
    }

    // For template errors, don't retry
    if (error.code === "ENOENT") {
      return {
        success: false,
        error: "Email template not found",
        retryable: false,
      };
    }

    // For other errors, return generic error
    return {
      success: false,
      error: error.message || "Failed to send email",
      retryable: !!process.env.REDIS_HOST,
    };
  }
};

module.exports = sendEmail;
