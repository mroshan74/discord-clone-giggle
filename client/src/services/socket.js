import io from 'socket.io-client'
//import { SOCKET_URL } from 'config'

let server = 'http://localhost:7303'
const socket = io(server) 

export default socket
