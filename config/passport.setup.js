const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys")

passport.use(
    new GoogleStrategy(
        {
            // Google Strategy Option
            callbackURL: "/api/v1/users/google/redirect",
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
        }, () => {
            // passport callback
        }
    )
)