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
//TODO : update profile
