const ApiError = require("./apiError");

/**
 * Handle 404 errors for routes not found
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler for all express routes
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || [];
  let errorCode = err.errorCode || "SERVER_ERROR";

  // Log errors in development
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", err);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errorCode = "VALIDATION_ERROR";
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
    errorCode = "DUPLICATE_KEY";

    // Extract field name from error message
    const field = Object.keys(err.keyValue)[0];
    errors = [
      {
        field,
        message: `${field} already exists with value ${err.keyValue[field]}`,
      },
    ];
  }

  // Handle Mongoose cast errors (invalid IDs)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errorCode = "INVALID_ID";
    errors = [
      {
        field: err.path,
        message: `${err.path} is not a valid ID`,
      },
    ];
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errorCode = "INVALID_TOKEN";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errorCode = "TOKEN_EXPIRED";
  }

  // Return error response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errorCode,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
