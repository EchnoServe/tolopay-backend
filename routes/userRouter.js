const express = require("express");
const { protect } = require("../middleware/protect");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const upload = require("./../middleware/muter");
const passport = require("passport");

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

router.get("logout", authController.logout);

router.get("/google",
  (req, res, next) => {
    req.session.redirectPath = req.query.redirectUrl;
    next();
  },  
  passport.authenticate("google", {
      scope: ['profile', 'email']
    }));

// call back route for google redirect
router.get("/google/redirect", passport.authenticate('google'),
  authController.loginWithGoogle
)


module.exports = router;
