import axios from 'axios'

const getToken = localStorage.getItem('token')


//get chats inbox
// export const setChatsInbox = (data) => {
//     return { type: 'SET_CHAT_INBOX', payload: data}
// }

// export const startGetChatMsgs = (id) => {
//     return(dispatch) => {
//         axios.get(`/users/getChats/${id}`,{
//             headers: {
//                 'x-auth': getToken
//             }
//         })
//             .then(response => {
//                 console.log('[PROMISE-get-chats]',response.data)
//                 const getData = response.data
//                 if(getData.hasOwnProperty('errors')){
//                     alert(getData.message)
//                 }else{
//                     dispatch(setChatsInbox(getData))
//                 }
//             })
//             .catch(err=> console.log('[ERROR-get-chats]',err))
//     }
// }

//sent message
export const setSendMsg = (data) => {
    return {type: 'SET_SEND_MSG', payload:data}
}

export const startSendMsg = (id,fd) => {
    return(dispatch) => {
        axios.post(`/users/sendMsg/${id}`,fd,{
            headers: {
                'x-auth': getToken
            }
        })
            .then(response => {
                console.log('[PROMISE-send-msg]',response.data)
                const getData = response.data
                if(getData.hasOwnProperty('errors')){
                    alert(getData.message)
                }else{
                    dispatch(setSendMsg(getData))
                }
            })
            .catch(err=> console.log('[ERROR-send-msg]',err))
    }
}

//upload file
export const uploadFile = (data) => {
    return {type: 'UPLOAD_FILE', payload:data}
}

export const startUploadFile = (id,fd) => {
    return(dispatch) => {
        axios.post(`/users/chats/upload/${id}`,fd,{
            headers: {
                'content-type': 'multipart/form-data',
                'x-auth': getToken
            }
        })
            .then(response => {
                console.log('[PROMISE-upload-file]',response.data)
                const getData = response.data
                if(getData.hasOwnProperty('errors')){
                    alert(getData.message)
                }else{
                    dispatch(uploadFile(getData))
                }
            })
            .catch(err=> console.log('[ERROR-upload-msg]',err))
    }
}