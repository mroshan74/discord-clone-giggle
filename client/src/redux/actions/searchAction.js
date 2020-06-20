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