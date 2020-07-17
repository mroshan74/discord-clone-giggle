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
  imagePaths: [],
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      commentBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: {
        type: String,
      },
      likes: {
        type: Number,
        default: 0,
      },
      dislikes: {
        type: Number,
        default: 0,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  ],
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
