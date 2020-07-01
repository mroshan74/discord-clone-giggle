import React, { Fragment, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import socket from '../../../services/socket'


import ChatSearch from '../grid-components/chats/chat-search/ChatSearch'
import NoChats from '../grid-components/chats/no-chat/NoChats'
import ChatList from '../grid-components/chats/chat-list/ChatList'
import NewChat from '../grid-components/chats/new-chat/NewChat'
import ChatTitle from '../grid-components/chat-title/ChatTitle'
import MessageList from '../grid-components/message/MessageList'
import ChatForm from '../grid-components/chat-form/ChatForm'

import './ChatShell.css'
import { startStoreSelectedId } from '../../../redux/actions/selectedChatAction'
import { startSendMsg, setSendMsg } from '../../../redux/actions/chatsAction'
//import { startGetChatMsgs } from '../../../redux/actions/chatsAction'

function ChatShell(props) {
    const { chats, selectedChat, user } = props
    console.log(chats,'chatshell')

    //! SOCKETS
    //connecting client to server
    //imported socket as an instance to avoid multiple component call to the server
    //🔥  https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d

    function connectSocket(){
        console.log('socketFn() connected on load')
        //to remove useEffect dependency warning -> by creating a socket instance in services folder

        socket.on('server message listening',(msgFromServer)=>{
            console.log(msgFromServer,'[MESSAGE_SERVER]')
            //TODO update the redux state
            props.dispatch(setSendMsg(msgFromServer))
        })
        
    }
    // eslint-disable-next-line
    useEffect(()=>connectSocket,[selectedChat])
    useMemo(() => {
        socket.emit('userId', { userId: user._id })
    },[user._id])
    //! ----SOCKETS

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
        const id = selectedChat.info._id
        const fd = {
            message: msg
        }
        console.log('SEND MESSAGE -------->',id,msg)
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
        selectedChat: state.selectedChat,
        user: state.login
    }
}

export default connect(mapStateToProps)(ChatShell)
