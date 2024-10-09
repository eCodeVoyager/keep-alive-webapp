const logModel = require("./models/logModel");
const logService = require("./services/logService");
const logController = require("./controllers/logController");
const logRoutes = require("./routes/logRoutes");
const logValidation = require("./validations/logValidation");

module.exports = {
  logModel,
  logService,
  logController,
  logRoutes,
  logValidation,
};
