const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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
    balance: {
      type: Number,
      default: 1000,
    },
    account_number: {
      required: true,
      type: Number,
      unique: true,
      
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
    },
    profileimage: String,
    active: {
      type: Boolean,
      default: true,
    },
    budget: [
      {
        remark: { type: String, trim: true },
        amount: Number,
        budgeted: { type: Boolean, default: true },
      },
    ],
    accounts: {
     local : {
        password: {
          type: String,
          // required: [true, "please provide your password"],
          minlength: 8,
          select: false,
        },
        passwordConfirm: {
          type: String,
          // required: [true, "please  confirm your password"],
          validate: {
            validator: function (el) {
              return el === this.accounts.local.password;
            },
            message: "password are not same!!!",
          },
        },
        
      },
      google : {
        uid: {
          type: String
        },
        email: {
          type: String
        }
      }
     

    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("accounts.local.password") && this.accounts.local.password) {
    this.accounts.local.password = await bcrypt.hash(this.accounts.local.password, 12);
    this.accounts.local.passwordConfirm = undefined;

    next();
  }
  next();
});

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
