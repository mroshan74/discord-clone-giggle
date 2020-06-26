import React, { Fragment, useState } from 'react'
import './ChatForm.css'

function ChatForm(props){

    const { selectedChat, onMessageSubmitted } = props
    const [message, setMessage] = useState('')
    let formContents = null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.length > 0) {
            onMessageSubmitted(message);
            setMessage('');
        }
    }

    if (selectedChat) {
        formContents = (
            <Fragment>
                {/*Add attachment icons*/ }
                <input 
                    type="text" 
                    placeholder="type a message" 
                    value={message}
                    onChange={ (e) => { setMessage(e.target.value) } } />
                <button type="submit">Send</button>
            </Fragment>
        )
    }

    return (
        <form id="chat-form" onSubmit={handleSubmit}>
            {formContents}
        </form>
    )
}

export default ChatForm
