// src/app.js
require("dotenv").config();
const hpp = require("hpp");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const getCorsOrigin = require("./utils/getCorsOrigin");
const mongoSanitize = require("express-mongo-sanitize");
const setupPassport = require("./config/passport");

// Import routes
const { users, auth, websites, logs, feedback } = require("./index");
const oauthRoutes = require("./modules/auth/routes/v1/oauthRoutes");
const { errorHandler, notFoundHandler } = require("./utils/errorHandler");

// Initialize app
const app = express();

// Initialize passport
setupPassport();

// Standard middlewares
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
  })
);
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: getCorsOrigin(),
    credentials: true,
  })
);

// Passport middleware
app.use(passport.initialize());

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "2.0.0",
  });
});

// Base route
app.get("/", (_, res) => {
  res.json({
    name: "Keep Alive API",
    version: process.env.API_VERSION || "v2",
    status: "Running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API prefix
const API_PREFIX = `/api/${process.env.API_VERSION || "v2"}`;

// Routes
app.use(`${API_PREFIX}/auth`, auth.authRoutes);
app.use(`${API_PREFIX}/auth`, oauthRoutes); // OAuth routes
app.use(`${API_PREFIX}/users`, users.userRoutes);
app.use(`${API_PREFIX}/websites`, websites.websiteRoutes);
app.use(`${API_PREFIX}/logs`, logs.logRoutes);
app.use(`${API_PREFIX}/feedbacks`, feedback.feedbackRoutes);

// Swagger documentation if enabled
if (process.env.ENABLE_SWAGGER_DOCS === "true") {
  const swaggerUi = require("swagger-ui-express");
  const YAML = require("yamljs");
  const swaggerDocument = YAML.load("./swagger.yaml");

  app.use(
    `${API_PREFIX}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

  console.log(`📖 Swagger docs available at ${API_PREFIX}/docs`);
}

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
