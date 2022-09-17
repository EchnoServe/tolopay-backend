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
  data: Date,
  receiver_user: String,
  transferAmount: Number,
  previousAmount: Number,
  remainingAmount: Number,
});

const creditTransactionModel = mongoose.model(
  "creditTransaction",
  transactionSchema
);

module.exports = creditTransactionModel;
