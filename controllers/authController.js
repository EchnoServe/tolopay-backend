const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_IN,
  });
};

/**
 *  @desc  create account
 *  @route POST /api/v1/users/signup
 *  @access Public
 */

exports.signup = async (req, res, next) => {
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
};

/**
 *  @desc  login
 *  @route POST /api/v1/users/login
 *  @access Public
 */

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("provide email and password"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status()
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
  } catch (ex) {
    next(ex);
  }
};

exports.loginWithGoogle = async (req, res, next) => {

  const user = req.user;
  
  const token = signToken(user._id);
    res.status(200).json({
      status: "OK",
      data: {
        token,
        user: user._id,
      },
    });
}

exports.logout = async (req, res, next) => {

  res.send("logging out");

}
