const express = require("express");
const { protect } = require("../middleware/protect");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const upload = require("./../middleware/muter");
const passport = require("passport");

const router = express.Router();

router.post("/signup",  authController.signup);

router.post("/login", authController.login);

router.get("/me", protect, userController.me);

router.put("/addbudget", protect, userController.addBudget);

router.get("/moneyout", protect, userController.moneyout);

router.get("/moneyin", protect, userController.moneyin);

router.post("/change-info", userController.changeInfo );

router.post("/user-change-password", userController.changePassword );

router.post(
  "/profileImage",
  protect,
  upload.single("profileimage"),
  userController.profileImage
);

router.get("/logout", authController.logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// call back route for google redirect
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/login/success",
  })
);

router.get(
  "/loginsocial",
  (req, res, next) => {
    if (!req.user) {
      next(new Error("Login first to access the resource you want"));
    } else {
      next();
    }
  },
  authController.loginSocial
);

router.post("/forgot-password", authController.forgot );

router.get("/reset-password/:id/:token", authController.reset );

router.post("/change-password", authController.changePassword );

module.exports = router;
