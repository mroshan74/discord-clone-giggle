import React from 'react'
import VideoCall from '../video-call/VideoCall'
import ChatShell from '../chat-box/container-main/ChatShell'

function InterCom(props) {
    return (
        <div>
            <ChatShell />
            <VideoCall />
        </div>
    )
}

export default InterCom
