const UserController = require('../controllers/UserController');

module.exports = (app) => {
    app.get('/api/user/profile', UserController.profile);
    app.delete('/api/user', UserController.delete);
    app.patch('/api/user/promote', UserController.promote);
};