const PostController = require('../controllers/PostController');

module.exports = (app) => {
    app.get('/api/posts', PostController.fetch);
    app.post('/api/post/like', PostController.like);
    app.post('/api/post/unlike', PostController.unlike);
    app.post('/api/post/create', PostController.create);
    app.delete('/api/post', PostController.delete)
};