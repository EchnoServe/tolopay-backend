const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");

passport.use(
    new GoogleStrategy(
        {
            // Google Strategy Option
            callbackURL: "/api/v1/users/google/redirect",
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
        }, (accessToken, refreshToken, profile, done) => {
            // passport callback
            const email = profile.emails[0].value;
            console.log(profile.emails[0].value);
            User.findOne({ email }).then(
                
            )
        }
    )
)