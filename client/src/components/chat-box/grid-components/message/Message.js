import React, { Fragment } from 'react'
import classNames from 'classnames'
import moment from 'moment'

import './Message.css'

function Message(props) {
    const { isMyMessage, message, imageUrl, imageAlt } = props
    const msgClass = classNames('message-row',{
        'you-message': isMyMessage,
        'other-message': !isMyMessage
    })

    const avatar = isMyMessage ? null : <img className='avatar' src={imageUrl} alt={imageAlt} />

    let msgType = null

    if(message.type==='text'){
        msgType = (
            <div className={msgClass}>
                <div className="message-content">
                    {avatar}
                    <div className="message-text">
                        {message.message}
                    </div>
                    <div className="message-time">{moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                </div>
            </div>
        )
    }
    else if(message.type === 'image/video'){
        msgType = (
            <div className={msgClass}>
                <div className="message-content">
                    {avatar}
                    <img className="message-file" src={message.message} alt={message._id} />
                    <div className="message-time">{moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                </div>
            </div>
        )
    }
    return <Fragment>{msgType}</Fragment>
}

export default Message
