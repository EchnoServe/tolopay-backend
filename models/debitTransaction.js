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
  send_user: String,
  transferAmount: Number,
  previousAmount: Number,
  currentAmount: Number,
  type: String,
});

const debitTransactionModel = mongoose.model(
  "debitTransaction",
  transactionSchema
);

module.exports = debitTransactionModel;
