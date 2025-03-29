const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    feedbackType: {
      type: String,
      required: true,
      enum: ["bug", "suggestion", "complaint", "praise"],
      default: "suggestion",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
feedbackSchema.index({ user: 1 });
feedbackSchema.index({ feedbackType: 1 });
feedbackSchema.index({ status: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
