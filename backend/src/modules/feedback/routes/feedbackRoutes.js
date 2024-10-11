const router = require("express").Router();

const feedbackController = require("../controllers/feedbackController");
const feedbackValidation = require("../validations/feedbackValidation");
const authenticate = require("../../../middleware/authMiddleware");
const validate = require("../../../middleware/validatorMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(
    validate(feedbackValidation.getFeedbacks),
    feedbackController.getFeedbacks
  )
  .post(
    validate(feedbackValidation.createFeedback),
    feedbackController.createFeedback
  );

router
  .route("/:id")
  .get(validate(feedbackValidation.getFeedback), feedbackController.getFeedback)
  .delete(feedbackController.deleteFeedback);

module.exports = router;
