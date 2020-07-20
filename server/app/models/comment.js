const mongoose = require('mongoose')

const Schema = mongoose.Schema
const commentSchema = new Schema({
  commentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  responseTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},{timestamps: true})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = { Comment, commentSchema }
