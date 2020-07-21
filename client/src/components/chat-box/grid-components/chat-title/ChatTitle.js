import React, { Fragment } from 'react'
import { FiVideo } from 'react-icons/fi'

import './ChatTitle.css'
import { useHistory } from 'react-router-dom'

function ChatTitle(props) {
    const { selectedChat } = props
    const connectToId = selectedChat?.info._id
    let chatTitleContents = null

    const history = useHistory()
    
    if(selectedChat){
        chatTitleContents = (
            <Fragment>
                <span>{selectedChat.info.username}</span>
                <button id='chatTitle-videoCall-btn' onClick={()=>{history.push(`/users/videocall/${connectToId}`)}}>
                    <FiVideo />
                    </button>
            </Fragment>
        )
    }
    return (
        <div id="chat-title">
            { chatTitleContents }
        </div>
    )
}

export default ChatTitle
