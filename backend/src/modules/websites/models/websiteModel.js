const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owner_email: {
      type: String,
    },
    ping_time: {
      type: String,
    },
    status: {
      type: String,
    },
    notify_offline: {
      type: Boolean,
      default: true,
    },
    offline_ping_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Website", websiteSchema);
