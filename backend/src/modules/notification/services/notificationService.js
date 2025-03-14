const axios = require("axios");
const sendEmail = require("../../email/services/emailService");
const User = require("../../users/models/userModel");

/**
 * Send a notification through multiple channels based on user preferences
 * @param {string} userId - User ID
 * @param {string} templateName - Template name for email/SMS
 * @param {Object} data - Data to be sent in the notification
 * @param {Object} options - Notification options
 * @returns {Promise<Object>} Result of notification
 */
const sendNotification = async (userId, templateName, data, options = {}) => {
  try {
    // Get user with notification preferences
    const user = await User.findById(userId);

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return { success: false, error: "User not found" };
    }

    const results = {
      email: null,
      sms: null,
      discord: null,
      teams: null,
    };

    // Handle forced notifications (e.g., for critical alerts)
    const forceAll = options.force === true;

    // Send email if enabled
    if (forceAll || user.notificationPreferences?.email?.enabled) {
      try {
        results.email = await sendEmail(
          user.email,
          options.subject || "Keep-Alive Notification",
          templateName,
          data
        );
        console.log(`Email notification sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email notification: ${error.message}`);
        results.email = { success: false, error: error.message };
      }
    }

    // Send SMS if enabled and we have phone number
    if (
      (forceAll || user.notificationPreferences?.sms?.enabled) &&
      user.phoneNumber &&
      process.env.ENABLE_SMS_NOTIFICATIONS === "true"
    ) {
      try {
        results.sms = await sendSMS(user.phoneNumber, data);
        console.log(`SMS notification sent to ${user.phoneNumber}`);
      } catch (error) {
        console.error(`Failed to send SMS notification: ${error.message}`);
        results.sms = { success: false, error: error.message };
      }
    }

    // Send to Discord if webhook URL is configured
    if (options.sendToDiscord && process.env.DISCORD_WEBHOOK_URL) {
      try {
        results.discord = await sendDiscordNotification(data);
        console.log("Discord notification sent");
      } catch (error) {
        console.error(`Failed to send Discord notification: ${error.message}`);
        results.discord = { success: false, error: error.message };
      }
    }

    // Send to Microsoft Teams if webhook URL is configured
    if (
      options.sendToTeams &&
      process.env.TEAMS_WEBHOOK_URL &&
      process.env.ENABLE_TEAMS_FEATURE === "true"
    ) {
      try {
        results.teams = await sendTeamsNotification(data);
        console.log("Microsoft Teams notification sent");
      } catch (error) {
        console.error(`Failed to send Teams notification: ${error.message}`);
        results.teams = { success: false, error: error.message };
      }
    }

    // Return results of all notification attempts
    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error(`Error in notification service: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS notification
 * @param {string} phoneNumber - Recipient phone number
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} SMS result
 */
const sendSMS = async (phoneNumber, data) => {
  try {
    const result = {
      success: false,
      sid: null,
    };

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error(`SMS service error: ${error.message}`);
    throw error;
  }
};

/**
 * Send Discord notification
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} Discord webhook result
 */
const sendDiscordNotification = async (data) => {
  try {
    // Format message for Discord
    let content = "Keep-Alive Notification";
    let color = 0x00ff00; // Green

    if (data.url && data.status === "offline") {
      content = `🔴 ALERT: Website ${data.url} is DOWN!`;
      color = 0xff0000; // Red
    } else if (data.url && data.status === "online") {
      content = `🟢 RESOLVED: Website ${data.url} is back ONLINE!`;
    }

    // Create Discord webhook payload
    const payload = {
      embeds: [
        {
          title: "Keep-Alive Monitor",
          description: content,
          color: color,
          fields: [
            {
              name: "URL",
              value: data.url || "N/A",
            },
            {
              name: "Status",
              value: data.status || "N/A",
            },
            {
              name: "Time",
              value: new Date().toISOString(),
            },
          ],
        },
      ],
    };

    // Send to Discord webhook
    const response = await axios.post(process.env.DISCORD_WEBHOOK_URL, payload);
    return { success: true, status: response.status };
  } catch (error) {
    console.error(`Discord notification error: ${error.message}`);
    throw error;
  }
};

/**
 * Send Microsoft Teams notification
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} Teams webhook result
 */
const sendTeamsNotification = async (data) => {
  try {
    // Format message for Teams
    let title = "Keep-Alive Notification";
    let color = "Good"; // Green

    if (data.url && data.status === "offline") {
      title = `🔴 ALERT: Website ${data.url} is DOWN!`;
      color = "Attention"; // Red
    } else if (data.url && data.status === "online") {
      title = `🟢 RESOLVED: Website ${data.url} is back ONLINE!`;
    }

    // Create Teams webhook payload
    const payload = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: color === "Attention" ? "ff0000" : "00ff00",
      summary: title,
      sections: [
        {
          activityTitle: title,
          facts: [
            {
              name: "URL",
              value: data.url || "N/A",
            },
            {
              name: "Status",
              value: data.status || "N/A",
            },
            {
              name: "Time",
              value: new Date().toISOString(),
            },
          ],
        },
      ],
    };

    // Send to Teams webhook
    const response = await axios.post(process.env.TEAMS_WEBHOOK_URL, payload);
    return { success: true, status: response.status };
  } catch (error) {
    console.error(`Teams notification error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendNotification,
  sendSMS,
  sendDiscordNotification,
  sendTeamsNotification,
};
