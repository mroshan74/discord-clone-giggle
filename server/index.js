const express = require('express')
const port = 7303
const app =express()
const morgan = require('morgan')
app.use(express.json())
app.use(morgan('dev'))

//🔥 connecting server with socket io
const server = require('http').createServer(app)
const io = require('socket.io')(server)   

const configureDB = require('./config/database')
configureDB()

//  setting the upload path public for file access
app.use(express.static('uploads'))

const routes = require('./config/routes')
app.use('/',routes)

app.io = io  // making it available in the middlewares/controllers
// 🔥 https://stackoverflow.com/questions/37559610/socket-io-emit-on-express-route/37560779

// setting up socket connections function
// 🔥 https://www.reddit.com/r/node/comments/7o9esm/express_server_and_websocket_servers_in_different/
// https://github.com/omar-hydrah/maktup

const socketConnections = require('./app/middlewares/socketConnections')
socketConnections(io)

server.listen(port, ()=>{
    console.log('SERVER PORT OPEN -> ',port)
})