const feedbackModel = require("../models/feedbackModel");

const createFeedback = async (feedbackData) => {
  try {
    const feedback = new feedbackModel(feedbackData);
    return await feedback.save();
  } catch (error) {
    throw error;
  }
};

const getFeedbacks = async (filter, select) => {
  try {
    return await feedbackModel.find({ filter }).select(select);
  } catch (error) {
    throw error;
  }
};

const getFeedback = async (id) => {
  try {
    return await feedbackModel.findById(id);
  } catch (error) {
    throw error;
  }
};

const updateFeedback = async (id, feedbackData) => {
  try {
    return await feedbackModel.findByIdAndUpdate(id, feedbackData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

const deleteFeedback = async (id) => {
  try {
    return await feedbackModel.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
