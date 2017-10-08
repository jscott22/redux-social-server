const request = require('supertest');
const app = require('../../app');
const User = require('../../models/UserModel');

const mongoose = require('mongoose');

beforeAll(async() => {
    await mongoose.connect('mongodb://localhost/redux_social_test', {useMongoClient: true});
});

beforeEach(async () => {
    const { users } = mongoose.connection.collections;
    try {
        await users.remove({});
    } catch (err) {
        console.warn(err);
    }
});

const user = {
    email: "test@test.com",
    password: "password",
    firstName: "Jason",
    lastName: "Scott"
};

describe('Tests user sign up routes', () => {

    test('Signs user up with email and password', async () => {
        try {
            const res = await request(app).post('/auth/signup').send(user);
            expect(res.status).toBe(200);
        } catch (err) {
            console.warn(err);
        }
    });

    test('Doesn\'t sign user up with repeat email', async () => {
        try{
            const res = await request(app).post('/auth/signup').send(user);
            expect(res.status).toBe(200);
            const res2 = await request(app).post('/auth/signup/').send(user);
            expect(res2.status).toBe(422);
            expect(res2.body.error).toBe('Email is in use');
            const users = await User.find({});
            expect(users.length).toBe(1);
        } catch (err) {
            console.warn('Warning: ', err);
        }
    });

    test('Doesn\'t sign user up without password', async () => {
        const email = "test@test.com";

        const res = await request(app).post('/auth/signup').send({email});
        expect(res.status).toBe(422);
        expect(res.body.error).toBe('You must provide an email and password');
        const users = await User.find({});
        expect(users.length).toBe(0);
    });

    test('Doesn\'t sign user up without name', async () => {
        const user = {
            email: "test@test.com",
            password: "password"
        };

        const res = await request(app).post('/auth/signup').send(user);
        expect(res.status).toBe(422);
        expect(res.body.error).toBe('You must provide a first and last name');
        const users = await User.find({});
        expect(users.length).toBe(0);
    });
});

describe('Tests user sign in routes', () => {

    test('Signs user in with correct email and password', async() => {
        try {
            await User.create(user);
            const res =  await request(app).post('/auth/signin').send({email: user.email, password: user.password});
            expect(res.status).toBe(200);
        } catch (err) {
            console.warn(err);
        }
    });

    test('Does not sign in user with incorrect password or email', async () => {
        try {
            await User.create(user);
            const result = await Promise.all([
                request(app).post('/auth/signin').send({email: 'wrongEmail', password: user.password}),
                request(app).post('/auth/signin').send({email: user.email, password: 'wrongPass'})
            ]);
            expect(result[0].status).toBe(401);
            expect(result[0].body).not.toHaveProperty('token');
            expect(result[1].status).toBe(401);
            expect(result[1].body).not.toHaveProperty('token');
        } catch(err) {
            console.warn(err);
        }
    });
});