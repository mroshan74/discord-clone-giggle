import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import App from './components/general/App'
import configureStore from './redux/store/configureStore'
import { startAccount } from './redux/actions/loginsAction'

import './styles/index.css'
import { startGetPublicPosts, startGetFriendPosts, startGetUserPosts } from './redux/actions/postsAction'

const store = configureStore()


if (localStorage.getItem('token')) {
  store.dispatch(startAccount())
  store.dispatch(startGetPublicPosts())
  store.dispatch(startGetFriendPosts())
  store.dispatch(startGetUserPosts())
}

store.subscribe(() => {
  console.log(store.getState())
})

const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(jsx, document.getElementById('root'))
