const websiteModel = require("./models/websiteModel");
const websiteValidation = require("./validations/websiteValidation");
const websiteService = require("./services/websiteService");
const websiteRoutes = require("./routes/v1/websiteRoutes");
const websiteController = require("./controllers/websiteController");

module.exports = {
  websiteModel,
  websiteValidation,
  websiteService,
  websiteRoutes,
  websiteController,
};
