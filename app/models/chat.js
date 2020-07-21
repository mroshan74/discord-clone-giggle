const mongoose = require('mongoose')

const Schema = mongoose.Schema
const chatSchema = new Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    isMyMessage: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
)

const Chat = mongoose.model('Chat',chatSchema)
module.exports = { Chat, chatSchema }