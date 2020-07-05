import React, { Fragment } from 'react'
import { FiVideo } from 'react-icons/fi'

import './ChatTitle.css'

function ChatTitle(props) {
    const { selectedChat } = props
    let chatTitleContents = null
    
    if(selectedChat){
        chatTitleContents = (
            <Fragment>
                <span>{selectedChat.info.username}</span>
                <button id='chat-title-btn'><FiVideo /></button>
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
