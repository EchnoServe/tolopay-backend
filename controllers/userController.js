const User = require("./../models/user");

exports.me = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "OK",
    data: {
      user,
    },
  });
};
//TODO : update profile ->image

/**
 *  @desc  save budget and planning
 *  @route PUT  /api/v1/users/addbudget
 *  @access Private
 */

exports.addBudget = async (req, res, next) => {
  if (!req.body) {
    return next(new Error("Please enter the fields in your form correctly"));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { budget: req.body },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "OK",
    data: {
      user,
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

  res.status(200).json({
    status: "OK",
    data: {
      user,
    },
  });
};
