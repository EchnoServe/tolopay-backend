const express = require("express");
const passport = require("passport");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/google", passport.authenticate("google", {
    scope: ['profile', 'email']
  }));

// call back route for google redirect
router.get("/google/redirect", passport.authenticate('google'),
(req, res) => {
    
}
)

module.exports = router;
