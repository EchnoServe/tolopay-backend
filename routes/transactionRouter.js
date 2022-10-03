const express = require("express");
const {
  transfer,
  usertransactions,
} = require("./../controllers/transactionController");
const { protect } = require("./../middleware/protect");

const router = express.Router();

router.post("/transfer", protect, async (req, res, next) => {
  const user = req.user;
  const { phoneNumber, amount, password, remark } = req.body;

  try {
    const newuser = await transfer(
      {
        phoneNumber,
        amount,
        password,
        remark,
        user,
      },
      false
    );
    res.status(201).json(newuser);
  } catch (ex) {
    res.status(404).json({
      status: "fail",
      message: ex.message,
    });
  }
});

router.get("/usertransactions", protect, usertransactions);

module.exports = router;
