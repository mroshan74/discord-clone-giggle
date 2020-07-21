import React, { Fragment, useState } from 'react'
import Dropzone from 'react-dropzone'

import { FiUpload } from 'react-icons/fi'
import './ChatForm.css'

function ChatForm(props){

    const { selectedChat, onMessageSubmitted, onFileUpload } = props
    const [message, setMessage] = useState('')
    let formContents = null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.length > 0) {
            onMessageSubmitted(message);
            setMessage('');
        }
    }

    const handleDrop = (file) => {
        // console.log(file)
        const fd = new FormData()
        fd.append('file', file[0])
        fd.append('type','image/video')
        onFileUpload(fd)
    }

    if (selectedChat) {
        formContents = (
            <Fragment>
                <input 
                    type="text" 
                    placeholder="type a message" 
                    value={message}
                    onChange={ (e) => { setMessage(e.target.value) } } 
                />

                {/*Add attachment icons*/
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <button type='button' id='upload-btn'><FiUpload/></button>
                            </div>
                            </section>
                        )}
                    </Dropzone>
                }
                
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
