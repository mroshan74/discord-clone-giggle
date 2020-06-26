import React, { Fragment } from 'react'

import './ChatTitle.css'

function ChatTitle(props) {
    const { selectedChat } = props
    let chatTitleContents = null
    
    if(selectedChat){
        chatTitleContents = (
            <Fragment>
                <span>{selectedChat.title}</span>
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
