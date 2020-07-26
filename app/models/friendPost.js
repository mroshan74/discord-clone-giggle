const mongoose = require('mongoose')

const Schema = mongoose.Schema
const friendPostSchema = new Schema({
  postType: {
    type: String,
    default: 'Friends',
  },
  postByMe: {
    type: Boolean,
    default: false,
  },
  post: {
    type: String
  },
  friendPostId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  friendsTo: [],
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
},{timestamps: true})

const FriendPost = mongoose.model('FriendPost', friendPostSchema)
module.exports = { FriendPost, friendPostSchema }
