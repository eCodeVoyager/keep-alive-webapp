
const router = require("express").Router();
const websitesController = require("../../controllers/websiteController");
const authorization = require("../../../../middleware/authMiddleware");
const validate = require("../../../../middleware/validatorMiddleware");
const websiteValidator = require("../../validations/websiteValidation");

// User-specific routes
router.get(
  "/me",
  authorization,
  validate(websiteValidator.getUserWebsites),
  websitesController.getLoggedInUserWebsites
);

// Website testing route - test a URL without adding to monitoring
router.get(
  "/test",
  authorization,
  validate(websiteValidator.testWebsite),
  websitesController.testWebsite
);

// Statistics and analytics routes
router.get(
  "/:id/stats",
  authorization,
  validate(websiteValidator.websiteStats),
  websitesController.getWebsiteStats
);

router.get(
  "/:id/history",
  authorization,
  validate(websiteValidator.websiteHistory),
  websitesController.getWebsiteHistory
);

// Manual ping route - force an immediate ping
router.get("/:id/ping", authorization, websitesController.pingWebsiteNow);

// Single website routes with ID parameter
router
  .route("/:id")
  .get(authorization, websitesController.getWebsite)
  .put(
    authorization,
    validate(websiteValidator.updateWebsite),
    websitesController.updateWebsite
  )
  .delete(authorization, websitesController.deleteWebsite);

// Basic CRUD routes
router
  .route("/")
  .get(
    authorization,
    websitesController.getWebsites // Admin only route - gets all websites
  )
  .post(
    authorization,
    validate(websiteValidator.addWebsite),
    websitesController.addWebsite
  );

module.exports = router;
