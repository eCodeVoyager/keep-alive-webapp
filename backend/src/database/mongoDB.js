const mongoose = require("mongoose");

// State variables
let isConnected = false;
let connectionAttempts = 0;
const maxConnectionAttempts = 5;

/**
 * Connect to MongoDB with improved error handling
 * @returns {Promise<mongoose.Connection>} Mongoose connection
 */
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MongoDB URI is not defined in environment variables");
  }

  try {
    // Set mongoose options
    mongoose.set("strictQuery", true);
    mongoose.set("debug", process.env.MONGO_DEBUG_MODE === "true");

    // Configure connection options
    const options = {
      autoIndex: process.env.NODE_ENV !== "production", // Don't build indexes in production
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, avoid issues with IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;
    connectionAttempts = 0;

    // Set up event listeners
    _setupEventListeners();

    console.log(`🎯 MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    connectionAttempts++;
    const shouldRetry = connectionAttempts < maxConnectionAttempts;

    console.error(`🔴 MongoDB Connection Error: ${error.message}`);

    if (shouldRetry) {
      console.log(
        `⏳ Retrying MongoDB connection (${connectionAttempts}/${maxConnectionAttempts})...`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return connectDB();
    }

    // If maximum retries reached, exit process
    console.error(
      "💥 Failed to connect to MongoDB after multiple attempts. Exiting..."
    );
    process.exit(1);
  }
};

/**
 * Set up MongoDB connection event listeners
 * @private
 */
const _setupEventListeners = () => {
  mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log("🟢 MongoDB connected");
  });

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.log("🟠 MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`🔴 MongoDB error: ${err.message}`);
  });

  // Handle application termination
  process.on("SIGINT", disconnectDB);
  process.on("SIGTERM", disconnectDB);
};

/**
 * Disconnect from MongoDB gracefully
 */
const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      console.log("👋 MongoDB disconnected gracefully");
    } catch (error) {
      console.error(`🔴 Error disconnecting from MongoDB: ${error.message}`);
    }
  }
};

/**
 * Get current connection status
 * @returns {Object} Connection status information
 */
const getStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    status: ["disconnected", "connected", "connecting", "disconnecting"][
      mongoose.connection.readyState
    ],
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  getStatus,
};
