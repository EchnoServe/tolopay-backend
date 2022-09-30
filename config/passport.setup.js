const passport = require("passport");
const User = require("../models/user");
const UserSocial = require("../models/userLoggedWithSocial");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");

passport.serializeUser((user, done) => {
    console.log(`user in serial ${user}`);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log(id);
    
    UserSocial.findOne({_id: id}, (err, user) => {
        console.log(`user in deserialize ${user}`);
    });
    
});


passport.use(
    new GoogleStrategy(
        {
            // Google Strategy Option
            callbackURL: "/api/v1/users/google/redirect",
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            proxy: true,
        
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
                            done(null, currentUser);
                            console.log('reached 1');
                        } else {
                            new UserSocial({
                                name: profile.displayName,
                                email: email,
                                profilePic: profile.photos[0].value,
                            }).save().then(newUser => {
                                console.log("reached new");
                                done(null, newUser );
                            })
                        }
                    });
                }
            })

            

            
        }
    )
)