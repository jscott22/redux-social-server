const User = require('../models/user');

exports.signup = async (req, res, next) => {
    console.log(req.body);
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
        res.json(newUser);
    } catch(err) {
        return next(err);
    }
};