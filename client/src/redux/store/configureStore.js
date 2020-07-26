import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import loginReducer from '../reducers/loginReducer'
import selectedChatReducer from '../reducers/selectedChatReducer'
import searchReducer from '../reducers/searchReducer'
import chatReducer from '../reducers/chatReducer'
import callReducer from '../reducers/callReducer'
import postReducer from '../reducers/postReducer'


const configureStore = () => {
    const store = createStore(combineReducers({
        login: loginReducer,
        selectedChat: selectedChatReducer,
        searchResult: searchReducer,
        chat: chatReducer,
        call: callReducer,
        posts: postReducer
    }),applyMiddleware(thunk))
    return store
}

export default configureStore