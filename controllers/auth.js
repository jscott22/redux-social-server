const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret)
};

exports.signIn = async (req, res, next) => {
    res.send({ token: tokenForUser(req.user)});
};

exports.signUp = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res
            .status(422)
            .send({error: 'You must provide an email and password'});
    }

    try {
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res
                .status(422)
                .send({error: 'Email is in use'});
        }
    } catch(err) {
        return next(err);
    }

    const newUser = new User({email, password});

    try {
        await newUser.save();
        res.json(tokenForUser(newUser));
    } catch(err) {
        return next(err);
    }
};