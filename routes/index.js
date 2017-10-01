const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const feedRoutes = require('./feedRoutes');

module.exports = (app) => {
    authRoutes(app);
    feedRoutes(app);
    postRoutes(app);
};