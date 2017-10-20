const User = require('../models/UserModel');
const Post = require('../models/PostModel');

exports.fetch = async (req, res) => {
    if (!req.user) return res.status(402).send({message: "You are not authorized to fetch posts."});
    let userId;
    if(req.query && req.query.userId) userId = req.query.userId;
    const query = userId ? {author: userId} : {};
    console.log(query);
    try {
        const posts = await Post
            .find(query)
            .populate([{
                path: 'author',
                model: 'user',
                select: ['firstName', 'lastName', 'avatar']
            }, {
                path: 'likes',
                mode: 'user',
                select: ['firstName', 'lastName', 'avatar']
            }
            ])
            .sort({postedOn: -1});
        res.status(200).send({posts});
    } catch (error) {
        res.status(422).send({message: "There was an error with your request."});
    }
};

exports.byUser = async (req, res) => {
  if (!req.user) return res.status(402).send({message: "You are not authorized to fetch posts."});

  if (!req.body || !req.body.userId) return res.status(422).send({message: "You must include a user ID."});

  const userId = req.body.userId;

  try {
      const userPosts = await Post
            .find({author: userId})
            .populate({
                path: 'author',
                model: 'user',
                select: ['firstName', 'lastName', 'avatar']
            })
            .sort({postedOn: -1});
      res.status(200).send({userPosts});
  } catch(error) {
      res.status(500).send({message: "Something went wrong fetching the user's posts."});
  }
};

exports.like = async (req, res) => {
    const user = req.user;
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
        res.status(422).send({message: "There was an error with your request."});
    }
};

exports.unlike = async (req, res) => {
    const user = req.user;
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
        res.status(422).send({message: "There was an error with your request."});
    }
};

exports.create = async(req, res) => {
    const user = req.user;
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
        const savedPost = await post.save();
        res.status(200).send(savedPost);
    } catch(error) {
        res.status(422).send({message: 'There was an error creating your post.'});
    }
};

exports.delete = async (req, res) => {

    const { _id: userId, isAdmin} = req.user;

    if (!req.body || !req.body.postId) return res
        .status(422)
        .send({message: "Delete request must contain a post ID."});

    try {
        const postToRemove = await Post.findById(req.body.postId);
        const isAuthor = (userId.toString() === postToRemove.author.toString());

        if (!isAdmin && !isAuthor) return res
            .status(402)
            .send({message: "You are not authorized to delete this post."});

        const removedPost = await postToRemove.remove();

        res.status(200).send({removedPost});
    } catch (error) {
        res.status(500).send({message: "There was an error deleting the post."});
    }
};