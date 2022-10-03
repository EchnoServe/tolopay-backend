const mongoose = require("mongoose");

// {
//     phoneNumber,
//     amount,
//     password,
//     remark,
//     user,
//   }

const recurrentTransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    require: true,
  },
  recurrent: String,
  amount: {
    type: Number,
    require: true,
  },
  account_number_from: {
    type: String,
    require: true,
  },
  account_number_to: {
    type: String,
    require: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  remark: {
    type: String,
  },
});

const RecurrentTransactionModel = mongoose.model(
  "recurrentTransaction",
  recurrentTransactionSchema
);

module.exports = RecurrentTransactionModel;
