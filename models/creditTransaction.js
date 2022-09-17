const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  remark: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  receiver_user: String,
  transferAmount: Number,
  previousAmount: Number,
  remainingAmount: Number,
  type: String,
});

const creditTransactionModel = mongoose.model(
  "creditTransaction",
  transactionSchema
);

module.exports = creditTransactionModel;
