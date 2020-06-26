import React from 'react'

import ChatItem from '../chat-item/ChatItem'
import './ChatList.css'

function ChatList(props) {

    const { chats, selectedChat, onChatItemSelected } = props

    const chatItems = chats && chats.map(chat => {
        const chatIsActive = selectedChat && chat.info._id === selectedChat.info._id
        return <ChatItem
            key={chat.info._id}
            onChatItemSelected={onChatItemSelected}
            isActive={chatIsActive}
            chat={chat}
            />
    })

    return (
        <div id="chat-list">
            {chatItems}
        </div>
    )
}

export default ChatList
