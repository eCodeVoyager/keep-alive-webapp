//src/config/email.js
const nodemailer = require("nodemailer");
/**
 * Email configuration object with improved timeout and retry settings
 * @type {Object}
 * @property {string} service - The email service to use (e.g., 'gmail').
 * @property {string} host - The SMTP host.
 * @property {number} port - The SMTP port.
 * @property {boolean} secure - Whether to use SSL/TLS.
 * @property {Object} auth - The authentication object.
 * @property {string} auth.user - The email user.
 * @property {string} auth.pass - The email password.
 * @property {boolean} pool - Whether to use connection pooling.
 * @property {number} maxConnections - Maximum number of connections.
 * @property {number} maxMessages - Maximum number of messages per connection.
 * @property {number} connectionTimeout - Connection timeout in milliseconds.
 * @property {number} greetingTimeout - Greeting timeout in milliseconds.
 * @property {number} socketTimeout - Socket timeout in milliseconds.
 * @property {number} retries - Number of retry attempts.
 * @property {number} retryDelay - Delay between retry attempts in milliseconds.
 */
const emailConfig = {
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: process.env.EMAIL_POOL === "true",
  maxConnections: parseInt(process.env.EMAIL_MAX_CONNECTIONS, 10) || 5,
  maxMessages: parseInt(process.env.EMAIL_MAX_MESSAGES, 10) || 100,
  connectionTimeout:
    parseInt(process.env.EMAIL_CONNECTION_TIMEOUT, 10) || 10000,
  greetingTimeout: parseInt(process.env.EMAIL_GREETING_TIMEOUT, 10) || 5000,
  socketTimeout: parseInt(process.env.EMAIL_SOCKET_TIMEOUT, 10) || 10000,
  retries: parseInt(process.env.EMAIL_RETRIES, 10) || 3,
  retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY, 10) || 5000,
};

const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

module.exports = transporter;
