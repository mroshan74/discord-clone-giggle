const mongoose = require('mongoose')
const { chatSchema } = require('./chat')

const Schema = mongoose.Schema
const friendSchema = new Schema({
  isFriend: {
    type: Boolean,
    default: true,
  },
  info: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: 'Pending',
  },
  sendByMe: {
    type: Boolean,
    default: false,
  },
  inbox: [chatSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const Friend = mongoose.model('Friend', friendSchema)
module.exports = { Friend, friendSchema }
