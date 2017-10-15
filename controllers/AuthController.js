const User = require('../models/UserModel');
const config = require('../config');

const ROOT_URL =  process.env.CLIENT_ROOT_URL || config.URL.LOCAL_ROOT;

exports.signIn = async (req, res) => {
    if(req.user) {
        res.status(200).send({user: req.user});
    } else {
        res.status(422).send({user: null});
    }
};

exports.signUp = async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    if(!email || !password) {
        return res
            .status(422)
            .send({message: 'You must provide an email and password'});
    }

    if(!firstName || !lastName) {
        return res
            .status(422)
            .send({message: 'You must provide a first and last name'});
    }

    try {
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res
                .status(422)
                .send({message: 'Email is in use'});
        }
    } catch(err) {
        return next(err);
    }

    const newUser = new User(req.body);

    try {
        const user = await newUser.save();
        res.status(200).send({user: user});
    } catch(err) {
        return next(err);
    }
};

exports.signOut = async (req, res) => {
    try {
        req.session.destroy();
        req.logout();
        res.status(200).redirect(ROOT_URL);
    } catch (error) {
        res.status(422).send({message: error});
    }
};

exports.google = async (req, res) => {
    req.session.user = req.user;
    res.status(200).redirect(`${ROOT_URL}/feed`);
};

exports.verify = async (req, res) => {
    if(req.session.user) {
        res.status(200).send({user: req.session.user});
    } else {
        res.status(200).send({user: null});
    }
};