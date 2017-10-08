const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    postedOn: {type: Date, required: true},
    picture: String,
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: [String],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        unique: true
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