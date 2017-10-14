const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: String,
    googleId: String,
    avatar: String,
    isAdmin: Boolean
});

UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const model = mongoose.model('user', UserSchema);

module.exports = model;