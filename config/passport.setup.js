const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        console.log("deserialized profile: " + user);
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
                    if(user.accounts.google.email){
                        console.log(`already a user: ${user}`);
                        done(null, user);
                    } else {
                        done( new Error("This email require password to login"));
                    }      
                } else {
                    User.findOne().sort({account_number:-1}).limit(1).exec((err, found) => {
                    
                        const newAccountNum = found === null ? 1000 : found.account_number + 1;

                        new User({
                            name: profile.displayName,
                            email: email,
                            profileimage: profile.photos[0].value,
                            account_number: newAccountNum,
                            accounts: {
                                google: {
                                    uid: profile.id,
                                    email: email,
                                }
                            }
                        }).save().then(newUser => {
                            console.log(`new user: ${newUser}`);
                            done(null, newUser );
                        });
                    });
                    const lastEntryID = User.find().all;
                    
                    
                    
                }
            })  
        }
    )
)