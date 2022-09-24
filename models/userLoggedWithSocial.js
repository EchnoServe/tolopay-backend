const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please tell us your name!"],
    },
    balance: {
      type: Number,
      default: 1000,
    },
    active: {
      type: Boolean,
      default: true,
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
    phoneNumber: {
      type: Number,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("creditTransactions", {
  ref: "creditTransaction",
  foreignField: "user_id",
  localField: "_id",
});

userSchema.virtual("debitTransactions", {
  ref: "debitTransaction",
  foreignField: "user_id",
  localField: "_id",
});

const user = mongoose.model("user", userSchema);
module.exports = user;
