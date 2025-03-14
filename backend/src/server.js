// src/server.js
require("dotenv").config();
const app = require("./app");
const http = require("http");
const { connectDB } = require("./database/mongoDB");
const { connectRedis } = require("./config/redis");
const processEmailJobs = require("./modules/email/services/emailWorker");
const { processPingJobs } = require("./jobs/pingJob");

// Create server
const server = http.createServer(app);

// Handle unexpected errors
process.on("uncaughtException", (error) => {
  console.error(`🔴 UNCAUGHT EXCEPTION: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error(`🔴 UNHANDLED REJECTION: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("🔄 Graceful shutdown initiated...");

  // Close server first to stop accepting new connections
  server.close(() => {
    console.log("✅ HTTP server closed");
  });

  // Then clean up other resources
  try {
    // Give active connections some time to finish
    setTimeout(async () => {
      try {
        await require("./database/mongoDB").disconnectDB();
        await require("./config/redis").disconnectRedis();
        console.log("✅ All connections closed properly");
        process.exit(0);
      } catch (err) {
        console.error(`❌ Error during cleanup: ${err.message}`);
        process.exit(1);
      }
    }, 1000);
  } catch (error) {
    console.error(`❌ Error during shutdown: ${error.message}`);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start the application
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis (if configured)
    await connectRedis();

    // Process Email Jobs (if Redis is configured)
    processEmailJobs();

    // Process Ping Jobs (for website monitoring)
    processPingJobs();

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();
