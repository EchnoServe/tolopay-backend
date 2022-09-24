const express = require("express");
const { protect } = require("../middleware/protect");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.put("/addbudget", protect, userController.addBudget);

module.exports = router;
