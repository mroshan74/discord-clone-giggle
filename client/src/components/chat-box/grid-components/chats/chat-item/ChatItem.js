import React from 'react'
import classNames from 'classnames'
import moment from 'moment'

import './ChatItem.css'

function ChatItem(props) {

    const { chat, isActive, onChatItemSelected } = props
    const className = classNames('chat',{
        'active': isActive
    })

    let latestMsgDate = chat.inbox.slice(-1).pop()
    //console.log(latestMsgDate, 'DATE--------------------')

    return (
        <div className={className} 
            onClick={() => {onChatItemSelected(chat)}}
        >
            <img src={chat.info.profilePicUrl} alt={chat.info.username} />
            <div className="title-text">{chat.info.username}</div>
            <div className="created-date">{moment(latestMsgDate.createdAt).fromNow()}</div>
            <div className="chat-message">
                {chat.latestMessageText}
            </div>
        </div>
    )
}

export default ChatItem
