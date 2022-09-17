const express = require("express");
const transactionController = require("./../controllers/transactionController");
const { protect } = require("./../middleware/protect");

const router = express.Router();

router.post("/transfer", protect, transactionController.transfer);
router.get(
  "/usertransactions",
  protect,
  transactionController.usertransactions
);

module.exports = router;
