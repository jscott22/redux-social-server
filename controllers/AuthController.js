const User = require('../models/UserModel');

exports.signIn = async (req, res, next) => {
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
            .send({error: 'You must provide an email and password'});
    }

    if(!firstName || !lastName) {
        return res
            .status(422)
            .send({error: 'You must provide a first and last name'});
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

    const newUser = new User(req.body);

    try {
        const user = await newUser.save();
        res.status(200).send({user: user});
    } catch(err) {
        return next(err);
    }
};

exports.signOut = async (req, res, next) => {
    try {
        req.session.destroy();
        req.logout();
        res.status(200).redirect('http://localhost:3000/');
    } catch (error) {
        res.status(422).send({ error: error });
    }
};

exports.google = async (req, res, next) => {
    req.session.user = req.user;
    res.status(200).redirect('http://localhost:3000/feed');
};

exports.verify = async (req, res, next) => {
    if(req.session.user) {
        res.status(200).send({user: req.session.user});
    } else {
        res.status(200).send({user: null});
    }
};