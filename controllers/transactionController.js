const User = require("./../models/user");
const CreditTransaction = require("./../models/creditTransaction");
const DebitTransaction = require("./../models/debitTransaction");
const bcrypt = require("bcryptjs");

//when two companies transact with one another say Company A buys something from Company B then Company A will record a decrease in cash (a Credit), and Company B will record an increase in cash (a Debit).
// ! status code

const user_id = "6323d5a842a651236f124d46"; //sender

exports.transfer = async (req, res, next) => {
  //? check the user id object.type.id
  //check if their is a given  username / user_id
  try {
    const { receiver_user_email, amount, password, remark } = req.body;
    if (!receiver_user_email || !amount || !password) {
      return next(new Error("enter the requirement"));
    }

    const receiver_user = await User.findOne({ email: receiver_user_email });
    if (!receiver_user) {
      return next(new Error("their is no  a user with is email"));
    }
    //?// check the user  balance is gook
    const send_user = await User.findById(user_id).select("+password");

    if (send_user.balance < amount) {
      return next(new Error("In balance ", 404)); //bad req
    }

    //!check if the password is correct
    //attempt ??????
    //attempt = {
    // date:Date.now(),
    //attempt_number:1++,
    //}

    /*
    if(attempt.date === Date && attempt_number > 7){
      user.active = false,
      user.save()
    }
    */

    if (!send_user || !(await bcrypt.compare(password, send_user.password))) {
      return next(new Error("Incorrect password", 401));
    }

    //  the balance - and +
    const previousAmount = send_user.balance;
    const remainingAmount = send_user.balance - amount;
    const update_user = await User.findByIdAndUpdate(send_user.id, {
      balance: remainingAmount,
    }); //
    ///
    const receiver_user_previousAmount = parseFloat(receiver_user.balance);
    const currentAmount =
      parseFloat(receiver_user.balance) + parseFloat(amount);

    const update_reciever_user = await User.findByIdAndUpdate(
      receiver_user._id,
      { balance: currentAmount }
    ); //+balance

    // create credit and debit transaction//
    const creditTransaction = await CreditTransaction.create({
      user_id: user_id,
      remark: remark,
      receiver_user: receiver_user._id,
      transferAmount: amount,
      previousAmount: previousAmount,
      remainingAmount: remainingAmount,
      type: "credit",
    });

    const debitTransaction = await DebitTransaction.create({
      user_id: receiver_user._id,
      send_user: user_id,
      transferAmount: amount,
      previousAmount: receiver_user_previousAmount,
      currentAmount: currentAmount,
      type: "debit",
    });

    // balance
    //res ->credit

    res.status(201).json({
      status: "OK",
      creditTransaction,
    });
  } catch (ex) {
    res.status(404).json({
      status: "fail",
      data: {
        errorMessage: ex.message,
      },
    });
  }

  next();
};

exports.usertransactions = async (req, res, next) => {
  const user = await User.findById(user_id)
    .populate("creditTransactions")
    .populate("debitTransactions");

  res.status(200).json({
    user,
  });

  next();
};
