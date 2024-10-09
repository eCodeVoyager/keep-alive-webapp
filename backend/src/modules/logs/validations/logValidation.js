const joi = require("joi");

const createLog = {
  body: joi.object().keys({
    url: joi.string().required(),
    status: joi.string().required(),
    responseTime: joi.number().required(),
  }),
};

module.exports = {
  createLog,
};
