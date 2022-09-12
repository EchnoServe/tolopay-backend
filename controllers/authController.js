const User = require("../model/user");

exports.signup = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  res.status(201).json({
    status: "OK",
    data: {
      user,
    },
  });
};
