import React from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './Home';
import Login from '../register-login/Login';
import Nav from './Nav';
import Register from '../register-login/Register'
import Chatbox from '../chatbox/Chatbox';

function App(props) {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/user/login' component={Login} />
            <Route path='/user/register' component={Register} />

            <Route path='/chat' component={Chatbox} />
          </Switch>
        </div>
      </BrowserRouter>
    )
}

export default App