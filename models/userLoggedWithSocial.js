const mongoose = require("mongoose");
const validator = require("validator");

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
      default: "user",
    },
    age: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
    },
    profileimage: {
        type: String,
    },
    budget: [
      {
        remark: { type: String, trim: true },
        amount: String,
        budgeted: { type: Boolean, default: true },
      },
    ],
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

const userSocial = mongoose.model("userSocial", userSchema);
module.exports = userSocial;
