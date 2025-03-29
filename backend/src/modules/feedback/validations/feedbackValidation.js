const joi = require("joi");

const createFeedback = {
  body: joi.object().keys({
    rating: joi.number().required().min(1).max(5).messages({
      "number.base": "Rating must be a number",
      "number.empty": "Rating is required",
      "number.min": "Rating must be between 1 and 5",
      "number.max": "Rating must be between 1 and 5",
      "any.required": "Rating is required",
    }),
    comment: joi.string().required().trim().max(1000).messages({
      "string.base": "Comment must be a string",
      "string.empty": "Comment is required",
      "string.max": "Comment cannot exceed 1000 characters",
      "any.required": "Comment is required",
    }),
    feedbackType: joi
      .string()
      .valid("bug", "suggestion", "complaint", "praise")
      .required()
      .messages({
        "string.base": "Feedback type must be a string",
        "string.empty": "Feedback type is required",
        "any.only":
          "Feedback type must be one of: bug, suggestion, complaint, praise",
        "any.required": "Feedback type is required",
      }),
  }),
};

const getFeedbacks = {
  query: joi.object().keys({
    rating: joi.number().min(1).max(5),
    feedbackType: joi
      .string()
      .valid("bug", "suggestion", "complaint", "praise"),
    status: joi.string().valid("pending", "reviewed", "resolved", "rejected"),
    page: joi.number().min(1),
    limit: joi.number().min(1).max(100),
  }),
};

const getFeedback = {
  params: joi.object().keys({
    id: joi.string().required().messages({
      "string.empty": "Feedback ID is required",
      "any.required": "Feedback ID is required",
    }),
  }),
};

const updateFeedback = {
  params: joi.object().keys({
    id: joi.string().required().messages({
      "string.empty": "Feedback ID is required",
      "any.required": "Feedback ID is required",
    }),
  }),
  body: joi
    .object()
    .keys({
      rating: joi.number().min(1).max(5),
      comment: joi.string().trim().max(1000),
      feedbackType: joi
        .string()
        .valid("bug", "suggestion", "complaint", "praise"),
      status: joi.string().valid("pending", "reviewed", "resolved", "rejected"),
    })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update",
    }),
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
};
