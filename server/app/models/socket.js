const mongoose = require('mongoose')
const Schema = mongoose.Schema
const socketSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const Socket = mongoose.model('Socket',socketSchema)
module.exports = Socket