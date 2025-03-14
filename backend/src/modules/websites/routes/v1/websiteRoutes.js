/**
 * Website routes configuration
 * Defines all API endpoints related to website monitoring
 */
const router = require("express").Router();
const websitesController = require("../../controllers/websiteController");
const authorization = require("../../../../middleware/authMiddleware");
const validate = require("../../../../middleware/validatorMiddleware");
const websiteValidator = require("../../validations/websiteValidation");

// Basic CRUD routes
router
  .route("/")
  .get(authorization, websitesController.getWebsites) // Admin only route - gets all websites
  .post(
    authorization,
    validate(websiteValidator.addWebsite),
    websitesController.addWebsite
  );

// User-specific routes
router.get(
  "/me",
  authorization,
  validate(websiteValidator.getUserWebsites),
  websitesController.getLoggedInUserWebsites
);

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
router.post("/:id/ping", authorization, websitesController.pingWebsiteNow);

module.exports = router;
