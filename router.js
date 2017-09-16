const Auth = require('./controllers/auth');

module.exports = (app) => {

    app.post('/signup', Auth.signup);

};