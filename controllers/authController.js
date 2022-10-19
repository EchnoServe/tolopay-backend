const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const imp = require("../config/keys");

const JWT_SECRET = "alkjeih3409329adlkfjladjf$dfuo3jj3alkj";


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
  console.log(email);
  User.findOne({accounts: { google: {email: email}}}, async (err, found)  => {

    if (found) {
      next(new Error("This email is already registered with google sign in"));
    } else {

      User.findOne().sort({account_number:-1}).limit(1).exec( async (err, found) => {
        
      const newAccountNum = found === null ? 1000 : found.account_number + 1;

      console.log(newAccountNum);

    const user = await User.create({
      name: name,
      email: email,
      account_number: newAccountNum,
      accounts: {local: {
        password: password,
        passwordConfirm: passwordConfirm }},
      phoneNumber: phoneNumber,
    });
    
      const token = signToken(user._id);
    
      res.status(201).json({
        status: "OK",
        data: {
          token,
          user,
        },
      });
      
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

    const user = await User.findOne({ email }).select("+accounts.local.password");

    console.log(user.accounts.local.password + " = " + password);

    if (!user || !(await bcrypt.compare(password, user.accounts.local.password ))) {
      res.status();
      return next(new Error("incorrect email or password"));
    }
    user.accounts.local.password = undefined;

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

  // req.session.destroy();
  console.log("final user data: " + user);

  const token = signToken(user._id);
  console.log(token);

  res.status(200).json({
      status: "OK",
      data: {
        token,
        user,
      },
    });
}

exports.logout = async (req, res, next) => {

  res.logout();

}

exports.forgot = async (req, res, next) => {
  const { email } = req.body;

  const oldUser = await User.findOne({ email });
    if (!oldUser || !oldUser.accounts.local ) {
      return res.json({ status: "User Not Exists!!" });
    }
    
    const secret = JWT_SECRET + oldUser.accounts.local.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "30m",
    });
    const link = `http://localhost:8000/api/v1/users/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: imp.email.email,
        pass: imp.email.pass,
        
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    var mailOptions = {
      from: imp.email.email,
      to: email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        next(new Error("Couldn't send email, try again later!"));
      } else {
       console.log("Email sent: " + info.response);
       res.status(200).json({
        message: 'success'
       });
      }
    });
    console.log(link);
}

exports.reset = async (req, res, next) => {
  console.log('hello');
  const { id, token } = req.params;
  console.log(req.params);

  const oldUser = await User.findOne({ _id : id });
  
  if (!oldUser) {
    res.json({status : "user doesn't exist"});
  }

  const secret = JWT_SECRET + oldUser.accounts.local.password;
  try {
    const verify = jwt.verify(token, secret);

    console.log(verify);

    const url = "http://localhost:3000/reset-password";
    // res.cookie('token', token, url);
    res.status(302).redirect(url + `/${oldUser.id}/${token}`);
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }

  
}

exports.changePassword = async (req, res, next) => {
  
  const { id, token, password, confirmPassword } = req.body;

  const user = await User.findOne({_id : id});

  if (!user) {
    res.json({status : "We are having an issue! couldn't perform operation."});
  }

  const secret = JWT_SECRET + user.accounts.local.password;

  try {
    const verify = jwt.verify(token, secret);

    console.log(verify);

    await user.updateOne({_id: id}, {$set: {
      accounts: {local: {
        password: password,
        passwordConfirm: confirmPassword }}
    }})

    res.json({
      status: 'success'
    })
    
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }

}