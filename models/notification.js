const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  user: String,
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
});

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;
