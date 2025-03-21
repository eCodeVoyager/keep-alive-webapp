const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("../../../../utils/jwtToken");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

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

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

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

const handleOAuthSuccess = (req, res) => {
  const accessToken = jwt.generateAccessToken(req.user);
  const refreshToken = jwt.generateRefreshToken(req.user);

  req.user.refreshToken = refreshToken;
  req.user.save();

  const frontendUrl = process.env.FRONTEND_URL;
  res.redirect(
    `${frontendUrl}/auth/github/callback?accessToken=${accessToken}&refreshToken=${refreshToken}}`
  );
};

// Add this to your oauthRoutes.js file
router.get("/logout", (req, res) => {
  // Clear the HTTP-only cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.AUTH_COOKIE_SECURE === "true",
    sameSite: process.env.AUTH_COOKIE_SAME_SITE || "lax",
  });

  // Clear any other auth-related cookies
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.AUTH_COOKIE_SECURE === "true",
    sameSite: process.env.AUTH_COOKIE_SAME_SITE || "lax",
  });

  // Send success response
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
