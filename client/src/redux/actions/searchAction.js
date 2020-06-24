import axios from 'axios'
const getToken = localStorage.getItem('token')

export const setSearchResult = (data) => {
    return { type: 'SET_SEARCH_RESULT', payload: data}
}

export const startGetSearch = (fdata) => {
    return(dispatch) => {
        axios.post('/user/search',fdata,{
            headers: {
                'x-auth':getToken
            }
        })
            .then((response)=> {
                console.log('[PROMISE-search]',response.data)
                const getSearch = response.data
                if(getSearch.hasOwnProperty('errors')){
                    alert(`${getSearch.message}`)
                }else{
                    dispatch(setSearchResult(getSearch))
                }
            })
            .catch((err) => console.log(err))
    }
}

//-----------------sent request
export const sendReq = (data) => {
    return { type: 'SET_SENT_REQUEST', payload: data }
}

export const startSendRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/user/sendRequest/${id}`,fd,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-send-request]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(sendReq(resData))
                }
            })
        }
}

//------------------ cancel request
export const cancelReq = (data) => {
    return { type: 'SET_CANCEL_REQUEST', payload: data }
}

export const startCancelRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/user/cancelRequest/${id}`,fd,{
            headers: { 
                'x-auth': getToken
            }
        })
            .then((response) => {
                console.log('[PROMISE-cancel-request]',response.data)
                const resData = response.data
                if(resData.hasOwnProperty('errors')){
                    alert(resData.message)
                }
                else{
                    dispatch(cancelReq(resData))
                }
            })
        }
}

//accept request
export const acceptReq = (data) => {
    return { type: 'SET_ACCEPT_REQUEST', payload: data }
}

export const startAcceptRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/user/acceptRequest/${id}`,fd,{
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
                    dispatch(acceptReq(resData))
                }
            })
        }
}


//reject request
export const rejectReq = (data) => {
    return { type: 'SET_REJECT_REQUEST', payload: data }
}

export const startRejectRequest = (id,fd) => {
    return (dispatch) => {
        axios.post(`/user/rejectRequest/${id}`,fd,{
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
                    dispatch(rejectReq(resData))
                }
            })
        }
}


//remove friend
export const removeFriend = (data) => {
    return { type: 'SET_REMOVE_FRIEND', payload: data }
}

export const startRemoveFriend = (id,fd) => {
    return (dispatch) => {
        axios.post(`/user/removeFriend/${id}`,fd,{
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
                    dispatch(removeFriend(resData))
                }
            })
        }
}