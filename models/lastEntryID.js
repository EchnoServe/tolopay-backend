const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    lastEntry: {
      type: Number,
    }
  }
);

const lastEntryID = mongoose.model("lastentry", userSchema);
module.exports = lastEntryID;
