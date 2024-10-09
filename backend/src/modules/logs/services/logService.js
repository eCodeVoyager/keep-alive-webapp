const logModel = require("../models/logModel");

const getLogs = async (url) => {
  try {
    return await logModel.find({ url });
  } catch (error) {
    throw error;
  }
};
const createLog = async (log) => {
  try {
    return await logModel.create(log);
  } catch (error) {
    throw error;
  }
};

const deleteLogs = async (url) => {
  try {
    return await logModel.deleteMany({ url });
  } catch (error) {
    throw error;
  }
};

module.exports = { getLogs, createLog, deleteLogs };
