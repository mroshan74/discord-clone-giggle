import axios from 'axios'
const getToken = localStorage.getItem('token')

// -------------> get UserPosts 

export const setUserPosts = (data) => {
    return { type: 'SET_USER_POSTS', payload: data }
}

export const startGetUserPosts = () => {
    return(dispatch) => {
        axios.get('/users/getUserPosts',{
            headers: {
                'x-auth': getToken
            }})
            .then(response => {
                console.log('[PROMISE-UserPosts]',response.data)
                const getPosts = response.data
                dispatch(setUserPosts(getPosts))
            }).catch(err => console.log(err))
    }
}

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
        //---> addFriend post listener

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

//-------------updatePost

export const updatePost = (data) => {
    return { type: 'UPDATE_POST', payload: data }
}

export const startUpdatePost = (id,fd) => {
    return(dispatch) => {
        axios.put(`/users/posts/update/${id}`,fd,{
            headers: {
                'x-auth': getToken
            }
        })
            .then(response => {
                console.log('[PROMISE-postUpdate]',response.data)
                const updatedPost = response.data
                dispatch(updatePost(updatedPost))
            }).catch(err => console.log(err))
    }
}

//-------------deletePost

export const deletePost = (data) => {
    return { type: 'DELETE_POST', payload: data }
}

export const startDeletePost = (id) => {
    return(dispatch) => {
        axios.delete(`/users/posts/${id}`,{
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
        axios.put(`/users/posts/action/${action}/${id}`,fd,{
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