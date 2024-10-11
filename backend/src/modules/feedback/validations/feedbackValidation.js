const joi = require("joi");

const createFeedback = {
  body: joi.object().keys({
    rating: joi.number().required(),
    comment: joi.string().required(),
  }),
};

const getFeedbacks = {
  query: joi.object().keys({
    rating: joi.number(),
  }),
};

const getFeedback = {
  params: joi.object().keys({
    id: joi.string().required(),
  }),
};

const updateFeedback = {
  params: joi.object().keys({
    id: joi.string().required(),
  }),
  body: joi.object().keys({
    rating: joi.number().required(),
    comment: joi.string().required(),
  }),
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
};
