const bcrypt = require("bcryptjs");

const User = require("./../models/user");
const CreditTransaction = require("./../models/creditTransaction");
const DebitTransaction = require("./../models/debitTransaction");

// TODO : status code  ! status

/**
 *  @desc transfer money
 *  @route POST /api/v1/transaction/transfer
 *  @access Private
 */

exports.transfer = async (
  { phoneNumber, amount, password, remark, user },
  recurrent
) => {
  const receiver_user = await User.findOne({
    phoneNumber,
  });

  if (!receiver_user) {
    throw new Error("Please enter correct phoneNumber");
  }

  if (user.balance < amount) {
    throw new Error("your balance is not enough");
  }

  //TODO:: wrong password  attempts

  let budgeted = false;

  for (const item of user.budget) {
    if (item.remark === remark) {
      budgeted = true;
      item.amount =
        parseFloat(item.amount) > parseFloat(amount) ? item.amount - amount : 0;
    }
  }

  if (!budgeted) {
    user.budget.push({ remark, amount, budgeted });
  }
  user.save({ validateBeforeSave: false });

  //validate the password is correct
  if (!recurrent && !(await bcrypt.compare(password, user.password))) {
    throw new Error("Incorrect password");
  }

  //   DebitTransaction for user
  const previousAmount = user.balance;
  const remainingAmount = user.balance - amount;
  const newuser = await User.findByIdAndUpdate(user.id, {
    balance: remainingAmount,
  }); //

  const debitTransaction = await DebitTransaction.create({
    user_id: user.id,
    budgeted: budgeted,
    remark: remark,
    receiver_user: receiver_user._id,
    transferAmount: amount,
    previousAmount: previousAmount,

    currentAmount: remainingAmount,
  });

  //creditTransaction

  const receiver_user_previousAmount = parseFloat(receiver_user.balance);
  const currentAmount = parseFloat(receiver_user.balance) + parseFloat(amount);
  await User.findByIdAndUpdate(receiver_user._id, {
    balance: currentAmount,
  }); //+balance TODO:.save()

  const creditTransaction = await CreditTransaction.create({
    user_id: receiver_user.id,
    send_user: user.id,
    remark: remark,
    transferAmount: amount,
    previousAmount: receiver_user_previousAmount,
    currentAmount: currentAmount,
  });

  return {
    status: "OK",
    newuser,
  };
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
