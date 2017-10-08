const request = require('supertest');
const session = require('supertest-session');
const app = require('../../app');
const Post = require('../../models/PostModel');
const User = require('../../models/UserModel');

const mongoose = require('mongoose');

let user;
const newUser = new User({
    email: 'test@gmail.com',
    firstName: 'Jon',
    lastName: 'Doe',
    password: 'mypassword',
    googleId: null,
    avatar: 'hahaha'
});

const postData = {

};

let cookie;
let authSession;

function createSession (done) {
    let authenticatedRequest = request.agent(app);
    authenticatedRequest
        .post('/auth/login')
        .send({email: newUser.email, password: newUser.password})
        .end(function(error, response) {
            if (error) {
                throw error;
            }
            done(authenticatedRequest)
        });
}

beforeAll(async() => {
    try {
        await mongoose.connect('mongodb://localhost/redux_social_test', {useMongoClient: true});
        const testSession = session(app);
        await newUser.save();
        await testSession.post('/auth/signin')
            .send({email: newUser.email, password: newUser.password});
        const response = await testSession.get('/auth/checkauth');
    }
    catch(err) {
        console.warn(err);
    }
});

beforeEach(async () => {
    const { posts } = mongoose.connection.collections;
    try {
        await posts.remove({});
    } catch (err) {
        console.warn(err);
    }
});

afterAll(async () => {
    const { users } = mongoose.connection.collections;
    try {
        await users.remove({});
    } catch (err) {
        console.warn(err);
    }
});

describe('Post controller',() => {

    test('When a user creates a post', async () => {

    });
});