import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import loginReducer from '../reducers/loginReducer'
import chatReducer from '../reducers/chatReducer'


const configureStore = () => {
    const store = createStore(combineReducers({
        login: loginReducer,
        chat: chatReducer
    }),applyMiddleware(thunk))
    return store
}

export default configureStore