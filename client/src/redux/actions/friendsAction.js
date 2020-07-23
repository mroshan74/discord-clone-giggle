import axios from 'axios'
const getToken = localStorage.getItem('token')

//------------------get updated friends list
export const updateFriendList = (data) => {
    return { type: 'UPDATE_FRIEND_LIST', payload: data }
}

export const startGetFriendList = () => {
    return (dispatch) => {
        axios.get(`/users/friendList`,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-update-friend-list]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(updateFriendList(resData))
                }
            })
        }
}

//------------------ cancel request
export const cancelFriendReq = (data) => {
    return { type: 'FRIEND_CANCEL_REQUEST', payload: data }
}

export const startCancelFriendRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/users/friends/cancelRequest/${id}`,fd,{
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

//accept request
export const acceptFriendReq = (data) => {
    return { type: 'FRIEND_ACCEPT_REQUEST', payload: data }
}

export const startAcceptFriendRequest = (id,username,fd) => {
    return (dispatch) => {
        axios.post(`/users/friends/acceptRequest/${username}/${id}`,fd,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-accept-request]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(acceptFriendReq(resData))
                }
            })
        }
}


//reject request
export const rejectFriendReq = (data) => {
    return { type: 'FRIEND_REJECT_REQUEST', payload: data }
}

export const startRejectFriendRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/users/friends/rejectRequest/${id}`,fd,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-reject-request]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(rejectFriendReq(resData))
                }
            })
        }
}


//remove friend
export const friendRemove = (data) => {
    return { type: 'FRIEND_REMOVE', payload: data }
}

export const startFriendRemove = (id,fd) => {
    return (dispatch) => {
        axios.post(`/users/friends/removeFriend/${id}`,fd,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-remove-friend]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(friendRemove(resData))
                }
            })
        }
}