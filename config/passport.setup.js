const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
    
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
                    if(user.accounts[1].email){
                        console.log(`already a user: ${user}`);
                        done(null, user);
                    } else {
                        done( new Error("This email require password to login"));
                    }      
                } else {
                    
                    new User({
                        name: profile.displayName,
                        email: email,
                        profileimage: profile.photos[0].value,
                        accounts: [
                            {
                                uid: profile.id,
                                email: email,
                            }
                        ]
                    }).save().then(newUser => {
                        console.log(`new user: ${newUser}`);
                        done(null, newUser );
                    });
                }
            })  
        }
    )
)