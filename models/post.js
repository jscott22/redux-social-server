const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    postedOn: Date,
    picture: String,
    title: {type: String, required: true},
    content: {type: String},
    tags: [String],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
       type: Schema.Types.ObjectId,
       ref: 'comment'
    }]
});

PostSchema.virtual('likeCount').get(function() {
   return this.likes.length;
});

PostSchema.virtual('commentCount').get(function() {
    return this.comments.count;
});

const model = mongoose.model('post', PostSchema);

module.exports = model;