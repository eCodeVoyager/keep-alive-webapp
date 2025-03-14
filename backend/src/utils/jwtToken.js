const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

/**
 * Generate a JWT access token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || "user",
    jti: uuidv4(), // JWT unique identifier
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE || "1h",
  });
};

/**
 * Generate a JWT refresh token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    type: "refresh",
    jti: uuidv4(), // JWT unique identifier for refresh token
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE || "7d",
  });
};

/**
 * Verify a JWT access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

/**
 * Verify a JWT refresh token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error(`Invalid refresh token: ${error.message}`);
  }
};

/**
 * Generate a token set (access + refresh)
 * @param {Object} user - User object
 * @returns {Object} Object containing tokens
 */
const generateTokenSet = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.ACCESS_TOKEN_LIFE || "1h",
  };
};

/**
 * Create an API key token
 * @param {string} userId - User ID
 * @param {Array} permissions - List of permissions
 * @returns {string} API key
 */
const generateApiKey = (userId, permissions = ["read"]) => {
  const payload = {
    id: userId,
    type: "apikey",
    permissions,
    jti: uuidv4(),
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1y", // API keys last longer
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenSet,
  generateApiKey,
};
