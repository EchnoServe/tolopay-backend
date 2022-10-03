const express = require("express");
const { protect } = require("../middleware/protect");
const recurrentTransactionController = require("./../controllers/recurrentTransactionController");

const router = express.Router();

router.get(
  "/",
  protect,
  recurrentTransactionController.getRecurrentTransaction
);

router.post(
  "/",
  protect,
  recurrentTransactionController.addRecurrentTransaction
);

module.exports = router;
