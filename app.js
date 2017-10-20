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

try {
    if(process.env.NODE_ENV !== 'test') {
        mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
    }
} catch (error) {
    console.warn(error);
}


const app = express();

const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: false
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
};

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined'));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(bodyParser.json());
router(app);

module.exports = app;