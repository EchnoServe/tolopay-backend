const passport = require("passport");
const User = require("../models/user");
const UserSocial = require("../models/userLoggedWithSocial");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const userSocial = require("../models/userLoggedWithSocial");

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

            User.findOne({email: email}).then(user => {
                if (user) {

                } else {
                    UserSocial.findOne({email: email}).then(userSocial => {
                        if (userSocial) {
                            console.log('already a user');
                        } else {
                            new UserSocial({
                                name: profile.displayName,
                                email: email,
                                profilePic: profile.photos[0].value,
                            }).save().then(user => {
                                console.log(`new user: ${user}`);
                            })
                        }
                    })
                }
            })

            

            
        }
    )
)