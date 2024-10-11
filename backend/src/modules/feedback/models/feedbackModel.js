const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    rating: Number,
    comment: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user_email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
