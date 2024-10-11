const httpStatus = require("http-status");
const ApiError = require("../../../utils/apiError");
const ApiResponse = require("../../../utils/apiResponse");
const feedbackService = require("../services/feedbackService");

const createFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.createFeedback({
      ...req.body,
      user: req.user.id,
      user_email: req.user.email,
    });
    return res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          feedback,
          "Feedback created successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await feedbackService.getFeedbacks(req.query);
    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          feedbacks,
          "Feedbacks retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedback(req.params.id);
    if (!feedback) {
      throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          feedback,
          "Feedback retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const updateFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedback(req.params.id);

    if (!feedback) {
      throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }
    if (feedback.user.toString() !== req.user.id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized request");
    }
    const updatedFeedback = await feedbackService.updateFeedback(
      req.params.id,
      req.body
    );
    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedFeedback,
          "Feedback updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedback(req.params.id);
    if (!feedback) {
      throw new ApiError(httpStatus.NOT_FOUND, "Feedback not found");
    }
    if (feedback.user.toString() !== req.user.id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized request");
    }
    await feedbackService.deleteFeedback(req.params.id);
    return res
      .status(httpStatus.NO_CONTENT)
      .json(
        new ApiResponse(
          httpStatus.NO_CONTENT,
          null,
          "Feedback deleted successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
