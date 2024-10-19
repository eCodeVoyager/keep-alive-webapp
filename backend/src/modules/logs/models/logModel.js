const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  status: {
    type: String,
  },
  responseTime: {
    type: Number,
  },
  pingAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 3, // 3 days
  },
});

module.exports = mongoose.model("Log", logSchema);
