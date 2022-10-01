const mongoose = require("mongoose");

const debitTransactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  remark: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  budgeted: Boolean,
  receiver_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  remark: String,
  transferAmount: Number,
  previousAmount: Number,
  currentAmount: Number,
  type: { type: String, default: "debit" },
});

debitTransactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "receiver_user",
    select: "name",
  });
  next();
});
const debitTransactionModel = mongoose.model(
  "debitTransaction",
  debitTransactionSchema
);

module.exports = debitTransactionModel;
