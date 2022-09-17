const express = require("express");
const transactionController = require("./../controllers/transactionController");

const router = express.Router();

router.post("/transfer", transactionController.transfer);
// router.get("/usertransactions", transactionController.usertransactions);

module.exports = router;
