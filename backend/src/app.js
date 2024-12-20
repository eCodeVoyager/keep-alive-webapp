// src/app.js

require("dotenv").config();
const hpp = require("hpp");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const redis = require("./config/redis");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const getCorsOrigin = require("./utils/getCorsOrigin");
const mongoSanitize = require("express-mongo-sanitize");

// Import routes and middlewares
const { users, auth, websites, logs, feedback } = require("./index");
const { errorHandler, notFoundHandler } = require("./utils/errorHandler");

// Load environment variables from .env file

const app = express();

//Middlewares
const allMiddlewares = [
  morgan(process.env.LOGGER_LEVEL === "development" ? "dev" : "combined"),
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20000,
  }),
  mongoSanitize(),
  hpp(),
  cookieParser(),
  express.json(),
  cors({
    origin: getCorsOrigin(),
    credentials: true,
  }),
];

// Use middlewares
app.use(allMiddlewares);

//base route
app.get("/", (_, res) => {
  res.json({
    message: "Welcome to the DevShowcase API😀",
    status: "Success✅",
    server_status: "Working🆙",
    server_time: `${new Date().toLocaleString()}⌛`,
  });
});
// Use routes
app.use("/api/v1/auth", auth.authRoutes);
app.use("/api/v1/users", users.userRoutes);
app.use("/api/v1/websites", websites.websiteRoutes);
app.use("/api/v1/logs", logs.logRoutes);
app.use("/api/v1/feedbacks", feedback.feedbackRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
