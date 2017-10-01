const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/user');

mongoose.Promise = global.Promise;
if(process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/redux_social', {useMongoClient: true});
}

const seedSize = 20;

const seedUsers = async () => {
    for (let i = 0; i <= seedSize; i++) {
        const userData = {
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: faker.internet.password(),
            avatar: faker.image.avatar()
        };

        const user = new User(userData);
        await user.save();
    }
};

seedUsers().then(() => console.log('done seeding'));
