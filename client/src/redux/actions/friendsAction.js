import axios from 'axios'
const getToken = localStorage.getItem('token')


//-----------------sent request
export const sendFriendReq = (data) => {
    return { type: 'FRIEND_SENT_REQUEST', payload: data }
}

export const startFriendSendRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/users/sendRequest/${id}`,fd,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-friend-send-request]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(sendFriendReq(resData))
                }
            })
        }
}

//------------------ cancel request
export const cancelFriendReq = (data) => {
    return { type: 'FRIEND_CANCEL_REQUEST', payload: data }
}

export const startFriendCancelRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/users/cancelRequest/${id}`,fd,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-friend-cancel-request]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(cancelFriendReq(resData))
                }
            })
        }
}

// //accept request
// export const acceptReq = (data) => {
//     return { type: 'SET_ACCEPT_REQUEST', payload: data }
// }

// export const startFriendAcceptRequest = (id,fd) => {
//     return (dispatch) => {
//         axios.post(`/users/acceptRequest/${id}`,fd,{
//             headers: { 
//                 'x-auth': getToken
//             }
//         })
//             .then((response) => {
//                 console.log('[PROMISE-accept-request]',response.data)
//                 const resData = response.data
//                 if(resData.hasOwnProperty('errors')){
//                     alert(resData.message)
//                 }
//                 else{
//                     dispatch(acceptReq(resData))
//                 }
//             })
//         }
// }


// //reject request
// export const rejectReq = (data) => {
//     return { type: 'SET_REJECT_REQUEST', payload: data }
// }

// export const startFriendRejectRequest = (id,fd) => {
//     return (dispatch) => {
//         axios.post(`/users/rejectRequest/${id}`,fd,{
//             headers: { 
//                 'x-auth': getToken
//             }
//         })
//             .then((response) => {
//                 console.log('[PROMISE-reject-request]',response.data)
//                 const resData = response.data
//                 if(resData.hasOwnProperty('errors')){
//                     alert(resData.message)
//                 }
//                 else{
//                     dispatch(rejectReq(resData))
//                 }
//             })
//         }
// }


// //remove friend
// export const removeFriend = (data) => {
//     return { type: 'SET_REMOVE_FRIEND', payload: data }
// }

// export const startFriendRemoveFriend = (id,fd) => {
//     return (dispatch) => {
//         axios.post(`/users/removeFriend/${id}`,fd,{
//             headers: { 
//                 'x-auth': getToken
//             }
//         })
//             .then((response) => {
//                 console.log('[PROMISE-remove-friend]',response.data)
//                 const resData = response.data
//                 if(resData.hasOwnProperty('errors')){
//                     alert(resData.message)
//                 }
//                 else{
//                     dispatch(removeFriend(resData))
//                 }
//             })
//         }
// }