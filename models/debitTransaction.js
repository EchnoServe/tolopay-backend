const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
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

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "send_user",
    select: "name",
  });
  next();
});

const debitTransactionModel = mongoose.model(
  "debitTransaction",
  transactionSchema
);

module.exports = debitTransactionModel;
