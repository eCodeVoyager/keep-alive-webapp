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
    `${frontendUrl}/auth/${
      req.user.oauth ? "github" : "google"
    }/callback?token=${accessToken}&refreshToken=${refreshToken}`
  );
};

module.exports = router;
