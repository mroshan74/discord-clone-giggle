const mongoose = require('mongoose')

const Schema = mongoose.Schema
const postSchema = new Schema({
  postType: {
    type: String,
    default: 'Private',
  },
  postByMe: {
    type: Boolean,
    default: false,
  },
  post: {
    type: String,
    required: true,
  },
  uploadPath: String,
  isLiked: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isDisliked: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Post = mongoose.model('Post', postSchema)
module.exports = { Post, postSchema }
