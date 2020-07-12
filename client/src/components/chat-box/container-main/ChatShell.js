import React, { Fragment, useEffect } from 'react'
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
import { startSendMsg, setSendMsg, startUploadFile } from '../../../redux/actions/chatsAction'
//import { startGetChatMsgs } from '../../../redux/actions/chatsAction'

function ChatShell(props) {
    const { chats, selectedChat } = props
    let selectedId = selectedChat?.info._id
    
    console.log(chats,'chatshell')

    // //! SOCKETS
    // //connecting client to server
    // //imported socket as an instance to avoid multiple component call to the server
    // //🔥  https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d

    // const msgFromServer = (msg) => {
    //     console.log(msg,'[MESSAGE_SERVER]')
    //     props.dispatch(setSendMsg(msg))
    // }
    
    // const connectSocket = () => {
    //     console.log('socketFn() connected on load')
    //     //to remove useEffect dependency warning -> by creating a socket instance in services folder
        
    //     // 🧾 https://stackoverflow.com/questions/9418697/how-to-unsubscribe-from-a-socket-io-subscription

    //     socket.on('server message listening',msgFromServer)
    //     // socket.on('server message listening',(msgFromServer)=>{
    //     //     console.log(msgFromServer,'[MESSAGE_SERVER]')
    //     //     // update the redux state
    //     //     props.dispatch(setSendMsg(msgFromServer))
    //     // })
    // }

    // useEffect(() => {
    //     // https://daveceddia.com/useeffect-hook-examples/
    //     // https://stackoverflow.com/questions/23092624/socket-io-removing-specific-listener
        
    //     //Mount
    //     connectSocket()
    //     return () => {
    //         console.log('socket listening closed')
    //         socket.off('server message listening', msgFromServer)
    //         //socket.off('server message listening')
    //     }
    //     // eslint-disable-next-line
    // },[selectedChat])
    // //! ----SOCKETS

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
