const Socket = require('../models/socket')

const socketConnections = (io) => {
    //listening to socket connections
    io.on('connection', socket => { // establishing/listening a connection from client side
        console.log('connected client to the socket', socket.id)

        socket.on('userId',pass=> {
            //console.log('pass customId', pass)
            const store_session = {
                socketId: socket.id
            }
            if(pass.userId){
            // 🔥 mapping the connection of socket to user id to the database   
            Socket.findByIdAndUpdate({_id: pass.userId},store_session,{new:true, upsert:true})
                .then(map => {
                    console.log(map,'stored user session')
                }).catch(err => console.log(err))
            }
        })

        socket.on('callUser',(data) => {
            let packet = {
                signal: data.signalData, 
                from: data.from
            }
            Socket.findOne({_id: data.userToCall})
            .populate('_id','username profilePicUrl')
                .then(getUserSocket => {
                    if(getUserSocket){
                        //console.log('getUserSocket',getUserSocket)
                        console.log('[REQUEST-OFFER-PEER]',packet)
                        const { socketId } = getUserSocket
                        const { username, profilePicUrl } = getUserSocket._id
                        io.to(socketId).emit('call listener', {...packet, username, profilePicUrl})
                    }
                }).catch(err => console.log(err))
        })

        socket.on('acceptCall', (data) => {
            Socket.findOne({_id: data.to})
                .then(getUserSocket => {
                    if(getUserSocket){
                        console.log('[ACCEPT-ANSWER-PEER]', data)
                        const { socketId } = getUserSocket
                        io.to(socketId).emit('callAccepted', data.signal)
                    }
                }).catch(err => console.log(err))
        })

        socket.on('disconnect',(reason)=>{
            //console.log(reason,socket.id)
            Socket.findOneAndDelete({socketId: socket.id})
                .then(after => {
                    console.log(after,'removed user session')
                })
                .catch(err => console.log(err))
        })
    })
}

module.exports = socketConnections