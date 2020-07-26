import axios from 'axios'
const getToken = localStorage.getItem('token')

// --------------> get latest public posts
        //---> addPublic post listener

export const addNewPublicPost = (data) => {
    return { type: 'ADD_NEW_PUBLIC_POST', payload: data }
}

export const setPublicPosts = (data) => {
    return { type: 'SET_PUBLIC_POSTS', payload: data }
}

export const startGetPublicPosts = (fd) => {
    return(dispatch) => {
        axios.get('/users/getLatestPublicPosts')
            .then(response => {
                console.log('[PROMISE-publicPosts]',response.data)
                const getPosts = response.data
                dispatch(setPublicPosts(getPosts))
            }).catch(err => console.log(err))
    }
}

// --------------> get latest friend posts
        //---> addPublic post listener

export const addNewFriendPost = (data) => {
    return { type: 'ADD_NEW_FRIEND_POST', payload: data }
}

export const setFriendPosts = (data) => {
    return { type: 'SET_FRIEND_POSTS', payload: data }
}

export const startGetFriendPosts = () => {
    return(dispatch) => {
        axios.get('/users/getLatestFriendPosts',{
            headers: {
                'x-auth': getToken
            }})
            .then(response => {
                console.log('[PROMISE-friendPosts]',response.data)
                const getPosts = response.data
                dispatch(setFriendPosts(getPosts))
            }).catch(err => console.log(err))
    }
}


// ---------------> create post
export const addNewPost = (data) => {
    return { type: 'ADD_NEW_POST', payload: data }
}

export const startCreateNewPost = (fd) => {
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

//-------------deletePost

export const deletePost = (data) => {
    return { type: 'DELETE_POST', payload: data }
}

export const startDeletePost = (id,type,fd) => {
    return(dispatch) => {
        axios.put(`/users/posts/${type}/${id}`,fd,{
            headers: {
                'x-auth': getToken
            }
        })
            .then(response => {
                console.log('[PROMISE-postDelete]',response.data)
                const retPost = response.data
                dispatch(deletePost(retPost))
            }).catch(err => console.log(err))
    }
}

//-------------------> post action // like dislike

export const updatePostActionReceived = (data) => {
    return { type: 'UPDATE_POST_ACTION_PUBLIC', payload: data }
}

export const startActionOnPost = (id,type,action,fd) => {
    return(dispatch) => {
        axios.put(`/users/posts/action/${type}/${action}/${id}`,fd,{
            headers: {
                'x-auth': getToken
            }
        })
            .then(response => {
                console.log('[PROMISE-postAction]',response.data)
                const retPost = response.data
                dispatch(updatePostActionReceived(retPost))
            }).catch(err => console.log(err))
    }
}