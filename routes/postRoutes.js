const PostController = require('../controllers/PostController');

module.exports = (app) => {
    app.post('/api/post/like', PostController.like);
    app.post('/api/post/unlike', PostController.unlike);
    app.post('/api/post/create', PostController.create);
};