import React, { Fragment } from 'react'
import { connect } from 'react-redux'


import ChatSearch from '../grid-components/chats/chat-search/ChatSearch'
import NoChats from '../grid-components/chats/no-chat/NoChats'
import ChatList from '../grid-components/chats/chat-list/ChatList'
import NewChat from '../grid-components/chats/new-chat/NewChat'
import ChatTitle from '../grid-components/chat-title/ChatTitle'
import MessageList from '../grid-components/message/MessageList'
import ChatForm from '../grid-components/chat-form/ChatForm'

import './ChatShell.css'
import { startStoreSelectedId } from '../../../redux/actions/selectedChatAction'
import { startSendMsg } from '../../../redux/actions/chatsAction'
//import { startGetChatMsgs } from '../../../redux/actions/chatsAction'

function ChatShell(props) {
    const { chats, selectedChat } = props
    console.log(chats,'chatshell')
    let chatContent = (
        <Fragment>
            <NoChats/>
        </Fragment>
    )
    if(chats.length > 0){
        chatContent = (
            <Fragment>
                <MessageList selectedChat={selectedChat} />
            </Fragment>
        )
    }
    const chatChanged = (chat) => {
        props.dispatch(startStoreSelectedId(chat))
        console.log('selectedChat pass request', chat)
        //props.dispatch(startGetChatMsgs(chat._id))
    }
    const onMessageSubmitted = (msg) => {
        const id = selectedChat.info._id
        const fd = {
            message: msg
        }
        console.log('SEND mESSAGE --------------------',id)
        props.dispatch(startSendMsg(id,fd))
    }

    return (
        <div id="chat-container">
            <ChatSearch chats={chats} />
            <ChatList
                onChatItemSelected={chatChanged}
                chats={chats}
                selectedChat={selectedChat} />
            <NewChat />
            <ChatTitle 
                selectedChat={selectedChat}
            />
            {chatContent}
            <ChatForm 
                selectedChat={selectedChat}
                onMessageSubmitted={onMessageSubmitted} 
            />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        chats: state.login.friends,
        selectedChat: state.selectedChat
    }
}

export default connect(mapStateToProps)(ChatShell)
