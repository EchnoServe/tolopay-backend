const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  remark: {
    type: String,
    require: true,
  },
  send_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  transferAmount: Number,
  previousAmount: Number,
  currentAmount: Number,
  type: String,
});

creditTransactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "send_user",
    select: "name",
  });
  next();
});

const creditTransactionModel = mongoose.model(
  "creditTransaction",
  creditTransactionSchema
);

module.exports = creditTransactionModel;
