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
        axios.post(`/user/sendrequest/${id}`,fd,{
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
        axios.post(`/user/cancelrequest/${id}`,fd,{
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