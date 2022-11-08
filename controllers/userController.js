const mongoose = require("mongoose");
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
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

  const user = req.user;
  const remark= req.body.remark;
  const amount= req.body.amount;

  if (!req.body) {
    return next(new Error("Please enter the fields in your form correctly"));
  }
  //TODO:check balances

  let budgeted_before = false;

  for (const item of user.budget) {
    if (item.remark === req.body.remark) {
      budgeted_before = true;
      item.amount = parseFloat(item.amount) + parseFloat(req.body.amount);
      user.save({ validateBeforeSave: false });
    }
  }
  if (!budgeted_before) {
    user.budget.push({ remark, amount, budgeted: true });
    user.save({ validateBeforeSave: false });
  }

  res.status(201).json({
    status: "OK",
    data: {
      user,
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
  ).select("name account_number profileimage");

  res.status(201).json({
    status: "OK",
    data: {
      user,
    },
  });
};

exports.changeInfo = async (req, res, next) => {
  const { id, name, email, phoneNumber } = req.body;
  User.findByIdAndUpdate(
    id,
    {
      name: name,
      email: email,
      phoneNumber: phoneNumber
    },{
      new: true,
    }
  ).then(updatedUser => {
    res.status(201).json({
      status: "OK",
      data: {
        updatedUser
      }
    });
  }).catch(err => {
    res.json({
      status: "Couldn't Update info"
    })
  })
  
}

exports.changePassword = async (req, res, next) => {
  const { id, oldPassword, password, confirmPassword } = req.body;

  const user = await User.findOne({_id : id}).select("+accounts.local.password");
  
  if (!user){
    res.json({ status: "auth error"})
  }
  try {
    // jwt.verify(token, secret);
    await bcrypt.compare(oldPassword, user.accounts.local.password, async (err, success) => {
      if(err){
        next(err);
      } else {
        user.accounts.local.password = password;
        user.accounts.local.passwordConfirm = confirmPassword;
        const returnValue = await user.save();
    
        console.log('save return' + returnValue.accounts.local);
    
        res.json({
          status: 'success'
        })
        
      }

    });
 
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }

}
