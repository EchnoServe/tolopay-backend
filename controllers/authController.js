const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


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
  const { name, email, password, passwordConfirm, phoneNumber
    ,username
   } = req.body;
  console.log(email);
  User.findOne({accounts: { google: {email: email}}}, async (err, found)  => {

    if (found) {

      console.log("found: " + found.accounts);
      next(new Error("This email is already registered with google sign in"));
    } else {
      let newAccountNum;
      User.findOne().sort({account_number:-1}).limit(1).exec( async (err, found) => {
        
      newAccountNum = found === null ? 1000 : found.account_number + 1;
      
    });

    const user = await User.create({
      name: name,
      email: email,
      account_number: newAccountNum,
      accounts: {local: {password: password}},
      accounts: {local: {passwordConfirm: passwordConfirm }},
      phoneNumber,
    });
    
      const token = signToken(user._id);
    
      res.status(201).json({
        status: "OK",
        data: {
          token,
          user,
        },
      });
    }
  })


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

    const user = await User.findOne({ email }).select("+accounts.password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status();
      return next(new Error("incorrect email or password"));
    }
    user.password = undefined;

    const token = signToken(user._id);
    res.status(200).json({
      status: "OK",
      data: {
        token,
        user,
      },
    });
  } catch (ex) {
    next(ex);
  }
};

exports.loginSocial = async (req, res, next) => {
  const user = req.user;

  const token = signToken(user._id);
    res.status(200).json({
      status: "OK",
      data: {
        token,
        user: user,
      },
    });
}

exports.logout = async (req, res, next) => {

  res.logout();

}
