const initialPostsState = []

const postReducer = (state = initialPostsState, action) => {
    switch(action.type){
        case 'SET_PUBLIC_POSTS': {
            return state=action.payload
        }
        case 'ADD_NEW_PUBLIC_POST': {
            return [action.payload].concat(state)
        }
        case 'SET_FRIEND_POSTS': {
            return state.concat(action.payload).sort((a, b) => -a.createdAt.localeCompare(b.createdAt))
        }
        case 'ADD_NEW_FRIEND_POST': {
            return [action.payload].concat(state)
        }
        case 'UPDATE_POST_ACTION_PUBLIC': {
            return state.map(post => {
                if(post._id === action.payload._id){
                    return Object.assign({},post,action.payload)
                }else {
                    return Object.assign({},post)
                }
            })
        }
        default: {
            return [...state]
        }
    }
}

export default postReducer