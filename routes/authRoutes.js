const passport = require('passport');
const AuthController = require('../controllers/AuthController');

const passportService = require('../services/passport');
const requireSignIn = passport.authenticate('local');
const googleAuth = passport.authenticate('google', {scope: ['profile', 'email']});

module.exports = (app) => {
    app.get('/auth/checkauth', AuthController.verify);
    app.get('/auth/google', googleAuth);
    app.get('/auth/google/callback', googleAuth, AuthController.google);
    app.post('/auth/signin', requireSignIn, AuthController.signIn);
    app.post('/auth/signup', AuthController.signUp);
    app.get('/auth/signout', AuthController.signOut);
};