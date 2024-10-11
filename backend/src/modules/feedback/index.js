const feedbackController = require("./controllers/feedbackController");
const feedbackModel = require("./models/feedbackModel");
const feedbackRoutes = require("./routes/feedbackRoutes");
const feedbackService = require("./services/feedbackService");
const feedbackValidation = require("./validations/feedbackValidation");

module.exports = {
  feedbackController,
  feedbackModel,
  feedbackRoutes,
  feedbackService,
  feedbackValidation,
};
