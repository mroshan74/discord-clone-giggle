import axios from 'axios'
const getToken = localStorage.getItem('token')

export const addNewPost = (data) => {
    return { type: 'ADD_NEW_POST', payload: data }
}

export const startCreateNewPost = (fd,redirect) => {
    return(dispatch) => {
        axios.post('/users/posts/new',fd,{
            headers: {
                'x-auth': getToken
            }
        })
            .then(response => {
                console.log('[PROMISE-postNew]',response.data)
                const newPost = response.data
                dispatch(addNewPost(newPost))
            }).catch(err => console.log(err))
    }
}