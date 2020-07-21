const mongoose = require('mongoose')

const Schema = mongoose.Schema
const notificationSchema = new Schema({
  info: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
  },
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  opened: {
    type: Boolean,
    default: false,
  },
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = { Notification, notificationSchema }
