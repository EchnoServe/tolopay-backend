const bcrypt = require("bcryptjs");

const User = require("./../models/user");
const CreditTransaction = require("./../models/creditTransaction");
const DebitTransaction = require("./../models/debitTransaction");
const user = require("./../models/user");

//when two companies transact with one another say Company A buys something from Company B then Company A will record a decrease in cash (a Credit), and Company B will record an increase in cash (a Debit).
// TODO : status code  ! status

/**
 *  @desc transfer money
 *  @route POST /api/v1/transaction/transfer
 *  @access Private
 */

exports.transfer = async (req, res, next) => {
  //TODO: transfer by account number or phone number

  //check if the user input all fields
  const user = req.user;
  const { receiver_user_email, amount, password, remark } = req.body;
  if (!receiver_user_email || !amount || !password) {
    return next(new Error("Please enter the fields in your form correctly"));
  }

  //check if  a given  receiver exists
  const receiver_user = await User.findOne({ email: receiver_user_email });
  if (!receiver_user) {
    return next(new Error("Please enter correct email "));
  }
  //?// check the user  balance is good
  //if a user has not enough balance to send
  if (user.balance < amount) {
    return next(new Error("your balance is not enough"));
  }

  //TODO: wrong password  attempts

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
    remainingAmount: remainingAmount,
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
  //TODO:multiple populate may decrease performance ?aggregate

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
