import axios from 'axios'
const getToken = localStorage.getItem('token')
//--------------------get chats 
export const setChats = (data) => {
    return { type: 'SET_CHAT', payload: data }
} 

export const startGetChats = () => {
    return(dispatch) => {
        axios.get('/user/chats',{ headers: {
            'x-auth' : getToken
        }})
            .then(response => {
                console.log('[PROMISE-get-chats]',response.data)
                const chats = response.data
                dispatch(setChats(chats))
            }).catch(err => console.log('[ERR-get-chats]',err))
    }
}

//--------------------after each chat submit -> update redux chat store ** no async requests here
export const afterChatSubmit = (data) => {
    return { type: 'AFTER_CHAT_SUBMIT', payload: data }
}