import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import socket from '../../services/socket'
//import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

//material-ui
//import { Container } from '@material-ui/core'


import Home from './Home';
import Login from '../register-login/Login';
import Navbar from './nav-bar/Navbar';
import Register from '../register-login/Register'
import Search from '../search/Search';
import ChatShell from '../chat-box/container-main/ChatShell';
import Friends from './Friends';
import VideoCall from '../video-call/VideoCall'
import InterCom from './InterCom'
import VideoListener from '../socket-listeners/VideoListener'
import MessageListener from '../socket-listeners/MessageListener'
import PostManager from '../posts/PostManager'
import PostListener from '../socket-listeners/PostListener'
import Notifications from './Notifications';

function App(props) {

  //! storing session via socket generated id
  const { user } = props

  useEffect(() => {
    socket.emit('userId', { userId: user._id })
  }, [user._id])  // only changes when there is change in account info, or will remain consistent
  //!-------------sockets
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <VideoListener />
        <MessageListener />
        <PostListener />
        {/* <Container> */}
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/users/login' component={Login} />
            <Route path='/users/register' component={Register} />
            <Route path='/users/search' component={Search} />
            <Route path='/users/friends' component={Friends} />
            <Route path='/users/intercom' component={InterCom} />
            <Route path='/users/chat' component={ChatShell} />
            <Route path='/users/videocall/:id' component={VideoCall} />
            <Route path='/users/videocall/' component={VideoCall} />
            <Route path='/users/posts/' component={PostManager} />
            <Route path='/users/notifications/' component={Notifications} />
          </Switch>
        {/* </Container> */}
      </div>
    </BrowserRouter>
  )
}

const mapStateToProps = state => {
    return {
        user: state.login
    }
}

export default connect(mapStateToProps)(App)