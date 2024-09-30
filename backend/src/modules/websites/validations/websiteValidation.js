const Joi = require("joi");

const addWebsite = {
  body: Joi.object().keys({
    url: Joi.string().required(),
    ping_time: Joi.string().required(),
    status: Joi.string().default("working"),
  }),
};

const updateWebsite = {
  body: Joi.object().keys({
    url: Joi.string(),
    ping_time: Joi.string(),
    status: Joi.string(),
  }),
};

module.exports = {
  addWebsite,
  updateWebsite,
};
