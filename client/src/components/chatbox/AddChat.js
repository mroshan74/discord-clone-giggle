import React, { Component } from 'react'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import { startGetChats, afterChatSubmit } from '../../redux/actions/chatsAction'
import ChatCard from './ChatCard'
import Dropzone from 'react-dropzone'

class AddChat extends Component {
  state = {
    chatMessage: '',
  }

  componentDidMount() {
    this.props.dispatch(startGetChats())

    // connecting the client to the server
    let server = 'http://localhost:7303'
    this.socket = io(server)

    // listening to the backend server for incoming connection
    this.socket.on('output chat message', (msgFromServer) => {
      console.log(msgFromServer)
      // update the redux store
      this.props.dispatch(afterChatSubmit(msgFromServer))
    })
  }

  handleDrop = (files) => {
    console.log(files)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'x-auth': localStorage.getItem('token'),
      },
    }
    const fd = new FormData()
    fd.append('file', files[0])
    axios.post('/user/upload', fd, config).then((response) => {
      const uploaded = response.data
      console.log(uploaded)
      const { username, email, _id } = this.props.user
      let currentTime = moment()
      let type = 'image/video'
      this.socket.emit('input chat message', {
        chatMessage: uploaded,
        userId: _id,
        username,
        email,
        currentTime,
        type,
      })
    })
  }
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  handelSubmit = (e) => {
    e.preventDefault()
    const { chatMessage } = this.state
    const { username, email, _id } = this.props.user
    let currentTime = moment()
    let type = 'text'
    // sending to frontend server
    this.socket.emit('input chat message', {
      chatMessage,
      userId: _id,
      username,
      email,
      currentTime,
      type,
    })
    this.setState({ chatMessage: '' })
  }
  render() {
    return (
      <div>
        {this.props.chats &&
          this.props.chats.map((chat) => {
            return <ChatCard key={chat._id} {...chat} />
          })}
        <form onSubmit={this.handelSubmit}>
          <input
            type='text'
            name='chatMessage'
            id='chatMessage'
            value={this.state.chatMessage}
            onChange={this.handleChange}
          />
          <input type='submit' value='Enter' />
        </form>
        <Dropzone onDrop={this.handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button>Upload</button>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login,
    chats: state.chat,
  }
}

export default connect(mapStateToProps)(AddChat)
