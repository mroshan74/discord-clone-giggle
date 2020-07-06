import React, { Fragment, useState } from 'react'
import classNames from 'classnames'
import moment from 'moment'

import './Message.css'

import MessageModal from '../../../reusables/MessageModal'

function Message(props) {
    const { isMyMessage, message, imageUrl, imageAlt } = props

    const [open , setOpen] = useState(false)

    const msgClass = classNames('message-row',{
        'you-message': isMyMessage,
        'other-message': !isMyMessage
    })

    const avatar = isMyMessage ? null : <img className='avatar' src={imageUrl} alt={imageAlt} />
    //console.log(open, '[OPEN]')

    const handleModalStatus = () => {
        setOpen(!open)
    }
    
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
                    <img className="message-file" src={message.message} alt={message._id} onClick={() => {handleModalStatus()}}/>
                    {open && <MessageModal message={message} modalStatus={open} handleModalStatus={handleModalStatus}/>}
                    <div className="message-time">{moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                </div>
            </div>
        )
    }
    return <Fragment>{msgType}</Fragment>
}

export default Message
