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
  },
});

module.exports = mongoose.model("Log", logSchema);
