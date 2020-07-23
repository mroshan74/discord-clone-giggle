const Socket = require('../models/socket')
const crypto = require('crypto')

const socketConnections = (io) => {
    //listening to socket connections
    io.on('connection', socket => { // establishing/listening a connection from client side
        //console.log('connected client to the socket', socket.id)

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
            //console.log('[REQUEST-OFFER-SOCKET]',data)
            const connect_id = crypto.randomBytes(16).toString('hex')
            let packet = {
                signal: data.signalData, 
                from: data.from,
                connect_id
            }
            Socket.findOne({_id: data.userToCall})
            .populate('_id','username profilePicUrl')
                .then(getUserSocket => {
                    if(getUserSocket){
                        //console.log('[REQUEST-OFFER-PEER]',packet)
                        //console.log(getUserSocket, '[USER SOCKET LISTENER]',data.from)
                        const { socketId, inCall } = getUserSocket
                        if(inCall.isTrue && (JSON.stringify(inCall.connectedTo) !== JSON.stringify(data.from))){
                            Socket.findOne({_id: data.from})
                                .then(getUserSocket => {
                                    console.log(getUserSocket, '[call engaged]',data.from)
                                    if(getUserSocket){
                                        const { socketId } = getUserSocket
                                        io.to(socketId).emit('caller engaged',{
                                            message:'User is in-call or in a session'
                                        })
                                    }
                                }).catch(err => console.log(err))
                        }
                        else{
                            const { username, profilePicUrl } = getUserSocket._id
                            io.to(socketId).emit('call listener', {...packet, username, profilePicUrl})
                        }
                    }
                    else{
                        Socket.findOne({_id: data.from})
                            .then(caller => {
                                const { socketId } = caller
                                io.to(socketId).emit('not-reachable', { message: 'user offline'})
                            }).catch(err => console.log(err))
                    }
                }).catch(err => console.log(err))
        })

        socket.on('acceptCall', (data) => {
            Socket.findOneAndUpdate({_id: data.to},{
                $set: { 
                    'inCall.isTrue': true,
                    'inCall.connectedTo':data.from
                }
            },{new: true})
                .then(getUserSocket => {
                    if(getUserSocket){
                        //console.log('[ACCEPT-ANSWER-PEER]', data)
                        const { socketId } = getUserSocket
                        io.to(socketId).emit('callAccepted', data.signal)
                    }
                }).catch(err => console.log(err))
            
            Socket.findOneAndUpdate({_id: data.from},{
                $set: { 
                    'inCall.isTrue': true,
                    'inCall.connectedTo':data.to
                }
            },{new: true})
                .then()
                .catch(err => console.log(err))
        })

        socket.on('rejectCall', (data) => {
            Socket.findOne({ _id: data.from })
                .then(getUserSocket => {
                    if(getUserSocket){
                        const { socketId } = getUserSocket
                        io.to(socketId).emit('callRejected',{
                            message: 'Caller Busy'
                        })
                    }
                }).catch(err => console.log(err))
        })

        socket.on('connectionClosed',(data) =>{
            Socket.findOneAndUpdate({_id: data.to},{
                $set: { 
                    'inCall.isTrue': false,
                    'inCall.connectedTo': null
                }
            })
                .then(getUserSocket => {
                    if(getUserSocket){
                        console.log(getUserSocket, '----->Close connection')
                        const { socketId } = getUserSocket
                        io.to(socketId).emit('callChannelClosed',{
                            message: 'connection dropped'
                        })
                        
                    }
                }).catch(err => console.log(err))
            
            Socket.findOneAndUpdate({_id: data.from},{
                $set: { 
                    'inCall.isTrue': false,
                    'inCall.connectedTo': null
                }
            })
                .then()
                .catch(err => console.log(err))
        })

        socket.on('endCallByUser',(data) =>{
            Socket.findOneAndUpdate({_id: data.user},{
                $set: { 
                    'inCall.isTrue': false,
                    'inCall.connectedTo': null
                }
            })
                .then(getUserSocket => {
                    if(getUserSocket){
                        const { inCall } = getUserSocket
                        Socket.findOneAndUpdate({_id: inCall.connectedTo},{
                            $set: { 
                                'inCall.isTrue': false,
                                'inCall.connectedTo': null
                            }
                        })
                            .then(getUserSocket => {
                                if(getUserSocket){
                                    const { socketId } = getUserSocket
                                    io.to(socketId).emit('callClosedByUser',{
                                        message: 'call closed'
                                    })
                                }
                            }).catch(err => console.log(err))
                        
                    }
                }).catch(err => console.log(err))
        })

        socket.on('disconnect',(reason)=>{
            //console.log(reason,socket.id)
            Socket.findOneAndRemove({socketId: socket.id})
                .then(afterClean => {
                    //console.log(afterClean,'removed user session')
                    if(afterClean){
                        const { inCall } = afterClean
                        if(inCall.isTrue){
                            Socket.findOneAndUpdate({_id: inCall.connectedTo},{
                                $set: { 
                                    'inCall.isTrue': false,
                                    'inCall.connectedTo': null
                                }
                            })
                                .then(getUserSocket => {
                                    const { socketId } = getUserSocket
                                    io.to(socketId).emit('call-disconnected',{
                                        message: 'user disconnected / error in call channel'
                                    })
                                }).catch(err => console.log(err))
                        }
                    }
                })
                .catch(err => console.log(err))
        })
    })
}

module.exports = socketConnections