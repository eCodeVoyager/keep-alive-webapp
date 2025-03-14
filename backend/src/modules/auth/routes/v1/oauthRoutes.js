const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("../../../../utils/jwtToken");

/**
 * @route GET /api/v2/auth/google
 * @desc Authenticate with Google
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @route GET /api/v2/auth/google/callback
 * @desc Google OAuth callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    handleOAuthSuccess(req, res);
  }
);

/**
 * @route GET /api/v2/auth/github
 * @desc Authenticate with GitHub
 * @access Public
 */
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

/**
 * @route GET /api/v2/auth/github/callback
 * @desc GitHub OAuth callback
 * @access Public
 */
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    handleOAuthSuccess(req, res);
  }
);

/**
 * Common handler for OAuth success
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const handleOAuthSuccess = (req, res) => {
  // Generate tokens
  const accessToken = jwt.generateAccessToken(req.user);
  const refreshToken = jwt.generateRefreshToken(req.user);

  // Store refresh token with the user
  req.user.refreshToken = refreshToken;
  req.user.save();

  // Set cookie with access token
  const cookieOptions = {
    httpOnly: process.env.AUTH_COOKIE_HTTP_ONLY === "true",
    secure: process.env.AUTH_COOKIE_SECURE === "true",
    sameSite: process.env.AUTH_COOKIE_SAME_SITE || "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res.cookie("token", accessToken, cookieOptions);

  // Redirect to dashboard with success
  res.redirect(
    `${process.env.CLIENT_URL.split(",")[0]}/dashboard?login=success`
  );
};

module.exports = router;
