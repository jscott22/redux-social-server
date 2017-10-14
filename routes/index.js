module.exports = (app) => {
    require('./authRoutes')(app);
    require('./postRoutes')(app);
    // require('./feedRoutes')(app);
    require('./userRoutes')(app);
};