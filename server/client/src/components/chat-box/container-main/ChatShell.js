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
import { startSendMsg, startUploadFile } from '../../../redux/actions/chatsAction'

function ChatShell(props) {
    const { chats, selectedChat } = props
    let selectedId = selectedChat?.info._id
    
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
        console.log('selectedChat----->', chat._id)
        //props.dispatch(startGetChatMsgs(chat._id))
    }
    const onMessageSubmitted = (msg) => {
        const fd = {
            message: msg
        }
        console.log('SEND MESSAGE -------->',selectedId,msg)
        props.dispatch(startSendMsg(selectedId,fd))
    }

    const onFileUpload = (fd) => {
        console.log(selectedId,fd,'file-upload')
        props.dispatch(startUploadFile(selectedId,fd))
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
                onFileUpload={onFileUpload}
            />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        chats: state.login.friends,
        selectedChat: state.selectedChat,
        user: state.login
    }
}

export default connect(mapStateToProps)(ChatShell)
