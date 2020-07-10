import React, { Fragment } from 'react'
import { FiVideo } from 'react-icons/fi'

import './ChatTitle.css'
import { useHistory } from 'react-router-dom'

function ChatTitle(props) {
    const { selectedChat } = props
    let chatTitleContents = null

    const history = useHistory()
    
    if(selectedChat){
        chatTitleContents = (
            <Fragment>
                <span>{selectedChat.info.username}</span>
                <button id='chat-title-btn' onClick={()=>{history.push('/users/videocall')}}>
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
