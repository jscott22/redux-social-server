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



if(process.env.NODE_ENV !== 'test') {
    mongoURL = process.env.MONGO_URI || "mongodb://localhost/redux_social";
    mongoose.connect(mongoURL, {useMongoClient: true});
}

const app = express();

const sess = {
    secret: process.env.SESSION_SECRET || "oscar-pug",
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
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
router(app);

module.exports = app;