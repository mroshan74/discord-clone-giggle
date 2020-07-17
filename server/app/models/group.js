const mongoose = require('mongoose')
const { chatSchema } = require('./chat')

const Schema = mongoose.Schema
const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coverImg: {
    type: String,
    default: `http://localhost:7303/images/default_group_img.png`,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  groupType: {
    type: String,
    default: 'Private',
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  inbox: [chatSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Group = mongoose.model('Group', groupSchema)
module.exports = { Group , groupSchema }
