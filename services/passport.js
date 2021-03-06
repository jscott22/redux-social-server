const passport = require('passport');
const User = require('../models/UserModel');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

const localOptions = {
    usernameField: 'email'
};

const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
};

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if(!user) return done(null, false);

        user.comparePassword(password, (err, isMatch) => {
            if(err) return done(err);
            if (!isMatch) return done(null, false);

            return done(null, user);
        });

    } catch (err) {
        return done(err, false);
    }
});

const googleLogin = new GoogleStrategy(
    googleOptions,
    async (accessToken, refreshToken, profile, done) => {
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const email = profile.emails.find((email) => {
           return email.type === 'account';
        });

        try {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                const newUser = await new User({
                    firstName,
                    lastName,
                    email: email.value,
                    googleId: profile.id
                }).save();
                done(null, newUser);
            }
        } catch (err) {
            done(err, false)
        }
    });

passport.use(localLogin);
passport.use(googleLogin);