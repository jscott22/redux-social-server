module.exports = (app) => {
    require('./authRoutes')(app);
    require('./postRoutes')(app);
    require('./userRoutes')(app);
};