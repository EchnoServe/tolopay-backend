const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, phoneNumber } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      phoneNumber,
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: "OK",
      data: {
        token,
        user: user._id,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        errorMessage: error.message,
      },
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("provide email and password"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new Error("incorrect email or password"));
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: "OK",
      data: {
        token,
        user: user._id,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: "fail",
      data: {
        errorMessage: e.message,
      },
    });
  }
};
