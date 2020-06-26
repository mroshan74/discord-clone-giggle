import React from 'react'
import classNames from 'classnames'
import moment from 'moment'

import './Message.css'

function Message(props) {
    const { isMyMessage, message, imageUrl, imageAlt } = props
    const msgClass = classNames('message-row',{
        'you-message': isMyMessage,
        'other-message': !isMyMessage
    })

    const avatar = isMyMessage ? null : <img src={imageUrl} alt={imageAlt} />
    return (
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

export default Message
