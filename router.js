const passport = require('passport');
const Auth = require('./controllers/auth');
const passportService = require('./services/passport');

const requireSignIn = passport.authenticate('local');
const googleAuth = passport.authenticate('google', {scope: ['profile', 'email']});
module.exports = (app) => {

    app.get('/', (req, res) => {
        res.send({message: "secret message on auth route"});
    });

    app.get('/auth/checkauth', Auth.verify);

    app.get('/auth/google', googleAuth);
    app.get('/auth/google/callback', googleAuth, Auth.google);
    app.post('/auth/signin', requireSignIn, Auth.signIn);
    app.post('/auth/signup', Auth.signUp);
    app.get('/auth/signout', Auth.signOut);

};