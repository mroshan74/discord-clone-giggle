import { useEffect } from 'react'
import socket from '../../services/socket'
import { connect } from 'react-redux'
import { setSendMsg } from '../../redux/actions/chatsAction'

function MessageListener(props) {
    //! SOCKETS
    //connecting client to server
    //imported socket as an instance to avoid multiple component call to the server
    //🔥  https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d

    const msgFromServer = (msg) => {
        console.log(msg,'[MESSAGE_SERVER]')
        props.dispatch(setSendMsg(msg))
    }
    
    const connectSocket = () => {
        console.log('socketFnMessages() connected on load')
        //to remove useEffect dependency warning -> by creating a socket instance in services folder
        
        // 🧾 https://stackoverflow.com/questions/9418697/how-to-unsubscribe-from-a-socket-io-subscription

        socket.on('server message listening',msgFromServer)
        // socket.on('server message listening',(msgFromServer)=>{
        //     console.log(msgFromServer,'[MESSAGE_SERVER]')
        //     // update the redux state
        //     props.dispatch(setSendMsg(msgFromServer))
        // })
    }

    useEffect(() => {
        // https://daveceddia.com/useeffect-hook-examples/
        // https://stackoverflow.com/questions/23092624/socket-io-removing-specific-listener
        
        //Mount
        connectSocket()
        return () => {
            console.log('socket listening closed')
            socket.off('server message listening', msgFromServer)
            //socket.off('server message listening')
        }
        // eslint-disable-next-line
    },[])
    //! ----SOCKETS

    return (null)
}

export default connect()(MessageListener)
