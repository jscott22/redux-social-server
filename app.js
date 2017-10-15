const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes');

mongoose.Promise = global.Promise;

switch(process.env.NODE_ENV) {
    case 'development':
        return mongoose.connect('mongodb://localhost/redux_social', {useMongoClient: true});
    case 'production':
        return mongoose.connect('mongodb://admin:oscarmac22@cluster0-shard-00-00-nygw0.mongodb.net:27017,cluster0-shard-00-01-nygw0.mongodb.net:27017,cluster0-shard-00-02-nygw0.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', {useMongoClient: true});
}

const app = express();

const sess = {
    secret: "oscar-pug",
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: false
    },
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
};

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined'));
//TODO: Limit cors
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
router(app);

module.exports = app;