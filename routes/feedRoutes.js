const FeedController = require('../controllers/FeedController');

module.exports = (app) => {
    app.get('/api/feed', FeedController.fetch);
};