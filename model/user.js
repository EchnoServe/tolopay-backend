const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  age: {
    type: Number,
  },
  phoneNumber: Number,
  password: {
    type: String,
    required: [true, "please provide your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please  confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not same!!!",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
  }
  next();
});

const user = mongoose.model("user", userSchema);

const newuser = new user({
  name: "yonas",
  email: "yonas@gmail.com",
  password: "1234@1234",
  passwordConfirm: "1234@1234",
});

newuser.save();

module.exports = user;
