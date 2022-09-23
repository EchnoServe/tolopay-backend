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
  receiver_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  transferAmount: Number,
  previousAmount: Number,
  currentAmount: Number,
  type: String,
});

const creditTransactionModel = mongoose.model(
  "creditTransaction",
  transactionSchema
);

module.exports = creditTransactionModel;
