const passport = require("passport");
const User = require("../models/user");
const UserSocial = require("../models/userLoggedWithSocial");
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

            User.findOne({email: email}).then(user => {
                if (user) {
                    done( new Error("This email require password to login") );
                } else {
                    UserSocial.findOne({email: email}, (err, found) => {
                        if (err) {
                            done(err);
                        }
                        if (found) {
                            console.log(`already a user: ${found}`);
                            
                        } else {
                            new UserSocial({
                                name: profile.displayName,
                                email: email,
                                profilePic: profile.photos[0].value,
                            }).save().then(user => {
                                console.log(`new user: ${user}`);
                               
                            })
                        }
                    });
                }
            })

            

            
        }
    )
)