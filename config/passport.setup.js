const passport = require("passport");
const User = require("../models/user");
const UserSocial = require("../models/userLoggedWithSocial");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    UserSocial.findById(id).then((user) => {
        done(null, user);
    })
    
});


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
                    UserSocial.findOne({email: email}, (err, currentUser) => {
                        if (err) {
                            done(err);
                        }
                        if (currentUser) {
                            console.log(`already a user: ${currentUser}`);
                            done(null, currentUser);
                            
                        } else {
                            new UserSocial({
                                name: profile.displayName,
                                email: email,
                                profilePic: profile.photos[0].value,
                            }).save().then(newUser => {
                                console.log(`new user: ${newUser}`);
                                done(null, newUser );
                               
                            })
                        }
                    });
                }
            })

            

            
        }
    )
)