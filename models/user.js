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
      unique: true,
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
    accounts: [
      {
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
              return el === this.password;
            },
            message: "password are not same!!!",
          },
        },
        
      },
      {
        uid: {
          type: String
        },
        email: {
          type: String
        }
      }
     

    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.accounts[0].password = await bcrypt.hash(this.password, 12);
    this.accounts[0].passwordConfirm = undefined;

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
