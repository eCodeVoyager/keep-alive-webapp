// logsController code

const logsService = require("../services/logService");
const ApiResponse = require("../../../utils/apiResponse");
const httpStatus = require("http-status");

const getLogs = async (req, res, next) => {
  try {
    const logs = await logsService.getLogs(req.query.url);
    return res.json(new ApiResponse(httpStatus.OK, logs));
  } catch (error) {
    return next(error);
  }
};

const deleteLogs = async (req, res, next) => {
  try {
    const logs = await logsService.deleteLogs(req.query.url);
    return res.json(new ApiResponse(httpStatus.OK, logs));
  } catch (error) {
    return next(error);
  }
};

module.exports = { getLogs, deleteLogs };
