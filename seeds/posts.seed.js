const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');

mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
}

const seedSize = 20;
const minLikes = 2;
const maxLikes = 12;

const pickAuthor = (users) => {
    const userIndex = Math.floor(Math.random() * users.length);
    return users[userIndex];
};

const seedLikes = (users) => {
    const likeCount = Math.floor(Math.random() * (maxLikes - minLikes)) + minLikes;
    let likes = [];
    while(likes.length < likeCount) {
        let random = Math.floor(Math.random() * users.length);
        let user = users[random];
        if(likes.indexOf(user) > -1) continue;
        likes.push(user);
    }
    return likes;
};

const seedPosts = async () => {

    const users = await User.find({});

    for (let i = 0; i <= seedSize; i++) {

        const author = pickAuthor(users);
        const likes = seedLikes(users);

        const postData = {
            author: author,
            postedOn: new Date(),
            picture: faker.image.image(),
            title: faker.lorem.words(),
            content: faker.lorem.sentences(),
            tags: faker.lorem.sentence().split(' '),
            likes: likes
        };

        const post = new Post(postData);
        await post.save();
    }
};

seedPosts().then(() => console.log("done seeding"));