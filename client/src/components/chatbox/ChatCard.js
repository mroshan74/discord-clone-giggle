import React from 'react'
import moment from 'moment'

function ChatCard(props) {
    return (
        <div>
            <img src={props.sender.profilePicUrl} alt={props.sender.name} width='20' height='20'/>
            <h5>{props.sender.username}</h5>
            <h6>{moment(props.createdAt).format('YYYY-MM-DD HH:mm:ss')}</h6>
            <span>{moment(props.createdAt).fromNow()}</span>
            {props.message.split('.')[1] === ('png' || 'jpeg' || 'jpg') ? 
                <img src={props.message} alt={props.message.toString()} width='200' height='200' onClick = {() => {window.open(props.message)} }/>
                :
                <p>{props.message}</p>
            }
        </div>
    )
}

export default ChatCard