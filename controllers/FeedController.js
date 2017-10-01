const Post = require('../models/PostModel');

exports.fetch = async (req, res, next) => {
    const posts = await Post
        .find({})
        .populate([{
            path: 'author',
            model: 'user',
            select: ['firstName', 'lastName', 'avatar']
            }, {
            path: 'likes',
            mode: 'user',
            select: ['firstName', 'lastName', 'avatar']
            }
        ]);
    res.send(posts);
};