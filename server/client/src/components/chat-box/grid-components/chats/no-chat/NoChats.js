import React from 'react'

import './NoChats.css'

function NoChats(){
  return (
    <div id='no-chat-layout'>
      <div id='no-chat-content'>
        <h2>No Chats</h2>
        <p>Currently you have no chats.</p>
        <p>To start a new chat click the button below.</p>
        <button onClick={null}>New Chat</button>
      </div>
    </div>
  )
}

export default NoChats
