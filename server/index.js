const express = require('express')
const port = 7303
const app =express()
const morgan = require('morgan')
app.use(express.json())
app.use(morgan('dev'))
const Socket = require('./app/models/socket')

const server = require('http').createServer(app)
//🔥 connecting server with socket io
const io = require('socket.io')(server)   

const configureDB = require('./config/database')
configureDB()

//  setting the upload path public for file access
app.use(express.static('uploads'))

const routes = require('./config/routes')
app.use('/',routes)

app.io = io  // making it available in the middlewares/controllers
// 🔥 https://stackoverflow.com/questions/37559610/socket-io-emit-on-express-route/37560779

//listening to socket connections
io.on('connection', socket => { // establishing/listening a connection from client side
    socket.on('userId',pass=> {
        //console.log('pass customId', pass)
        const store_session = {
            socketId: socket.id
        }
        if(pass.userId){
        // 🔥 mapping the connection of socket to user id to the database   
        Socket.findByIdAndUpdate({_id: pass.userId},store_session,{new:true,upsert:true})
            .then(map => {
                //console.log(map,'stored user session')
            }).catch(err => console.log(err))
        }
    })
    console.log('connected client to the socket', socket.id)

    socket.on('disconnect',(reason)=>{
        //console.log(reason,socket.id)
        Socket.findOneAndDelete({socketId: socket.id})
            .then(after => {
                //console.log(after,'removed user session')
            })
            .catch(err => console.log(err))
    })
})

server.listen(port, ()=>{
    console.log('SERVER PORT OPEN -> ',port)
})