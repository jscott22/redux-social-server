const User = require('../models/UserModel');
const Post = require('../models/PostModel');

exports.like = async (req, res, next) => {
    const user = req.session.user;
    if(!user) res.send(400);
    const {postId} = req.body;

    try {
        const post = await Post
            .findByIdAndUpdate(
                postId,
                {$addToSet: {likes: user}},
                {new: true})
            .populate({
                path: 'likes',
                mode: 'user',
                select: ['firstName', 'lastName', 'avatar']
            });
        res.status(200).send(post.likes);
    } catch (error) {
        console.warn(error);
    }
};

exports.unlike = async (req, res, next) => {
    const user = req.session.user;
    if (!user) res.send(400);
    const {postId} = req.body;

    try {
        const post = await Post
            .findByIdAndUpdate(
                postId,
                {$pull: {likes: user._id}},
                {new: true})
            .populate({
                path: 'likes',
                mode: 'user',
                select: ['firstName', 'lastName', 'avatar']
            });
        res.status(200).send(post.likes);
    } catch(error) {
        console.warn(error);
    }
};

exports.create = async(req, res, next) => {
    const user = req.session.user;
    if(!user) res.send(400);
    try {
        const {title, content, tags, imageURL} = req.body;
        const post = new Post({
            author: user,
            postedOn: new Date(),
            title,
            content,
            picture: imageURL || '',
            tags
        });
        await post.save();
        res.status(200).send({message: 'Post successful'});
    } catch(error) {
        res.status(422).send({error: 'Invalid post'});
    }
};