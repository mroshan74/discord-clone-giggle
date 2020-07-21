import React from 'react'
import classNames from 'classnames'
import moment from 'moment'

import './ChatItem.css'

function ChatItem(props) {

    const { chat, isActive, onChatItemSelected } = props
    // const [latestMsgDate, setLatestMsgDate] = useState('')
    // const [latestMsg, setLatestMsg] = useState('')
    
    const className = classNames('chat',{
        'active': isActive
    })

    let MsgObjSorted = chat?.inbox.slice(0).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    let latestMsgObj = MsgObjSorted.slice(0).pop()

    //console.log('[LATEST-CHAT-MSG]', latestMsgObj,'[CHAT]', chat)
    let latestMsg, latestMsgDate
    if(!latestMsgObj){
        latestMsgDate = chat?.createdAt
        latestMsg = ''
    } else {
        latestMsgDate = latestMsgObj.createdAt
        if(latestMsgObj.type === 'text'){
            latestMsg = latestMsgObj.message
        }else{
            latestMsg = ''
        }
    }
    
    return (
        <div className={className} 
            onClick={() => {onChatItemSelected(chat)}}
        >
            <img src={chat.info.profilePicUrl} alt={chat.info.username} />
            <div className="title-text">{chat.info.username}</div>
            <div className="created-date">{moment(latestMsgDate).fromNow()}</div>
            <div className="chat-message">
                {latestMsg}
            </div>
        </div>
    )
}

export default ChatItem
