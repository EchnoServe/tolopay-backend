const bcrypt = require("bcryptjs");

const User = require("./../models/user");
const CreditTransaction = require("./../models/creditTransaction");
const DebitTransaction = require("./../models/debitTransaction");
const user = require("./../models/user");

// TODO : status code  ! status

/**
 *  @desc transfer money
 *  @route POST /api/v1/transaction/transfer
 *  @access Private
 */

exports.transfer = async (req, res, next) => {
  const user = req.user;
  const { phoneNumber, amount, password, remark } = req.body;
  if (!phoneNumber || !amount || !password) {
    return next(new Error("Please enter the fields in your form correctly"));
  }

  const receiver_user = await User.findOne({
    phoneNumber,
  });
  if (!receiver_user) {
    return next(new Error("Please enter correct phoneNumber"));
  }

  if (user.balance < amount) {
    return next(new Error("your balance is not enough"));
  }

  //TODO:: wrong password  attempts

  //validate the password is correct
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new Error("Incorrect password"));
  }

  //  the balance - and +
  const previousAmount = user.balance;
  const remainingAmount = user.balance - amount;
  await User.findByIdAndUpdate(user.id, {
    balance: remainingAmount,
  }); //

  //
  // create   transaction//
  const creditTransaction = await CreditTransaction.create({
    user_id: user.id,
    remark: remark,
    receiver_user: receiver_user._id,
    transferAmount: amount,
    previousAmount: previousAmount,
     
    currentAmount: remainingAmount,
    type: "credit",
  });

  //
  const receiver_user_previousAmount = parseFloat(receiver_user.balance);
  const currentAmount = parseFloat(receiver_user.balance) + parseFloat(amount);
  await User.findByIdAndUpdate(receiver_user._id, {
    balance: currentAmount,
  }); //+balance TODO:.save()

  await DebitTransaction.create({
    user_id: receiver_user.id,
    send_user: user.id,
    transferAmount: amount,
    previousAmount: receiver_user_previousAmount,
    currentAmount: currentAmount,
    remark:remark,
    type: "debit",
  });

  res.status(201).json({
    status: "OK",
    creditTransaction,
  });

  next();
};

/**
 *  @desc all user debit and credit transactions
 *  @route GET /api/v1/transaction/usertransactions
 *  @access Private
 */

exports.usertransactions = async (req, res, next) => {
  //TODO:multiple populate || aggregate

  const user = await User.findById(req.user.id)
    .populate("creditTransactions")
    .populate("debitTransactions");

  const transaction = [
    ...user.creditTransactions,
    ...user.debitTransactions,
  ].sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  res.status(200).json({
    transaction,
  });

  next();
};
