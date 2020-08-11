import { useEffect } from 'react'
import socket from '../../services/socket'
import { connect } from 'react-redux'
import { addNewPublicPost, addNewFriendPost } from '../../redux/actions/postsAction'

function PostListener(props) {
    //! SOCKETS
    const publicPostFromServer = (post) => {
        console.log(post,'[POST_SERVER-PUBLIC]')
        props.dispatch(addNewPublicPost(post))
    }

    const friendPostFromServer = (post) => {
        console.log(post,'[POST_SERVER-FRIEND]')
        props.dispatch(addNewFriendPost(post))
    }
    
    const connectSocket = () => {
        console.log('socketFnPosts() connected on load')

        socket.on('publicPost',publicPostFromServer)
        socket.on('addNewFriendPost',friendPostFromServer)
    }

    useEffect(() => {
        connectSocket()
        return () => {
            console.log('socket listening closed')
            socket.off('publicPost', publicPostFromServer)
            socket.off('addNewFriendPost', friendPostFromServer)
        }
        // eslint-disable-next-line
    },[])
    //! ----SOCKETS

    return (null)
}

export default connect()(PostListener)
