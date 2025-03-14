const notificationController = require("./controllers/notificationController");
const notificationModel = require("./models/notificationModel");
const notificationRoutes = require("./routes/notificationRoutes");
const notificationService = require("./services/notificationService");
const notificationValidation = require("./validations/notificationValidation");

module.exports = {
  notificationController,
  notificationModel,
  notificationRoutes,
  notificationService,
  notificationValidation,
};
