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
  receiver_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  transferAmount: {
    type: Number,
    require: true,
  },
  previousAmount: {
    type: Number,
    require: true,
  },
  currentAmount: {
    type: Number,
    require: true,
  },
  type: String,
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
