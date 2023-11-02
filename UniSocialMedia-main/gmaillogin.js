const passport = require('passport')
const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const User = require('./models/User')

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},

function(accessToken, refreshToken, profile, done) {
    if(profile._json.hd == "student.tdtu.edu.vn") {
        User.findOrCreate({email: profile.emails[0].value},{name: profile.displayName}, function (err, user) {
            return done(err, user)
        })
    }
    else{
        err = "ONLY USING STUDENTS GMAIL"
        return done(err)
    }
}
))