// src/modules/users/validations/userValidation.js

const Joi = require("joi");

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    isVerified: Joi.boolean(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
    id: Joi.string().length(24),
    email: Joi.string().email(),
  }),
};

module.exports = {
  updateUser,
  getUsers,
};
