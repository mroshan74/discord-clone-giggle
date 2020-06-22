const express = require('express')
const port = 7303
const app =express()
const morgan = require('morgan')
app.use(express.json())
app.use(morgan('dev'))

const {Chat} = require('./app/models/chat')
const server = require('http').createServer(app)
//🔥 connecting server with socket io
const io = require('socket.io')(server)

// setting up the database
const configureDB = require('./config/database')
configureDB()

//  setting the upload path public for file access
app.use(express.static('uploads'))

// setting the routes
const routes = require('./config/routes')
app.use('/',routes)

// listening to socket connections
io.on('connection', socket => { // establishing/listening a connection from client side
    socket.on('input chat message', msg => { // the listening socket variable should be same as emitting variable -> input chat message
        // msg -> we have the data object emitted from the client side in the msg 
    const msgData = {
        message: msg.chatMessage,
        sender: msg.userId,
        type: msg.type
    }
    console.log(msgData)
    const chat = new Chat(msgData)
    chat.save().then(chat => {
        Chat.find({_id: chat._id})
            .populate('sender')
            .then(chat => {
                return io.emit('output chat message',chat)
            })
    }).catch(err => res.json(err))
    })
})


server.listen(port, ()=>{
    console.log('SERVER PORT OPEN -> ',port)
})