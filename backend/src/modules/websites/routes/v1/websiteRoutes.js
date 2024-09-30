const router = require("express").Router();

const websitesController = require("../../controllers/websiteController");
const authorization = require("../../../../middleware/authMiddleware");
const validate = require("../../../../middleware/validatorMiddleware");
const websiteValidator = require("../../validations/websiteValidation");

router
  .route("/")
  .get(authorization, websitesController.getWebsites)
  .post(
    authorization,
    validate(websiteValidator.addWebsite),
    websitesController.addWebsite
  );

router.get("/me", authorization, websitesController.getLoggedInUserWebsites);

router
  .route("/:id")
  .get(authorization, websitesController.getWebsite)
  .put(
    authorization,
    validate(websiteValidator.updateWebsite),
    websitesController.updateWebsite
  )
  .delete(authorization, websitesController.deleteWebsite);

module.exports = router;
