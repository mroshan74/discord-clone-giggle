import React, { useEffect, useRef } from 'react'

import './MessageList.css'
import Message from './Message'

function MessageList(props) {
    
    const { selectedChat } = props
    let messageItems = null
    //console.log('MESSAGE LIST',selectedChat)
    
    //! scrollToBottom -> 🔥  https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    
    if(selectedChat && selectedChat.inbox.length) {
        messageItems = selectedChat.inbox.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)).map((msg) => {
            return <Message
            key={msg._id}
            isMyMessage={msg.isMyMessage}
            message={msg} 
            imageUrl={selectedChat.info.profilePicUrl}
            imageAlt={selectedChat.info.username}
            />
            
        })
    }
    useEffect(scrollToBottom, [messageItems])
    return (
        <div id='chat-message-list'>
            <div ref={messagesEndRef}></div>
            {messageItems}
        </div>
    )
}

export default MessageList
