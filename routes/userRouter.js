const express = require("express");
const { protect } = require("../middleware/protect");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const upload = require("./../middleware/muter");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/me", protect, userController.me);

router.put("/addbudget", protect, userController.addBudget);

router.post(
  "/profileImage",
  protect,
  upload.single("profileimage"),
  userController.profileImage
);

module.exports = router;
