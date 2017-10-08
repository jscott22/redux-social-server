const UserController = require('../controllers/UserController');

module.exports = (app) => {
    app.get('/api/user/profile', UserController.profile);
};