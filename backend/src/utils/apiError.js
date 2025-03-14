/**
 * Custom error class for handling API errors with error codes
 */
class ApiError extends Error {
  /**
   * Create a new API error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {string} errorCode - Error code for client-side handling
   * @param {Array} errors - Additional error details
   */
  constructor(statusCode, message, errorCode = null, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.errorCode = errorCode || this._generateErrorCode(statusCode);

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Generate an error code based on status code
   * @param {number} statusCode - HTTP status code
   * @returns {string} Generated error code
   */
  _generateErrorCode(statusCode) {
    const codeMap = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "VALIDATION_ERROR",
      429: "TOO_MANY_REQUESTS",
      500: "SERVER_ERROR",
    };

    return codeMap[statusCode] || "UNKNOWN_ERROR";
  }

  /**
   * Create a bad request error (400)
   * @param {string} message - Error message
   * @param {Array} errors - Error details
   * @returns {ApiError} Error instance
   */
  static badRequest(message, errors = []) {
    return new ApiError(400, message, "BAD_REQUEST", errors);
  }

  /**
   * Create an unauthorized error (401)
   * @param {string} message - Error message
   * @returns {ApiError} Error instance
   */
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message, "UNAUTHORIZED");
  }

  /**
   * Create a forbidden error (403)
   * @param {string} message - Error message
   * @returns {ApiError} Error instance
   */
  static forbidden(message = "Forbidden") {
    return new ApiError(403, message, "FORBIDDEN");
  }

  /**
   * Create a not found error (404)
   * @param {string} message - Error message
   * @returns {ApiError} Error instance
   */
  static notFound(message = "Resource not found") {
    return new ApiError(404, message, "NOT_FOUND");
  }

  /**
   * Create a conflict error (409)
   * @param {string} message - Error message
   * @returns {ApiError} Error instance
   */
  static conflict(message = "Resource already exists") {
    return new ApiError(409, message, "CONFLICT");
  }

  /**
   * Create a validation error (422)
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors
   * @returns {ApiError} Error instance
   */
  static validation(message = "Validation error", errors = []) {
    return new ApiError(422, message, "VALIDATION_ERROR", errors);
  }

  /**
   * Create a rate limit error (429)
   * @param {string} message - Error message
   * @returns {ApiError} Error instance
   */
  static rateLimit(message = "Too many requests") {
    return new ApiError(429, message, "TOO_MANY_REQUESTS");
  }

  /**
   * Create a server error (500)
   * @param {string} message - Error message
   * @returns {ApiError} Error instance
   */
  static internal(message = "Internal server error") {
    return new ApiError(500, message, "SERVER_ERROR");
  }
}

module.exports = ApiError;
