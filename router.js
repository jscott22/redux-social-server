const passport = require('passport');
const Auth = require('./controllers/auth');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = (app) => {

    app.get('/', requireAuth, (req, res) => {
        res.send({hi: "there"});
    });

    app.post('/signin', requireSignIn, Auth.signIn);
    app.post('/signup', Auth.signUp);

};