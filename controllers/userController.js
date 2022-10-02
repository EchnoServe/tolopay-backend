const mongoose = require("mongoose");
const User = require("./../models/user");
const CreditTransaction = require("./../models/creditTransaction");
const DebitTransaction = require("./../models/debitTransaction");

/**
 *  @desc  user profile
 *  @route GET  /api/v1/users/me
 *  @access Private
 */

exports.me = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "OK",
    data: {
      user,
    },
  });
};

/**
 *  @desc  save budget and planning
 *  @route PUT  /api/v1/users/addbudget
 *  @access Private
 */

exports.addBudget = async (req, res, next) => {
  // {
  //   "remark": "For Food",
  //   "amount": "400"
  // }

  if (!req.body) {
    return next(new Error("Please enter the fields in your form correctly"));
  }
  //TODO:check balances

  let budgeted_before = false;

  for (const item of req.user.budget) {
    if (item.remark === req.body.remark) {
      budgeted_before = true;
      item.amount = item.amount + req.body.amount;
      req.user.save({ validateBeforeSave: false });
    }
  }

  let newuser;

  if (!budgeted_before) {
    newuser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { budget: req.body },
      },
      {
        new: true,
      }
    );
  }

  res.status(201).json({
    status: "OK",
    data: {
      user: newuser,
    },
  });
};

/**
 *  @desc  upload a user profile image
 *  @route POST  /api/v1/users/profileimage
 *  @access Private
 */

exports.moneyout = async (req, res, next) => {
  const moneyout = await DebitTransaction.aggregate([
    {
      $match: { user_id: mongoose.Types.ObjectId(req.user.id) },
    },
    {
      $group: {
        _id: "$user_id",
        total: { $sum: "$transferAmount" },
      },
    },
  ]);

  res.status(200).json({
    status: "OK",
    data: {
      moneyout,
    },
  });
};

exports.moneyin = async (req, res, next) => {
  const moneyin = await CreditTransaction.aggregate([
    {
      $match: { user_id: mongoose.Types.ObjectId(req.user.id) },
    },
    {
      $group: {
        _id: "$user_id",
        total: { $sum: "$transferAmount" },
      },
    },
  ]);

  res.status(200).json({
    status: "OK",
    data: {
      moneyin,
    },
  });
};

exports.profileImage = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profileimage: req.file.path,
    },
    {
      new: true,
    }
  ).select("name username profileimage");

  res.status(201).json({
    status: "OK",
    data: {
      user,
    },
  });
};
