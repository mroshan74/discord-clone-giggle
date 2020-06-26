import React from 'react'
//import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

//material-ui
import { Container } from '@material-ui/core'


import Home from './Home';
import Login from '../register-login/Login';
import Nav from './Nav';
import Register from '../register-login/Register'
import Search from '../search/Search';
import ChatShell from '../chat-box/container-main/ChatShell';

function App(props) {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Container>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/user/login' component={Login} />
              <Route path='/user/register' component={Register} />
              <Route path='/user/search' component={Search} />
              <Route path='/chat' component={ChatShell} />
            </Switch>
          </Container>
        </div>
      </BrowserRouter>
    )
}

export default App