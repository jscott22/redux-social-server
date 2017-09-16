const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   email: { type: String, unique: true, lowercase: true },
   password: String
});

userSchema.pre('save', function (next) {
    console.log('here');
    const user = this;
    console.log(user);
    bcrypt.genSalt(10, (err, salt) =>{
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

const model = mongoose.model('user', userSchema);

module.exports = model;